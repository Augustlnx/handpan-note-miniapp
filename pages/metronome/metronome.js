// metronome.js - 微信小程序版本

// 引入 Web Audio 管理器
const { webAudioManager } = require('../../utils/webAudioManager.js');

// 节奏字母映射表 - 一拍四音(十六分音符)
const RHYTHM_MAP_4 = {
  'A': [1, 0, 0, 0], 'B': [0, 1, 0, 0], 'C': [0, 0, 1, 0], 'D': [0, 0, 0, 1],
  'E': [1, 1, 0, 0], 'F': [0, 1, 1, 0], 'G': [0, 0, 1, 1], 'H': [1, 0, 0, 1],
  'I': [1, 0, 1, 0], 'J': [0, 1, 0, 1], 'K': [1, 1, 1, 0], 'L': [0, 1, 1, 1],
  'M': [1, 0, 1, 1], 'N': [1, 1, 0, 1], 'O': [1, 1, 1, 1], 'P': [0, 0, 0, 0]
};

// 节奏字母映射表 - 一拍三音(三连音)
const RHYTHM_MAP_3 = {
  'Q': [1, 0, 0], 'R': [0, 1, 0], 'S': [0, 0, 1], 'T': [1, 1, 0],
  'U': [0, 1, 1], 'V': [1, 0, 1], 'W': [1, 1, 1], 'X': [0, 0, 0]
};

// 节奏字母映射表 - 一拍五音(五连音)
// 正确理解：一拍 = 3个16分音符 + 2个连着的32分音符
// 用 [音符, 音符, ...] 表示，其中连着的两个32分音符用特殊标记
// timing 数组表示每个音符的时值：1=16分音符，0.5=32分音符
const RHYTHM_MAP_5 = {
  // 32分音符对在位置1（第1、2个音是32分音符）
  '①': { notes: [1, 1, 1, 1, 1], timing: [0.5, 0.5, 1, 1, 1], linkedPair: 0 },
  // 32分音符对在位置2（第2、3个音是32分音符）
  '②': { notes: [1, 1, 1, 1, 1], timing: [1, 0.5, 0.5, 1, 1], linkedPair: 1 },
  // 32分音符对在位置3（第3、4个音是32分音符）
  '③': { notes: [1, 1, 1, 1, 1], timing: [1, 1, 0.5, 0.5, 1], linkedPair: 2 },
  // 32分音符对在位置4（第4、5个音是32分音符）
  '④': { notes: [1, 1, 1, 1, 1], timing: [1, 1, 1, 0.5, 0.5], linkedPair: 3 }
};

// 常见节奏练习片段库 - 按类别分组
const LIBRARY_CATEGORIES = [
  {
    name: 'AIOP 字母练习',
    patterns: ['AIAI', 'AIIA', 'IAIA', 'AAII', 'IPIP', 'IIOO']
  },
  {
    name: 'EFGN 琶音练习',
    patterns: ['ME', 'MF', 'KG', 'IN', 'EG', 'NF', 'NG']
  },
  {
    name: 'BDJL 字母练习',
    patterns: ['OB', 'KD', 'MJ', 'ML', 'NL', 'DO', 'JL']
  }
];

// 兼容旧代码的扁平数组
const LIBRARY_PATTERNS = LIBRARY_CATEGORIES.flatMap(cat => cat.patterns);

// 帮助文本
const HELP_TEXTS = {
  tapTempo: {
    title: 'Tap Tempo 功能',
    content: '连续点击3-4次此按钮,系统会根据你的点击间隔自动计算并设置BPM速度。这是一个快速设定速度的方法,特别适合需要匹配特定节奏时使用。'
  },
  animation: {
    title: '动画开关',
    content: '控制谱面节奏片段的高亮动画和变色效果。关闭后可以看着静态谱面自己尝试敲击节奏,适合熟练后的自我检验。开启时会有明显的视觉反馈帮助你跟随节奏。'
  },
  mainSound: {
    title: '主音开关',
    content: '控制节奏片段本身是否发声。关闭后可以只听"背景节拍器",自己尝试敲击节奏,是检验练习效果的好方法。关闭主音时会自动关闭"辅助音"并打开"背景节拍"。'
  },
  ghostSound: {
    title: '辅助音',
    content: '为休止符位置(横线)添加轻微的参考音。开启后可以更清楚地感知每个十六分音符的位置,特别适合初学者使用。'
  },
  metronome: {
    title: '背景节拍器',
    content: '在未自定义编辑节奏片段时，默认开启节拍器。在自定义节奏片段训练中，作为背景节拍可以提供稳定的"叮-笃-笃-笃"节拍器声音。强烈建议开启,可以防止在练习复杂节奏时跑拍,特别是练习切分音和反拍时。'
  },
  randomPractice: {
    title: '随机练习模式',
    content: '从选中的节奏片段中随机抽取并播放。每个片段会重复设定的次数后自动切换到下一个随机片段。这种练习方式可以有效提高视奏能力和节奏反应速度。点击"点击退出随机练习"按钮可退出随机模式。'
  }
};

