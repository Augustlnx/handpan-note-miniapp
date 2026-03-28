/**
 * 音游主界面 (Rhythm Game Gameplay)
 * 
 * 核心功能：
 * 1. 流式谱面渲染（Canvas2D）- 使用CanvasNotationRenderer复刻notation绘制
 * 2. 手碟按键响应与音频播放
 * 3. 虚影提示动画（金色收缩提示）
 * 4. 判定系统（Miss/Good/Perfect）
 * 5. 计分机制与连击奖励
 * 6. 动态反馈特效（水波纹、飘字、粒子）
 * 7. 侧边菜单与功能模式
 */
const app = getApp();
const { webAudioManager } = require('../../../../utils/webAudioManager.js');
const { CanvasNotationRenderer, parseSimplifiedNote, FONT_SETTINGS, OCTAVE_SETTINGS } = require('../../../../utils/canvasRenderer.js');
const { parseNotationCode } = require('../../../../utils/notationParser.js');

// 判定窗口配置（毫秒）
const JUDGE_WINDOWS = {
  perfect: 50,   // ±50ms 内为 Perfect
  good: 120,     // ±120ms 内为 Good
  miss: 200      // 超过200ms 为 Miss
};

// 分数配置
const SCORE_CONFIG = {
  perfect: 300,
  good: 100,
  miss: 0,
  comboBonus: 10,      // 每个连击额外加分
  comboThreshold: 5    // 连击达到5次后开始加分
};

// 难度配置
const DIFFICULTY_CONFIG = {
  0: { showHint: true, hintDuration: 800, name: 'Level 0 - 提示模式' },
  1: { showHint: false, hintDuration: 0, name: 'Level 1 - 无提示模式' }
};

// 谱面渲染配置
const RENDER_CONFIG = {
  canvasWidth: 750,          // Canvas逻辑宽度(rpx)
  subdivisionWidth: 40,      // 固定每个音符列宽度(px)，不随细分数压缩
  beatWidth: 120,            // 默认每拍宽度(px)，实际会根据细分数动态调整
  cursorX: 100,              // 光标X位置（固定，px）- 左侧留出位置显示待敲击音符
  preloadMeasures: 8,        // 预加载小节数
  scrollSpeed: 1,            // 滚动速度基数
  leadInTime: 2000,          // 开始前预留时间(ms)
  hintPreloadCount: 3,       // 预加载提示音符数
  renderFps: 30,             // 谱面渲染帧率上限
  hintFps: 15,               // 虚影提示更新帧率上限（降低以减少setData）
  effectsFps: 20,            // 特效更新帧率上限（降低以减少setData）
  chunkCacheEnabled: true,   // 分块缓存开关
  chunkMeasures: 12,         // 每块小节数
  chunkCacheMax: 6,          // 缓存块数上限
  useImageScroll: true,      // 使用图片滚动模式（更流畅）
  imageChunkMeasures: 16,    // 每个图片块的小节数
  imagePreloadCount: 3       // 预加载图片数量
};

