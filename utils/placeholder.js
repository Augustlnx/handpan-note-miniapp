/**
 * 曲谱播放管理器 (Sheet Playback Manager)
 * 
 * 核心功能：
 * 1. 预计算时间线队列 (Timeline Queue)
 * 2. Web Audio API 音频管理（带动态压缩器防爆音）
 * 3. requestAnimationFrame 驱动的精确播放
 * 4. 节拍器同步支持
 * 5. 分页预加载与双缓冲渲染
 * 
 * 技术架构：
 * - 时间驱动而非递归 setTimeout
 * - 资源优先策略（先加载后倒计时）
 * - 动态压缩器防止和弦爆音
 * - DOM 回收机制防止 DOM Limit
 */

class SheetPlaybackManager {
  constructor() {
    // ===== Web Audio 相关 =====
    this.audioContext = null;
    this.masterGain = null;
    this.compressor = null; // 动态压缩器
    this.audioBuffers = new Map(); // { soundKey: AudioBuffer }
    this.gainNodes = new Map();
    
    // ===== 播放状态 =====
    this.isInitialized = false;
    this.isPlaying = false;
    this.isPaused = false;
    this.isLoading = false;
    
    // ===== 时间线队列 =====
    this.timeline = []; // [{ absoluteTime, soundKeys, columnId, pageIndex, measureIndex, beatIndex, subdivisionIndex }]
    this.currentEventIndex = 0;
    this.playbackStartTime = 0; // audioContext.currentTime 起始点
    this.playbackOffset = 0; // 从第几秒开始播放
    
    // ===== 节拍器相关 =====
    this.metronomeEnabled = false;
    this.metronomeBuffer = null; // 节拍器音频
    this.lastMetronomeBeat = -1;
    this.beatsPerMeasure = 4;
    this.subdivisionsPerBeat = 4;
    
    // ===== 配置 =====
    this.tempo = 60; // BPM
    this.notationType = 'digital'; // 'digital' 或 'simplified'
    
    // 音符到音频文件的映射
    this.soundMappings = {
      digital: {
        '1': '/subpackages/audio/sound/sound1.mp3',
        '2': '/subpackages/audio/sound/sound2.mp3',
        '3': '/subpackages/audio/sound/sound3.mp3',
        '4': '/subpackages/audio/sound/sound4.mp3',
        '5': '/subpackages/audio/sound/sound5.mp3',
        '6': '/subpackages/audio/sound/sound6.mp3',
        '7': '/subpackages/audio/sound/sound7.mp3',
        '8': '/subpackages/audio/sound/sound8.mp3',
        '9': '/subpackages/audio/sound/sound9.mp3',
        'D': '/subpackages/audio/sound/soundD.mp3'
      },
      simplified: {
        '3': '/subpackages/audio/sound/sound1.mp3',
        '4': '/subpackages/audio/sound/sound2.mp3',
        '5': '/subpackages/audio/sound/sound3.mp3',
        '6': '/subpackages/audio/sound/sound4.mp3',
        '7': '/subpackages/audio/sound/sound5.mp3',
        "1'": '/subpackages/audio/sound/sound6.mp3',
        "2'": '/subpackages/audio/sound/sound7.mp3',
        "3'": '/subpackages/audio/sound/sound8.mp3',
        "5'": '/subpackages/audio/sound/sound9.mp3',
        'D': '/subpackages/audio/sound/soundD.mp3'
      }
    };
    
    // 节拍器预备拍音频
    this.countdownSoundUrl = '/assets/metronome/soundhigh.mp3';
    this.metronomeSoundUrl = '/assets/metronome/soundlow.mp3';
    
    // ===== 回调函数 =====
    this.onColumnHighlight = null; // (columnInfo) => void
    this.onPageChange = null; // (pageIndex, preloadNext) => void
    this.onPlaybackEnd = null; // () => void
    this.onLoadingStateChange = null; // (isLoading, message) => void
    this.onCountdownTick = null; // (secondsLeft) => void
    this.onMetronomeBeat = null; // (beatIndex, isAccent) => void
    this.onError = null; // (error) => void
    
    // ===== RAF 控制 =====
    this._rafId = null;
    this._lastFrameTime = 0;
    
    // ===== 音量配置 =====
    this.volumeConfig = {
      master: 0.8,
      notes: 0.7,
      metronome: 0.6,
      countdown: 0.8
    };
  }

