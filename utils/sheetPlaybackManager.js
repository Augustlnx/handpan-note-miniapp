/**
 * 曲谱播放管理器 (Sheet Playback Manager)
 * 
 * 核心功能：
 * 1. 预计算时间线队列 (Timeline Queue)
 * 2. Web Audio API 音频管理（带动态压缩器防爆音）
 * 3. requestAnimationFrame 驱动的精确播放
 * 4. 节拍器同步支持
 * 5. 分页预加载与双缓冲渲染
 * 6. 装饰音识别与播放
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
    
    // ===== 音频文件目录缓存 =====
    this.availableAudioFiles = new Set(); // 缓存可用的音频文件名
    this.audioFilesLoaded = false; // 是否已加载音频文件列表
    
    // ===== 音频映射配置 =====
    // 用户自定义的音频映射表（数字谱/简谱 -> SPN）
    this.customAudioMappings = null;
    
    // 默认SPN音频基础路径
    this.audioBasePath = '/subpackages/audio/sound/';
    
    // 特殊音符的默认SPN映射
    // d/T/K 特殊处理：按优先级查找对应音频文件
    this.specialNoteMappings = {
      's': 'SLAP',      // 闷音
      'd': 'd',         // d音
      'T': 'T',         // T音
      'K': 'K',         // K音
      'P': 'P',         // P音
      'x': 'x',         // x音
      'F': 'x',         // F音，映射到x
      '·': 'x'          // 中圆点，映射到x
    };
    
    // 特殊音符的音量调整
    this.specialNoteVolumes = {
      '·': 1,
      'x': 1,
      'P': 1,
      'F': 1
    };
    
    // 节拍器预备拍音频
    this.countdownSoundUrl = '/assets/metronome/soundhigh.mp3';
    this.metronomeSoundUrl = '/assets/metronome/soundlow.mp3';
    
    // ===== 循环模式 =====
    this.loopEnabled = false;
    
    // ===== 回调函数 =====
    this.onColumnHighlight = null; // (columnInfo) => void
    this.onPageChange = null; // (pageIndex, preloadNext) => void
    this.onPlaybackEnd = null; // () => void
    this.onLoadingStateChange = null; // (isLoading, message) => void
    this.onCountdownTick = null; // (secondsLeft) => void
    this.onMetronomeBeat = null; // (beatIndex, isAccent) => void
    this.onProgressUpdate = null; // (currentTime, totalTime) => void
    this.onError = null; // (error) => void
    
    // ===== RAF 控制 =====
    this._rafId = null;
    this._lastFrameTime = 0;
    
    // ===== 音量配置 =====
    this.volumeConfig = {
      master: 0.8,
      notes: 0.7,
      metronome: 0.6,
      countdown: 0.8,
      graceNote: 0.7 * 0.7 // 装饰音音量 = 主音量 * 70%
    };
    
    // ===== 装饰音配置 =====
    this.graceNoteConfig = {
      durationRatio: 0.25,  // 装饰音时长 = 主音符时长 * 25%
      volumeRatio: 0.7,     // 装饰音音量 = 主音音量 * 70%
      minDuration: 20,      // 最小时长 20ms
      maxDuration: 50       // 最大时长 50ms
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
   * 加载可用的音频文件列表（首次打开时缓存）
   * @returns {Promise<Set<string>>} 可用的音频文件名集合
   */
  async loadAvailableAudioFiles() {
    if (this.audioFilesLoaded) {
      return this.availableAudioFiles;
    }
    
    return new Promise((resolve) => {
      const fs = wx.getFileSystemManager();
      try {
        fs.readdir({
          dirPath: `${wx.env.USER_DATA_PATH}/../../../subpackages/audio/sound`,
          success: (res) => {
            // 提取.mp3文件名（不含扩展名）
            res.files.forEach(file => {
              if (file.endsWith('.mp3')) {
                this.availableAudioFiles.add(file.replace('.mp3', ''));
              }
            });
            this.audioFilesLoaded = true;
            console.log('[SheetPlaybackManager] 可用音频文件:', Array.from(this.availableAudioFiles));
            resolve(this.availableAudioFiles);
          },
          fail: (err) => {
            console.warn('[SheetPlaybackManager] 读取音频目录失败，使用预设列表:', err);
            // 使用预设的音频文件列表（包含特殊音符音频）
            const presetFiles = [
              'A3', 'A4', 'A5', 'Bb3', 'Bb5', 'C4', 'C5', 'C6',
              'D3', 'D4', 'D5', 'E3', 'E4', 'E5', 'F3', 'F4', 'F5',
              'G3', 'G4', 'G5', 'SLAP',
              'd', 'T', 'K', 'P', 'x'  // 特殊音符音频
            ];
            presetFiles.forEach(f => this.availableAudioFiles.add(f));
            this.audioFilesLoaded = true;
            resolve(this.availableAudioFiles);
          }
        });
      } catch (e) {
        console.warn('[SheetPlaybackManager] 读取音频目录异常:', e);
        // 使用预设列表（包含特殊音符音频）
        const presetFiles = [
          'A3', 'A4', 'A5', 'Bb3', 'Bb5', 'C4', 'C5', 'C6',
          'D3', 'D4', 'D5', 'E3', 'E4', 'E5', 'F3', 'F4', 'F5',
          'G3', 'G4', 'G5', 'SLAP',
          'd', 'T', 'K', 'P', 'x'  // 特殊音符音频
        ];
        presetFiles.forEach(f => this.availableAudioFiles.add(f));
        this.audioFilesLoaded = true;
        resolve(this.availableAudioFiles);
      }
    });
  }

  /**
   * 设置自定义音频映射表
   * @param {Array} mappings - 映射数组 [{key, simplified, spn}]
   */
  setCustomAudioMappings(mappings) {
    this.customAudioMappings = mappings;
    console.log('[SheetPlaybackManager] 设置自定义音频映射:', mappings);
  }

  /**
   * 根据音符获取对应的SPN音频文件名
   * @param {string} note - 音符字符串
   * @param {string} notationType - 谱式类型 ('digital' 或 'simplified')
   * @returns {{spn: string, volume: number}|null} SPN名称和音量
   */
  getNoteAudioInfo(note, notationType = 'digital') {
    if (!note || typeof note !== 'string') return null;
    
    // 清理音符字符串
    let cleaned = note.replace(/[()]/g, '').trim();
    if (!cleaned || cleaned === '-' || cleaned === '+') return null;
    
    // 去掉下划线（时值标记）
    cleaned = cleaned.replace(/_/g, '');
    if (!cleaned) return null;
    
    // 处理左上标 ^{...} - 提取主音符部分
    let mainNote = cleaned;
    if (cleaned.includes('^{')) {
      // 去掉左上标部分
      mainNote = cleaned.replace(/\^{[^}]*}/g, '').trim();
    }
    
    // 检查特殊音符
    if (this.specialNoteMappings[mainNote]) {
      let spn;
      
      // d/T/K 特殊处理：按优先级查找音频文件
      if (mainNote === 'd') {
        spn = this.availableAudioFiles.has('d') ? 'd' 
            : this.availableAudioFiles.has('T') ? 'T'
            : this.availableAudioFiles.has('K') ? 'K'
            : 'D3';
      } else if (mainNote === 'T') {
        spn = this.availableAudioFiles.has('T') ? 'T' 
            : this.availableAudioFiles.has('d') ? 'd'
            : this.availableAudioFiles.has('K') ? 'K'
            : 'D3';
      } else if (mainNote === 'K') {
        spn = this.availableAudioFiles.has('K') ? 'K' 
            : this.availableAudioFiles.has('T') ? 'T'
            : this.availableAudioFiles.has('d') ? 'd'
            : 'D3';
      } else {
        // 其他特殊音符：如果有对应音频就用，否则用默认映射
        spn = this.availableAudioFiles.has(mainNote) 
          ? mainNote 
          : this.specialNoteMappings[mainNote];
      }
      
      return {
        spn: spn,
        volume: this.specialNoteVolumes[mainNote] || 1.0
      };
    }
    
    // 如果有自定义映射表，使用自定义映射
    if (this.customAudioMappings && Array.isArray(this.customAudioMappings)) {
      let mapping;
      if (notationType === 'digital') {
        // 数字谱模式：用数字谱的key查找
        mapping = this.customAudioMappings.find(m => m.key === mainNote);
      } else {
        // 简谱模式：用简谱的值查找
        mapping = this.customAudioMappings.find(m => m.simplified === mainNote);
      }
      
      if (mapping && mapping.spn) {
        return { spn: mapping.spn, volume: 1.0 };
      }
    }
    
    // 默认处理：直接尝试使用音符名作为SPN
    // 处理简谱的八度标记
    if (notationType === 'simplified') {
      // 处理 1', 2', 等高八度标记
      let baseNote = mainNote.replace(/[',]/g, '');
      let octaveUp = (mainNote.match(/'/g) || []).length;
      let octaveDown = (mainNote.match(/,/g) || []).length;
      
      // 简谱数字到音名的映射（默认以C4为基准）
      const simplifiedToNote = {
        '1': 'C', '2': 'D', '3': 'E', '4': 'F', 
        '5': 'G', '6': 'A', '7': 'B'
      };
      
      if (simplifiedToNote[baseNote]) {
        const noteName = simplifiedToNote[baseNote];
        const octave = 4 + octaveUp - octaveDown; // 默认中央C为4
        const spn = `${noteName}${octave}`;
        
        if (this.availableAudioFiles.has(spn)) {
          return { spn, volume: 1.0 };
        }
      }
    }
    
    // 如果音符本身就是SPN格式（如 A3, D4）
    if (this.availableAudioFiles.has(mainNote)) {
      return { spn: mainNote, volume: 1.0 };
    }
    
    return null;
  }

  /**
   * 从音符字符串中提取装饰音（左上标）
   * @param {string} noteStr - 音符字符串，如 ^{1}7 或 (^{1}7_)
   * @returns {string|null} 装饰音字符串或null
   */
  extractGraceNote(noteStr) {
    if (!noteStr || typeof noteStr !== 'string') return null;
    
    // 【修复】先去掉括号，再匹配左上标 ^{...}
    const cleaned = noteStr.replace(/[()]/g, '').trim();
    if (!cleaned) return null;
    
    // 匹配左上标 ^{...}（必须在字符串开头）
    const match = cleaned.match(/^\^{([^}]+)}/);
    if (match) {
      return match[1];
    }
    return null;
  }

  /**
   * 计算装饰音的播放时间偏移（Clamp）
   * @param {number} beatDuration - 一拍的时长（毫秒）
   * @returns {number} 装饰音提前播放的毫秒数
   */
  calculateGraceNoteDuration(beatDuration) {
    // 装饰音时长 = 主音符时长 * 25%（假设主音符是16分音符 = 1/4拍）
    const subdivisionDuration = beatDuration / 4; // 16分音符时长
    let graceNoteDuration = subdivisionDuration * this.graceNoteConfig.durationRatio;
    
    // Clamp: 限制在20ms ~ 50ms之间
    graceNoteDuration = Math.max(this.graceNoteConfig.minDuration, 
                                 Math.min(this.graceNoteConfig.maxDuration, graceNoteDuration));
    
    return graceNoteDuration;
  }

  /**
   * 分析谱面，提取所需的音符集合（包含装饰音）
   * @param {Array} notations - 谱面数据
   * @param {string} notationType - 谱式类型
   * @returns {Set} 需要加载的音符集合（SPN格式）
   */
  analyzeRequiredNotes(notations, notationType = 'digital') {
    const requiredNotes = new Set();
    
    if (!notations || !Array.isArray(notations)) return requiredNotes;
    
    const extractNote = (noteStr) => {
      // 提取主音符
      const audioInfo = this.getNoteAudioInfo(noteStr, notationType);
      if (audioInfo) {
        requiredNotes.add(audioInfo.spn);
      }
      
      // 提取装饰音
      const graceNote = this.extractGraceNote(noteStr);
      if (graceNote) {
        const graceAudioInfo = this.getNoteAudioInfo(graceNote, notationType);
        if (graceAudioInfo) {
          requiredNotes.add(graceAudioInfo.spn);
        }
      }
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
              sub.rightHand.forEach(extractNote);
            }
            // 检查左手
            if (Array.isArray(sub.leftHand)) {
              sub.leftHand.forEach(extractNote);
            }
          });
        });
      });
    });
    
    return requiredNotes;
  }

  /**
   * 加载指定音符的音频文件（带重试机制）
   * @param {Set|Array} notes - 需要加载的音符（SPN格式）
   * @param {string} notationType - 谱式类型
   * @param {number} maxRetries - 最大重试次数
   * @returns {Promise<{success: boolean, loaded: number, failed: number}>}
   */
  async loadSounds(notes, notationType = 'digital', maxRetries = 3) {
    if (!this.isInitialized) {
      const initResult = await this.init();
      if (!initResult) return { success: false, loaded: 0, failed: notes.size || notes.length };
    }
    
    this.notationType = notationType;
    
    // 确保已加载可用音频文件列表
    await this.loadAvailableAudioFiles();
    
    const noteArray = Array.from(notes);
    let loaded = 0;
    let failed = 0;
    
    // 同时加载倒计时和节拍器音频
    const loadPromises = [
      this._loadAndDecodeAudioWithRetry('_countdown', this.countdownSoundUrl, maxRetries),
      this._loadAndDecodeAudioWithRetry('_metronome', this.metronomeSoundUrl, maxRetries)
    ];
    
    // 加载所需音符
    noteArray.forEach(spn => {
      if (!this.audioBuffers.has(spn)) {
        const url = `${this.audioBasePath}${spn}.mp3`;
        loadPromises.push(
          this._loadAndDecodeAudioWithRetry(spn, url, maxRetries)
            .then(result => {
              if (result) loaded++;
              else failed++;
              return result;
            })
        );
      } else {
        loaded++;
      }
    });
    
    try {
      await Promise.all(loadPromises);
      console.log(`[SheetPlaybackManager] 音频加载完成: ${loaded}成功, ${failed}失败`);
      return { success: true, loaded, failed };
    } catch (e) {
      console.error('[SheetPlaybackManager] 音频加载异常:', e);
      return { success: false, loaded, failed };
    }
  }

  /**
   * 加载并解码单个音频文件（带重试机制）
   * @private
   */
  async _loadAndDecodeAudioWithRetry(soundId, url, maxRetries = 3) {
    let lastError = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await this._loadAndDecodeAudio(soundId, url);
        if (result) {
          return true;
        }
      } catch (e) {
        lastError = e;
        console.warn(`[SheetPlaybackManager] 加载 ${soundId} 失败 (尝试 ${attempt}/${maxRetries}):`, e);
      }
      
      // 等待一段时间后重试
      if (attempt < maxRetries) {
        await this._sleep(100 * attempt); // 逐次增加等待时间
      }
    }
    
    console.error(`[SheetPlaybackManager] 加载 ${soundId} 最终失败:`, lastError);
    return false;
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
   * 生成播放时间线（包含装饰音）
   * 预计算所有音符事件的绝对时间
   * 
   * 【重要修复】时间线始终包含所有事件，startColumnId 只用于设置初始播放位置，
   * 不会过滤掉之前的事件，这样点击跳转到任意位置都能正常工作。
   * 
   * @param {Array} notations - 谱面数据
   * @param {number} tempo - BPM
   * @param {string} startColumnId - 起始列ID（可选，用于设置初始播放位置）
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
    const beatDurationMs = 60000 / tempo; // 每拍毫秒数
    
    let absoluteTime = 0;
    let globalColumnIndex = 0;
    
    // 【修复】记录起始列的索引，用于设置初始播放位置
    let startEventIndex = 0;
    let foundStartColumn = false;
    
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
        
        // 【修复】获取非占位拍的数量用于计算节拍数
        const nonPlaceholderBeats = measure.beats.filter(beat => !beat.isPlaceholder);
        this.beatsPerMeasure = nonPlaceholderBeats.length || measure.beats.length;
        
        measure.beats.forEach((beat, beatIndex) => {
          // 【修复】跳过占位拍，不播放也不移动光标
          if (beat.isPlaceholder) {
            return;
          }
          
          if (!beat.subdivisions) return;
          
          this.subdivisionsPerBeat = beat.subdivisions.length;
          
          // ===== 第一遍：分析这一拍内的所有subdivision，检测下划线 =====
          // 检测函数：判断一个subdivision是否包含带下划线的音符
          const checkSubdivisionHasUnderline = (sub) => {
            const checkNoteArray = (noteArray) => {
              if (!Array.isArray(noteArray)) return false;
              return noteArray.some(noteStr => {
                if (!noteStr || typeof noteStr !== 'string') return false;
                const cleaned = noteStr.replace(/[()]/g, '').trim();
                if (!cleaned || cleaned === '-' || cleaned === '+') return false;
                // 检查下划线
                if (cleaned.includes('_')) return true;
                // 检查去掉装饰音标记后
                const withoutSuperscript = cleaned.replace(/\^{[^}]*}/g, '');
                return withoutSuperscript.includes('_');
              });
            };
            return checkNoteArray(sub.rightHand) || checkNoteArray(sub.leftHand);
          };
          
          // 预先分析每个subdivision是否带下划线
          const subdivisionInfo = beat.subdivisions.map((sub, subIndex) => ({
            sub,
            subIndex,
            hasUnderline: checkSubdivisionHasUnderline(sub)
          }));
          
          // 统计普通音符（1个单位时值）和32分音符（0.5个单位时值）的数量
          const normalCount = subdivisionInfo.filter(info => !info.hasUnderline).length;
          const underlineCount = subdivisionInfo.filter(info => info.hasUnderline).length;
          
          // 计算单位时值
          // 公式：normalCount * x + underlineCount * (x/2) = beatDuration
          // 解得：x = beatDuration / (normalCount + underlineCount/2)
          const unitDivisor = normalCount + underlineCount / 2;
          const normalDuration = unitDivisor > 0 ? beatDuration / unitDivisor : beatDuration / beat.subdivisions.length;
          const underlineDuration = normalDuration / 2;
          
          // ===== 第二遍：生成时间线事件 =====
          subdivisionInfo.forEach(({ sub, subIndex, hasUnderline }) => {
            const columnId = `${moduleIndex}-${measureIndex}-${beatIndex}-${subIndex}`;
            
            // 计算当前音符的时值
            const currentDuration = hasUnderline ? underlineDuration : normalDuration;
            
            // 提取该列的所有音符和装饰音
            const soundKeys = []; // 主音符
            const graceNotes = []; // 装饰音
            
            const extractNotes = (noteArray) => {
              if (!Array.isArray(noteArray)) return;
              noteArray.forEach(noteStr => {
                if (!noteStr || typeof noteStr !== 'string') return;
                const cleaned = noteStr.replace(/[()]/g, '').trim();
                if (!cleaned || cleaned === '-' || cleaned === '+') return;
                
                // 提取主音符
                const audioInfo = this.getNoteAudioInfo(noteStr, this.notationType);
                if (audioInfo && this.audioBuffers.has(audioInfo.spn)) {
                  soundKeys.push({
                    spn: audioInfo.spn,
                    volume: audioInfo.volume
                  });
                }
                
                // 提取装饰音（左上标）
                const graceNote = this.extractGraceNote(noteStr);
                if (graceNote) {
                  // 装饰音字符串也需要去掉下划线再获取音频信息
                  const cleanedGraceNote = graceNote.replace(/_/g, '');
                  const graceAudioInfo = this.getNoteAudioInfo(cleanedGraceNote, this.notationType);
                  if (graceAudioInfo && this.audioBuffers.has(graceAudioInfo.spn)) {
                    graceNotes.push({
                      spn: graceAudioInfo.spn,
                      volume: graceAudioInfo.volume * this.graceNoteConfig.volumeRatio
                    });
                  }
                }
              });
            };
            
            extractNotes(sub.rightHand);
            extractNotes(sub.leftHand);
            
            // 添加装饰音事件（提前主音一定时间）
            if (graceNotes.length > 0) {
              // 装饰音时长 = 当前音符时值 * 25%，但限制在20ms-50ms
              const actualGraceNoteDuration = Math.max(
                this.graceNoteConfig.minDuration / 1000,
                Math.min(
                  this.graceNoteConfig.maxDuration / 1000,
                  currentDuration * this.graceNoteConfig.durationRatio
                )
              );
              const graceNoteTime = Math.max(0, absoluteTime - actualGraceNoteDuration);
              this.timeline.push({
                absoluteTime: graceNoteTime,
                soundKeys: graceNotes,
                isGraceNote: true,
                columnId: null, // 装饰音不触发光标移动
                pageIndex,
                moduleIndex,
                measureIndex,
                beatIndex,
                subdivisionIndex: subIndex,
                isFirstBeat: false,
                globalColumnIndex: -1
              });
            }
            
            // 添加主音符事件
            this.timeline.push({
              absoluteTime,
              soundKeys,
              isGraceNote: false,
              columnId,
              pageIndex,
              moduleIndex,
              measureIndex,
              beatIndex,
              subdivisionIndex: subIndex,
              isFirstBeat: beatIndex === 0 && subIndex === 0,
              globalColumnIndex,
              hasUnderline,
              duration: currentDuration // 保留当前音符的实际时值
            });
            
            // 【修复】检查是否是起始位置，记录索引
            if (!foundStartColumn && startColumnId && startColumnId === columnId) {
              foundStartColumn = true;
              // 记录当前timeline的长度减1作为起始索引（刚刚添加的事件）
              startEventIndex = this.timeline.length - 1;
            }
            
            // 计算下一个事件的时间
            absoluteTime += currentDuration;
            globalColumnIndex++;
          });
        });
      });
    });
    
    // 按时间排序（装饰音和主音符可能需要重新排序）
    this.timeline.sort((a, b) => a.absoluteTime - b.absoluteTime);
    
    // 【修复】如果指定了起始列，设置初始播放位置
    if (startColumnId && foundStartColumn) {
      // 排序后需要重新查找索引
      const sortedStartIndex = this.timeline.findIndex(e => !e.isGraceNote && e.columnId === startColumnId);
      if (sortedStartIndex >= 0) {
        this.currentEventIndex = sortedStartIndex;
        this.playbackOffset = this.timeline[sortedStartIndex].absoluteTime;
        console.log(`[SheetPlaybackManager] 设置起始位置: ${startColumnId}, 索引: ${sortedStartIndex}, 时间: ${this.playbackOffset.toFixed(2)}s`);
      }
    } else {
      // 没有指定起始列或未找到，从头开始
      this.currentEventIndex = 0;
      this.playbackOffset = 0;
    }
    
    console.log(`[SheetPlaybackManager] 生成时间线: ${this.timeline.length} 个事件（含装饰音）`);
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
   * @param {Object} options - 播放选项
   * @param {boolean} options.skipCountdown - 是否跳过倒计时
   */
  async startPlayback(notations, tempo, notationType, startColumnId = null, pageInfo = null, options = {}) {
    if (this.isPlaying) {
      this.stopPlayback();
    }
    
    this.isLoading = true;
    if (this.onLoadingStateChange) {
      this.onLoadingStateChange(true, '正在分析谱面...');
    }
    
    try {
      // 0. 确保已加载可用音频文件列表
      await this.loadAvailableAudioFiles();
      
      // 1. 分析所需音符
      const requiredNotes = this.analyzeRequiredNotes(notations, notationType);
      console.log('[SheetPlaybackManager] 所需音符:', Array.from(requiredNotes));
      
      // 2. 检查并加载音频资源（带重试机制）
      if (this.onLoadingStateChange) {
        this.onLoadingStateChange(true, '加载音频资源...');
      }
      
      const loadResult = await this.loadSounds(requiredNotes, notationType, 3);
      
      // 即使部分加载失败也继续（只是该音符无声）
      if (loadResult.loaded === 0 && requiredNotes.size > 0) {
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
      
      // 4. 开始倒计时（如果未禁用）
      if (!options.skipCountdown) {
        await this._startCountdown();
      }
      
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
    
    // 【修复】使用 generateTimeline 设置的 currentEventIndex 和 playbackOffset
    // 而不是总是从0开始，这样支持从任意位置开始播放
    // currentEventIndex 和 playbackOffset 已由 generateTimeline 或 seekToColumn 设置
    this.playbackStartTime = this.audioContext.currentTime - this.playbackOffset;
    this.lastMetronomeBeat = -1;
    
    // 启动 RAF 循环
    this._startRAFLoop();
  }

  /**
   * RAF 循环 - 核心播放驱动
   * @private
   */
  _startRAFLoop() {
    // 将lastProgressUpdate作为实例属性，以便在循环重置时可以清零
    this._lastProgressUpdate = 0;
    
    const loop = () => {
      if (!this.isPlaying || this.isPaused) return;
      
      const currentTime = this.audioContext.currentTime - this.playbackStartTime;
      const totalTime = this.getTotalDuration();
      
      // 定期更新进度（每200ms）
      if (currentTime - this._lastProgressUpdate > 0.2) {
        this._lastProgressUpdate = currentTime;
        if (this.onProgressUpdate) {
          this.onProgressUpdate(currentTime, totalTime);
        }
      }
      
      // 处理当前时间点的所有事件
      while (
        this.currentEventIndex < this.timeline.length &&
        this.timeline[this.currentEventIndex].absoluteTime <= currentTime + 0.02 // 20ms 提前量
      ) {
        const event = this.timeline[this.currentEventIndex];
        
        // 播放音符
        if (event.soundKeys && event.soundKeys.length > 0) {
          this._playSounds(event.soundKeys, event.isGraceNote);
        }
        
        // 触发高亮回调（仅主音符，装饰音不触发）
        if (!event.isGraceNote && this.onColumnHighlight && event.columnId) {
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
        if (!event.isGraceNote && this.onPageChange) {
          const nextEvent = this.timeline[this.currentEventIndex + 1];
          if (nextEvent && !nextEvent.isGraceNote && nextEvent.pageIndex !== event.pageIndex) {
            // 提前通知切页
            this.onPageChange(nextEvent.pageIndex, true);
          }
        }
        
        // 节拍器同步
        if (!event.isGraceNote && this.metronomeEnabled && event.isFirstBeat) {
          this._playMetronomeTick(true);
        } else if (!event.isGraceNote && this.metronomeEnabled && event.subdivisionIndex === 0) {
          this._playMetronomeTick(false);
        }
        
        this.currentEventIndex++;
      }
      
      // 检查是否播放完成
      if (this.currentEventIndex >= this.timeline.length) {
        // 检查是否需要循环播放
        if (this.loopEnabled) {
          // 重置到开头继续播放
          this.currentEventIndex = 0;
          this.playbackStartTime = this.audioContext.currentTime;
          this.lastMetronomeBeat = -1;
          // 重置进度更新计时器，确保循环后进度条能继续更新
          this._lastProgressUpdate = 0;
          
          // 重置进度条到0
          if (this.onProgressUpdate) {
            const totalTime = this.getTotalDuration();
            this.onProgressUpdate(0, totalTime);
          }
          
          // 高亮第一列
          if (this.onColumnHighlight && this.timeline.length > 0) {
            const firstEvent = this.timeline.find(e => !e.isGraceNote);
            if (firstEvent) {
              this.onColumnHighlight({
                columnId: firstEvent.columnId,
                pageIndex: firstEvent.pageIndex,
                moduleIndex: firstEvent.moduleIndex,
                measureIndex: firstEvent.measureIndex,
                beatIndex: firstEvent.beatIndex,
                subdivisionIndex: firstEvent.subdivisionIndex,
                isFirstBeat: firstEvent.isFirstBeat
              });
            }
          }
          
          console.log('[SheetPlaybackManager] 循环播放，重新开始');
          this._rafId = setTimeout(loop, 16);
          return;
        }
        
        this.stopPlayback();
        if (this.onPlaybackEnd) {
          this.onPlaybackEnd();
        }
        return;
      }
      
      // 使用 setTimeout 模拟 RAF（小程序无全局 requestAnimationFrame）
      // 16ms ≈ 60fps，但音频精度依赖 audioContext.currentTime
      this._rafId = setTimeout(loop, 16);
    };
    
    this._rafId = setTimeout(loop, 16);
  }

  /**
   * 播放多个音符（和弦）
   * @private
   */
  _playSounds(soundKeys, isGraceNote = false) {
    if (!soundKeys || soundKeys.length === 0) return;
    
    // 根据同时播放的音符数量调整音量（防止叠加爆音）
    const volumeMultiplier = soundKeys.length > 1 
      ? 0.8 / Math.sqrt(soundKeys.length) 
      : 1;
    
    soundKeys.forEach(soundInfo => {
      const spn = typeof soundInfo === 'string' ? soundInfo : soundInfo.spn;
      const noteVolume = typeof soundInfo === 'object' ? soundInfo.volume : 1.0;
      const baseVolume = isGraceNote ? this.volumeConfig.graceNote : this.volumeConfig.notes;
      this._playSound(spn, baseVolume * noteVolume * volumeMultiplier);
    });
  }

  /**
   * 播放单个音频
   * @param {string} soundId - 音频ID（SPN格式或特殊ID如_countdown）
   * @param {number} volume - 音量 0-1
   * 
   * 注意：每次调用都会创建新的BufferSource，因此连续两个相同音符可以各自独立播放，
   * 不会互相截断。gainNode复用只是为了减少节点创建开销，不影响音频独立性。
   */
  _playSound(soundId, volume = 0.7) {
    const buffer = this.audioBuffers.get(soundId);
    if (!buffer || !this.audioContext) return;
    
    try {
      // 每次创建新的BufferSource，确保连续播放同一音频时不会截断前一个
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
   * 试听单个音频（用于音频映射弹窗）
   * @param {string} spn - SPN格式的音符名
   * @param {number} volume - 音量 0-1
   * @returns {Promise<boolean>} 是否成功播放
   */
  async previewSound(spn, volume = 0.7) {
    if (!this.isInitialized) {
      await this.init();
    }
    
    // 确保音频已加载
    if (!this.audioBuffers.has(spn)) {
      const url = `${this.audioBasePath}${spn}.mp3`;
      const loaded = await this._loadAndDecodeAudioWithRetry(spn, url, 2);
      if (!loaded) {
        return false;
      }
    }
    
    this._playSound(spn, volume);
    return true;
  }

  /**
   * 停止播放
   */
  stopPlayback() {
    this.isPlaying = false;
    this.isPaused = false;
    
    if (this._rafId) {
      clearTimeout(this._rafId);
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
   * 获取播放总时长（秒）
   */
  getTotalDuration() {
    if (this.timeline.length === 0) return 0;
    return this.timeline[this.timeline.length - 1].absoluteTime;
  }
  
  /**
   * 设置播放速度（BPM）
   * @param {number} newTempo - 新的BPM值
   */
  setTempo(newTempo) {
    const oldTempo = this.tempo;
    this.tempo = Math.max(30, Math.min(200, newTempo));
    
    if (this.isPlaying && this.timeline.length > 0) {
      // 重新计算时间线
      const ratio = oldTempo / this.tempo;
      const currentOffset = this.audioContext.currentTime - this.playbackStartTime;
      
      // 调整每个事件的绝对时间
      this.timeline = this.timeline.map(event => ({
        ...event,
        absoluteTime: event.absoluteTime * ratio
      }));
      
      // 调整播放起始点以保持当前位置
      this.playbackStartTime = this.audioContext.currentTime - (currentOffset * ratio);
    }
    
    console.log(`[SheetPlaybackManager] 速度调整: ${oldTempo} -> ${this.tempo} BPM`);
  }
  
  /**
   * 设置循环播放模式
   * @param {boolean} enabled - 是否开启循环
   */
  setLoopMode(enabled) {
    this.loopEnabled = !!enabled;
    console.log(`[SheetPlaybackManager] 循环模式: ${this.loopEnabled ? '开启' : '关闭'}`);
  }
  
  /**
   * 设置节拍器开关
   * @param {boolean} enabled - 是否开启节拍器
   */
  setMetronome(enabled) {
    this.metronomeEnabled = !!enabled;
    console.log(`[SheetPlaybackManager] 节拍器: ${this.metronomeEnabled ? '开启' : '关闭'}`);
  }
  
  /**
   * 设置节拍器音量
   * @param {number} volume - 音量 0-1
   */
  setMetronomeVolume(volume) {
    this.volumeConfig.metronome = Math.max(0, Math.min(1, volume));
    console.log(`[SheetPlaybackManager] 节拍器音量: ${this.volumeConfig.metronome}`);
  }
  
  /**
   * 跳转到指定列开始播放
   * @param {string} columnId - 列ID格式: moduleIndex-measureIndex-beatIndex-subIndex
   * @returns {boolean} 是否成功找到并跳转
   */
  seekToColumn(columnId) {
    if (!columnId || this.timeline.length === 0) return false;
    
    // 查找对应的时间线事件（跳过装饰音）
    const targetIndex = this.timeline.findIndex(event => !event.isGraceNote && event.columnId === columnId);
    
    if (targetIndex >= 0) {
      const targetEvent = this.timeline[targetIndex];
      this.currentEventIndex = targetIndex;
      
      if (this.isPlaying && this.audioContext) {
        // 调整播放起始时间以跳转到目标位置
        this.playbackStartTime = this.audioContext.currentTime - targetEvent.absoluteTime;
      } else {
        this.playbackOffset = targetEvent.absoluteTime;
      }
      
      // 触发高亮回调
      if (this.onColumnHighlight) {
        this.onColumnHighlight({
          columnId: targetEvent.columnId,
          pageIndex: targetEvent.pageIndex,
          moduleIndex: targetEvent.moduleIndex
        });
      }
      
      // 【修复】同步更新进度回调
      if (this.onProgressUpdate) {
        const totalTime = this.getTotalDuration();
        this.onProgressUpdate(targetEvent.absoluteTime, totalTime);
      }
      
      console.log(`[SheetPlaybackManager] 跳转到: ${columnId}, 时间: ${targetEvent.absoluteTime.toFixed(2)}s`);
      return true;
    } else {
      // 【修复】如果未找到对应的columnId（可能是占位拍），打印警告
      console.warn(`[SheetPlaybackManager] 未在timeline中找到columnId: ${columnId}`);
      return false;
    }
  }
  
  /**
   * 根据进度百分比跳转
   * @param {number} progress - 进度 0-100
   */
  seekToProgress(progress) {
    if (this.timeline.length === 0) return;
    
    const totalTime = this.getTotalDuration();
    const targetTime = (progress / 100) * totalTime;
    
    // 找到最接近的事件（跳过装饰音）
    let targetIndex = 0;
    for (let i = 0; i < this.timeline.length; i++) {
      if (!this.timeline[i].isGraceNote && this.timeline[i].absoluteTime >= targetTime) {
        targetIndex = i;
        break;
      }
      if (!this.timeline[i].isGraceNote) {
        targetIndex = i;
      }
    }
    
    const targetEvent = this.timeline[targetIndex];
    this.currentEventIndex = targetIndex;
    
    if (this.isPlaying && this.audioContext) {
      this.playbackStartTime = this.audioContext.currentTime - targetEvent.absoluteTime;
    } else {
      this.playbackOffset = targetEvent.absoluteTime;
    }
    
    // 触发高亮和进度回调
    if (this.onColumnHighlight && targetEvent.columnId) {
      this.onColumnHighlight({
        columnId: targetEvent.columnId,
        pageIndex: targetEvent.pageIndex,
        moduleIndex: targetEvent.moduleIndex
      });
    }
    
    if (this.onProgressUpdate) {
      this.onProgressUpdate(targetEvent.absoluteTime, totalTime);
    }
    
    console.log(`[SheetPlaybackManager] 跳转到进度: ${progress.toFixed(1)}%, 时间: ${targetEvent.absoluteTime.toFixed(2)}s`);
  }
  
  /**
   * 根据点击的columnId跳转并暂停
   * @param {string} columnId - 列ID
   * @returns {boolean} 是否成功找到并跳转
   */
  seekAndPause(columnId) {
    const success = this.seekToColumn(columnId);
    if (this.isPlaying) {
      this.pausePlayback();
    }
    return success;
  }

  /**
   * 检查是否已准备就绪
   */
  isReady() {
    return this.isInitialized && this.audioBuffers.size > 0;
  }

  /**
   * 检查指定SPN音频是否可用
   * @param {string} spn - SPN格式的音符名
   * @returns {boolean}
   */
  isAudioAvailable(spn) {
    return this.availableAudioFiles.has(spn);
  }

  /**
   * 获取可用的音频文件列表
   * @returns {Set<string>}
   */
  getAvailableAudioFiles() {
    return this.availableAudioFiles;
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