Page({
  data: {
    // 游戏状态
    gameState: 'ready', // 'ready', 'playing', 'paused', 'ended'
    isLoading: true,
    loadingProgress: 0,
    loadingStage: '',      // 加载阶段描述
    loadingDetail: '',     // 加载详细信息
    
    // 谱面数据
    sheetData: null,
    timeline: [],        // 时间线事件队列
    currentEventIndex: 0,
    
    // 播放控制
    bpm: 80,
    isPlaying: false,
    playStartTime: 0,
    currentTime: 0,
    totalDuration: 0,
    
    // 分数与连击
    score: 0,
    combo: 0,
    maxCombo: 0,
    perfectCount: 0,
    goodCount: 0,
    missCount: 0,
    
    // 手碟
    handpanNotes: [],
    residentButtons: [],
    handpanVolume: 80,
    displayMode: 'note',
    
    // 难度
    difficulty: 0,
    difficultyName: 'Level 0 - 提示模式',
    
    // Canvas相关
    canvasWidth: 750,
    canvasHeight: 200,
    scrollOffset: 0,
    
    // 光标位置（用于View层光标定位，单位px）
    cursorX: 60,
    cursorWidth: 30,
    
    // 虚影提示（当前需要显示的音符提示）
    activeHints: [], // [{noteId, spn, progress, startTime}]
    
    // 动态反馈
    feedbackEffects: [], // [{type, x, y, value, id}]
    rippleEffects: [],   // [{noteId, progress, color}]
    
    // 光标特效
    cursorGolden: false,
    cursorParticles: [],
    
    // 侧边菜单
    showSideMenu: false,
    
    // 循环练习模式
    loopMode: false,
    loopStart: null,
    loopEnd: null,
    loopStartLocked: false,
    showLoopSelector: false,
    
    // 自由定位模式
    freePositionMode: false,
    accompanimentMode: false,
    
    // 速度控制
    speedMultiplier: 1,
    
    // 节拍器
    metronomeEnabled: true,
    metronomeSoundEnabled: true,  // 节拍器声音开关
    currentBeat: -1,
    beatsPerMeasure: 4,
    
    // 拍子圆点显示
    beatDots: [],
    
    // 图片滚动模式
    useImageScroll: false,        // 是否启用图片滚动
    scoreImages: [],              // 预渲染的谱面图片 [{src, x, width}]
    scoreScrollX: 0,              // 当前滚动偏移量(px)
    imageContainerWidth: 0,       // 图片容器总宽度
    visibleImageIndices: [],      // 当前可见的图片索引
    prerenderCanvasWidth: 1920,   // 预渲染Canvas宽度
    
    // CSS动画虚影
    cssHints: []                  // CSS动画驱动的虚影 [{id, noteId, spn, animationDelay}]
  },

  // Canvas实例
  scoreCanvas: null,
  scoreCtx: null,
  
  // 动画相关
  rafId: null,
  lastFrameTime: 0,
  
  // 音频上下文时间基准
  audioStartTime: 0,
  
  // 批量更新机制：收集一帧内的所有setData更新，最后统一调用
  _pendingUpdates: null,
  
  /**
   * 收集待更新的数据（不立即调用setData）
   * @param {Object} updates - 要更新的数据对象
   */
  _collectUpdate(updates) {
    if (!this._pendingUpdates) {
      this._pendingUpdates = {};
    }
    Object.assign(this._pendingUpdates, updates);
  },
  
  /**
   * 刷新所有待更新的数据（统一调用setData）
   */
  _flushUpdates() {
    if (this._pendingUpdates && Object.keys(this._pendingUpdates).length > 0) {
      this.setData(this._pendingUpdates);
      this._pendingUpdates = null;
    }
  },

  onLoad(options) {
    wx.hideTabBar({ animation: false });
    
    // 获取游戏配置
    const sheetData = app.globalData?.rhythmGameSheet;
    if (!sheetData) {
      wx.showToast({ title: '未找到游戏数据', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    
    this.setData({
      sheetData,
      bpm: sheetData.tempo || 80,
      // 为每个音符添加 hints 和 ripples 数组，支持路径更新优化
      handpanNotes: (sheetData.handpanNotes || []).map(n => ({ ...n, hints: [], ripples: [] })),
      residentButtons: (sheetData.residentButtons || []).map(b => ({ ...b, hints: [], ripples: [] })),
      handpanVolume: sheetData.handpanVolume || 80,
      displayMode: sheetData.displayMode || 'note',
      beatsPerMeasure: sheetData.timeSignatureBeats || 4
    });
    
    console.log('[Gameplay] 加载数据:', {
      title: sheetData.title,
      notationsCount: sheetData.notations?.length || 0,
      handpanNotesCount: sheetData.handpanNotes?.length || 0,
      bpm: sheetData.tempo
    });
    
    // 初始化拍子圆点
    this.initBeatDots();
    
    // 初始化游戏
    this.initGame();
  },

  onReady() {
    // 初始化Canvas（会在initGame中等待完成）
    this.canvasReady = this.initCanvas();
  },

  onUnload() {
    // 清理资源
    this.stopGame();
    this.cleanupCachedImages();
    wx.showTabBar({ animation: false });
  },

  /**
   * 清理缓存的预渲染图片
   */
  cleanupCachedImages() {
    if (this._cachedImagePaths && this._cachedImagePaths.length > 0) {
      console.log(`[Gameplay] 清理 ${this._cachedImagePaths.length} 个缓存图片`);
      // 清理临时文件（可选，微信会自动清理）
      this._cachedImagePaths.forEach(path => {
        try {
          wx.getFileSystemManager().unlink({
            filePath: path,
            fail: () => {} // 忽略删除失败
          });
        } catch (e) {
          // 忽略错误
        }
      });
      this._cachedImagePaths = [];
    }
    
    // 清理布局缓存
    this._measureLayouts = null;
    this._totalScoreWidth = 0;
    this._totalSubdivisions = 0;
    this._totalBeats = 0;
    this._avgSubsPerBeat = 1;
    
    // 清理View层的图片数据
    this.setData({
      scoreImages: [],
      imageContainerWidth: 0
    });
  },

  /**
   * 初始化游戏
   */
  async initGame() {
    this.setData({ isLoading: true, loadingProgress: 0, loadingStage: '初始化', loadingDetail: '' });
    
    try {
      // 1. 初始化音频
      this.setData({ loadingProgress: 10, loadingStage: '加载音频' });
      await this.initAudio();
      
      // 2. 构建时间线
      this.setData({ loadingProgress: 20, loadingStage: '构建时间线' });
      this.buildTimeline();
      
      // 3. 获取谱面区域尺寸（无论是否使用图片滚动模式都需要）
      this.setData({ loadingProgress: 25, loadingStage: '准备画布' });
      await this.getScoreSectionSize();
      
      // 如果不是图片滚动模式，等待Canvas初始化完成
      if (!RENDER_CONFIG.useImageScroll) {
        const maxWait = 2000;
        const pollInterval = 50;
        let waited = 0;
        while (!this.canvasReady && waited < maxWait) {
          await new Promise(resolve => setTimeout(resolve, pollInterval));
          waited += pollInterval;
        }
        if (this.canvasReady) {
          await this.canvasReady;
          console.log('[Gameplay] Canvas初始化等待完成');
        } else {
          console.error('[Gameplay] Canvas初始化等待超时');
        }
      }
      
      // 4. 预计算谱面布局
      this.setData({ loadingProgress: 30, loadingStage: '计算布局' });
      this.precomputeLayout();
      
      // 5. 预渲染谱面图片（如果启用图片滚动模式）
      if (RENDER_CONFIG.useImageScroll) {
        this.setData({ loadingProgress: 35, loadingStage: '渲染谱面图片' });
        await this.preRenderScoreImages();
      }
      
      // 6. 完成
      this.setData({ 
        isLoading: false, 
        loadingProgress: 100,
        loadingStage: '完成',
        loadingDetail: '',
        gameState: 'ready'
      });
      
      console.log('[Gameplay] 初始化完成，Canvas状态:', !!this.scoreCanvas, '图片滚动模式:', this.data.useImageScroll);
      
      // 7. 初始化完成后渲染/定位谱面
      if (this.data.useImageScroll) {
        // 图片滚动模式：设置初始滚动位置
        this.updateImageScroll(0);
      } else {
        // Canvas模式：渲染谱面
        this.renderScore();
      }
      
    } catch (e) {
      console.error('[Gameplay] 初始化失败:', e);
      wx.showToast({ title: '初始化失败', icon: 'none' });
    }
  },

  /**
   * 初始化音频
   */
  async initAudio() {
    try {
      await webAudioManager.init();
      // 预加载节拍器音频
      await webAudioManager.preloadAllAudio(true);
      
      // 收集谱面中所需的手碟音符
      const notesNeeded = this.collectRequiredNotes();
      // 预加载手碟音频
      await webAudioManager.preloadHandpanAudio(notesNeeded);
    } catch (e) {
      console.warn('[Gameplay] 音频初始化警告:', e);
    }
  },

  /**
   * 收集谱面中所需的手碟音符
   */
  collectRequiredNotes() {
    const notesSet = new Set(['SLAP']); // 默认包含SLAP
    const sheet = this.data.sheetData;
    
    if (sheet && sheet.audioMappings) {
      for (const [key, value] of Object.entries(sheet.audioMappings)) {
        const spn = value[1];
        if (spn && spn !== '' && spn !== 'D_DYNAMIC') {
          notesSet.add(spn);
        }
      }
    }
    
    // 添加手碟上的所有音符
    if (sheet && sheet.handpanNotes) {
      for (const note of sheet.handpanNotes) {
        if (note.note) {
          notesSet.add(note.note);
        }
      }
    }
    
    // 添加常驻按钮音符
    if (sheet && sheet.residentButtons) {
      for (const btn of sheet.residentButtons) {
        if (btn.spn) {
          notesSet.add(btn.spn);
        }
      }
    }
    
    return Array.from(notesSet);
  },

  /**
   * 获取谱面区域尺寸（用于图片预渲染）
   */
  getScoreSectionSize() {
    return new Promise((resolve) => {
      const query = wx.createSelectorQuery().in(this);
      query.select('.score-section')
        .boundingClientRect((rect) => {
          if (rect) {
            const dpr = wx.getWindowInfo().pixelRatio || 2;
            this.canvasDpr = dpr;
            this.setData({
              canvasWidth: rect.width,
              canvasHeight: rect.height
            });
            console.log('[Gameplay] 谱面区域尺寸:', rect.width, 'x', rect.height);
          } else {
            // 降级使用默认值
            this.setData({
              canvasWidth: 375,
              canvasHeight: 120
            });
            console.warn('[Gameplay] 无法获取谱面区域尺寸，使用默认值');
          }
          resolve();
        })
        .exec();
    });
  },

  /**
   * 初始化Canvas（返回Promise）
   */
  initCanvas() {
    return new Promise((resolve, reject) => {
      const query = wx.createSelectorQuery().in(this);
      query.select('#score-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          if (res && res[0] && res[0].node) {
            const canvas = res[0].node;
            const ctx = canvas.getContext('2d');
            const dpr = wx.getWindowInfo().pixelRatio || 2;
            
            canvas.width = res[0].width * dpr;
            canvas.height = res[0].height * dpr;
            ctx.scale(dpr, dpr);
            
            this.scoreCanvas = canvas;
            this.scoreCtx = ctx;
            this.canvasDpr = dpr;
            
            // 计算光标位置 - 直接使用配置值（px）
            const cursorXPx = RENDER_CONFIG.cursorX;
            const cursorWidthPx = 25; // 光标宽度（px）
            
            this.setData({
              canvasWidth: res[0].width,
              canvasHeight: res[0].height,
              cursorX: cursorXPx,
              cursorWidth: cursorWidthPx
            });
            
            console.log('[Gameplay] Canvas初始化成功:', res[0].width, 'x', res[0].height, '光标位置:', cursorXPx);
            
            // 初始渲染
            this.renderScore();
            resolve(true);
          } else {
            console.error('[Gameplay] Canvas节点未找到');
            reject(new Error('Canvas节点未找到'));
          }
        });
    });
  },

  /**
   * 构建时间线 - 使用相对拍位存储，便于BPM变化时动态计算
   */
  buildTimeline() {
    let sheet = this.data.sheetData;
    
    // 如果没有notations但有code，则解析code生成notations
    if (sheet && !sheet.notations && sheet.code) {
      console.log('[Gameplay] 从code解析notations...');
      try {
        const parsedNotations = parseNotationCode(sheet.code);
        sheet = {
          ...sheet,
          notations: parsedNotations
        };
        // 更新data中的sheetData
        this.setData({ sheetData: sheet });
        console.log('[Gameplay] 解析完成，共', parsedNotations.length, '个模块');
      } catch (e) {
        console.error('[Gameplay] 解析code失败:', e);
      }
    }
    
    if (!sheet || !sheet.notations || sheet.notations.length === 0) {
      // 无有效数据时设置默认值
      console.warn('[Gameplay] 没有有效的谱面数据');
      this.setData({ timeline: [], totalDuration: 0, totalBeats: 0 });
      return;
    }
    
    const timeline = [];
    const beatsPerMeasure = this.data.beatsPerMeasure;
    
    // 使用相对拍位而非绝对时间
    let currentBeatPosition = 0; // 当前拍位置（以拍为单位）
    let columnIndex = 0;
    
    // leadInTime对应的拍数（会根据当前BPM动态转换）
    const leadInBeats = 2; // 预留2拍的时间
    
    for (const notation of sheet.notations) {
      if (!notation.measures) continue;
      
      for (let measureIndex = 0; measureIndex < notation.measures.length; measureIndex++) {
        const measure = notation.measures[measureIndex];
        if (!measure.beats) continue;
        
        for (let beatIndex = 0; beatIndex < measure.beats.length; beatIndex++) {
          const beat = measure.beats[beatIndex];
          if (!beat.subdivisions || beat.isPlaceholder) continue;
          
          const subdivisionsPerBeat = beat.subdivisions.length;
          const beatsPerSubdivision = 1 / subdivisionsPerBeat;
          
          for (let subIndex = 0; subIndex < beat.subdivisions.length; subIndex++) {
            const sub = beat.subdivisions[subIndex];
            const notes = [];
            
            // 收集该时间点的所有音符
            const rightHand = sub.rightHand || sub.right || [];
            const leftHand = sub.leftHand || sub.left || [];
            
            // 处理右手音符
            if (Array.isArray(rightHand)) {
              for (const note of rightHand) {
                if (note && note !== '-' && note !== '') {
                  notes.push({
                    note: note,
                    hand: 'right',
                    spn: this.getNoteSpn(note)
                  });
                }
              }
            } else if (rightHand && rightHand !== '-' && rightHand !== '') {
              notes.push({
                note: rightHand,
                hand: 'right',
                spn: this.getNoteSpn(rightHand)
              });
            }
            
            // 处理左手音符
            if (Array.isArray(leftHand)) {
              for (const note of leftHand) {
                if (note && note !== '-' && note !== '') {
                  notes.push({
                    note: note,
                    hand: 'left',
                    spn: this.getNoteSpn(note)
                  });
                }
              }
            } else if (leftHand && leftHand !== '-' && leftHand !== '') {
              notes.push({
                note: leftHand,
                hand: 'left',
                spn: this.getNoteSpn(leftHand)
              });
            }
            
            if (notes.length > 0) {
              timeline.push({
                beatPosition: leadInBeats + currentBeatPosition, // 相对拍位置（加上预留拍数）
                notes: notes,
                measureIndex,
                beatIndex,
                subIndex,
                columnIndex,
                judged: false,
                judgment: null
              });
            }
            
            currentBeatPosition += beatsPerSubdivision;
            columnIndex++;
          }
        }
      }
    }
    
    // 保存总拍数（不含leadIn），用于计算totalDuration
    const totalBeats = leadInBeats + currentBeatPosition;
    
    this.setData({
      timeline,
      totalBeats,
      leadInBeats
    });
    
    // 根据当前BPM计算总时长
    this.updateTotalDuration();
    
    console.log('[Gameplay] 时间线构建完成，共', timeline.length, '个事件，总拍数:', totalBeats);
    console.log('[Gameplay] 谱面数据:', sheet?.notations?.length || 0, '个模块');
    if (timeline.length > 0) {
      console.log('[Gameplay] 第一个事件拍位:', timeline[0].beatPosition);
    }
  },
  
  /**
   * 根据当前BPM更新总时长
   */
  updateTotalDuration() {
    const { totalBeats, bpm } = this.data;
    if (!totalBeats) return;
    
    const msPerBeat = 60000 / bpm;
    const totalDuration = totalBeats * msPerBeat;
    this.setData({ totalDuration });
  },
  
  /**
   * 将拍位置转换为当前BPM下的毫秒时间
   * 使用缓存的 msPerBeat 减少 this.data.bpm 访问开销
   */
  beatToMs(beatPosition) {
    // 缓存 msPerBeat 直到 BPM 变化
    if (!this._msPerBeat || this._cachedBpm !== this.data.bpm) {
      this._cachedBpm = this.data.bpm;
      this._msPerBeat = 60000 / this._cachedBpm;
    }
    return beatPosition * this._msPerBeat;
  },
  
  /**
   * 将毫秒时间转换为拍位置
   * 使用缓存的 msPerBeat 减少 this.data.bpm 访问开销
   */
  msToBeat(ms) {
    if (!this._msPerBeat || this._cachedBpm !== this.data.bpm) {
      this._cachedBpm = this.data.bpm;
      this._msPerBeat = 60000 / this._cachedBpm;
    }
    return ms / this._msPerBeat;
  },
  
  /**
   * 获取当前播放时间（兼容图片滚动模式）
   * 图片滚动模式下使用内部变量，避免频繁setData
   */
  getCurrentPlayTime() {
    if (this.data.useImageScroll && this._currentTime !== undefined) {
      return this._currentTime;
    }
    return this.data.currentTime || 0;
  },
  
  /**
   * 在时间线中找到第一个拍位 >= 目标拍位的事件索引
   */
  findFirstEventIndexAtOrAfter(beatPosition) {
    const { timeline } = this.data;
    let left = 0;
    let right = timeline.length - 1;
    let result = timeline.length;
    
    while (left <= right) {
      const mid = (left + right) >> 1;
      if (timeline[mid].beatPosition >= beatPosition) {
        result = mid;
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    
    return result;
  },

  /**
   * 获取当前BPM下的leadInTime（毫秒）
   */
  getLeadInTimeMs() {
    const leadInBeats = this.data.leadInBeats || 2;
    return this.beatToMs(leadInBeats);
  },

  // 特殊字符映射配置
  // 这些字符在谱面中表示特殊技法，需要映射到常驻按钮
  SPECIAL_NOTE_MAPPINGS: {
    's': 'SLAP',      // 闷音 -> SLAP按钮
    'T': 'T',         // T技法 -> T按钮
    'd': 'd',         // d技法 -> d按钮  
    'P': 'P',         // P技法 -> P按钮
    'x': 'x',         // x技法 -> x按钮
    'F': 'x',         // F音 -> 映射到x
    '·': 'x',         // 中圆点 -> 映射到x
    'D': 'D_CENTER'   // 中央D音，特殊标记
  },

  /**
   * 获取音符对应的SPN（用于时间线构建和判定）
   * 特殊字符返回其标识符（如 's' -> 'SLAP'），用于匹配常驻按钮
   */
  getNoteSpn(note) {
    const sheet = this.data.sheetData;
    
    // 提取基础音符
    let baseNote = note.replace(/\^\{[^}]*\}/g, '').replace(/[',_*]/g, '');
    
    // 检查是否是特殊字符
    const specialMapping = this.SPECIAL_NOTE_MAPPINGS[baseNote];
    if (specialMapping) {
      // 中央D音需要动态计算
      if (specialMapping === 'D_CENTER') {
        return this._calculateDynamicDSpn();
      }
      return specialMapping;
    }
    
    // 从audioMappings获取常规音符的SPN
    if (!sheet || !sheet.audioMappings) return '';
    const mapping = sheet.audioMappings[baseNote];
    return mapping ? mapping[1] : '';
  },

  /**
   * 动态计算中央D音的SPN（按简谱的"6,"低音6处理）
   */
  _calculateDynamicDSpn() {
    const sheet = this.data.sheetData;
    // 使用谱面的首调设置，默认F3
    const rootNote = sheet?.conversionRootNote || 'F3';
    const rootMatch = rootNote.match(/^([A-G][#b]?)(\d)$/);
    if (!rootMatch) return 'D3'; // 默认返回D3
    
    const rootPitch = rootMatch[1];
    const rootOctave = parseInt(rootMatch[2]);
    
    // SPN音符到半音的映射
    const noteToSemitone = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    
    // 半音到SPN音符的映射
    const semitoneToNote = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    // 6, = 低音6 = 首调根音 + 9半音 - 12半音（低一个八度）
    const rootSemitone = noteToSemitone[rootPitch];
    if (rootSemitone === undefined) return 'D3';
    
    let targetSemitone = rootSemitone + 9; // 6对应9个半音
    let targetOctave = rootOctave - 1;      // 低一个八度
    
    // 处理跨八度
    while (targetSemitone >= 12) {
      targetSemitone -= 12;
      targetOctave++;
    }
    while (targetSemitone < 0) {
      targetSemitone += 12;
      targetOctave--;
    }
    
    return semitoneToNote[targetSemitone] + targetOctave;
  },

  /**
   * 预计算谱面布局（固定subdivision宽度）
   * 遍历所有小节，计算每个小节的真实宽度和起始位置
   * 同时构建 beatPosition -> pixelX 的精确映射表
   */
  precomputeLayout() {
    const sheet = this.data.sheetData;
    if (!sheet || !sheet.notations) {
      console.warn('[Gameplay] 无谱面数据，跳过布局预计算');
      return;
    }
    
    const subdivisionWidth = RENDER_CONFIG.subdivisionWidth || 40;
    const notations = sheet.notations || [];
    
    // 展平所有小节并计算布局
    const measureLayouts = [];
    let currentX = 0;
    let totalSubdivisions = 0;
    let totalBeats = 0;
    
    // 构建 beatPosition -> pixelX 精确映射表
    // 每个条目记录：{ beatStart, pixelStart, beatLength, pixelWidth }
    const beatPixelMap = [];
    let currentBeatPosition = 0;
    
    for (const notation of notations) {
      const measures = notation.measures || [];
      for (const measure of measures) {
        const beats = (measure.beats || []).filter(b => !b.isPlaceholder);
        let measureSubCount = 0;
        let measureStartX = currentX;
        
        // 遍历每个拍的每个细分，建立精确映射
        for (const beat of beats) {
          const subs = beat.subdivisions || [];
          const subsCount = subs.length || 1;
          const beatsPerSub = 1 / subsCount; // 每个细分占的拍数
          
          for (let sIdx = 0; sIdx < subsCount; sIdx++) {
            beatPixelMap.push({
              beatStart: currentBeatPosition,
              pixelStart: currentX,
              beatLength: beatsPerSub,
              pixelWidth: subdivisionWidth
            });
            currentBeatPosition += beatsPerSub;
            currentX += subdivisionWidth;
          }
          
          measureSubCount += subsCount;
        }
        
        const measureWidth = measureSubCount * subdivisionWidth;
        
        measureLayouts.push({
          x: measureStartX,
          width: measureWidth,
          subdivisionCount: measureSubCount,
          beatCount: beats.length,
          beats: beats.map(beat => {
            const subs = beat.subdivisions || [];
            return {
              subdivisionCount: subs.length || 1,
              subdivisions: subs
            };
          })
        });
        
        totalSubdivisions += measureSubCount;
        totalBeats += beats.length;
      }
    }
    
    // 计算平均每拍细分数（仅用于粗略估计）
    const avgSubsPerBeat = totalBeats > 0 ? totalSubdivisions / totalBeats : 1;
    
    // 保存布局信息
    this._measureLayouts = measureLayouts;
    this._totalScoreWidth = currentX;
    this._totalSubdivisions = totalSubdivisions;
    this._totalBeats = totalBeats;
    this._avgSubsPerBeat = avgSubsPerBeat;
    this._beatPixelMap = beatPixelMap;  // 精确映射表
    this._totalBeatLength = currentBeatPosition; // 总拍数（不含leadIn）
    
    console.log(`[Gameplay] 布局预计算完成: ${measureLayouts.length}小节, ${totalBeats}拍, ${beatPixelMap.length}个细分映射, 总宽度${currentX}px`);
  },

  /**
   * 根据拍位置（不含leadIn）快速查找对应的像素位置
   * 使用二分搜索 + 线性插值
   */
  beatToPixelX(beatPosition) {
    const map = this._beatPixelMap;
    if (!map || map.length === 0) return 0;
    
    // 处理边界情况
    if (beatPosition <= 0) return 0;
    if (beatPosition >= this._totalBeatLength) {
      return this._totalScoreWidth;
    }
    
    // 二分搜索找到包含该拍位的细分
    let left = 0;
    let right = map.length - 1;
    let idx = 0;
    
    while (left <= right) {
      const mid = (left + right) >> 1;
      if (map[mid].beatStart <= beatPosition) {
        idx = mid;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }
    
    const segment = map[idx];
    // 在该细分内进行线性插值
    const beatOffset = beatPosition - segment.beatStart;
    const ratio = beatOffset / segment.beatLength;
    return segment.pixelStart + ratio * segment.pixelWidth;
  },

  /**
   * 预渲染谱面图片（图片滚动模式）
   * 将整个谱面分块渲染为图片，完全预加载后才返回
   */
  async preRenderScoreImages() {
    if (!RENDER_CONFIG.useImageScroll) {
      console.log('[Gameplay] 图片滚动模式未启用');
      return;
    }
    
    console.log('[Gameplay] 开始预渲染谱面图片...');
    
    const sheet = this.data.sheetData;
    if (!sheet || !sheet.notations) {
      console.warn('[Gameplay] 无谱面数据，跳过预渲染');
      this.setData({ useImageScroll: false });
      return;
    }
    
    // 确保布局已预计算
    if (!this._measureLayouts || this._measureLayouts.length === 0) {
      console.warn('[Gameplay] 布局未预计算，跳过预渲染');
      this.setData({ useImageScroll: false });
      return;
    }
    
    const measureLayouts = this._measureLayouts;
    const totalMeasures = measureLayouts.length;
    const totalWidth = this._totalScoreWidth + RENDER_CONFIG.cursorX * 2;
    const chunkMeasures = RENDER_CONFIG.imageChunkMeasures || 16;
    const canvasHeight = this.data.canvasHeight || 120;
    const dpr = this.canvasDpr || 2;
    const chunkCount = Math.ceil(totalMeasures / chunkMeasures);
    
    this.setData({ 
      loadingDetail: `共 ${chunkCount} 个图片块待渲染`
    });
    
    // 计算最大的chunk宽度（用于设置Canvas尺寸）
    let maxChunkWidth = 0;
    for (let i = 0; i < chunkCount; i++) {
      const startM = i * chunkMeasures;
      const endM = Math.min(startM + chunkMeasures, totalMeasures);
      const startX = measureLayouts[startM].x;
      const endX = measureLayouts[endM - 1].x + measureLayouts[endM - 1].width;
      maxChunkWidth = Math.max(maxChunkWidth, endX - startX);
    }
    
    console.log(`[Gameplay] 总小节: ${totalMeasures}, 分块数: ${chunkCount}, 最大块宽度: ${maxChunkWidth}px`);
    
    // 设置预渲染Canvas宽度（使用最大块宽度）
    this.setData({ prerenderCanvasWidth: maxChunkWidth + 50 });
    
    // 等待Canvas渲染完成
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // 初始化预渲染Canvas
    const prerenderCanvas = await this.initPrerenderCanvas(maxChunkWidth + 50, canvasHeight);
    if (!prerenderCanvas) {
      console.error('[Gameplay] 预渲染Canvas初始化失败，降级为传统模式');
      this.setData({ useImageScroll: false });
      return;
    }
    
    const scoreImages = [];
    // 基础进度为35%，渲染图片占35-90%的进度（共55%）
    const progressStart = 35;
    const progressEnd = 90;
    const progressPerChunk = (progressEnd - progressStart) / chunkCount;
    
    try {
      for (let chunkIdx = 0; chunkIdx < chunkCount; chunkIdx++) {
        const startMeasure = chunkIdx * chunkMeasures;
        const endMeasure = Math.min(startMeasure + chunkMeasures, totalMeasures);
        
        // 更新进度
        const currentProgress = Math.round(progressStart + chunkIdx * progressPerChunk);
        this.setData({ 
          loadingProgress: currentProgress,
          loadingDetail: `渲染图片块 ${chunkIdx + 1}/${chunkCount}`
        });
        
        // 让出主线程，避免长时间阻塞导致界面无响应
        await new Promise(resolve => setTimeout(resolve, 10));
        
        // 使用预计算的布局信息获取正确的位置和宽度
        const chunkX = measureLayouts[startMeasure].x;
        const endLayout = measureLayouts[endMeasure - 1];
        const actualChunkWidth = (endLayout.x + endLayout.width) - chunkX;
        
        // 清空canvas
        prerenderCanvas.ctx.clearRect(0, 0, maxChunkWidth + 50, canvasHeight);
        
        // 渲染该块的谱面内容
        this.renderChunkToCanvas(prerenderCanvas.ctx, startMeasure, endMeasure, 0, actualChunkWidth + 10);
        
        // 导出为临时文件
        const tempPath = await new Promise((resolve, reject) => {
          wx.canvasToTempFilePath({
            canvas: prerenderCanvas.canvas,
            x: 0,
            y: 0,
            width: Math.ceil(actualChunkWidth * dpr),
            height: Math.ceil(canvasHeight * dpr),
            destWidth: Math.ceil(actualChunkWidth),
            destHeight: Math.ceil(canvasHeight),
            fileType: 'png',
            success: (res) => {
              resolve(res.tempFilePath);
            },
            fail: (err) => {
              console.error(`[Gameplay] 图片块 ${chunkIdx + 1} 导出失败:`, err);
              reject(err);
            }
          });
        });
        
        scoreImages.push({
          src: tempPath,
          x: chunkX,
          width: actualChunkWidth,
          startMeasure,
          endMeasure
        });
        
        console.log(`[Gameplay] 图片块 ${chunkIdx + 1}/${chunkCount} 渲染完成`);
      }
      
      if (scoreImages.length > 0) {
        // 更新进度：图片已生成，开始预加载到内存
        this.setData({ 
          loadingProgress: 92,
          loadingDetail: '加载图片到内存...'
        });
        
        // 先设置图片数据，让 View 层开始加载图片
        this.setData({
          useImageScroll: true,
          scoreImages,
          imageContainerWidth: totalWidth
        });
        
        // 保存临时文件路径用于清理
        this._cachedImagePaths = scoreImages.map(img => img.src);
        
        // 等待图片加载完成（给 View 层足够时间加载图片）
        this.setData({ 
          loadingProgress: 95,
          loadingDetail: '等待图片加载完成...'
        });
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 预加载所有图片到内存（使用 wx.getImageInfo 确保图片已缓存）
        const preloadPromises = scoreImages.map((img, idx) => {
          return new Promise((resolve) => {
            wx.getImageInfo({
              src: img.src,
              success: () => resolve(true),
              fail: () => {
                console.warn(`[Gameplay] 图片 ${idx + 1} 预加载失败`);
                resolve(false);
              }
            });
          });
        });
        
        await Promise.all(preloadPromises);
        
        this.setData({ 
          loadingProgress: 98,
          loadingDetail: '准备完成'
        });
        
        console.log(`[Gameplay] 预渲染完成，共 ${scoreImages.length} 个图片块已加载到内存`);
      } else {
        console.warn('[Gameplay] 没有生成图片，降级为Canvas模式');
        this.setData({ useImageScroll: false });
      }
      
    } catch (err) {
      console.error('[Gameplay] 图片预渲染失败，降级为Canvas模式:', err);
      this.setData({ useImageScroll: false });
    }
  },

  /**
   * 初始化预渲染Canvas（带重试）
   */
  async initPrerenderCanvas(width, height) {
    const maxRetries = 5;
    const retryDelay = 100;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const result = await new Promise((resolve) => {
        const query = wx.createSelectorQuery().in(this);
        query.select('#prerender-canvas')
          .fields({ node: true, size: true })
          .exec((res) => {
            if (res && res[0] && res[0].node) {
              const canvas = res[0].node;
              const ctx = canvas.getContext('2d');
              const dpr = this.canvasDpr || 2;
              
              canvas.width = width * dpr;
              canvas.height = height * dpr;
              ctx.scale(dpr, dpr);
              
              console.log('[Gameplay] 预渲染Canvas初始化成功:', width, 'x', height);
              resolve({ canvas, ctx });
            } else {
              resolve(null);
            }
          });
      });
      
      if (result) {
        return result;
      }
      
      console.log(`[Gameplay] 预渲染Canvas未找到，重试 ${attempt + 1}/${maxRetries}...`);
      await new Promise(r => setTimeout(r, retryDelay));
    }
    
    console.error('[Gameplay] 预渲染Canvas节点未找到（已重试多次）');
    return null;
  },

  /**
   * 渲染指定小节范围到Canvas（用于图片块预渲染）
   * 使用固定的subdivision宽度，基于预计算的布局信息
   */
  renderChunkToCanvas(ctx, startMeasure, endMeasure, offsetX, canvasWidth) {
    const sheet = this.data.sheetData;
    if (!sheet || !sheet.notations) return;
    
    const subdivisionWidth = RENDER_CONFIG.subdivisionWidth || 40;
    const canvasHeight = this.data.canvasHeight || 120;
    const measureLayouts = this._measureLayouts || [];
    
    // 颜色配置（白底配色方案，与页面主题一致）
    const colors = {
      background: '#ffffff',
      barLine: '#314D63',
      beatLine: 'rgba(49, 77, 99, 0.3)',
      subdivisionLine: 'rgba(49, 77, 99, 0.15)',
      handDivider: 'rgba(49, 77, 99, 0.12)',
      measureNumber: 'rgba(49, 77, 99, 0.5)',
      rightHand: '#C4963A',   // 深金色
      leftHand: '#314D63',     // 深蓝色
      playedNote: 'rgba(150, 150, 150, 0.5)',
      slapColor: '#ff6b6b'
    };
    
    // 绘制背景
    ctx.fillStyle = colors.background;
    ctx.fillRect(offsetX, 0, canvasWidth, canvasHeight);
    
    // 中轴线位置
    const baseY = canvasHeight / 2;
    
    // 4轨道Y位置（从上到下）
    const slotHeight = canvasHeight * 0.18;
    const slotGap = canvasHeight * 0.03;
    const innerOffset = canvasHeight * 0.02;
    
    const trackPositions = [
      baseY - slotHeight - slotGap - slotHeight / 2,  // Slot 0: 右手外侧
      baseY - slotHeight / 2 - innerOffset,            // Slot 1: 右手内侧
      baseY + slotHeight / 2 + innerOffset,            // Slot 2: 左手内侧
      baseY + slotHeight + slotGap + slotHeight / 2   // Slot 3: 左手外侧
    ];
    
    // 展平所有小节
    const allMeasures = [];
    const notations = sheet.notations || [];
    for (const notation of notations) {
      const measures = notation.measures || [];
      for (const measure of measures) {
        allMeasures.push(measure);
      }
    }
    
    // 计算起始X偏移（相对于chunk内部）
    let currentX = offsetX;
    
    for (let mIndex = startMeasure; mIndex < endMeasure && mIndex < allMeasures.length; mIndex++) {
      const measure = allMeasures[mIndex];
      const beats = measure.beats || [];
      const layout = measureLayouts[mIndex];
      const measureWidth = layout ? layout.width : subdivisionWidth * 4;
      
      // 中轴线
      ctx.fillStyle = colors.handDivider;
      ctx.fillRect(currentX, baseY - 0.5, measureWidth, 1);
      
      // 小节线
      ctx.fillStyle = colors.barLine;
      ctx.fillRect(currentX, 0, 2, canvasHeight);
      
      // 小节号
      ctx.fillStyle = colors.measureNumber;
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${mIndex + 1}`, currentX + 4, 12);
      
      // 绘制拍子和音符（使用固定subdivision宽度）
      let subXOffset = 0;
      for (let bIndex = 0; bIndex < beats.length; bIndex++) {
        const beat = beats[bIndex];
        if (beat.isPlaceholder) continue;
        
        const subdivisions = beat.subdivisions || [];
        const beatSubCount = subdivisions.length || 1;
        const beatWidth = beatSubCount * subdivisionWidth;
        const beatX = currentX + subXOffset;
        
        // 拍线（非第一拍）
        if (subXOffset > 0) {
          ctx.fillStyle = colors.beatLine;
          ctx.fillRect(beatX, 0, 1, canvasHeight);
        }
        
        for (let sIndex = 0; sIndex < subdivisions.length; sIndex++) {
          const sub = subdivisions[sIndex];
          const subX = beatX + sIndex * subdivisionWidth;
          const subCenterX = subX + subdivisionWidth / 2;
          
          // 细分线
          if (sIndex > 0) {
            ctx.fillStyle = colors.subdivisionLine;
            const lineHeight = canvasHeight * 0.6;
            const lineY = (canvasHeight - lineHeight) / 2;
            ctx.fillRect(subX, lineY, 1, lineHeight);
          }
          
          // 右手音符
          const rightHand = sub.rightHand || sub.right || [];
          const rightNotes = Array.isArray(rightHand) ? rightHand : (rightHand ? [rightHand] : []);
          
          rightNotes.forEach((noteItem, nIndex) => {
            const note = typeof noteItem === 'object' ? (noteItem.note || noteItem.value || '') : noteItem;
            if (note && note !== '-' && note !== '') {
              const slotIndex = rightNotes.length === 1 ? 1 : nIndex;
              const noteY = trackPositions[slotIndex];
              this.drawNote(ctx, subCenterX, noteY, note, 'right', false, colors);
            }
          });
          
          // 左手音符
          const leftHand = sub.leftHand || sub.left || [];
          const leftNotes = Array.isArray(leftHand) ? leftHand : (leftHand ? [leftHand] : []);
          
          leftNotes.forEach((noteItem, nIndex) => {
            const note = typeof noteItem === 'object' ? (noteItem.note || noteItem.value || '') : noteItem;
            if (note && note !== '-' && note !== '') {
              const slotIndex = leftNotes.length === 1 ? 2 : (2 + nIndex);
              const noteY = trackPositions[slotIndex];
              this.drawNote(ctx, subCenterX, noteY, note, 'left', false, colors);
            }
          });
        }
        
        subXOffset += beatWidth;
      }
      
      currentX += measureWidth;
    }
    
    // 结束线
    ctx.fillStyle = colors.barLine;
    ctx.fillRect(currentX, 0, 2, canvasHeight);
  },

  /**
   * 开始游戏
   */
  startGame() {
    if (this.data.gameState === 'playing') return;
    
    this.setData({
      gameState: 'playing',
      isPlaying: true,
      playStartTime: Date.now(),
      currentEventIndex: 0,
      score: 0,
      combo: 0,
      perfectCount: 0,
      goodCount: 0,
      missCount: 0
    });
    
    // 重置时间线判定状态
    const timeline = this.data.timeline.map(event => ({
      ...event,
      judged: false,
      judgment: null
    }));
    this.setData({ timeline });
    
    // 开始游戏循环
    this.startGameLoop();
  },

  /**
   * 暂停游戏
   */
  pauseGame() {
    // 暂停时同步 currentTime 到 data，确保进度条显示准确
    // 同时保留 activeHints，让虚影光圈停留在当前位置
    const currentTime = this.getCurrentPlayTime();
    this.setData({
      gameState: 'paused',
      isPlaying: false,
      currentTime: currentTime  // 确保 data.currentTime 与 _currentTime 同步
    });
    this.stopGameLoop();
  },

  /**
   * 继续游戏
   */
  resumeGame() {
    if (this.data.gameState !== 'paused') return;
    
    const currentTime = this.getCurrentPlayTime();
    const speedMultiplier = this.data.speedMultiplier || 1;
    
    // 正确计算 playStartTime，考虑 speedMultiplier
    // 因为 currentTime = (now - playStartTime) * speedMultiplier
    // 所以 playStartTime = now - currentTime / speedMultiplier
    this.setData({
      gameState: 'playing',
      isPlaying: true,
      playStartTime: Date.now() - currentTime / speedMultiplier
    });
    
    this.startGameLoop();
  },

  /**
   * 停止游戏
   */
  stopGame() {
    this.stopGameLoop();
    this.setData({
      gameState: 'ended',
      isPlaying: false
    });
  },

  /**
   * 开始游戏循环
   */
  startGameLoop() {
    const canvas = this.scoreCanvas;
    
    console.log('[Gameplay] startGameLoop被调用');
    console.log('[Gameplay] Canvas状态:', !!canvas, canvas);
    console.log('[Gameplay] 时间线长度:', this.data.timeline?.length || 0);
    console.log('[Gameplay] 手碟音符数:', this.data.handpanNotes?.length || 0);
    
    // 缓存常用数据到实例变量，避免每帧访问 this.data
    this._timeline = this.data.timeline;
    this._buildSpnToIdMap();
    
    // 使用canvas.requestAnimationFrame或fallback到setTimeout递归
    const useCanvasRAF = canvas && typeof canvas.requestAnimationFrame === 'function';
    
    if (!canvas) {
      console.warn('[Gameplay] Canvas未初始化，使用setTimeout作为fallback');
    }
    
    // 目标帧率（图片滚动模式可以降低帧率）
    const targetFps = this.data.useImageScroll ? 30 : 60;
    const frameInterval = 1000 / targetFps;
    
    const gameLoop = () => {
      if (!this.data.isPlaying) {
        // 停止循环
        if (this.gameLoopTimer) {
          clearTimeout(this.gameLoopTimer);
          this.gameLoopTimer = null;
        }
        return;
      }
      
      const now = Date.now();
      const speedMultiplier = this.data.speedMultiplier || 1;
      const elapsedTime = (now - this.data.playStartTime) * speedMultiplier;
      const currentTime = elapsedTime;
      
      // 图片滚动模式：只更新滚动位置，不更新currentTime到View层
      if (this.data.useImageScroll) {
        // 内部记录currentTime，不通过setData
        this._currentTime = currentTime;
        
        // 进度条低频更新（每500ms更新一次显示时间）
        if (!this._lastProgressUpdate || now - this._lastProgressUpdate >= 500) {
          this._lastProgressUpdate = now;
          this._collectUpdate({ currentTime: Math.floor(currentTime) });
        }
      } else {
        this._collectUpdate({ currentTime });
      }
      
      // 检查循环模式
      if (this.checkLoopMode(currentTime)) {
        // 循环了，继续下一帧
        if (useCanvasRAF) {
          this.rafId = canvas.requestAnimationFrame(gameLoop);
        }
        return;
      }
      
      // 更新提示动画（限频）
      const hintInterval = 1000 / (RENDER_CONFIG.hintFps || 30);
      if (!this._lastHintUpdate || now - this._lastHintUpdate >= hintInterval) {
        this.updateHints(currentTime);
        this._lastHintUpdate = now;
      }
      
      // 伴奏模式下不进行判定（循环练习回放时）
      if (!this.data.accompanimentMode) {
        // 检查超时Miss
        this.checkMissedNotes(currentTime);
      }
      
      // 播放节拍器
      if (this.data.metronomeEnabled) {
        this.checkMetronomeBeat(currentTime);
      }
      
      // 更新特效（限频）
      const effectsInterval = 1000 / (RENDER_CONFIG.effectsFps || 30);
      if (!this._lastEffectsUpdate || now - this._lastEffectsUpdate >= effectsInterval) {
        this.updateEffects();
        this._lastEffectsUpdate = now;
      }
      
      // 渲染谱面（限频）
      const renderInterval = 1000 / (RENDER_CONFIG.renderFps || 30);
      if (!this._lastRenderUpdate || now - this._lastRenderUpdate >= renderInterval) {
        if (this.data.useImageScroll) {
          // 图片滚动模式：更新滚动位置
          this.updateImageScroll(currentTime);
        } else {
          // Canvas模式：重新渲染
          this.renderScore();
        }
        this._lastRenderUpdate = now;
      }
      
      // 检查游戏结束（非循环模式）
      // 使用动态计算的leadInTime确保与timeline一致
      const leadInTimeMs = this.getLeadInTimeMs();
      const hasValidDuration = this.data.totalDuration > leadInTimeMs;
      const hasStarted = currentTime > leadInTimeMs;
      if (!this.data.loopMode && hasValidDuration && hasStarted && currentTime >= this.data.totalDuration) {
        this._flushUpdates();  // 结束前刷新所有待更新数据
        this.endGame();
        return;
      }
      
      // 统一刷新本帧所有待更新数据（减少setData调用次数）
      this._flushUpdates();
      
      // 继续下一帧
      if (useCanvasRAF) {
        this.rafId = canvas.requestAnimationFrame(gameLoop);
      } else {
        // 使用 setTimeout 递归，更可控的帧率
        this.gameLoopTimer = setTimeout(gameLoop, frameInterval);
      }
    };
    
    // 启动游戏循环
    if (useCanvasRAF) {
      console.log('[Gameplay] 使用Canvas requestAnimationFrame');
      this.rafId = canvas.requestAnimationFrame(gameLoop);
    } else {
      // Fallback: 使用setTimeout递归，控制帧率
      console.log(`[Gameplay] 使用setTimeout fallback (${frameInterval}ms, ${targetFps}fps)`);
      this.gameLoopTimer = setTimeout(gameLoop, frameInterval);
    }
  },

  /**
   * 检查并播放节拍器
   */
  checkMetronomeBeat(currentTime) {
    const { bpm, beatsPerMeasure, currentBeat } = this.data;
    const msPerBeat = 60000 / bpm;
    
    // 使用动态计算的leadInTime
    const leadInTimeMs = this.getLeadInTimeMs();
    const beatIndex = Math.floor((currentTime - leadInTimeMs) / msPerBeat);
    
    if (beatIndex !== currentBeat && beatIndex >= 0) {
      // 更新拍子圆点显示
      const beatInMeasure = beatIndex % beatsPerMeasure;
      const dots = [];
      for (let i = 0; i < beatsPerMeasure; i++) {
        dots.push({ active: i === beatInMeasure, strong: i === 0 });
      }
      
      // 使用批量更新机制
      this._collectUpdate({ 
        currentBeat: beatIndex,
        beatDots: dots 
      });
      
      // 播放节拍器声音（每小节第一拍重音）
      const isFirstBeat = beatIndex % beatsPerMeasure === 0;
      this.playMetronomeTick(isFirstBeat);
    }
  },

  /**
   * 播放节拍器声音（使用metronome的click1/click3）
   */
  playMetronomeTick(isAccent) {
    // 如果节拍器声音关闭，只显示动效不播放声音
    if (!this.data.metronomeSoundEnabled) {
      return;
    }
    
    try {
      // 使用metronome的默认节拍器声音
      if (isAccent) {
        webAudioManager.play('click1');  // 重拍
      } else {
        webAudioManager.play('click3');  // 普通拍
      }
    } catch (e) {
      console.warn('[Gameplay] 节拍器播放失败:', e);
    }
  },

  /**
   * 切换节拍器声音开关
   */
  onToggleMetronomeSound() {
    this.setData({
      metronomeSoundEnabled: !this.data.metronomeSoundEnabled
    });
    wx.showToast({
      title: this.data.metronomeSoundEnabled ? '节拍器已开启' : '节拍器已静音',
      icon: 'none',
      duration: 1000
    });
  },

  /**
   * 停止游戏循环
   */
  stopGameLoop() {
    // 清理Canvas RAF
    if (this.rafId && this.scoreCanvas) {
      try {
        this.scoreCanvas.cancelAnimationFrame(this.rafId);
      } catch (e) {
        // 忽略取消错误
      }
      this.rafId = null;
    }
    
    // 清理setTimeout fallback
    if (this.gameLoopTimer) {
      clearTimeout(this.gameLoopTimer);
      this.gameLoopTimer = null;
    }
    
    // 清理所有缓存
    this._timeline = null;
    this._spnToIdMap = null;
    this._prevHintsMap = null;
    this._lastProgressUpdate = null;
    this._msPerBeat = null;
    this._cachedBpm = null;
  },

  /**
   * 构建SPN到音符ID的映射表（用于快速查找）
   * 包括手碟音符、常驻按钮和特殊字符的映射
   */
  _buildSpnToIdMap() {
    const { handpanNotes, residentButtons } = this.data;
    this._spnToIdMap = new Map();
    
    // 添加手碟音符
    for (const note of handpanNotes) {
      if (note.note) {
        this._spnToIdMap.set(note.note, note.id);
      }
    }
    
    // 添加常驻按钮（按spn和label两种方式映射）
    for (const btn of residentButtons) {
      if (btn.spn) {
        this._spnToIdMap.set(btn.spn, btn.id);
      }
      // 对于特殊字符按钮，也按label建立映射（如 'T' -> btn_T）
      if (btn.label && this.SPECIAL_NOTE_MAPPINGS[btn.label]) {
        const mappedSpn = this.SPECIAL_NOTE_MAPPINGS[btn.label];
        if (mappedSpn && !this._spnToIdMap.has(mappedSpn)) {
          this._spnToIdMap.set(mappedSpn, btn.id);
        }
      }
    }
    
    // 为中央D音添加动态映射
    const dynamicDSpn = this._calculateDynamicDSpn();
    if (dynamicDSpn && !this._spnToIdMap.has('D_CENTER')) {
      // 如果手碟上有对应的D音，建立映射
      if (this._spnToIdMap.has(dynamicDSpn)) {
        // D_CENTER已经会被_calculateDynamicDSpn转换为实际SPN
        console.log(`[Gameplay] 中央D音映射到: ${dynamicDSpn}`);
      }
    }
    
    console.log(`[Gameplay] SPN映射表已建立，共 ${this._spnToIdMap.size} 个条目`);
    console.log(`[Gameplay] 映射内容:`, Array.from(this._spnToIdMap.entries()));
  },

  /**
   * 快速查找SPN对应的音符ID（使用缓存的映射表）
   */
  _findNoteIdBySpnFast(spn) {
    if (!this._spnToIdMap) {
      return this.findNoteIdBySpn(spn);
    }
    return this._spnToIdMap.has(spn) ? this._spnToIdMap.get(spn) : null;
  },

  /**
   * 更新虚影提示（使用路径更新优化，只更新有变化的音符）
   */
  updateHints(currentTime) {
    // 优先使用缓存的 timeline 减少 this.data 访问开销
    const timeline = this._timeline || this.data.timeline;
    const { difficulty, handpanNotes, residentButtons } = this.data;
    const config = DIFFICULTY_CONFIG[difficulty];
    
    // 调试日志（每5秒打印一次）
    if (!this._lastHintDebug || Date.now() - this._lastHintDebug > 5000) {
      console.log('[Gameplay] updateHints - 时间线:', timeline?.length || 0, 
                  '手碟音符:', handpanNotes?.length || 0,
                  '难度配置:', config);
      this._lastHintDebug = Date.now();
    }
    
    // 初始化上一次的 hints 缓存
    if (!this._prevHintsMap) {
      this._prevHintsMap = new Map();
    }
    
    if (!config.showHint) {
      // 清空所有音符的 hints
      const updates = {};
      let hasUpdates = false;
      handpanNotes.forEach((note, index) => {
        if (note.hints && note.hints.length > 0) {
          updates[`handpanNotes[${index}].hints`] = [];
          hasUpdates = true;
        }
      });
      residentButtons.forEach((btn, index) => {
        if (btn.hints && btn.hints.length > 0) {
          updates[`residentButtons[${index}].hints`] = [];
          hasUpdates = true;
        }
      });
      if (hasUpdates) {
        this._prevHintsMap.clear();
        this._collectUpdate(updates);
      }
      return;
    }
    
    // 找出未来hintPreloadCount个需要提示的音符（仅扫描必要范围）
    // 按 noteId 分组收集 hints
    const hintsMap = new Map(); // noteId -> hints[]
    let count = 0;
    
    const targetBeat = this.msToBeat(currentTime);
    const startIndex = this.findFirstEventIndexAtOrAfter(targetBeat);
    
    for (let i = startIndex; i < timeline.length; i++) {
      const event = timeline[i];
      if (event.judged) continue;
      const eventTime = this.beatToMs(event.beatPosition);
      if (eventTime <= currentTime) continue;
      if (count >= RENDER_CONFIG.hintPreloadCount) break;
      
      const timeToHit = eventTime - currentTime;
      const hintDuration = config.hintDuration;
      
      if (timeToHit <= hintDuration) {
        const progress = 1 - (timeToHit / hintDuration);
        
        for (const note of event.notes) {
          const noteId = this._findNoteIdBySpnFast(note.spn);
          if (noteId !== null) {
            if (!hintsMap.has(noteId)) {
              hintsMap.set(noteId, []);
            }
            hintsMap.get(noteId).push({
              id: `${i}-${note.spn}`,
              spn: note.spn,
              progress,
              eventIndex: i
            });
          }
        }
      }
      count++;
    }
    
    // 使用路径更新，只更新有变化的音符
    const updates = {};
    let hasUpdates = false;
    
    // 检查 handpanNotes 中每个音符的 hints 变化
    handpanNotes.forEach((note, index) => {
      const newHints = hintsMap.get(note.id) || [];
      const prevHints = this._prevHintsMap.get(note.id) || [];
      
      // 检查是否有变化（数量变化或progress变化超过5%）
      const changed = newHints.length !== prevHints.length ||
        newHints.some((h, i) => {
          const prev = prevHints[i];
          return !prev || h.eventIndex !== prev.eventIndex || 
                 Math.abs(h.progress - prev.progress) > 0.05;
        });
      
      if (changed) {
        updates[`handpanNotes[${index}].hints`] = newHints;
        this._prevHintsMap.set(note.id, newHints);
        hasUpdates = true;
      }
    });
    
    // 检查 residentButtons 中每个按钮的 hints 变化
    residentButtons.forEach((btn, index) => {
      const newHints = hintsMap.get(btn.id) || [];
      const prevHints = this._prevHintsMap.get(btn.id) || [];
      
      const changed = newHints.length !== prevHints.length ||
        newHints.some((h, i) => {
          const prev = prevHints[i];
          return !prev || h.eventIndex !== prev.eventIndex || 
                 Math.abs(h.progress - prev.progress) > 0.05;
        });
      
      if (changed) {
        updates[`residentButtons[${index}].hints`] = newHints;
        this._prevHintsMap.set(btn.id, newHints);
        hasUpdates = true;
      }
    });
    
    if (hasUpdates) {
      this._collectUpdate(updates);
    }
  },

  /**
   * 根据SPN找到手碟音符ID
   */
  findNoteIdBySpn(spn) {
    const { handpanNotes, residentButtons } = this.data;
    
    // 先检查手碟音符
    for (const note of handpanNotes) {
      if (note.note === spn) return note.id;
    }
    
    // 再检查常驻按钮
    for (const btn of residentButtons) {
      if (btn.spn === spn) return btn.id;
    }
    
    // 调试：未找到匹配
    if (!this._spnMissLogged) this._spnMissLogged = new Set();
    if (!this._spnMissLogged.has(spn)) {
      console.log('[Gameplay] findNoteIdBySpn未找到:', spn, 
                  '可用音符:', handpanNotes.map(n => n.note).join(','));
      this._spnMissLogged.add(spn);
    }
    
    return null;
  },

  /**
   * 检查超时Miss的音符
   */
  checkMissedNotes(currentTime) {
    // 优先使用缓存的 timeline 减少 this.data 访问开销
    const timeline = this._timeline || this.data.timeline;
    let updated = false;
    const missThreshold = currentTime - JUDGE_WINDOWS.miss;
    
    if (this._lastMissCheckTime && currentTime < this._lastMissCheckTime) {
      // 时间回退时重置扫描索引
      this._missCheckIndex = 0;
    }
    this._lastMissCheckTime = currentTime;
    
    let startIndex = this._missCheckIndex || 0;
    let advanced = false;
    
    for (let i = startIndex; i < timeline.length; i++) {
      const event = timeline[i];
      if (event.judged) {
        continue;
      }
      
      // 超过判定窗口的音符标记为Miss
      const eventTime = this.beatToMs(event.beatPosition);
      if (eventTime <= missThreshold) {
        timeline[i].judged = true;
        timeline[i].judgment = 'miss';
        
        this.handleJudgment('miss', event);
        updated = true;
        advanced = true;
      } else {
        this._missCheckIndex = i;
        advanced = true;
        break;
      }
    }
    
    if (!advanced) {
      this._missCheckIndex = timeline.length;
    }
    
    // 注意：不再setData更新timeline，timeline只在内部使用
    // View层不需要timeline数据，避免不必要的大数组传输
  },

  /**
   * 处理判定结果
   */
  handleJudgment(judgment, event) {
    let { score, combo, maxCombo, perfectCount, goodCount, missCount, feedbackEffects } = this.data;
    
    // 计算得分
    let addScore = SCORE_CONFIG[judgment];
    
    if (judgment === 'perfect' || judgment === 'good') {
      combo++;
      maxCombo = Math.max(maxCombo, combo);
      
      // 连击奖励
      if (combo >= SCORE_CONFIG.comboThreshold) {
        addScore += SCORE_CONFIG.comboBonus * (combo - SCORE_CONFIG.comboThreshold + 1);
      }
      
      if (judgment === 'perfect') {
        perfectCount++;
      } else {
        goodCount++;
      }
    } else {
      combo = 0;
      missCount++;
    }
    
    score += addScore;
    
    // 添加反馈特效
    const effects = [...feedbackEffects];
    effects.push({
      id: Date.now(),
      type: 'judgment',
      judgment: judgment,
      progress: 0,
      startTime: Date.now()
    });
    // 限制特效数量
    if (effects.length > 10) {
      effects.shift();
    }
    
    // 连续5个Perfect后光标变金色
    const cursorGolden = combo >= 5 && perfectCount >= 5;
    
    // 使用批量更新机制：收集更新（在游戏循环内会被合并刷新）
    this._collectUpdate({ 
      score, combo, maxCombo, perfectCount, goodCount, missCount,
      feedbackEffects: effects,
      cursorGolden
    });
  },

  /**
   * 添加反馈特效（独立调用时使用）
   */
  addFeedbackEffect(judgment) {
    const effects = [...this.data.feedbackEffects];
    
    effects.push({
      id: Date.now(),
      type: 'judgment',
      judgment: judgment,
      progress: 0,
      startTime: Date.now()
    });
    
    // 限制特效数量
    if (effects.length > 10) {
      effects.shift();
    }
    
    this.setData({ feedbackEffects: effects });
  },

  /**
   * 更新光标特效（独立调用时使用）
   */
  updateCursorEffect(combo) {
    // 连续5个Perfect后光标变金色
    const cursorGolden = combo >= 5 && this.data.perfectCount >= 5;
    if (this.data.cursorGolden !== cursorGolden) {
      this.setData({ cursorGolden });
    }
  },

  /**
   * 更新特效（使用路径更新优化 ripples）
   */
  updateEffects() {
    const now = Date.now();
    const { feedbackEffects, handpanNotes, residentButtons } = this.data;
    
    const updates = {};
    let hasUpdates = false;
    
    // 更新判定特效（全局）
    if (feedbackEffects.length > 0) {
      let effects = feedbackEffects.filter(e => {
        return now - e.startTime < 800;
      }).map(e => ({
        ...e,
        progress: (now - e.startTime) / 800
      }));
      
      if (effects.length !== feedbackEffects.length || effects.length > 0) {
        updates.feedbackEffects = effects;
        hasUpdates = true;
      }
    }
    
    // 更新手碟音符上的水波纹特效（使用路径更新）
    handpanNotes.forEach((note, index) => {
      if (!note.ripples || note.ripples.length === 0) return;
      
      let ripples = note.ripples.filter(e => {
        return now - e.startTime < 500;
      }).map(e => ({
        ...e,
        progress: (now - e.startTime) / 500
      }));
      
      // 只有当ripples有变化时才更新
      if (ripples.length !== note.ripples.length || ripples.length > 0) {
        updates[`handpanNotes[${index}].ripples`] = ripples;
        hasUpdates = true;
      }
    });
    
    // 更新常驻按钮上的水波纹特效
    residentButtons.forEach((btn, index) => {
      if (!btn.ripples || btn.ripples.length === 0) return;
      
      let ripples = btn.ripples.filter(e => {
        return now - e.startTime < 500;
      }).map(e => ({
        ...e,
        progress: (now - e.startTime) / 500
      }));
      
      if (ripples.length !== btn.ripples.length || ripples.length > 0) {
        updates[`residentButtons[${index}].ripples`] = ripples;
        hasUpdates = true;
      }
    });
    
    if (hasUpdates) {
      this._collectUpdate(updates);
    }
  },

  /**
   * 手碟音符触摸开始
   */
  onNoteTouchStart(e) {
    const noteData = e.currentTarget.dataset;
    const noteId = noteData.id;
    const noteSPN = noteData.note;
    
    // 播放音频（即时反馈）
    this.playNote(noteSPN);
    
    // 视觉反馈
    this.setNoteActive(noteId, true);
    
    // 判定
    if (this.data.isPlaying) {
      this.judgeHit(noteSPN, noteId);
    }
  },

  /**
   * 手碟音符触摸结束
   */
  onNoteTouchEnd(e) {
    const noteId = e.currentTarget.dataset.id;
    this.setNoteActive(noteId, false);
  },

  /**
   * 常驻按钮触摸
   */
  onResidentBtnTouchStart(e) {
    const btnId = e.currentTarget.dataset.id;
    const btn = this.data.residentButtons.find(b => b.id === btnId);
    
    if (btn && btn.spn) {
      this.playNote(btn.spn);
    }
    
    // 视觉反馈
    const buttons = this.data.residentButtons.map(b => ({
      ...b,
      active: b.id === btnId
    }));
    this.setData({ residentButtons: buttons });
    
    // 判定
    if (this.data.isPlaying && btn && btn.spn) {
      this.judgeHit(btn.spn, btnId);
    }
  },

  /**
   * 常驻按钮触摸结束
   */
  onResidentBtnTouchEnd() {
    const buttons = this.data.residentButtons.map(b => ({
      ...b,
      active: false
    }));
    this.setData({ residentButtons: buttons });
  },

  /**
   * 设置音符激活状态（使用路径更新优化性能）
   */
  setNoteActive(noteId, active) {
    const notes = this.data.handpanNotes;
    const index = notes.findIndex(n => n.id === noteId);
    if (index !== -1 && notes[index].active !== active) {
      this.setData({ [`handpanNotes[${index}].active`]: active });
    }
  },

  /**
   * 播放音符
   * 处理常规SPN和特殊字符的音频播放
   */
  playNote(spn) {
    if (!spn) return;
    
    try {
      // T、d、P、x 直接作为SPN名播放
      webAudioManager.playNote(spn, this.data.handpanVolume / 100);
    } catch (e) {
      console.warn('[Gameplay] 播放音符失败:', e);
    }
  },

  /**
   * 判定击打
   */
  judgeHit(spn, noteId) {
    const currentTime = this.getCurrentPlayTime();
    // 优先使用缓存的 timeline
    const timeline = this._timeline || this.data.timeline;
    const windowMs = JUDGE_WINDOWS.miss;
    const startBeat = this.msToBeat(currentTime - windowMs);
    const endBeat = this.msToBeat(currentTime + windowMs);
    const startIndex = this.findFirstEventIndexAtOrAfter(startBeat);
    
    // 查找最近的未判定事件
    let closestEvent = null;
    let closestDiff = Infinity;
    
    for (let i = startIndex; i < timeline.length; i++) {
      const event = timeline[i];
      if (event.judged) continue;
      if (event.beatPosition > endBeat) break;
      
      // 检查该事件是否包含对应的音符
      const hasNote = event.notes.some(n => n.spn === spn);
      if (!hasNote) continue;
      
      const eventTime = this.beatToMs(event.beatPosition);
      const diff = Math.abs(currentTime - eventTime);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestEvent = { event, index: i };
      }
    }
    
    if (!closestEvent) return;
    
    // 判定
    let judgment = 'miss';
    if (closestDiff <= JUDGE_WINDOWS.perfect) {
      judgment = 'perfect';
    } else if (closestDiff <= JUDGE_WINDOWS.good) {
      judgment = 'good';
    } else if (closestDiff <= JUDGE_WINDOWS.miss) {
      judgment = 'miss';
    } else {
      return; // 超出判定范围，不处理
    }
    
    // 更新事件状态（内部数据，不需要setData）
    timeline[closestEvent.index].judged = true;
    timeline[closestEvent.index].judgment = judgment;
    
    // 处理判定结果
    this.handleJudgment(judgment, closestEvent.event);
    
    // 添加水波纹特效
    this.addRippleEffect(noteId, judgment);
    
    // 用户点击触发的判定需要立即刷新更新以提供即时反馈
    this._flushUpdates();
  },

  /**
   * 添加水波纹特效（使用路径更新，只更新对应音符）
   */
  addRippleEffect(noteId, judgment) {
    const { handpanNotes, residentButtons } = this.data;
    
    let color = '#ffffff'; // miss - 白色
    if (judgment === 'good') color = '#4a90d9'; // good - 蓝色
    if (judgment === 'perfect') color = '#F4D096'; // perfect - 金色
    
    const newRipple = {
      id: Date.now(),
      color,
      progress: 0,
      startTime: Date.now()
    };
    
    // 查找音符并使用路径更新
    const noteIndex = handpanNotes.findIndex(n => n.id === noteId);
    if (noteIndex !== -1) {
      const ripples = [...(handpanNotes[noteIndex].ripples || []), newRipple];
      // 限制每个音符的水波纹数量
      if (ripples.length > 5) ripples.shift();
      this._collectUpdate({ [`handpanNotes[${noteIndex}].ripples`]: ripples });
      return;
    }
    
    // 检查常驻按钮
    const btnIndex = residentButtons.findIndex(b => b.id === noteId);
    if (btnIndex !== -1) {
      const ripples = [...(residentButtons[btnIndex].ripples || []), newRipple];
      if (ripples.length > 5) ripples.shift();
      this._collectUpdate({ [`residentButtons[${btnIndex}].ripples`]: ripples });
    }
  },

  /**
   * 图片加载错误处理
   */
  onImageError(e) {
    const index = e.currentTarget.dataset.index;
    console.error(`[Gameplay] 图片块 ${index + 1} 加载失败:`, e.detail);
  },

  /**
   * 更新图片滚动位置（图片滚动模式）
   * 使用精确的 beatPosition -> pixelX 映射，确保滚动与判定时间线完全同步
   */
  updateImageScroll(currentTime) {
    if (!this.data.useImageScroll) return;
    
    const cursorX = RENDER_CONFIG.cursorX;
    const subdivisionWidth = RENDER_CONFIG.subdivisionWidth || 40;
    
    // 使用动态计算的leadInTime
    const leadInTimeMs = this.getLeadInTimeMs();
    const leadInBeats = this.data.leadInBeats || 2;
    
    // 将当前时间转换为拍位置（包含leadIn）
    const currentBeatPosition = this.msToBeat(currentTime);
    // 减去leadIn得到谱面内的拍位置
    const scoreBeatPosition = currentBeatPosition - leadInBeats;
    
    // 使用精确映射获取像素位置
    const pixelX = this.beatToPixelX(scoreBeatPosition);
    
    // 计算滚动位置：使谱面的 pixelX 位置对齐到光标
    // 音符绘制在subdivision中心（偏移 subdivisionWidth/2），需要补偿
    const scrollX = cursorX - subdivisionWidth / 2 - pixelX;
    
    // 只有位置变化超过2px才更新（大幅减少setData频率）
    if (Math.abs(scrollX - (this._lastScrollX || 0)) > 2) {
      this._lastScrollX = scrollX;
      this._collectUpdate({ scoreScrollX: Math.round(scrollX) });
    }
  },

  /**
   * 渲染谱面（Canvas）- 使用notation风格绘制
   * 参照canvasRenderer.js的绘制逻辑，横向流式滚动
   */
  renderScore() {
    const ctx = this.scoreCtx;
    if (!ctx) return;
    
    const { canvasWidth, canvasHeight, currentTime, bpm, beatsPerMeasure, sheetData, cursorX: viewCursorX } = this.data;
    
    // 安全检查 - 确保尺寸有效
    if (!canvasWidth || !canvasHeight) {
      console.warn('[Gameplay] Canvas尺寸无效:', canvasWidth, canvasHeight);
      return;
    }
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 颜色配置（白底配色方案，参照canvasRenderer.js）
    const colors = {
      barLine: '#314D63',
      beatLine: 'rgba(49, 77, 99, 0.3)',
      subdivisionLine: 'rgba(49, 77, 99, 0.15)',
      handDivider: 'rgba(49, 77, 99, 0.12)',
      rightHand: '#C4963A',   // 深金色
      leftHand: '#314D63',     // 深蓝色
    };
    
    // 计算布局参数
    const msPerBeat = 60000 / bpm;
    // 使用View层的光标位置（实际像素坐标）
    const cursorX = viewCursorX || RENDER_CONFIG.cursorX;
    // 每拍的像素宽度（直接使用配置值，确保足够宽）
    const beatWidthPx = RENDER_CONFIG.beatWidth;
    const pixelsPerMs = beatWidthPx / msPerBeat;
    
    // 中轴线位置
    const baseY = canvasHeight / 2;
    
    // 4轨道Y位置（从上到下）- 参照canvasRenderer.js的drawNoteSlots逻辑
    // 轨道间距占画布高度的比例
    const slotHeight = canvasHeight * 0.18;  // 每个槽位高度
    const slotGap = canvasHeight * 0.03;     // 槽位间距
    const innerOffset = canvasHeight * 0.02; // 内侧槽位偏移（远离中轴线）
    
    // 右手区域（上半部分）：slot0=外侧, slot1=内侧（靠近中轴）
    // 左手区域（下半部分）：slot2=内侧（靠近中轴）, slot3=外侧
    const trackPositions = [
      baseY - slotHeight - slotGap - slotHeight / 2,           // Slot 0: 右手外侧
      baseY - slotHeight / 2 - innerOffset,                     // Slot 1: 右手内侧
      baseY + slotHeight / 2 + innerOffset,                     // Slot 2: 左手内侧
      baseY + slotHeight + slotGap + slotHeight / 2            // Slot 3: 左手外侧
    ];
    
    // 小节线宽度
    const barLineWidth = 2;
    const beatLineWidth = 1;
    const subLineWidth = 1;
    
    // 获取所有小节并展平
    const notations = sheetData?.notations || [];
    
    // 使用与timeline一致的leadIn计算方式（基于拍数，而非固定毫秒）
    const leadInBeats = this.data.leadInBeats || 2;
    const leadInTimeMs = leadInBeats * msPerBeat;
    
    // 先计算所有小节的时间范围，以便正确绘制（按BPM缓存）
    const cache = this._measureDataCache;
    let measureDataList = cache?.list || [];
    
    if (!cache || cache.bpm !== bpm || cache.leadInBeats !== leadInBeats || cache.sheetRef !== sheetData) {
      let globalMsOffset = leadInTimeMs;
      measureDataList = [];
      
      for (const notation of notations) {
        const measures = notation.measures || [];
        for (let mIndex = 0; mIndex < measures.length; mIndex++) {
          const measure = measures[mIndex];
          const beats = measure.beats || [];
          // 使用实际拍数计算小节时长
          const actualBeatsCount = beats.filter(b => !b.isPlaceholder).length || beatsPerMeasure;
          const measureDurationMs = msPerBeat * actualBeatsCount;
          
          measureDataList.push({
            measure,
            startMs: globalMsOffset,
            endMs: globalMsOffset + measureDurationMs,
            durationMs: measureDurationMs,
            beatsCount: actualBeatsCount
          });
          
          globalMsOffset += measureDurationMs;
        }
      }
      
      this._measureDataCache = {
        bpm,
        leadInBeats,
        sheetRef: sheetData,
        list: measureDataList
      };
    }
    
    // 计算可见范围 + 左右4小节的缓冲区域
    let firstVisibleIndex = 0;
    let lastVisibleIndex = measureDataList.length - 1;
    const bufferMeasures = 4; // 缓冲小节数
    
    // 计算可见的时间范围
    const visibleStartMs = currentTime - (cursorX / pixelsPerMs);
    const visibleEndMs = currentTime + ((canvasWidth - cursorX) / pixelsPerMs);
    
    // 使用滑动窗口索引，时间跳变时回退到二分搜索
    const range = this._visibleMeasureRange;
    const windowMs = visibleEndMs - visibleStartMs;
    const needsReset = !range ||
      range.bpm !== bpm ||
      range.leadInBeats !== leadInBeats ||
      range.sheetRef !== sheetData ||
      range.lastTime == null ||
      Math.abs(currentTime - range.lastTime) > windowMs;
    
    let visibleFirst = 0;
    let visibleLast = Math.max(0, measureDataList.length - 1);
    
    if (needsReset) {
      // 找到第一个可见小节（endMs >= visibleStartMs）
      let left = 0;
      let right = measureDataList.length - 1;
      let firstHit = measureDataList.length;
      while (left <= right) {
        const mid = (left + right) >> 1;
        if (measureDataList[mid].endMs >= visibleStartMs) {
          firstHit = mid;
          right = mid - 1;
        } else {
          left = mid + 1;
        }
      }
      visibleFirst = firstHit < measureDataList.length ? firstHit : 0;
      
      // 找到最后一个可见小节（startMs <= visibleEndMs）
      left = 0;
      right = measureDataList.length - 1;
      let lastHit = -1;
      while (left <= right) {
        const mid = (left + right) >> 1;
        if (measureDataList[mid].startMs <= visibleEndMs) {
          lastHit = mid;
          left = mid + 1;
        } else {
          right = mid - 1;
        }
      }
      visibleLast = lastHit >= 0 ? lastHit : visibleLast;
    } else {
      visibleFirst = range.visibleFirst;
      visibleLast = range.visibleLast;
      
      if (currentTime >= range.lastTime) {
        while (visibleFirst < measureDataList.length && measureDataList[visibleFirst].endMs < visibleStartMs) {
          visibleFirst++;
        }
        while (visibleLast < measureDataList.length - 1 && measureDataList[visibleLast + 1].startMs <= visibleEndMs) {
          visibleLast++;
        }
      } else {
        while (visibleFirst > 0 && measureDataList[visibleFirst - 1].endMs >= visibleStartMs) {
          visibleFirst--;
        }
        while (visibleLast > 0 && measureDataList[visibleLast].startMs > visibleEndMs) {
          visibleLast--;
        }
      }
    }
    
    firstVisibleIndex = Math.max(0, visibleFirst - bufferMeasures);
    lastVisibleIndex = Math.min(measureDataList.length - 1, visibleLast + bufferMeasures);
    
    this._visibleMeasureRange = {
      visibleFirst,
      visibleLast,
      lastTime: currentTime,
      bpm,
      leadInBeats,
      sheetRef: sheetData
    };
    
    const canUseOffscreen = typeof wx.createOffscreenCanvas === 'function';
    const useChunkCache = RENDER_CONFIG.chunkCacheEnabled && canUseOffscreen;
    
    if (!useChunkCache) {
      // 遍历并绘制可见范围内的小节（仅渲染firstVisibleIndex到lastVisibleIndex）
      for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
        const { measure, startMs: measureStartMs, endMs: measureEndMs, durationMs, beatsCount } = measureDataList[i];
        
        // 计算小节在画布上的位置
        const measureX = cursorX + (measureStartMs - currentTime) * pixelsPerMs;
        const measureWidth = durationMs * pixelsPerMs;
        
        const beats = measure.beats || [];
        const realBeats = beats.filter(b => !b.isPlaceholder);
        const beatWidth = measureWidth / (realBeats.length || 1);
        
        // ========== 第一层：绘制中轴线（左右手分隔线）==========
        ctx.fillStyle = colors.handDivider;
        ctx.fillRect(measureX, baseY - 0.5, measureWidth, 1);
        
        // ========== 第二层：绘制小节线 ==========
        // 每个小节起始线都绘制，确保换行处也有小节线
        ctx.fillStyle = colors.barLine;
        ctx.fillRect(measureX, 0, barLineWidth, canvasHeight);
        
        // ========== 第三层：绘制拍子和音符 ==========
        let beatXOffset = 0;
        for (let bIndex = 0; bIndex < beats.length; bIndex++) {
          const beat = beats[bIndex];
          
          // 跳过占位拍
          if (beat.isPlaceholder) continue;
          
          const beatX = measureX + beatXOffset;
          
          // 绘制拍线（非第一拍）
          if (beatXOffset > 0) {
            ctx.fillStyle = colors.beatLine;
            ctx.fillRect(beatX, 0, beatLineWidth, canvasHeight);
          }
          
          // 处理中间小节线（自定义拍号）
          if (beat.barLineAfter) {
            ctx.fillStyle = colors.barLine;
            ctx.fillRect(beatX + beatWidth - barLineWidth / 2, 0, barLineWidth, canvasHeight);
          }
          
          // 遍历细分
          const subdivisions = beat.subdivisions || [];
          const subWidth = beatWidth / (subdivisions.length || 1);
          
          for (let sIndex = 0; sIndex < subdivisions.length; sIndex++) {
            const sub = subdivisions[sIndex];
            const subX = beatX + sIndex * subWidth;
            const subCenterX = subX + subWidth / 2;
            
            // 绘制细分分隔线（非第一个细分）
            if (sIndex > 0) {
              ctx.fillStyle = colors.subdivisionLine;
              // 细分线只在中间区域显示（不贯穿整个高度）
              const lineHeight = canvasHeight * 0.6;
              const lineY = (canvasHeight - lineHeight) / 2;
              ctx.fillRect(subX, lineY, subLineWidth, lineHeight);
            }
            
            // 计算该细分的时间点
            const subMs = measureStartMs + beatXOffset / pixelsPerMs + (sIndex * subWidth) / pixelsPerMs;
            
            // 判断是否已播放（在光标左侧）
            const isPlayed = subMs < currentTime - 50;
            
            // 右手音符（按数组顺序：第一个=外侧Slot0，第二个=内侧Slot1）
            const rightHand = sub.rightHand || sub.right || [];
            const rightNotes = Array.isArray(rightHand) ? rightHand : (rightHand ? [rightHand] : []);
            
            rightNotes.forEach((noteItem, nIndex) => {
              const note = typeof noteItem === 'object' ? (noteItem.note || noteItem.value || '') : noteItem;
              if (note && note !== '-' && note !== '') {
                // 单音符时贴近中轴（Slot1），多音符时按顺序分配
                const slotIndex = rightNotes.length === 1 ? 1 : nIndex;
                const noteY = trackPositions[slotIndex];
                this.drawNote(ctx, subCenterX, noteY, note, 'right', isPlayed, colors);
              }
            });
            
            // 左手音符（按数组顺序：第一个=内侧Slot2，第二个=外侧Slot3）
            const leftHand = sub.leftHand || sub.left || [];
            const leftNotes = Array.isArray(leftHand) ? leftHand : (leftHand ? [leftHand] : []);
            
            leftNotes.forEach((noteItem, nIndex) => {
              const note = typeof noteItem === 'object' ? (noteItem.note || noteItem.value || '') : noteItem;
              if (note && note !== '-' && note !== '') {
                // 单音符时贴近中轴（Slot2），多音符时按顺序分配
                const slotIndex = leftNotes.length === 1 ? 2 : (2 + nIndex);
                const noteY = trackPositions[slotIndex];
                this.drawNote(ctx, subCenterX, noteY, note, 'left', isPlayed, colors);
              }
            });
          }
          
          beatXOffset += beatWidth;
        }
        
        // 若下一小节起点与当前小节终点不连续，补绘当前小节右侧结束线
        if (i === lastVisibleIndex) {
          const endX = measureX + measureWidth - barLineWidth;
          if (endX > 0 && endX < canvasWidth) {
            ctx.fillStyle = colors.barLine;
            ctx.fillRect(endX, 0, barLineWidth, canvasHeight);
          }
        } else {
          const nextMeasure = measureDataList[i + 1];
          const nextStartX = cursorX + (nextMeasure.startMs - currentTime) * pixelsPerMs;
          if (Math.abs(nextStartX - (measureX + measureWidth)) > 1) {
            const endX = measureX + measureWidth - barLineWidth;
            if (endX > 0 && endX < canvasWidth) {
              ctx.fillStyle = colors.barLine;
              ctx.fillRect(endX, 0, barLineWidth, canvasHeight);
            }
          }
        }
      }
    } else {
      const chunkMeasures = RENDER_CONFIG.chunkMeasures || 12;
      const maxChunks = RENDER_CONFIG.chunkCacheMax || 6;
      const cacheKeyBase = `${bpm}|${leadInBeats}|${canvasHeight}|${beatWidthPx}`;
      
      if (!this._chunkCache || this._chunkCacheKey !== cacheKeyBase || this._chunkCacheSheet !== sheetData) {
        this._chunkCache = new Map();
        this._chunkCacheOrder = [];
        this._chunkCacheKey = cacheKeyBase;
        this._chunkCacheSheet = sheetData;
      }
      
      const drawMeasureRange = (targetCtx, startIndex, endIndex, chunkStartMs, drawLines, drawNotes, noteDim) => {
        targetCtx.clearRect(0, 0, targetCtx.canvas.width, targetCtx.canvas.height);
        targetCtx.globalAlpha = 1;
        
        for (let i = startIndex; i <= endIndex; i++) {
          const { measure, startMs: measureStartMs, durationMs } = measureDataList[i];
          const measureX = (measureStartMs - chunkStartMs) * pixelsPerMs;
          const measureWidth = durationMs * pixelsPerMs;
          
          const beats = measure.beats || [];
          const realBeats = beats.filter(b => !b.isPlaceholder);
          const beatWidth = measureWidth / (realBeats.length || 1);
          
          if (drawLines) {
            targetCtx.fillStyle = colors.handDivider;
            targetCtx.fillRect(measureX, baseY - 0.5, measureWidth, 1);
            
            targetCtx.fillStyle = colors.barLine;
            targetCtx.fillRect(measureX, 0, barLineWidth, canvasHeight);
          }
          
          let beatXOffset = 0;
          for (let bIndex = 0; bIndex < beats.length; bIndex++) {
            const beat = beats[bIndex];
            if (beat.isPlaceholder) continue;
            
            const beatX = measureX + beatXOffset;
            
            if (drawLines) {
              if (beatXOffset > 0) {
                targetCtx.fillStyle = colors.beatLine;
                targetCtx.fillRect(beatX, 0, beatLineWidth, canvasHeight);
              }
              
              if (beat.barLineAfter) {
                targetCtx.fillStyle = colors.barLine;
                targetCtx.fillRect(beatX + beatWidth - barLineWidth / 2, 0, barLineWidth, canvasHeight);
              }
            }
            
            const subdivisions = beat.subdivisions || [];
            const subWidth = beatWidth / (subdivisions.length || 1);
            
            for (let sIndex = 0; sIndex < subdivisions.length; sIndex++) {
              const sub = subdivisions[sIndex];
              const subX = beatX + sIndex * subWidth;
              const subCenterX = subX + subWidth / 2;
              
              if (drawLines && sIndex > 0) {
                targetCtx.fillStyle = colors.subdivisionLine;
                const lineHeight = canvasHeight * 0.6;
                const lineY = (canvasHeight - lineHeight) / 2;
                targetCtx.fillRect(subX, lineY, subLineWidth, lineHeight);
              }
              
              if (drawNotes) {
                const isPlayed = noteDim;
                const rightHand = sub.rightHand || sub.right || [];
                const rightNotes = Array.isArray(rightHand) ? rightHand : (rightHand ? [rightHand] : []);
                
                rightNotes.forEach((noteItem, nIndex) => {
                  const note = typeof noteItem === 'object' ? (noteItem.note || noteItem.value || '') : noteItem;
                  if (note && note !== '-' && note !== '') {
                    const slotIndex = rightNotes.length === 1 ? 1 : nIndex;
                    const noteY = trackPositions[slotIndex];
                    this.drawNote(targetCtx, subCenterX, noteY, note, 'right', isPlayed, colors);
                  }
                });
                
                const leftHand = sub.leftHand || sub.left || [];
                const leftNotes = Array.isArray(leftHand) ? leftHand : (leftHand ? [leftHand] : []);
                
                leftNotes.forEach((noteItem, nIndex) => {
                  const note = typeof noteItem === 'object' ? (noteItem.note || noteItem.value || '') : noteItem;
                  if (note && note !== '-' && note !== '') {
                    const slotIndex = leftNotes.length === 1 ? 2 : (2 + nIndex);
                    const noteY = trackPositions[slotIndex];
                    this.drawNote(targetCtx, subCenterX, noteY, note, 'left', isPlayed, colors);
                  }
                });
              }
            }
            
            beatXOffset += beatWidth;
          }
          
          if (drawLines) {
            if (i === endIndex) {
              const endX = measureX + measureWidth - barLineWidth;
              targetCtx.fillStyle = colors.barLine;
              targetCtx.fillRect(endX, 0, barLineWidth, canvasHeight);
            } else {
              const nextMeasure = measureDataList[i + 1];
              const nextStartX = (nextMeasure.startMs - chunkStartMs) * pixelsPerMs;
              if (Math.abs(nextStartX - (measureX + measureWidth)) > 1) {
                const endX = measureX + measureWidth - barLineWidth;
                targetCtx.fillStyle = colors.barLine;
                targetCtx.fillRect(endX, 0, barLineWidth, canvasHeight);
              }
            }
          }
        }
      };
      
      const buildChunk = (chunkStartIndex) => {
        const chunkEndIndex = Math.min(measureDataList.length - 1, chunkStartIndex + chunkMeasures - 1);
        const key = `${chunkStartIndex}-${chunkEndIndex}`;
        
        if (this._chunkCache.has(key)) {
          return this._chunkCache.get(key);
        }
        
        const startMs = measureDataList[chunkStartIndex].startMs;
        const endMs = measureDataList[chunkEndIndex].endMs;
        const widthPx = Math.max(1, Math.ceil((endMs - startMs) * pixelsPerMs));
        
        const linesCanvas = wx.createOffscreenCanvas({ type: '2d', width: widthPx, height: canvasHeight });
        const notesCanvas = wx.createOffscreenCanvas({ type: '2d', width: widthPx, height: canvasHeight });
        const notesDimCanvas = wx.createOffscreenCanvas({ type: '2d', width: widthPx, height: canvasHeight });
        
        const linesCtx = linesCanvas.getContext('2d');
        const notesCtx = notesCanvas.getContext('2d');
        const notesDimCtx = notesDimCanvas.getContext('2d');
        
        drawMeasureRange(linesCtx, chunkStartIndex, chunkEndIndex, startMs, true, false, false);
        drawMeasureRange(notesCtx, chunkStartIndex, chunkEndIndex, startMs, false, true, false);
        drawMeasureRange(notesDimCtx, chunkStartIndex, chunkEndIndex, startMs, false, true, true);
        
        const chunk = {
          startIndex: chunkStartIndex,
          endIndex: chunkEndIndex,
          startMs,
          endMs,
          widthPx,
          linesCanvas,
          notesCanvas,
          notesDimCanvas
        };
        
        this._chunkCache.set(key, chunk);
        this._chunkCacheOrder.push(key);
        if (this._chunkCacheOrder.length > maxChunks) {
          const dropKey = this._chunkCacheOrder.shift();
          this._chunkCache.delete(dropKey);
        }
        
        return chunk;
      };
      
      const firstChunkStart = Math.floor(firstVisibleIndex / chunkMeasures) * chunkMeasures;
      const lastChunkStart = Math.floor(lastVisibleIndex / chunkMeasures) * chunkMeasures;
      
      for (let chunkStart = firstChunkStart; chunkStart <= lastChunkStart; chunkStart += chunkMeasures) {
        const chunk = buildChunk(chunkStart);
        if (!chunk) continue;
        
        const chunkX = cursorX + (chunk.startMs - currentTime) * pixelsPerMs;
        
        ctx.drawImage(chunk.linesCanvas, chunkX, 0, chunk.widthPx, canvasHeight);
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, cursorX, canvasHeight);
        ctx.clip();
        ctx.drawImage(chunk.notesDimCanvas, chunkX, 0, chunk.widthPx, canvasHeight);
        ctx.restore();
        
        ctx.save();
        ctx.beginPath();
        ctx.rect(cursorX, 0, Math.max(0, canvasWidth - cursorX), canvasHeight);
        ctx.clip();
        ctx.drawImage(chunk.notesCanvas, chunkX, 0, chunk.widthPx, canvasHeight);
        ctx.restore();
      }
    }
    
    // 绘制最后的小节线（右侧结束线）
    if (measureDataList.length > 0) {
      const lastMeasure = measureDataList[measureDataList.length - 1];
      const finalX = cursorX + (lastMeasure.endMs - currentTime) * pixelsPerMs;
      if (finalX > 0 && finalX < canvasWidth) {
        ctx.fillStyle = colors.barLine;
        ctx.fillRect(finalX - barLineWidth, 0, barLineWidth, canvasHeight);
      }
    }
  },
  
  /**
   * 绘制单个音符（完全复刻notation风格，支持八度点、下划线、上标等）
   * @param {CanvasRenderingContext2D} ctx - Canvas上下文
   * @param {number} x - 音符中心X坐标
   * @param {number} y - 音符中心Y坐标
   * @param {string} note - 音符字符串
   * @param {string} hand - 'right' 或 'left'
   * @param {boolean} isPlayed - 是否已播放
   * @param {Object} colors - 颜色配置
   */
  drawNote(ctx, x, y, note, hand, isPlayed, colors) {
    const color = hand === 'right' ? colors.rightHand : colors.leftHand;
    
    // 设置透明度
    ctx.globalAlpha = isPlayed ? 0.35 : 1;
    
    // 解析音符
    const parsed = parseSimplifiedNote(note);
    
    // 字体配置 - 根据画布高度动态计算，确保适配不同屏幕
    // 谱面区域高度约120px（240rpx），音符字体应该约为高度的12%~15%
    const canvasHeight = this.data.canvasHeight || 120;
    const fontSize = Math.max(12, Math.round(canvasHeight * 0.13));
    const supFontSize = Math.round(fontSize * 0.55);
    const dotSize = Math.max(3, Math.round(fontSize * 0.25));
    const supDotSize = Math.max(2, Math.round(fontSize * 0.18));
    const fontFamily = '-apple-system, BlinkMacSystemFont, sans-serif';
    
    const centerX = x;
    const centerY = y;
    
    // 设置字体
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    
    // 计算主音符宽度
    const baseNoteWidth = parsed.baseNote ? ctx.measureText(parsed.baseNote).width : 0;
    
    // 计算左上标宽度
    let leftSupWidth = 0;
    if (parsed.leftSup) {
      ctx.font = `bold ${supFontSize}px ${fontFamily}`;
      leftSupWidth = ctx.measureText(parsed.leftSup.replace(/['|,]/g, '')).width + supDotSize;
    }
    
    // 计算右上标宽度
    let rightSupWidth = 0;
    if (parsed.rightSup) {
      ctx.font = `bold ${supFontSize}px ${fontFamily}`;
      rightSupWidth = ctx.measureText(parsed.rightSup.replace(/['|,]/g, '')).width + supDotSize;
    }
    
    // 总宽度
    const totalWidth = leftSupWidth + baseNoteWidth + rightSupWidth;
    let currentX = centerX - totalWidth / 2;
    
    // 绘制左上标
    if (parsed.leftSup) {
      this.drawSuperscript(ctx, currentX + leftSupWidth / 2, centerY - fontSize * 0.3, parsed.leftSup, color, supFontSize, supDotSize, fontFamily);
      currentX += leftSupWidth;
    }
    
    // 绘制主音符
    if (parsed.baseNote) {
      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 绘制上八度点
      if (parsed.octaveUp > 0) {
        const octaveUpStartY = centerY - fontSize / 2 - dotSize / 2;
        for (let i = 0; i < parsed.octaveUp; i++) {
          ctx.beginPath();
          ctx.arc(
            currentX + baseNoteWidth / 2,
            octaveUpStartY - i * (dotSize + 1),
            dotSize / 2,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // 绘制音符文字
      ctx.fillText(parsed.baseNote, currentX + baseNoteWidth / 2, centerY);
      
      // 绘制下划线（时值减半）
      const hasUnderline = parsed.underline;
      const hasOctaveDown = parsed.octaveDown > 0;
      const underlineThickness = Math.round(fontSize * 0.14);
      const underlineY = centerY + fontSize / 2;
      
      if (hasUnderline) {
        ctx.fillRect(
          currentX + baseNoteWidth / 2 - baseNoteWidth / 2,
          underlineY,
          baseNoteWidth,
          underlineThickness
        );
      }
      
      // 绘制下八度点
      if (hasOctaveDown) {
        let octaveDownStartY;
        if (hasUnderline) {
          octaveDownStartY = underlineY + underlineThickness + 2 + dotSize / 2;
        } else {
          octaveDownStartY = centerY + fontSize / 2 + dotSize / 2;
        }
        
        for (let i = 0; i < parsed.octaveDown; i++) {
          ctx.beginPath();
          ctx.arc(
            currentX + baseNoteWidth / 2,
            octaveDownStartY + i * (dotSize + 1),
            dotSize / 2,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      currentX += baseNoteWidth;
    }
    
    // 绘制右上标
    if (parsed.rightSup) {
      this.drawSuperscript(ctx, currentX + rightSupWidth / 2, centerY - fontSize * 0.3, parsed.rightSup, color, supFontSize, supDotSize, fontFamily);
      currentX += rightSupWidth;
    }
    
    // 绘制附点
    if (parsed.hasDot) {
      const dotSizeAug = dotSize * 0.8;
      const dotGap = fontSize * 0.15;
      ctx.beginPath();
      ctx.arc(currentX + dotGap + dotSizeAug / 2, centerY, dotSizeAug / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    
    ctx.globalAlpha = 1;
  },
  
  /**
   * 绘制上标（支持八度点）
   */
  drawSuperscript(ctx, x, y, sup, color, fontSize, dotSize, fontFamily) {
    // 解析上标内容
    let octaveUp = 0;
    let octaveDown = 0;
    let baseNote = '';
    
    for (let i = 0; i < sup.length; i++) {
      if (sup[i] === "'") octaveUp++;
      else if (sup[i] === ',') octaveDown++;
      else baseNote += sup[i];
    }
    
    ctx.font = `bold ${fontSize}px ${fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    const noteWidth = baseNote ? ctx.measureText(baseNote).width : 0;
    let currentX = x - noteWidth / 2;
    
    // 绘制上标文字
    if (baseNote) {
      ctx.fillText(baseNote, currentX + noteWidth / 2, y);
    }
    
    // 绘制上标八度点（上方）
    if (octaveUp > 0) {
      const startY = y - fontSize / 2 - dotSize / 2;
      for (let i = 0; i < octaveUp; i++) {
        ctx.beginPath();
        ctx.arc(currentX + noteWidth / 2, startY - i * (dotSize + 1), dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 绘制上标八度点（下方）
    if (octaveDown > 0) {
      const startY = y + fontSize / 2 + dotSize / 2;
      for (let i = 0; i < octaveDown; i++) {
        ctx.beginPath();
        ctx.arc(currentX + noteWidth / 2, startY + i * (dotSize + 1), dotSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  /**
   * 获取显示用的音符文本
   */
  getDisplayNote(note) {
    // 简化显示
    return note.replace(/\^\{[^}]*\}/g, '').replace(/[',_*]/g, '').substring(0, 2);
  },

  /**
   * 结束游戏
   */
  endGame() {
    this.stopGameLoop();
    
    this.setData({
      gameState: 'ended',
      isPlaying: false
    });
    
    // 显示结算
    const { score, maxCombo, perfectCount, goodCount, missCount, timeline } = this.data;
    const totalNotes = timeline.length;
    const accuracy = totalNotes > 0 ? 
      Math.round((perfectCount + goodCount * 0.5) / totalNotes * 100) : 0;
    
    wx.showModal({
      title: '演奏完成',
      content: `得分: ${score}\n最大连击: ${maxCombo}\n准确率: ${accuracy}%\nPerfect: ${perfectCount} | Good: ${goodCount} | Miss: ${missCount}`,
      showCancel: true,
      cancelText: '重新开始',
      confirmText: '返回',
      success: (res) => {
        if (res.confirm) {
          wx.navigateBack({ delta: 3 });
        } else {
          this.restartGame();
        }
      }
    });
  },

  /**
   * 重新开始
   */
  restartGame() {
    this.setData({
      currentTime: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      perfectCount: 0,
      goodCount: 0,
      missCount: 0,
      currentEventIndex: 0,
      feedbackEffects: [],
      rippleEffects: [],
      cursorGolden: false
    });
    
    this.startGame();
  },

  /**
   * 切换播放/暂停
   */
  onTogglePlay() {
    if (this.data.gameState === 'ready') {
      this.startGame();
    } else if (this.data.gameState === 'playing') {
      this.pauseGame();
    } else if (this.data.gameState === 'paused') {
      this.resumeGame();
    }
  },

  /**
   * 打开侧边菜单
   */
  onOpenSideMenu() {
    this.pauseGame();
    this.setData({ showSideMenu: true });
  },

  /**
   * 关闭侧边菜单
   */
  onCloseSideMenu() {
    this.setData({ showSideMenu: false });
  },

  /**
   * 菜单 - 退出
   */
  onMenuExit() {
    wx.navigateBack({ delta: 3 });
  },

  /**
   * 菜单 - 重新开始
   */
  onMenuRestart() {
    this.onCloseSideMenu();
    this.restartGame();
  },

  /**
   * 菜单 - 切换曲谱
   */
  onMenuChangeSheet() {
    wx.navigateBack({ delta: 3 });
  },

  /**
   * 菜单 - 调整难度
   */
  onMenuChangeDifficulty() {
    const newDifficulty = this.data.difficulty === 0 ? 1 : 0;
    const config = DIFFICULTY_CONFIG[newDifficulty];
    
    this.setData({
      difficulty: newDifficulty,
      difficultyName: config.name
    });
    
    wx.showToast({
      title: config.name,
      icon: 'none'
    });
  },

  /**
   * 菜单 - 循环练习
   */
  onMenuLoopMode() {
    const newLoopMode = !this.data.loopMode;
    
    if (newLoopMode) {
      // 进入循环模式
      this.pauseGame();
      this.setData({
        loopMode: true,
        showLoopSelector: true,
        loopStart: null,
        loopEnd: null,
        loopStartLocked: false,
        accompanimentMode: false
      });
    } else {
      // 退出循环模式
      this.setData({
        loopMode: false,
        showLoopSelector: false,
        loopStart: null,
        loopEnd: null,
        loopStartLocked: false,
        accompanimentMode: false
      });
    }
    
    this.onCloseSideMenu();
  },

  /**
   * 确认循环起点（勾号按钮）
   */
  onLockLoopStart() {
    if (this.data.loopStartLocked) {
      // 取消锁定
      this.setData({
        loopStartLocked: false,
        loopStart: null,
        loopEnd: null,
        accompanimentMode: false
      });
    } else {
      // 锁定当前位置为起点
      const nearestEvent = this.findNearestEvent(this.getCurrentPlayTime());
      if (nearestEvent) {
        this.setData({
          loopStartLocked: true,
          loopStart: nearestEvent.time
        });
        
        wx.showToast({
          title: '起点已锁定',
          icon: 'none'
        });
      }
    }
  },

  /**
   * 寻找最近的事件
   * @param {number} time - 当前时间（ms）
   * @returns {Object} 最近的事件，包含动态计算的time属性
   */
  findNearestEvent(time) {
    const { timeline } = this.data;
    let closestEvent = null;
    let closestDiff = Infinity;
    
    for (const event of timeline) {
      const eventTime = this.beatToMs(event.beatPosition);
      const diff = Math.abs(eventTime - time);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestEvent = { ...event, time: eventTime }; // 返回带有动态计算time的事件
      }
    }
    
    return closestEvent;
  },

  /**
   * 自由定位模式切换
   */
  onToggleFreePosition() {
    const newMode = !this.data.freePositionMode;
    
    if (newMode) {
      this.pauseGame();
    }
    
    this.setData({ freePositionMode: newMode });
    
    if (newMode) {
      wx.showToast({
        title: '拖动谱面定位',
        icon: 'none'
      });
    }
  },

  /**
   * 谱面拖动开始
   */
  onScoreTouchStart(e) {
    if (!this.data.freePositionMode && !this.data.loopMode) return;
    
    this.touchStartX = e.touches[0].clientX;
    this.touchStartTime = this.getCurrentPlayTime();
  },

  /**
   * 谱面拖动中
   */
  onScoreTouchMove(e) {
    if (!this.data.freePositionMode && !this.data.loopMode) return;
    
    const deltaX = e.touches[0].clientX - this.touchStartX;
    const { bpm, beatsPerMeasure, canvasWidth } = this.data;
    
    // 计算时间偏移
    const msPerBeat = 60000 / bpm;
    const pixelsPerMs = RENDER_CONFIG.beatWidth / msPerBeat;
    const timeDelta = -deltaX / pixelsPerMs;
    
    let newTime = Math.max(0, Math.min(this.touchStartTime + timeDelta, this.data.totalDuration));
    
    this.setData({ currentTime: newTime });
    this._currentTime = newTime; // 同步内部变量
    
    if (this.data.useImageScroll) {
      this.updateImageScroll(newTime);
    } else {
      this.renderScore();
    }
  },

  /**
   * 谱面拖动结束
   */
  onScoreTouchEnd() {
    if (!this.data.freePositionMode && !this.data.loopMode) return;
    
    // 吸附到最近的音符
    const nearestEvent = this.findNearestEvent(this.getCurrentPlayTime());
    if (nearestEvent) {
      this.setData({ currentTime: nearestEvent.time });
      this._currentTime = nearestEvent.time; // 同步内部变量
      if (this.data.useImageScroll) {
        this.updateImageScroll(nearestEvent.time);
      } else {
        this.renderScore();
      }
    }
    
    // 如果在循环模式且已锁定起点，检查是否设置终点
    if (this.data.loopMode && this.data.loopStartLocked && !this.data.loopEnd) {
      if (nearestEvent && nearestEvent.time > this.data.loopStart) {
        this.setData({ loopEnd: nearestEvent.time });
        
        wx.showToast({
          title: '终点已设置',
          icon: 'none'
        });
      }
    }
  },

  /**
   * 循环模式下开始练习
   */
  onStartLoopPractice() {
    if (!this.data.loopStart || !this.data.loopEnd) {
      wx.showToast({
        title: '请先设置循环区间',
        icon: 'none'
      });
      return;
    }
    
    // 回到起点前两小节
    const { bpm, beatsPerMeasure } = this.data;
    const msPerBeat = 60000 / bpm;
    const twoMeasuresMs = msPerBeat * beatsPerMeasure * 2;
    const startTime = Math.max(0, this.data.loopStart - twoMeasuresMs);
    const speedMultiplier = this.data.speedMultiplier || 1;
    
    this.setData({
      currentTime: startTime,
      accompanimentMode: true,
      playStartTime: Date.now() - startTime / speedMultiplier,
      gameState: 'playing',
      isPlaying: true
    });
    
    // 重置该区间的判定
    const loopStartTime = this.data.loopStart;
    const loopEndTime = this.data.loopEnd;
    const timeline = this.data.timeline.map(event => {
      const eventTime = this.beatToMs(event.beatPosition);
      return {
        ...event,
        judged: eventTime < loopStartTime || eventTime > loopEndTime ? event.judged : false,
        judgment: eventTime < loopStartTime || eventTime > loopEndTime ? event.judgment : null
      };
    });
    this.setData({ timeline });
    
    this.startGameLoop();
  },

  /**
   * 重置循环练习
   */
  onResetLoopPractice() {
    this.pauseGame();
    this.setData({
      loopStartLocked: false,
      loopStart: null,
      loopEnd: null,
      accompanimentMode: false
    });
  },

  /**
   * 检查循环模式（在游戏循环中调用）
   */
  checkLoopMode(currentTime) {
    if (!this.data.loopMode || !this.data.loopEnd) return false;
    
    // 播放到终点后回到起点
    if (currentTime >= this.data.loopEnd) {
      const startTime = this.data.loopStart || 0;
      const speedMultiplier = this.data.speedMultiplier || 1;
      
      // 正确计算 playStartTime，考虑 speedMultiplier
      this.setData({
        currentTime: startTime,
        playStartTime: Date.now() - startTime / speedMultiplier,
        accompanimentMode: false
      });
      
      // 重置循环区间内的判定
      const loopStartTime = this.data.loopStart;
      const loopEndTime = this.data.loopEnd;
      const timeline = this.data.timeline.map(event => {
        const eventTime = this.beatToMs(event.beatPosition);
        return {
          ...event,
          judged: eventTime < loopStartTime || eventTime > loopEndTime ? event.judged : false,
          judgment: eventTime < loopStartTime || eventTime > loopEndTime ? event.judgment : null
        };
      });
      this.setData({ timeline });
      
      return true;
    }
    
    return false;
  },

  /**
   * 切换节拍器
   */
  onToggleMetronome() {
    this.setData({
      metronomeEnabled: !this.data.metronomeEnabled
    });
    
    wx.showToast({
      title: this.data.metronomeEnabled ? '节拍器开' : '节拍器关',
      icon: 'none'
    });
  },

  /**
   * 调整速度（取消注释以启用实时调速）
   */
  onSpeedChange(e) {
    const speedPercent = e.detail.value;
    const newSpeedMultiplier = speedPercent / 100;
    const oldSpeedMultiplier = this.data.speedMultiplier || 1;
    
    // 如果正在播放，需要调整 playStartTime 以保持 currentTime 连续
    // 因为 currentTime = (now - playStartTime) * speedMultiplier
    // 要保持 currentTime 不变：playStartTime = now - currentTime / newSpeed
    if (this.data.isPlaying) {
      const currentTime = this.getCurrentPlayTime();
      this.setData({ 
        speedMultiplier: newSpeedMultiplier,
        playStartTime: Date.now() - currentTime / newSpeedMultiplier
      });
    } else {
      this.setData({ speedMultiplier: newSpeedMultiplier });
    }
  },

  /**
   * 返回按钮
   */
  onBack() {
    if (this.data.isPlaying) {
      this.pauseGame();
    }
    wx.navigateBack();
  },

  /**
   * 初始化拍子圆点
   */
  initBeatDots() {
    const beats = this.data.beatsPerMeasure || 4;
    const dots = [];
    for (let i = 0; i < beats; i++) {
      dots.push({ active: false, strong: i === 0 });
    }
    this.setData({ beatDots: dots });
  },

  /**
   * 锁定到最近的拍子时间点
   */
  snapToNearestBeat(currentTime) {
    const { bpm, beatsPerMeasure } = this.data;
    const msPerBeat = 60000 / bpm;
    const leadInMs = this.beatToMs(this.data.leadInBeats || 2);
    
    // 计算当前时间对应的拍数（相对于leadIn结束后）
    const timeAfterLeadIn = currentTime - leadInMs;
    if (timeAfterLeadIn < 0) {
      // 还在leadIn期间，锁定到leadIn开始
      return 0;
    }
    
    // 锁定到最近的细分（1/4拍）
    const subdivisionsPerBeat = 4;
    const msPerSubdivision = msPerBeat / subdivisionsPerBeat;
    const subdivisionIndex = Math.round(timeAfterLeadIn / msPerSubdivision);
    
    return leadInMs + subdivisionIndex * msPerSubdivision;
  },
  
  /**
   * 调速通用处理 - 暂停播放并锁定时间点
   */
  handleSpeedChange(newBpm) {
    const wasPlaying = this.data.isPlaying;
    
    // 1. 立即暂停播放
    if (wasPlaying) {
      this.stopGameLoop();
    }
    
    // 2. 锁定到最近的拍子时间点（使用旧BPM计算当前拍位置）
    const currentBeatPosition = this.msToBeat(this.getCurrentPlayTime());
    const snappedBeatPosition = Math.round(currentBeatPosition * 4) / 4; // 锁定到1/4拍精度
    
    // 3. 更新BPM
    this.setData({ bpm: newBpm });
    
    // 4. 更新总时长
    this.updateTotalDuration();
    
    // 5. 根据新BPM计算锁定的时间点
    const newCurrentTime = this.beatToMs(snappedBeatPosition);
    
    // 6. 暂停状态，等待用户点击播放
    this.setData({
      currentTime: newCurrentTime,
      isPlaying: false,
      gameState: wasPlaying ? 'paused' : this.data.gameState
    });
    this._currentTime = newCurrentTime; // 同步内部变量
    
    // 7. 同步更新虚影提示（使用新时间点）
    this.updateHints(newCurrentTime);
    
    // 8. 重新渲染谱面
    if (this.data.useImageScroll) {
      this.updateImageScroll(newCurrentTime);
    } else {
      this.renderScore();
    }
  },
  
  /**
   * 减速 - 同时控制节拍器和谱面播放速度
   */
  onDecreaseSpeed() {
    const newBpm = Math.max(5, this.data.bpm - 5);
    this.handleSpeedChange(newBpm);
  },

  /**
   * 加速 - 同时控制节拍器和谱面播放速度
   */
  onIncreaseSpeed() {
    const newBpm = Math.min(180, this.data.bpm + 5);
    this.handleSpeedChange(newBpm);
  },

  /**
   * BPM输入 - 同时控制节拍器和谱面播放速度
   */
  onBpmInput(e) {
    const val = parseInt(e.detail.value);
    if (!isNaN(val) && val >= 5 && val <= 180) {
      this.handleSpeedChange(val);
    }
  },

  stopPropagation() {}
});
