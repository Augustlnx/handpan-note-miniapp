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

// 默认电子手碟参数 - D-Kurd 12音（按键更靠近边缘）
const DEFAULT_HANDPAN_NOTES = [
  { id: 0, note: "D3", cx: 500, cy: 574, rx: 179, ry: 156, angle: -90 },
  { id: 1, note: "A3", cx: 660, cy: 848, rx: 149, ry: 99, angle: 67 },
  { id: 2, note: "Bb3", cx: 340, cy: 848, rx: 149, ry: 99, angle: -67 },
  { id: 3, note: "C4", cx: 855, cy: 633, rx: 127, ry: 98, angle: 19 },
  { id: 4, note: "D4", cx: 145, cy: 633, rx: 127, ry: 98, angle: -19 },
  { id: 5, note: "E4", cx: 864, cy: 367, rx: 113, ry: 89, angle: -23 },
  { id: 6, note: "F4", cx: 136, cy: 367, rx: 113, ry: 89, angle: 23 },
  { id: 7, note: "G4", cx: 710, cy: 175, rx: 103, ry: 78, angle: -55 },
  { id: 8, note: "A4", cx: 290, cy: 175, rx: 103, ry: 78, angle: 55 },
  { id: 9, note: "C5", cx: 500, cy: 100, rx: 85, ry: 92, angle: 180 },
  { id: 10, note: "D5", cx: 400, cy: 325, rx: 99, ry: 84, angle: 50 },
  { id: 11, note: "E5", cx: 600, cy: 325, rx: 99, ry: 84, angle: -50 }
];

// 可用的手碟音频文件列表
const HANDPAN_AUDIO_FILES = [
  'A3', 'A4', 'A5', 'Bb3', 'Bb5', 'C4', 'C5', 'C6', 
  'D3', 'D4', 'D5', 'E3', 'E4', 'E5', 'F3', 'F4', 'F5', 
  'G3', 'G4', 'G5', 'SLAP'
];

// 音名-简谱-数字谱的默认映射表
const NOTE_MAPPING = {
  'F3':  { jianpu: '1',  shuzipu: '12' },
  'G3':  { jianpu: '2',  shuzipu: '13' },
  'A3':  { jianpu: '3',  shuzipu: '1' },
  'Bb3': { jianpu: '4',  shuzipu: '2' },
  'C4':  { jianpu: '5',  shuzipu: '3' },
  'D4':  { jianpu: '6',  shuzipu: '4' },
  'E4':  { jianpu: '7',  shuzipu: '5' },
  'F4':  { jianpu: "1'", shuzipu: '6' },
  'G4':  { jianpu: "2'", shuzipu: '7' },
  'A4':  { jianpu: "3'", shuzipu: '8' },
  'Bb4': { jianpu: "4'", shuzipu: '14' },
  'C5':  { jianpu: "5'", shuzipu: '9' },
  'D5':  { jianpu: "6'", shuzipu: '10' },
  'E5':  { jianpu: "7'", shuzipu: '11' },
  'D3':  { jianpu: 'D',  shuzipu: 'D' },
  'E3':  { jianpu: '7,', shuzipu: '15' }
};