  /**
   * 初始化 Web Audio 上下文
   * 包含动态压缩器以防止多音符同时播放时的爆音
   */
  async init() {
    if (this.isInitialized) return true;

    try {
      this.audioContext = wx.createWebAudioContext();
      
      // 创建动态压缩器（防爆音核心）
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -10; // 压缩阈值
      this.compressor.ratio.value = 12; // 压缩比
      this.compressor.attack.value = 0.003; // 起音时间
      this.compressor.release.value = 0.25; // 释放时间
      this.compressor.knee.value = 30; // 拐点平滑度
      
      // 创建主增益节点
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volumeConfig.master;
      
      // 音频链路: Source -> GainNode -> CompressorNode -> Destination
      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.audioContext.destination);
      
      this.isInitialized = true;
      console.log('[SheetPlaybackManager] Web Audio 初始化成功（含动态压缩器）');
      return true;
    } catch (e) {
      console.error('[SheetPlaybackManager] 初始化失败:', e);
      if (this.onError) this.onError(e);
      return false;
    }
  }

  /**
   * 从音符字符串中提取有效的主音符
   * @param {string} noteStr - 音符字符串
   * @param {string} notationType - 谱式类型
   * @returns {string|null} 有效的音符键或null
   */
  _extractNoteKey(noteStr, notationType = 'digital') {
    if (!noteStr || typeof noteStr !== 'string') return null;
    
    // 移除上标标记如 (d), (s) 等，只提取主音符
    let cleaned = noteStr.replace(/[()]/g, '').trim();
    if (!cleaned || cleaned === '-' || cleaned === '+' || cleaned === 's' || cleaned === 'd') return null;
    
    // 去掉下划线（32分音符标记）
    cleaned = cleaned.replace(/_/g, '');
    if (!cleaned) return null;
    
    // 根据谱式类型处理
    const mappings = this.soundMappings[notationType] || this.soundMappings.digital;
    
    // 直接检查映射表中是否有该音符
    if (mappings[cleaned]) {
      return cleaned;
    }
    
    // 处理简谱中的升八度标记（如 1', 2'）
    if (notationType === 'simplified' && cleaned.endsWith("'")) {
      const baseNote = cleaned;
      if (mappings[baseNote]) {
        return baseNote;
      }
    }
    
    return null;
  }

  /**
   * 分析谱面，提取所需的音符集合
   * @param {Array} notations - 谱面数据
   * @param {string} notationType - 谱式类型
   * @returns {Set} 需要加载的音符集合
   */
  analyzeRequiredNotes(notations, notationType = 'digital') {
    const requiredNotes = new Set();
    
    if (!notations || !Array.isArray(notations)) return requiredNotes;
    
    const extractNote = (noteStr) => {
      return this._extractNoteKey(noteStr, notationType);
    };
    
    notations.forEach(notation => {
      if (!notation.measures) return;
      notation.measures.forEach(measure => {
        if (!measure.beats) return;
        measure.beats.forEach(beat => {
          if (!beat.subdivisions) return;
          beat.subdivisions.forEach(sub => {
            // 检查右手
            if (Array.isArray(sub.rightHand)) {
              sub.rightHand.forEach(note => {
                const n = extractNote(note);
                if (n) requiredNotes.add(n);
              });
            }
            // 检查左手
            if (Array.isArray(sub.leftHand)) {
              sub.leftHand.forEach(note => {
                const n = extractNote(note);
                if (n) requiredNotes.add(n);
              });
            }
          });
        });
      });
    });
    
    return requiredNotes;
  }

  /**
   * 加载指定音符的音频文件
   * @param {Set|Array} notes - 需要加载的音符
   * @param {string} notationType - 谱式类型
   * @returns {Promise<{success: boolean, loaded: number, failed: number}>}
   */
  async loadSounds(notes, notationType = 'digital') {
    if (!this.isInitialized) {
      const initResult = await this.init();
      if (!initResult) return { success: false, loaded: 0, failed: notes.size || notes.length };
    }
    
    this.notationType = notationType;
    const mappings = this.soundMappings[notationType] || this.soundMappings.digital;
    const noteArray = Array.from(notes);
    
    let loaded = 0;
    let failed = 0;
    
    // 同时加载倒计时和节拍器音频
    const loadPromises = [
      this._loadAndDecodeAudio('_countdown', this.countdownSoundUrl),
      this._loadAndDecodeAudio('_metronome', this.metronomeSoundUrl)
    ];
    
    // 加载所需音符
    noteArray.forEach(note => {
      const url = mappings[note];
      if (url && !this.audioBuffers.has(note)) {
        loadPromises.push(
          this._loadAndDecodeAudio(note, url)
            .then(result => {
              if (result) loaded++;
              else failed++;
              return result;
            })
        );
      } else if (this.audioBuffers.has(note)) {
        loaded++;
      }
    });
    
    try {
      await Promise.all(loadPromises);
      console.log(`[SheetPlaybackManager] 音频加载完成: ${loaded}成功, ${failed}失败`);
      return { success: failed === 0, loaded, failed };
    } catch (e) {
      console.error('[SheetPlaybackManager] 音频加载异常:', e);
      return { success: false, loaded, failed };
    }
  }

  /**
   * 加载并解码单个音频文件
   * @private
   */
  async _loadAndDecodeAudio(soundId, url) {
    return new Promise((resolve) => {
      const fs = wx.getFileSystemManager();
      
      fs.readFile({
        filePath: url,
        success: (res) => {
          this.audioContext.decodeAudioData(
            res.data,
            (audioBuffer) => {
              this.audioBuffers.set(soundId, audioBuffer);
              
              // 创建独立增益节点
              const gainNode = this.audioContext.createGain();
              gainNode.gain.value = this.volumeConfig.notes;
              gainNode.connect(this.masterGain);
              this.gainNodes.set(soundId, gainNode);
              
              resolve(true);
            },
            (err) => {
              console.warn(`[SheetPlaybackManager] 解码失败 ${soundId}:`, err);
              resolve(false);
            }
          );
        },
        fail: (err) => {
          console.warn(`[SheetPlaybackManager] 读取失败 ${soundId}:`, err);
          resolve(false);
        }
      });
    });
  }

  /**
   * 生成播放时间线
   * 预计算所有音符事件的绝对时间
   * 
   * @param {Array} notations - 谱面数据
   * @param {number} tempo - BPM
   * @param {number} startColumnId - 起始列ID（可选，用于从选中位置开始）
   * @param {Object} pageInfo - 分页信息 { pages, currentPage }
   * @returns {Array} 时间线事件队列
   */
  generateTimeline(notations, tempo, startColumnId = null, pageInfo = null) {
    this.timeline = [];
    this.tempo = tempo;
    
    if (!notations || !Array.isArray(notations) || notations.length === 0) {
      return this.timeline;
    }
    
    const beatDuration = 60 / tempo; // 每拍秒数
    let absoluteTime = 0;
    let globalColumnIndex = 0;
    let foundStartColumn = startColumnId === null;
    
    // 计算每个音符列对应的页码
    const getPageIndexForModule = (moduleIndex) => {
      if (!pageInfo || !pageInfo.pages) return 0;
      for (let i = 0; i < pageInfo.pages.length; i++) {
        const page = pageInfo.pages[i];
        const moduleInPage = page.modules.find(m => m.index === moduleIndex);
        if (moduleInPage) return i;
      }
      return 0;
    };
    
    notations.forEach((notation, moduleIndex) => {
      if (!notation.measures) return;
      
      const pageIndex = getPageIndexForModule(moduleIndex);
      
      notation.measures.forEach((measure, measureIndex) => {
        if (!measure.beats) return;
        
        // 计算每小节的节拍数（用于节拍器同步）
        this.beatsPerMeasure = measure.beats.length;
        
        measure.beats.forEach((beat, beatIndex) => {
          if (!beat.subdivisions) return;
          
          this.subdivisionsPerBeat = beat.subdivisions.length;
          const subdivisionDuration = beatDuration / beat.subdivisions.length;
          
          beat.subdivisions.forEach((sub, subIndex) => {
            const columnId = `${moduleIndex}-${measureIndex}-${beatIndex}-${subIndex}`;
            
            // 检查是否到达起始位置
            if (!foundStartColumn && startColumnId === columnId) {
              foundStartColumn = true;
              absoluteTime = 0; // 重置时间
            }
            
            if (!foundStartColumn) {
              absoluteTime += subdivisionDuration;
              globalColumnIndex++;
              return;
            }
            
            // 提取该列的所有音符
            const soundKeys = [];
            let hasUnderline = false;
            
            const extractNotes = (noteArray) => {
              if (!Array.isArray(noteArray)) return;
              noteArray.forEach(note => {
                if (!note || typeof note !== 'string') return;
                const cleaned = note.replace(/[()]/g, '').trim();
                if (!cleaned || cleaned === '-' || cleaned === '+') return;
                
                // 检查是否带下划线（32分音符）
                if (cleaned.includes('_')) {
                  hasUnderline = true;
                }
                
                // 使用统一的音符提取方法
                const noteKey = this._extractNoteKey(note, this.notationType);
                if (noteKey && this.audioBuffers.has(noteKey)) {
                  soundKeys.push(noteKey);
                }
              });
            };
            
            extractNotes(sub.rightHand);
            extractNotes(sub.leftHand);
            
            // 添加到时间线
            this.timeline.push({
              absoluteTime,
              soundKeys,
              columnId,
              pageIndex,
              moduleIndex,
              measureIndex,
              beatIndex,
              subdivisionIndex: subIndex,
              isFirstBeat: beatIndex === 0 && subIndex === 0,
              globalColumnIndex
            });
            
            // 计算下一个事件的时间
            // 带下划线的音符是32分音符，时值减半
            const duration = hasUnderline ? subdivisionDuration / 2 : subdivisionDuration;
            absoluteTime += duration;
            globalColumnIndex++;
          });
        });
      });
    });
    
    console.log(`[SheetPlaybackManager] 生成时间线: ${this.timeline.length} 个事件`);
    return this.timeline;
  }

  /**
   * 开始播放
   * 包含资源检查和倒计时
   * 
   * @param {Array} notations - 谱面数据
   * @param {number} tempo - BPM
   * @param {string} notationType - 谱式类型
   * @param {string} startColumnId - 起始列ID
   * @param {Object} pageInfo - 分页信息
   */
  async startPlayback(notations, tempo, notationType, startColumnId = null, pageInfo = null) {
    if (this.isPlaying) {
      this.stopPlayback();
    }
    
    this.isLoading = true;
    if (this.onLoadingStateChange) {
      this.onLoadingStateChange(true, '正在分析谱面...');
    }
    
    try {
      // 1. 分析所需音符
      const requiredNotes = this.analyzeRequiredNotes(notations, notationType);
      console.log('[SheetPlaybackManager] 所需音符:', Array.from(requiredNotes));
      
      // 2. 检查并加载音频资源
      if (this.onLoadingStateChange) {
        this.onLoadingStateChange(true, '加载音频资源...');
      }
      
      const loadResult = await this.loadSounds(requiredNotes, notationType);
      if (!loadResult.success && loadResult.loaded === 0) {
        throw new Error('音频资源加载失败');
      }
      
      // 3. 生成时间线
      if (this.onLoadingStateChange) {
        this.onLoadingStateChange(true, '生成播放时间线...');
      }
      
      this.generateTimeline(notations, tempo, startColumnId, pageInfo);
      if (this.timeline.length === 0) {
        throw new Error('谱面为空或无有效音符');
      }
      
      this.isLoading = false;
      if (this.onLoadingStateChange) {
        this.onLoadingStateChange(false, '');
      }
      
      // 4. 开始倒计时
      await this._startCountdown();
      
      // 5. 开始播放
      this._beginPlayback();
      
    } catch (e) {
      console.error('[SheetPlaybackManager] 播放启动失败:', e);
      this.isLoading = false;
      if (this.onLoadingStateChange) {
        this.onLoadingStateChange(false, '');
      }
      if (this.onError) {
        this.onError(e);
      }
    }
  }

  /**
   * 倒计时（带预备拍）
   * @private
   */
  async _startCountdown() {
    const beatDuration = 60000 / this.tempo; // 毫秒
    
    // 3秒倒计时，每拍一次
    for (let i = 3; i >= 1; i--) {
      if (this.onCountdownTick) {
        this.onCountdownTick(i);
      }
      
      // 播放预备拍声音
      this._playSound('_countdown', this.volumeConfig.countdown);
      
      // 等待一拍
      await this._sleep(beatDuration);
    }
    
    if (this.onCountdownTick) {
      this.onCountdownTick(0);
    }
  }

  /**
   * 开始实际播放
   * @private
   */
  _beginPlayback() {
    this.isPlaying = true;
    this.isPaused = false;
    this.currentEventIndex = 0;
    this.playbackStartTime = this.audioContext.currentTime;
    this.lastMetronomeBeat = -1;
    
    // 启动 RAF 循环
    this._startRAFLoop();
  }

  /**
   * RAF 循环 - 核心播放驱动
   * @private
   */
  _startRAFLoop() {
    const loop = () => {
      if (!this.isPlaying || this.isPaused) return;
      
      const currentTime = this.audioContext.currentTime - this.playbackStartTime;
      
      // 处理当前时间点的所有事件
      while (
        this.currentEventIndex < this.timeline.length &&
        this.timeline[this.currentEventIndex].absoluteTime <= currentTime + 0.02 // 20ms 提前量
      ) {
        const event = this.timeline[this.currentEventIndex];
        
        // 播放音符
        if (event.soundKeys && event.soundKeys.length > 0) {
          this._playSounds(event.soundKeys);
        }
        
        // 触发高亮回调
        if (this.onColumnHighlight) {
          this.onColumnHighlight({
            columnId: event.columnId,
            pageIndex: event.pageIndex,
            moduleIndex: event.moduleIndex,
            measureIndex: event.measureIndex,
            beatIndex: event.beatIndex,
            subdivisionIndex: event.subdivisionIndex,
            isFirstBeat: event.isFirstBeat
          });
        }
        
        // 检查是否需要切页
        if (this.onPageChange) {
          const nextEvent = this.timeline[this.currentEventIndex + 1];
          if (nextEvent && nextEvent.pageIndex !== event.pageIndex) {
            // 提前通知切页
            this.onPageChange(nextEvent.pageIndex, true);
          }
        }
        
        // 节拍器同步
        if (this.metronomeEnabled && event.isFirstBeat) {
          this._playMetronomeTick(true);
        } else if (this.metronomeEnabled && event.subdivisionIndex === 0) {
          this._playMetronomeTick(false);
        }
        
        this.currentEventIndex++;
      }
      
      // 检查是否播放完成
      if (this.currentEventIndex >= this.timeline.length) {
        this.stopPlayback();
        if (this.onPlaybackEnd) {
          this.onPlaybackEnd();
        }
        return;
      }
      
      this._rafId = requestAnimationFrame(loop);
    };
    
    this._rafId = requestAnimationFrame(loop);
  }

  /**
   * 播放多个音符（和弦）
   * @private
   */
  _playSounds(soundKeys) {
    if (!soundKeys || soundKeys.length === 0) return;
    
    // 根据同时播放的音符数量调整音量（防止叠加爆音）
    const volumeMultiplier = soundKeys.length > 1 
      ? 0.8 / Math.sqrt(soundKeys.length) 
      : 1;
    
    soundKeys.forEach(key => {
      this._playSound(key, this.volumeConfig.notes * volumeMultiplier);
    });
  }

  /**
   * 播放单个音频
   * @private
   */
  _playSound(soundId, volume = 0.7) {
    const buffer = this.audioBuffers.get(soundId);
    if (!buffer || !this.audioContext) return;
    
    try {
      const source = this.audioContext.createBufferSource();
      source.buffer = buffer;
      
      // 获取或创建增益节点
      let gainNode = this.gainNodes.get(soundId);
      if (!gainNode) {
        gainNode = this.audioContext.createGain();
        gainNode.connect(this.masterGain);
        this.gainNodes.set(soundId, gainNode);
      }
      
      gainNode.gain.value = volume;
      source.connect(gainNode);
      source.start(0);
      
      source.onended = () => {
        try { source.disconnect(); } catch (e) {}
      };
    } catch (e) {
      console.warn('[SheetPlaybackManager] 播放失败:', soundId, e);
    }
  }

  /**
   * 播放节拍器音效
   * @private
   */
  _playMetronomeTick(isAccent) {
    const soundId = isAccent ? '_countdown' : '_metronome';
    this._playSound(soundId, this.volumeConfig.metronome);
    
    if (this.onMetronomeBeat) {
      this.onMetronomeBeat(isAccent ? 0 : -1, isAccent);
    }
  }

  /**
   * 停止播放
   */
  stopPlayback() {
    this.isPlaying = false;
    this.isPaused = false;
    
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
    
    this.currentEventIndex = 0;
    this.lastMetronomeBeat = -1;
    
    console.log('[SheetPlaybackManager] 播放已停止');
  }

  /**
   * 暂停播放
   */
  pausePlayback() {
    if (!this.isPlaying) return;
    this.isPaused = true;
    this.playbackOffset = this.audioContext.currentTime - this.playbackStartTime;
  }

  /**
   * 恢复播放
   */
  resumePlayback() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.playbackStartTime = this.audioContext.currentTime - this.playbackOffset;
    this._startRAFLoop();
  }

  /**
   * 启用/禁用节拍器
   */
  setMetronomeEnabled(enabled) {
    this.metronomeEnabled = enabled;
  }

  /**
   * 在播放过程中同步启动节拍器
   * 会等待下一个正拍再开始
   */
  syncMetronomeStart() {
    this.metronomeEnabled = true;
    // 节拍器会在下一个 isFirstBeat 事件触发时自动同步
  }

  /**
   * 设置主音量
   */
  setMasterVolume(volume) {
    this.volumeConfig.master = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.value = this.volumeConfig.master;
    }
  }

  /**
   * 获取当前播放进度
   * @returns {{ currentTime: number, totalTime: number, progress: number }}
   */
  getProgress() {
    if (!this.isPlaying || this.timeline.length === 0) {
      return { currentTime: 0, totalTime: 0, progress: 0 };
    }
    
    const currentTime = this.audioContext.currentTime - this.playbackStartTime;
    const totalTime = this.timeline[this.timeline.length - 1].absoluteTime;
    
    return {
      currentTime,
      totalTime,
      progress: Math.min(1, currentTime / totalTime)
    };
  }

  /**
   * 检查是否已准备就绪
   */
  isReady() {
    return this.isInitialized && this.audioBuffers.size > 0;
  }

  /**
   * 销毁并释放资源
   */
  destroy() {
    this.stopPlayback();
    
    // 清理增益节点
    this.gainNodes.forEach(node => {
      try { node.disconnect(); } catch (e) {}
    });
    this.gainNodes.clear();
    
    // 清理音频缓冲区
    this.audioBuffers.clear();
    
    // 清理压缩器和主增益
    try {
      if (this.compressor) this.compressor.disconnect();
      if (this.masterGain) this.masterGain.disconnect();
    } catch (e) {}
    
    // 关闭音频上下文
    try {
      if (this.audioContext) this.audioContext.close();
    } catch (e) {}
    
    this.audioContext = null;
    this.masterGain = null;
    this.compressor = null;
    this.isInitialized = false;
    this.timeline = [];
    
    console.log('[SheetPlaybackManager] 资源已释放');
  }

  /**
   * 辅助函数：sleep
   * @private
   */
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// 导出单例
const sheetPlaybackManager = new SheetPlaybackManager();

module.exports = {
  sheetPlaybackManager,
  SheetPlaybackManager
};