Page({
  data: {
    // ========== 节拍器模式 ==========
    isMetronomeMode: true, // 是否处于纯节拍器模式（无自定义节奏时）
    
    // ========== 简单节拍器 ==========
    metBpm: 80,
    metIsPlaying: false,
    metBeats: 4, // 默认4/4拍
    metBeatsLabel: '4/N', // 当前拍号显示标签
    metCurrentBeat: 0,
    beatDots: [],
    timeSignatures: [
      { beats: 2, label: '2/N' },
      { beats: 3, label: '3/N' },
      { beats: 4, label: '4/N' },
      { beats: 5, label: '5/N' },
      { beats: 6, label: '6/N' }
    ],
    timeSigModalVisible: false, // 拍号选择弹窗

    // ========== 节奏练习器 ==========
    bpm: 80,
    isPlaying: false,
    loop: true, // 默认开启循环
    ghostNote: false,
    metronome: true,
    mainSound: true,
    animation: true,
    
    pattern: [],
    currentSegment: -1,
    currentNote: -1,
    progress: 0,
    
    // 编辑器
    editorVisible: false,
    rhythmType: '4',
    letterOptions: [],
    manualPattern: [],
    
    // 节奏库
    libraryVisible: false,
    libraryPatterns: LIBRARY_PATTERNS,
    libraryCategories: [], // 带节奏图形的分类库
    libraryPatternsWithRhythm: [], // 带节奏图形的库（兼容）
    
    // 个人节奏库
    personalLibraryVisible: false,
    personalLibrary: [],
    
    // 保存对话框
    saveVisible: false,
    saveName: '',
    
    // 随机练习
    randomVisible: false,
    randomMode: false,
    randomSelectedPatterns: [],
    randomRepeatCount: 4,
    currentRepeat: 0,
    
    // 预热
    isWarmup: false,
    warmupBeat: 0,
    
    // 帮助
    helpVisible: false,
    helpTitle: '',
    helpContent: '',
    
    // Tap Tempo
    tapTimes: [],
    
    // 节奏练习器标签页
    rhythmActiveTab: 'play',
    // 分包图片重试标志
    retryRadio: false,
    retryHeadphone: false,
    retryRecord: false,
    retryPlayPause: false,
    retryCube: false,
    retryWriting: false,
    // ...如有其它分包图片可继续添加
  },

  // ========== 生命周期函数 ==========
  onLoad() {
    // 初始化唯一ID计数器
    this.segmentIdCounter = 0;
    
    this.initMetronome();
    this.loadPersonalLibrary();
    this.updateLetterOptions();
    this.initLibraryPatternsWithRhythm();
    
    // 创建音频上下文
    this.initAudio();
    
    // 初始化模式检测
    this.checkMetronomeMode();

    // 1秒后重试加载失败的分包图片
    setTimeout(() => {
      if (this.data.retryRadio) {
        this.setData({
          radioImgSrc: '/subpackages/resources/icons/metronome/radio.png?t=' + Date.now(),
          retryRadio: false
        });
      }
      if (this.data.retryHeadphone) {
        this.setData({
          headphoneImgSrc: '/subpackages/resources/icons/metronome/耳机声音_headphone-sound.png?t=' + Date.now(),
          retryHeadphone: false
        });
      }
      if (this.data.retryRecord) {
        this.setData({
          recordImgSrc: '/subpackages/resources/icons/metronome/唱片集_record.png?t=' + Date.now(),
          retryRecord: false
        });
      }
      if (this.data.retryPlayPause) {
        this.setData({
          playPauseImgSrc: (this.data.isMetronomeMode ? '/subpackages/resources/icons/metronome/暂停_pause-one.png' : '/subpackages/resources/icons/metronome/播放_play.png') + '?t=' + Date.now(),
          retryPlayPause: false
        });
      }
      if (this.data.retryCube) {
        this.setData({
          cubeImgSrc: '/subpackages/resources/icons/metronome/魔方_cube-five.png?t=' + Date.now(),
          retryCube: false
        });
      }
      if (this.data.retryWriting) {
        this.setData({
          writingImgSrc: '/subpackages/resources/icons/metronome/编辑撰写_writing-fluently.png?t=' + Date.now(),
          retryWriting: false
        });
      }
    }, 1000);
  },

  // 图片加载失败重试处理
  onImgError(e) {
    const type = e.currentTarget.dataset.type;
    switch(type) {
      case 'radio':
        this.setData({ retryRadio: true });
        break;
      case 'headphone':
        this.setData({ retryHeadphone: true });
        break;
      case 'record':
        this.setData({ retryRecord: true });
        break;
      case 'playpause':
        this.setData({ retryPlayPause: true });
        break;
      case 'cube':
        this.setData({ retryCube: true });
        break;
      case 'writing':
        this.setData({ retryWriting: true });
        break;
    }
  },

  onReady() {
    // 预加载播放/暂停图标，避免首次切换显示延迟
    const icons = [
      '/subpackages/resources/icons/metronome/播放_play.png',
      '/subpackages/resources/icons/metronome/暂停_pause-one.png'
    ];
    icons.forEach(src => {
      wx.getImageInfo({ 
        src,
        fail: () => {
          // 忽略预加载错误
        }
      });
    });
    
    // 注意：音频预加载已移至 preloadFallbackAudio 和 initWebAudio
    // 这里不再重复预加载，避免在音频上下文未准备好时报错
  },

  // 初始化音频 - 使用音频池管理器
  initAudio() {
    // 标记音频系统是否可用
    this.audioReady = false;
    
    // 初始化音频池管理器
    this.initAudioPool();
  },

  // 初始化音频池
  async initAudioPool() {
    try {
      const initSuccess = await webAudioManager.init();
      if (!initSuccess) {
        console.error('[Metronome] 音频池初始化失败');
        return;
      }
      
      // 预加载所有音频
      const loadSuccess = await webAudioManager.preloadAllAudio();
      if (!loadSuccess) {
        console.warn('[Metronome] 音频预加载未完全成功，但继续使用');
      }
      
      this.audioReady = true;
      // 保持兼容性
      this.useWebAudio = true;
      console.log('[Metronome] 音频池初始化成功');
    } catch (e) {
      console.error('[Metronome] 音频初始化异常: ' + (e.message || e));
      this.audioReady = false;
      this.useWebAudio = false;
    }
  },

  // 初始化带节奏图形的库
  initLibraryPatternsWithRhythm() {
    let segmentIdCounter = 0;
    // 生成分类库
    const libraryCategories = LIBRARY_CATEGORIES.map(category => {
      const patterns = category.patterns.map(pattern => {
        const rhythms = pattern.split('').map(letter => {
          const rhythm4 = RHYTHM_MAP_4[letter];
          const rhythm3 = RHYTHM_MAP_3[letter];
          const notes = rhythm4 ? [...rhythm4] : (rhythm3 ? [...rhythm3] : [1, 0, 0, 0]);
          return { id: 'seg_' + (segmentIdCounter++), notes };
        });
        return { pattern, rhythms, selected: false };
      });
      return { name: category.name, patterns };
    });
    
    // 兼容旧代码的扁平数组
    const patternsWithRhythm = libraryCategories.flatMap(cat => cat.patterns);
    
    this.setData({ 
      libraryCategories,
      libraryPatternsWithRhythm: patternsWithRhythm 
    });
  },

  onUnload() {
    // 销毁音频池管理器
    try {
      webAudioManager.destroy();
    } catch (e) {
      console.warn('销毁音频管理器失败: ' + (e.message || e));
    }
    
    if (this.playTimer) {
      clearInterval(this.playTimer);
    }
    if (this.metTimer) {
      clearInterval(this.metTimer);
    }
    if (this.metTimeout) {
      clearTimeout(this.metTimeout);
    }
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
    }
  },

  // ========== 节拍器模式检测 ==========
  // 检查是否应该进入节拍器模式（无自定义节奏时）
  checkMetronomeMode() {
    const isMetronomeMode = this.data.pattern.length === 0 && !this.data.randomMode;
    
    if (isMetronomeMode) {
      // 进入节拍器模式：强制关闭主音和辅助音，开启节拍器
      this.setData({
        isMetronomeMode: true,
        mainSound: false,
        ghostNote: false,
        metronome: true
      });
    } else {
      // 退出节拍器模式：开启主音
      this.setData({
        isMetronomeMode: false,
        mainSound: true
      });
    }
    
    return isMetronomeMode;
  },

  // 如果当前在“空屏节拍器模式”且节拍器正在播放，则停止节拍器
  stopMetronomeIfPlayingOnEmpty() {
    if (this.data.isMetronomeMode && this.data.metIsPlaying && this.data.pattern.length === 0) {
      // 使用 onMetTogglePlay 以保证 metIsPlaying 状态一致
      this.onMetTogglePlay();
    }
  },

  // 进入节奏练习模式（有节奏片段时）
  enterRhythmMode() {
    this.setData({
      isMetronomeMode: false,
      mainSound: true
    });
  },

  // ========== Pan图片点击振动 ==========
  onPanTap() {
    // 触发手机振动
    wx.vibrateShort({
      type: 'heavy',
      success: () => {
        console.log('振动成功');
      },
      fail: (err) => {
        console.log('振动失败: ' + (err.errMsg || err));
      }
    });
  },

  // ========== 简单节拍器相关 ==========
  initMetronome() {
    this.updateBeatDisplay();
  },

  updateBeatDisplay() {
    const dots = [];
    for (let i = 0; i < this.data.metBeats; i++) {
      dots.push({
        id: 'beat_' + i,
        active: false,
        strong: i === 0
      });
    }
    this.setData({ beatDots: dots });
  },

  // 打开拍号选择弹窗
  onOpenTimeSigModal() {
    this.setData({ timeSigModalVisible: true });
  },

  // 关闭拍号选择弹窗
  onCloseTimeSigModal() {
    this.setData({ timeSigModalVisible: false });
  },

  onMetTimeSignatureChange(e) {
    const beats = parseInt(e.currentTarget.dataset.beats);
    // 找到对应的标签
    const sig = this.data.timeSignatures.find(s => s.beats === beats);
    const label = sig ? sig.label : `${beats}/4`;
    
    this.setData({ 
      metBeats: beats,
      metBeatsLabel: label,
      timeSigModalVisible: false // 关闭弹窗
    });
    this.updateBeatDisplay();
    if (this.data.metIsPlaying) {
      this.setData({ metCurrentBeat: 0 });
    }
  },

  onMetIncreaseSpeed() {
    const newBpm = Math.min(240, this.data.metBpm + 5);
    this.setData({ metBpm: newBpm });
    // 速度调整将在下一拍自动应用，无需重启定时器
  },

  onMetDecreaseSpeed() {
    const newBpm = Math.max(40, this.data.metBpm - 5);
    this.setData({ metBpm: newBpm });
    // 速度调整将在下一拍自动应用，无需重启定时器
  },

  onMetTogglePlay() {
    const isPlaying = !this.data.metIsPlaying;
    this.setData({ metIsPlaying: isPlaying });
    
    if (isPlaying) {
      this.startMetronome();
    } else {
      this.stopMetronome();
    }
  },

  startMetronome() {
    this.setData({ metIsPlaying: true, metCurrentBeat: 0 });
    // 先更新视觉显示第一拍
    this.updateMetVisual();

    // 为了提高首拍可靠性，稍微延迟首拍播放（允许音频上下文稳定）
    setTimeout(() => {
      this.playMetBeat();
    }, 20);

    // 计算下一拍的延迟后开始循环
    const interval = (60 / this.data.metBpm) * 1000;
    this.metTimeout = setTimeout(() => {
      const nextBeat = (this.data.metCurrentBeat + 1) % this.data.metBeats;
      this.setData({ metCurrentBeat: nextBeat });
      this.playMetronomeTick();
    }, interval);
  },


  stopMetronome() {
    if (this.metTimeout) {
      clearTimeout(this.metTimeout);
      this.metTimeout = null;
    }
    this.clearMetVisual();
  },

  playMetronomeTick() {
    if (!this.data.metIsPlaying) return;
    
    this.playMetBeat();
    this.updateMetVisual();
    
    // 计算下一拍的延迟（基于当前 BPM）
    const interval = (60 / this.data.metBpm) * 1000;
    this.metTimeout = setTimeout(() => {
      const nextBeat = (this.data.metCurrentBeat + 1) % this.data.metBeats;
      this.setData({ metCurrentBeat: nextBeat });
      this.playMetronomeTick();
    }, interval);
  },

  playMetBeat() {
    const isStrong = this.data.metCurrentBeat === 0;
    
    // 使用音频池管理器播放
    if (this.audioReady && webAudioManager.isReady()) {
      if (isStrong) {
        webAudioManager.play('click1');
      } else {
        webAudioManager.play('click3');
      }
    } else {
      console.warn('[Metronome] 音频未就绪，跳过播放');
    }
  },

  updateMetVisual() {
    const dots = this.data.beatDots.map((dot, index) => ({
      ...dot,
      active: index === this.data.metCurrentBeat
    }));
    this.setData({ beatDots: dots });
  },

  clearMetVisual() {
    const dots = this.data.beatDots.map(dot => ({ ...dot, active: false }));
    this.setData({ beatDots: dots });
  },

  // ========== 节奏练习器 - 速度控制 ==========
  onIncreaseSpeed() {
    const newBpm = Math.min(240, this.data.bpm + 5);
    // 同步更新节拍器BPM
    this.setData({ bpm: newBpm, metBpm: newBpm });
  },

  onDecreaseSpeed() {
    const newBpm = Math.max(40, this.data.bpm - 5);
    // 同步更新节拍器BPM
    this.setData({ bpm: newBpm, metBpm: newBpm });
  },

  // BPM输入事件
  onBpmInput(e) {
    // 实时更新输入值（不做限制，让用户自由输入）
    let value = e.detail.value;
    // 只保留数字
    value = value.replace(/[^\d]/g, '');
    return value;
  },

  // BPM输入框失去焦点时验证并应用
  onBpmBlur(e) {
    let bpm = parseInt(e.detail.value) || 80;
    // 限制范围
    bpm = Math.max(40, Math.min(240, bpm));
    // 同步更新节拍器BPM
    this.setData({ bpm, metBpm: bpm });
    // 显示底部导航栏
    this.onInputBlur();
  },

  // 输入框获得焦点时隐藏底部导航栏
  onInputFocus() {
    wx.hideTabBar({ animation: true });
  },

  // 输入框失去焦点时显示底部导航栏
  onInputBlur() {
    wx.showTabBar({ animation: true });
  },

  onTapTempo() {
    const now = Date.now();
    this.data.tapTimes.push(now);
    
    if (this.data.tapTimes.length > 4) {
      this.data.tapTimes.shift();
    }
    
    if (this.data.tapTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < this.data.tapTimes.length; i++) {
        intervals.push(this.data.tapTimes[i] - this.data.tapTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      this.setData({ bpm });
    }
    
    clearTimeout(this.tapTimeout);
    this.tapTimeout = setTimeout(() => {
      this.setData({ tapTimes: [] });
    }, 5000);
  },

  // ========== 开关控制 ==========
  onLoopChange(e) {
    this.setData({ loop: e.detail.value });
  },

  // 标签页切换
  onRhythmTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ rhythmActiveTab: tab });
  },

  // 开关按钮点击（V2布局）
  onSwitchBtnTap(e) {
    const type = e.currentTarget.dataset.type;
    
    // 节拍器模式下，主音和辅助音强制关闭，节拍器强制开启
    if (this.data.isMetronomeMode) {
      if (type === 'mainSound' || type === 'ghostNote') {
        wx.showToast({ title: '请先创建节奏片段', icon: 'none' });
        return;
      }
      if (type === 'metronome') {
        wx.showToast({ title: '节拍器模式下不可关闭', icon: 'none' });
        return;
      }
    }
    
    switch (type) {
      case 'mainSound':
        const mainSound = !this.data.mainSound;
        if (!mainSound) {
          this.setData({
            mainSound,
            ghostNote: false,
            metronome: true
          });
        } else {
          this.setData({ mainSound });
        }
        break;
      case 'ghostNote':
        if (this.data.mainSound) {
          this.setData({ ghostNote: !this.data.ghostNote });
        }
        break;
      case 'metronome':
        this.setData({ metronome: !this.data.metronome });
        break;
      case 'animation':
        this.setData({ animation: !this.data.animation });
        break;
    }
  },

  onAnimationChange(e) {
    this.setData({ animation: e.detail.value });
  },

  onMainSoundChange(e) {
    const mainSound = e.detail.value;
    if (!mainSound) {
      this.setData({
        mainSound,
        ghostNote: false,
        metronome: true
      });
    } else {
      this.setData({ mainSound });
    }
  },

  onGhostChange(e) {
    this.setData({ ghostNote: e.detail.value });
  },

  onMetronomeChange(e) {
    this.setData({ metronome: e.detail.value });
  },

  // ========== 播放控制 ==========
  onTogglePlay() {
    // 节拍器模式下，使用节拍器播放逻辑
    if (this.data.isMetronomeMode) {
      this.onMetTogglePlay();
      return;
    }
    
    if (this.data.pattern.length === 0) {
      wx.showToast({ title: '请先添加节奏片段', icon: 'none' });
      return;
    }
    
    const isPlaying = !this.data.isPlaying;
    this.setData({ isPlaying });
    
    if (isPlaying) {
      this.startPlayback();
    } else {
      this.stopPlayback();
    }
  },

  startPlayback() {
    this.currentSegmentIndex = 0;
    this.currentNoteInSegment = 0;
    const secondsPerBeat = 60.0 / this.data.bpm;
    
    // 开始预热阶段（播放4拍 AAAA）
    this.setData({ isWarmup: true, warmupBeat: 0 });
    this.warmupCounter = 0; // 总共16个十六分音符
    
    // 立即播放第一个预热音符
    this.playWarmupNote();
    
    // 开始递归播放
    this.playRhythmTick();
  },

  playRhythmTick() {
    if (!this.data.isPlaying) return;
    
    const secondsPerBeat = 60.0 / this.data.bpm;
    let interval;
    
    if (this.data.isWarmup) {
      this.playWarmupNote();
      // 预热阶段使用四音/拍
      interval = (secondsPerBeat / 4) * 1000;
    } else {
      // 根据当前片段的节奏长度和timing计算间隔
      const segmentIndex = this.currentSegmentIndex;
      if (segmentIndex < this.data.pattern.length) {
        const segment = this.data.pattern[segmentIndex];
        const noteIndex = this.currentNoteInSegment;
        
        // 如果有timing信息（五音/拍），使用timing计算间隔
        if (segment.timing && segment.timing.length > 0) {
          // timing中：1=16分音符，0.5=32分音符
          // 一拍 = 4个16分音符的时值
          // 16分音符时值 = secondsPerBeat / 4
          const sixteenthNote = secondsPerBeat / 4;
          const currentTiming = segment.timing[noteIndex] || 1;
          interval = sixteenthNote * currentTiming * 1000;
        } else {
          // 普通节奏：均分时值
          const notesPerBeat = segment.rhythm.length;
          interval = (secondsPerBeat / notesPerBeat) * 1000;
        }
      } else {
        interval = (secondsPerBeat / 4) * 1000;
      }
      
      this.playCurrentNote();
      this.nextNote();
    }
    
    // 设置下一个 tick
    this.playTimeout = setTimeout(() => {
      this.playRhythmTick();
    }, interval);
  },

  playWarmupNote() {
    const noteIndex = this.warmupCounter % 4;
    const beatIndex = Math.floor(this.warmupCounter / 4);
    
    // 更新预热拍数显示
    this.setData({ warmupBeat: beatIndex });
    
    // 播放预热音（A节奏：1000 - 只在第一个十六分音符响）
    if (noteIndex === 0) {
      // 使用音频池管理器播放
      if (this.audioReady && webAudioManager.isReady()) {
        const sounds = [{ name: 'click1' }];
        if (this.data.metronome) {
          sounds.push({ name: 'click3' });
        }
        webAudioManager.playMultiple(sounds);
      } else {
        console.warn('[Metronome] 音频未就绪，跳过预热音');
      }
    }
    
    this.warmupCounter++;
    
    // 4拍（16个十六分音符）预热结束后开始正式播放
    if (this.warmupCounter >= 16) {
      this.setData({ isWarmup: false, warmupBeat: 0 });
      // 立即播放第一个音符
      this.playCurrentNote();
    }
  },

  stopPlayback() {
    if (this.playTimeout) {
      clearTimeout(this.playTimeout);
      this.playTimeout = null;
    }
    this.setData({
      currentSegment: -1,
      currentNote: -1,
      progress: 0,
      isWarmup: false,
      warmupBeat: 0
    });
  },



  playCurrentNote() {
    const segmentIndex = this.currentSegmentIndex;
    if (segmentIndex >= this.data.pattern.length) return;
    
    const segment = this.data.pattern[segmentIndex];
    const rhythm = segment.rhythm;
    const noteIndex = this.currentNoteInSegment;
    const isNote = rhythm[noteIndex] === 1;
    
    // 使用音频池管理器播放
    if (this.audioReady && webAudioManager.isReady()) {
      const sounds = [];
      
      // 背景节拍（每拍开头）
      if (this.data.metronome && noteIndex === 0) {
        sounds.push({ name: 'click3' });
      }
      
      // 主音或辅助音
      if (isNote && this.data.mainSound) {
        sounds.push({ name: 'click1' });
      } else if (!isNote && this.data.ghostNote && this.data.mainSound) {
        sounds.push({ name: 'click2' });
      }
      
      if (sounds.length > 0) {
        webAudioManager.playMultiple(sounds);
      }
    } else {
      console.warn('[Metronome] 音频未就绪，跳过播放');
    }
    
    // 更新视觉
    if (this.data.animation) {
      this.setData({
        currentSegment: segmentIndex,
        currentNote: noteIndex
      });
    }
    
    // 更新进度
    const totalNotes = this.data.pattern.reduce((sum, seg) => sum + seg.rhythm.length, 0);
    let playedNotes = 0;
    for (let i = 0; i < segmentIndex; i++) {
      playedNotes += this.data.pattern[i].rhythm.length;
    }
    playedNotes += noteIndex;
    const progress = (playedNotes / totalNotes) * 100;
    this.setData({ progress });
  },

  nextNote() {
    if (this.data.pattern.length === 0) return;
    
    const segmentIndex = this.currentSegmentIndex;
    if (segmentIndex >= this.data.pattern.length) {
      // 已经超出范围，处理循环逻辑
      this.handlePatternEnd();
      return;
    }
    
    const segment = this.data.pattern[segmentIndex];
    const rhythm = segment ? segment.rhythm : [1, 0, 0, 0];
    
    this.currentNoteInSegment++;
    
    // 当前片段播放完毕，切换到下一个片段
    if (this.currentNoteInSegment >= rhythm.length) {
      this.currentSegmentIndex++;
      this.currentNoteInSegment = 0; // 重置为0，确保新片段从第一个音开始
    }
    
    if (this.currentSegmentIndex >= this.data.pattern.length) {
      this.handlePatternEnd();
    }
  },

  handlePatternEnd() {
    if (this.data.randomMode) {
      const newRepeat = this.data.currentRepeat + 1;
      if (newRepeat >= this.data.randomRepeatCount) {
        // 切换到下一个随机节奏，重置计数和播放位置
        this.setData({ currentRepeat: 0 });
        this.loadNextRandom();
        // 重置播放位置，确保无缝衔接
        this.currentSegmentIndex = 0;
        this.currentNoteInSegment = 0;
      } else {
        // 继续重复当前节奏
        this.setData({ currentRepeat: newRepeat });
        this.currentSegmentIndex = 0;
        this.currentNoteInSegment = 0;
      }
    } else if (this.data.loop) {
      // 普通循环模式
      this.currentSegmentIndex = 0;
      this.currentNoteInSegment = 0;
    } else {
      // 非循环模式，停止播放
      this.onTogglePlay();
    }
  },

  // ========== 编辑器 ==========
  onOpenEditor() {
    this.setData({
      editorVisible: true,
      manualPattern: this.data.pattern.map(p => ({ ...p }))
    });
  },

  onCloseEditor() {
    this.setData({ editorVisible: false });
  },

  onRhythmTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ rhythmType: type });
    this.updateLetterOptions();
  },

  updateLetterOptions() {
    let options = [];
    if (this.data.rhythmType === '4') {
      options = Object.keys(RHYTHM_MAP_4).map(letter => ({
        letter,
        rhythm: RHYTHM_MAP_4[letter],
        timing: null
      }));
    } else if (this.data.rhythmType === '3') {
      options = Object.keys(RHYTHM_MAP_3).map(letter => ({
        letter,
        rhythm: RHYTHM_MAP_3[letter],
        timing: null
      }));
    } else {
      // 五音/拍：4个模板
      options = Object.keys(RHYTHM_MAP_5).map(letter => ({
        letter,
        rhythm: RHYTHM_MAP_5[letter].notes,
        timing: RHYTHM_MAP_5[letter].timing,
        linkedPair: RHYTHM_MAP_5[letter].linkedPair
      }));
    }
    this.setData({ letterOptions: options });
  },

  onAddLetter(e) {
    const letter = e.currentTarget.dataset.letter;
    let rhythm, timing, linkedPair;
    
    if (this.data.rhythmType === '4') {
      rhythm = RHYTHM_MAP_4[letter];
      timing = null;
      linkedPair = null;
    } else if (this.data.rhythmType === '3') {
      rhythm = RHYTHM_MAP_3[letter];
      timing = null;
      linkedPair = null;
    } else {
      // 五音/拍
      const mapItem = RHYTHM_MAP_5[letter];
      if (mapItem) {
        rhythm = mapItem.notes;
        timing = mapItem.timing;
        linkedPair = mapItem.linkedPair;
      }
    }
    
    if (rhythm) {
      const newSegment = { 
        id: 'seg_' + (++this.segmentIdCounter), 
        letter, 
        rhythm: [...rhythm],
        timing: timing ? [...timing] : null,
        linkedPair: linkedPair !== undefined ? linkedPair : null
      };
      const manualPattern = [...this.data.manualPattern, newSegment];
      this.setData({ manualPattern });
    }
  },

  onAddSegment() {
    let defaultLetter, rhythm, timing, linkedPair;
    if (this.data.rhythmType === '4') {
      defaultLetter = 'P';
      rhythm = RHYTHM_MAP_4[defaultLetter];
      timing = null;
      linkedPair = null;
    } else if (this.data.rhythmType === '3') {
      defaultLetter = 'X';
      rhythm = RHYTHM_MAP_3[defaultLetter];
      timing = null;
      linkedPair = null;
    } else {
      // 五音/拍默认添加模板1（32分音符对在位置1）
      defaultLetter = '①';
      const mapItem = RHYTHM_MAP_5[defaultLetter];
      rhythm = mapItem.notes;
      timing = mapItem.timing;
      linkedPair = mapItem.linkedPair;
    }
    
    const newSegment = { 
      id: 'seg_' + (++this.segmentIdCounter), 
      letter: defaultLetter, 
      rhythm: [...rhythm],
      timing: timing ? [...timing] : null,
      linkedPair: linkedPair !== undefined ? linkedPair : null
    };
    const manualPattern = [...this.data.manualPattern, newSegment];
    this.setData({ manualPattern });
  },

  onToggleNote(e) {
    const { seg, idx } = e.currentTarget.dataset;
    const segIndex = parseInt(seg);
    const noteIndex = parseInt(idx);
    
    const manualPattern = [...this.data.manualPattern];
    const segment = { ...manualPattern[segIndex] };
    const rhythm = [...segment.rhythm];
    
    // 检查是否是五音/拍片段（有linkedPair属性）
    if (segment.linkedPair !== null && segment.linkedPair !== undefined) {
      // 五音/拍：点击时切换32分音符对的位置
      const currentLinkedPair = segment.linkedPair;
      // 循环切换位置：0->1->2->3->0
      const newLinkedPair = (currentLinkedPair + 1) % 4;
      
      // 找到对应的模板
      const templateLetters = ['①', '②', '③', '④'];
      const newLetter = templateLetters[newLinkedPair];
      const mapItem = RHYTHM_MAP_5[newLetter];
      
      segment.letter = newLetter;
      segment.rhythm = [...mapItem.notes];
      segment.timing = [...mapItem.timing];
      segment.linkedPair = mapItem.linkedPair;
    } else {
      // 普通节奏：切换音符/休止
      rhythm[noteIndex] = rhythm[noteIndex] === 1 ? 0 : 1;
      
      // 查找对应的字母
      const allMaps = { ...RHYTHM_MAP_4, ...RHYTHM_MAP_3 };
      const newLetter = Object.keys(allMaps).find(key =>
        JSON.stringify(allMaps[key]) === JSON.stringify(rhythm)
      );
      
      // 更新节奏，即使没有对应字母也允许切换
      if (newLetter) {
        segment.letter = newLetter;
      } else {
        // 对于自定义节奏，用符号表示
        const noteCount = rhythm.filter(n => n === 1).length;
        segment.letter = noteCount > 0 ? '●' : '○';
      }
      segment.rhythm = rhythm;
    }
    
    manualPattern[segIndex] = segment;
    this.setData({ manualPattern });
  },

  onDeleteSegment(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const manualPattern = this.data.manualPattern.filter((_, i) => i !== index);
    this.setData({ manualPattern });
  },

  onClearManual() {
    this.setData({ manualPattern: [] });
  },

  onConfirmEdit() {
    // 若之前是空屏节拍器正在播放，立即停止它
    this.stopMetronomeIfPlayingOnEmpty();
    this.setData({
      pattern: this.data.manualPattern.map(p => ({ ...p })),
      editorVisible: false,
      rhythmActiveTab: 'play'
    });
    // 检查模式切换
    this.checkMetronomeMode();
  },

  // ========== 节奏库 ==========
  onOpenLibrary() {
    this.setData({ libraryVisible: true });
  },

  onCloseLibrary() {
    this.setData({ libraryVisible: false });
  },

  onLoadLibraryPattern(e) {
    const patternString = e.currentTarget.dataset.pattern;
    // 若之前是空屏节拍器正在播放，立即停止它
    this.stopMetronomeIfPlayingOnEmpty();
    this.loadPattern(patternString);
    this.setData({ libraryVisible: false, rhythmActiveTab: 'play' });
    // 检查模式切换
    this.checkMetronomeMode();
  },

  // ========== 个人节奏库 ==========
  loadPersonalLibrary() {
    try {
      const library = wx.getStorageSync('personalRhythmLibrary');
      if (library) {
        this.setData({ personalLibrary: JSON.parse(library) });
      }
    } catch (e) {
      console.error('加载个人节奏库失败', e);
    }
  },

  savePersonalLibrary() {
    try {
      wx.setStorageSync('personalRhythmLibrary', JSON.stringify(this.data.personalLibrary));
    } catch (e) {
      console.error('保存个人节奏库失败', e);
    }
  },

  onOpenPersonalLibrary() {
    this.setData({ personalLibraryVisible: true });
  },

  onClosePersonalLibrary() {
    this.setData({ personalLibraryVisible: false });
  },

  onLoadPersonalPattern(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const item = this.data.personalLibrary[index];
    // 若之前是空屏节拍器正在播放，立即停止它
    this.stopMetronomeIfPlayingOnEmpty();
    this.loadPattern(item.pattern);
    this.setData({ personalLibraryVisible: false, rhythmActiveTab: 'play' });
    // 检查模式切换
    this.checkMetronomeMode();
  },

  onDeletePersonalPattern(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const item = this.data.personalLibrary[index];
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除"${item.name}"吗?`,
      success: (res) => {
        if (res.confirm) {
          const personalLibrary = this.data.personalLibrary.filter((_, i) => i !== index);
          this.setData({ personalLibrary });
          this.savePersonalLibrary();
        }
      }
    });
  },

  // ========== 保存 ==========
  onOpenSaveDialog() {
    if (this.data.pattern.length === 0) {
      wx.showToast({ title: '请先创建节奏', icon: 'none' });
      return;
    }
    this.setData({ saveVisible: true, saveName: '' });
  },

  onCloseSaveDialog() {
    this.setData({ saveVisible: false });
  },

  onSaveNameInput(e) {
    this.setData({ saveName: e.detail.value });
  },

  onConfirmSave() {
    const name = this.data.saveName.trim();
    if (!name) {
      wx.showToast({ title: '请输入节奏名称', icon: 'none' });
      return;
    }
    
    const patternString = this.data.pattern.map(p => p.letter).join('');
    const personalLibrary = [...this.data.personalLibrary, {
      name,
      pattern: patternString,
      timestamp: Date.now()
    }];
    
    this.setData({ personalLibrary, saveVisible: false });
    this.savePersonalLibrary();
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  // ========== 随机练习 ==========
  onToggleRandom() {
    if (this.data.randomMode) {
      this.exitRandomMode();
    } else {
      // 打开弹窗时，重置选中状态
      const updatedCategories = this.data.libraryCategories.map(cat => ({
        ...cat,
        patterns: cat.patterns.map(item => ({ ...item, selected: false }))
      }));
      this.setData({ 
        randomVisible: true,
        randomSelectedPatterns: [],
        libraryCategories: updatedCategories
      });
    }
  },

  onCloseRandom() {
    this.setData({ randomVisible: false });
  },

  onToggleRandomPattern(e) {
    const pattern = e.currentTarget.dataset.pattern;
    let selected = [...this.data.randomSelectedPatterns];
    
    const index = selected.indexOf(pattern);
    if (index > -1) {
      selected.splice(index, 1);
    } else {
      selected.push(pattern);
    }
    
    // 更新选中状态到 libraryCategories
    const updatedCategories = this.data.libraryCategories.map(cat => ({
      ...cat,
      patterns: cat.patterns.map(item => ({
        ...item,
        selected: selected.indexOf(item.pattern) > -1
      }))
    }));
    
    this.setData({ 
      randomSelectedPatterns: selected,
      libraryCategories: updatedCategories
    });
  },

  onRepeatCountInput(e) {
    this.setData({ randomRepeatCount: parseInt(e.detail.value) || 4 });
  },

  onStartRandom() {
    if (this.data.randomSelectedPatterns.length === 0) {
      wx.showToast({ title: '请至少选择一个节奏片段', icon: 'none' });
      return;
    }
    
    // 若之前是空屏节拍器正在播放，立即停止它
    this.stopMetronomeIfPlayingOnEmpty();
    
    this.setData({
      randomMode: true,
      randomVisible: false,
      currentRepeat: 0,
      rhythmActiveTab: 'play'
    });
    
    this.loadNextRandom();
    
    // 进入随机模式时退出节拍器模式
    this.checkMetronomeMode();
    
    if (!this.data.isPlaying) {
      this.onTogglePlay();
    }
  },

  exitRandomMode() {
    this.setData({
      randomMode: false,
      randomSelectedPatterns: [],
      currentRepeat: 0
    });
    
    if (this.data.isPlaying) {
      this.onTogglePlay();
    }
    
    // 检查模式切换
    this.checkMetronomeMode();
  },

  loadNextRandom() {
    const patterns = this.data.randomSelectedPatterns;
    if (patterns.length === 0) return;
    
    const randomIndex = Math.floor(Math.random() * patterns.length);
    const pattern = patterns[randomIndex];
    this.loadPattern(pattern);
    // currentRepeat 已经在 handlePatternEnd 中重置为0
  },

  // ========== 清空 ==========
  onClearPattern() {
    if (this.data.isPlaying) {
      this.onTogglePlay();
    }
    this.exitRandomMode();
    this.setData({ pattern: [] });
    // 检查模式切换（清空后进入节拍器模式）
    this.checkMetronomeMode();
  },

  // ========== 帮助 ==========
  onShowHelp(e) {
    const helpType = e.currentTarget.dataset.help;
    const helpData = HELP_TEXTS[helpType];
    
    if (helpData) {
      this.setData({
        helpVisible: true,
        helpTitle: helpData.title,
        helpContent: helpData.content
      });
    }
  },

  onCloseHelp() {
    this.setData({ helpVisible: false });
  },

  // ========== 工具函数 ==========
  loadPattern(patternString) {
    const pattern = patternString.split('').map(letter => {
      const rhythm4 = RHYTHM_MAP_4[letter];
      const rhythm3 = RHYTHM_MAP_3[letter];
      return {
        id: 'seg_' + (++this.segmentIdCounter),
        letter,
        rhythm: rhythm4 ? [...rhythm4] : (rhythm3 ? [...rhythm3] : [1, 0, 0, 0])
      };
    });
    
    this.setData({ pattern });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  // ========== 分享功能 ==========
  onShareAppMessage() {
    return {
      title: 'Orbit Note - 节奏练习器',
      path: '/pages/metronome/metronome',
      imageUrl: '/assets/img/share.png'
    };
  },

  onShareTimeline() {
    return {
      title: 'Orbit Note - 节奏练习器',
      query: '',
      imageUrl: '/assets/img/share.png'
    };
  }
});