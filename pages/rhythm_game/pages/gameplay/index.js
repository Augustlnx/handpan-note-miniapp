/**
 * 音游主界面 (Rhythm Game Gameplay)
 * 
 * 核心功能：
 * 1. 流式谱面渲染（Canvas2D）
 * 2. 手碟按键响应与音频播放
 * 3. 虚影提示动画（金色收缩提示）
 * 4. 判定系统（Miss/Good/Perfect）
 * 5. 计分机制与连击奖励
 * 6. 动态反馈特效（水波纹、飘字、粒子）
 * 7. 侧边菜单与功能模式
 */
const app = getApp();
const { webAudioManager } = require('../../../../utils/webAudioManager.js');

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
  canvasWidth: 750,          // Canvas逻辑宽度
  measureWidth: 200,         // 每小节宽度
  cursorX: 200,              // 光标X位置（固定）
  preloadMeasures: 8,        // 预加载小节数
  scrollSpeed: 1,            // 滚动速度基数
  leadInTime: 2000,          // 开始前预留时间(ms)
  hintPreloadCount: 3        // 预加载提示音符数
};

Page({
  data: {
    // 游戏状态
    gameState: 'ready', // 'ready', 'playing', 'paused', 'ended'
    isLoading: true,
    loadingProgress: 0,
    
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
    currentBeat: -1,
    beatsPerMeasure: 4
  },

  // Canvas实例
  scoreCanvas: null,
  scoreCtx: null,
  
  // 动画相关
  rafId: null,
  lastFrameTime: 0,
  
  // 音频上下文时间基准
  audioStartTime: 0,

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
      handpanNotes: sheetData.handpanNotes || [],
      residentButtons: sheetData.residentButtons || [],
      handpanVolume: sheetData.handpanVolume || 80,
      displayMode: sheetData.displayMode || 'note',
      beatsPerMeasure: sheetData.timeSignatureBeats || 4
    });
    
    // 初始化游戏
    this.initGame();
  },

  onReady() {
    // 初始化Canvas
    this.initCanvas();
  },

  onUnload() {
    // 清理资源
    this.stopGame();
    wx.showTabBar({ animation: false });
  },

  /**
   * 初始化游戏
   */
  async initGame() {
    this.setData({ isLoading: true, loadingProgress: 0 });
    
    try {
      // 1. 初始化音频
      this.setData({ loadingProgress: 20 });
      await this.initAudio();
      
      // 2. 构建时间线
      this.setData({ loadingProgress: 50 });
      this.buildTimeline();
      
      // 3. 预计算谱面布局
      this.setData({ loadingProgress: 80 });
      this.precomputeLayout();
      
      // 4. 完成
      this.setData({ 
        isLoading: false, 
        loadingProgress: 100,
        gameState: 'ready'
      });
      
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
      await webAudioManager.preloadAllAudio(true);
    } catch (e) {
      console.warn('[Gameplay] 音频初始化警告:', e);
    }
  },

  /**
   * 初始化Canvas
   */
  initCanvas() {
    const query = wx.createSelectorQuery().in(this);
    query.select('#score-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = wx.getWindowInfo().pixelRatio || 2;
          
          canvas.width = res[0].width * dpr;
          canvas.height = res[0].height * dpr;
          ctx.scale(dpr, dpr);
          
          this.scoreCanvas = canvas;
          this.scoreCtx = ctx;
          
          this.setData({
            canvasWidth: res[0].width,
            canvasHeight: res[0].height
          });
          
          // 初始渲染
          this.renderScore();
        }
      });
  },

  /**
   * 构建时间线
   */
  buildTimeline() {
    const sheet = this.data.sheetData;
    if (!sheet || !sheet.notations) return;
    
    const timeline = [];
    const bpm = this.data.bpm;
    const msPerBeat = 60000 / bpm;
    const beatsPerMeasure = this.data.beatsPerMeasure;
    
    let currentTime = RENDER_CONFIG.leadInTime; // 预留开始时间
    let columnIndex = 0;
    
    for (const notation of sheet.notations) {
      if (!notation.measures) continue;
      
      for (let measureIndex = 0; measureIndex < notation.measures.length; measureIndex++) {
        const measure = notation.measures[measureIndex];
        if (!measure.beats) continue;
        
        for (let beatIndex = 0; beatIndex < measure.beats.length; beatIndex++) {
          const beat = measure.beats[beatIndex];
          if (!beat.subdivisions) continue;
          
          const subdivisionsPerBeat = beat.subdivisions.length;
          const msPerSubdivision = msPerBeat / subdivisionsPerBeat;
          
          for (let subIndex = 0; subIndex < beat.subdivisions.length; subIndex++) {
            const sub = beat.subdivisions[subIndex];
            const notes = [];
            
            // 收集该时间点的所有音符
            if (sub.right && sub.right !== '-' && sub.right !== '') {
              notes.push({
                note: sub.right,
                hand: 'right',
                spn: this.getNoteSpn(sub.right)
              });
            }
            if (sub.left && sub.left !== '-' && sub.left !== '') {
              notes.push({
                note: sub.left,
                hand: 'left',
                spn: this.getNoteSpn(sub.left)
              });
            }
            
            if (notes.length > 0) {
              timeline.push({
                time: currentTime,
                notes: notes,
                measureIndex,
                beatIndex,
                subIndex,
                columnIndex,
                judged: false,
                judgment: null
              });
            }
            
            currentTime += msPerSubdivision;
            columnIndex++;
          }
        }
      }
    }
    
    this.setData({
      timeline,
      totalDuration: currentTime
    });
    
    console.log('[Gameplay] 时间线构建完成，共', timeline.length, '个事件');
  },

  /**
   * 获取音符对应的SPN
   */
  getNoteSpn(note) {
    const sheet = this.data.sheetData;
    if (!sheet || !sheet.audioMappings) return '';
    
    // 提取基础音符
    let baseNote = note.replace(/\^\{[^}]*\}/g, '').replace(/[',_*]/g, '');
    
    const mapping = sheet.audioMappings[baseNote];
    return mapping ? mapping[1] : '';
  },

  /**
   * 预计算谱面布局
   */
  precomputeLayout() {
    // 简化版本：后续可以优化为更复杂的布局计算
    console.log('[Gameplay] 布局预计算完成');
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
    this.setData({
      gameState: 'paused',
      isPlaying: false
    });
    this.stopGameLoop();
  },

  /**
   * 继续游戏
   */
  resumeGame() {
    if (this.data.gameState !== 'paused') return;
    
    this.setData({
      gameState: 'playing',
      isPlaying: true,
      playStartTime: Date.now() - this.data.currentTime
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
    const gameLoop = (timestamp) => {
      if (!this.data.isPlaying) return;
      
      // 更新游戏时间
      const speedMultiplier = this.data.speedMultiplier || 1;
      const elapsedTime = (Date.now() - this.data.playStartTime) * speedMultiplier;
      const currentTime = elapsedTime;
      this.setData({ currentTime });
      
      // 检查循环模式
      if (this.checkLoopMode(currentTime)) {
        // 循环了，继续下一帧
        this.rafId = requestAnimationFrame(gameLoop);
        return;
      }
      
      // 更新提示动画
      this.updateHints(currentTime);
      
      // 伴奏模式下不进行判定（循环练习回放时）
      if (!this.data.accompanimentMode) {
        // 检查超时Miss
        this.checkMissedNotes(currentTime);
      }
      
      // 播放节拍器
      if (this.data.metronomeEnabled) {
        this.checkMetronomeBeat(currentTime);
      }
      
      // 更新特效
      this.updateEffects();
      
      // 渲染谱面
      this.renderScore();
      
      // 检查游戏结束（非循环模式）
      if (!this.data.loopMode && currentTime >= this.data.totalDuration) {
        this.endGame();
        return;
      }
      
      this.rafId = requestAnimationFrame(gameLoop);
    };
    
    this.rafId = requestAnimationFrame(gameLoop);
  },

  /**
   * 检查并播放节拍器
   */
  checkMetronomeBeat(currentTime) {
    const { bpm, beatsPerMeasure, currentBeat } = this.data;
    const msPerBeat = 60000 / bpm;
    
    const beatIndex = Math.floor((currentTime - RENDER_CONFIG.leadInTime) / msPerBeat);
    
    if (beatIndex !== currentBeat && beatIndex >= 0) {
      this.setData({ currentBeat: beatIndex });
      
      // 播放节拍器声音（每小节第一拍重音）
      const isFirstBeat = beatIndex % beatsPerMeasure === 0;
      this.playMetronomeTick(isFirstBeat);
    }
  },

  /**
   * 播放节拍器声音
   */
  playMetronomeTick(isAccent) {
    try {
      // 使用简单的音效（可以根据需要替换）
      const note = isAccent ? 'C5' : 'C4';
      webAudioManager.playNote(note, 0.3);
    } catch (e) {
      // 忽略节拍器错误
    }
  },

  /**
   * 停止游戏循环
   */
  stopGameLoop() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  },

  /**
   * 更新虚影提示
   */
  updateHints(currentTime) {
    const { timeline, difficulty } = this.data;
    const config = DIFFICULTY_CONFIG[difficulty];
    
    if (!config.showHint) {
      this.setData({ activeHints: [] });
      return;
    }
    
    // 找出未来hintPreloadCount个需要提示的音符
    const activeHints = [];
    let count = 0;
    
    for (const event of timeline) {
      if (event.judged) continue;
      if (event.time <= currentTime) continue;
      if (count >= RENDER_CONFIG.hintPreloadCount) break;
      
      const timeToHit = event.time - currentTime;
      const hintDuration = config.hintDuration;
      
      if (timeToHit <= hintDuration) {
        const progress = 1 - (timeToHit / hintDuration);
        
        for (const note of event.notes) {
          const noteId = this.findNoteIdBySpn(note.spn);
          if (noteId !== null) {
            activeHints.push({
              noteId,
              spn: note.spn,
              progress,
              eventIndex: timeline.indexOf(event)
            });
          }
        }
      }
      count++;
    }
    
    this.setData({ activeHints });
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
    
    return null;
  },

  /**
   * 检查超时Miss的音符
   */
  checkMissedNotes(currentTime) {
    const { timeline } = this.data;
    let updated = false;
    
    for (let i = 0; i < timeline.length; i++) {
      const event = timeline[i];
      if (event.judged) continue;
      
      // 超过判定窗口的音符标记为Miss
      if (currentTime - event.time > JUDGE_WINDOWS.miss) {
        timeline[i].judged = true;
        timeline[i].judgment = 'miss';
        
        this.handleJudgment('miss', event);
        updated = true;
      }
    }
    
    if (updated) {
      this.setData({ timeline });
    }
  },

  /**
   * 处理判定结果
   */
  handleJudgment(judgment, event) {
    let { score, combo, maxCombo, perfectCount, goodCount, missCount } = this.data;
    
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
    
    this.setData({ score, combo, maxCombo, perfectCount, goodCount, missCount });
    
    // 添加反馈特效
    this.addFeedbackEffect(judgment);
    
    // 更新光标特效
    this.updateCursorEffect(combo);
  },

  /**
   * 添加反馈特效
   */
  addFeedbackEffect(judgment) {
    const effects = [...this.data.feedbackEffects];
    
    effects.push({
      id: Date.now(),
      type: 'judgment',
      value: judgment.toUpperCase(),
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
   * 更新光标特效
   */
  updateCursorEffect(combo) {
    // 连续5个Perfect后光标变金色
    const cursorGolden = combo >= 5 && this.data.perfectCount >= 5;
    this.setData({ cursorGolden });
  },

  /**
   * 更新特效
   */
  updateEffects() {
    const now = Date.now();
    
    // 更新判定特效
    let effects = this.data.feedbackEffects.filter(e => {
      return now - e.startTime < 800;
    }).map(e => ({
      ...e,
      progress: (now - e.startTime) / 800
    }));
    
    // 更新水波纹特效
    let ripples = this.data.rippleEffects.filter(e => {
      return now - e.startTime < 500;
    }).map(e => ({
      ...e,
      progress: (now - e.startTime) / 500
    }));
    
    this.setData({ 
      feedbackEffects: effects,
      rippleEffects: ripples
    });
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
   * 设置音符激活状态
   */
  setNoteActive(noteId, active) {
    const notes = this.data.handpanNotes.map(n => ({
      ...n,
      active: n.id === noteId ? active : n.active
    }));
    this.setData({ handpanNotes: notes });
  },

  /**
   * 播放音符
   */
  playNote(spn) {
    if (!spn) return;
    
    try {
      webAudioManager.playNote(spn, this.data.handpanVolume / 100);
    } catch (e) {
      console.warn('[Gameplay] 播放音符失败:', e);
    }
  },

  /**
   * 判定击打
   */
  judgeHit(spn, noteId) {
    const currentTime = this.data.currentTime;
    const { timeline } = this.data;
    
    // 查找最近的未判定事件
    let closestEvent = null;
    let closestDiff = Infinity;
    
    for (let i = 0; i < timeline.length; i++) {
      const event = timeline[i];
      if (event.judged) continue;
      
      // 检查该事件是否包含对应的音符
      const hasNote = event.notes.some(n => n.spn === spn);
      if (!hasNote) continue;
      
      const diff = Math.abs(currentTime - event.time);
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
    
    // 更新事件状态
    timeline[closestEvent.index].judged = true;
    timeline[closestEvent.index].judgment = judgment;
    this.setData({ timeline });
    
    // 处理判定结果
    this.handleJudgment(judgment, closestEvent.event);
    
    // 添加水波纹特效
    this.addRippleEffect(noteId, judgment);
  },

  /**
   * 添加水波纹特效
   */
  addRippleEffect(noteId, judgment) {
    const ripples = [...this.data.rippleEffects];
    
    let color = '#ffffff'; // miss - 白色
    if (judgment === 'good') color = '#4a90d9'; // good - 蓝色
    if (judgment === 'perfect') color = '#F4D096'; // perfect - 金色
    
    ripples.push({
      id: Date.now(),
      noteId,
      color,
      progress: 0,
      startTime: Date.now()
    });
    
    if (ripples.length > 20) {
      ripples.shift();
    }
    
    this.setData({ rippleEffects: ripples });
  },

  /**
   * 渲染谱面（Canvas）
   */
  renderScore() {
    const ctx = this.scoreCtx;
    if (!ctx) return;
    
    const { canvasWidth, canvasHeight, currentTime, timeline, bpm } = this.data;
    
    // 清空画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // 背景
    ctx.fillStyle = 'rgba(26, 42, 58, 0.95)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // 计算滚动位置
    const msPerBeat = 60000 / bpm;
    const pixelsPerMs = RENDER_CONFIG.measureWidth / (msPerBeat * this.data.beatsPerMeasure);
    const scrollOffset = currentTime * pixelsPerMs;
    
    // 绘制谱面线
    ctx.strokeStyle = 'rgba(178, 232, 232, 0.3)';
    ctx.lineWidth = 1;
    
    // 水平基准线
    const baseY = canvasHeight / 2;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(canvasWidth, baseY);
    ctx.stroke();
    
    // 绘制小节线和音符
    const cursorX = RENDER_CONFIG.cursorX;
    
    for (const event of timeline) {
      const eventX = cursorX + (event.time - currentTime) * pixelsPerMs;
      
      // 只绘制可见范围内的
      if (eventX < -50 || eventX > canvasWidth + 50) continue;
      
      // 绘制音符
      for (const note of event.notes) {
        const y = note.hand === 'right' ? baseY - 30 : baseY + 30;
        const color = note.hand === 'right' ? '#F4D096' : '#314D63';
        
        // 根据判定状态调整透明度
        let alpha = 1;
        if (event.judged) {
          alpha = 0.3;
        }
        
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(eventX, y, 12, 0, Math.PI * 2);
        ctx.fill();
        
        // 音符文字
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getDisplayNote(note.note), eventX, y);
        
        ctx.globalAlpha = 1;
      }
    }
    
    // 绘制光标
    this.renderCursor(ctx, cursorX, baseY);
  },

  /**
   * 绘制光标
   */
  renderCursor(ctx, x, baseY) {
    const { cursorGolden } = this.data;
    
    ctx.strokeStyle = cursorGolden ? '#F4D096' : '#B2E8E8';
    ctx.lineWidth = 3;
    ctx.shadowColor = cursorGolden ? 'rgba(244, 208, 150, 0.6)' : 'rgba(178, 232, 232, 0.6)';
    ctx.shadowBlur = cursorGolden ? 15 : 10;
    
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, this.data.canvasHeight);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
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
      const nearestEvent = this.findNearestEvent(this.data.currentTime);
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
   */
  findNearestEvent(time) {
    const { timeline } = this.data;
    let closestEvent = null;
    let closestDiff = Infinity;
    
    for (const event of timeline) {
      const diff = Math.abs(event.time - time);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestEvent = event;
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
    this.touchStartTime = this.data.currentTime;
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
    const pixelsPerMs = RENDER_CONFIG.measureWidth / (msPerBeat * beatsPerMeasure);
    const timeDelta = -deltaX / pixelsPerMs;
    
    let newTime = Math.max(0, Math.min(this.touchStartTime + timeDelta, this.data.totalDuration));
    
    this.setData({ currentTime: newTime });
    this.renderScore();
  },

  /**
   * 谱面拖动结束
   */
  onScoreTouchEnd() {
    if (!this.data.freePositionMode && !this.data.loopMode) return;
    
    // 吸附到最近的音符
    const nearestEvent = this.findNearestEvent(this.data.currentTime);
    if (nearestEvent) {
      this.setData({ currentTime: nearestEvent.time });
      this.renderScore();
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
    
    this.setData({
      currentTime: startTime,
      accompanimentMode: true,
      playStartTime: Date.now() - startTime,
      gameState: 'playing',
      isPlaying: true
    });
    
    // 重置该区间的判定
    const timeline = this.data.timeline.map(event => ({
      ...event,
      judged: event.time < this.data.loopStart || event.time > this.data.loopEnd ? event.judged : false,
      judgment: event.time < this.data.loopStart || event.time > this.data.loopEnd ? event.judgment : null
    }));
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
      this.setData({
        currentTime: startTime,
        playStartTime: Date.now() - startTime,
        accompanimentMode: false
      });
      
      // 重置循环区间内的判定
      const timeline = this.data.timeline.map(event => ({
        ...event,
        judged: event.time < this.data.loopStart || event.time > this.data.loopEnd ? event.judged : false,
        judgment: event.time < this.data.loopStart || event.time > this.data.loopEnd ? event.judgment : null
      }));
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
   * 调整速度
   */
  onSpeedChange(e) {
    const speedPercent = e.detail.value;
    const speedMultiplier = speedPercent / 100;
    this.setData({ speedMultiplier });
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

  stopPropagation() {}
});