// 预设参数库
const PRESET_HANDPAN_PARAMS = [
  {
    id: 'preset-d-kurd-12',
    name: 'D-Kurd 12音（默认）',
    timestamp: Date.now(),
    isPreset: true,
    notes: [
      { id: 0, note: "D3", cx: 500, cy: 574, rx: 179, ry: 156, angle: -90 },
      { id: 1, note: "A3", cx: 660, cy: 848, rx: 149, ry: 99, angle: 67 },
      { id: 2, note: "Bb3", cx: 340, cy: 848, rx: 149, ry: 99, angle: -67 },
      { id: 3, note: "C4", cx: 855, cy: 633, rx: 127, ry: 98, angle: 19 },
      { id: 4, note: "D4", cx: 145, cy: 633, rx: 127, ry: 98, angle: -19 },
      { id: 5, note: "E4", cx: 864, cy: 367, rx: 113, ry: 89, angle: -23 },
      { id: 6, note: "F4", cx: 136, cy: 367, rx: 113, ry: 89, angle: 23 },
      { id: 7, note: "G4", cx: 710, cy: 175, rx: 103, ry: 78, angle: -55 },
      { id: 8, note: "A4", cx: 290, cy: 175, rx: 103, ry: 78, angle: 55 },
      { id: 9, note: "C5", cx: 500, cy: 100, rx: 85, ry: 92, angle: 180 },
      { id: 10, note: "D5", cx: 400, cy: 325, rx: 99, ry: 84, angle: 50 },
      { id: 11, note: "E5", cx: 600, cy: 325, rx: 99, ry: 84, angle: -50 }
    ]
  },
  {
    id: 'preset-d-kurd-14',
    name: 'D-Kurd 14音',
    timestamp: Date.now(),
    isPreset: true,
    notes: [
      { id: 0, note: "D3", cx: 500, cy: 574, rx: 179, ry: 156, angle: -90 },
      { id: 1, note: "A3", cx: 660, cy: 848, rx: 149, ry: 99, angle: 67 },
      { id: 2, note: "Bb3", cx: 340, cy: 848, rx: 149, ry: 99, angle: -67 },
      { id: 3, note: "C4", cx: 855, cy: 633, rx: 127, ry: 98, angle: 19 },
      { id: 4, note: "D4", cx: 145, cy: 633, rx: 127, ry: 98, angle: -19 },
      { id: 5, note: "E4", cx: 864, cy: 367, rx: 113, ry: 89, angle: -23 },
      { id: 6, note: "F4", cx: 136, cy: 367, rx: 113, ry: 89, angle: 23 },
      { id: 7, note: "G4", cx: 710, cy: 175, rx: 103, ry: 78, angle: -55 },
      { id: 8, note: "A4", cx: 290, cy: 175, rx: 103, ry: 78, angle: 55 },
      { id: 9, note: "C5", cx: 500, cy: 100, rx: 85, ry: 92, angle: 180 },
      { id: 10, note: "D5", cx: 400, cy: 325, rx: 99, ry: 84, angle: 50 },
      { id: 11, note: "E5", cx: 600, cy: 325, rx: 99, ry: 84, angle: -50 },
      { id: 12, note: "G3", cx: 50, cy: 932, rx: 130, ry: 99, angle: -47 },
      { id: 13, note: "F3", cx: 950, cy: 932, rx: 130, ry: 99, angle: 47 }
    ]
  }
];

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
    // 分包图片动态路径（延迟加载）
    subpkgImgs: {
      radio: '',
      headphone: '',
      record: '',
      playPause: '',
      playPausePause: '',
      cube: '',
      writing: '',
      star: '',
      pan: '',
      change: '' // 切换显示模式图标
    },

    // ========== 电子手碟 ==========
    panSwiperIndex: 0, // 手碟swiper当前索引
    ePanLoaded: false, // 电子手碟是否已加载
    handpanNotes: [], // 当前电子手碟音符数据（渲染用）
    slapActive: false, // SLAP按钮激活状态
    handpanVolume: 80, // 电子手碟音量（0-100）
    audioLoading: false, // 音频加载中状态
    handpanDisplayMode: 'note', // 电子手碟显示模式：note(音名), jianpu(简谱), shuzipu(数字谱)
    handpanDisplayModes: ['note', 'jianpu', 'shuzipu'], // 可切换的显示模式列表
    handpanDisplayModeLabels: { note: '音名', jianpu: '简谱', shuzipu: '数字谱' }, // 显示模式标签

    // 电子手碟编辑器
    handpanEditorVisible: false,
    editorNotes: [], // 编辑器中的音符数据
    editorSelectedId: null, // 当前选中的音符ID
    editorSelectedNote: null, // 当前选中的音符对象
    editorSecondSelectedId: null, // 双选模式：第二个选中的音符ID
    editorSecondNote: null, // 双选模式：第二个选中的音符对象
    handpanEditorConfirmed: false, // 是否已确认
    handpanAudioMappingVisible: false, // 音频映射区域是否可见
    handpanAudioMappings: [], // 音频映射列表
    editorHistory: [], // 编辑历史（用于撤销）
    sidebarTop: '33%', // 侧边栏位置

    // 参数库
    handpanParamsLibraryVisible: false,
    handpanParamsLibrary: [], // 用户保存的参数库
    currentHandpanParamsId: 'default', // 当前使用的参数ID

    // 保存参数弹窗
    handpanSaveParamsVisible: false,
    handpanSaveParamsName: '',

    // 导入参数弹窗
    handpanImportVisible: false,
    handpanImportJson: '',
    handpanImportError: '',
    
    // ========== 谱面模式相关 ==========
    notationMode: false, // 是否处于谱面模式
    notationMetronomeActive: false, // 谱面模式下节拍器是否激活
    hasNotationData: false, // 是否有谱面数据
    notationCanvasWidth: 300, // Canvas宽度（px）
    notationCanvasHeight: 300, // Canvas高度（px）
    notationData: null, // 谱面数据（从notation页面获取，数组形式包含所有模块）
    notationModuleHeights: [], // 每个模块的高度
    notationColors: { // 谱面颜色配置
      rightHand: '#F4D096',
      leftHand: '#314D63'
    },
    // 谱面分页相关
    notationPages: [], // 分页后的数据 [{modules: [...], heights: [...], totalHeight: number}, ...]
    notationCurrentPage: 0, // 当前页码
    notationTotalPages: 1, // 总页数
    notationPageMeasureLimit: 32 // 每页最大小节数
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

    // 初始化分包图片重试计数器
    this.subpkgImgRetryCount = {};
    
    // 1秒后开始加载分包图片（等待分包下载）
    setTimeout(() => {
      this.loadSubpkgImages();
    }, 1000);

    // 初始化电子手碟
    this.initElectronicHandpan();
    this.loadHandpanParamsLibrary();
  },

  // 分包图片配置
  getSubpkgImgConfig() {
    return {
      radio: '/subpackages/resources/icons/metronome/radio.png',
      headphone: '/subpackages/resources/icons/metronome/耳机声音_headphone-sound.png',
      record: '/subpackages/resources/icons/metronome/唱片集_record.png',
      playPause: '/subpackages/resources/icons/metronome/播放_play.png',
      playPausePause: '/subpackages/resources/icons/metronome/暂停_pause-one.png',
      cube: '/subpackages/resources/icons/metronome/魔方_cube-five.png',
      writing: '/subpackages/resources/icons/metronome/编辑撰写_writing-fluently.png',
      star: '/subpackages/resources/icons/library/星星_star.png',
      pan: '/subpackages/resources/img/pan.jpg',
      change: '/subpackages/resources/icons/metronome/change.svg'
    };
  },

  // 加载所有分包图片
  loadSubpkgImages() {
    const config = this.getSubpkgImgConfig();
    const subpkgImgs = {};
    
    Object.keys(config).forEach(key => {
      subpkgImgs[key] = config[key];
    });
    
    this.setData({ subpkgImgs });
  },

  // 分包图片加载失败处理
  onSubpkgImgError(e) {
    const type = e.currentTarget.dataset.type;
    if (!type) return;
    
    // 初始化重试计数
    if (!this.subpkgImgRetryCount[type]) {
      this.subpkgImgRetryCount[type] = 0;
    }
    
    // change图标使用更快的重试策略（0.2秒间隔，最多5次）
    const isChangeIcon = type === 'change';
    const maxRetries = isChangeIcon ? 5 : 3;
    const retryDelay = isChangeIcon ? 200 : 5000;
    
    // 检查是否达到最大重试次数
    if (this.subpkgImgRetryCount[type] >= maxRetries) {
      console.warn(`[Metronome] 分包图片 ${type} 加载失败，已达最大重试次数`);
      return;
    }
    
    this.subpkgImgRetryCount[type]++;
    console.log(`[Metronome] 分包图片 ${type} 加载失败，${retryDelay / 1000}秒后进行第 ${this.subpkgImgRetryCount[type]} 次重试...`);
    
    // 延迟后重试
    setTimeout(() => {
      const config = this.getSubpkgImgConfig();
      const newPath = config[type] + '?t=' + Date.now();
      this.setData({
        [`subpkgImgs.${type}`]: newPath
      });
    }, 5000);
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
    
    // 延迟1秒后初始化音频池，等待分包加载完成
    // （与分包图片加载策略保持一致）
    console.log('[Metronome] 等待1秒后初始化音频（等待分包加载）...');
    setTimeout(() => {
      this.initAudioPool();
    }, 1000);
  },

  // 初始化音频池
  async initAudioPool() {
    try {
      const initSuccess = await webAudioManager.init();
      if (!initSuccess) {
        console.error('[Metronome] Web Audio 上下文初始化失败');
        return;
      }
      
      // 预加载所有音频（启用失败重试机制）
      const loadSuccess = await webAudioManager.preloadAllAudio(true);
      if (!loadSuccess) {
        console.warn('[Metronome] 音频预加载未完全成功，可能会影响播放');
      }
      
      this.audioReady = loadSuccess || webAudioManager.isReady();
      // 保持兼容性
      this.useWebAudio = true;
      console.log('[Metronome] 音频初始化完成，就绪状态: ' + this.audioReady);
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
      // 五音/拍：只切换当前音符的状态（1变0，0变1），保持时值分配不变
      rhythm[noteIndex] = rhythm[noteIndex] === 1 ? 0 : 1;
      
      // 更新节奏，保持timing和linkedPair不变
      segment.rhythm = rhythm;
      
      // 更新字母标识（如果所有音符都是1，使用原模板字母；否则用自定义符号）
      const noteCount = rhythm.filter(n => n === 1).length;
      if (noteCount === 5) {
        // 如果所有音符都是1，保持原模板字母
        const templateLetters = ['①', '②', '③', '④'];
        const linkedPairIndex = segment.linkedPair;
        segment.letter = templateLetters[linkedPairIndex] || '①';
      } else {
        // 对于自定义节奏，用符号表示
        segment.letter = noteCount > 0 ? '●' : '○';
      }
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

  // ========== 电子手碟相关 ==========
  
  // 初始化电子手碟
  initElectronicHandpan() {
    // 将默认参数转换为渲染用数据
    const handpanNotes = this.convertNotesToRenderData(DEFAULT_HANDPAN_NOTES);
    
    // 读取保存的音量值
    const savedVolume = wx.getStorageSync('handpan_volume');
    const handpanVolume = savedVolume !== '' ? savedVolume : 80;
    
    this.setData({ handpanNotes, handpanVolume });
    
    // 重置音符索引缓存
    this._resetNoteIndexCache();
    
    // 初始化手碟音频缓存
    this.handpanAudioBuffers = new Map();
    this.handpanAudioLoaded = false;
    
    // 延迟预加载手碟音频（电子手碟默认在第一页）
    setTimeout(() => {
      this.preloadHandpanAudio();
    }, 500);
  },

  // 将音符数据转换为渲染用数据（百分比定位）
  convertNotesToRenderData(notes) {
    return notes.map(note => {
      // 获取默认映射或使用已保存的值
      const mapping = NOTE_MAPPING[note.note] || {};
      const jianpu = note.jianpu || mapping.jianpu || note.note;
      const shuzipu = note.shuzipu || mapping.shuzipu || note.note;
      
      // 解析简谱的八度标记
      const baseNum = jianpu.replace(/['|,]/g, '');
      const dotsUp = (jianpu.match(/'/g) || []).length;
      const dotsDown = (jianpu.match(/,/g) || []).length;
      
      return {
        ...note,
        jianpu,
        shuzipu,
        active: false,
        displayText: note.note, // 默认显示音名
        displayDotsUp: 0,
        displayDotsDown: 0,
        // 转换为百分比（基于1000x1000坐标系）
        renderX: ((note.cx - note.rx) / 1000) * 100,
        renderY: ((note.cy - note.ry) / 1000) * 100,
        renderW: (note.rx * 2 / 1000) * 100,
        renderH: (note.ry * 2 / 1000) * 100
      };
    });
  },

  // 预加载手碟音频
  async preloadHandpanAudio() {
    if (this.handpanAudioLoaded) return true;
    
    try {
      // 获取当前手碟所需的音频文件
      const notesNeeded = this.data.handpanNotes.map(n => n.note);
      const audioUrls = {};
      
      notesNeeded.forEach(note => {
        // 检查音频文件是否存在
        if (HANDPAN_AUDIO_FILES.includes(note)) {
          audioUrls[`handpan_${note}`] = `/subpackages/audio/sound/${note}.mp3`;
        }
      });
      
      // 添加SLAP音频
      audioUrls['handpan_SLAP'] = '/subpackages/audio/sound/SLAP.mp3';
      
      // 使用webAudioManager加载
      const success = await webAudioManager.loadSounds(audioUrls);
      this.handpanAudioLoaded = success;
      return success;
    } catch (e) {
      console.error('[Handpan] 音频预加载失败:', e);
      return false;
    }
  },

  // Swiper切换事件
  onPanSwiperChange(e) {
    const index = e.detail.current;
    this.setData({ panSwiperIndex: index });
    
    // 首次切换到电子手碟时确保音频已加载
    if (index === 0 && !this.data.ePanLoaded) {
      this.setData({ ePanLoaded: true });
      this.preloadHandpanAudio();
    }
  },

  // ========== 电子手碟触摸优化系统 ==========
  // 待更新的激活状态队列 { noteIndex: boolean }
  _pendingActiveUpdates: {},
  // 批量更新定时器
  _batchUpdateTimer: null,
  // 批量更新间隔（毫秒）- 约16ms对应60fps
  _batchUpdateInterval: 16,
  
  /**
   * 批量合并 setData 更新
   * 将多个音符的激活状态变化合并为一次 setData 调用
   */
  _scheduleBatchUpdate() {
    if (this._batchUpdateTimer) return;
    
    this._batchUpdateTimer = setTimeout(() => {
      this._batchUpdateTimer = null;
      
      const updates = this._pendingActiveUpdates;
      this._pendingActiveUpdates = {};
      
      // 使用路径更新，只更新变化的音符
      const setDataObj = {};
      const noteIndices = Object.keys(updates);
      
      for (let i = 0; i < noteIndices.length; i++) {
        const idx = noteIndices[i];
        setDataObj[`handpanNotes[${idx}].active`] = updates[idx];
      }
      
      if (Object.keys(setDataObj).length > 0) {
        this.setData(setDataObj);
      }
    }, this._batchUpdateInterval);
  },
  
  /**
   * 查找音符在数组中的索引（使用缓存提升性能）
   */
  _getNoteIndex(noteId) {
    // 懒加载索引映射
    if (!this._noteIdToIndexMap) {
      this._noteIdToIndexMap = {};
      const notes = this.data.handpanNotes;
      for (let i = 0; i < notes.length; i++) {
        this._noteIdToIndexMap[notes[i].id] = i;
      }
    }
    return this._noteIdToIndexMap[noteId];
  },
  
  /**
   * 重置音符索引缓存（当音符配置变化时调用）
   */
  _resetNoteIndexCache() {
    this._noteIdToIndexMap = null;
  },

  // 电子手碟音符触摸开始（支持多点触控，优化响应速度）
  onEPanNoteTouchStart(e) {
    const noteId = e.currentTarget.dataset.id;
    const noteName = e.currentTarget.dataset.note;
    
    // 【最高优先级】立即播放音频 - 同步执行，无任何延迟
    this.playHandpanNote(noteName);
    
    // 【异步】视觉反馈 - 使用批量合并更新，不阻塞后续触摸事件
    const noteIndex = this._getNoteIndex(noteId);
    if (noteIndex !== undefined) {
      this._pendingActiveUpdates[noteIndex] = true;
      this._scheduleBatchUpdate();
    }
    
    // 【异步】触发振动 - 放入微任务队列，不阻塞主线程
    Promise.resolve().then(() => {
      wx.vibrateShort({ type: 'light' });
    });
  },

  // 电子手碟音符触摸结束
  onEPanNoteTouchEnd(e) {
    const noteId = e.currentTarget.dataset.id;
    const noteIndex = this._getNoteIndex(noteId);
    
    if (noteIndex === undefined) return;
    
    // 延迟200ms移除激活状态，使用批量更新
    setTimeout(() => {
      this._pendingActiveUpdates[noteIndex] = false;
      this._scheduleBatchUpdate();
    }, 200);
  },

  // 播放手碟音符
  playHandpanNote(noteName) {
    const audioId = `handpan_${noteName}`;
    const volume = (this.data.handpanVolume || 80) / 100 * 0.8;
    webAudioManager.play(audioId, volume);
  },
  
  // 手碟音量变化
  onHandpanVolumeChange(e) {
    const volume = e.detail.value;
    this.setData({ handpanVolume: volume });
    wx.setStorageSync('handpan_volume', volume);
  },

  // SLAP按钮触摸开始
  onSlapTouchStart() {
    // 立即播放音频（最高优先级）
    this.playHandpanNote('SLAP');
    // 视觉反馈和振动
    this.setData({ slapActive: true });
    wx.vibrateShort({ type: 'medium' });
  },

  // SLAP按钮触摸结束
  onSlapTouchEnd() {
    setTimeout(() => {
      this.setData({ slapActive: false });
    }, 200);
  },

  // ========== 电子手碟编辑器 ==========
  
  // 打开编辑器
  onOpenHandpanEditor() {
    // 深拷贝当前手碟数据到编辑器
    const editorNotes = JSON.parse(JSON.stringify(
      this.data.handpanNotes.length > 0 
        ? this.data.handpanNotes 
        : this.convertNotesToRenderData(DEFAULT_HANDPAN_NOTES)
    ));
    
    // 隐藏底部TabBar
    wx.hideTabBar({ animation: true });
    
    this.setData({
      handpanEditorVisible: true,
      editorNotes,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null,
      handpanEditorConfirmed: false,
      handpanAudioMappingVisible: false,
      editorHistory: [JSON.stringify(editorNotes)],
      sidebarTop: '33%'
    });
  },

  // 关闭编辑器
  onCloseHandpanEditor() {
    // 显示底部TabBar
    wx.showTabBar({ animation: true });
    
    this.setData({ 
      handpanEditorVisible: false,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  // ========== 侧边栏拖动 ==========
  onSidebarTouchStart(e) {
    this.sidebarStartY = e.touches[0].clientY;
    const topStr = this.data.sidebarTop || '33%';
    // 解析当前top值
    if (topStr.includes('%')) {
      const systemInfo = wx.getWindowInfo();
      this.sidebarStartTop = parseFloat(topStr) / 100 * systemInfo.windowHeight;
    } else {
      this.sidebarStartTop = parseFloat(topStr);
    }
    this.sidebarMoved = false; // 标记是否发生了拖动
  },

  onSidebarTouchMove(e) {
    const dy = e.touches[0].clientY - this.sidebarStartY;
    // 只有移动超过一定距离才算拖动
    if (Math.abs(dy) > 5) {
      this.sidebarMoved = true;
    }
    if (!this.sidebarMoved) return;
    
    const newTop = this.sidebarStartTop + dy;
    const systemInfo = wx.getWindowInfo();
    // 限制范围：上边界100px，下边界距离底部200px
    const minTop = 100;
    const maxTop = systemInfo.windowHeight - 300;
    const clampedTop = Math.max(minTop, Math.min(maxTop, newTop));
    this.setData({
      sidebarTop: clampedTop + 'px'
    });
  },

  onSidebarTouchEnd() {
    // 如果没有发生移动，不做任何事情，让catchtap事件处理点击
    this.sidebarMoved = false;
  },

  // 点击画布背景退出选中
  onEditorBackgroundTap(e) {
    // 点击非按键区域退出选中
    this.setData({
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  // 编辑器音符触摸开始 - 支持双选模式和取消选中
  onEditorNoteTouchStart(e) {
    const noteId = e.currentTarget.dataset.id;
    const note = this.data.editorNotes.find(n => n.id === noteId);
    
    if (!note) return;
    
    // 如果点击的是第二个选中的音符，取消第二个选中，保留第一个
    if (this.data.editorSecondSelectedId === noteId) {
      this.setData({
        editorSecondSelectedId: null,
        editorSecondNote: null
      });
      return;
    }
    
    // 如果点击的是第一个选中的音符
    if (this.data.editorSelectedId === noteId) {
      // 如果存在第二个选中，取消第一个，第二个变成第一个
      if (this.data.editorSecondSelectedId !== null) {
        const newFirst = this.data.editorNotes.find(n => n.id === this.data.editorSecondSelectedId);
        this.setData({
          editorSelectedId: this.data.editorSecondSelectedId,
          editorSelectedNote: newFirst ? { ...newFirst } : null,
          editorSecondSelectedId: null,
          editorSecondNote: null
        });
      } else {
        // 只有一个选中，再次点击取消选中
        this.setData({
          editorSelectedId: null,
          editorSelectedNote: null
        });
      }
      return;
    }
    
    // 如果已有第一个选中，且点击的是不同音符，进入双选模式
    if (this.data.editorSelectedId !== null) {
      this.setData({
        editorSecondSelectedId: noteId,
        editorSecondNote: { ...note }
      });
      return;
    }
    
    // 单选模式
    this.setData({
      editorSelectedId: noteId,
      editorSelectedNote: { ...note },
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
    
    // 记录触摸起始位置
    this.editorTouchStartX = e.touches[0].clientX;
    this.editorTouchStartY = e.touches[0].clientY;
    this.editorNoteStartCx = note.cx;
    this.editorNoteStartCy = note.cy;
  },

  // 清除第二个选中
  onClearSecondSelection() {
    this.setData({
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  // 交换双选基准位置
  onSwapBaseNote() {
    if (this.data.editorSelectedId === null || this.data.editorSecondSelectedId === null) {
      return;
    }
    
    // 交换主选和次选
    this.setData({
      editorSelectedId: this.data.editorSecondSelectedId,
      editorSecondSelectedId: this.data.editorSelectedId,
      editorSelectedNote: this.data.editorSecondNote,
      editorSecondNote: this.data.editorSelectedNote
    });
  },

  // 编辑器音符拖动
  onEditorNoteTouchMove(e) {
    if (this.data.editorSelectedId === null) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - this.editorTouchStartX;
    const dy = touch.clientY - this.editorTouchStartY;
    
    // 获取画布尺寸进行缩放计算
    const query = wx.createSelectorQuery();
    query.select('.he-canvas-bg').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const canvasSize = res[0].width;
        const scale = 1000 / canvasSize;
        
        const newCx = Math.round(Math.max(50, Math.min(950, this.editorNoteStartCx + dx * scale)));
        const newCy = Math.round(Math.max(50, Math.min(950, this.editorNoteStartCy + dy * scale)));
        
        this.updateEditorNote({ cx: newCx, cy: newCy });
      }
    });
  },

  // 编辑器音符触摸结束
  onEditorNoteTouchEnd() {
    // 保存到历史记录
    this.saveEditorHistory();
  },

  // 更新编辑器中的音符
  updateEditorNote(updates) {
    const selectedId = this.data.editorSelectedId;
    if (selectedId === null) return;
    
    const editorNotes = this.data.editorNotes.map(n => {
      if (n.id === selectedId) {
        const updated = { ...n, ...updates };
        // 重新计算渲染数据
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const selectedNote = editorNotes.find(n => n.id === selectedId);
    
    this.setData({
      editorNotes,
      editorSelectedNote: selectedNote ? { ...selectedNote } : null
    });
  },

  // 属性面板滑块变化
  onEditorPropChange(e) {
    const prop = e.currentTarget.dataset.prop;
    const value = parseInt(e.detail.value);
    this.updateEditorNote({ [prop]: value });
  },

  // 属性面板数值输入框变化（右侧的可编辑数字）- 实时更新不验证
  onEditorValueInput(e) {
    const prop = e.currentTarget.dataset.prop;
    const value = parseInt(e.detail.value);
    
    // 仅更新显示，不进行范围验证
    if (!isNaN(value)) {
      this.updateEditorNote({ [prop]: value });
    }
  },

  // 属性面板数值输入框失焦 - 验证修正并保存
  onEditorValueBlur(e) {
    const prop = e.currentTarget.dataset.prop;
    let value = parseInt(e.detail.value);
    
    // 如果输入无效，恢复为当前值
    if (isNaN(value)) {
      const currentNote = this.data.editorNotes.find(n => n.id === this.data.editorSelectedId);
      if (currentNote) {
        value = currentNote[prop];
      } else {
        return;
      }
    }
    
    // 验证并修正数值范围
    if (prop === 'cx' || prop === 'cy') {
      value = Math.max(50, Math.min(950, value));
    } else if (prop === 'rx' || prop === 'ry') {
      value = Math.max(20, Math.min(200, value));
    } else if (prop === 'angle') {
      value = Math.max(-180, Math.min(180, value));
    }
    
    this.updateEditorNote({ [prop]: value });
    this.saveEditorHistory();
  },

  // 属性面板输入框变化
  onEditorPropInput(e) {
    const prop = e.currentTarget.dataset.prop;
    const value = parseInt(e.detail.value) || 0;
    this.updateEditorNote({ [prop]: value });
    this.saveEditorHistory();
  },

  // 音符名称变化（自动填充简谱和数字谱）
  onEditorNoteNameChange(e) {
    const value = e.detail.value.trim().toUpperCase();
    
    // 根据音名查找默认映射
    const mapping = NOTE_MAPPING[value];
    const updates = { note: value };
    
    // 如果有默认映射，自动填充简谱和数字谱
    if (mapping) {
      updates.jianpu = mapping.jianpu;
      updates.shuzipu = mapping.shuzipu;
    }
    
    this.updateEditorNote(updates);
    this.saveEditorHistory();
  },

  // 简谱名称变化
  onEditorJianpuChange(e) {
    const value = e.detail.value.trim();
    this.updateEditorNote({ jianpu: value });
    this.saveEditorHistory();
  },

  // 数字谱名称变化
  onEditorShuzipuChange(e) {
    const value = e.detail.value.trim();
    this.updateEditorNote({ shuzipu: value });
    this.saveEditorHistory();
  },

  // 切换电子手碟显示模式
  onToggleHandpanDisplayMode() {
    const modes = this.data.handpanDisplayModes;
    const currentIndex = modes.indexOf(this.data.handpanDisplayMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    const nextMode = modes[nextIndex];
    
    this.setData({ handpanDisplayMode: nextMode });
    
    // 更新显示内容
    this.updateHandpanDisplayText();
    
    wx.showToast({
      title: this.data.handpanDisplayModeLabels[nextMode],
      icon: 'none',
      duration: 1000
    });
  },

  // 更新电子手碟显示文本
  updateHandpanDisplayText() {
    const mode = this.data.handpanDisplayMode;
    const handpanNotes = this.data.handpanNotes.map(note => {
      let displayText = note.note;
      let displayDotsUp = 0; // 上方圆点数（高八度）
      let displayDotsDown = 0; // 下方圆点数（低八度）
      
      if (mode === 'jianpu') {
        const jianpu = note.jianpu || '';
        // 解析简谱，提取数字和八度标记
        const baseNum = jianpu.replace(/['|,]/g, '');
        const upCount = (jianpu.match(/'/g) || []).length;
        const downCount = (jianpu.match(/,/g) || []).length;
        
        displayText = baseNum;
        displayDotsUp = upCount;
        displayDotsDown = downCount;
      } else if (mode === 'shuzipu') {
        displayText = note.shuzipu || note.note;
      }
      
      return {
        ...note,
        displayText,
        displayDotsUp,
        displayDotsDown
      };
    });
    
    this.setData({ handpanNotes });
    
    // 重置音符索引缓存
    this._resetNoteIndexCache();
  },

  // 添加音符
  onEditorAddNote() {
    const maxId = Math.max(...this.data.editorNotes.map(n => n.id), -1);
    const newNote = {
      id: maxId + 1,
      note: 'New',
      cx: 500,
      cy: 500,
      rx: 60,
      ry: 50,
      angle: 0,
      active: false,
      renderX: 44,
      renderY: 45,
      renderW: 12,
      renderH: 10
    };
    
    const editorNotes = [...this.data.editorNotes, newNote];
    this.setData({
      editorNotes,
      editorSelectedId: newNote.id,
      editorSelectedNote: { ...newNote }
    });
    
    this.saveEditorHistory();
  },

  // 恢复选中音符为默认参数
  onEditorResetNote() {
    const selectedId = this.data.editorSelectedId;
    if (selectedId === null) return;
    
    // 从默认参数中查找对应的音符
    const defaultNote = DEFAULT_HANDPAN_NOTES.find(n => n.id === selectedId);
    if (!defaultNote) {
      wx.showToast({ title: '无默认参数', icon: 'none' });
      return;
    }
    
    // 恢复为默认值
    const editorNotes = this.data.editorNotes.map(n => {
      if (n.id === selectedId) {
        const restored = { ...defaultNote };
        // 重新计算渲染数据
        restored.renderX = ((restored.cx - restored.rx) / 1000) * 100;
        restored.renderY = ((restored.cy - restored.ry) / 1000) * 100;
        restored.renderW = (restored.rx * 2 / 1000) * 100;
        restored.renderH = (restored.ry * 2 / 1000) * 100;
        return restored;
      }
      return n;
    });
    
    const selectedNote = editorNotes.find(n => n.id === selectedId);
    
    this.setData({
      editorNotes,
      editorSelectedNote: selectedNote ? { ...selectedNote } : null
    });
    
    this.saveEditorHistory();
    wx.showToast({ title: '已恢复默认', icon: 'success' });
  },

  // 删除选中音符
  onEditorDeleteNote() {
    const selectedId = this.data.editorSelectedId;
    if (selectedId === null) return;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个音符吗？',
      success: (res) => {
        if (res.confirm) {
          const editorNotes = this.data.editorNotes.filter(n => n.id !== selectedId);
          this.setData({
            editorNotes,
            editorSelectedId: null,
            editorSelectedNote: null,
            editorSecondSelectedId: null,
            editorSecondNote: null
          });
          this.saveEditorHistory();
        }
      }
    });
  },

  // 保存编辑历史（用于撤销）
  saveEditorHistory() {
    const history = [...this.data.editorHistory];
    const currentState = JSON.stringify(this.data.editorNotes);
    
    // 避免重复记录相同状态
    if (history[history.length - 1] !== currentState) {
      history.push(currentState);
      // 最多保存20步
      if (history.length > 20) {
        history.shift();
      }
      this.setData({ editorHistory: history });
    }
  },

  // 撤销
  onUndoHandpanEdit() {
    const history = [...this.data.editorHistory];
    if (history.length <= 1) {
      wx.showToast({ title: '没有可撤销的操作', icon: 'none' });
      return;
    }
    
    history.pop(); // 移除当前状态
    const prevState = JSON.parse(history[history.length - 1]);
    
    this.setData({
      editorNotes: prevState,
      editorHistory: history,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  // ========== 双选对齐功能 ==========
  
  // 水平对称：让第二个音符的x和角度以第一个为基准对称
  onAlignHorizontalSymmetry() {
    const { editorSelectedNote, editorSecondNote, editorNotes } = this.data;
    if (!editorSelectedNote || !editorSecondNote) return;
    
    // 基准音符（第一个选中的）
    const baseNote = editorSelectedNote;
    // 被调整的音符（第二个选中的）
    const targetId = this.data.editorSecondSelectedId;
    
    // 计算对称：基于中心线x=500的对称
    const mirrorCx = 1000 - baseNote.cx;
    const mirrorAngle = -baseNote.angle;
    
    const updatedNotes = editorNotes.map(n => {
      if (n.id === targetId) {
        const updated = { ...n, cx: mirrorCx, angle: mirrorAngle };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const updatedSecondNote = updatedNotes.find(n => n.id === targetId);
    
    this.setData({
      editorNotes: updatedNotes,
      editorSecondNote: updatedSecondNote ? { ...updatedSecondNote } : null
    });
    
    this.saveEditorHistory();
    wx.showToast({ title: '已水平对称', icon: 'success' });
  },
  
  // 垂直齐平：让第二个音符的y与第一个相同
  onAlignVerticalFlat() {
    const { editorSelectedNote, editorSecondNote, editorNotes } = this.data;
    if (!editorSelectedNote || !editorSecondNote) return;
    
    const baseNote = editorSelectedNote;
    const targetId = this.data.editorSecondSelectedId;
    
    const updatedNotes = editorNotes.map(n => {
      if (n.id === targetId) {
        const updated = { ...n, cy: baseNote.cy };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const updatedSecondNote = updatedNotes.find(n => n.id === targetId);
    
    this.setData({
      editorNotes: updatedNotes,
      editorSecondNote: updatedSecondNote ? { ...updatedSecondNote } : null
    });
    
    this.saveEditorHistory();
    wx.showToast({ title: '已垂直齐平', icon: 'success' });
  },
  
  // 对齐大小：让第二个音符的大小与第一个相同
  onAlignMatchSize() {
    const { editorSelectedNote, editorSecondNote, editorNotes } = this.data;
    if (!editorSelectedNote || !editorSecondNote) return;
    
    const baseNote = editorSelectedNote;
    const targetId = this.data.editorSecondSelectedId;
    
    const updatedNotes = editorNotes.map(n => {
      if (n.id === targetId) {
        const updated = { ...n, rx: baseNote.rx, ry: baseNote.ry };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const updatedSecondNote = updatedNotes.find(n => n.id === targetId);
    
    this.setData({
      editorNotes: updatedNotes,
      editorSecondNote: updatedSecondNote ? { ...updatedSecondNote } : null
    });
    
    this.saveEditorHistory();
    wx.showToast({ title: '已对齐大小', icon: 'success' });
  },
  
  // 复制位置JSON
  onCopyPositionJSON() {
    const notesData = this.data.editorNotes.map(n => ({
      id: n.id,
      note: n.note,
      cx: n.cx,
      cy: n.cy,
      rx: n.rx,
      ry: n.ry,
      angle: n.angle
    }));
    
    const jsonStr = JSON.stringify(notesData, null, 2);
    
    wx.setClipboardData({
      data: jsonStr,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // 重置参数
  onResetHandpanParams() {
    wx.showModal({
      title: '重置参数',
      content: '确定要恢复默认参数吗？',
      success: (res) => {
        if (res.confirm) {
          const editorNotes = this.convertNotesToRenderData(DEFAULT_HANDPAN_NOTES);
          this.setData({
            editorNotes,
            editorSelectedId: null,
            editorSelectedNote: null,
            editorSecondSelectedId: null,
            editorSecondNote: null,
            editorHistory: [JSON.stringify(editorNotes)]
          });
        }
      }
    });
  },

  // 确认编辑
  onConfirmHandpanEditor() {
    // 生成音频映射
    const handpanAudioMappings = this.data.editorNotes.map(note => {
      const hasAudio = HANDPAN_AUDIO_FILES.includes(note.note);
      return {
        id: note.id,
        note: note.note,
        audioFile: hasAudio ? `${note.note}.mp3` : null,
        hasAudio,
        previewPlaying: false
      };
    });
    
    this.setData({
      handpanEditorConfirmed: true,
      handpanAudioMappingVisible: true,
      handpanAudioMappings
    });
    
    // 预加载音频
    this.preloadEditorHandpanAudio();
  },

  // 预加载编辑器中的手碟音频
  async preloadEditorHandpanAudio() {
    const audioUrls = {};
    
    this.data.editorNotes.forEach(note => {
      if (HANDPAN_AUDIO_FILES.includes(note.note)) {
        audioUrls[`handpan_${note.note}`] = `/subpackages/audio/sound/${note.note}.mp3`;
      }
    });
    
    audioUrls['handpan_SLAP'] = '/subpackages/audio/sound/SLAP.mp3';
    
    await webAudioManager.loadSounds(audioUrls);
  },

  // 试听音频
  onPreviewHandpanAudio(e) {
    const id = e.currentTarget.dataset.id;
    const mapping = this.data.handpanAudioMappings.find(m => m.id === id);
    
    if (!mapping || !mapping.hasAudio) return;
    
    // 播放音频
    this.playHandpanNote(mapping.note);
    
    // 视觉反馈
    const handpanAudioMappings = this.data.handpanAudioMappings.map(m => ({
      ...m,
      previewPlaying: m.id === id
    }));
    this.setData({ handpanAudioMappings });
    
    setTimeout(() => {
      const mappings = this.data.handpanAudioMappings.map(m => ({
        ...m,
        previewPlaying: false
      }));
      this.setData({ handpanAudioMappings: mappings });
    }, 500);
  },

  // 应用编辑（直接应用，不需要先确认）
  onApplyHandpanEditor() {
    // 应用到主界面（保留简谱和数字谱信息）
    const handpanNotes = this.data.editorNotes.map(n => ({
      ...n,
      active: false,
      displayText: n.note,
      displayDotsUp: 0,
      displayDotsDown: 0
    }));
    
    // 显示底部TabBar
    wx.showTabBar({ animation: true });
    
    this.setData({
      handpanNotes,
      handpanEditorVisible: false,
      handpanDisplayMode: 'note' // 重置为音名模式
    });
    
    // 重置音符索引缓存
    this._resetNoteIndexCache();
    
    // 重新加载音频
    this.handpanAudioLoaded = false;
    this.preloadHandpanAudio();
    
    wx.showToast({ title: '应用成功', icon: 'success' });
  },

  // ========== 参数库 ==========
  
  // 加载参数库
  loadHandpanParamsLibrary() {
    try {
      // 加载用户保存的参数
      const userLibrary = wx.getStorageSync('handpanParamsLibrary') || [];
      
      // 合并预设参数和用户参数
      // 预设参数放在前面，用户参数放在后面
      const library = [...PRESET_HANDPAN_PARAMS, ...userLibrary];
      
      this.setData({ handpanParamsLibrary: library });
    } catch (e) {
      console.error('[Handpan] 加载参数库失败:', e);
      // 如果加载失败，至少显示预设参数
      this.setData({ handpanParamsLibrary: PRESET_HANDPAN_PARAMS });
    }
  },

  // 保存参数库（只保存用户参数，不保存预设参数）
  saveHandpanParamsLibrary() {
    try {
      // 过滤出预设参数，只保存用户自定义的参数
      const userLibrary = this.data.handpanParamsLibrary.filter(p => !p.isPreset);
      wx.setStorageSync('handpanParamsLibrary', userLibrary);
    } catch (e) {
      console.error('[Handpan] 保存参数库失败:', e);
    }
  },

  // 打开参数库弹窗
  onOpenHandpanParamsLibrary() {
    this.setData({ handpanParamsLibraryVisible: true });
  },

  // 关闭参数库弹窗
  onCloseHandpanParamsLibrary() {
    this.setData({ handpanParamsLibraryVisible: false });
  },

  // 选择参数
  onSelectHandpanParams(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentHandpanParamsId: id });
  },

  // 应用选中的参数
  onApplySelectedHandpanParams() {
    const id = this.data.currentHandpanParamsId;
    let notes;
    
    if (id === 'default') {
      notes = DEFAULT_HANDPAN_NOTES;
    } else {
      const params = this.data.handpanParamsLibrary.find(p => p.id === id);
      if (!params) {
        wx.showToast({ title: '参数不存在', icon: 'none' });
        return;
      }
      notes = params.notes;
    }
    
    const editorNotes = this.convertNotesToRenderData(notes);
    this.setData({
      editorNotes,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorHistory: [JSON.stringify(editorNotes)],
      handpanParamsLibraryVisible: false,
      handpanEditorConfirmed: false,
      handpanAudioMappingVisible: false
    });
    
    wx.showToast({ title: '参数已加载', icon: 'success' });
  },

  // 删除参数
  onDeleteHandpanParams(e) {
    const id = e.currentTarget.dataset.id;
    
    // 查找要删除的参数
    const params = this.data.handpanParamsLibrary.find(p => p.id === id);
    
    // 防止删除预设参数
    if (params && params.isPreset) {
      wx.showToast({ 
        title: '预设参数不能删除', 
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个参数吗？',
      success: (res) => {
        if (res.confirm) {
          const library = this.data.handpanParamsLibrary.filter(p => p.id !== id);
          this.setData({ handpanParamsLibrary: library });
          this.saveHandpanParamsLibrary();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 打开保存参数弹窗
  onSaveHandpanParams() {
    this.setData({
      handpanSaveParamsVisible: true,
      handpanSaveParamsName: ''
    });
  },

  // 关闭保存参数弹窗
  onCloseHandpanSaveParams() {
    this.setData({ handpanSaveParamsVisible: false });
  },

  // 参数名称输入
  onHandpanSaveParamsNameInput(e) {
    this.setData({ handpanSaveParamsName: e.detail.value });
  },

  // 确认保存参数
  onConfirmSaveHandpanParams() {
    const name = this.data.handpanSaveParamsName.trim();
    if (!name) {
      wx.showToast({ title: '请输入参数名称', icon: 'none' });
      return;
    }
    
    // 提取纯数据（不含渲染属性，包含简谱和数字谱）
    const notes = this.data.editorNotes.map(n => ({
      id: n.id,
      note: n.note,
      jianpu: n.jianpu || '',
      shuzipu: n.shuzipu || '',
      cx: n.cx,
      cy: n.cy,
      rx: n.rx,
      ry: n.ry,
      angle: n.angle
    }));
    
    const newParams = {
      id: Date.now().toString(),
      name,
      notes,
      noteCount: notes.length,
      createTime: Date.now()
    };
    
    const library = [...this.data.handpanParamsLibrary, newParams];
    this.setData({
      handpanParamsLibrary: library,
      handpanSaveParamsVisible: false
    });
    this.saveHandpanParamsLibrary();
    
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  // ========== 导入参数 ==========
  
  // 打开导入弹窗
  onImportHandpanParams() {
    this.setData({
      handpanImportVisible: true,
      handpanImportJson: '',
      handpanImportError: ''
    });
  },

  // 关闭导入弹窗
  onCloseHandpanImport() {
    this.setData({ handpanImportVisible: false });
  },

  // 导入JSON输入
  onHandpanImportJsonInput(e) {
    this.setData({
      handpanImportJson: e.detail.value,
      handpanImportError: ''
    });
  },

  // 确认导入
  onConfirmHandpanImport() {
    const jsonStr = this.data.handpanImportJson.trim();
    if (!jsonStr) {
      this.setData({ handpanImportError: '请输入JSON数据' });
      return;
    }
    
    try {
      const notes = JSON.parse(jsonStr);
      
      // 验证数据格式
      if (!Array.isArray(notes)) {
        throw new Error('数据必须是数组格式');
      }
      
      if (notes.length === 0) {
        throw new Error('数组不能为空');
      }
      
      // 验证每个音符的必要字段
      notes.forEach((note, index) => {
        if (typeof note.cx !== 'number' || typeof note.cy !== 'number') {
          throw new Error(`第${index + 1}个音符缺少cx或cy字段`);
        }
        if (typeof note.rx !== 'number' || typeof note.ry !== 'number') {
          throw new Error(`第${index + 1}个音符缺少rx或ry字段`);
        }
      });
      
      // 导入成功
      const editorNotes = this.convertNotesToRenderData(notes);
      this.setData({
        editorNotes,
        editorSelectedId: null,
        editorSelectedNote: null,
        editorHistory: [JSON.stringify(editorNotes)],
        handpanImportVisible: false,
        handpanEditorConfirmed: false,
        handpanAudioMappingVisible: false
      });
      
      wx.showToast({ title: '导入成功', icon: 'success' });
    } catch (e) {
      this.setData({ handpanImportError: '解析失败: ' + e.message });
    }
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
  },
  
  // ========== 谱面模式相关 ==========
  
  // 切换谱面模式
  onToggleNotationMode() {
    const notationMode = !this.data.notationMode;
    
    if (notationMode) {
      // 进入谱面模式
      // 1. 停止当前播放的节奏或节拍器
      if (this.data.isPlaying) {
        this.stopPlayback();
        this.setData({ isPlaying: false });
      }
      if (this.data.metIsPlaying) {
        this.stopMetronome();
        this.setData({ metIsPlaying: false });
      }
      
      // 2. 从notation页面获取谱面数据
      this.loadNotationData();
      
      this.setData({ 
        notationMode: true,
        notationMetronomeActive: false
      });
    } else {
      // 退出谱面模式
      // 停止节拍器（如果在谱面模式下激活了）
      if (this.data.notationMetronomeActive && this.data.metIsPlaying) {
        this.stopMetronome();
        this.setData({ metIsPlaying: false });
      }
      
      this.setData({ 
        notationMode: false,
        notationMetronomeActive: false
      });
      
      // 重新检查节拍器模式
      this.checkMetronomeMode();
    }
  },
  
  // 切换谱面模式下的节拍器
  onToggleNotationMetronome() {
    const active = !this.data.notationMetronomeActive;
    this.setData({ notationMetronomeActive: active });
    
    if (active) {
      // 启动节拍器
      if (!this.data.metIsPlaying) {
        this.onMetTogglePlay();
      }
    } else {
      // 停止节拍器
      if (this.data.metIsPlaying) {
        this.onMetTogglePlay();
      }
    }
  },
  
  // 重新加载电子手碟音频（非谱面模式下的按钮）
  async onReloadHandpanAudio() {
    // 如果正在加载中，忽略点击
    if (this.data.audioLoading) {
      return;
    }
    
    // 检查音频是否已就绪
    if (this.audioReady && webAudioManager.isReady()) {
      wx.showToast({
        title: '音频已就绪',
        icon: 'success',
        duration: 1500
      });
      return;
    }
    
    // 开始加载
    this.setData({ audioLoading: true });
    
    wx.showLoading({
      title: '加载音频中...',
      mask: true
    });
    
    try {
      // 重新初始化音频池
      await this.initAudioPool();
      
      wx.hideLoading();
      
      if (this.audioReady) {
        wx.showToast({
          title: '音频加载成功',
          icon: 'success',
          duration: 1500
        });
      } else {
        wx.showToast({
          title: '部分音频加载失败',
          icon: 'none',
          duration: 2000
        });
      }
    } catch (e) {
      wx.hideLoading();
      console.error('[Metronome] 重新加载音频失败:', e);
      wx.showToast({
        title: '音频加载失败',
        icon: 'none',
        duration: 2000
      });
    } finally {
      this.setData({ audioLoading: false });
    }
  },
  
  // 谱面模式下的节拍器播放/暂停
  onNotationMetronomeToggle() {
    this.onMetTogglePlay();
  },
  
  // 从notation页面加载谱面数据
  loadNotationData() {
    const app = getApp();
    
    // 尝试从全局数据获取谱面
    let notations = app.globalData.notations || [];
    
    // 如果全局数据为空，尝试从本地存储获取
    if (!notations || notations.length === 0) {
      try {
        const savedNotations = wx.getStorageSync('notations');
        if (savedNotations) {
          notations = savedNotations;
        }
      } catch (e) {
        console.error('[Metronome] 加载谱面数据失败:', e);
      }
    }
    
    // 如果有预加载数据，使用预加载数据
    if (app.globalData.preloadedNotations) {
      notations = app.globalData.preloadedNotations;
    }
    
    // 如果有颜色数据，使用颜色数据
    let colors = this.data.notationColors;
    if (app.globalData.preloadedColors) {
      colors = {
        rightHand: app.globalData.preloadedColors.rightHandColor || '#F4D096',
        leftHand: app.globalData.preloadedColors.leftHandColor || '#314D63'
      };
    }
    
    if (notations && notations.length > 0) {
      const screenWidth = wx.getWindowInfo().screenWidth || 375;
      const canvasWidth = screenWidth - 48;
      const rpx2px = (rpx) => rpx * screenWidth / 750;
      const moduleGap = rpx2px(40);
      const measureLimit = this.data.notationPageMeasureLimit;
      
      // 分页逻辑：按小节数分页，每页最多32小节
      const pages = [];
      let currentPage = { modules: [], heights: [], totalHeight: 0, measureCount: 0 };
      
      notations.forEach((notation) => {
        const measuresPerRow = notation.measuresPerRow || 1;
        const measureCount = notation.measures ? notation.measures.length : 0;
        const rowCount = Math.ceil(measureCount / measuresPerRow);
        const measureHeight = (notation.style && notation.style.measureHeight) || 160;
        const lineSpacing = (notation.style && notation.style.lineSpacing) || 65;
        const moduleHeight = rpx2px(rowCount * measureHeight + (rowCount - 1) * lineSpacing + 60);
        
        // 如果当前页加上这个模块会超过限制，且当前页不为空，则新建一页
        if (currentPage.measureCount + measureCount > measureLimit && currentPage.modules.length > 0) {
          pages.push(currentPage);
          currentPage = { modules: [], heights: [], totalHeight: 0, measureCount: 0 };
        }
        
        // 添加模块到当前页
        currentPage.modules.push(notation);
        currentPage.heights.push(moduleHeight);
        currentPage.measureCount += measureCount;
        
        if (currentPage.modules.length > 1) {
          currentPage.totalHeight += moduleGap;
        }
        currentPage.totalHeight += moduleHeight;
      });
      
      // 添加最后一页
      if (currentPage.modules.length > 0) {
        pages.push(currentPage);
      }
      
      // 计算当前页的Canvas高度（限制最大高度避免报错）
      const currentPageData = pages[0] || { modules: [], heights: [], totalHeight: 200 };
      const maxCanvasHeight = 16000; // Canvas最大高度限制
      const canvasHeight = Math.min(Math.max(currentPageData.totalHeight, 200), maxCanvasHeight);
      
      this.setData({
        hasNotationData: true,
        notationData: currentPageData.modules,
        notationModuleHeights: currentPageData.heights,
        notationCanvasWidth: canvasWidth,
        notationCanvasHeight: canvasHeight,
        notationColors: colors,
        notationPages: pages,
        notationCurrentPage: 0,
        notationTotalPages: pages.length
      });
      
      // 延迟初始化Canvas渲染
      setTimeout(() => {
        this.initNotationCanvas();
      }, 100);
    } else {
      this.setData({
        hasNotationData: false,
        notationData: null,
        notationPages: [],
        notationCurrentPage: 0,
        notationTotalPages: 1
      });
    }
  },
  
  // 切换谱面页码
  onNotationPageChange(e) {
    const newPage = e.detail.current;
    if (newPage === this.data.notationCurrentPage) return;
    
    const pages = this.data.notationPages;
    if (newPage < 0 || newPage >= pages.length) return;
    
    const pageData = pages[newPage];
    const maxCanvasHeight = 16000;
    const canvasHeight = Math.min(Math.max(pageData.totalHeight, 200), maxCanvasHeight);
    
    this.setData({
      notationCurrentPage: newPage,
      notationData: pageData.modules,
      notationModuleHeights: pageData.heights,
      notationCanvasHeight: canvasHeight
    });
    
    // 重新渲染Canvas
    setTimeout(() => {
      this.initNotationCanvas();
    }, 100);
  },
  
  // 初始化谱面Canvas渲染
  initNotationCanvas() {
    if (!this.data.notationData) {
      console.warn('[Metronome] 无谱面数据，跳过Canvas初始化');
      return;
    }
    
    const query = wx.createSelectorQuery();
    query.select('#notation-canvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error('[Metronome] 获取Canvas节点失败');
          return;
        }
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio || 2;
        
        // 设置Canvas尺寸
        canvas.width = this.data.notationCanvasWidth * dpr;
        canvas.height = this.data.notationCanvasHeight * dpr;
        ctx.scale(dpr, dpr);
        
        // 保存canvas引用
        this._notationCanvas = canvas;
        this._notationCtx = ctx;
        
        // 渲染谱面
        this.renderNotationCanvas();
      });
  },
  
  // 渲染谱面到Canvas - 渲染所有模块
  renderNotationCanvas() {
    const ctx = this._notationCtx;
    const notations = this.data.notationData;
    
    if (!ctx || !notations || !Array.isArray(notations) || notations.length === 0) return;
    
    const width = this.data.notationCanvasWidth;
    const height = this.data.notationCanvasHeight;
    const moduleHeights = this.data.notationModuleHeights || [];
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // 获取屏幕信息
    const screenWidth = wx.getWindowInfo().screenWidth || 375;
    const rpx2px = (rpx) => rpx * screenWidth / 750;
    const moduleGap = rpx2px(40); // 模块之间的间距
    
    // 使用CanvasNotationRenderer渲染每个模块
    try {
      const { CanvasNotationRenderer } = require('../../utils/canvasRenderer.js');
      
      let currentY = 0;
      
      notations.forEach((notation, index) => {
        const moduleHeight = moduleHeights[index] || 200;
        
        // 保存当前上下文状态
        ctx.save();
        
        // 平移到当前模块位置
        ctx.translate(0, currentY);
        
        // 创建新的渲染器实例
        const renderer = new CanvasNotationRenderer({
          colors: this.data.notationColors
        });
        
        // 初始化渲染器
        renderer.canvas = this._notationCanvas;
        renderer.ctx = ctx;
        renderer.width = width;
        renderer.height = moduleHeight;
        renderer.dpr = 1; // 已经在上面scale过了
        
        // 设置数据
        renderer.setData(notation, 'portrait', notation.measuresPerRow || 1);
        renderer.updateColors(
          this.data.notationColors.rightHand,
          this.data.notationColors.leftHand
        );
        
        // 渲染
        renderer.render();
        
        // 恢复上下文状态
        ctx.restore();
        
        // 更新Y偏移
        currentY += moduleHeight + moduleGap;
      });
      
      console.log('[Metronome] 谱面渲染完成，共', notations.length, '个模块');
    } catch (e) {
      console.error('[Metronome] 谱面渲染失败:', e);
      
      // 降级：显示简单提示
      ctx.fillStyle = '#666666';
      ctx.font = '14px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('谱面加载中...', width / 2, height / 2);
    }
  },
  
  // 页面显示时刷新谱面数据
  onShow() {
    // 如果处于谱面模式，刷新谱面数据
    if (this.data.notationMode) {
      this.loadNotationData();
    }
  },

  // ========== 开始演奏（音游模式） ==========
  
  /**
   * 进入音游模式
   * 导航到音游入口页面，让用户选择曲谱并配置
   */
  onStartRhythmGame() {
    // 保存当前手碟配置到本地存储，方便音游子包读取
    try {
      wx.setStorageSync('handpanNotes', this.data.handpanNotes);
      wx.setStorageSync('handpanVolume', this.data.handpanVolume);
      wx.setStorageSync('handpanDisplayMode', this.data.handpanDisplayMode);
    } catch (e) {
      console.warn('[Metronome] 保存手碟配置失败:', e);
    }

    // 导航到音游入口页面
    wx.navigateTo({
      url: '/pages/rhythm_game/pages/entry/index',
      fail: (err) => {
        console.error('[Metronome] 导航到音游页面失败:', err);
        wx.showToast({
          title: '功能加载中，请稍后再试',
          icon: 'none'
        });
      }
    });
  }
});