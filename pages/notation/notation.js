const app = getApp();
const libraryManager = require('../../utils/libraryManager.js');
const { CanvasNotationRenderer } = require('../../utils/canvasRenderer.js');

// 当前版本号 - 用于版本更新弹窗检测
const CURRENT_VERSION = '7.0.0';

// 存储优化工具
const { 
  AsyncStorage, 
  LayoutCacheManager, 
  PlaybackCanvasCacheManager,
  optimizedStorage, 
  workerManager 
} = require('../../utils/storageOptimizer.js');

// 播放管理器延迟加载（使用主包模块，音频资源按需加载）
let sheetPlaybackManager = null;
const getSheetPlaybackManager = async () => {
  if (sheetPlaybackManager) {
    return sheetPlaybackManager;
  }

  // 预加载 audio 分包（用于音频资源，非模块代码）
  // 注意：主包无法 require 分包模块，但可以预加载分包资源
  const loadSubPackageAPI = wx.loadSubPackage || wx.loadSubpackage;
  
  if (loadSubPackageAPI) {
    try {
      await new Promise((resolve) => {
        loadSubPackageAPI({
          name: 'audio',
          success: () => {
            console.log('[Notation] audio 分包预加载成功');
            wx.setStorageSync('subpackage_audio_loaded', true);
            resolve();
          },
          fail: (err) => {
            console.warn('[Notation] audio 分包预加载失败（可忽略）:', err);
            resolve(); // 即使失败也继续，因为模块在主包
          }
        });
        // 超时保护：2秒后自动继续
        setTimeout(resolve, 2000);
      });
    } catch (e) {
      console.warn('[Notation] 分包预加载异常:', e);
    }
  } else {
    console.log('[Notation] wx.loadSubPackage 不可用，跳过分包预加载');
  }

  // 从主包加载播放管理器模块（主包可以正常 require）
  try {
    const module = require('../../utils/sheetPlaybackManager.js');
    sheetPlaybackManager = module.sheetPlaybackManager;
    console.log('[Notation] sheetPlaybackManager 加载成功');
    return sheetPlaybackManager;
  } catch (e) {
    console.error('[Notation] 加载 sheetPlaybackManager 失败:', e);
    throw new Error('播放模块加载失败: ' + e.message);
  }
};

// 内置示例数据（完整示例，包含所有module）
const BUILTIN_EXAMPLE = {
      id: 'builtin_example_001',
      type: 'file',
      path: ['sample_folder'],
      file_name: "Urban",
      title: 'Urban',
      author: 'Author: Kate Stone',
      composer: 'Kate Stone',
      rootNote: 'D',
      scaleType: 'Kurd',
      noteCount: 10,
      tempo: 100,
      timing: "4/4",
      notationType: 'digital',
      difficulty: 3,
      introduction: '经典的Handpan曲目，适合入门练习',
      rotation: "手机竖屏（默认）",
      style: {
        measureHeight: 160,
        noteFontSize: 28,
        lineSpacing: 65
      },
      globalStyle: {
        measureHeight: 160,
        noteFontSize: 28,
        lineSpacing: 65
      },
      code: "\\begin{module}{Intro}\n[(8)/(4)+ -+-+ (6)/()| (8)/(4) +-+(6)/()+-| (8)/(4) +-+-+-|-+-+-+-]\\\\\n[(7)/(3) +-+-+ (5)/()|(7)/(3)+ -+ (5)/()+-| (7)/(3) +-+-+-|-+-+-+-]\\\\\n[(6)/(2) +-+-+ (4)/()|(6)/(2)+ -+ (4)/()+-| (6)/(2) +-+-+-|-+-+-+-]\\\\\n[(5)/(1) +-+-+ (3)/()|(5)/(1) +-+ (3)/()+-| (5)/(1) +-+-+-|-+-+-+-]\\\\\n[(8)/(4)+ -+-+ (6)/()| (8)/(4)+ -+(6)/()+-| (8)/(4) +-+-+-|()/(4)+(7)/()+()/(8)+-]\\\\\n[(7)/(3) +-+-+ (5)/()|(7)/(3) +-+ (5)/()+-| (7)/(3) +-+-+-|()/(3)+-+(5)/()+-]\\\\\n[(6)/(2) +-+-+ (4)/()|(6)/(2)+ -+ (4)/()+-| (6)/(2) +-+-+-|()/(8)+(7)/()+()/(6)+-]\\\\\n[(5)/(1) +-+-+ (3)/()|(5)/(1) +-+ (3)/()+-| (5)/(1) +-+-+-|()/(1)+-+(3)/()+-]\\\\\n[(6)/(2) +-+-+ (4)/()|(6)/(2)+ -+ (4)/()+-| (6)/(2) +-+-+-|()/(4)+-+-+-]\\\\\n[(7)/(3) +-+-+ (5)/()|(7)/(3) +-+ (5)/()+-| (7)/(3) +-+-+-|()/(3)+-+(5)/()+-]\\\\\n[(8)/(4)+ -+-+-|- +-+-+ -|-+-+-+-|-+-+-+-]\\\\\n[()/(s)+ -+-+-|()/(s)+-+-+ -|()/(s)+-+-+-|()/(s)+-+(D)/()+-]\\\\\n\\end{module}\n\\begin{module}{A-1}\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-]\\\\\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(6)/(D)+-+ ()/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|(7)/(D)+-+ ()/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(8)/(D)+-+ ()/(1)+-]\\\\\n[(7)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (7)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (7)/(1)+-]\\\\\n[8+ -+-+-|7+-+6+-|5+ -+-+ -|6+-+ 5+-]\\\\\n\\end{module}\n\\begin{module}{A-2}\n[6/D -/1(d)/()|/D-6/1-|6/D -/1(d)/()|/D-6/1-]\\\\\n[6/D -/1(d)/()|/D-6/1-|7/D -/1(d)/()|6/D-/1-]\\\\\n[5/D -/1(d)/()|/D-5/1-|5/D -/1(d)/()|/D-5/1-]\\\\\n[5/D -/1(d)/()|/D-5/1-|6/D -/1(d)/()|7/D-/1-]\\\\\n[8/D -/1(d)/()|/D-8/1-|8/D -/1(d)/()|/D-8/1-]\\\\\n[8/D -/1(d)/()|/D-8/1-|7/D -/1(d)/()|8/D-/1-]\\\\\n[7/D -/1(d)/()|/D-7/1-|7/D -/1(d)/()|/D-7/1-]\\\\\n[8---|7-6-|5---|6-5-]\n\\end{module}\n\\begin{module}{B-1}\n[1/4-/x(1)/()|/4-1/4-|1/4-/x(1)/()|/4-1/4-]\\\\\n[1/5-/x(1)/()|/5-1/5-|1/5-/x(1)/()|/5-1/5-]\\\\\n[1/6-/x(1)/()|/6-1/6-|1/6-/x(1)/()|/6-1/6-]\\\\\n[1/7-/7(1)/()|/7-1/7-|8765|4-5-]\\\\\n\\end{module}\n\\begin{module}{B-2}\n[1/4-/x(1)/()|/4-1/4-|1/4-/x(1)/()|/4-1/4-]\\\\\n[1/5-/x(1)/()|/5-1/5-|1/5-/x(1)/()|/5-1/5-]\\\\\n[1/6-/x(1)/()|/6-1/6-|1/6-/x(1)/()|/6-1/6-]\\\\\n[1/7-/7(1)/()|/7-1/7-|8765|6-5-]\\\\\n\\end{module}\n\\begin{module}{C-1}\n[8/4-4(8)/()|4-8/4-|8/4-4(8)/()|4-8/4-]\\\\\n[6/2-2(6)/()|2-6/2-|6/2-2(6)/()|2-6/2-]\\\\\n[7/3-/3(7)/()|/3-7/3-|7/3-/3(7)/()|/3-7/3-]\\\\\n[5/1-/1(5)/()|/1-5/1-|5/1-/1(5)/()|/1-5/1-]\\\\\n\\end{module}\n\\begin{module}{C-2}\n[8/4-4(8)/()|4-8/4-|8/4-4(8)/()|4-8/4-]\\\\\n[6/2-2(6)/()|2-6/2-|6/2-2(6)/()|2-8/2-]\\\\\n[7/3-/3(7)/()|/3-7/3-|7/3-/3(7)/()|/3-7/3-]\\\\\n[5/1-/1(5)/()|/1-5/1-|5/1-/1(5)/()|/1-5/1-]\\\\\n[6/2-2(6)/()|2-6/2-|6/2-2(6)/()|2-6/2-]\\\\\n[7/3-/3(7)/()|/3-7/3-|7/3-/3(7)/()|/3-7/3-]\\\\\n[8/4---|----|----|----]\\\\\n[()/(s)+ -+-+-|()/(s)+-+-+ -|()/(s)+-+-+-|()/(s)+-+(D)/()+-]\\\\\n\\end{module}\n\\begin{module}{A-3}\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-]\\\\\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(6)/(D)+-+ ()/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|(7)/(D)+-+ ()/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(8)/(D)+-+ ()/(1)+-]\\\\\n[(7)/(D)+ -+(1)/()+ (d)/()|()/(D)+-+ (7)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (7)/(1)+-]\\\\\n[8+ -+-+-|7+-+6+-|5+ -+-+ -|6+-+ 5+-]\\\\\n\\end{module}\n\\begin{module}{A-4}\n[6/D -/1(d)/()|/D-6/1-|6/D -/1(d)/()|/D-6/1-]\\\\\n[6/D -/1(d)/()|/D-6/1-|7/D -/1(d)/()|6/D-/1-]\\\\\n[5/D -/1(d)/()|/D-5/1-|5/D -/1(d)/()|/D-5/1-]\\\\\n[5/D -/1(d)/()|/D-5/1-|6/D -/1(d)/()|7/D-/1-]\\\\\n[8/D -/1(d)/()|/D-8/1-|8/D -/1(d)/()|/D-8/1-]\\\\\n[8/D -/1(d)/()|/D-8/1-|7/D -/1(d)/()|8/D-/1-]\\\\\n[7/D -/1(d)/()|/D-7/1-|7/D -/1(d)/()|/D-7/1-]\\\\\n[8---|7-6-|5---|6-5-]\n\\end{module}\n\\begin{module}{B-3}\n[1/4-/4(1)/()|/4-1/4-|1/4-/4(1)/()|/4-1/4-]\\\\\n[1/5-/5(1)/()|/5-1/5-|1/5-/5(1)/()|/5-1/5-]\\\\\n[1/6-/6(1)/()|/6-1/6-|1/6-/6(1)/()|/6-1/6-]\\\\\n[1/7-/7(1)/()|/7-1/7-|8765|4-5-]\\\\\n\\end{module}\n\\begin{module}{B-4}\n[1/4-/4(1)/()|/4-1/4-|1/4-/4(1)/()|/4-1/4-]\\\\\n[1/5-/5(1)/()|/5-1/5-|1/5-/5(1)/()|/5-1/5-]\\\\\n[1/6-/6(1)/()|/6-1/6-|1/6-/6(1)/()|/6-1/6-]\\\\\n[1/7-/7(1)/()|/7-1/7-|8765|6-5-]\\\\\n\\end{module}\n\\begin{module}{C-3}\n[8/4-4(8)/()|4-8/4-|8/4-4(8)/()|4-8/4-]\\\\\n[6/2-2(6)/()|2-6/2-|6/2-2(6)/()|2-6/2-]\\\\\n[7/3-/3(7)/()|/3-7/3-|7/3-/3(7)/()|/3-7/3-]\\\\\n[5/1-/1(5)/()|/1-5/1-|5/1-/1(5)/()|/1-5/1-]\\\\\n\\end{module}\n\\begin{module}{C-4}\n[8/4-4(8)/()|4-8/4-|8/4-4(8)/()|4-8/4-]\\\\\n[6/2-2(6)/()|2-6/2-|6/2-2(6)/()|2-8/2-]\\\\\n[7/3-/3(7)/()|/3-7/3-|7/3-/3(7)/()|/3-7/3-]\\\\\n[5/1-/1(5)/()|/1-5/1-|5/1-/1(5)/()|/1-5/1-]\\\\\n[6/2-2(6)/()|2-6/2-|6/2-2(6)/()|2-6/2-]\\\\\n[7/3-/3(7)/()|/3-7/3-|7/3-/3(7)/()|/3-7/3-]\\\\\n[8/4---|----|----|----]\\\\\n[()/(s)+ -+-+-|()/(s)+-+-+ -|()/(s)+-+-+-|()/(s)+-+(D)/()+-]\\\\\n\\end{module}\n\\begin{module}{End}\n[8/4--6|4-8/-|6---|4(8)/()65]\\\\[7/3--/5|/3-7-|/5---|/3--7]\\\\\n[6/2--4|2-6/-|4---|2-6/-]\\\\[5/1--3|/1-5-|/3---|1-/5-]\\\\\n[8/4---|----|----|----]\n\\end{module}\n",
      createTime: Date.now(),
      modifyTime: Date.now(),
      starred: false
    };

Page({
  data: {
    notations: [],
    mainTitle: '',
    subTitle: '',
    globalTempo: 60,
    timeSignatureBeats: 4, // 顶数：默认4（可切换3）
    timeSignatureBottom: 4,
    timeSignatureDisplay: '4/4', // 显示用：可能是"自由设定"
    currentTimeSignatureType: 'standard', // 'standard' 或 'custom'
    mainTitleColor: '#314D63',
    subTitleColor: '#8FB9AB',
    rightHandColor: '#F4D096',
    leftHandColor: '#314D63',
    backgroundOpacity: 0.10, // 背景图片透明度（默认10% = 0.10）
    showEditModal: false,
    editModalTitle: '',
    editValue: '',
    editInputType: 'text',
    editPlaceholder: '',
    currentEdit: null,
    actionCollapsed: false,
    showLayoutMenu: false, // 布局二级菜单显示状态
    editing: null,
    editingValue: '',
    // 排版和横屏
    orientation: 'portrait', // 'portrait' 或 'landscape'
    measuresPerRow: 1, // 当前排版每行小节数（随横竖屏倍增）
    measuresPerRowPortrait: 1, // 竖屏基准每行小节数（按导入/模板检测）
    // 帮助模态框
    showFloatingMetronome: false,
    showMetronomeHelpModal: false,
    showRotationHelpModal: false,
    showTimeSignatureHelpModal: false,
    showCustomTimeSignatureModal: false,
    customTimeSignatureTemplate: '',
    customTimeSignatureError: '',
    customTimeSignatureValid: false,
    // 可视化拍号输入
    visualNoteCount: 16,
    visualDots: [],
    visualSeparators: [],
    measureInfoList: [],
    // 模块标签编辑弹窗
    showLabelEditModal: false,
    labelEditModuleId: null,
    labelEditName: '',
    labelEditRemark: '',
    
    // 全局排版设置
    showGlobalLayoutModal: false,
    globalMeasureHeight: 160,
    globalMeasureHeightError: '',
    globalNoteFontSize: 28,
    globalNoteFontSizeError: '',
    globalLineSpacing: 65,
    globalLineSpacingError: '',
    // 全局排版存储值（竖屏基准）
    globalStylePortrait: {
      measureHeight: 160,
      noteFontSize: 28,
      lineSpacing: 65
    },
    // 模块设置弹窗中显示的全局默认值
    moduleDefaultMeasureHeight: 160,
    moduleDefaultNoteFontSize: 28,
    moduleDefaultLineSpacing: 65,

    // 模块设置
    showModuleSettingsModal: false,
    currentModuleId: null,
    moduleLineCount: 4,
    moduleLineCountError: '',
    moduleTimeSignatureBeats: 4,
    moduleCustomTemplate: '',
    moduleCustomTemplateError: '',
    moduleMeasureHeight: 160,
    moduleMeasureHeightError: '',
    moduleNoteFontSize: 28,
    moduleNoteFontSizeError: '',
    moduleLineSpacing: 65,
    moduleLineSpacingError: '',
    // 模块拍号设置弹窗
    showModuleTimeSignatureModal: false,
    moduleVisualNoteCount: 16,
    moduleVisualDots: [],
    moduleVisualSeparators: [],
    moduleMeasureInfoList: [],
    moduleTimeSignatureTemplate: '',
    moduleTimeSignatureError: '',
    moduleTimeSignatureValid: false,
    // 节拍器相关
    metronomeBeats: [1, 2, 3, 4],
    currentMetronomeBeat: -1,
    metronomeTimer: null,
    metronomeTempo: 120,
    metronomeBeatsCount: 4,
    manualOrientation: false,
    // 导入功能相关
    showImportModal: false,
    importCode: '',
    importError: '',
    importMode: 'add', // 'add' 添加新模块, 'replace' 覆盖当前模块
    importTargetModuleId: null, // 当mode为replace时，指定要替换的模块ID
    showImportHelpModal: false,
    importHelpDismissed: false, // 用户是否选择了"不再显示"帮助
    // 谱式转换相关
    notationType: 'digital', // 'digital' 或 'simplified'
    showNotationTypeModal: false,
    notationTypeTemp: 'digital', // 临时选择的谱式
    migrateMeasures: true, // 是否迁移谱面数据
    customConversionTable: false, // 是否使用自定义转换表
    conversionTableText: '', // 自定义转换表文本
    conversionTableError: '', // 转换表验证错误
    conversionMappings: [], // 转换映射数组 [{key: '1', value: '3'}, ...]
    conversionMappingError: '', // 映射验证错误
    hasEmptyConversionMapping: false, // 是否有空的映射
    // 新版默认转换表（数字谱 -> [简谱, SPN]）
    // 注：手碟约定俗成，9对应5'(C5)而非4'(Bb4)
    // 【优化】D音按简谱的"6,"（低音6）动态计算SPN，以便移调时正确分配音频
    defaultConversionTable: {
      // 基础音组 (Ding & 底层音)
      'D': ['6,', 'D_DYNAMIC'],  // D音按6,（低音6）动态计算，SPN根据首调变化
      '0': ['0', ''], 
      'd': ['d', ''],        // d/T/K 特殊处理，SPN在运行时动态判断
      '1': ['3', 'A3'],    
      '2': ['4', 'Bb3'],     
      '3': ['5', 'C4'], 
      '4': ['6', 'D4'],     
      '5': ['7', 'E4'],    
      '6': ['1\'', 'F4'],   
      '7': ['2\'', 'G4'],    
      '8': ['3\'', 'A4'],    
      '9': ['5\'', 'C5'],    // 手碟约定俗成：9 -> 5' -> C5
      '10': ['6\'', 'D5'],   
      '11': ['7\'', 'E5'],   
      // 特殊演奏技法标记 (SPN 为空)
      's': ['s', ''],       
      'P': ['P', ''],       
      'H': ['H', ''],    
      'T': ['T', ''],       // T/d/K 特殊处理
      'F': ['F', ''],       
      'B': ['B', ''],        
      'O': ['O', ''],     
      'x': ['x', ''],
      '·': ['·', ''],  
      'K': ['K', ''],       // K/T/d 特殊处理
      'M': ['M', '']
    },
    // 转换表库相关
    conversionTableLibrary: [], // 存储的转换表列表 [{id, name, table: {...}}]
    showConversionLibraryModal: false, // 显示转换表库弹窗
    showNewConversionTableModal: false, // 显示新建转换表弹窗
    newConversionTableName: '', // 新建转换表的名称
    newConversionTableData: [], // 新建转换表的数据
    currentConversionTableId: null, // 当前使用的转换表ID
    // 首调设置
    conversionRootNote: 'F3', // 首调设置 (SPN计法=1)
    showConversionRootPicker: false, // 首调选择器显示
    spnNoteOptions: ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'],
    spnOctaveOptions: ['1', '2', '3', '4', '5', '6'],
    conversionRootPickerValue: [5, 2], // 默认F3
    tempConversionRootNote: 'F3',
    isNewTableRootPicker: false, // 是否是新建表的首调选择器
    newTableRootNote: 'F3', // 新建转换表的首调
    conversionMode: 'mapping', // 转换模式: 'mapping' 映射转换, 'noMapping' 无映射转换
    // 转换表单元格编辑
    conversionEditingKey: null, // 当前编辑的转换映射key
    conversionEditingField: null, // 当前编辑的字段 (simplified/spn)
    newTableEditingIndex: null, // 新建表编辑的行索引
    newTableEditingField: null, // 新建表编辑的字段
    conversionUseNativeInput: false, // 是否使用原生输入（虚拟键盘关闭后切换到系统键盘）
    newTableUseNativeInput: false, // 新建表是否使用原生输入
    customConversionTableObj: {}, // 解析后的自定义转换表
    // 导出功能相关
    showExportOptionsModal: false,
    exportMode: 'long', // 'long' 长图模式, 'paged' 分页模式
    exportLayoutMode: 'compact', // 'compact' 紧凑模式, 'loose' 宽松模式
    a4Orientation: 'portrait', // A4纸张方向: 'portrait' 纵向, 'landscape' 横向
    exportA4Orientation: 'portrait', // 导出规格弹窗中选择的A4方向
    showExportPreview: false,
    exportPreviewImages: [],
    currentPreviewPage: 0,
    // 导出背景图配置
    exportBgOpacity: 0.10, // 背景图透明度 0-1，默认0.10与谱面一致
    exportBgSize: 0.67, // 背景图大小比例 0-1，默认2/3
    // 导出音符颜色配置
    exportColorMode: 'dual', // 'dual' 双色模式, 'single' 单色模式
    exportSingleColor: '#314D63', // 单色模式的颜色
    exportRightHandColor: '#F4D096', // 双色模式右手颜色
    exportLeftHandColor: '#314D63', // 双色模式左手颜色
    // 导出格式选择相关
    showExportFormatPicker: false, // 显示PNG/PDF格式选择弹窗
    showPdfSuccessModal: false, // PDF导出成功弹窗
    exportedPdfPath: '', // 导出的PDF文件路径
    exportedPdfFileName: '', // 导出的PDF文件名
    // PDF导出进度条相关
    showPdfProgressModal: false, // 显示PDF导出进度弹窗
    pdfProgressPercent: 0, // 进度百分比 0-100
    pdfProgressStage: '', // 当前阶段描述
    pdfExportCancelled: false, // 用户是否取消导出
    // 导出为代码相关
    showExportCodeModal: false,
    exportedCode: '',
    exportModuleCode: '', // 模块导出代码

    // 撤销功能相关（优化版：使用动作记录而非完整快照）
    undoStack: [], // 保存最近20步操作的动作记录
    redoStack: [], // 重做栈

    // 保存到曲库弹窗导航
    saveFolderCurrentPath: [],
    saveFolderItems: [],
    saveFolderBreadcrumbs: [],
    
    // Library文件关联（标识当前谱面来源）
    libraryFileId: null, // 文件ID（时间戳）
    libraryFilePath: null, // 文件路径（数组）
    libraryFileName: null, // 文件名
    showSaveModeModal: false, // 保存模式选择弹窗
    
    // 存储状态显示
    storageDisplay: '未保存', // 显示的存储位置，如 "文件夹/文件名" 或 "文件夹/文件名（未保存）" 或 "未保存"
    
    // 分页相关
    currentPage: 0, // 当前页码
    pages: [], // 每页的modules列表 [{modules: [...], startMeasureCount: 0}, ...]
    totalPages: 1, // 总页数
    enablePagination: false, // 是否启用分页
    currentPageModules: [], // 当前页的modules（用于WXML直接访问）
    pageTransitioning: false, // 页面切换动画中
    pageTransitionDirection: '', // 'left' 或 'right'
    touchStartX: 0, // 触摸起始X坐标
    touchStartY: 0, // 触摸起始Y坐标

    // 翻页加载提示与节拍器
    showPageLoadingOverlay: false,
    overlayMetronomeBeat: -1,
    overlayMetronomeBeats: [0, 1, 2, 3],
    overlayMetronomeTempo: 80,
    // 已移除导出前图片加载测试

    // 开屏弹窗相关
    showSplashModal: false,
    isTablet: false, // 是否为平板设备
    splashPrivacyExpanded: false, // 隐私权限说明是否展开
    
    // 版本更新弹窗相关
    showUpdateModal: false, // 是否显示版本更新弹窗
    currentVersion: CURRENT_VERSION, // 当前版本号

    // 页面加载状态（用于从 splash 过渡的淡入动画）
    pageReady: false,

    // 阅读模式相关
    readingMode: false, // false: 编辑模式, true: 阅读模式
    
    // 虚拟键盘相关
    showVirtualKeyboard: false, // 是否显示虚拟键盘
    virtualKeyboardMode: 'number', // 'number' 数字键盘, 'symbol' 符号键盘
    virtualKeyboardDisplay: '', // 底层源代码显示
    virtualKeyboardRendered: '', // 渲染结果显示
    currentEditingNote: null, // 当前编辑的音符信息
    superscriptMode: null, // null | 'right' | 'left' 上标模式
    superscriptContent: '', // 上标内容
    vkParsed: { // 解析后的音符结构（用于区域A渲染）
      baseNote: '',
      octaveUp: 0,
      octaveDown: 0,
      underline: false,
      leftSup: '',
      rightSup: ''
    },
    vkClipboard: '', // 虚拟键盘剪贴板（用于复制粘贴功能）
    showKeyboardHelp: false, // 是否显示虚拟键盘图标说明
    
    // ========== 更多设置界面相关 ==========
    showKeyboardSettings: false, // 是否显示更多设置界面
    insertDirection: 'right', // 插入方向: 'right' 向右插入, 'left' 向左插入
    showHelpBtnSetting: true, // 是否显示帮助按钮
    pitchBarEnabled: true, // 是否启用音高条（数字键盘左侧）
    addDotActive: false, // 附点模式是否激活
    addArpeggioActive: false, // 琶音模式是否激活
    isCustomizingKeyboard: false, // 是否在自定义键盘模式
    customSymbolKeys: { // 自定义符号键（默认值与系统一致）
      key1: 'd', key2: 'D', key3: 'P',
      key4: 's', key5: 'T', key6: 'x',
      key7: 'F', key8: 'B', key9: 'O',
      key10: 'H'
    },
    defaultSymbolKeys: { // 默认符号键（用于恢复）
      key1: 'd', key2: 'D', key3: 'P',
      key4: 's', key5: 'T', key6: 'x',
      key7: 'F', key8: 'B', key9: 'O',
      key10: 'H'
    },
    customKeyEditingIndex: null, // 当前正在编辑的自定义键索引
    
    // 胶囊音高调节器相关
    pitchLevel: 2, // 音高档位: 0-倍低音, 1-低音, 2-原音, 3-高音, 4-倍高音
    pitchLevelConfig: [
      { name: '倍低音', icon: '♪' },
      { name: '低音', icon: '♪' },
      { name: '原音', icon: '♪' },
      { name: '高音', icon: '♪' },
      { name: '倍高音', icon: '♪' }
    ],
    pitchDragging: false, // 是否正在拖动音高调节器
    pitchDragProgress: 60, // 拖动时的实时进度 (0-100)，初始值对应 pitchLevel=2
    pitchToastVisible: false, // 音高提示是否显示
    // 备注弹窗相关
    showAnnotationModal: false, // 是否显示备注编辑弹窗
    annotationModalMode: 'add', // 'add' 或 'edit'
    currentAnnotation: {
      sheet: null,
      measure: null,
      beat: null,
      subdivision: null,
      text: ''
    },
    
    // 新增：曲谱元信息字段
    composer: 'Your Name', // 制谱人
    rootNote: 'D', // 主音
    scaleType: 'Kurd', // 调式
    noteCount: 10, // 音位数
    difficulty: 1, // 难度（1-5颗星）
    introduction: '', // 简介
    
    // 难度选择弹窗
    showDifficultyModal: false,
    tempDifficulty: 1, // 临时选择的难度
    
    // 副标题编辑弹窗
    showSubtitleEditModal: false,
    tempSubtitle: 'Author: Unknown',
    tempComposer: 'Your Name',
    tempRootNote: 'D',
    tempScaleType: 'Kurd',
    tempNoteCount: 10,
    // 副标题编辑-iOS选择器状态
    showSubtitleRootNotePicker: false,
    showSubtitleScaleTypePicker: false,
    showSubtitleNoteCountPicker: false,
    subtitleRootNotePickerValue: [2], // 默认D
    subtitleScaleTypePickerValue: [9], // 默认Kurd
    subtitleNoteCountPickerValue: [3], // 默认10
    tempSubtitleRootNote: 'D',
    tempSubtitleScaleType: 'Kurd',
    tempSubtitleNoteCount: 10,
    
    // 简介弹窗
    showIntroModal: false,
    tempIntroduction: '',
    
    // 删除行确认弹窗
    showDeleteRowModal: false,
    pendingDeleteRowInfo: null, // 待删除行的信息 { notationIndex, rowStartIndex, measuresPerRow }
    
    // ========== 任务1: 删除拍位确认弹窗 ==========
    showDeleteBeatModal: false, // 是否显示删除拍位确认弹窗
    deleteBeatAllEmpty: true, // 是否删除当前位置后续所有空拍（默认开启）
    pendingDeleteBeatInfo: null, // 待删除拍位的信息 { notationIndex, measureIndex, beatIndex, subIndex, deleteAllEmpty }
    
    // ========== 任务2: 复制粘贴功能 ==========
    beatClipboard: '', // 全局拍位剪贴板（格式: |拍A代码|拍B代码|...）
    beatClipboardBeats: [], // 剪贴板中的拍数组（解析后的数据结构）
    isSelectingBeats: false, // 是否处于拍位选择模式
    beatSelectionStart: null, // 选择起点 { notationId, measureIndex, beatIndex }
    beatSelectionEnd: null, // 选择终点 { notationId, measureIndex, beatIndex }
    showBeatSelectionBubble: false, // 是否显示复制/粘贴气泡弹窗
    beatBubblePosition: { x: 0, y: 0 }, // 气泡弹窗位置（已废弃，保留兼容）
    beatBubbleCanvasPosition: { x: 0, y: 0 }, // Canvas模式下气泡弹窗位置
    selectedBeatsInfo: [], // 选中的拍位信息数组
    // Canvas模式两步选择法
    canvasSelectStep: 0, // 0: 未选择, 1: 已选择起点等待终点, 2: 选择完成
    canvasSelectStartInfo: null, // Canvas模式起点信息
    
    // 主音选项
    rootNoteOptions: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    rootNoteDisplayOptions: ['C', 'C# / Db', 'D', 'D# / Eb', 'E', 'F', 'F# / Gb', 'G', 'G# / Ab', 'A', 'A# / Bb', 'B'],
    
    // 调式选项
    scaleTypeOptions: [
      'Aegean', 'Akebono', 'Amara / Celtic Minor', 'Ashakiran / Sabye', 'Avebury',
      'Blues', 'Equinox', 'Hijaz / Harmonic Minor', 'Integral', 'Kurd / Annaziska',
      'La Sirena', 'Low Mystic', 'Magic Voyage', 'Major', 'Minor', 'Nordlys',
      'Onoleo', 'Oxalista', 'Pentatonic', 'Pygmy / Low Pygmy', 'Raga Desh',
      'Romanian', 'Saladin', 'Ursa Minor', 'Ysha Savita', 'Multi scale', 'Other scale'
    ],
    
    // 音位数选项（7-25）
    noteCountOptions: Array.from({length: 19}, (_, i) => i + 7),
    
    // ========== 曲谱播放相关 ==========
    isPlaybackMode: false, // 是否处于播放模式
    isPlaying: false, // 是否正在播放
    showPlaybackCountdown: false, // 是否显示倒计时
    countdownNumber: 3, // 倒计时数字
    countdownEnabled: true, // 是否启用倒计时（默认启用）
    showPlaybackLoading: false, // 是否显示加载提示
    playbackLoadingText: '加载中...', // 加载提示文字
    playbackHighlightColumn: '', // 当前高亮的列ID (moduleIndex-measureIndex-beatIndex-subdivisionIndex)
    playbackPrevColumns: {}, // 上一个高亮的列（用于淡出效果）
    playbackStartColumn: null, // 播放起始列（如有选中的音符格）
    
    // ========== 音频映射弹窗相关 ==========
    showAudioMappingModal: false, // 是否显示音频映射弹窗
    audioMappings: [], // 音频映射数组 [{key, simplified, spn, hasAudio}]
    audioMappingEditingIndex: null, // 当前编辑的行索引
    audioMappingEditingField: null, // 当前编辑的字段
    audioMappingUseNativeInput: false, // 是否使用原生输入
    audioMappingPreviewPlaying: null, // 当前正在试听的行索引
    availableAudioFiles: [], // 可用的音频文件名列表
    audioMappingsLoaded: false, // 音频文件列表是否已加载
    currentAudioMappingTableId: null, // 当前使用的音频映射表ID
    showAudioMappingLibrary: false, // 显示音频映射表库弹窗
    saveAudioMappingToScore: false, // 是否将音频映射保存到曲谱
    savedAudioMappings: null, // 曲谱保存的音频映射（从文件数据加载）
    audioMappingNewNotesHint: '', // 新音符类型提示
    // 分包加载状态（用于从分包加载页面返回后恢复状态）
    _pendingSubpackageReturn: false, // 是否正在等待分包加载返回
    _pendingAudioMappings: null, // 待恢复的音频映射数据
    _pendingRootNote: null, // 待恢复的首调设置
    _pendingModalWasOpen: false, // 分包加载前音频映射弹窗是否打开
    _pendingLoadAfterSave: false, // 从曲库「保存后打开」且当前未保存时，保存完成后需加载 pending_notation_load
    // 新建/编辑音频映射转换表相关
    showNewAudioMappingTableModal: false, // 显示新建转换表弹窗
    newAudioMappingTableName: '', // 新建转换表的名称
    newAudioMappingTableData: [], // 新建转换表的数据
    newAudioTableRootNote: 'F3', // 新建转换表的首调
    newAudioTableEditingIndex: null, // 新建表编辑的行索引
    newAudioTableEditingField: null, // 新建表编辑的字段
    newAudioTableUseNativeInput: false, // 新建表是否使用原生输入
    editingAudioMappingTableId: null, // 正在编辑的转换表ID（null表示新建）
    
    // ========== Canvas渲染模式相关 ==========
    canvasEditing: null, // Canvas模式下的编辑状态 { notationId, measureIndex, beatIndex, subIndex, hand, index, inputX, inputY, inputWidth, inputHeight, focus }
    canvasEditingValue: '', // Canvas模式下正在编辑的值
    canvasUseNativeInput: false, // 主乐谱「切换键盘」后是否使用设备原生键盘输入（保持选中、收起虚拟键盘时 true）
    
    // ========== 【性能优化】全局高亮覆盖层 ==========
    // 使用 CSS transform 快速移动高亮框，避免 Canvas 重绘和 View 条件渲染
    slotHighlight: null, // 高亮框位置信息 { notationId, x, y, width, height, hand, visible }
    slotHighlightViewMode: null, // View 模式下的高亮层 { notationId, measureIndex, beatIndex, subIndex, hand, index, visible }
  },
  
  // ========== 【性能优化】音符解析缓存 ==========
  _noteDisplayCache: {},
  _noteParsedCache: {},
  _pendingCommitTimer: null, // 延迟提交定时器

  // Canvas渲染器实例映射 { notationId: CanvasNotationRenderer }
  _canvasRenderers: {},

  // Quick Win: 浅拷贝notations数组（避免全量深拷贝）
  shallowCloneNotations(notations) {
    return notations.map(n => ({ ...n }));
  },

  // Quick Win: 深拷贝单个notation（仅在必要时使用）
  deepCloneNotation(notation) {
    // 小程序基础库2.25.0+支持structuredClone，降级使用JSON方式
    if (typeof structuredClone === 'function') {
      return structuredClone(notation);
    }
    return JSON.parse(JSON.stringify(notation));
  },

  /**
   * 统一获取当前编辑状态信息
   * 同时支持 View 模式 (editing) 和 Canvas 模式 (canvasEditing)
   * @returns {Object|null} 统一格式的编辑信息，包含:
   *   - sheet: 谱面ID
   *   - measure: 小节索引
   *   - beat: 拍索引
   *   - subdivision: 细分索引
   *   - hand: 手部 ('right' | 'left')
   *   - index: 槽位索引 (0 | 1)
   *   - isCanvas: 是否为 Canvas 模式
   *   - notationIndex: 谱面在数组中的索引
   */
  getCurrentEditingInfo() {
    const { editing, canvasEditing, notations } = this.data;
    
    if (canvasEditing) {
      // Canvas 模式
      return {
        sheet: canvasEditing.notationId,
        measure: canvasEditing.measureIndex,
        beat: canvasEditing.beatIndex,
        subdivision: canvasEditing.subIndex,
        hand: canvasEditing.hand,
        index: canvasEditing.index,
        isCanvas: true,
        notationIndex: canvasEditing.notationIndex
      };
    } else if (editing) {
      // View 模式
      const notationIndex = notations.findIndex(n => n.id === editing.sheet);
      return {
        sheet: editing.sheet,
        measure: editing.measure,
        beat: editing.beat,
        subdivision: editing.subdivision,
        hand: editing.hand,
        index: editing.index,
        isCanvas: false,
        notationIndex: notationIndex
      };
    }
    
    return null;
  },

  /**
   * 根据当前编辑位置同步虚拟键盘「附点」「琶音」按钮状态
   * 附点：当前音符格是否以 * 结尾；琶音：当前音符列（subdivision）是否有 ~
   */
  syncVkDotAndArpeggioState() {
    const editInfo = this.getCurrentEditingInfo();
    const { notations } = this.data;
    
    if (!editInfo || !notations) {
      this.setData({ addDotActive: false, addArpeggioActive: false });
      return;
    }
    
    const currentValue = this.data.canvasEditing
      ? (this.data.canvasEditingValue || '')
      : (this.data.editingValue || '');
    const notation = notations.find(n => n.id === editInfo.sheet);
    const subdivision = notation?.measures[editInfo.measure]?.beats?.[editInfo.beat]?.subdivisions?.[editInfo.subdivision];
    
    const addDotActive = (currentValue || '').endsWith('*');
    const addArpeggioActive = !!subdivision?.hasArpeggio;
    
    this.setData({ addDotActive, addArpeggioActive });
  },

  /**
   * 【性能优化】获取缓存的音符显示文本
   * @param {string} note - 音符字符串
   * @returns {string} 渲染后的显示文本
   */
  getCachedNoteDisplay(note) {
    if (!note) return '';
    if (!this._noteDisplayCache) this._noteDisplayCache = {};
    if (!this._noteDisplayCache[note]) {
      this._noteDisplayCache[note] = this.renderNoteForDisplay(note);
    }
    return this._noteDisplayCache[note];
  },
  
  /**
   * 【性能优化】获取缓存的音符解析结果
   * @param {string} note - 音符字符串
   * @returns {Object} 解析结果
   */
  getCachedNoteParsed(note) {
    if (!note) return this.parseNoteForVK('');
    if (!this._noteParsedCache) this._noteParsedCache = {};
    if (!this._noteParsedCache[note]) {
      this._noteParsedCache[note] = this.parseNoteForVK(note);
    }
    return this._noteParsedCache[note];
  },
  
  /**
   * 【性能优化】清除音符缓存（当转换表变更时调用）
   */
  clearNoteCache() {
    this._noteDisplayCache = {};
    this._noteParsedCache = {};
  },
  
  /**
   * 【性能优化】计算 Canvas 模式下高亮框的位置
   * @param {string} notationId - 谱面ID
   * @param {Object} info - 槽位信息
   * @returns {Object|null} 高亮框位置 { x, y, width, height }
   */
  calculateCanvasHighlightPosition(notationId, info) {
    const renderer = this._canvasRenderers?.[notationId];
    if (!renderer || !renderer.hitAreas) return null;
    
    const hitArea = renderer.hitAreas.find(area => 
      area.measureIndex === info.measure &&
      area.beatIndex === info.beat &&
      area.subIndex === info.subdivision &&
      area.hand === info.hand &&
      area.index === info.index
    );
    
    return hitArea ? { x: hitArea.x, y: hitArea.y, width: hitArea.width, height: hitArea.height } : null;
  },

  /**
   * 统一导航到指定槽位（同时支持 View 和 Canvas 模式）
   * 【性能优化】使用 CSS 高亮层替代 Canvas 重绘，使用缓存减少计算
   * @param {Object} info 包含 sheet, measure, beat, subdivision, hand, index, isCanvas
   */
  navigateToSlotUnified(info) {
    const { notations } = this.data;
    const notation = notations.find(n => n.id === info.sheet);
    if (!notation) return;
    
    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    const slotArray = notation.measures[info.measure]?.beats[info.beat]?.subdivisions[info.subdivision]?.[info.hand === 'right' ? 'rightHand' : 'leftHand'];
    const currentValue = Array.isArray(slotArray) ? (slotArray[info.index] || '') : '';
    
    // 【优化】使用缓存获取解析结果
    const cachedDisplay = this.getCachedNoteDisplay(currentValue);
    const cachedParsed = this.getCachedNoteParsed(currentValue);
    
    if (info.isCanvas) {
      // ========== Canvas 模式优化 ==========
      // 【优化】直接计算高亮框位置，通过 CSS overlay 显示，不重绘 Canvas
      const highlightPos = this.calculateCanvasHighlightPosition(info.sheet, info);
      const notationIndex = notations.findIndex(n => n.id === info.sheet);
      
      // 【修复】同步保存前一个位置，避免异步竞态条件
      const prevCanvasEditing = this._prevCanvasEditing;
      // 【修复】立即更新 _prevCanvasEditing，确保下次调用时能获取正确的前一个位置
      this._prevCanvasEditing = { 
        notationId: info.sheet, 
        measureIndex: info.measure, 
        beatIndex: info.beat, 
        subIndex: info.subdivision, 
        hand: info.hand, 
        index: info.index 
      };
      
      // 构建更新数据，一次性 setData
      const updateData = {
        canvasEditing: {
          notationId: info.sheet,
          notationIndex: notationIndex,
          measureIndex: info.measure,
          beatIndex: info.beat,
          subIndex: info.subdivision,
          hand: info.hand,
          index: info.index,
          // 【优化】直接存储高亮位置，用于 CSS overlay
          inputX: highlightPos ? highlightPos.x : 0,
          inputY: highlightPos ? highlightPos.y : 0,
          inputWidth: highlightPos ? highlightPos.width : 0,
          inputHeight: highlightPos ? highlightPos.height : 0,
          focus: true
        },
        canvasEditingValue: currentValue,
        virtualKeyboardDisplay: currentValue,
        virtualKeyboardRendered: cachedDisplay,
        vkParsed: cachedParsed,
        superscriptMode: null,
        superscriptContent: '',
        // 【优化】全局高亮层数据（用于 CSS transform 动画）
        slotHighlight: highlightPos ? {
          notationId: info.sheet,
          x: highlightPos.x,
          y: highlightPos.y,
          width: highlightPos.width,
          height: highlightPos.height,
          hand: info.hand,
          visible: true
        } : null
      };
      
      this.setData(updateData, () => {
        this.updatePitchLevelFromNote();
        this.syncVkDotAndArpeggioState();
      });
      
      // 【优化】Canvas 重绘移到 nextTick，不阻塞视觉反馈
      // 注意：这里保留 Canvas 重绘以确保数据正确性，但不阻塞主要流程
      wx.nextTick(() => {
        const renderer = this._canvasRenderers?.[info.sheet];
        if (renderer) {
          // 先清除旧的高亮（如果存在且不同位置）
          // 【修复】使用同步保存的 prevCanvasEditing，而非 this._prevCanvasEditing
          if (prevCanvasEditing && prevCanvasEditing.notationId === info.sheet) {
            const isSameSlot = prevCanvasEditing.measureIndex === info.measure &&
                              prevCanvasEditing.beatIndex === info.beat &&
                              prevCanvasEditing.subIndex === info.subdivision &&
                              prevCanvasEditing.hand === info.hand &&
                              prevCanvasEditing.index === info.index;
            if (!isSameSlot) {
              const oldNotation = notations.find(n => n.id === prevCanvasEditing.notationId);
              if (oldNotation) {
                const oldSlot = oldNotation.measures[prevCanvasEditing.measureIndex]?.beats[prevCanvasEditing.beatIndex]?.subdivisions[prevCanvasEditing.subIndex]?.[prevCanvasEditing.hand === 'right' ? 'rightHand' : 'leftHand'];
                const oldValue = Array.isArray(oldSlot) ? (oldSlot[prevCanvasEditing.index] || '') : '';
                renderer.redrawSlot(prevCanvasEditing.measureIndex, prevCanvasEditing.beatIndex, prevCanvasEditing.subIndex, prevCanvasEditing.hand, prevCanvasEditing.index, oldValue, false);
              }
            }
          }
          // 绘制新的高亮
          renderer.redrawSlot(info.measure, info.beat, info.subdivision, info.hand, info.index, currentValue, true);
        }
      });
    } else {
      // ========== View 模式优化 ==========
      // 【优化】使用缓存和批量 setData
      this.setData({
        editing: { 
          sheet: info.sheet, 
          measure: info.measure, 
          beat: info.beat, 
          subdivision: info.subdivision, 
          hand: info.hand, 
          index: info.index 
        },
        editingValue: currentValue,
        virtualKeyboardDisplay: currentValue,
        virtualKeyboardRendered: cachedDisplay,
        vkParsed: cachedParsed,
        superscriptMode: null,
        superscriptContent: '',
        // 【优化】View 模式高亮层数据
        slotHighlightViewMode: {
          notationId: info.sheet,
          measureIndex: info.measure,
          beatIndex: info.beat,
          subIndex: info.subdivision,
          hand: info.hand,
          index: info.index,
          visible: true
        }
      });
      
      this.syncVkDotAndArpeggioState();
      this.prevEditing = this.data.editing;
      this.prevEditingValue = currentValue;
    }
  },

  onLoad() {
    // ========== 第零阶段：检查并确保分包已加载 ==========
    // 如果 splash 页面因某些原因未能成功加载分包，这里提前补救
    this.ensureSubpackagesLoaded();
    
    // ========== 第一阶段：最小化首屏渲染阻塞 ==========
    // 初始化临时编辑状态
    this.prevEditing = null;
    this.prevEditingValue = '';
    this._saveThrottleTimer = null;
    this._pendingSaveNotations = null;
    this._fadeoutTimer = null;
    this._savedReadingMode = false;
    
    // 初始化Canvas渲染器映射（必须在任何Canvas操作之前）
    this._canvasRenderers = {};
    this._columnRectsCache = {};
    
    // 标记页面加载状态（用于淡入动画）
    this._pageReady = false;
    
    // ========== 第二阶段：首屏关键数据加载（同步执行） ==========
    // 这些是用户第一眼看到的内容，必须优先加载
    this.loadTitles();           // 标题和颜色
    this.loadNotationType();     // 谱式类型（影响渲染）
    this.loadGlobalStyle();      // 全局排版样式（影响渲染）
    this.loadNotations();        // 谱面数据（核心内容）
    this.initOrientationListener(); // 屏幕方向（影响布局）
    this.calculatePages();       // 分页计算（影响显示）
    
    // ========== 第三阶段：延迟加载非关键数据（异步执行） ==========
    // 这些不影响用户第一眼看到的内容，延迟 200ms 执行避开渲染高峰
    setTimeout(() => {
      this.loadGlobalTempo();        // 速度设置
      this.loadMetronomeSettings();  // 节拍器设置
      this.loadImportHelpSettings(); // 帮助设置
      this.loadLibraryFileInfo();    // 库文件关联
      this.setupPlaybackListeners(); // 播放监听
      this.preloadLogoImage();       // Logo 图片
      this.loadKeyboardSettings();   // 键盘设置（插入方向、帮助按钮、自定义键）
      
      // 清除 splash 预处理标记
      wx.removeStorageSync('splash_premigrated');
      wx.removeStorageSync('splash_preload_timestamp');
      wx.removeStorageSync('splash_precalc_data');
      wx.removeStorageSync('splash_images_preloaded');
    }, 200);
    
    // ========== 第四阶段：低优先级任务 ==========
    // 延迟 500ms，等页面完全稳定后再执行
    setTimeout(() => {
      this.checkAndShowSplashModal();
      // 标记页面准备就绪，触发淡入动画
      this._pageReady = true;
      this.setData({ pageReady: true });
    }, 500);
  },
  
  // ========== 分包加载检查机制 ==========
  // 确保 audio 和 resources 分包已加载，如果 splash 页面未能成功加载则在此补救
  ensureSubpackagesLoaded() {
    console.log('[Notation] 检查分包加载状态...');
    
    const audioLoaded = wx.getStorageSync('subpackage_audio_loaded');
    const resourcesLoaded = wx.getStorageSync('subpackage_resources_loaded');
    
    // 检查是否需要重新加载分包
    const needsAudioReload = audioLoaded === false || audioLoaded === undefined;
    const needsResourcesReload = resourcesLoaded === false || resourcesLoaded === undefined;
    
    if (needsAudioReload || needsResourcesReload) {
      console.log('[Notation] 检测到分包未完全加载，开始补救加载...');
      console.log(`[Notation] audio: ${audioLoaded ? '已加载' : '需加载'}, resources: ${resourcesLoaded ? '已加载' : '需加载'}`);
    }
    
    // 正确的 API 名称是 wx.loadSubPackage（注意大写 P）
    const loadSubPackageAPI = wx.loadSubPackage || wx.loadSubpackage;
    
    // 并发加载需要的分包
    if (loadSubPackageAPI) {
      if (needsAudioReload) {
        loadSubPackageAPI({
          name: 'audio',
          success: () => {
            console.log('[Notation] audio 分包补救加载成功');
            wx.setStorageSync('subpackage_audio_loaded', true);
          },
          fail: (err) => {
            console.error('[Notation] audio 分包补救加载失败:', err);
            // 不阻塞页面加载，播放时会再次尝试
          }
        });
      }
      
      if (needsResourcesReload) {
        loadSubPackageAPI({
          name: 'resources',
          success: () => {
            console.log('[Notation] resources 分包补救加载成功');
            wx.setStorageSync('subpackage_resources_loaded', true);
          },
          fail: (err) => {
            console.error('[Notation] resources 分包补救加载失败:', err);
          }
        });
      }
    } else {
      console.warn('[Notation] wx.loadSubPackage 不可用（可能是开发工具限制）');
    }
  },

  onShow() {
    // 回到该页时刷新标题/颜色/透明度设置，确保设置页调整即时生效
    this.loadTitles();

    // 【优化】阅读模式下返回页面时保持TabBar隐藏
    if (this.data.readingMode) {
      wx.hideTabBar({ animation: false });
    }

    // 若有待加载的曲库数据则应用
    const pending = wx.getStorageSync('pending_notation_load');
    const showSaveFirst = wx.getStorageSync('pending_notation_show_save_first');
    if (pending && pending.code && showSaveFirst) {
      // 曲库「保存后打开」且当前为未保存：先弹出保存到曲库，用户保存后再加载新曲谱
      wx.removeStorageSync('pending_notation_show_save_first');
      this.setData({
        showSaveToLibraryModal: true,
        saveFileName: this.data.mainTitle || '未命名',
        saveTargetPath: [],
        saveFolderOptions: [],
        _pendingLoadAfterSave: true
      });
      this.refreshSaveFolderView([]);
      wx.hideLoading();
      this.updateStorageDisplay(false);
    } else if (pending && pending.code) {
      // 先显示加载遮罩，等导入完成后再关闭
      this.showPageLoadingOverlay();
      wx.removeStorageSync('pending_notation_load');
      this.applyLibraryPayload(pending);
    } else {
      wx.hideLoading();
      this.updateStorageDisplay(false); // 更新存储显示
    }
    
    // 【修复】从分包加载页面返回后，恢复音频映射弹窗或进入播放模式
    if (this.data._pendingSubpackageReturn) {
      console.log('[Notation] 从分包加载页面返回');
      
      const pendingMappings = this.data._pendingAudioMappings;
      const pendingRootNote = this.data._pendingRootNote;
      const wasAudioMappingModalOpen = this.data._pendingModalWasOpen;
      
      // 重置标记
      this.setData({ 
        _pendingSubpackageReturn: false,
        _pendingAudioMappings: null,
        _pendingRootNote: null,
        _pendingModalWasOpen: false
      });
      
      // 【Bug修复】确保从分包加载返回时关闭加载提示，添加超时保护
      if (this.data.showPlaybackLoading) {
        // 立即关闭加载提示（分包加载已完成）
        this.setData({ showPlaybackLoading: false });
      }
      // 清除任何遗留的加载超时计时器
      if (this._loadingTimeoutTimer) {
        clearTimeout(this._loadingTimeoutTimer);
        this._loadingTimeoutTimer = null;
      }
      
      // 延迟处理，确保页面完全显示
      setTimeout(async () => {
        // 刷新Canvas内容（防止丢失）
        this.refreshAllVisibleCanvas();
        
        // 如果之前音频映射弹窗是打开的，恢复弹窗
        if (wasAudioMappingModalOpen && pendingMappings) {
          this.setData({
            showAudioMappingModal: true,
            audioMappings: pendingMappings
          });
          
          // 重新检查并更新音频可用状态
          this.updateAudioMappingsAvailability();
        } else if (pendingMappings) {
          // 如果有待处理的映射但弹窗没开，说明是从直接播放流程来的
          // 应用映射并进入播放模式
          try {
            const playbackMgr = await getSheetPlaybackManager();
            if (pendingRootNote) {
              playbackMgr.setConversionRootNote(pendingRootNote);
            }
            playbackMgr.setCustomAudioMappings(pendingMappings);
            this.enterPlaybackMode();
          } catch (e) {
            console.error('[Notation] 进入播放模式失败:', e);
            this.openAudioMappingModal();
          }
        } else {
          // 没有待处理数据，打开音频映射弹窗
          this.openAudioMappingModal();
        }
      }, 300);
    } else {
      // 【修复】普通返回页面时，也刷新Canvas防止内容丢失
      // 使用较短延迟，避免每次返回都看到空白
      setTimeout(() => {
        this.refreshAllVisibleCanvas();
      }, 100);
    }
  },
  
  /**
   * 刷新所有可见的Canvas渲染器
   * 用于从其他页面返回时恢复Canvas内容
   */
  refreshAllVisibleCanvas() {
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { notations, currentPageModules } = this.data;
    if (!notations || notations.length === 0) return;
    
    // 获取当前可见的modules
    const visibleModules = currentPageModules || notations.map((n, i) => ({ id: n.id, index: i }));
    
    console.log('[Canvas] 刷新可见Canvas，模块数量:', visibleModules.length);
    
    visibleModules.forEach(({ id, index }) => {
      const notation = notations[index];
      if (!notation) return;
      
      // 只处理非折叠状态的module（展开状态的module有Canvas）
      if (!notation.collapsed) {
        const renderer = this._canvasRenderers[id];
        if (renderer) {
          // 渲染器存在，重新绘制
          try {
            renderer.render();
            console.log('[Canvas] 重新绘制Canvas:', id);
          } catch (e) {
            console.warn('[Canvas] 重新绘制失败，重新初始化:', id, e);
            this.initCanvasRendererForModuleWithRetry(id, index, 3);
          }
        } else {
          // 渲染器不存在，初始化
          this.initCanvasRendererForModuleWithRetry(id, index, 3);
        }
      } else if (notation.collapsed && !notation.tempImagePath) {
        // 折叠状态但没有缓存图片，重新生成
        this.initCanvasRendererForModuleWithRetry(id, index, 3);
      }
    });
  },
  
  /**
   * 更新音频映射的可用状态
   * 在分包加载完成后调用
   */
  async updateAudioMappingsAvailability() {
    const mappings = this.data.audioMappings;
    if (!mappings || mappings.length === 0) return;
    
    try {
      const playbackMgr = await getSheetPlaybackManager();
      
      // 更新每个映射的音频可用状态（含等音名：如 C#4 视为 Db4 可用）
      const updatedMappings = mappings.map(m => {
        const hasAudio = m.spn ? playbackMgr.checkSpnAudioAvailable(m.spn).available : false;
        return { ...m, hasAudio };
      });
      
      this.setData({ audioMappings: updatedMappings });
      console.log('[Notation] 音频映射可用状态已更新');
    } catch (e) {
      console.error('[Notation] 更新音频映射可用状态失败:', e);
    }
  },

  // 【优化】底部导航栏切换时自动关闭选中模式
  onTabItemTap(item) {
    // 如果处于选中模式，自动退出选中模式
    if (this.data.isSelectingBeats) {
      this.exitSelectionMode();
    }
  },

  // 应用曲库传入的数据并覆盖当前谱面
  applyLibraryPayload(payload) {
    if (!payload || !payload.code) return;

    // 如果正在播放模式，先退出并重置播放器
    if (this.data.isPlaybackMode) {
      this.exitPlaybackMode();
    }
    
    // 【优化】切换文件时清除播放模式 Canvas 缓存
    // 使用文件ID作为标识，切换文件时自动清除旧缓存
    const newFileId = payload.id || payload.file_name || Date.now().toString();
    PlaybackCanvasCacheManager.setCurrentFile(newFileId);
    
    // 重置播放器缓存的音频，确保切换文件后不会残留前一个文件的播放状态
    if (sheetPlaybackManager) {
      sheetPlaybackManager.stopPlayback();
      // 清除时间线缓存
      sheetPlaybackManager.timeline = [];
      sheetPlaybackManager.currentEventIndex = 0;
      // 清除自定义音频映射，强制下次播放时重新分析
      sheetPlaybackManager.customAudioMappings = null;
      sheetPlaybackManager.notationType = payload.notationType || 'digital';
    }
    
    // 清除播放光标相关状态
    this.clearPlaybackCursors();
    
    // 销毁所有旧的 Canvas 渲染器，避免残留旧数据
    if (this._canvasRenderers) {
      Object.keys(this._canvasRenderers).forEach(id => {
        this.destroyCanvasRenderer(id);
      });
    }
    this._canvasRenderers = {};
    this._columnRectsCache = {};
    
    // 清除所有编辑状态，避免旧的 notation ID 导致"未找到谱面"错误
    this.setData({
      editing: null,
      editingValue: '',
      canvasEditing: null,
      canvasEditingValue: '',
      canvasUseNativeInput: false,
      showVirtualKeyboard: false,
      // 重置音频映射弹窗状态
      audioMappingsLoaded: false,
      audioMappings: [],
      currentAudioMappingTableId: null,
      // 清除谱式转换相关状态
      conversionMappings: [],
      customConversionTableObj: null,
      showNotationTypeModal: false,
      showConversionMappingModal: false
    });

    // 无论当前什么模式，打开新文件时先切换回竖屏模式，避免横屏布局错误
    // 文件的orientation设置会在导入后生效
    const orientation = 'portrait';
    const timingText = payload.timing || `${payload.timeSignatureBeats || 4}/${payload.timeSignatureBottom || 4}`;
    const [beatsStr, bottomStr] = (timingText || '4/4').split('/');
    const beats = parseInt(beatsStr, 10) || 4;
    const bottom = parseInt(bottomStr, 10) || 4;

    // 【Bug修复】加载保存的首调设置，如果没有则根据rootNote计算默认值
    let savedConversionRootNote = payload.conversionRootNote;
    if (!savedConversionRootNote) {
      // 没有保存的值，根据rootNote计算默认值
      const rootNote = payload.rootNote || 'D';
      let spnRoot = rootNote;
      if (rootNote === 'D') {
        spnRoot = 'F';
      }
      savedConversionRootNote = spnRoot + '3';
    }
    
    this.setData({
      mainTitle: payload.title || payload.file_name || '未命名',
      subTitle: payload.author || payload.subtitle || 'Author: Unknown', // 向后兼容：优先读取author，fallback到subtitle
      globalTempo: payload.tempo || 60,
      orientation: 'portrait', // 【Bug修复】加载曲库文件时重置为"宽松"模式（竖屏）
      timeSignatureBeats: beats,
      timeSignatureBottom: bottom,
      timeSignatureDisplay: timingText,
      currentTimeSignatureType: 'standard',
      notationType: payload.notationType || 'digital', // 恢复谱式类型
      // 【Bug修复】加载曲库文件时重置为"编辑"模式
      readingMode: false,
      manualOrientation: false, // 重置手动排版标记
      // 保存文件来源信息
      libraryFileId: payload.id || null,
      libraryFilePath: payload.path || null,
      libraryFileName: payload.file_name || null,
      // 新增：加载曲谱元信息
      composer: payload.composer || 'Your Name',
      rootNote: payload.rootNote || 'D',
      scaleType: payload.scaleType || 'Kurd',
      noteCount: payload.noteCount || 10,
      difficulty: payload.difficulty || 1,
      introduction: payload.introduction || '',
      // 【Bug修复】加载保存的首调设置
      conversionRootNote: savedConversionRootNote,
      // 加载保存的音频映射（如果有）
      savedAudioMappings: payload.savedAudioMappings || null,
      saveAudioMappingToScore: !!payload.savedAudioMappings, // 如果有保存的映射，默认勾选
      // 加载全局排版样式
      globalStylePortrait: payload.globalStyle || { measureHeight: 160, noteFontSize: 28, lineSpacing: 65 }
    }, () => {
      this.saveTitles();
      this.saveGlobalTempo();
      this.saveGlobalStyle();
      wx.setStorageSync('notationType', payload.notationType || 'digital'); // 保存谱式类型到存储
      this.saveLibraryFileInfo(); // 保存库文件关联信息
      this.saveNotationsScoped([]);
      this.setNotations([]);
      const result = this.performImport(payload.code, 'add', null);
      if (result && result.success) {
        wx.showToast({ title: '已从曲库载入', icon: 'success' });
      } else if (result && !result.success) {
        wx.showToast({ title: `载入失败: ${result.message}`, icon: 'none' });
      }
      this.calculatePages();
      this.updateStorageDisplay(false); // 更新存储显示
      wx.hideLoading();
      this.hidePageLoadingOverlay();
    });
  },

  // 加载导入帮助显示设置
  loadImportHelpSettings() {
    const dismissed = wx.getStorageSync('importHelpDismissed');
    this.setData({
      importHelpDismissed: dismissed === true
    });
  },

  onHide() {
    // 页面隐藏时关闭节拍器
    this.closeFloatingMetronome();
    // 强制关闭翻页加载遮罩与其节拍器，避免后台残留
    this.hidePageLoadingOverlay();
    // Quick Win: 及时释放音频资源，减少后台内存占用
    this.destroyMetronomeAudio();
    // 页面隐藏时停止播放
    if (this.data.isPlaybackMode) {
      this.exitPlaybackMode();
    }
    // 【优化】页面隐藏时自动退出选中模式（通过底部导航栏切换页面时）
    if (this.data.isSelectingBeats) {
      this.exitSelectionMode();
    }
    // 【优化】阅读模式下隐藏页面时恢复TabBar
    if (this.data.readingMode) {
      wx.showTabBar({ animation: false });
    }
  },

  onUnload() {
    // 页面卸载时关闭节拍器
    this.closeFloatingMetronome();
    this.destroyMetronomeAudio();
    // 页面卸载时也确保关闭翻页加载遮罩与其节拍器
    this.hidePageLoadingOverlay();
    // 页面卸载时停止播放并释放资源
    if (this.data.isPlaybackMode) {
      this.exitPlaybackMode();
    }
    // 【优化】阅读模式下卸载页面时恢复TabBar
    if (this.data.readingMode) {
      wx.showTabBar({ animation: false });
    }
    // 仅当已加载时才销毁
    if (sheetPlaybackManager) {
      sheetPlaybackManager.destroy();
    }
    // 销毁所有Canvas渲染器
    if (this._canvasRenderers) {
      Object.keys(this._canvasRenderers).forEach(id => {
        this.destroyCanvasRenderer(id);
      });
    }
    
    // 【Bug修复】清理加载超时计时器
    if (this._loadingTimeoutTimer) {
      clearTimeout(this._loadingTimeoutTimer);
      this._loadingTimeoutTimer = null;
    }
    
    // 【优化】页面卸载时刷新所有待保存数据
    if (this._saveThrottleTimer) {
      clearTimeout(this._saveThrottleTimer);
      this._saveThrottleTimer = null;
      // 立即保存当前数据
      this.saveNotationsScoped(this.data.notations);
    }
    
    // 【优化】刷新优化存储的待保存数据
    optimizedStorage.flushAll().catch(err => {
      console.warn('[onUnload] 刷新优化存储失败:', err);
    });
    
    // 【优化】终止 Worker
    workerManager.terminate();
  },

  // 加载标题与副标题
  loadTitles() {
    // 检查是否有预加载数据
    const preloaded = app.globalData;
    if (preloaded && preloaded.notationPreloaded && preloaded.preloadedTitles) {
      const titles = preloaded.preloadedTitles;
      const colors = preloaded.preloadedColors || {};
      const settings = preloaded.preloadedSettings || {};
      
      // 从颜色设置中读取
      const mainTitleColor = colors.mainTitleColor || '#314D63';
      const subTitleColor = colors.subTitleColor || '#8FB9AB';
      const rightHandColor = colors.rightHandColor || '#F4D096';
      const leftHandColor = colors.leftHandColor || '#314D63';
      
      // 背景透明度
      const opacity = settings.backgroundOpacity || 0.10;
      
      this.setData({ 
        mainTitle: titles.mainTitle || 'Note Title', 
        subTitle: titles.subTitle || 'Author: Unknown', 
        mainTitleColor,
        subTitleColor,
        rightHandColor, 
        leftHandColor,
        backgroundOpacity: opacity,
        composer: titles.composer || 'Your Name',
        rootNote: titles.rootNote || 'D',
        scaleType: titles.scaleType || 'Kurd',
        noteCount: titles.noteCount || 10,
        difficulty: titles.difficulty || 1,
        introduction: titles.introduction || ''
      });
      console.log('Using preloaded titles data');
      return;
    }
    
    // 从存储中读取（原有逻辑）
    const mainTitle = wx.getStorageSync('mainTitle') || 'Note Title';
    const subTitle = wx.getStorageSync('subTitle') || 'Author: Unknown';
    
    // 从颜色设置中读取
    const colorSettings = wx.getStorageSync('colorSettings') || {};
    const mainTitleColor = colorSettings.mainTitleColor || '#314D63';
    const subTitleColor = colorSettings.subTitleColor || '#8FB9AB';
    const rightHandColor = colorSettings.rightHandColor || '#F4D096';
    const leftHandColor = colorSettings.leftHandColor || '#314D63';
    
    // 从存储中读取背景透明度（设定最小值为10%）
    const backgroundOpacity = wx.getStorageSync('backgroundOpacity');
    const storedOpacity = typeof backgroundOpacity === 'number' ? backgroundOpacity : parseFloat(backgroundOpacity);
    const opacity = Number.isFinite(storedOpacity) ? Math.max(0.10, storedOpacity / 100) : 0.10;
    
    // 读取新增的曲谱元信息
    const metaInfo = wx.getStorageSync('notationMetaInfo') || {};
    const composer = metaInfo.composer || 'Your Name';
    const rootNote = metaInfo.rootNote || 'D';
    const scaleType = metaInfo.scaleType || 'Kurd';
    const noteCount = metaInfo.noteCount || 10;
    const difficulty = metaInfo.difficulty || 1;
    const introduction = metaInfo.introduction || '';
    
    this.setData({ 
      mainTitle, 
      subTitle, 
      mainTitleColor,
      subTitleColor,
      rightHandColor, 
      leftHandColor,
      backgroundOpacity: opacity,
      composer,
      rootNote,
      scaleType,
      noteCount,
      difficulty,
      introduction
    });
  },

  // 保存标题与副标题
  saveTitles() {
    wx.setStorageSync('mainTitle', this.data.mainTitle);
    wx.setStorageSync('subTitle', this.data.subTitle);
    // 保存曲谱元信息
    const metaInfo = {
      composer: this.data.composer,
      rootNote: this.data.rootNote,
      scaleType: this.data.scaleType,
      noteCount: this.data.noteCount,
      difficulty: this.data.difficulty,
      introduction: this.data.introduction
    };
    wx.setStorageSync('notationMetaInfo', metaInfo);
  },

  // 加载全局速度
  loadGlobalTempo() {
    // 检查是否有预加载数据
    const preloaded = app.globalData;
    if (preloaded && preloaded.preloadedTempo) {
      this.setData({ globalTempo: preloaded.preloadedTempo.globalTempo || 60 });
      console.log('Using preloaded tempo data');
      return;
    }
    
    const globalTempo = wx.getStorageSync('globalTempo') || 60;
    this.setData({ globalTempo });
  },

  // 保存全局速度
  saveGlobalTempo() {
    wx.setStorageSync('globalTempo', this.data.globalTempo);
  },

  // 加载库文件关联信息（使刷新后不丢失存储位置）
  loadLibraryFileInfo() {
    // 检查是否有预加载数据
    const preloaded = app.globalData;
    if (preloaded && preloaded.preloadedLibraryInfo) {
      const libraryInfo = preloaded.preloadedLibraryInfo;
      this.setData({
        libraryFileId: libraryInfo.id || null,
        libraryFilePath: libraryInfo.path || null,
        libraryFileName: libraryInfo.fileName || null
      });
      this.updateStorageDisplay(false);
      console.log('Using preloaded library info');
      // 加载保存的音频映射
      this.loadSavedAudioMappings();
      return;
    }
    
    const libraryInfo = wx.getStorageSync('libraryFileInfo');
    if (libraryInfo) {
      this.setData({
        libraryFileId: libraryInfo.id || null,
        libraryFilePath: libraryInfo.path || null,
        libraryFileName: libraryInfo.fileName || null
      });
      this.updateStorageDisplay(false);
      // 加载保存的音频映射
      this.loadSavedAudioMappings();
    }
  },

  // 保存库文件关联信息
  saveLibraryFileInfo() {
    const { libraryFileId, libraryFilePath, libraryFileName } = this.data;
    if (libraryFileId) {
      wx.setStorageSync('libraryFileInfo', {
        id: libraryFileId,
        path: libraryFilePath,
        fileName: libraryFileName
      });
    } else {
      // 如果没有关联库文件，清除存储
      wx.removeStorageSync('libraryFileInfo');
    }
  },

  // 清除库文件关联信息（重置时使用）
  clearLibraryFileInfo() {
    this.setData({
      libraryFileId: null,
      libraryFilePath: null,
      libraryFileName: null
    });
    wx.removeStorageSync('libraryFileInfo');
    this.updateStorageDisplay(false);
  },

  // 加载谱面数据
  loadNotations() {
    // 检查是否有预加载数据
    const preloaded = app.globalData;
    if (preloaded && preloaded.notationPreloaded && preloaded.preloadedNotations) {
      const notationsData = preloaded.preloadedNotations;
      const beats = notationsData.timeSignatureBeats || 4;
      const customTimeSignature = notationsData.customTimeSignature;
      
      if (customTimeSignature && customTimeSignature.type === 'custom') {
        this.setData({ 
          timeSignatureBeats: customTimeSignature.noteCount,
          currentTimeSignatureType: 'custom'
        });
      } else {
        this.setData({ 
          timeSignatureBeats: beats,
          currentTimeSignatureType: 'standard'
        });
      }
      
      if (notationsData.data && Array.isArray(notationsData.data) && notationsData.data.length > 0) {
        const migrated = this.migrateNotations(notationsData.data);
        const withOffsets = this.updateMeasureOffsets(migrated);
        this.setNotations(withOffsets);
        console.log('Using preloaded notations data');
        
        // 清除预加载数据以释放内存
        if (app.clearPreloadedData) {
          app.clearPreloadedData();
        }
        return;
      }
    }
    
    // 原有逻辑: 先检查是否有自定义拍号
    const customTimeSignature = wx.getStorageSync('customTimeSignature');
    if (customTimeSignature && customTimeSignature.type === 'custom') {
      this.setData({ 
        timeSignatureBeats: customTimeSignature.noteCount,
        currentTimeSignatureType: 'custom'
      });
      const key = `notations_custom_${customTimeSignature.noteCount}`;
      let scoped = wx.getStorageSync(key);
      if (scoped && Array.isArray(scoped)) {
        const migrated = this.migrateNotations(scoped);
        const withOffsets = this.updateMeasureOffsets(migrated);
        this.saveNotationsScopedWithKey(withOffsets, key);
        this.setNotations(withOffsets);
        return;
      }
    }

    // 优先按拍号读取独立存储；若无则兼容读取全局并迁移
    const beats = wx.getStorageSync('timeSignatureBeats') || this.data.timeSignatureBeats || 4;
    this.setData({ 
      timeSignatureBeats: beats,
      currentTimeSignatureType: 'standard'
    });

    const key = this.getNotationStorageKey(beats);
    let scoped = wx.getStorageSync(key);
    if (scoped && Array.isArray(scoped)) {
      const migrated = this.migrateNotations(scoped);
      const withOffsets = this.updateMeasureOffsets(migrated);
      this.saveNotationsScoped(withOffsets); // 回写规范化
      this.setNotations(withOffsets);
      return;
    }

    // 兼容旧数据
    const legacy = app.globalData.notations || wx.getStorageSync('notations') || [];
    if (Array.isArray(legacy) && legacy.length > 0) {
      const migrated = this.migrateNotations(legacy);
      const withOffsets = this.updateMeasureOffsets(migrated);
      this.saveNotationsScoped(withOffsets);
      this.setNotations(withOffsets);
      return;
    }

    // 初始化当前拍号的默认谱面（保留空的 A-1 与 A-2 模块）
    // 先设置拍号，然后创建谱面，最后一次性更新状态
    this.setData({ timeSignatureBeats: beats });
    const initial = [ this.createNotation('A-1', false), this.createNotation('A-2', false) ];
    const withOffsets = this.updateMeasureOffsets(initial);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
  },

  // 【优化】异步加载谱面数据（非阻塞）
  async loadNotationsAsync() {
    // 检查是否有预加载数据（优先使用）
    const preloaded = app.globalData;
    if (preloaded && preloaded.notationPreloaded && preloaded.preloadedNotations) {
      const notationsData = preloaded.preloadedNotations;
      const beats = notationsData.timeSignatureBeats || 4;
      const customTimeSignature = notationsData.customTimeSignature;
      
      if (customTimeSignature && customTimeSignature.type === 'custom') {
        this.setData({ 
          timeSignatureBeats: customTimeSignature.noteCount,
          currentTimeSignatureType: 'custom'
        });
      } else {
        this.setData({ 
          timeSignatureBeats: beats,
          currentTimeSignatureType: 'standard'
        });
      }
      
      if (notationsData.data && Array.isArray(notationsData.data) && notationsData.data.length > 0) {
        // 使用 Worker 进行迁移处理（如果可用）
        let migrated;
        try {
          await workerManager.init();
          migrated = await workerManager.execute('migrateNotations', notationsData.data);
        } catch (e) {
          // Worker 不可用，使用同步迁移
          migrated = this.migrateNotations(notationsData.data);
        }
        
        const withOffsets = this.updateMeasureOffsets(migrated);
        this.setNotations(withOffsets);
        console.log('[loadNotationsAsync] 使用预加载数据');
        
        // 清除预加载数据以释放内存
        if (app.clearPreloadedData) {
          app.clearPreloadedData();
        }
        return;
      }
    }
    
    // 异步检查自定义拍号
    const customTimeSignature = await AsyncStorage.get('customTimeSignature');
    if (customTimeSignature && customTimeSignature.type === 'custom') {
      this.setData({ 
        timeSignatureBeats: customTimeSignature.noteCount,
        currentTimeSignatureType: 'custom'
      });
      const key = `notations_custom_${customTimeSignature.noteCount}`;
      
      // 尝试从优化存储加载
      let scoped = await optimizedStorage.loadNotations(key);
      if (!scoped || scoped.length === 0) {
        // 回退到传统存储
        scoped = await AsyncStorage.get(key);
      }
      
      if (scoped && Array.isArray(scoped) && scoped.length > 0) {
        let migrated;
        try {
          await workerManager.init();
          migrated = await workerManager.execute('migrateNotations', scoped);
        } catch (e) {
          migrated = this.migrateNotations(scoped);
        }
        const withOffsets = this.updateMeasureOffsets(migrated);
        await this.saveNotationsScopedWithKeyAsync(withOffsets, key);
        this.setNotations(withOffsets);
        return;
      }
    }

    // 异步读取拍号
    const storedBeats = await AsyncStorage.get('timeSignatureBeats');
    const beats = storedBeats || this.data.timeSignatureBeats || 4;
    this.setData({ 
      timeSignatureBeats: beats,
      currentTimeSignatureType: 'standard'
    });

    const key = this.getNotationStorageKey(beats);
    
    // 尝试从优化存储加载（支持分片）
    let scoped = await optimizedStorage.loadNotations(key);
    if (!scoped || scoped.length === 0) {
      // 回退到传统存储
      scoped = await AsyncStorage.get(key);
    }
    
    if (scoped && Array.isArray(scoped) && scoped.length > 0) {
      let migrated;
      try {
        await workerManager.init();
        migrated = await workerManager.execute('migrateNotations', scoped);
      } catch (e) {
        migrated = this.migrateNotations(scoped);
      }
      const withOffsets = this.updateMeasureOffsets(migrated);
      await this.saveNotationsScopedAsync(withOffsets); // 异步回写规范化
      this.setNotations(withOffsets);
      return;
    }

    // 兼容旧数据
    const legacyGlobal = app.globalData.notations;
    const legacyStorage = await AsyncStorage.get('notations');
    const legacy = legacyGlobal || legacyStorage || [];
    
    if (Array.isArray(legacy) && legacy.length > 0) {
      let migrated;
      try {
        await workerManager.init();
        migrated = await workerManager.execute('migrateNotations', legacy);
      } catch (e) {
        migrated = this.migrateNotations(legacy);
      }
      const withOffsets = this.updateMeasureOffsets(migrated);
      await this.saveNotationsScopedAsync(withOffsets);
      this.setNotations(withOffsets);
      return;
    }

    // 初始化当前拍号的默认谱面
    this.setData({ timeSignatureBeats: beats });
    const initial = [ this.createNotation('A-1', false), this.createNotation('A-2', false) ];
    const withOffsets = this.updateMeasureOffsets(initial);
    await this.saveNotationsScopedAsync(withOffsets);
    this.setNotations(withOffsets);
  },

  // 生成按拍号的存储键
  getNotationStorageKey(beats) {
    // 检查是否是自定义拍号
    const customTimeSignature = wx.getStorageSync('customTimeSignature');
    if (customTimeSignature && customTimeSignature.type === 'custom') {
      return this.getNotationStorageKeyForCustom();
    }
    const b = beats || this.data.timeSignatureBeats || 4;
    return `notations_${b}_4`;
  },

  // 保存到当前拍号的独立存储（同步版本 - 保留向后兼容）
  saveNotationsScoped(notations) {
    const key = this.getNotationStorageKey();
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    app.globalData.notations = withOffsets;
    
    // 使用优化存储（异步，带分片）
    optimizedStorage.saveNotations(key, withOffsets, { 
      debounce: 0, 
      immediate: true,
      useSharding: true 
    }).catch(err => {
      console.error('[saveNotationsScoped] 优化存储失败，回退到同步存储:', err);
      wx.setStorageSync(key, withOffsets);
    });
    
    // 同时保持同步写入以确保数据安全
    wx.setStorageSync(key, withOffsets);
  },

  // 【优化】异步保存到当前拍号的独立存储
  async saveNotationsScopedAsync(notations) {
    const key = this.getNotationStorageKey();
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    app.globalData.notations = withOffsets;
    
    try {
      // 使用优化存储（异步，带分片和增量更新）
      await optimizedStorage.saveNotations(key, withOffsets, { 
        debounce: 0, 
        immediate: true,
        useSharding: true 
      });
    } catch (err) {
      console.error('[saveNotationsScopedAsync] 优化存储失败:', err);
      // 回退到同步存储
      wx.setStorageSync(key, withOffsets);
    }
  },

  // Quick Win: 节流保存操作（500ms节流，避免频繁写入Storage）
  // 【优化】使用异步存储
  throttledSaveNotations() {
    // 清除之前的定时器
    if (this._saveThrottleTimer) {
      clearTimeout(this._saveThrottleTimer);
    }
    
    // 设置新的定时器
    this._saveThrottleTimer = setTimeout(async () => {
      const key = this.getNotationStorageKey();
      const normalized = this.normalizeBarLines(this.data.notations);
      const withOffsets = this.updateMeasureOffsets(normalized);
      app.globalData.notations = withOffsets;
      
      // 使用优化存储（异步，带防抖合并）
      await optimizedStorage.saveNotations(key, withOffsets, { 
        debounce: 0, 
        immediate: true,
        useSharding: true 
      });
      
      this.markNotationChanged(); // 标记为有更改
      this._saveThrottleTimer = null;
    }, 500);
  },

  // 直接指定key保存谱面数据
  saveNotationsScopedWithKey(notations, key) {
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    app.globalData.notations = withOffsets;
    
    // 使用优化存储
    optimizedStorage.saveNotations(key, withOffsets, { 
      debounce: 0, 
      immediate: true,
      useSharding: true 
    }).catch(err => {
      console.error('[saveNotationsScopedWithKey] 优化存储失败:', err);
      wx.setStorageSync(key, withOffsets);
    });
    
    // 同时保持同步写入
    wx.setStorageSync(key, withOffsets);
  },

  // 【优化】异步指定key保存谱面数据
  async saveNotationsScopedWithKeyAsync(notations, key) {
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    app.globalData.notations = withOffsets;
    
    try {
      await optimizedStorage.saveNotations(key, withOffsets, { 
        debounce: 0, 
        immediate: true,
        useSharding: true 
      });
    } catch (err) {
      console.error('[saveNotationsScopedWithKeyAsync] 优化存储失败:', err);
      wx.setStorageSync(key, withOffsets);
    }
  },

  // 迁移旧版谱面结构到新版（保留原 subdivision 数量，每个 subdivision 仅规范左右手数组长度）
  migrateNotations(notations) {
    const ensureArray2 = (val) => {
      if (Array.isArray(val)) {
        // 长度不足补空串
        if (val.length < 2) return [val[0] || '', ''];
        return [val[0] || '', val[1] || ''];
      }
      if (typeof val === 'string') {
        // 将字符串提升为双位数组，默认放在第一个位置
        return [val || '', ''];
      }
      // 其他情况（null/undefined/对象）均重置为空
      return ['', ''];
    };

    const result = (notations || []).map(notation => {
      const newNotation = { ...notation };
      newNotation.measures = (notation.measures || []).map(measure => {
        const beats = (measure.beats || []).map(beat => {
          // 旧结构可能是 {rightHand: 'x', leftHand: 'y'} 或已是 {subdivisions: [...]}
          let out;
          if (!beat.subdivisions) {
            // 将缺省的拍转换为单个 subdivision，保留原左右手值
            const rh = ensureArray2(beat.rightHand);
            const lh = ensureArray2(beat.leftHand);
            out = {
              subdivisions: [
                { rightHand: rh, leftHand: lh }
              ]
            };
          } else {
            // 已有 subdivisions，则逐个规范化，不补齐数量；保留 hasArpeggio 等扩展字段
            const subs = (beat.subdivisions || []).map(sub => {
              const normalized = {
                rightHand: ensureArray2(sub.rightHand),
                leftHand: ensureArray2(sub.leftHand)
              };
              if (sub.hasArpeggio === true) normalized.hasArpeggio = true;
              return normalized;
            });
            out = { subdivisions: subs };
          }
          // 【修复】保留占位拍标记，确保重新进入/刷新后尾行占位拍绘制正确
          if (beat.isPlaceholder === true) out.isPlaceholder = true;
          return out;
        });
        const measureOut = { beats };
        // 【修复】保留 lastRealBeatIndex（占位拍右侧小节线位置），确保重新进入/刷新后绘制正确
        if (measure.lastRealBeatIndex !== undefined) measureOut.lastRealBeatIndex = measure.lastRealBeatIndex;
        return measureOut;
      });
      // 不再强制截断/补足固定小节数，保留导入的实际行数
      // 确保有 collapsed 属性（旧数据可能没有）
      if (newNotation.collapsed === undefined) {
        newNotation.collapsed = false;
      }
      // 确保有 style 属性（旧数据可能没有），使用全局样式默认值
      if (!newNotation.style) {
        const gs = this.getGlobalStyleDefaults();
        newNotation.style = {
          measureHeight: gs.measureHeight,
          noteFontSize: gs.noteFontSize,
          lineSpacing: gs.lineSpacing
        };
      }
      return newNotation;
    });

    return result;
  },

  // 将标准拍号（3、4）转换为统一的模板格式
  // 4 -> '[----|----|----|----]'（4个4音符拍）
  // 3 -> '[----|----|----]'（3个4音符拍）
  convertBeatsCountToTemplate(beatsCount) {
    const count = typeof beatsCount === 'number' ? beatsCount : (this.data.timeSignatureBeats || 4);
    if (count === 3) {
      // 3/4: 严格格式，无末尾竖线
      return '[----|----|----]';
    } else if (count === 4) {
      // 4/4: 严格格式，无末尾竖线
      return '[----|----|----|----]';
    }
    // 默认4/4
    return '[----|----|----|----]';
  },

  // 创建一个空小节 - 支持数字或模板字符串
  // beatsCountOrTemplate: 可以是数字（3、4）或模板字符串（'[----|----|----]'）
  // 自动转换标准拍号为模板，统一使用 createMeasureFromCustomTemplate 生成
  createEmptyMeasure(beatsCountOrTemplate) {
    let template = '';
    
    if (typeof beatsCountOrTemplate === 'number') {
      // 传入数字，转换为模板
      template = this.convertBeatsCountToTemplate(beatsCountOrTemplate);
    } else if (typeof beatsCountOrTemplate === 'string') {
      // 传入字符串，直接使用
      template = beatsCountOrTemplate;
    } else {
      // 默认使用全局设置
      const beats = this.data.timeSignatureBeats || 4;
      template = this.convertBeatsCountToTemplate(beats);
    }
    
    // 统一使用模板化方式生成小节
    return this.createMeasureFromCustomTemplate(template);
  },

  // 统计模板中[]块的数量，决定每行小节数
  countBracketGroups(template) {
    if (!template || typeof template !== 'string') return 0;
    const matches = template.match(/\[[^\]]*\]/g);
    return matches ? matches.length : 0;
  },

  // 将单个小节转换为模板片段，如 beats:3 且每拍2分则 -> "[--|--|--]"
  buildMeasureTemplate(measure) {
    const beats = (measure && measure.beats) ? measure.beats : [];
    const beatStr = beats.map(beat => {
      const count = (beat && Array.isArray(beat.subdivisions)) ? beat.subdivisions.length : 1;
      return '-'.repeat(Math.max(1, count));
    }).join('|');
    return `[${beatStr || '--'}]`;
  },

  // 检查小节是否包含实际音符（用于模板推断）
  measureHasContent(measure) {
    if (!measure || !Array.isArray(measure.beats) || measure.beats.length === 0) return false;
    return measure.beats.some(beat => {
      const subs = Array.isArray(beat.subdivisions) ? beat.subdivisions : [];
      if (subs.length === 0) return false;
      return subs.some(sub => {
        const rh = Array.isArray(sub.rightHand) ? sub.rightHand : ['', ''];
        const lh = Array.isArray(sub.leftHand) ? sub.leftHand : ['', ''];
        const rhFilled = (rh[0] && rh[0].trim()) || (rh[1] && rh[1].trim());
        const lhFilled = (lh[0] && lh[0].trim()) || (lh[1] && lh[1].trim());
        return !!rhFilled || !!lhFilled;
      });
    });
  },

  // 规范化模板字符串：移除多余空格/空小节，确保 ][ 被当作单个分隔
  sanitizeTemplateString(template) {
    if (!template || typeof template !== 'string') return '';
    const normalized = template.replace(/\]\s*\[/g, '][').replace(/\s+/g, '');
    const groups = normalized.match(/\[[^\]]*\]/g);
    if (!groups) return '';
    const filtered = groups.filter(group => {
      const inner = group.slice(1, -1).trim();
      return inner.length > 0;
    });
    return filtered.join('');
  },

  // 判断小节是否为空（保留逻辑，当前不删除空小节）
  isBlankMeasure(measure) {
    return false;
  },

  // 将整行模板拆为小节模板数组
  splitTemplateIntoMeasures(template) {
    const sanitized = this.sanitizeTemplateString(template);
    if (!sanitized) return [];
    const groups = sanitized.match(/\[[^\]]*\]/g);
    return groups || [];
  },

  // 合并多余小节线：移除空小节（由 ][ 或 [] 产生），避免连续bar-line
  normalizeBarLines(notations) {
    return (notations || []).map(n => {
      const measures = Array.isArray(n.measures)
        ? n.measures.filter(measure => {
            const beats = Array.isArray(measure?.beats) ? measure.beats : [];
            if (!beats.length) return false;
            return beats.some(beat => {
              const subs = Array.isArray(beat.subdivisions) ? beat.subdivisions : [];
              return subs.length > 0;
            });
          })
        : [];

      return {
        ...n,
        measures: measures.length > 0 ? measures : (Array.isArray(n.measures) ? n.measures : [])
      };
    });
  },

  // 根据模块当前数据推断自由模板（首行的模板串）
  inferTemplateFromNotation(notation) {
    const measures = (notation && notation.measures) ? notation.measures : [];
    if (!measures.length) return '';
    const perRow = notation && notation.measuresPerRow ? notation.measuresPerRow : (this.getMeasuresPerRowForNotation(notation) || 1);
    const rowMeasures = measures.slice(0, perRow > 0 ? perRow : 1);
    const templates = rowMeasures
      .filter(m => Array.isArray(m.beats) && m.beats.length > 0)
      .map(m => this.buildMeasureTemplate(m))
      .filter(t => t && t !== '[]');
    return templates.join('');
  },

  // 根据模块或全局拍号模板决定每行小节数
  getMeasuresPerRowForNotation(notation) {
    const globalCustom = wx.getStorageSync('customTimeSignature') || {};
    const beats = this.data.timeSignatureBeats || 4;
    const fallbackTemplate = globalCustom.template || this.convertBeatsCountToTemplate(beats);

    // 模块自定义模板优先决定每行小节数
    if (notation && notation.moduleCustomTemplate) {
      const templateCount = this.countBracketGroups(notation.moduleCustomTemplate);
      if (templateCount && templateCount > 0) return templateCount;
    }

    // 其次使用模块解析得到的每行小节数（导入时记录）
    if (notation && notation.measuresPerRow && notation.measuresPerRow > 0) {
      return notation.measuresPerRow;
    }

    // 最后使用全局模板的分组数
    const globalCount = this.countBracketGroups(fallbackTemplate);
    if (globalCount && globalCount > 0) return globalCount;

    return this.data.measuresPerRow || 1;
  },

  // 创建一个谱面模块（含4个小节）
  createNotation(label, withExample = false, beatsCount = null) {
    const beats = beatsCount || this.data.timeSignatureBeats || 4;
    const portraitRow = this.data.measuresPerRowPortrait || this.data.measuresPerRow || 1;
    const factor = this.data.orientation === 'landscape' ? 2 : 1;
    const measures = Array.from({ length: 4 }).map(() => this.createEmptyMeasure(beats));
    if (withExample) {
      // 在第1小节填入示例
      measures[0] = {
        beats: [
          { subdivisions: [ { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] },
          { subdivisions: [ { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] },
          { subdivisions: [ { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] },
          // 如果是3/4则示例仅取前三拍
          ...(beats === 4 ? [ { subdivisions: [ { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] } ] : [])
        ]
      };
      if (beats === 3) {
        // 截取前三拍作为示例
        measures[0].beats = measures[0].beats.slice(0, 3);
      }
    }
    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      label,
      measures,
      timeSignature: `${beats}/4`,
      collapsed: false, // 默认展开
      measuresPerRowPortrait: portraitRow,
      measuresPerRow: portraitRow * factor,
      style: Object.assign({ measureHeight: 160, noteFontSize: 28, lineSpacing: 65 }, this.getGlobalStyleDefaults())
    };
  },

  // 初始化默认谱面
  initDefaultNotation() {
    // 初始包含 A-1（带示例）和 A-2（空白），每个模块都有4小节
    const initial = [ this.createNotation('A-1', true), this.createNotation('A-2', false) ];
    const withOffsets = this.updateMeasureOffsets(initial);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
  },

  // 添加新谱面
  addNotation() {
    const label = `A-${this.data.notations.length + 1}`;
    const newNotation = this.createNotation(label, false);
    // 新增模块不继承任何模块级拍号设置，使用全局拍号

    const notations = this.updateMeasureOffsets([...this.data.notations, newNotation]);
    this.saveNotationsScoped(notations);
    this.setNotations(notations);
  },

  // 在指定谱面后添加新谱面
  addNotationAfter(e) {
    const afterId = parseInt(e.currentTarget.dataset.afterId);
    const notations = [...this.data.notations];
    const afterIndex = notations.findIndex(n => n.id === afterId);
    
    if (afterIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }

    // 备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('添加模块');
    this.backupCurrentState(snapshotAction);

    // 提取前一个模块的前缀 (例如 "A-1" -> "A", "Intro-2" -> "Intro")
    const prevLabel = notations[afterIndex].label;
    const match = prevLabel.match(/^(.+)-(\d+)$/);
    const prefix = match ? match[1] : 'A';

    // 获取当前模块的样式和拍号设置，用于继承
    const sourceNotation = notations[afterIndex];
    const sourceStyle = sourceNotation.style || {};
    const sourceCustomTemplate = sourceNotation.customTemplate || sourceNotation.moduleCustomTemplate;

    // 获取源模块的每行小节数（用于计算4个视觉行需要多少个小节）
    const sourceMeasuresPerRowPortrait = sourceNotation.measuresPerRowPortrait || 1;

    let newNotation;
    
    // 目标：4个视觉行
    const targetVisualLines = 4;
    // 需要的小节总数 = 视觉行数 × 每行小节数
    const totalMeasuresNeeded = targetVisualLines * sourceMeasuresPerRowPortrait;
    
    if (sourceCustomTemplate) {
      // 自定义模板模式
      // 模板如 [--|--|--][--|--|--][--|--|--] 表示一行有3个小节
      // 每个方括号组是一个独立的小节
      const bracketGroups = sourceCustomTemplate.match(/\[[^\]]*\]/g) || [];
      
      if (bracketGroups.length > 0) {
        // 为每个方括号组创建对应的小节结构
        const measuresPerLine = [];
        for (const group of bracketGroups) {
          const singleTemplate = group; // 单个方括号组如 [--|--|--]
          const parsed = this.parseCustomTemplate(singleTemplate);
          measuresPerLine.push({
            beats: parsed.beatStructure.map(beat => ({
              subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
                rightHand: ['', ''],
                leftHand: ['', '']
              })),
              barLineAfter: beat.barLineAfter
            }))
          });
        }
        
        // 创建4个视觉行的小节
        const measures = [];
        for (let line = 0; line < targetVisualLines; line++) {
          for (const measureTemplate of measuresPerLine) {
            measures.push(JSON.parse(JSON.stringify(measureTemplate)));
          }
        }
        
        newNotation = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          label: '',
          measures: measures,
          timeSignature: '自由/自由',
          customTemplate: sourceCustomTemplate,
          measuresPerRowPortrait: sourceMeasuresPerRowPortrait,
          measuresPerRow: this.data.orientation === 'landscape' ? sourceMeasuresPerRowPortrait * 2 : sourceMeasuresPerRowPortrait
        };
      } else {
        // 无有效的方括号组，回退到标准创建
        newNotation = this.createNotation('', false);
      }
    } else {
      // 标准拍号模式
      const beatsMatch = (sourceNotation.timeSignature || '').match(/^(\d+)\//);
      const beatsCount = beatsMatch ? parseInt(beatsMatch[1], 10) : this.data.timeSignatureBeats || 4;
      
      // 创建4个视觉行所需的小节
      const measures = Array.from({ length: totalMeasuresNeeded }).map(() => this.createEmptyMeasure(beatsCount));
      
      newNotation = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        label: '',
        measures: measures,
        timeSignature: sourceNotation.timeSignature || `${beatsCount}/4`,
        collapsed: false,
        measuresPerRowPortrait: sourceMeasuresPerRowPortrait,
        measuresPerRow: this.data.orientation === 'landscape' ? sourceMeasuresPerRowPortrait * 2 : sourceMeasuresPerRowPortrait,
        style: {}
      };
    }

    // 继承当前模块的样式设置
    const gs = this.getGlobalStyleDefaults();
    newNotation.style = {
      measureHeight: sourceStyle.measureHeight || gs.measureHeight,
      noteFontSize: sourceStyle.noteFontSize || gs.noteFontSize,
      lineSpacing: sourceStyle.lineSpacing || gs.lineSpacing
    };
    
    // 在指定位置后插入
    notations.splice(afterIndex + 1, 0, newNotation);

    // 重新编号：从插入位置开始到末尾，按顺序编号
    this.relabelNotations(notations, afterIndex, prefix);

    const withOffsets = this.updateMeasureOffsets(notations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets, true);
    wx.showToast({ title: '已添加谱面', icon: 'success' });
  },

  // 重新编号模块（从指定位置开始）
  relabelNotations(notations, startIndex, prefix) {
    let counter = 1;
    // 先找到同前缀的起始位置
    let sameGroupStart = startIndex;
    while (sameGroupStart > 0) {
      const label = notations[sameGroupStart - 1].label;
      const match = label.match(/^(.+)-(\d+)$/);
      if (match && match[1] === prefix) {
        sameGroupStart--;
      } else {
        break;
      }
    }

    // 从起始位置开始重新编号所有同前缀的模块
    for (let i = sameGroupStart; i < notations.length; i++) {
      const label = notations[i].label;
      const match = label.match(/^(.+)-(\d+)$/);
      // 如果没有匹配到前缀（新插入为空标签），默认视为当前前缀
      const currentPrefix = match ? match[1] : prefix;
      
      if (currentPrefix === prefix) {
        notations[i].label = `${prefix}-${counter}`;
        counter++;
      } else {
        // 遇到不同前缀，停止重新编号
        break;
      }
    }
  },

  // 计算各模块的小节起始偏移（用于跨模块连续编号）
  updateMeasureOffsets(notations) {
    let offset = 0;
    const result = notations.map(n => ({
      ...n,
      measureOffset: 0
    }));
    for (let i = 0; i < result.length; i++) {
      result[i].measureOffset = offset;
      const mCount = Array.isArray(result[i].measures) ? result[i].measures.length : 0;
      offset += mCount;
    }
    return result;
  },

  // 删除谱面
  deleteNotation(e) {
    if (!this.data.notations || this.data.notations.length <= 1) {
      wx.showToast({ title: '至少保留一个模块', icon: 'none' });
      return;
    }
    const id = parseInt(e.currentTarget.dataset.id);
    const that = this;
    wx.showModal({
      title: '删除谱面',
      content: '确定删除吗？可通过撤销恢复。',
      success(res) {
        if (res.confirm) {
          // 先备份当前状态（用于撤销）
          const snapshotAction = that.createFullSnapshotAction('删除模块');
          that.backupCurrentState(snapshotAction);
          
          // 找到被删除模块的索引和前缀
          const deleteIndex = that.data.notations.findIndex(n => n.id === id);
          let prefix = 'A'; // 默认前缀
          if (deleteIndex !== -1) {
            const deleteLabel = that.data.notations[deleteIndex].label;
            const match = deleteLabel.match(/^(.+)-(\d+)$/);
            if (match) {
              prefix = match[1];
            }
          }
          
          // 过滤掉被删除的模块
          const filtered = that.data.notations.filter(n => n.id !== id);
          
          // 如果删除的不是最后一个，需要重新编号后续同前缀的模块
          if (deleteIndex !== -1 && deleteIndex < filtered.length) {
            that.relabelNotations(filtered, deleteIndex, prefix);
          }
          
          const withOffsets = that.updateMeasureOffsets(filtered);
          that.saveNotationsScoped(withOffsets);
          that.setNotations(withOffsets, true);
          
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  // 重置单个谱面的音符数据（保持标签与模块结构不变）
  refreshNotation(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const that = this;
    wx.showModal({
      title: '重置该板块',
      content: '确定将该板块的音符数据全部清空吗？可通过撤销恢复。',
      success(res) {
        if (!res.confirm) return;
        
        // 先备份当前状态（用于撤销）
        const snapshotAction = that.createFullSnapshotAction('重置模块');
        that.backupCurrentState(snapshotAction);
        
        const updated = JSON.parse(JSON.stringify(that.data.notations));
        const idx = updated.findIndex(n => n.id === id);
        if (idx === -1) {
          wx.showToast({ title: '未找到谱面', icon: 'none' });
          return;
        }
        const lineCount = updated[idx].measures.length;
        const isCustom = that.data.currentTimeSignatureType === 'custom';
        
        let template = '';
        if (isCustom) {
          const custom = wx.getStorageSync('customTimeSignature') || {};
          template = custom.template || '';
        } else {
          const beatsCount = that.data.timeSignatureBeats || 4;
          template = that.convertBeatsCountToTemplate(beatsCount);
        }
        
        // 统一使用模板方式生成小节
        updated[idx].measures = Array.from({ length: lineCount }).map(() => that.createMeasureFromCustomTemplate(template));
        updated[idx].timeSignature = isCustom ? '自由/自由' : `${that.data.timeSignatureBeats || 4}/4`;
        updated[idx].moduleTimeSignature = undefined;
        updated[idx].moduleCustomTemplate = undefined;
        // 同步 barLineAfter 与模板
        that.syncBarLineAfterWithTemplate(updated[idx]);
        const withOffsets = that.updateMeasureOffsets(updated);
        that.saveNotationsScoped(withOffsets);
        that.setNotations(withOffsets);
        wx.showToast({ title: '已重置', icon: 'success' });
      }
    });
  },

  // 重置所有谱面为初始设置或导入示例（弹窗选择）
  resetNotations() {
    const that = this;
    wx.showActionSheet({
      itemList: ['清空', '查看示例'],
      itemColor: '#314D63',
      success(res) {
        if (res.tapIndex === 0) {
          // 清空选项
          that.showClearConfirm();
        } else if (res.tapIndex === 1) {
          // 查看示例选项
          that.loadAndImportExample();
        }
      }
    });
  },

  // 弹窗确认清空（可撤销）
  showClearConfirm() {
    const that = this;
    wx.showModal({
      title: '确认清空',
      content: '将清空所有谱面数据，可通过撤销恢复，是否继续？',
      success(res) {
        if (res.confirm) {
          // 先备份当前状态（用于撤销）
          const snapshotAction = that.createFullSnapshotAction('清空谱面');
          that.backupCurrentState(snapshotAction);
          that.performClearNotations();
        }
      }
    });
  },

  // 执行清空操作
  performClearNotations() {
    const that = this;
    const defaultBeats = 4;
    const template = that.convertBeatsCountToTemplate(defaultBeats);
    const portraitRow = that.data.measuresPerRowPortrait || that.data.measuresPerRow || 1;
    const factor = that.data.orientation === 'landscape' ? 2 : 1;

    // 清空时强制恢复全局拍号为4/4，并退出自定义模式，重置全局排版
    that.setData({
      timeSignatureBeats: defaultBeats,
      timeSignatureBottom: 4,
      timeSignatureDisplay: '4/4',
      currentTimeSignatureType: 'standard',
      measuresPerRowPortrait: portraitRow,
      measuresPerRow: portraitRow * factor,
      globalStylePortrait: { measureHeight: 160, noteFontSize: 28, lineSpacing: 65 }
    });
    that.saveGlobalStyle();
    wx.setStorageSync('timeSignatureBeats', defaultBeats);
    wx.removeStorageSync('customTimeSignature');
    
    // 固定替换为两个空模块（A-1、A-2），每个4行、4/4、空拍位
    const rebuilt = [
      that.createNotation('A-1', false, defaultBeats),
      that.createNotation('A-2', false, defaultBeats)
    ];

    // 确保空模板的 barLineAfter 与拍号一致
    rebuilt.forEach(n => that.syncBarLineAfterWithTemplate(n));

    const withOffsets = that.updateMeasureOffsets(rebuilt);
    that.saveNotationsScoped(withOffsets);
    that.setNotations(withOffsets);
    // 不再断开与库文件的关联，只标记为未保存状态
    // that.clearLibraryFileInfo(); 
    that.markNotationChanged(); // 标记为有更改（未保存）
    wx.showToast({ title: '已清空谱面', icon: 'success' });
  },

  // 读取示例文件并导入（可撤销）
  loadAndImportExample() {
    const that = this;
    wx.showModal({
      title: '确认加载示例',
      content: '将清空现有谱面并加载示例，可通过撤销恢复，是否继续？',
      success(res) {
        if (res.confirm) {
          // 先备份当前状态（用于撤销）
          const snapshotAction = that.createFullSnapshotAction('加载示例');
          that.backupCurrentState(snapshotAction);
          that.performLoadExample();
        }
      }
    });
  },

  // 执行加载示例（使用内置常量示例数据）
  performLoadExample() {
    const that = this;
    try {
      const exampleData = BUILTIN_EXAMPLE;

      // 提取字段
      const title = exampleData.title || 'Handpan Note';
      const subtitle = exampleData.author || exampleData.subtitle || ''; // 向后兼容：优先读取author
      const tempo = exampleData.tempo || 120;
      const code = exampleData.code || '';
      
      // 先切换到数字谱，因为示例数据是按照数字谱格式制作的
      that.setData({
        notationType: 'digital'
      });
      wx.setStorageSync('notationType', 'digital');
      
      // 保存标题等信息
      wx.setStorageSync('mainTitle', title);
      wx.setStorageSync('subTitle', subtitle);
      wx.setStorageSync('globalTempo', tempo);
      
      // 更新页面数据（含全局排版样式）
      that.setData({
        mainTitle: title,
        subTitle: subtitle,
        globalTempo: tempo,
        globalStylePortrait: exampleData.globalStyle || { measureHeight: 160, noteFontSize: 28, lineSpacing: 65 }
      });
      that.saveGlobalStyle();
      that.loadTitles();
      
      // 导入谱面代码：直接覆盖所有module（不保留空module，直接用示例替换）
      try {
        const parsedModules = that.parseImportCode(code);
        if (!parsedModules || parsedModules.length === 0) {
          wx.showToast({ title: '加载示例失败: 未能解析出有效的模块数据', icon: 'none' });
          return;
        }

        // 将所有解析的示例module转换为notation格式
        const exampleNotations = parsedModules.map(module => that.convertToNotation(module));
        
        // 直接替换所有module（不是添加）
        const notations = that.updateMeasureOffsets(exampleNotations);
        that.saveNotationsScoped(notations);
        that.setNotations(notations);
        // 不再断开与库文件的关联，只标记为未保存状态
        // that.clearLibraryFileInfo();
        that.markNotationChanged(); // 标记为有更改（未保存）

        wx.showToast({
          title: `成功加载`,
          icon: 'success'
        });
      } catch (parseErr) {
        console.error('示例导入错误：', parseErr);
        wx.showToast({ title: '加载示例失败: ' + (parseErr.message || '解析失败'), icon: 'none' });
      }
    } catch (e) {
      wx.showToast({ title: '加载示例失败: ' + (e.message || '未知错误'), icon: 'none' });
      console.error('加载示例失败:', e);
    }
  },

  // 打开拍号选择
  openTimeSignaturePicker() {
    const that = this;
    wx.showActionSheet({
      itemList: ['4/4', '3/4', '自由设定'],
      success(res) {
        const index = res.tapIndex;
        if (index === 0) {
          that.applyTimeSignature(4);
        } else if (index === 1) {
          that.applyTimeSignature(3);
        } else if (index === 2) {
          that.openCustomTimeSignatureModal();
        }
      }
    });
  },

  // 打开自由设定拍号模态框
  openCustomTimeSignatureModal() {
    // 恢复之前保存的自定义模板（如果有）
    const customTimeSignature = wx.getStorageSync('customTimeSignature');
    const template = customTimeSignature && customTimeSignature.template ? customTimeSignature.template : '';
    
    // 使用实例变量存储临时值
    this._customTimeSignatureTemplate = template;
    
    // 初始化可视化数据
    let visualNoteCount = 16;
    let visualDots = [];
    let visualSeparators = [];
    
    if (template) {
      // 从现有模板解析可视化数据
      const parsed = this.parseTemplateToVisual(template);
      visualNoteCount = parsed.noteCount;
      visualDots = parsed.dots;
      visualSeparators = parsed.separators;
    } else {
      // 默认16个音符，使用标准 4/4 拍号格式（每4个音符一拍）
      visualDots = Array(visualNoteCount).fill(0).map(() => ({}));
      visualSeparators = Array(visualNoteCount - 1).fill(0).map((_, i) => {
        // 在位置 3, 7, 11 处添加拍线（每4个音符后）
        if ((i + 1) % 4 === 0 && i < visualNoteCount - 1) {
          return { type: 'beat' };
        }
        return { type: 'none' };
      });
    }
    
    // 生成模板和小节信息
    const generatedTemplate = template || this.generateTemplateFromVisual(visualDots, visualSeparators);
    const measureInfoList = this.generateMeasureInfoList(visualDots, visualSeparators);
    
    this.setData({
      showCustomTimeSignatureModal: true,
      customTimeSignatureTemplate: generatedTemplate,
      customTimeSignatureError: '',
      customTimeSignatureValid: this.validateVisualTemplate(visualDots, visualSeparators),
      visualNoteCount: visualNoteCount,
      visualDots: visualDots,
      visualSeparators: visualSeparators,
      measureInfoList: measureInfoList
    });
  },

  // 关闭自由设定模态框
  closeCustomTimeSignatureModal() {
    // 清理实例变量
    this._customTimeSignatureTemplate = undefined;
    if (this._customTemplateValidationTimer) {
      clearTimeout(this._customTemplateValidationTimer);
      this._customTemplateValidationTimer = null;
    }
    
    this.setData({
      showCustomTimeSignatureModal: false,
      customTimeSignatureTemplate: '',
      customTimeSignatureError: '',
      customTimeSignatureValid: false,
      // 清理可视化数据
      visualNoteCount: 16,
      visualDots: [],
      visualSeparators: [],
      measureInfoList: []
    });
  },

  // 自由设定模板输入变化（使用实例变量避免输入回退）
  onCustomTimeSignatureInput(e) {
    const template = e.detail.value;
    this._customTimeSignatureTemplate = template;
    // 实时验证（debounced），不把输入写回 data.customTimeSignatureTemplate，避免回退
    this.validateCustomTemplate(template, { sync: false, debounce: true });
  },

  // ===== 可视化拍号输入方法 =====
  
  // 从模板字符串解析为可视化数据
  parseTemplateToVisual(template) {
    if (!template || typeof template !== 'string') {
      return { noteCount: 16, dots: Array(16).fill(0).map(() => ({})), separators: Array(15).fill(0).map(() => ({ type: 'none' })) };
    }
    
    const cleaned = template.trim();
    if (!cleaned.startsWith('[') || !cleaned.endsWith(']')) {
      return { noteCount: 16, dots: Array(16).fill(0).map(() => ({})), separators: Array(15).fill(0).map(() => ({ type: 'none' })) };
    }
    
    // 统计 - 的数量
    const noteCount = (cleaned.match(/-/g) || []).length;
    if (noteCount === 0) {
      return { noteCount: 16, dots: Array(16).fill(0).map(() => ({})), separators: Array(15).fill(0).map(() => ({ type: 'none' })) };
    }
    
    const dots = Array(noteCount).fill(0).map(() => ({}));
    const separators = [];
    
    // 解析分隔符位置
    // 去掉首尾的 [ ]
    const inner = cleaned.slice(1, -1);
    let dotIndex = 0;
    
    for (let i = 0; i < inner.length; i++) {
      const char = inner[i];
      if (char === '-') {
        // 检查下一个字符来确定分隔符类型
        if (dotIndex < noteCount - 1) {
          // 查找下一个 - 之前的内容
          let sepType = 'none';
          let j = i + 1;
          while (j < inner.length && inner[j] !== '-') {
            if (inner[j] === ']' && inner[j + 1] === '[') {
              sepType = 'measure';
              j++; // 跳过 [
            } else if (inner[j] === '|') {
              sepType = 'beat';
            }
            j++;
          }
          separators.push({ type: sepType });
        }
        dotIndex++;
      }
    }
    
    // 确保分隔符数组长度正确
    while (separators.length < noteCount - 1) {
      separators.push({ type: 'none' });
    }
    
    return { noteCount, dots, separators };
  },
  
  // 从可视化数据生成模板字符串
  generateTemplateFromVisual(dots, separators) {
    if (!dots || dots.length === 0) return '[----|----|----|----]';
    
    let template = '[';
    for (let i = 0; i < dots.length; i++) {
      template += '-';
      if (i < dots.length - 1 && separators[i]) {
        if (separators[i].type === 'beat') {
          template += '|';
        } else if (separators[i].type === 'measure') {
          template += '][';
        }
      }
    }
    template += ']';
    
    return template;
  },
  
  // 验证可视化模板
  validateVisualTemplate(dots, separators) {
    if (!dots || dots.length === 0) return false;
    if (dots.length > 35) return false;
    return true;
  },
  
  // 生成小节信息列表
  generateMeasureInfoList(dots, separators) {
    if (!dots || dots.length === 0) return [];
    
    const measures = [];
    let currentMeasure = { measureIndex: 0, beats: [] };
    let currentBeat = { noteCount: 0 };
    
    for (let i = 0; i < dots.length; i++) {
      currentBeat.noteCount++;
      
      if (i < dots.length - 1) {
        const sep = separators[i];
        if (sep && sep.type === 'beat') {
          // 拍线，结束当前拍，开始新拍
          currentMeasure.beats.push({ ...currentBeat });
          currentBeat = { noteCount: 0 };
        } else if (sep && sep.type === 'measure') {
          // 小节线，结束当前拍和小节，开始新小节
          currentMeasure.beats.push({ ...currentBeat });
          measures.push({ ...currentMeasure });
          currentMeasure = { measureIndex: measures.length, beats: [] };
          currentBeat = { noteCount: 0 };
        }
      }
    }
    
    // 添加最后一拍和最后一个小节
    if (currentBeat.noteCount > 0) {
      currentMeasure.beats.push({ ...currentBeat });
    }
    if (currentMeasure.beats.length > 0) {
      measures.push({ ...currentMeasure });
    }
    
    return measures;
  },
  
  // 更新可视化数据并同步模板
  updateVisualAndTemplate() {
    const { visualDots, visualSeparators } = this.data;
    const template = this.generateTemplateFromVisual(visualDots, visualSeparators);
    const measureInfoList = this.generateMeasureInfoList(visualDots, visualSeparators);
    const valid = this.validateVisualTemplate(visualDots, visualSeparators);
    
    this._customTimeSignatureTemplate = template;
    
    this.setData({
      customTimeSignatureTemplate: template,
      customTimeSignatureValid: valid,
      customTimeSignatureError: valid ? '' : (visualDots.length > 35 ? '音符数不能超过35个' : ''),
      measureInfoList: measureInfoList
    });
  },
  
  // 音符数输入变化
  onVisualNoteCountInput(e) {
    const value = e.detail.value;
    // 仅更新显示值，不立即重建
    this.setData({ visualNoteCount: value });
  },
  
  // 音符数输入失焦时更新
  onVisualNoteCountBlur(e) {
    let count = parseInt(e.detail.value) || 16;
    count = Math.max(1, Math.min(35, count));
    
    // 重建圆点和分隔符数组
    const oldDots = this.data.visualDots || [];
    const oldSeparators = this.data.visualSeparators || [];
    
    const newDots = Array(count).fill(0).map(() => ({}));
    const newSeparators = [];
    
    // 尽量保留原有分隔符
    for (let i = 0; i < count - 1; i++) {
      if (i < oldSeparators.length) {
        newSeparators.push({ ...oldSeparators[i] });
      } else {
        newSeparators.push({ type: 'none' });
      }
    }
    
    this.setData({
      visualNoteCount: count,
      visualDots: newDots,
      visualSeparators: newSeparators
    }, () => {
      this.updateVisualAndTemplate();
    });
  },
  
  // 点击圆点间隙，切换分隔符（三态循环）
  onDotGapTap(e) {
    const index = e.currentTarget.dataset.index;
    const separators = [...this.data.visualSeparators];
    
    if (index < 0 || index >= separators.length) return;
    
    // 三态循环：none -> beat -> measure -> none
    const currentType = separators[index].type || 'none';
    let newType;
    if (currentType === 'none') {
      newType = 'beat';
    } else if (currentType === 'beat') {
      newType = 'measure';
    } else {
      newType = 'none';
    }
    
    separators[index] = { type: newType };
    
    this.setData({ visualSeparators: separators }, () => {
      this.updateVisualAndTemplate();
    });
  },
  
  // 修改单拍音符数（从信息列表中点击编辑）
  onBeatNoteCountInput(e) {
    // 仅记录输入值，不立即更新
  },
  
  // 单拍音符数失焦时更新
  onBeatNoteCountBlur(e) {
    const measureIndex = parseInt(e.currentTarget.dataset.measureIndex);
    const beatIndex = parseInt(e.currentTarget.dataset.beatIndex);
    let newCount = parseInt(e.detail.value) || 1;
    newCount = Math.max(1, Math.min(10, newCount));
    
    // 找到当前拍的起始和结束位置
    const measureInfoList = this.data.measureInfoList;
    if (measureIndex >= measureInfoList.length) return;
    
    const measure = measureInfoList[measureIndex];
    if (beatIndex >= measure.beats.length) return;
    
    const oldCount = measure.beats[beatIndex].noteCount;
    const diff = newCount - oldCount;
    
    if (diff === 0) return;
    
    // 计算该拍在全局的起始位置
    let globalStart = 0;
    for (let m = 0; m < measureIndex; m++) {
      for (let b = 0; b < measureInfoList[m].beats.length; b++) {
        globalStart += measureInfoList[m].beats[b].noteCount;
      }
    }
    for (let b = 0; b < beatIndex; b++) {
      globalStart += measure.beats[b].noteCount;
    }
    
    const globalEnd = globalStart + oldCount;
    
    // 修改音符数
    const dots = [...this.data.visualDots];
    const separators = [...this.data.visualSeparators];
    
    if (diff > 0) {
      // 增加音符：在该拍末尾插入
      for (let i = 0; i < diff; i++) {
        dots.splice(globalEnd + i, 0, {});
        // 新增音符的分隔符默认为 none，但要保持原有结构
        if (globalEnd + i - 1 >= 0 && globalEnd + i <= separators.length) {
          separators.splice(globalEnd + i, 0, { type: 'none' });
        }
      }
    } else {
      // 减少音符：从该拍末尾移除
      const removeCount = -diff;
      const removeStart = globalEnd - removeCount;
      dots.splice(removeStart, removeCount);
      // 移除对应的分隔符
      if (removeStart > 0) {
        separators.splice(removeStart - 1, removeCount);
      } else {
        separators.splice(0, Math.min(removeCount, separators.length));
      }
    }
    
    // 确保分隔符数组长度正确
    while (separators.length < dots.length - 1) {
      separators.push({ type: 'none' });
    }
    while (separators.length > dots.length - 1) {
      separators.pop();
    }
    
    // 检查总数是否超限
    if (dots.length > 35) {
      wx.showToast({ title: '音符总数不能超过35', icon: 'none' });
      return;
    }
    
    this.setData({
      visualDots: dots,
      visualSeparators: separators,
      visualNoteCount: dots.length
    }, () => {
      this.updateVisualAndTemplate();
    });
  },

  // ===== 模块拍号设置方法 =====
  
  // 打开模块拍号设置弹窗
  openModuleTimeSignatureModal() {
    const moduleId = this.data.currentModuleId;
    const notation = this.data.notations.find(n => n.id === moduleId);
    
    if (!notation) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }
    
    // 获取当前模块的模板（优先使用模块级模板，其次使用全局模板）
    let template = '';
    if (notation.moduleCustomTemplate) {
      template = notation.moduleCustomTemplate;
    } else if (notation.moduleTimeSignature === 'custom') {
      template = this.inferTemplateFromNotation(notation);
    } else {
      // 从全局设置获取
      const globalCustom = wx.getStorageSync('customTimeSignature') || {};
      template = globalCustom.template || '';
    }
    
    // 如果没有模板，从当前模块结构推断
    if (!template) {
      template = this.inferTemplateFromNotation(notation);
    }
    
    // 初始化可视化数据
    let moduleVisualNoteCount = 16;
    let moduleVisualDots = [];
    let moduleVisualSeparators = [];
    
    if (template) {
      // 从现有模板解析可视化数据
      const parsed = this.parseTemplateToVisual(template);
      moduleVisualNoteCount = parsed.noteCount;
      moduleVisualDots = parsed.dots;
      moduleVisualSeparators = parsed.separators;
    } else {
      // 默认16个音符，使用标准 4/4 拍号格式（每4个音符一拍）
      moduleVisualDots = Array(moduleVisualNoteCount).fill(0).map(() => ({}));
      moduleVisualSeparators = Array(moduleVisualNoteCount - 1).fill(0).map((_, i) => {
        if ((i + 1) % 4 === 0 && i < moduleVisualNoteCount - 1) {
          return { type: 'beat' };
        }
        return { type: 'none' };
      });
    }
    
    // 生成模板和小节信息
    const generatedTemplate = template || this.generateTemplateFromVisual(moduleVisualDots, moduleVisualSeparators);
    const moduleMeasureInfoList = this.generateMeasureInfoList(moduleVisualDots, moduleVisualSeparators);
    
    this.setData({
      showModuleTimeSignatureModal: true,
      moduleTimeSignatureTemplate: generatedTemplate,
      moduleTimeSignatureError: '',
      moduleTimeSignatureValid: this.validateVisualTemplate(moduleVisualDots, moduleVisualSeparators),
      moduleVisualNoteCount: moduleVisualNoteCount,
      moduleVisualDots: moduleVisualDots,
      moduleVisualSeparators: moduleVisualSeparators,
      moduleMeasureInfoList: moduleMeasureInfoList
    });
  },
  
  // 关闭模块拍号设置弹窗
  closeModuleTimeSignatureModal() {
    this.setData({
      showModuleTimeSignatureModal: false,
      moduleTimeSignatureTemplate: '',
      moduleTimeSignatureError: '',
      moduleTimeSignatureValid: false,
      moduleVisualNoteCount: 16,
      moduleVisualDots: [],
      moduleVisualSeparators: [],
      moduleMeasureInfoList: []
    });
  },
  
  // 更新模块可视化数据并同步模板
  updateModuleVisualAndTemplate() {
    const { moduleVisualDots, moduleVisualSeparators } = this.data;
    const template = this.generateTemplateFromVisual(moduleVisualDots, moduleVisualSeparators);
    const moduleMeasureInfoList = this.generateMeasureInfoList(moduleVisualDots, moduleVisualSeparators);
    const valid = this.validateVisualTemplate(moduleVisualDots, moduleVisualSeparators);
    
    this.setData({
      moduleTimeSignatureTemplate: template,
      moduleTimeSignatureValid: valid,
      moduleTimeSignatureError: valid ? '' : (moduleVisualDots.length > 35 ? '音符数不能超过35个' : ''),
      moduleMeasureInfoList: moduleMeasureInfoList
    });
  },
  
  // 模块音符数输入变化
  onModuleVisualNoteCountInput(e) {
    const value = e.detail.value;
    this.setData({ moduleVisualNoteCount: value });
  },
  
  // 模块音符数输入失焦时更新
  onModuleVisualNoteCountBlur(e) {
    let count = parseInt(e.detail.value) || 16;
    count = Math.max(1, Math.min(35, count));
    
    const oldDots = this.data.moduleVisualDots || [];
    const oldSeparators = this.data.moduleVisualSeparators || [];
    
    const newDots = Array(count).fill(0).map(() => ({}));
    const newSeparators = [];
    
    for (let i = 0; i < count - 1; i++) {
      if (i < oldSeparators.length) {
        newSeparators.push({ ...oldSeparators[i] });
      } else {
        newSeparators.push({ type: 'none' });
      }
    }
    
    this.setData({
      moduleVisualNoteCount: count,
      moduleVisualDots: newDots,
      moduleVisualSeparators: newSeparators
    }, () => {
      this.updateModuleVisualAndTemplate();
    });
  },
  
  // 模块点击圆点间隙，切换分隔符（三态循环）
  onModuleDotGapTap(e) {
    const index = e.currentTarget.dataset.index;
    const separators = [...this.data.moduleVisualSeparators];
    
    if (index < 0 || index >= separators.length) return;
    
    const currentType = separators[index].type || 'none';
    let newType;
    if (currentType === 'none') {
      newType = 'beat';
    } else if (currentType === 'beat') {
      newType = 'measure';
    } else {
      newType = 'none';
    }
    
    separators[index] = { type: newType };
    
    this.setData({ moduleVisualSeparators: separators }, () => {
      this.updateModuleVisualAndTemplate();
    });
  },
  
  // 模块单拍音符数输入
  onModuleBeatNoteCountInput(e) {
    // 仅记录输入值，不立即更新
  },
  
  // 模块单拍音符数失焦时更新
  onModuleBeatNoteCountBlur(e) {
    const measureIndex = parseInt(e.currentTarget.dataset.measureIndex);
    const beatIndex = parseInt(e.currentTarget.dataset.beatIndex);
    let newCount = parseInt(e.detail.value) || 1;
    newCount = Math.max(1, Math.min(10, newCount));
    
    const measureInfoList = this.data.moduleMeasureInfoList;
    if (measureIndex >= measureInfoList.length) return;
    
    const measure = measureInfoList[measureIndex];
    if (beatIndex >= measure.beats.length) return;
    
    const oldCount = measure.beats[beatIndex].noteCount;
    const diff = newCount - oldCount;
    
    if (diff === 0) return;
    
    let globalStart = 0;
    for (let m = 0; m < measureIndex; m++) {
      for (let b = 0; b < measureInfoList[m].beats.length; b++) {
        globalStart += measureInfoList[m].beats[b].noteCount;
      }
    }
    for (let b = 0; b < beatIndex; b++) {
      globalStart += measure.beats[b].noteCount;
    }
    
    const globalEnd = globalStart + oldCount;
    
    const dots = [...this.data.moduleVisualDots];
    const separators = [...this.data.moduleVisualSeparators];
    
    if (diff > 0) {
      for (let i = 0; i < diff; i++) {
        dots.splice(globalEnd + i, 0, {});
        if (globalEnd + i - 1 >= 0 && globalEnd + i <= separators.length) {
          separators.splice(globalEnd + i, 0, { type: 'none' });
        }
      }
    } else {
      const removeCount = -diff;
      const removeStart = globalEnd - removeCount;
      dots.splice(removeStart, removeCount);
      if (removeStart > 0) {
        separators.splice(removeStart - 1, removeCount);
      } else {
        separators.splice(0, Math.min(removeCount, separators.length));
      }
    }
    
    while (separators.length < dots.length - 1) {
      separators.push({ type: 'none' });
    }
    while (separators.length > dots.length - 1) {
      separators.pop();
    }
    
    if (dots.length > 35) {
      wx.showToast({ title: '音符总数不能超过35', icon: 'none' });
      return;
    }
    
    this.setData({
      moduleVisualDots: dots,
      moduleVisualSeparators: separators,
      moduleVisualNoteCount: dots.length
    }, () => {
      this.updateModuleVisualAndTemplate();
    });
  },
  
  // 确认模块拍号设置
  confirmModuleTimeSignature() {
    const template = this.data.moduleTimeSignatureTemplate.trim();
    
    if (!this.validateVisualTemplate(this.data.moduleVisualDots, this.data.moduleVisualSeparators)) {
      wx.showToast({ title: '请检查拍号设置', icon: 'none' });
      return;
    }
    
    const moduleId = this.data.currentModuleId;
    const notations = [...this.data.notations];
    const idx = notations.findIndex(n => n.id === moduleId);
    
    if (idx === -1) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }
    
    const notation = notations[idx];
    
    // 解析模板
    const parsed = this.parseCustomTemplate(template);
    const sanitizedTemplate = this.sanitizeTemplateString(template);
    
    // 统计每行有多少个小节（方括号组数）
    const portraitRow = this.countBracketGroups(template) || 1;
    const factor = this.data.orientation === 'landscape' ? 2 : 1;
    
    // 将模板拆分成多个方括号组
    const bracketGroups = template.match(/\[[^\]]*\]/g) || [];
    
    // 为每个方括号组创建对应的小节结构模板
    const measureTemplates = [];
    if (bracketGroups.length > 0) {
      for (const group of bracketGroups) {
        const groupParsed = this.parseCustomTemplate(group);
        measureTemplates.push({
          beats: groupParsed.beatStructure.map(beat => ({
            subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
              rightHand: ['', ''],
              leftHand: ['', '']
            })),
            barLineAfter: beat.barLineAfter
          }))
        });
      }
    } else {
      measureTemplates.push({
        beats: parsed.beatStructure.map(beat => ({
          subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
            rightHand: ['', ''],
            leftHand: ['', '']
          })),
          barLineAfter: beat.barLineAfter
        }))
      });
    }
    
    // 保持现有的行数
    const currentPerRow = notation.measuresPerRow || this.getMeasuresPerRowForNotation(notation) || 1;
    const currentMeasureCount = (notation.measures || []).length;
    const visualLines = Math.max(1, Math.ceil(currentMeasureCount / currentPerRow));
    const newMeasureCount = visualLines * portraitRow;
    
    // 创建新的小节数组，尽量保留原有数据
    const newMeasures = [];
    for (let i = 0; i < newMeasureCount; i++) {
      const templateIdx = i % measureTemplates.length;
      const measureTemplate = JSON.parse(JSON.stringify(measureTemplates[templateIdx]));
      
      // 尝试保留原有小节的数据
      if (i < (notation.measures || []).length) {
        const oldMeasure = notation.measures[i];
        if (oldMeasure && oldMeasure.beats) {
          // 尝试迁移数据
          measureTemplate.beats.forEach((newBeat, beatIdx) => {
            if (oldMeasure.beats[beatIdx]) {
              const oldBeat = oldMeasure.beats[beatIdx];
              newBeat.subdivisions.forEach((newSub, subIdx) => {
                if (oldBeat.subdivisions && oldBeat.subdivisions[subIdx]) {
                  newSub.rightHand = oldBeat.subdivisions[subIdx].rightHand || ['', ''];
                  newSub.leftHand = oldBeat.subdivisions[subIdx].leftHand || ['', ''];
                }
              });
            }
          });
        }
      }
      
      newMeasures.push(measureTemplate);
    }
    
    // 更新模块
    notation.measures = newMeasures;
    notation.moduleTimeSignature = 'custom';
    notation.moduleCustomTemplate = sanitizedTemplate;
    notation.timeSignature = '自由/自由';
    notation.measuresPerRowPortrait = portraitRow;
    notation.measuresPerRow = portraitRow * factor;
    
    // 同步 barLineAfter
    this.syncBarLineAfterWithTemplate(notation);
    
    notations[idx] = notation;
    const withOffsets = this.updateMeasureOffsets(notations);
    
    // 【Bug修复】清除该模块的临时图片路径，强制重新渲染Canvas
    // 同时更新Canvas高度（因为拍号变化可能影响布局）
    const updatedNotation = withOffsets[idx];
    if (updatedNotation) {
      withOffsets[idx] = {
        ...updatedNotation,
        tempImagePath: null, // 清除缓存的静态图片
        canvasHeight: this.calculateCanvasHeight(updatedNotation)
      };
    }
    
    this.setNotations(withOffsets);
    
    // 更新模块设置弹窗中的显示
    this.setData({
      moduleTimeSignatureBeats: 'custom',
      moduleCustomTemplate: sanitizedTemplate
    });
    
    // 关闭模块拍号设置弹窗
    this.closeModuleTimeSignatureModal();
    
    wx.showToast({ title: '模块拍号已更新', icon: 'success' });
  },

  // 验证自由设定模板（可选同步 data，支持 debounce）
  // options: { sync: boolean, debounce: boolean }
  validateCustomTemplate(template, options = {}) {
    const { sync = false, debounce = false } = options;
    template = (template || '').trim();

    const perform = () => {
      let error = '';
      if (!template) {
        error = '请输入模板';
      } else if (!/^[\[\]\|\-]+$/.test(template)) {
        error = '只能包含 [ ] | - 四种符号';
      } else if ((template.match(/-/g) || []).length > 35) {
        error = '音符位"-"不能超过35个';
      } else if (!template.startsWith('[') || !template.endsWith(']')) {
        error = '必须以"["开始，"]"结束';
      }

      // 更新错误显示和有效性标记（不清空用户正在输入的模板）
      const valid = error === '';
      const updates = {};
      if (this.data.customTimeSignatureError !== error) updates.customTimeSignatureError = error;
      if (this.data.customTimeSignatureValid !== valid) updates.customTimeSignatureValid = valid;

      // 同步到 data.customTimeSignatureTemplate 仅在 sync 为 true 且验证通过时
      if (sync && valid && this.data.customTimeSignatureTemplate !== template) {
        updates.customTimeSignatureTemplate = template;
      }

      if (Object.keys(updates).length > 0) {
        this.setData(updates);
      }

      return valid;
    };

    if (debounce) {
      if (this._customTemplateValidationTimer) clearTimeout(this._customTemplateValidationTimer);
      // 200ms 延迟，减少高频 setData 导致的输入回退
      this._customTemplateValidationTimer = setTimeout(() => {
        perform();
        this._customTemplateValidationTimer = null;
      }, 200);
      // 在 debounce 模式下不返回最终结果立即返回 true 以避免阻塞调用者
      return true;
    }

    // 立即执行验证
    return perform();
  },

  // 确认自由设定拍号
  confirmCustomTimeSignature() {
    // 从实例变量读取最新值
    const template = (this._customTimeSignatureTemplate !== undefined 
      ? this._customTimeSignatureTemplate 
      : this.data.customTimeSignatureTemplate).trim();
    
    if (!this.validateCustomTemplate(template)) {
      return;
    }

    // 解析模板，获取拍的结构
    const parsed = this.parseCustomTemplate(template);
    const beatCount = parsed.totalBeats;
    
    // 统计每行有多少个小节（方括号组数）
    const portraitRow = this.countBracketGroups(template) || 1;
    const factor = this.data.orientation === 'landscape' ? 2 : 1;
    
    // 将模板拆分成多个方括号组，每个方括号组代表一个小节
    const bracketGroups = template.match(/\[[^\]]*\]/g) || [];
    
    // 为每个方括号组创建对应的小节结构模板
    const measureTemplates = [];
    if (bracketGroups.length > 0) {
      for (const group of bracketGroups) {
        const groupParsed = this.parseCustomTemplate(group);
        measureTemplates.push({
          beats: groupParsed.beatStructure.map(beat => ({
            subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
              rightHand: ['', ''],
              leftHand: ['', '']
            })),
            barLineAfter: beat.barLineAfter
          }))
        });
      }
    } else {
      // 无有效方括号组时使用整个模板解析
      measureTemplates.push({
        beats: parsed.beatStructure.map(beat => ({
          subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
            rightHand: ['', ''],
            leftHand: ['', '']
          })),
          barLineAfter: beat.barLineAfter
        }))
      });
    }

    // 保存自定义拍号模板
    const customTimeSignature = {
      type: 'custom',
      template: template,
      noteCount: beatCount, // 使用实际拍数而不只是 - 的数量
      beatStructure: parsed.beatStructure // 保存完整结构
    };

    wx.setStorageSync('customTimeSignature', customTimeSignature);
    
    // 清理实例变量
    this._customTimeSignatureTemplate = undefined;
    
    // 获取现有的谱面数据（如果有）
    const existingNotations = this.data.notations || [];

    // 切换到自定义拍号的数据空间
    // 直接使用 beatCount 而不是调用 getNotationStorageKeyForCustom()
    const key = `notations_custom_${beatCount}`;
    let scoped = wx.getStorageSync(key);
    
    if (!scoped || !Array.isArray(scoped)) {
      // 初始化新的谱面数据
      // 获取现有板块的标签（如果存在）
      const existingLabels = existingNotations.length > 0 
        ? existingNotations.map(n => n.label)
        : ['A-1', 'A-2'];
      
      // 为每个现有标签创建新谱面，使用自定义模板格式
      const initial = existingLabels.map((label, idx) => 
        this.createNotationWithCustomTemplate(label, idx === 0, template)
      );
      
      const withOffsets = this.updateMeasureOffsets(initial);
      
      // 【Bug修复】清除所有临时图片并重新计算Canvas高度
      const withClearedImages = withOffsets.map(notation => ({
        ...notation,
        tempImagePath: null,
        canvasHeight: this.calculateCanvasHeight(notation)
      }));
      
      this.saveNotationsScopedWithKey(withClearedImages, key);
      this.setData({ 
        timeSignatureBeats: beatCount,
        currentTimeSignatureType: 'custom',
        measuresPerRowPortrait: portraitRow,
        measuresPerRow: portraitRow * factor
      }, () => {
        // 【Bug修复】使用setNotations触发Canvas重新初始化
        this.setNotations(withClearedImages);
      });
    } else {
      // 现有数据存在，则将所有现有模块的所有行都转换为新的自定义拍号格式
      const migrated = scoped.map(notation => {
        // 计算需要的小节数（保持视觉行数）
        const oldPerRow = notation.measuresPerRowPortrait || notation.measuresPerRow || 1;
        const oldMeasureCount = notation.measures.length;
        const visualLines = Math.max(1, Math.ceil(oldMeasureCount / oldPerRow));
        const newMeasureCount = visualLines * portraitRow;
        
        // 创建新的小节数组
        const newMeasures = [];
        for (let i = 0; i < newMeasureCount; i++) {
          const templateIdx = i % measureTemplates.length;
          const measureCopy = JSON.parse(JSON.stringify(measureTemplates[templateIdx]));
          
          // 如果是第一个小节，填入示例数据
          if (i === 0 && measureCopy.beats.length > 0 && measureCopy.beats[0].subdivisions.length > 0) {
            measureCopy.beats[0].subdivisions[0].rightHand = ['', ''];
            measureCopy.beats[0].subdivisions[0].leftHand = ['', '8'];
          }
          
          newMeasures.push(measureCopy);
        }
        
        return {
          ...notation,
          measures: newMeasures,
          timeSignature: '自由/自由',
          customTemplate: template,
          measuresPerRowPortrait: portraitRow,
          measuresPerRow: portraitRow * factor,
          moduleTimeSignature: undefined // 清除模块级设置，使用全局设置
        };
      });
      
      const withOffsets = this.updateMeasureOffsets(migrated);
      
      // 【Bug修复】清除所有临时图片并重新计算Canvas高度
      const withClearedImages = withOffsets.map(notation => ({
        ...notation,
        tempImagePath: null,
        canvasHeight: this.calculateCanvasHeight(notation)
      }));
      
      this.saveNotationsScopedWithKey(withClearedImages, key);
      this.setData({ 
        timeSignatureBeats: beatCount,
        currentTimeSignatureType: 'custom',
        measuresPerRowPortrait: portraitRow,
        measuresPerRow: portraitRow * factor
      }, () => {
        // 【Bug修复】使用setNotations触发Canvas重新初始化
        this.setNotations(withClearedImages);
      });
    }

    this.closeCustomTimeSignatureModal();
    wx.showToast({ title: '自由设定已应用，所有模块已更新', icon: 'none' });
  },

  // 根据自定义模板创建谱面
  createNotationWithCustomTemplate(label, withExample = false, template) {
    // 统计每行有多少个小节（方括号组数）
    const portraitRow = this.countBracketGroups(template) || this.data.measuresPerRowPortrait || this.data.measuresPerRow || 1;
    const factor = this.data.orientation === 'landscape' ? 2 : 1;
    
    // 将模板拆分成多个方括号组，每个方括号组代表一个小节
    const bracketGroups = template.match(/\[[^\]]*\]/g) || [];
    
    // 目标：4个视觉行
    const targetVisualLines = 4;
    const totalMeasuresNeeded = targetVisualLines * portraitRow;
    
    // 为每个方括号组创建对应的小节结构模板
    const measureTemplates = [];
    if (bracketGroups.length > 0) {
      for (const group of bracketGroups) {
        const parsed = this.parseCustomTemplate(group);
        measureTemplates.push({
          beats: parsed.beatStructure.map(beat => ({
            subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
              rightHand: ['', ''],
              leftHand: ['', '']
            })),
            barLineAfter: beat.barLineAfter
          }))
        });
      }
    } else {
      // 无有效方括号组时使用整个模板解析
      const parsed = this.parseCustomTemplate(template);
      measureTemplates.push({
        beats: parsed.beatStructure.map(beat => ({
          subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
            rightHand: ['', ''],
            leftHand: ['', '']
          })),
          barLineAfter: beat.barLineAfter
        }))
      });
    }
    
    // 创建足够视觉行的小节
    const measures = [];
    for (let i = 0; i < totalMeasuresNeeded; i++) {
      const templateIdx = i % measureTemplates.length;
      const measureCopy = JSON.parse(JSON.stringify(measureTemplates[templateIdx]));
      
      // 如果需要示例且是第一个小节
      if (withExample && i === 0 && measureCopy.beats.length > 0 && measureCopy.beats[0].subdivisions.length > 0) {
        measureCopy.beats[0].subdivisions[0].rightHand = ['7', '8'];
        measureCopy.beats[0].subdivisions[0].leftHand = ['', '8'];
      }
      
      measures.push(measureCopy);
    }

    return {
      id: Date.now() + Math.floor(Math.random() * 1000),
      label,
      measures,
      timeSignature: '自由/自由', // 标记为自由节奏
      customTemplate: template, // 保存原始模板
      measuresPerRowPortrait: portraitRow,
      measuresPerRow: portraitRow * factor
    };
  },

  // 关闭模块设置模态框
  closeModuleSettingsModal() {
    // 清理实例变量
    this._moduleCustomTemplate = undefined;
    
    this.setData({
      showModuleSettingsModal: false,
      currentModuleId: null,
      moduleLineCount: 4,
      moduleLineCountError: '',
      moduleTimeSignatureBeats: 4,
      moduleCustomTemplate: '',
      moduleCustomTemplateError: '',
      exportModuleCode: ''
    });
  },

  // 生成当前模块的导出代码
  generateModuleExportCode() {
    const id = this.data.currentModuleId;
    const notation = this.data.notations.find(n => n.id === id);
    
    if (!notation) {
      return '';
    }

    // 使用统一的代码生成逻辑
    return this.generateCodeForNotations([notation]);
  },

  // 将单个小节数据转换为代码片段 [ ... ]（跳过占位拍）
  buildMeasureCode(measure) {
    if (!measure || !Array.isArray(measure.beats)) return '[]';

    // 【修复】过滤掉占位拍
    const realBeats = measure.beats.filter(beat => !beat.isPlaceholder);
    
    const beatStrings = realBeats.map(beat => {
      const subs = Array.isArray(beat.subdivisions) ? beat.subdivisions : [];
      const subStrings = subs.map(sub => {
        const rh = Array.isArray(sub.rightHand) ? sub.rightHand : ['', ''];
        const lh = Array.isArray(sub.leftHand) ? sub.leftHand : ['', ''];
        const rhText = [rh[0] || '', rh[1] || ''].filter(Boolean).join(',');
        const lhText = [lh[0] || '', lh[1] || ''].filter(Boolean).join(',');
        const noteCode = `(${rhText})/(${lhText})`;
        // 如果有琶音标记，在音符列前添加'~'
        return sub.hasArpeggio ? `~${noteCode}` : noteCode;
      });
      return subStrings.join('+');
    });

    const content = beatStrings.join('|');
    return `[${content}]`;
  },

  // 将单个notation转换为完整module代码（保留行数与每行小节数，支持占位拍标记）
  buildModuleCodeFromNotation(notation) {
    if (!notation) return '';
    const perRow = this.getMeasuresPerRowForNotation(notation) || 1;
    const measures = Array.isArray(notation.measures) ? notation.measures : [];
    const lines = [];
    for (let i = 0; i < measures.length; i += perRow) {
      const slice = measures.slice(i, i + perRow);
      const line = slice.map(m => this.buildMeasureCode(m)).join('');
      
      // 【新增】检查并生成占位拍标记
      const placeholderCount = this.countLinePlaceholderBeats(slice);
      const placeholderMark = placeholderCount > 0 ? `#${placeholderCount}` : '';
      
      lines.push(line + placeholderMark);
    }
    // 支持备注格式
    const remarkPart = notation.remark ? `{${notation.remark}}` : '';
    return `\\begin{module}{${notation.label}}${remarkPart}\n${lines.join('\\\\\n')}\n\\end{module}`;
  },

  // 当用户点击导出按钮时，才提取导出代码（延迟加载）
  showExportCode() {
    const code = this.generateModuleExportCode();
    this.setData({
      exportModuleCode: code
    });
  },

  // 打开模块设置模态框
  openModuleSettings(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const notation = this.data.notations.find(n => n.id === id);
    
    if (!notation) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }

    // 继承全局拍号设定（包括模板数据）；统一将 3/4、4/4 视作"自由设定"模板
    const globalCustom = wx.getStorageSync('customTimeSignature') || {};
    const defaultTemplate = globalCustom.template || '';
    const isGlobalCustom = this.data.currentTimeSignatureType === 'custom';
    // 如果模块是以自定义方式保存，但模板正好等于标准4/4或3/4模板，则在UI上仍显示为4或3，保持界面不变
    const tpl4 = this.convertBeatsCountToTemplate(4);
    const tpl3 = this.convertBeatsCountToTemplate(3);
    const inferredTemplate = this.inferTemplateFromNotation(notation);
    const isStandardTpl = inferredTemplate === tpl4 || inferredTemplate === tpl3;
    const beatCountFromData = (notation.measures && notation.measures[0] && notation.measures[0].beats) ? notation.measures[0].beats.length : (this.data.timeSignatureBeats || 4);
    const allFourSubs = (notation.measures || []).every(m => (m.beats || []).every(b => Array.isArray(b.subdivisions) && b.subdivisions.length === 4));

    let showBeats;
    if (notation.moduleTimeSignature === 'custom') {
      showBeats = (notation.moduleCustomTemplate === tpl4) ? 4 : (notation.moduleCustomTemplate === tpl3 ? 3 : 'custom');
    } else if (!isStandardTpl || !allFourSubs || beatCountFromData !== (this.data.timeSignatureBeats || 4)) {
      showBeats = 'custom';
    } else {
      showBeats = isGlobalCustom ? 'custom' : this.data.timeSignatureBeats;
    }

    const moduleTemplate = showBeats === 'custom'
      ? (notation.moduleCustomTemplate || inferredTemplate || defaultTemplate)
      : (notation.moduleCustomTemplate || defaultTemplate);

    const perRow = notation.measuresPerRow || this.getMeasuresPerRowForNotation(notation) || 1;
    // 计算行数时考虑横竖屏模式：横屏模式下行数显示为竖屏的一半
    const isLandscape = this.data.orientation === 'landscape';
    const rawLineCount = Math.max(1, Math.ceil(((notation.measures || []).length || 0) / perRow));
    const lineCount = isLandscape ? Math.max(1, Math.ceil(rawLineCount / 2)) : rawLineCount;

    // 获取样式设置的当前值（存储的是竖屏基准值）
    const style = notation.style || {};
    const gs = this.getGlobalStyleDefaults();
    let storedMeasureHeight = style.measureHeight || gs.measureHeight;
    let storedNoteFontSize = style.noteFontSize || gs.noteFontSize;
    let storedLineSpacing = style.lineSpacing || gs.lineSpacing;

    // 横竖屏切换时，始终以竖屏基准值为源，横屏显示时自动缩放
    const scaleRatio = 18 / 28; // 横屏缩放比例
    let measureHeight = storedMeasureHeight;
    let noteFontSize = storedNoteFontSize;
    let lineSpacing = storedLineSpacing;
    if (isLandscape) {
      measureHeight = Math.round(storedMeasureHeight * scaleRatio);
      noteFontSize = Math.round(storedNoteFontSize * scaleRatio);
      lineSpacing = Math.round(storedLineSpacing * scaleRatio);
    }

    // 计算全局默认值用于模块设置弹窗提示
    const gsMH = isLandscape ? Math.round(gs.measureHeight * scaleRatio) : gs.measureHeight;
    const gsNF = isLandscape ? Math.round(gs.noteFontSize * scaleRatio) : gs.noteFontSize;
    const gsLS = isLandscape ? Math.round(gs.lineSpacing * scaleRatio) : gs.lineSpacing;

    this.setData({
      showModuleSettingsModal: true,
      currentModuleId: id,
      moduleLineCount: lineCount,
      moduleMeasureHeight: measureHeight,
      moduleNoteFontSize: noteFontSize,
      moduleLineSpacing: lineSpacing,
      moduleMeasureHeightError: '',
      moduleNoteFontSizeError: '',
      moduleLineSpacingError: '',
      moduleDefaultMeasureHeight: gsMH,
      moduleDefaultNoteFontSize: gsNF,
      moduleDefaultLineSpacing: gsLS,
      moduleTimeSignatureBeats: showBeats,
      moduleCustomTemplate: moduleTemplate,
      exportModuleCode: '' // 打开模态框时不立即生成代码
    });
  },

  // 复制导出代码到剪贴板
  copyModuleCode() {
    const code = this.data.exportModuleCode;
    if (!code) {
      wx.showToast({ title: '无法生成代码', icon: 'none' });
      return;
    }

    wx.setClipboardData({
      data: code,
      success() {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 2000
        });
      },
      fail() {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 恢复模块拍号设置到默认值（保留样式）
  resetModuleTimeSignature() {
    const defaultTimeSignature = this.data.timeSignatureBeats;
    const defaultLineCount = 4; // 恢复到默认4行

    const { currentModuleId } = this.data;
    if (!currentModuleId) {
      // 仅恢复输入框的默认值
      this.setData({
        moduleLineCount: defaultLineCount,
        moduleLineCountError: '',
        moduleTimeSignatureBeats: defaultTimeSignature,
        moduleCustomTemplate: '',
        moduleCustomTemplateError: ''
      });
      wx.showToast({ title: '已恢复默认设置', icon: 'success' });
      return;
    }

    const updated = JSON.parse(JSON.stringify(this.data.notations));
    const notation = updated.find(n => n.id === currentModuleId);
    if (!notation) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }

    const isCustom = this.data.currentTimeSignatureType === 'custom';
    let template = '';
    if (isCustom) {
      const custom = wx.getStorageSync('customTimeSignature') || {};
      template = custom.template || '';
    } else {
      const beatsCount = this.data.timeSignatureBeats || 4;
      template = this.convertBeatsCountToTemplate(beatsCount);
    }
    
    // 统一使用模板方式生成小节
    notation.measures = Array.from({ length: defaultLineCount }).map(() => this.createMeasureFromCustomTemplate(template));
    notation.moduleTimeSignature = undefined;
    notation.moduleCustomTemplate = undefined;
    notation.timeSignature = isCustom ? '自由/自由' : `${this.data.timeSignatureBeats || 4}/4`;

    const withOffsets = this.updateMeasureOffsets(updated);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.closeModuleSettingsModal();
    wx.showToast({ title: '已恢复默认拍号', icon: 'success' });
  },

  // 行数输入变化（实时保存，不验证）
  onModuleLineCountInput(e) {
    const count = e.detail.value;
    this.setData({ moduleLineCount: count, moduleLineCountError: '' });
  },

  // 确认行数（失焦或回车时验证）
  confirmModuleLineCount(e) {
    const count = parseInt(this.data.moduleLineCount) || 0;
    
    if (!count || count < 1 || count > 20) {
      this.setData({ moduleLineCountError: '请输入1-20之间的整数' });
      return;
    }
    
    this.setData({ moduleLineCountError: '' });
  },

  // 选择模块拍号
  selectModuleTimeSignature(e) {
    const value = e.currentTarget.dataset.value;
    if (value === 'custom') {
      // 选择“自由”时，自动填充全局模板作为默认
      const globalCustom = wx.getStorageSync('customTimeSignature') || {};
      const defaultTemplate = globalCustom.template || this.data.moduleCustomTemplate || '';
      this.setData({ 
        moduleTimeSignatureBeats: 'custom',
        moduleCustomTemplate: defaultTemplate,
        moduleCustomTemplateError: ''
      });
    } else {
      this.setData({ 
        moduleTimeSignatureBeats: parseInt(value),
        moduleCustomTemplate: '',
        moduleCustomTemplateError: ''
      });
    }
  },

  // 模块自定义模板输入变化（使用实例变量避免输入回退）
  onModuleCustomTemplateInput(e) {
    const template = e.detail.value;
    this._moduleCustomTemplate = template;
    // 实时验证（仅更新错误状态）
    this.validateModuleCustomTemplate(template);
  },

  // 验证模块自定义模板
  validateModuleCustomTemplate(template) {
    let error = '';
    
    if (!template) {
      error = '';
    } else if (!/^[\[\]\|\\-]+$/.test(template)) {
      error = '只能包含 [ ] | - 四种符号';
    } else if ((template.match(/-/g) || []).length > 35) {
      error = '音符位"-"不能超过35个';
    } else if (!template.startsWith('[') || !template.endsWith(']')) {
      error = '必须以"["开始，"]"结束';
    }
    
    // 仅在错误状态变化时更新，避免输入回退
    if (this.data.moduleCustomTemplateError !== error) {
      this.setData({ moduleCustomTemplateError: error });
    }
    return error === '';
  },

  // 恢复模块默认样式设置
  resetModuleSettings() {
    const { currentModuleId } = this.data;
    
    if (!currentModuleId) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }

    const updated = JSON.parse(JSON.stringify(this.data.notations));
    const notation = updated.find(n => n.id === currentModuleId);
    
    if (!notation) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }

    // 仅重置样式为全局默认设置
    const gs = this.getGlobalStyleDefaults();
    notation.style = {
      measureHeight: gs.measureHeight,
      noteFontSize: gs.noteFontSize,
      lineSpacing: gs.lineSpacing
    };

    const normalized = this.normalizeBarLines(updated);
    const withOffsets = this.updateMeasureOffsets(normalized);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    
    // 重新打开设置界面以显示默认值
    this.openModuleSettings({ currentTarget: { dataset: { id: currentModuleId } } });
    
    wx.showToast({ title: '已恢复默认样式', icon: 'success' });
  },

  // 应用模块设置（仅应用样式设置，不再影响谱面结构）
  applyModuleSettings() {
    const { 
      currentModuleId, 
      moduleMeasureHeight,
      moduleNoteFontSize,
      moduleLineSpacing
    } = this.data;

    // 根据横竖屏模式确定验证范围（按18/28缩放）
    const isLandscape = this.data.orientation === 'landscape';
    const heightMin = isLandscape ? 51 : 80;
    const heightMax = isLandscape ? 193 : 300;
    const fontMin = isLandscape ? 9 : 14;
    const fontMax = isLandscape ? 32 : 50;
    const spacingMin = isLandscape ? 19 : 30;
    const spacingMax = isLandscape ? 96 : 150;

    // 验证样式参数
    if (isNaN(moduleMeasureHeight) || moduleMeasureHeight < heightMin || moduleMeasureHeight > heightMax) {
      this.setData({ moduleMeasureHeightError: `单行高度请输入${heightMin}-${heightMax}之间的数值` });
      return;
    }
    if (isNaN(moduleNoteFontSize) || moduleNoteFontSize < fontMin || moduleNoteFontSize > fontMax) {
      this.setData({ moduleNoteFontSizeError: `音符字体大小请输入${fontMin}-${fontMax}之间的数值` });
      return;
    }
    if (isNaN(moduleLineSpacing) || moduleLineSpacing < spacingMin || moduleLineSpacing > spacingMax) {
      this.setData({ moduleLineSpacingError: `行间距请输入${spacingMin}-${spacingMax}之间的数值` });
      return;
    }
    
    if (!currentModuleId) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }

    // Quick Win: 使用浅拷贝 + 仅深拷贝修改的模块
    const notationIndex = this.data.notations.findIndex(n => n.id === currentModuleId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到模块', icon: 'none' });
      return;
    }
    
    const updated = this.shallowCloneNotations(this.data.notations);
    // 仅对要修改的notation进行深拷贝
    updated[notationIndex] = this.deepCloneNotation(updated[notationIndex]);
    const notation = updated[notationIndex];

    // 横屏模式下需要将用户输入的值转换回竖屏基准值存储
    // 横屏输入值 * 28/18 = 竖屏存储值（反向缩放）
    const reverseScaleRatio = 28 / 18; // 反向缩放比例
    const storedMeasureHeight = isLandscape ? Math.round(moduleMeasureHeight * reverseScaleRatio) : moduleMeasureHeight;
    const storedNoteFontSize = isLandscape ? Math.round(moduleNoteFontSize * reverseScaleRatio) : moduleNoteFontSize;
    const storedLineSpacing = isLandscape ? Math.round(moduleLineSpacing * reverseScaleRatio) : moduleLineSpacing;

    // 仅应用样式设置（存储竖屏基准值），不影响谱面结构
    if (!notation.style) {
      notation.style = {};
    }
    notation.style.measureHeight = storedMeasureHeight;
    notation.style.noteFontSize = storedNoteFontSize;
    notation.style.lineSpacing = storedLineSpacing;

    const normalized = this.normalizeBarLines(updated);
    const withOffsets = this.updateMeasureOffsets(normalized);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.closeModuleSettingsModal();
    wx.showToast({ title: '样式已修改', icon: 'success' });
  },

  // 应用模块级拍号设置
  applyModuleTimeSignature(notation, beats, forceApplyAll = false, customTemplate = '') {
    // 处理自定义模板的情况
    if (beats === 'custom' && customTemplate) {
      const sanitizedTemplate = this.sanitizeTemplateString(customTemplate);
      const templateMeasures = this.splitTemplateIntoMeasures(sanitizedTemplate);
      const defaultParsed = this.parseCustomTemplate(sanitizedTemplate);
      const defaultBeatStructure = defaultParsed.beatStructure;
      
      // 应用自定义模板结构到所有行，保留原有数据
      notation.measures = notation.measures.map((measure, measureIdx) => {
        // 如果模板含多小节，则按索引选择对应小节模板，否则使用默认
        const tplForMeasure = templateMeasures.length
          ? templateMeasures[measureIdx % templateMeasures.length]
          : sanitizedTemplate;
        const parsed = this.parseCustomTemplate(tplForMeasure);
        const beatStructure = parsed.beatStructure && parsed.beatStructure.length > 0
          ? parsed.beatStructure
          : defaultBeatStructure;

        return {
          beats: beatStructure.map((beat, beatIdx) => {
            const oldBeat = measure.beats && measure.beats[beatIdx];
            
            return {
              subdivisions: Array.from({ length: beat.noteCount }).map((_, subIdx) => {
                // 尝试保留原有数据
                if (oldBeat && oldBeat.subdivisions && oldBeat.subdivisions[subIdx]) {
                  return oldBeat.subdivisions[subIdx];
                }
                // 如果没有原数据，创建空数据
                return { rightHand: ['', ''], leftHand: ['', ''] };
              }),
              barLineAfter: beat.barLineAfter
            };
          })
        };
      });
      
      notation.moduleTimeSignature = 'custom';
      notation.moduleCustomTemplate = sanitizedTemplate;
      notation.timeSignature = '自由/自由';
      const groupCount = this.countBracketGroups(customTemplate);
      // 仅当模板明确包含多个小节分组时才更新每行小节数；否则保留现有设置
      if (groupCount > 1) {
        notation.measuresPerRow = groupCount;
      } else if (!notation.measuresPerRow) {
        notation.measuresPerRow = this.getMeasuresPerRowForNotation(notation) || this.data.measuresPerRow || 1;
      }
      return;
    }

    // 处理标准拍号（4/4、3/4）- beats 为 3 或 4
    let newBeatsCount = parseInt(beats);
    
    const currentBeatsCount = notation.measures.length > 0 
      ? notation.measures[0].beats.length 
      : 4;

    // 总是强制应用：模块级拍号改变时，所有行都要更新
    if (newBeatsCount !== currentBeatsCount || forceApplyAll) {
      notation.measures = notation.measures.map((measure, idx) => {
        let newBeats;
        
        if (newBeatsCount > currentBeatsCount) {
          // 增加拍数：在末尾添加
          newBeats = [
            ...measure.beats.map(beat => beat), // 保留原有拍数
          ];
          const addCount = newBeatsCount - currentBeatsCount;
          for (let i = 0; i < addCount; i++) {
            newBeats.push({
              subdivisions: Array.from({ length: 4 }).map(() => ({
                rightHand: ['', ''],
                leftHand: ['', '']
              }))
            });
          }
        } else if (newBeatsCount < currentBeatsCount) {
          // 减少拍数：删除末尾拍数
          newBeats = measure.beats.slice(0, newBeatsCount);
        } else {
          // 拍数相同，保留原有数据
          newBeats = measure.beats.map((beat, beatIdx) => {
            // 确保每个 subdivision 的左右手数组长度正确，但不强制为4个 subdivision
            const normalizedSubs = (beat.subdivisions && beat.subdivisions.length > 0
              ? beat.subdivisions
              : [{ rightHand: ['', ''], leftHand: ['', ''] }]
            ).map(sub => ({
              rightHand: Array.isArray(sub.rightHand)
                ? [sub.rightHand[0] || '', sub.rightHand[1] || '']
                : ['', ''],
              leftHand: Array.isArray(sub.leftHand)
                ? [sub.leftHand[0] || '', sub.leftHand[1] || '']
                : ['', '']
            }));

            return { subdivisions: normalizedSubs };
          });
        }
        
        return {
          ...measure,
          beats: newBeats
        };
      });
    }

    // 记录模块级拍号设置
    notation.moduleTimeSignature = beats;
    notation.timeSignature = `${beats}/4`;
    notation.moduleCustomTemplate = undefined; // 清除自定义模板标记
    if (!notation.measuresPerRow) {
      notation.measuresPerRow = this.data.measuresPerRow || 1;
    }
  },

  // 输入模块单行高度
  onModuleMeasureHeightInput(e) {
    const value = parseInt(e.detail.value);
    const isLandscape = this.data.orientation === 'landscape';
    // 横屏模式下验证范围按18/28缩放：80*18/28≈51, 300*18/28≈193
    const minVal = isLandscape ? 51 : 80;
    const maxVal = isLandscape ? 193 : 300;
    let error = '';
    if (isNaN(value) || value < minVal || value > maxVal) {
      error = `请输入${minVal}-${maxVal}之间的数值`;
    }
    this.setData({
      moduleMeasureHeight: value,
      moduleMeasureHeightError: error
    });
  },

  // 确认模块单行高度
  confirmModuleMeasureHeight() {
    const value = this.data.moduleMeasureHeight;
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 51 : 80;
    const maxVal = isLandscape ? 193 : 300;
    if (isNaN(value) || value < minVal || value > maxVal) {
      this.setData({ moduleMeasureHeightError: `请输入${minVal}-${maxVal}之间的数值` });
      return;
    }
    this.setData({ moduleMeasureHeightError: '' });
  },

  // 输入模块音符字体大小
  onModuleNoteFontSizeInput(e) {
    const value = parseInt(e.detail.value);
    const isLandscape = this.data.orientation === 'landscape';
    // 横屏模式下验证范围按18/28缩放：14*18/28≈9, 50*18/28≈32
    const minVal = isLandscape ? 9 : 14;
    const maxVal = isLandscape ? 32 : 50;
    let error = '';
    if (isNaN(value) || value < minVal || value > maxVal) {
      error = `请输入${minVal}-${maxVal}之间的数值`;
    }
    this.setData({
      moduleNoteFontSize: value,
      moduleNoteFontSizeError: error
    });
  },

  // 确认模块音符字体大小
  confirmModuleNoteFontSize() {
    const value = this.data.moduleNoteFontSize;
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 9 : 14;
    const maxVal = isLandscape ? 32 : 50;
    if (isNaN(value) || value < minVal || value > maxVal) {
      this.setData({ moduleNoteFontSizeError: `请输入${minVal}-${maxVal}之间的数值` });
      return;
    }
    this.setData({ moduleNoteFontSizeError: '' });
  },

  // 输入模块行间距
  onModuleLineSpacingInput(e) {
    const value = parseInt(e.detail.value);
    const isLandscape = this.data.orientation === 'landscape';
    // 横屏模式下验证范围按18/28缩放：30*18/28≈19, 150*18/28≈96
    const minVal = isLandscape ? 19 : 30;
    const maxVal = isLandscape ? 96 : 150;
    let error = '';
    if (isNaN(value) || value < minVal || value > maxVal) {
      error = `请输入${minVal}-${maxVal}之间的数值`;
    }
    this.setData({
      moduleLineSpacing: value,
      moduleLineSpacingError: error
    });
  },

  // 确认模块行间距
  confirmModuleLineSpacing() {
    const value = this.data.moduleLineSpacing;
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 19 : 30;
    const maxVal = isLandscape ? 96 : 150;
    if (isNaN(value) || value < minVal || value > maxVal) {
      this.setData({ moduleLineSpacingError: `请输入${minVal}-${maxVal}之间的数值` });
      return;
    }
    this.setData({ moduleLineSpacingError: '' });
  },

  // ============ 全局排版设置 ============

  getGlobalStyleDefaults() {
    const gs = this.data.globalStylePortrait || {};
    return {
      measureHeight: gs.measureHeight || 160,
      noteFontSize: gs.noteFontSize || 28,
      lineSpacing: gs.lineSpacing || 65
    };
  },

  openGlobalLayoutModal() {
    const isLandscape = this.data.orientation === 'landscape';
    const scaleRatio = 18 / 28;
    const gs = this.getGlobalStyleDefaults();

    const measureHeight = isLandscape ? Math.round(gs.measureHeight * scaleRatio) : gs.measureHeight;
    const noteFontSize = isLandscape ? Math.round(gs.noteFontSize * scaleRatio) : gs.noteFontSize;
    const lineSpacing = isLandscape ? Math.round(gs.lineSpacing * scaleRatio) : gs.lineSpacing;

    this.setData({
      showGlobalLayoutModal: true,
      showLayoutMenu: false,
      globalMeasureHeight: measureHeight,
      globalNoteFontSize: noteFontSize,
      globalLineSpacing: lineSpacing,
      globalMeasureHeightError: '',
      globalNoteFontSizeError: '',
      globalLineSpacingError: ''
    });
  },

  closeGlobalLayoutModal() {
    this.setData({ showGlobalLayoutModal: false });
  },

  onGlobalMeasureHeightInput(e) {
    const value = parseInt(e.detail.value, 10);
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 51 : 80;
    const maxVal = isLandscape ? 193 : 300;
    let error = '';
    if (e.detail.value !== '' && (isNaN(value) || value < minVal || value > maxVal)) {
      error = `请输入${minVal}-${maxVal}之间的数值`;
    }
    this.setData({ globalMeasureHeight: value, globalMeasureHeightError: error });
  },

  confirmGlobalMeasureHeight() {
    const value = this.data.globalMeasureHeight;
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 51 : 80;
    const maxVal = isLandscape ? 193 : 300;
    if (isNaN(value) || value < minVal || value > maxVal) {
      this.setData({ globalMeasureHeightError: `请输入${minVal}-${maxVal}之间的数值` });
      return;
    }
    this.setData({ globalMeasureHeightError: '' });
  },

  onGlobalNoteFontSizeInput(e) {
    const value = parseInt(e.detail.value, 10);
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 9 : 14;
    const maxVal = isLandscape ? 32 : 50;
    let error = '';
    if (e.detail.value !== '' && (isNaN(value) || value < minVal || value > maxVal)) {
      error = `请输入${minVal}-${maxVal}之间的数值`;
    }
    this.setData({ globalNoteFontSize: value, globalNoteFontSizeError: error });
  },

  confirmGlobalNoteFontSize() {
    const value = this.data.globalNoteFontSize;
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 9 : 14;
    const maxVal = isLandscape ? 32 : 50;
    if (isNaN(value) || value < minVal || value > maxVal) {
      this.setData({ globalNoteFontSizeError: `请输入${minVal}-${maxVal}之间的数值` });
      return;
    }
    this.setData({ globalNoteFontSizeError: '' });
  },

  onGlobalLineSpacingInput(e) {
    const value = parseInt(e.detail.value, 10);
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 19 : 30;
    const maxVal = isLandscape ? 96 : 150;
    let error = '';
    if (e.detail.value !== '' && (isNaN(value) || value < minVal || value > maxVal)) {
      error = `请输入${minVal}-${maxVal}之间的数值`;
    }
    this.setData({ globalLineSpacing: value, globalLineSpacingError: error });
  },

  confirmGlobalLineSpacing() {
    const value = this.data.globalLineSpacing;
    const isLandscape = this.data.orientation === 'landscape';
    const minVal = isLandscape ? 19 : 30;
    const maxVal = isLandscape ? 96 : 150;
    if (isNaN(value) || value < minVal || value > maxVal) {
      this.setData({ globalLineSpacingError: `请输入${minVal}-${maxVal}之间的数值` });
      return;
    }
    this.setData({ globalLineSpacingError: '' });
  },

  resetGlobalLayout() {
    const isLandscape = this.data.orientation === 'landscape';
    const scaleRatio = 18 / 28;
    const measureHeight = isLandscape ? Math.round(160 * scaleRatio) : 160;
    const noteFontSize = isLandscape ? Math.round(28 * scaleRatio) : 28;
    const lineSpacing = isLandscape ? Math.round(65 * scaleRatio) : 65;

    this.setData({
      globalMeasureHeight: measureHeight,
      globalNoteFontSize: noteFontSize,
      globalLineSpacing: lineSpacing,
      globalMeasureHeightError: '',
      globalNoteFontSizeError: '',
      globalLineSpacingError: ''
    });
  },

  applyGlobalLayout() {
    const {
      globalMeasureHeight,
      globalNoteFontSize,
      globalLineSpacing
    } = this.data;

    const isLandscape = this.data.orientation === 'landscape';
    const heightMin = isLandscape ? 51 : 80;
    const heightMax = isLandscape ? 193 : 300;
    const fontMin = isLandscape ? 9 : 14;
    const fontMax = isLandscape ? 32 : 50;
    const spacingMin = isLandscape ? 19 : 30;
    const spacingMax = isLandscape ? 96 : 150;

    if (isNaN(globalMeasureHeight) || globalMeasureHeight < heightMin || globalMeasureHeight > heightMax) {
      this.setData({ globalMeasureHeightError: `单行高度请输入${heightMin}-${heightMax}之间的数值` });
      return;
    }
    if (isNaN(globalNoteFontSize) || globalNoteFontSize < fontMin || globalNoteFontSize > fontMax) {
      this.setData({ globalNoteFontSizeError: `音符字号请输入${fontMin}-${fontMax}之间的数值` });
      return;
    }
    if (isNaN(globalLineSpacing) || globalLineSpacing < spacingMin || globalLineSpacing > spacingMax) {
      this.setData({ globalLineSpacingError: `行间距请输入${spacingMin}-${spacingMax}之间的数值` });
      return;
    }

    const reverseScaleRatio = 28 / 18;
    const storedMeasureHeight = isLandscape ? Math.round(globalMeasureHeight * reverseScaleRatio) : globalMeasureHeight;
    const storedNoteFontSize = isLandscape ? Math.round(globalNoteFontSize * reverseScaleRatio) : globalNoteFontSize;
    const storedLineSpacing = isLandscape ? Math.round(globalLineSpacing * reverseScaleRatio) : globalLineSpacing;

    const newGlobalStyle = {
      measureHeight: storedMeasureHeight,
      noteFontSize: storedNoteFontSize,
      lineSpacing: storedLineSpacing
    };

    // 保存旧全局样式用于比较（setData后this.data会被更新）
    const oldGlobalStyle = { ...this.data.globalStylePortrait };

    this.setData({
      globalStylePortrait: newGlobalStyle
    });

    // 将全局样式应用到所有未自定义样式的模块（与旧全局样式比较）
    const updated = this.data.notations.map(notation => {
      const clone = JSON.parse(JSON.stringify(notation));
      const style = clone.style || {};
      const hasCustomStyle = this._moduleHasCustomStyle(style, oldGlobalStyle);
      if (!hasCustomStyle) {
        clone.style = {
          measureHeight: storedMeasureHeight,
          noteFontSize: storedNoteFontSize,
          lineSpacing: storedLineSpacing
        };
      }
      return clone;
    });

    const normalized = this.normalizeBarLines(updated);
    const withOffsets = this.updateMeasureOffsets(normalized);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);

    this.saveGlobalStyle();
    this.closeGlobalLayoutModal();
    this.markNotationChanged();
    wx.showToast({ title: '全局排版已应用', icon: 'success' });
  },

  _moduleHasCustomStyle(moduleStyle, oldGlobalStyle) {
    if (!moduleStyle) return false;
    const gs = oldGlobalStyle || { measureHeight: 160, noteFontSize: 28, lineSpacing: 65 };
    const mh = moduleStyle.measureHeight || 160;
    const nf = moduleStyle.noteFontSize || 28;
    const ls = moduleStyle.lineSpacing || 65;
    return mh !== (gs.measureHeight || 160) || nf !== (gs.noteFontSize || 28) || ls !== (gs.lineSpacing || 65);
  },

  saveGlobalStyle() {
    const gs = this.data.globalStylePortrait || {};
    wx.setStorageSync('globalStylePortrait', gs);
  },

  loadGlobalStyle() {
    const stored = wx.getStorageSync('globalStylePortrait');
    if (stored && typeof stored === 'object') {
      this.setData({
        globalStylePortrait: {
          measureHeight: stored.measureHeight || 160,
          noteFontSize: stored.noteFontSize || 28,
          lineSpacing: stored.lineSpacing || 65
        }
      });
    }
  },

  // 同步 barLineAfter 标记与当前模板（根据模块或全局拍号）
  syncBarLineAfterWithTemplate(notation) {
    if (!notation.measures) return;
    
    // 判断当前模块是自定义拍号还是标准拍号
    const isModuleCustom = notation.moduleTimeSignature === 'custom';
    const isGlobalCustom = this.data.currentTimeSignatureType === 'custom';
    
    let template = '';
    if (isModuleCustom && notation.moduleCustomTemplate) {
      template = notation.moduleCustomTemplate;
    } else if (!isModuleCustom && isGlobalCustom) {
      const custom = wx.getStorageSync('customTimeSignature') || {};
      template = custom.template || '';
    }
    
    // 如果当前是自定义拍号模式且有模板，根据模板重新设置 barLineAfter
    if ((isModuleCustom || isGlobalCustom) && template) {
      const parsed = this.parseCustomTemplate(template);
      const expectedBarLineAfter = parsed.beatStructure.map(b => b.barLineAfter);
      
      notation.measures.forEach(measure => {
        if (measure.beats) {
          measure.beats.forEach((beat, beatIdx) => {
            // 按模板设置 barLineAfter
            if (beatIdx < expectedBarLineAfter.length) {
              beat.barLineAfter = expectedBarLineAfter[beatIdx] || false;
            } else {
              beat.barLineAfter = false;
            }
          });
        }
      });
    } else {
      // 标准拍号模式：清除所有 barLineAfter 标记
      notation.measures.forEach(measure => {
        if (measure.beats) {
          measure.beats.forEach(beat => {
            beat.barLineAfter = false;
          });
        }
      });
    }
  },

  // 获取自定义拍号的存储键
  // 解析自由模板，返回拍的结构信息及小节线位置
  // 输入: "[----|--][---|---]"
  // 输出: {
  //   beatStructure: [{ noteCount: 4, barLineAfter: false }, { noteCount: 2, barLineAfter: true }, ...],
  //   totalBeats: 4
  // }
  parseCustomTemplate(template) {
    const sanitized = this.sanitizeTemplateString(template);
    if (!sanitized) return { beatStructure: [{ noteCount: 4 }, { noteCount: 4 }], totalBeats: 2 };

    // 移除两端的方括号
    const cleaned = sanitized.replace(/^\[|\]$/g, '');
    const sections = cleaned.split('][');
    
    const beatStructure = [];
    let beatIndex = 0;
    
    sections.forEach((section, sectionIndex) => {
      // 每个section中，| 分割各拍
      const parts = section.split('|');
      parts.forEach((part, partIndex) => {
        // 计算每拍中的 - 数量（每个 - 代表一个音位）
        const noteCount = (part.match(/-/g) || []).length;
        if (noteCount > 0) {
          beatStructure.push({
            noteCount,
            barLineAfter: sectionIndex < sections.length - 1 && partIndex === parts.length - 1
          });
          beatIndex++;
        }
      });
    });
    
    return {
      beatStructure: beatStructure.length > 0 ? beatStructure : [{ noteCount: 4 }, { noteCount: 4 }],
      totalBeats: beatIndex > 0 ? beatIndex : 2
    };
  },

  getNotationStorageKeyForCustom() {
    const customTimeSignature = wx.getStorageSync('customTimeSignature') || {};
    const noteCount = customTimeSignature.noteCount || 4;
    return `notations_custom_${noteCount}`;
  },

  // 解析自定义模板，生成占位符小节
  createMeasureFromCustomTemplate(template) {
    // 移除小节线，分析拍号结构
    // 示例：[--|----|----|---] -> 拍1有2个音符位，拍2有4个，拍3有4个，拍4有3个
    if (!template || typeof template !== 'string') {
      return this.createEmptyMeasure();
    }

    // 解析模板获取每拍的结构信息
    const parsed = this.parseCustomTemplate(template);
    let beatStructure = parsed.beatStructure;
    if (!beatStructure || beatStructure.length === 0) {
      beatStructure = [{ noteCount: 4, barLineAfter: false }];
    }
    
    return {
      beats: beatStructure.map(beat => ({
        subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
          rightHand: ['', ''],
          leftHand: ['', '']
        })),
        barLineAfter: beat.barLineAfter
      }))
    };
  },

  // 应用拍号（切换到对应拍号的数据空间）
  applyTimeSignature(beatsCount) {
    // 转换为模板格式（统一处理：4/4 和 3/4 也作为自由设定模板）
    const template = this.convertBeatsCountToTemplate(beatsCount);
    
    // 存储为自由设定模式
    const customData = {
      type: 'custom',
      template: template,
      noteCount: beatsCount === 3 ? 12 : 16, // 3拍=12音符，4拍=16音符
      beatStructure: this.parseCustomTemplate(template).beatStructure
    };
    wx.setStorageSync('customTimeSignature', customData);
    wx.setStorageSync('timeSignatureBeats', beatsCount);
    
    // 切换本页拍号状态为自由设定
    this.setData({ 
      timeSignatureBeats: beatsCount,
      currentTimeSignatureType: 'custom'
    });
    
    // 读取对应拍号的数据，若不存在则初始化
    const key = this.getNotationStorageKey(beatsCount);
    let scoped = wx.getStorageSync(key);
    
    if (scoped && Array.isArray(scoped)) {
      // 数据存在，则更新所有现有模块的所有行为新拍号
      const migrated = scoped.map(notation => {
        // 为每个模块的每一行使用统一的模板化方式生成小节
        const newMeasures = notation.measures.map((measure, idx) => {
          // 保留第一个measure的示例数据（如果有），其他行清空
          if (idx === 0 && measure.beats && measure.beats.length > 0) {
            const newMeasure = this.createMeasureFromCustomTemplate(template);
            // 尝试保留原有的第一拍的示例数据
            const oldFirstBeat = measure.beats[0];
            if (oldFirstBeat && oldFirstBeat.subdivisions && oldFirstBeat.subdivisions[0] && newMeasure.beats[0]) {
              newMeasure.beats[0].subdivisions[0] = oldFirstBeat.subdivisions[0];
            }
            return newMeasure;
          }
          // 其他行为空白（使用模板）
          return this.createMeasureFromCustomTemplate(template);
        });
        
        return {
          ...notation,
          measures: newMeasures,
          timeSignature: beatsCount === 3 ? '3/4' : '4/4',
          moduleTimeSignature: undefined // 清除模块级设置
        };
      });
      
      const withOffsets = this.updateMeasureOffsets(migrated);
      
      // 【Bug修复】清除所有模块的临时图片路径，强制重新渲染Canvas
      const withClearedImages = withOffsets.map(notation => ({
        ...notation,
        tempImagePath: null,
        canvasHeight: this.calculateCanvasHeight(notation)
      }));
      
      this.saveNotationsScoped(withClearedImages);
      this.setNotations(withClearedImages);
      wx.showToast({ title: `已切换为 ${beatsCount}/4，所有模块已更新`, icon: 'none' });
      return;
    }
    
    // 初始化该拍号的默认谱面
    const initial = [ this.createNotation('A-1', true, beatsCount), this.createNotation('A-2', false, beatsCount) ];
    const withOffsets = this.updateMeasureOffsets(initial);
    
    // 【Bug修复】清除所有模块的临时图片路径，强制重新渲染Canvas
    const withClearedImages = withOffsets.map(notation => ({
      ...notation,
      tempImagePath: null,
      canvasHeight: this.calculateCanvasHeight(notation)
    }));
    
    this.saveNotationsScoped(withClearedImages);
    this.setNotations(withClearedImages);
  },

  // 初始化屏幕方向监听
  initOrientationListener() {
    const that = this;
    wx.onWindowResize(() => {
      if (this.data.manualOrientation) return; // 用户手动选择时不自动改写排版
      const windowInfo = wx.getWindowInfo();
      const newOrientation = windowInfo.windowHeight > windowInfo.windowWidth ? 'portrait' : 'landscape';
      that.updateOrientation(newOrientation);
    });
    // 无论当前窗口方向如何，小程序重新启动时始终初始化为竖屏模式
    // 这可以避免横屏模式下退出后重新进入时布局错乱
    this.forcePortraitOnInit();
  },

  // 强制初始化为竖屏模式（小程序启动时调用）
  // 确保所有notation的measuresPerRow都是竖屏基准值，避免横屏模式下退出后重新进入时布局错乱
  forcePortraitOnInit() {
    // 重置manualOrientation标志，允许后续手动切换
    this.setData({ manualOrientation: false });
    
    // 无论orientation状态如何，都需要检查并校正每个notation的measuresPerRow
    // 因为存储的数据可能是横屏模式下的翻倍值
    const notations = this.data.notations || [];
    let needsUpdate = false;
    
    const updatedNotations = notations.map(n => {
      // 检查是否有保存的竖屏基准值
      if (n.measuresPerRowPortrait && n.measuresPerRow !== n.measuresPerRowPortrait) {
        // 如果measuresPerRow不等于竖屏基准值，说明是横屏模式下的值，需要恢复
        needsUpdate = true;
        return {
          ...n,
          measuresPerRow: n.measuresPerRowPortrait
        };
      }
      // 如果measuresPerRow大于1且没有保存竖屏基准值，可能是横屏模式遗留
      // 保守处理：检查是否是偶数且大于1，可能需要除以2
      if (!n.measuresPerRowPortrait && n.measuresPerRow > 1 && n.measuresPerRow % 2 === 0) {
        // 假设竖屏模式下每行1个小节是默认值
        // 如果measuresPerRow是2，可能是横屏翻倍后的结果，恢复为1
        needsUpdate = true;
        const portraitBase = Math.max(1, Math.floor(n.measuresPerRow / 2));
        return {
          ...n,
          measuresPerRow: portraitBase,
          measuresPerRowPortrait: portraitBase
        };
      }
      return n;
    });

    if (needsUpdate || this.data.orientation !== 'portrait') {
      this.setData({
        orientation: 'portrait',
        notations: updatedNotations
      });
      // 同步保存修正后的数据
      this.saveNotationsScoped(updatedNotations);
      this.calculatePages();
    }
  },

  // 更新排版视角
  // 核心逻辑：横屏模式下将每行小节数翻倍（相当于将两行合并为一行显示）
  // 切换回竖屏时恢复原始的每行小节数设置
  updateOrientation(newOrientation) {
    const currentOrientation = this.data.orientation;
    if (newOrientation === currentOrientation) return;

    const toLandscape = newOrientation === 'landscape';
    
    // 更新每个notation的measuresPerRow
    // 先做一次数据规范化：确保每个notation的measures/beats/subdivisions具有预期结构
    const sanitizedNotations = (this.data.notations || []).map(n => {
      const copy = Object.assign({}, n);
      copy.measures = Array.isArray(n.measures) ? n.measures.map(measure => {
        const m = Object.assign({}, measure);
        m.beats = Array.isArray(measure.beats) ? measure.beats.map(beat => {
          const b = Object.assign({}, beat);
          b.subdivisions = Array.isArray(beat.subdivisions) ? beat.subdivisions.map(sub => {
            // 如果 subdivision 不是对象或缺少结构，修正为默认格式
            if (!sub || typeof sub !== 'object') return { rightHand: ['', ''], leftHand: ['', ''] };
            if (!Array.isArray(sub.rightHand)) sub.rightHand = [sub.rightHand || '', ''];
            if (!Array.isArray(sub.leftHand)) sub.leftHand = [sub.leftHand || '', ''];
            // 确保存在两个槽位
            sub.rightHand[0] = sub.rightHand[0] || '';
            sub.rightHand[1] = sub.rightHand[1] || '';
            sub.leftHand[0] = sub.leftHand[0] || '';
            sub.leftHand[1] = sub.leftHand[1] || '';
            return sub;
          }) : [ { rightHand: ['', ''], leftHand: ['', ''] } ];
          return b;
        }) : [];
        return m;
      }) : [];
      return copy;
    });

    const updatedNotations = (sanitizedNotations || []).map(n => {
      if (toLandscape) {
        // 切换到横屏：保存原始值，翻倍显示
        const portraitBase = n.measuresPerRowPortrait || n.measuresPerRow || 1;
        return {
          ...n,
          measuresPerRowPortrait: portraitBase, // 保存原始值
          measuresPerRow: portraitBase * 2 // 横屏显示翻倍
        };
      } else {
        // 切换回竖屏：恢复原始值
        const portraitBase = n.measuresPerRowPortrait || Math.floor(n.measuresPerRow / 2) || n.measuresPerRow || 1;
        return {
          ...n,
          measuresPerRow: portraitBase // 恢复为原始值
          // 保留measuresPerRowPortrait以便下次切换
        };
      }
    });

    // 【Bug修复】更新Canvas高度 - 所有模块都需要更新，不仅仅是collapsed
    // 因为切换排版时measuresPerRow变化会影响canvas高度计算
    // 同时清除tempImagePath，确保重新渲染（阅读模式下尤其重要）
    updatedNotations.forEach((n, idx) => {
      updatedNotations[idx] = {
        ...n,
        // 使用新的orientation进行高度计算
        canvasHeight: this.calculateCanvasHeight(n, newOrientation),
        // 【Bug修复】清除缓存的静态图片，确保用新布局重新渲染
        tempImagePath: null
      };
    });

    this.setData({
      orientation: newOrientation,
      notations: updatedNotations
    }, () => {
      // 【Bug修复】切换排版时需要完全重新初始化Canvas渲染器
      // 因为Canvas尺寸和布局都发生了变化
      this.reinitAllCanvasRenderers();
    });
    
    this.calculatePages();
  },
  
  /**
   * 【Bug修复】切换排版时重新初始化所有Canvas渲染器
   * 与refreshAllCanvasRenderers不同，此方法会销毁并重建所有渲染器
   */
  reinitAllCanvasRenderers() {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { notations, currentPageModules, orientation, rightHandColor, leftHandColor } = this.data;
    
    // 获取当前页面可见的modules
    const visibleModules = currentPageModules || notations.map((n, i) => ({ id: n.id, index: i }));
    
    console.log('[Canvas] 重新初始化所有Canvas渲染器，模块数量:', visibleModules.length);
    
    // 延迟执行，确保WXML已更新
    setTimeout(() => {
      visibleModules.forEach(({ id, index }, idx) => {
        const notation = notations[index];
        if (!notation) return;
        
        // 延迟初始化，避免同时初始化太多Canvas导致卡顿
        setTimeout(() => {
          // 销毁旧渲染器
          if (this._canvasRenderers[notation.id]) {
            this._canvasRenderers[notation.id].destroy();
            delete this._canvasRenderers[notation.id];
          }
          
          // 【Bug修复】使用带重试机制的方法重新初始化
          this.initCanvasRendererForModuleWithRetry(notation.id, index, 5);
        }, idx * 50);
      });
    }, 150);
  },

  // 请求横屏（调用系统方向锁定）
  requestLandscape() {
    // 先切换排版布局，保证在不支持强制横屏的环境也能看到横屏排版
    this.updateOrientation('landscape');
    // wx.setPreferredOrientation 在某些版本不可用，增加条件判断
    if (wx.setPreferredOrientation) {
      wx.setPreferredOrientation({
        orientation: 'landscape',
        success: () => {
          wx.showToast({ title: '已切换横屏', icon: 'success' });
        },
        fail: () => {
          wx.showToast({ title: '设备不支持强制横屏，已改为横屏排版', icon: 'none' });
        }
      });
    } else {
      wx.showToast({ title: '已切换横屏排版', icon: 'success' });
    }
  },

  // 请求竖屏
  requestPortrait() {
    // 先切换排版布局，保证在不支持强制竖屏的环境也能看到竖屏排版
    this.updateOrientation('portrait');
    // wx.setPreferredOrientation 在某些版本不可用，增加条件判断
    if (wx.setPreferredOrientation) {
      wx.setPreferredOrientation({
        orientation: 'portrait',
        success: () => {
          wx.showToast({ title: '已切换竖屏', icon: 'success' });
        },
        fail: () => {
          wx.showToast({ title: '设备不支持强制竖屏，已改为竖屏排版', icon: 'none' });
        }
      });
    } else {
      wx.showToast({ title: '已切换竖屏排版', icon: 'success' });
    }
  },

  // 显示旋转帮助
  showRotationHelp() {
    this.setData({ showRotationHelpModal: true });
  },

  // 关闭旋转帮助
  closeRotationHelp() {
    this.setData({ showRotationHelpModal: false });
  },

  // 显示拍号帮助
  showTimeSignatureHelp() {
    this.setData({ showTimeSignatureHelpModal: true });
  },

  // 关闭拍号帮助
  closeTimeSignatureHelp() {
    this.setData({ showTimeSignatureHelpModal: false });
  },

  // 打开视角选择器
  openOrientationPicker() {
    const that = this;
    wx.showActionSheet({
      itemList: ['手机竖屏（默认）', '手机横屏/平板模式'],
      success(res) {
        const newOrientation = res.tapIndex === 0 ? 'portrait' : 'landscape';
        that.setData({ manualOrientation: true });
        if (newOrientation === 'landscape') {
          that.requestLandscape();
        } else {
          that.requestPortrait();
        }
      }
    });
  },

  // 切换排版视角（竖屏↔横屏）
  toggleOrientation() {
    const newOrientation = this.data.orientation === 'portrait' ? 'landscape' : 'portrait';
    // 关闭布局菜单
    this.setData({ showLayoutMenu: false });
    if (newOrientation === 'landscape') {
      this.requestLandscape();
    } else {
      this.requestPortrait();
    }
  },

  // 编辑主标题
  editTitle() {
    // 使用实例变量存储临时值
    this._editValue = this.data.mainTitle;
    
    this.setData({
      showEditModal: true,
      editModalTitle: '编辑标题',
      editValue: this.data.mainTitle,
      editInputType: 'text',
      editPlaceholder: '输入记谱本标题',
      currentEdit: { type: 'title' }
    });
  },

  // 编辑副标题（打开副标题编辑弹窗）
  editSubTitle() {
    this.setData({
      showSubtitleEditModal: true,
      tempSubtitle: this.data.subTitle,
      tempComposer: this.data.composer,
      tempRootNote: this.data.rootNote,
      tempScaleType: this.data.scaleType,
      tempNoteCount: this.data.noteCount
    });
  },
  
  // 副标题输入事件
  onTempSubtitleInput(e) {
    this.setData({ tempSubtitle: e.detail.value });
  },
  
  // 制谱人输入事件
  onTempComposerInput(e) {
    this.setData({ tempComposer: e.detail.value });
  },
  
  // 主音选择事件
  onRootNoteChange(e) {
    const index = e.detail.value;
    const rootNote = this.data.rootNoteOptions[index];
    this.setData({ tempRootNote: rootNote });
  },
  
  // 调式选择事件
  onScaleTypeChange(e) {
    const index = e.detail.value;
    const scaleType = this.data.scaleTypeOptions[index];
    this.setData({ tempScaleType: scaleType });
  },
  
  // 音位数选择事件
  onNoteCountChange(e) {
    const index = e.detail.value;
    const noteCount = this.data.noteCountOptions[index];
    this.setData({ tempNoteCount: noteCount });
  },
  
  // 确认副标题编辑
  confirmSubtitleEdit() {
    const { tempSubtitle, tempComposer, tempRootNote, tempScaleType, tempNoteCount } = this.data;
    this.setData({
      subTitle: tempSubtitle,
      composer: tempComposer,
      rootNote: tempRootNote,
      scaleType: tempScaleType,
      noteCount: tempNoteCount,
      showSubtitleEditModal: false
    });
    this.saveTitles();
    this.markNotationChanged();
    wx.showToast({ title: '已保存', icon: 'success' });
  },
  
  // 关闭副标题编辑弹窗
  closeSubtitleEditModal() {
    this.setData({ 
      showSubtitleEditModal: false,
      showSubtitleRootNotePicker: false,
      showSubtitleScaleTypePicker: false,
      showSubtitleNoteCountPicker: false
    });
  },
  
  // ========== 副标题编辑-iOS选择器方法 ==========
  
  // 主音选择器
  showSubtitleRootNotePicker() {
    const currentIndex = this.data.rootNoteOptions.indexOf(this.data.tempRootNote);
    this.setData({
      showSubtitleRootNotePicker: true,
      subtitleRootNotePickerValue: [currentIndex >= 0 ? currentIndex : 2],
      tempSubtitleRootNote: this.data.tempRootNote
    });
  },
  
  closeSubtitleRootNotePicker() {
    this.setData({ showSubtitleRootNotePicker: false });
  },
  
  onSubtitleRootNotePickerChange(e) {
    const index = e.detail.value[0];
    this.setData({
      tempSubtitleRootNote: this.data.rootNoteOptions[index],
      subtitleRootNotePickerValue: [index]
    });
  },
  
  confirmSubtitleRootNotePicker() {
    this.setData({
      tempRootNote: this.data.tempSubtitleRootNote,
      showSubtitleRootNotePicker: false
    });
  },
  
  // 调式选择器
  showSubtitleScaleTypePicker() {
    const currentIndex = this.data.scaleTypeOptions.indexOf(this.data.tempScaleType);
    this.setData({
      showSubtitleScaleTypePicker: true,
      subtitleScaleTypePickerValue: [currentIndex >= 0 ? currentIndex : 9],
      tempSubtitleScaleType: this.data.tempScaleType
    });
  },
  
  closeSubtitleScaleTypePicker() {
    this.setData({ showSubtitleScaleTypePicker: false });
  },
  
  onSubtitleScaleTypePickerChange(e) {
    const index = e.detail.value[0];
    this.setData({
      tempSubtitleScaleType: this.data.scaleTypeOptions[index],
      subtitleScaleTypePickerValue: [index]
    });
  },
  
  confirmSubtitleScaleTypePicker() {
    this.setData({
      tempScaleType: this.data.tempSubtitleScaleType,
      showSubtitleScaleTypePicker: false
    });
  },
  
  // 音位数选择器
  showSubtitleNoteCountPicker() {
    const currentIndex = this.data.noteCountOptions.indexOf(this.data.tempNoteCount);
    this.setData({
      showSubtitleNoteCountPicker: true,
      subtitleNoteCountPickerValue: [currentIndex >= 0 ? currentIndex : 3],
      tempSubtitleNoteCount: this.data.tempNoteCount
    });
  },
  
  closeSubtitleNoteCountPicker() {
    this.setData({ showSubtitleNoteCountPicker: false });
  },
  
  onSubtitleNoteCountPickerChange(e) {
    const index = e.detail.value[0];
    this.setData({
      tempSubtitleNoteCount: this.data.noteCountOptions[index],
      subtitleNoteCountPickerValue: [index]
    });
  },
  
  confirmSubtitleNoteCountPicker() {
    this.setData({
      tempNoteCount: this.data.tempSubtitleNoteCount,
      showSubtitleNoteCountPicker: false
    });
  },
  
  // 打开难度选择弹窗
  openDifficultyModal() {
    this.setData({
      showDifficultyModal: true,
      tempDifficulty: this.data.difficulty
    });
  },
  
  // 选择难度星级
  selectDifficulty(e) {
    const star = parseInt(e.currentTarget.dataset.star);
    this.setData({ tempDifficulty: star });
  },
  
  // 确认难度选择
  confirmDifficulty() {
    this.setData({
      difficulty: this.data.tempDifficulty,
      showDifficultyModal: false
    });
    this.saveTitles();
    this.markNotationChanged();
    wx.showToast({ title: '难度已设置', icon: 'success' });
  },
  
  // 关闭难度选择弹窗
  closeDifficultyModal() {
    this.setData({ showDifficultyModal: false });
  },
  
  // 打开简介弹窗
  openIntroModal() {
    this.setData({
      showIntroModal: true,
      tempIntroduction: this.data.introduction
    });
  },
  
  // 简介输入事件
  onTempIntroInput(e) {
    this.setData({ tempIntroduction: e.detail.value });
  },
  
  // 确认简介编辑
  confirmIntroEdit() {
    this.setData({
      introduction: this.data.tempIntroduction,
      showIntroModal: false
    });
    this.saveTitles();
    this.markNotationChanged();
    wx.showToast({ title: '简介已保存', icon: 'success' });
  },
  
  // 关闭简介弹窗
  closeIntroModal() {
    this.setData({ showIntroModal: false });
  },
  
  // 获取调式显示名称（只取/前的部分）
  getScaleDisplayName(scale) {
    if (!scale) return '';
    const parts = scale.split(' / ');
    return parts[0];
  },
  
  // 获取主音显示名称（只取/前的部分，处理# / b格式）
  getRootDisplayName(root) {
    if (!root) return '';
    return root; // 主音选项已经是简化格式
  },

  // 编辑标签
  editLabel(e) {
    const id = parseInt(e.currentTarget.dataset.id);
    const notation = this.data.notations.find(n => n.id === id);
    if (!notation) return;

    // 使用实例变量存储临时值，避免频繁setData导致的输入卡顿
    this._labelEditName = notation.label || '';
    this._labelEditRemark = notation.remark || '';

    this.setData({
      showLabelEditModal: true,
      labelEditModuleId: id,
      labelEditName: notation.label || '',
      labelEditRemark: notation.remark || ''
    });
  },

  // 模块标签编辑输入事件（使用实例变量避免输入回退）
  onLabelEditNameInput(e) {
    this._labelEditName = e.detail.value;
  },

  onLabelEditRemarkInput(e) {
    this._labelEditRemark = e.detail.value;
  },

  // 确认模块标签编辑
  confirmLabelEdit() {
    const { labelEditModuleId, notations } = this.data;
    // 从实例变量读取最新值
    const labelEditName = this._labelEditName !== undefined ? this._labelEditName : this.data.labelEditName;
    const labelEditRemark = this._labelEditRemark !== undefined ? this._labelEditRemark : this.data.labelEditRemark;
    
    const updatedNotations = JSON.parse(JSON.stringify(notations));
    const notation = updatedNotations.find(n => n.id === labelEditModuleId);
    if (notation) {
      notation.label = labelEditName;
      notation.remark = labelEditRemark;
    }
    this.saveNotationsScoped(updatedNotations);
    this.setNotations(updatedNotations);
    this.markNotationChanged(); // 标记为有更改
    
    // 清理实例变量
    this._labelEditName = undefined;
    this._labelEditRemark = undefined;
    
    this.setData({
      showLabelEditModal: false,
      labelEditModuleId: null,
      labelEditName: '',
      labelEditRemark: ''
    });
  },

  // 关闭模块标签编辑弹窗
  closeLabelEditModal() {
    // 清理实例变量
    this._labelEditName = undefined;
    this._labelEditRemark = undefined;
    
    this.setData({
      showLabelEditModal: false,
      labelEditModuleId: null,
      labelEditName: '',
      labelEditRemark: ''
    });
  },

  // 编辑全局速度
  editGlobalTempo() {
    // 使用实例变量存储临时值
    this._editValue = String(this.data.globalTempo);
    
    this.setData({
      showEditModal: true,
      editModalTitle: '编辑速度',
      editValue: String(this.data.globalTempo),
      editInputType: 'number',
      editPlaceholder: '输入速度（BPM）',
      currentEdit: { type: 'globalTempo' }
    });
  },

  // 编辑音符
  editNote(e) {
    // 保留旧接口（不再使用弹窗），改为直接进入内嵌编辑
    this.onSlotTap(e);
  },

  // 底部操作栏折叠/展开（选中模式下禁止展开）
  toggleActionBar() {
    // 【优化】选中模式下禁止展开菜单栏
    if (this.data.isSelectingBeats && !this.data.actionCollapsed) {
      wx.showToast({
        title: '选中模式下无法展开菜单',
        icon: 'none',
        duration: 1500
      });
      return;
    }
    this.setData({ actionCollapsed: !this.data.actionCollapsed });
  },

  // 切换布局二级菜单
  toggleLayoutMenu() {
    this.setData({ showLayoutMenu: !this.data.showLayoutMenu });
  },

  // 关闭布局二级菜单
  closeLayoutMenu() {
    if (this.data.showLayoutMenu) {
      this.setData({ showLayoutMenu: false });
    }
  },

  // 切换阅读模式
  toggleReadingMode() {
    const newReadingMode = !this.data.readingMode;
    this.setData({ 
      readingMode: newReadingMode,
      showLayoutMenu: false // 操作后自动关闭布局菜单
    });
    
    if (newReadingMode) {
      // 进入阅读模式：收起所有module的谱面图标
      this.collapseAllNotations();
      // 隐藏TabBar
      wx.hideTabBar({
        animation: true
      });
    } else {
      // 退出阅读模式：一键展开所有module
      this.expandAllNotations();
      // 显示TabBar
      wx.showTabBar({
        animation: true
      });
    }
  },

  // 【Canvas模式迁移】收起/展开单个谱面的操作按钮行
  // collapsed=true: 隐藏操作按钮，将Canvas转为图片（节省性能）
  // collapsed=false: 显示操作按钮，直接显示Canvas编辑模式
  toggleNotationCollapse(e) {
    // 确保 _canvasRenderers 已初始化
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const notationId = e.currentTarget.dataset.id;
    if (!notationId) {
      console.warn('[Canvas] toggleNotationCollapse: notationId 未定义');
      return;
    }
    
    const notationIndex = this.data.notations.findIndex(n => n.id === notationId);
    if (notationIndex === -1) {
      console.warn('[Canvas] toggleNotationCollapse: 未找到 notation:', notationId);
      return;
    }
    
    const notation = this.data.notations[notationIndex];
    if (!notation) {
      console.warn('[Canvas] toggleNotationCollapse: notation 数据为空');
      return;
    }
    
    const newCollapsed = !notation.collapsed;
    
    // 更新collapsed状态
    const updatePath = `notations[${notationIndex}].collapsed`;
    const updateData = { [updatePath]: newCollapsed };
    
    if (newCollapsed) {
      // 收起模式：隐藏操作按钮，将Canvas转为图片以节省性能
      // 清除旧的临时图片路径（会触发重新转换）
      updateData[`notations[${notationIndex}].tempImagePath`] = null;
      updateData[`notations[${notationIndex}].isCanvasEditing`] = false;
      
      // 清除编辑状态
      if (this.data.canvasEditing && this.data.canvasEditing.notationId === notationId) {
        updateData.canvasEditing = null;
        updateData.canvasEditingValue = '';
      }
    } else {
      // 展开模式：显示操作按钮，直接显示Canvas编辑模式（不需要图片）
      updateData[`notations[${notationIndex}].tempImagePath`] = null;
      updateData[`notations[${notationIndex}].isCanvasEditing`] = true; // 直接进入编辑模式
    }
    
    this.setData(updateData, () => {
      if (newCollapsed) {
        // 收起模式：确保Canvas渲染器存在，然后转为图片
        setTimeout(() => {
          const renderer = this._canvasRenderers[notationId];
          if (renderer) {
            // 渲染器已存在，直接转图片
            this.convertCanvasToImage(notationId, notationIndex);
          } else {
            // 渲染器不存在，先初始化再转图片
            this.initCanvasRenderer(notationId, notationIndex);
          }
        }, 50);
      } else {
        // 【Bug修复】展开模式：由于WXML中Canvas元素是条件渲染的，
        // 从collapsed=true切换到collapsed=false时，旧的Canvas DOM节点已被销毁，
        // 新的Canvas节点被创建，因此必须销毁旧渲染器并重新初始化
        setTimeout(() => {
          // 销毁旧渲染器（如果存在）
          if (this._canvasRenderers[notationId]) {
            this._canvasRenderers[notationId].destroy();
            delete this._canvasRenderers[notationId];
          }
          // 【Bug修复】使用带重试机制的方法重新初始化Canvas渲染器
          this.initCanvasRendererForModuleWithRetry(notationId, notationIndex, 5);
        }, 100); // 增加延迟确保新Canvas节点已渲染
      }
    });
  },
  
  /**
   * 计算Canvas所需高度（px）
   * @param {Object} notation - 谱面数据
   * @param {string} overrideOrientation - 可选，覆盖当前orientation（用于切换排版时的预计算）
   */
  calculateCanvasHeight(notation, overrideOrientation) {
    if (!notation || !notation.measures) return 300;
    
    // 导入配置参数
    const { BASE_SETTINGS, LAYOUT_SETTINGS } = require('../../utils/canvasRenderer.js');
    
    const measuresPerRow = notation.measuresPerRow || this.data.measuresPerRow || 1;
    const style = notation.style || {};
    const isMultiMeasure = measuresPerRow > 1;
    // 【Bug修复】支持覆盖orientation，用于切换排版时的预计算
    const orientation = overrideOrientation || this.data.orientation;
    
    // 获取小节高度（rpx）- 使用配置参数
    let measureHeight = isMultiMeasure ? BASE_SETTINGS.measureHeightMulti : BASE_SETTINGS.measureHeightDefault;
    if (style.measureHeight) {
      measureHeight = parseInt(style.measureHeight, 10) || measureHeight;
    }
    
    // 获取行间距（rpx）- 使用配置参数
    let lineSpacing = style.lineSpacing || BASE_SETTINGS.lineSpacingDefault;
    
    // 横屏缩放 - 使用配置参数
    if (orientation === 'landscape') {
      measureHeight = Math.round(measureHeight * BASE_SETTINGS.landscapeScale);
      lineSpacing = Math.round(lineSpacing * BASE_SETTINGS.landscapeScale);
    }
    
    // 计算总行数
    const totalRows = Math.ceil(notation.measures.length / measuresPerRow);
    
    // 计算总高度（rpx）- 包含上下内边距
    const totalHeightRpx = LAYOUT_SETTINGS.canvasTopPadding + 
      totalRows * measureHeight + 
      (totalRows - 1) * lineSpacing + 
      LAYOUT_SETTINGS.canvasBottomPadding;
    
    // rpx转px
    const screenWidth = wx.getWindowInfo().screenWidth || 375;
    const heightPx = totalHeightRpx * screenWidth / 750;
    
    return Math.ceil(heightPx);
  },
  
  /**
   * 初始化Canvas渲染器
   */
  // 获取 Canvas 渲染器构造选项（含已缓存的琶音图）
  getCanvasRendererOptions() {
    return {
      colors: {
        rightHand: this.data.rightHandColor,
        leftHand: this.data.leftHandColor
      },
      arpeggioImage: this._arpeggioImage || undefined
    };
  },
  
  // 预加载琶音符号图 arpeggio.svg，加载完成后注入所有渲染器并重绘
  loadArpeggioImageIfNeeded(canvas) {
    if (this._arpeggioImage) return;
    if (!canvas || typeof canvas.createImage !== 'function') return;
    const self = this;
    const img = canvas.createImage();
    img.onload = function () {
      self._arpeggioImage = img;
      const renderers = self._canvasRenderers || {};
      Object.keys(renderers).forEach(notationId => {
        const r = renderers[notationId];
        if (r && r.setArpeggioImage) {
          r.setArpeggioImage(img);
          r.render();
        }
      });
      Object.keys(renderers).forEach(notationId => {
        const notationIndex = (self.data.notations || []).findIndex(n => n && n.id === notationId);
        if (notationIndex >= 0) self.convertCanvasToImage(notationId, notationIndex);
      });
    };
    img.onerror = function () { /* 加载失败时继续使用波浪线占位 */ };
    img.src = '/assets/icons/keyboard/arpeggio.svg';
  },
  
  initCanvasRenderer(notationId, notationIndex) {
    const notation = this.data.notations[notationIndex];
    if (!notation) return;
    
    const canvasId = `notation-canvas-${notationId}`;
    
    // 获取Canvas节点
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        console.warn('[Canvas] 未找到Canvas节点:', canvasId);
        return;
      }
      
      const canvas = res[0].node;
      const width = res[0].width;
      const height = res[0].height;
      
      // 创建渲染器实例（含已缓存的琶音图）
      const renderer = new CanvasNotationRenderer(this.getCanvasRendererOptions());
      
      // 初始化Canvas
      renderer.init(canvas, width, height);
      
      // 设置数据（计算布局，getAllColumnRects 依赖此步骤）
      renderer.setData(notation, this.data.orientation, this.data.measuresPerRow);
      
      // 【优化】播放模式增量渲染：缓存命中时跳过 render + convertCanvasToImage
      const cachedImagePath = this._cachedModuleImages && this._cachedModuleImages[notationId];
      if (cachedImagePath) {
        this._canvasRenderers[notationId] = renderer;
        
        const columnRects = renderer.getAllColumnRects();
        this._columnRectsCache = this._columnRectsCache || {};
        this._columnRectsCache[notationId] = columnRects;
        
        const updateData = {};
        updateData[`notations[${notationIndex}].tempImagePath`] = cachedImagePath;
        this.setData(updateData);
        console.log('[Canvas] 缓存命中，跳过渲染:', notationId);
        return;
      }
      
      // 渲染
      renderer.render();
      
      // 保存渲染器实例
      this._canvasRenderers[notationId] = renderer;
      
      // 预计算并缓存列坐标（用于播放光标）
      const columnRects = renderer.getAllColumnRects();
      this._columnRectsCache = this._columnRectsCache || {};
      this._columnRectsCache[notationId] = columnRects;
      
      console.log('[Canvas] 渲染器初始化完成:', notationId, 'size:', width, 'x', height);
      
      // 预加载琶音图（若尚未加载），加载完成后会重绘并转图
      this.loadArpeggioImageIfNeeded(canvas);
      
      // 延迟转换为图片（解决层级和延迟问题）
      setTimeout(() => {
        this.convertCanvasToImage(notationId, notationIndex);
      }, 100);
    });
  },
  
  /**
   * 将Canvas转换为静态图片
   * 解决Canvas层级最高和跟随延迟的问题
   * 修复：使用路径更新避免多module并行转换时的竞争条件
   * 【优化】播放模式下将渲染结果缓存到 PlaybackCanvasCacheManager
   */
  async convertCanvasToImage(notationId, notationIndex) {
    const renderer = this._canvasRenderers[notationId];
    if (!renderer) return;
    
    try {
      // 转换为临时图片
      const tempImagePath = await renderer.toTempImage();
      
      // 获取图片显示尺寸
      const displaySize = renderer.getImageDisplaySize();
      
      // 使用路径更新方式，避免多module并行转换时覆盖彼此的数据
      // 这是短曲谱（1-2个module）时光标不显示的根本原因
      const updateData = {};
      updateData[`notations[${notationIndex}].tempImagePath`] = tempImagePath;
      updateData[`notations[${notationIndex}].imageWidth`] = displaySize.width;
      updateData[`notations[${notationIndex}].imageHeight`] = displaySize.height;
      updateData[`notations[${notationIndex}].isCanvasEditing`] = false;
      
      this.setData(updateData);
      console.log('[Canvas] 已转换为图片:', notationId, 'index:', notationIndex);
      
      // 【优化】在播放模式下缓存渲染结果
      if (this.data.isPlaybackMode && this._moduleHashes && this._moduleHashes[notationId]) {
        const hash = this._moduleHashes[notationId];
        PlaybackCanvasCacheManager.cacheModule(notationId, hash, tempImagePath);
      }
    } catch (err) {
      console.error('[Canvas] 转图片失败:', err);
    }
  },
  
  /**
   * 点击collapsed状态的图片，进入编辑模式或跳转播放位置
   */
  onCollapsedNotationTap(e) {
    const { id: notationId, index: notationIndex } = e.currentTarget.dataset;
    
    // 如果在播放模式，处理点击跳转
    if (this.data.isPlaybackMode) {
      this.handlePlaybackTapSeek(e, notationId, parseInt(notationIndex));
      return;
    }
    
    // 切换到Canvas编辑模式
    this.enterCanvasEditMode(notationId, parseInt(notationIndex), e);
  },
  
  /**
   * 【Bug修复】长按静态图片进入选中模式
   * 当collapsed状态显示静态图片时，长按需要先切换到Canvas模式再进入选中模式
   * 【重要修复】从静态图片切换时，Canvas节点是新创建的，必须重新初始化渲染器
   */
  onStaticImageLongPress(e) {
    const { id: notationId, index: notationIndex } = e.currentTarget.dataset;
    const idx = parseInt(notationIndex);
    
    // 播放模式和阅读模式下不处理
    if (this.data.isPlaybackMode || this.data.readingMode) return;
    
    // 震动反馈
    wx.vibrateShort({ type: 'medium' });
    
    // 保存长按位置信息，用于后续进入选中模式
    const touch = e.touches ? e.touches[0] : e.detail;
    const touchX = touch.clientX || touch.x;
    const touchY = touch.clientY || touch.y;
    
    // 获取图片元素的位置用于计算相对坐标
    const query = wx.createSelectorQuery();
    query.select(`#notation-container-${notationId}`).boundingClientRect().exec((res) => {
      if (!res || !res[0]) {
        // 如果获取不到位置，直接进入编辑模式让用户重新长按
        this.enterCanvasEditMode(notationId, idx, e);
        return;
      }
      
      const containerRect = res[0];
      const relativeX = touchX - containerRect.left;
      const relativeY = touchY - containerRect.top;
      
      // 先切换到Canvas编辑模式，然后在回调中进入选中模式
      // 清除tempImagePath让Canvas显示
      const updateData = {};
      updateData[`notations[${idx}].tempImagePath`] = null;
      updateData[`notations[${idx}].isCanvasEditing`] = true;
      
      this.setData(updateData, () => {
        // 等待Canvas节点创建完成（从静态图片切换时Canvas是新创建的）
        setTimeout(() => {
          // 【关键修复】从静态图片切换时，Canvas节点是新创建的，
          // 旧的渲染器指向已销毁的Canvas context，必须重新初始化
          // 始终重新初始化渲染器以确保绑定到正确的Canvas节点
          this._initRendererAndEnterSelectionMode(notationId, idx, relativeX, relativeY, touchX, touchY);
        }, 150);
      });
    });
  },
  
  /**
   * 从静态图片长按进入选中模式（渲染器已存在）
   */
  _enterSelectionModeFromStaticImage(renderer, notationId, notationIndex, relativeX, relativeY, touchX, touchY) {
    // 使用渲染器进行hitTest
    const hitResult = renderer.hitTest(relativeX, relativeY);
    
    if (hitResult) {
      const { measureIndex, beatIndex } = hitResult;
      // 调用Canvas模式长按处理进入选中模式
      this.onCanvasBeatLongPress(notationId, notationIndex, measureIndex, beatIndex, touchX, touchY);
    } else {
      // 如果没有命中任何拍位，提示用户
      wx.showToast({ title: '请长按谱面区域', icon: 'none' });
    }
  },
  
  /**
   * 初始化渲染器后进入选中模式
   */
  _initRendererAndEnterSelectionMode(notationId, notationIndex, relativeX, relativeY, touchX, touchY) {
    const notation = this.data.notations[notationIndex];
    if (!notation) return;
    
    const canvasId = `notation-canvas-${notationId}`;
    
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        console.warn('[Canvas] 长按时未找到Canvas节点');
        // 退出编辑状态
        this.setData({
          [`notations[${notationIndex}].isCanvasEditing`]: false
        });
        return;
      }
      
      const canvas = res[0].node;
      const width = res[0].width;
      const height = res[0].height;
      
      if (width === 0 || height === 0) {
        console.warn('[Canvas] 长按时Canvas尺寸为0');
        return;
      }
      
      // 初始化渲染器
      if (!this._canvasRenderers) {
        this._canvasRenderers = {};
      }
      
      // 如果已有渲染器，先销毁
      if (this._canvasRenderers[notationId]) {
        this._canvasRenderers[notationId].destroy();
      }
      
      // 创建并初始化渲染器
      const CanvasNotationRenderer = require('../../utils/canvasRenderer').CanvasNotationRenderer;
      const renderer = new CanvasNotationRenderer(this.getCanvasRendererOptions());
      
      renderer.init(canvas, width, height);
      renderer.setData(notation, this.data.orientation, notation.measuresPerRow || this.data.measuresPerRow);
      renderer.render();
      
      this._canvasRenderers[notationId] = renderer;
      
      this.loadArpeggioImageIfNeeded(canvas);
      
      // 进入选中模式
      this._enterSelectionModeFromStaticImage(renderer, notationId, notationIndex, relativeX, relativeY, touchX, touchY);
    });
  },
  
  /**
   * 播放模式下点击谱面跳转到指定位置
   */
  handlePlaybackTapSeek(e, notationId, moduleIndex) {
    // 获取点击位置
    const touch = e.touches ? e.touches[0] : e.detail;
    if (!touch) return;
    
    // 获取图片元素的位置
    const query = wx.createSelectorQuery().in(this);
    query.select(`#notation-container-${notationId}`).boundingClientRect((rect) => {
      if (!rect) return;
      
      // 计算点击在图片内的相对坐标
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // 从渲染器获取列坐标缓存
      const columnRects = this._columnRectsCache ? this._columnRectsCache[notationId] : null;
      if (!columnRects || columnRects.length === 0) {
        // 尝试从渲染器获取
        const renderer = this._canvasRenderers ? this._canvasRenderers[notationId] : null;
        if (renderer) {
          const rects = renderer.getAllColumnRects();
          if (this._columnRectsCache) {
            this._columnRectsCache[notationId] = rects;
          }
          this._findAndSeekToColumn(rects, x, y, moduleIndex, notationId);
        }
        return;
      }
      
      this._findAndSeekToColumn(columnRects, x, y, moduleIndex, notationId);
    }).exec();
  },
  
  /**
   * 根据点击坐标查找并跳转到对应列
   * @private
   */
  _findAndSeekToColumn(columnRects, x, y, moduleIndex, notationId) {
    if (!columnRects || columnRects.length === 0) return;
    
    // 【修复】检查一个列是否是占位拍
    const isPlaceholderBeat = (col) => {
      const notation = this.data.notations[moduleIndex];
      if (!notation || !notation.measures || !notation.measures[col.measureIndex]) return false;
      const measure = notation.measures[col.measureIndex];
      if (!measure.beats || !measure.beats[col.beatIndex]) return false;
      return measure.beats[col.beatIndex].isPlaceholder === true;
    };
    
    // 查找点击位置对应的列（排除占位拍）
    let targetColumn = null;
    let minDistance = Infinity;
    
    for (const col of columnRects) {
      // 【修复】跳过占位拍
      if (isPlaceholderBeat(col)) continue;
      
      // 检查Y坐标是否在列范围内（宽松匹配）
      if (y >= col.y - 10 && y <= col.y + col.height + 10) {
        // 计算X方向的距离
        const colCenterX = col.x + col.width / 2;
        const distance = Math.abs(x - colCenterX);
        
        if (distance < minDistance) {
          minDistance = distance;
          targetColumn = col;
        }
      }
    }
    
    // 如果没找到Y范围内的，找最接近的非占位拍列
    if (!targetColumn) {
      for (const col of columnRects) {
        // 【修复】跳过占位拍
        if (isPlaceholderBeat(col)) continue;
        
        const colCenterX = col.x + col.width / 2;
        const colCenterY = col.y + col.height / 2;
        const distance = Math.sqrt(Math.pow(x - colCenterX, 2) + Math.pow(y - colCenterY, 2));
        
        if (distance < minDistance) {
          minDistance = distance;
          targetColumn = col;
        }
      }
    }
    
    if (targetColumn) {
      // 构建columnId
      const columnId = `${moduleIndex}-${targetColumn.measureIndex}-${targetColumn.beatIndex}-${targetColumn.subIndex}`;
      
      // 更新光标位置
      const updateData = {};
      updateData[`notations[${moduleIndex}].cursorVisible`] = true;
      updateData[`notations[${moduleIndex}].cursorX`] = targetColumn.x;
      updateData[`notations[${moduleIndex}].cursorY`] = targetColumn.y;
      updateData[`notations[${moduleIndex}].cursorWidth`] = targetColumn.width;
      updateData[`notations[${moduleIndex}].cursorHeight`] = targetColumn.height;
      
      // 隐藏其他module的光标
      this.data.notations.forEach((n, i) => {
        if (i !== moduleIndex) {
          updateData[`notations[${i}].cursorVisible`] = false;
        }
      });
      
      this._currentPlayingModuleIndex = moduleIndex;
      
      // 更新播放起始位置（使下次点击播放时从此处开始）
      updateData.playbackStartColumn = columnId;
      
      // 如果播放管理器已初始化且有时间线，执行跳转
      if (sheetPlaybackManager && sheetPlaybackManager.timeline && sheetPlaybackManager.timeline.length > 0) {
        sheetPlaybackManager.seekAndPause(columnId);
        updateData.isPlaying = false;
        updateData.isPaused = true;
        
        // 【修复】更新进度条 - 确保从timeline中找到对应事件后同步更新
        const targetEvent = sheetPlaybackManager.timeline.find(e => !e.isGraceNote && e.columnId === columnId);
        if (targetEvent && sheetPlaybackManager.getTotalDuration) {
          const totalDuration = sheetPlaybackManager.getTotalDuration();
          const progress = totalDuration > 0 ? (targetEvent.absoluteTime / totalDuration) * 100 : 0;
          updateData.playbackProgress = progress;
          updateData.playbackCurrentTimeStr = this.formatPlaybackTime(targetEvent.absoluteTime);
          
          // 【修复】同步更新播放管理器的内部索引和偏移量
          const targetIndex = sheetPlaybackManager.timeline.findIndex(e => !e.isGraceNote && e.columnId === columnId);
          if (targetIndex >= 0) {
            sheetPlaybackManager.currentEventIndex = targetIndex;
            sheetPlaybackManager.playbackOffset = targetEvent.absoluteTime;
          }
        } else {
          // 【修复】如果在timeline中没找到对应事件，尝试找最接近的事件
          console.warn('[_findAndSeekToColumn] 未在timeline中找到columnId:', columnId);
          // 使用当前的currentEventIndex对应的进度
          const currentIdx = sheetPlaybackManager.currentEventIndex;
          if (currentIdx >= 0 && currentIdx < sheetPlaybackManager.timeline.length) {
            const currentEvent = sheetPlaybackManager.timeline[currentIdx];
            if (currentEvent && !currentEvent.isGraceNote) {
              const totalDuration = sheetPlaybackManager.getTotalDuration();
              const progress = totalDuration > 0 ? (currentEvent.absoluteTime / totalDuration) * 100 : 0;
              updateData.playbackProgress = progress;
              updateData.playbackCurrentTimeStr = this.formatPlaybackTime(currentEvent.absoluteTime);
            }
          }
        }
      } else {
        // 播放管理器未初始化时，仅标记为暂停状态（下次播放将从此处开始）
        updateData.isPaused = true;
      }
      
      this.setData(updateData);
      
      // 播放该定位位置音符列的声音
      this._playColumnNotes(moduleIndex, targetColumn.measureIndex, targetColumn.beatIndex, targetColumn.subIndex);
    }
  },
  
  /**
   * 播放指定列的音符声音（用于定位时播放）
   * @param {number} moduleIndex - 模块索引
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   */
  async _playColumnNotes(moduleIndex, measureIndex, beatIndex, subIndex) {
    if (!sheetPlaybackManager) {
      // 如果播放管理器未初始化，尝试获取
      try {
        await getSheetPlaybackManager();
      } catch (e) {
        console.warn('[Notation] 播放管理器未初始化，无法播放音符');
        return;
      }
    }
    
    const notation = this.data.notations[moduleIndex];
    if (!notation || !notation.measures || !notation.measures[measureIndex]) {
      return;
    }
    
    const measure = notation.measures[measureIndex];
    if (!measure.beats || !measure.beats[beatIndex]) {
      return;
    }
    
    const beat = measure.beats[beatIndex];
    
    // 【修复】如果是占位拍，不播放声音
    if (beat.isPlaceholder) {
      return;
    }
    
    if (!beat.subdivisions || !beat.subdivisions[subIndex]) {
      return;
    }
    
    const subdivision = beat.subdivisions[subIndex];
    const notationType = this.data.notationType || 'digital';
    
    // 收集所有需要播放的音符（同时播放）
    const notesToPlay = [];
    
    const extractNotes = (noteArray) => {
      if (!Array.isArray(noteArray)) return;
      
      for (const noteStr of noteArray) {
        if (!noteStr || typeof noteStr !== 'string') continue;
        const cleaned = noteStr.replace(/[()]/g, '').trim();
        if (!cleaned || cleaned === '-' || cleaned === '+') continue;
        
        // 获取音符的音频信息
        const audioInfo = sheetPlaybackManager.getNoteAudioInfo(noteStr, notationType);
        if (audioInfo && audioInfo.spn) {
          notesToPlay.push({
            spn: audioInfo.spn,
            volume: audioInfo.volume || 0.7
          });
        }
      }
    };
    
    // 提取右手和左手的音符
    if (subdivision.rightHand) {
      extractNotes(subdivision.rightHand);
    }
    if (subdivision.leftHand) {
      extractNotes(subdivision.leftHand);
    }
    
    // 同时播放所有音符（不等待，让它们并发播放）
    notesToPlay.forEach(note => {
      sheetPlaybackManager.previewSound(note.spn, note.volume).catch(err => {
        console.warn('[Notation] 播放音符失败:', note.spn, err);
      });
    });
  },
  
  /**
   * 进入Canvas编辑模式
   */
  enterCanvasEditMode(notationId, notationIndex, tapEvent) {
    const notations = [...this.data.notations];
    if (!notations[notationIndex]) return;
    
    // 标记为编辑模式
    notations[notationIndex] = {
      ...notations[notationIndex],
      isCanvasEditing: true
    };
    
    this.setData({ notations }, () => {
      // 重新初始化Canvas渲染器
      setTimeout(() => {
        this.initCanvasRendererForEdit(notationId, notationIndex, tapEvent);
      }, 50);
    });
  },
  
  /**
   * 为编辑模式初始化Canvas
   */
  initCanvasRendererForEdit(notationId, notationIndex, tapEvent) {
    const notation = this.data.notations[notationIndex];
    if (!notation) return;
    
    const canvasId = `notation-canvas-${notationId}`;
    
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        console.warn('[Canvas] 编辑模式未找到Canvas节点:', canvasId);
        return;
      }
      
      const canvas = res[0].node;
      const width = res[0].width;
      const height = res[0].height;
      
      // 如果已有渲染器，先销毁
      if (this._canvasRenderers[notationId]) {
        this._canvasRenderers[notationId].destroy();
      }
      
      // 创建新渲染器
      const renderer = new CanvasNotationRenderer(this.getCanvasRendererOptions());
      
      renderer.init(canvas, width, height);
      renderer.setData(notation, this.data.orientation, this.data.measuresPerRow);
      renderer.render();
      
      this._canvasRenderers[notationId] = renderer;
      
      this.loadArpeggioImageIfNeeded(canvas);
      
      // 如果有点击事件，处理点击
      if (tapEvent) {
        this.handleEditModeTap(notationId, notationIndex, tapEvent);
      }
    });
  },
  
  /**
   * 处理编辑模式下的点击
   */
  handleEditModeTap(notationId, notationIndex, e) {
    const renderer = this._canvasRenderers[notationId];
    if (!renderer) return;
    
    const touch = e.touches ? e.touches[0] : e.detail;
    
    const query = wx.createSelectorQuery();
    query.select(`#notation-canvas-${notationId}`).boundingClientRect().exec((res) => {
      if (!res || !res[0]) return;
      
      const canvasRect = res[0];
      const x = (touch.clientX || touch.x) - canvasRect.left;
      const y = (touch.clientY || touch.y) - canvasRect.top;
      
      const hitResult = renderer.hitTest(x, y);
      
      if (hitResult) {
        this.handleCanvasSlotTap(notationId, notationIndex, hitResult, canvasRect);
      }
    });
  },
  
  /**
   * 退出Canvas编辑模式，转回图片模式
   */
  exitCanvasEditMode(notationId, notationIndex) {
    // 先提交编辑
    if (this.data.canvasEditing && this.data.canvasEditing.notationId === notationId) {
      this.commitCanvasEdit();
    }
    
    // 重新转换为图片
    this.convertCanvasToImage(notationId, notationIndex);
  },
  
  /**
   * 销毁Canvas渲染器
   */
  destroyCanvasRenderer(notationId) {
    // 防御性检查：确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      console.warn('[Canvas] _canvasRenderers 未初始化');
      this._canvasRenderers = {};
      return;
    }
    
    const renderer = this._canvasRenderers[notationId];
    if (renderer) {
      try {
        renderer.destroy();
      } catch (e) {
        console.warn('[Canvas] 销毁渲染器时出错:', e);
      }
      delete this._canvasRenderers[notationId];
      console.log('[Canvas] 渲染器已销毁:', notationId);
    }
  },
  
  /**
   * Canvas点击事件处理
   */
  onCanvasTap(e) {
    const { id: notationId, index: notationIndex } = e.currentTarget.dataset;
    const renderer = this._canvasRenderers[notationId];
    const { isSelectingBeats } = this.data;
    
    if (!renderer) {
      console.warn('[Canvas] 未找到渲染器:', notationId);
      return;
    }
    
    // 获取点击坐标（相对于Canvas）
    const touch = e.touches ? e.touches[0] : e.detail;
    const rect = e.currentTarget;
    
    // 使用 boundingClientRect 获取准确坐标
    const query = wx.createSelectorQuery();
    query.select(`#notation-canvas-${notationId}`).boundingClientRect().exec((res) => {
      if (!res || !res[0]) return;
      
      const canvasRect = res[0];
      const x = (touch.clientX || touch.x) - canvasRect.left;
      const y = (touch.clientY || touch.y) - canvasRect.top;
      
      // 点击测试
      const hitResult = renderer.hitTest(x, y);
      
      if (hitResult) {
        console.log('[Canvas] 点击命中:', hitResult);
        
        // 【任务2】如果在选中模式下，处理拍位选择
        if (isSelectingBeats) {
          const { measureIndex, beatIndex } = hitResult;
          this.onCanvasBeatTapForSelection(
            notationId,
            parseInt(notationIndex),
            measureIndex,
            beatIndex,
            touch.clientX || touch.x,
            touch.clientY || touch.y
          );
          return;
        }
        
        this.handleCanvasSlotTap(notationId, parseInt(notationIndex), hitResult, canvasRect);
      }
    });
  },
  
  /**
   * 【任务2】Canvas长按事件处理
   */
  onCanvasLongPress(e) {
    const { id: notationId, index: notationIndex } = e.currentTarget.dataset;
    const renderer = this._canvasRenderers[notationId];
    
    if (!renderer) {
      console.warn('[Canvas] 未找到渲染器:', notationId);
      return;
    }
    
    // 获取点击坐标
    const touch = e.touches ? e.touches[0] : e.detail;
    
    const query = wx.createSelectorQuery();
    query.select(`#notation-canvas-${notationId}`).boundingClientRect().exec((res) => {
      if (!res || !res[0]) return;
      
      const canvasRect = res[0];
      const x = (touch.clientX || touch.x) - canvasRect.left;
      const y = (touch.clientY || touch.y) - canvasRect.top;
      
      // 点击测试获取拍位信息
      const hitResult = renderer.hitTest(x, y);
      
      if (hitResult) {
        const { measureIndex, beatIndex } = hitResult;
        // 调用Canvas模式长按处理
        this.onCanvasBeatLongPress(
          notationId, 
          parseInt(notationIndex), 
          measureIndex, 
          beatIndex,
          touch.clientX || touch.x,
          touch.clientY || touch.y
        );
      }
    });
  },
  
  /**
   * 【任务2】Canvas模式选择结束处理
   */
  onCanvasSelectEnd(e) {
    const { canvasSelectStep, canvasSelectStartInfo } = this.data;
    if (canvasSelectStep !== 1 || !canvasSelectStartInfo) return;
    
    const { id: notationId, index: notationIndex } = e.currentTarget.dataset;
    const renderer = this._canvasRenderers[notationId];
    
    if (!renderer || notationId !== canvasSelectStartInfo.notationId) {
      wx.showToast({ title: '只能选择同一模块内的拍', icon: 'none' });
      return;
    }
    
    // 获取点击坐标
    const touch = e.touches ? e.touches[0] : e.detail;
    
    const query = wx.createSelectorQuery();
    query.select(`#notation-canvas-${notationId}`).boundingClientRect().exec((res) => {
      if (!res || !res[0]) return;
      
      const canvasRect = res[0];
      const x = (touch.clientX || touch.x) - canvasRect.left;
      const y = (touch.clientY || touch.y) - canvasRect.top;
      
      // 点击测试获取拍位信息
      const hitResult = renderer.hitTest(x, y);
      
      if (hitResult) {
        const { measureIndex, beatIndex } = hitResult;
        
        // 设置选择终点
        this.setData({
          beatSelectionEnd: { notationId, measureIndex, beatIndex },
          canvasSelectStep: 2
        }, () => {
          // 更新选中拍位信息
          const selectedBeatsInfo = this.updateSelectedBeatsInfo();
          this.setData({ selectedBeatsInfo });
          // 显示复制/粘贴气泡
          this.showCopyPasteBubble(touch.clientX || touch.x, touch.clientY || touch.y);
        });
      }
    });
  },
  
  /**
   * 处理Canvas模式下的槽位点击
   */
  handleCanvasSlotTap(notationId, notationIndex, hitResult, canvasRect) {
    const { measureIndex, beatIndex, subIndex, hand, index, note, rect } = hitResult;
    
    // 先清除之前的高亮（如果有）
    const prevEditing = this.data.canvasEditing;
    if (prevEditing) {
      // 检查是否点击的是同一个槽位
      const isSameSlot = prevEditing.notationId === notationId &&
                         prevEditing.measureIndex === measureIndex &&
                         prevEditing.beatIndex === beatIndex &&
                         prevEditing.subIndex === subIndex &&
                         prevEditing.hand === hand &&
                         prevEditing.index === index;
      
      if (!isSameSlot) {
        // 不是同一个槽位，先清除旧的高亮
        const prevRenderer = this._canvasRenderers[prevEditing.notationId];
        if (prevRenderer) {
          // 获取旧槽位的当前值
          const prevNotation = this.data.notations[prevEditing.notationIndex];
          let prevValue = '';
          if (prevNotation) {
            const prevMeasure = prevNotation.measures[prevEditing.measureIndex];
            if (prevMeasure) {
              const prevBeat = prevMeasure.beats[prevEditing.beatIndex];
              if (prevBeat && prevBeat.subdivisions[prevEditing.subIndex]) {
                const prevSub = prevBeat.subdivisions[prevEditing.subIndex];
                const prevHandKey = prevEditing.hand === 'right' ? 'rightHand' : 'leftHand';
                if (prevSub[prevHandKey]) {
                  prevValue = prevSub[prevHandKey][prevEditing.index] || '';
                }
              }
            }
          }
          // 同步清除旧高亮
          prevRenderer.redrawSlot(
            prevEditing.measureIndex,
            prevEditing.beatIndex,
            prevEditing.subIndex,
            prevEditing.hand,
            prevEditing.index,
            prevValue,
            false // 取消高亮
          );
        }
      }
      
      // 提交之前的编辑（保存数据）
      this.commitCanvasEdit();
    }
    
    // 计算输入框位置（相对于canvas-notation-container）
    const inputX = rect.x;
    const inputY = rect.y;
    const inputWidth = rect.width;
    const inputHeight = rect.height;
    
    // 【性能优化】使用缓存获取解析结果
    const noteValue = note || '';
    const cachedDisplay = this.getCachedNoteDisplay(noteValue);
    const cachedParsed = this.getCachedNoteParsed(noteValue);
    
    // 【修复】同步设置 _prevCanvasEditing，确保方向键移动时能正确清除旧高亮
    this._prevCanvasEditing = { 
      notationId, measureIndex, beatIndex, subIndex, hand, index 
    };
    
    // 更新编辑状态
    this.setData({
      canvasEditing: {
        notationId,
        notationIndex,
        measureIndex,
        beatIndex,
        subIndex,
        hand,
        index,
        inputX,
        inputY,
        inputWidth,
        inputHeight,
        focus: true
      },
      canvasEditingValue: noteValue,
      canvasUseNativeInput: false, // 打开虚拟键盘时关闭原生输入
      // 同时更新虚拟键盘状态
      showVirtualKeyboard: true,
      virtualKeyboardDisplay: noteValue,
      virtualKeyboardRendered: cachedDisplay,
      vkParsed: cachedParsed,
      virtualKeyboardMode: 'number',
      superscriptMode: null,
      superscriptContent: '',
      // 【优化】全局高亮层数据
      slotHighlight: {
        notationId,
        x: inputX,
        y: inputY,
        width: inputWidth,
        height: inputHeight,
        hand,
        visible: true
      }
    }, () => {
      // 更新音高档位
      this.updatePitchLevelFromNote();
      this.syncVkDotAndArpeggioState();
      // 隐藏tabBar
      wx.hideTabBar({ animation: true });
      
      // 【优化】Canvas 重绘移到 nextTick，不阻塞视觉反馈
      wx.nextTick(() => {
        const renderer = this._canvasRenderers[notationId];
        if (renderer) {
          renderer.redrawSlot(measureIndex, beatIndex, subIndex, hand, index, note, true);
        }
        // 注意：_prevCanvasEditing 已在同步代码中设置，这里不再重复设置
      });
    });
  },
  
  /**
   * Canvas模式输入变化
   */
  onCanvasSlotInput(e) {
    const value = e.detail.value;
    const { canvasEditing } = this.data;
    if (!canvasEditing) return;
    
    // 限制长度
    const maxLen = this.data.notationType === 'simplified' ? 20 : 2;
    if (value.length > maxLen) return;
    
    this.setData({
      canvasEditingValue: value,
      virtualKeyboardDisplay: value,
      virtualKeyboardRendered: this.renderNoteForDisplay(value)
    });
    
    // 实时更新Canvas显示（脏矩形刷新）
    const renderer = this._canvasRenderers[canvasEditing.notationId];
    if (renderer) {
      renderer.redrawSlot(
        canvasEditing.measureIndex,
        canvasEditing.beatIndex,
        canvasEditing.subIndex,
        canvasEditing.hand,
        canvasEditing.index,
        value,
        true // 保持编辑状态高亮
      );
    }
  },
  
  /**
   * Canvas模式输入确认
   */
  onCanvasSlotConfirm(e) {
    this.commitCanvasEdit();
  },
  
  /**
   * Canvas模式输入失焦
   */
  onCanvasSlotBlur(e) {
    // 延迟提交，避免与虚拟键盘操作冲突
    setTimeout(() => {
      if (this.data.canvasEditing) {
        this.commitCanvasEdit();
      }
    }, 100);
  },

  /**
   * 主乐谱「切换键盘」后使用的设备原生输入：输入时同步到 canvasEditingValue 并重绘
   */
  onCanvasNativeInput(e) {
    this.updateEditingValue(e.detail.value);
  },

  /**
   * 主乐谱原生输入失焦：仅关闭「使用原生输入」状态，保持音符格选中，用户可再点格子唤起虚拟键盘
   */
  onCanvasNativeInputBlur() {
    this.setData({ canvasUseNativeInput: false });
  },
  
  /**
   * 【性能优化】仅保存数据，不清除编辑状态（用于快速切换时）
   * 这样可以避免在连续切换时重复设置/清除 canvasEditing 状态
   */
  commitCanvasEditDataOnly() {
    const { canvasEditing, canvasEditingValue, notations } = this.data;
    if (!canvasEditing) return;
    
    const { notationIndex, measureIndex, beatIndex, subIndex, hand, index } = canvasEditing;
    const notation = notations[notationIndex];
    if (!notation) return;
    
    const measure = notation.measures[measureIndex];
    if (!measure) return;
    
    const beat = measure.beats[beatIndex];
    if (!beat) return;
    
    const subdivision = beat.subdivisions[subIndex];
    if (!subdivision) return;
    
    const handKey = hand === 'right' ? 'rightHand' : 'leftHand';
    if (!Array.isArray(subdivision[handKey])) {
      subdivision[handKey] = ['', ''];
    }
    if (subdivision[handKey].length < 2) {
      subdivision[handKey] = [subdivision[handKey][0] || '', ''];
    }
    
    const oldValue = subdivision[handKey][index] || '';
    const newValue = canvasEditingValue;
    
    if (oldValue !== newValue) {
      const editAction = this.recordNoteEditAction(
        notationIndex, measureIndex, beatIndex, subIndex, handKey, index, oldValue, newValue
      );
      this.backupCurrentState(editAction);
      
      const path = `notations[${notationIndex}].measures[${measureIndex}].beats[${beatIndex}].subdivisions[${subIndex}].${handKey}[${index}]`;
      this.setData({ [path]: newValue });
      
      this.throttledSaveNotations();
    }
  },
  
  /**
   * 【性能优化】延迟提交 Canvas 编辑（用于连续快速操作）
   * 在快速连续切换时，只保存最后一次的编辑结果
   */
  debouncedCommitCanvas() {
    // 清除之前的定时器
    if (this._pendingCommitTimer) {
      clearTimeout(this._pendingCommitTimer);
    }
    
    // 立即保存数据（不清除状态）
    this.commitCanvasEditDataOnly();
  },
  
  /**
   * 提交Canvas编辑
   */
  commitCanvasEdit() {
    const { canvasEditing, canvasEditingValue, notations } = this.data;
    if (!canvasEditing) return;
    
    const { notationId, notationIndex, measureIndex, beatIndex, subIndex, hand, index } = canvasEditing;
    const notation = notations[notationIndex];
    if (!notation) return;
    
    const measure = notation.measures[measureIndex];
    if (!measure) return;
    
    const beat = measure.beats[beatIndex];
    if (!beat) return;
    
    const subdivision = beat.subdivisions[subIndex];
    if (!subdivision) return;
    
    // 确保数组存在
    const handKey = hand === 'right' ? 'rightHand' : 'leftHand';
    if (!Array.isArray(subdivision[handKey])) {
      subdivision[handKey] = ['', ''];
    }
    if (subdivision[handKey].length < 2) {
      subdivision[handKey] = [subdivision[handKey][0] || '', ''];
    }
    
    // 获取旧值
    const oldValue = subdivision[handKey][index] || '';
    const newValue = canvasEditingValue;
    
    if (oldValue !== newValue) {
      // 记录编辑动作
      const editAction = this.recordNoteEditAction(
        notationIndex, measureIndex, beatIndex, subIndex, handKey, index, oldValue, newValue
      );
      this.backupCurrentState(editAction);
      
      // 更新数据
      const path = `notations[${notationIndex}].measures[${measureIndex}].beats[${beatIndex}].subdivisions[${subIndex}].${handKey}[${index}]`;
      this.setData({ [path]: newValue });
      
      // 保存
      this.throttledSaveNotations();
    }
    
    // 取消编辑高亮，重绘为正常状态
    const renderer = this._canvasRenderers[notationId];
    if (renderer) {
      renderer.redrawSlot(measureIndex, beatIndex, subIndex, hand, index, newValue, false);
    }
    
    // 清除编辑状态（但不关闭虚拟键盘，允许继续点击其他位置）
    this.setData({
      canvasEditing: null,
      canvasEditingValue: ''
    });
  },
  
  /**
   * 刷新所有Canvas渲染器（颜色/方向变化时调用）
   */
  refreshAllCanvasRenderers() {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { notations, orientation, measuresPerRow, rightHandColor, leftHandColor } = this.data;
    
    // 【Bug修复】刷新所有模块的Canvas渲染器，不仅仅是collapsed模块
    // 因为全面使用Canvas2D模式后，所有模块都使用Canvas渲染
    notations.forEach((notation, index) => {
      const renderer = this._canvasRenderers[notation.id];
      if (renderer) {
        renderer.updateColors(rightHandColor, leftHandColor);
        renderer.setData(notation, orientation, notation.measuresPerRow || measuresPerRow);
        renderer.render();
      }
    });
  },

  /**
   * 刷新所有折叠模块的内嵌图片（谱式转换后调用）
   * 遍历所有处于 collapsed 状态的模块，重新渲染 Canvas 并转换为图片
   */
  refreshCollapsedModulesImages() {
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { notations, orientation, measuresPerRow, rightHandColor, leftHandColor } = this.data;
    
    // 筛选出所有折叠状态的模块
    const collapsedModules = notations
      .map((notation, index) => ({ notation, index }))
      .filter(item => item.notation.collapsed);
    
    if (collapsedModules.length === 0) {
      console.log('[Canvas] 没有折叠模块需要刷新图片');
      return;
    }
    
    console.log('[Canvas] 刷新折叠模块图片，数量:', collapsedModules.length);
    
    // 依次刷新每个折叠模块的图片
    collapsedModules.forEach(({ notation, index }, idx) => {
      // 延迟处理，避免同时更新太多Canvas导致卡顿
      setTimeout(() => {
        const renderer = this._canvasRenderers[notation.id];
        if (renderer) {
          // 更新渲染器数据并重新渲染
          renderer.updateColors(rightHandColor, leftHandColor);
          renderer.setData(notation, orientation, notation.measuresPerRow || measuresPerRow);
          renderer.render();
          // 重新转换为图片
          this.convertCanvasToImage(notation.id, index);
        } else {
          // 渲染器不存在，先初始化再转图片
          this.initCanvasRendererWithRetry(notation.id, index, 3);
        }
      }, idx * 100); // 每个模块间隔100ms
    });
  },

  /**
   * 获取当前页面中可见的 module 索引列表
   * @returns {Array} 可见 module 的全局索引数组
   */
  getVisibleModuleIndices() {
    const { currentPageModules } = this.data;
    if (!currentPageModules || currentPageModules.length === 0) {
      // 如果没有分页数据，返回所有 notations 的索引
      return this.data.notations.map((_, i) => i);
    }
    return currentPageModules.map(pm => pm.index);
  },

  // 收起所有谱面的图标行
  collapseAllNotations() {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    if (!this._columnRectsCache) {
      this._columnRectsCache = {};
    }
    
    // 为所有notations设置collapsed状态并计算Canvas高度
    // 清除旧的临时图片路径，确保重新渲染
    const notations = this.data.notations.map(notation => ({
      ...notation,
      collapsed: true,
      canvasHeight: this.calculateCanvasHeight(notation),
      tempImagePath: null, // 清除旧图片，确保重新渲染
      isCanvasEditing: false
    }));
    
    this.setData({ notations }, () => {
      // 延迟初始化当前页面可见的Canvas渲染器
      setTimeout(() => {
        const visibleIndices = this.getVisibleModuleIndices();
        visibleIndices.forEach(index => {
          const notation = notations[index];
          if (notation) {
            this.initCanvasRendererWithRetry(notation.id, index, 3);
          }
        });
      }, 80);
    });
  },

  /**
   * 初始化指定页面的所有Canvas渲染器
   * 用于阅读模式下切换页面时初始化新页面的Canvas
   * @param {number} pageIndex - 页面索引
   */
  initCanvasRenderersForPage(pageIndex) {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { pages, notations, readingMode } = this.data;
    
    if (!readingMode || !pages || !pages[pageIndex]) {
      return;
    }
    
    const pageModules = pages[pageIndex].modules || [];
    
    // 为该页面的每个module初始化Canvas渲染器（增加延迟确保DOM就绪）
    setTimeout(() => {
      pageModules.forEach(pm => {
        const notation = notations[pm.index];
        if (notation && notation.collapsed) {
          // 检查是否已有渲染器或图片
          if (!this._canvasRenderers[notation.id] && !notation.tempImagePath) {
            this.initCanvasRendererWithRetry(notation.id, pm.index, 3);
          }
        }
      });
    }, 100); // 增加延迟以确保WXML渲染完成
  },
  
  /**
   * 带重试机制的Canvas渲染器初始化
   * 用于处理页面切换时Canvas节点可能尚未就绪的情况
   * @param {string} notationId - 谱面ID
   * @param {number} notationIndex - 谱面索引
   * @param {number} retries - 剩余重试次数
   */
  initCanvasRendererWithRetry(notationId, notationIndex, retries) {
    const notation = this.data.notations[notationIndex];
    if (!notation || !notation.collapsed) return;
    
    const canvasId = `notation-canvas-${notationId}`;
    
    // 获取Canvas节点
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        // Canvas节点未找到，如果还有重试次数，延迟后重试
        if (retries > 0) {
          console.log(`[Canvas] 节点未就绪，${retries}次重试后重新初始化:`, canvasId);
          setTimeout(() => {
            this.initCanvasRendererWithRetry(notationId, notationIndex, retries - 1);
          }, 150);
        } else {
          console.warn('[Canvas] 多次重试后仍未找到Canvas节点:', canvasId);
        }
        return;
      }
      
      // 找到节点，正常初始化
      this.initCanvasRenderer(notationId, notationIndex);
    });
  },

  // 展开所有谱面的图标行
  expandAllNotations() {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    // 先销毁所有Canvas渲染器
    this.data.notations.forEach(notation => {
      this.destroyCanvasRenderer(notation.id);
    });
    
    const notations = this.data.notations.map(notation => ({
      ...notation,
      collapsed: false,
      tempImagePath: null, // 清除临时图片路径
      isCanvasEditing: true, // 【Bug修复】展开时直接进入编辑模式
      canvasHeight: this.calculateCanvasHeight(notation) // 确保有正确的高度
    }));
    
    // 清除Canvas编辑状态
    this.setData({ 
      notations,
      canvasEditing: null,
      canvasEditingValue: ''
    }, () => {
      // 【Bug修复】展开后需要重新初始化所有Canvas渲染器
      // 因为collapsed状态变化导致WXML中的Canvas元素被重新创建
      setTimeout(() => {
        this.initAllCanvasRenderersForCurrentPage();
      }, 150);
    });
  },
  
  /**
   * 【Bug修复】为当前页面的所有模块初始化Canvas渲染器
   * 用于阅读模式切换回编辑模式时重新初始化Canvas
   */
  initAllCanvasRenderersForCurrentPage() {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { notations, currentPageModules } = this.data;
    
    // 获取当前页面可见的modules
    const visibleModules = currentPageModules && currentPageModules.length > 0
      ? currentPageModules
      : notations.map((n, i) => ({ id: n.id, index: i }));
    
    console.log('[Canvas] 初始化当前页Canvas渲染器，模块数量:', visibleModules.length);
    
    visibleModules.forEach(({ id, index }, idx) => {
      const notation = notations[index];
      if (!notation) return;
      
      // 延迟初始化，避免同时初始化太多Canvas导致卡顿
      setTimeout(() => {
        // 销毁旧渲染器（如果存在）
        if (this._canvasRenderers[notation.id]) {
          this._canvasRenderers[notation.id].destroy();
          delete this._canvasRenderers[notation.id];
        }
        // 重新初始化
        this.initCanvasRendererForModule(notation.id, index);
      }, idx * 50);
    });
  },

  // 显示节拍器帮助（使用 catchtap 已阻止冒泡）
  showMetronomeHelp() {
    this.setData({ showMetronomeHelpModal: true });
  },

  // 关闭节拍器帮助
  closeMetronomeHelp() {
    this.setData({ showMetronomeHelpModal: false });
  },

  // 进入音符槽位的内嵌编辑
  onSlotTap(e) {
      const { sheet, measure, beat, subdivision, hand, index } = e.currentTarget.dataset;
      const sId = parseInt(sheet);
      const mIdx = parseInt(measure);
      const bIdx = parseInt(beat);
      const subIdx = parseInt(subdivision);
      const iIdx = parseInt(index);
      
      // 【优化】选中模式下，点击音符格触发选中拍位而非编辑
      if (this.data.isSelectingBeats) {
        // 构造一个与onBeatTapForSelection兼容的事件对象
        const fakeEvent = {
          currentTarget: {
            dataset: {
              sheet: sId,
              measure: mIdx,
              beat: bIdx
            }
          },
          touches: e.touches,
          detail: e.detail
        };
        this.onBeatTapForSelection(fakeEvent);
        return;
      }

      const notation = this.data.notations.find(n => n.id === sId);
      if (!notation) {
        wx.showToast({ title: '未找到谱面', icon: 'none' });
        return;
      }
      const slotArray = notation.measures[mIdx].beats[bIdx].subdivisions[subIdx][hand === 'right' ? 'rightHand' : 'leftHand'];
      const currentValue = Array.isArray(slotArray) ? (slotArray[iIdx] || '') : '';

      // 【性能优化】使用缓存获取解析结果
      const cachedDisplay = this.getCachedNoteDisplay(currentValue);
      const cachedParsed = this.getCachedNoteParsed(currentValue);

      // 先更新编辑状态，立即显示输入框和虚拟键盘
      this.setData({
        editing: { sheet: sId, measure: mIdx, beat: bIdx, subdivision: subIdx, hand, index: iIdx },
        editingValue: currentValue,
        showVirtualKeyboard: true,
        virtualKeyboardDisplay: currentValue,
        virtualKeyboardRendered: cachedDisplay,
        vkParsed: cachedParsed,
        virtualKeyboardMode: 'number',
        superscriptMode: null,
        superscriptContent: '',
        // 【优化】View 模式高亮层数据
        slotHighlightViewMode: {
          notationId: sId,
          measureIndex: mIdx,
          beatIndex: bIdx,
          subIndex: subIdx,
          hand: hand,
          index: iIdx,
          visible: true
        }
      });
      
      this.syncVkDotAndArpeggioState();
      // 根据当前音符更新音高档位显示
      this.updatePitchLevelFromNote();
      
      // 隐藏tabBar以显示完整键盘
      wx.hideTabBar({ animation: true });

      // 异步提交之前的编辑
      const prevEditing = this.prevEditing;
      const prevValue = this.prevEditingValue;
      if (prevEditing) {
        setTimeout(() => {
          this.commitInlineEdit(prevEditing, prevValue);
        }, 0);
      }
      
      // 保存当前状态供下次使用
      this.prevEditing = this.data.editing;
      this.prevEditingValue = this.data.editingValue;
      
      // 滚动页面使激活格子在虚拟键盘上方可见
      this.scrollToActiveCell(sId, mIdx, bIdx, subIdx, hand, iIdx);
    },
    
  // 滚动到激活的格子，确保不被虚拟键盘遮挡
  scrollToActiveCell(sheetId, mIdx, bIdx, subIdx, hand, iIdx) {
    // 构建选择器，定位到激活的格子
    const selector = `.notation-sheet[data-sheet-id="${sheetId}"] .measure-index-${mIdx} .beat-${bIdx} .subdivision-${subIdx}`;
    
    const query = wx.createSelectorQuery();
    query.select(selector).boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (!res || !res[0]) return;
      
      const cellRect = res[0];
      const scrollInfo = res[1];
      
      if (!cellRect || !scrollInfo) return;
      
      // 虚拟键盘高度约 480rpx = 240px（假设屏幕宽度375px时）
      // 实际高度需要根据屏幕计算
      const keyboardHeight = 260; // px，预估虚拟键盘高度
      const safeMargin = 60; // px，额外留白
      
      // 获取屏幕高度
      const systemInfo = wx.getSystemInfoSync();
      const screenHeight = systemInfo.windowHeight;
      
      // 计算格子底部相对于视口的位置
      const cellBottom = cellRect.bottom;
      
      // 如果格子底部在虚拟键盘区域内，需要滚动
      const visibleBottom = screenHeight - keyboardHeight - safeMargin;
      
      if (cellBottom > visibleBottom) {
        // 需要向上滚动的距离
        const scrollDistance = cellBottom - visibleBottom;
        const targetScrollTop = scrollInfo.scrollTop + scrollDistance;
        
        wx.pageScrollTo({
          scrollTop: targetScrollTop,
          duration: 200
        });
      }
    });
  },

  // 内嵌输入变化：实时保存到谱面，避免切换位置丢失
  onSlotInput(e) {
    const value = e.detail.value;
    const { editing } = this.data;
    if (!editing) {
      this.setData({ editingValue: value });
      return;
    }

    // 在简谱模式下，允许更多字符（包括上标、音高符号等）
    // 在数字谱模式下，允许最多2个字符
    const maxLen = this.data.notationType === 'simplified' ? 20 : 2;
    if (value.length > maxLen) {
      return;
    }

    // 只更新 editingValue，不立即更新 notations
    this.setData({ 
      editingValue: value,
      virtualKeyboardDisplay: value,
      virtualKeyboardRendered: this.renderNoteForDisplay(value)
    });
    
    // 记录需要保存
    this.prevEditingValue = value;
  },

  // 完成输入（确认或失焦），写入谱面并保存（可传入上下文，避免竞态）
  commitInlineEdit(ctx, value) {
    const context = ctx || this.data.editing;
    const val = typeof value === 'string' ? value : this.data.editingValue;
    if (!context) return;

    const notations = this.data.notations;
    const notationIndex = notations.findIndex(n => n.id === (typeof context.sheet === 'string' ? parseInt(context.sheet) : context.sheet));
    if (notationIndex === -1) return;
    
    const notation = notations[notationIndex];
    const mIdx = typeof context.measure === 'string' ? parseInt(context.measure) : context.measure;
    const bIdx = typeof context.beat === 'string' ? parseInt(context.beat) : context.beat;
    const subIdx = typeof context.subdivision === 'string' ? parseInt(context.subdivision) : context.subdivision;
    const iIdx = typeof context.index === 'string' ? parseInt(context.index) : context.index;
    const beat = notation.measures[mIdx]?.beats[bIdx];
    if (!beat) return;
    const subdivision = beat.subdivisions[subIdx];
    if (!subdivision) return;

    if (!Array.isArray(subdivision.rightHand)) subdivision.rightHand = ['', ''];
    if (!Array.isArray(subdivision.leftHand)) subdivision.leftHand = ['', ''];
    if (subdivision.rightHand.length < 2) subdivision.rightHand = [subdivision.rightHand[0] || '', ''];
    if (subdivision.leftHand.length < 2) subdivision.leftHand = [subdivision.leftHand[0] || '', ''];

    const handKey = context.hand === 'right' ? 'rightHand' : 'leftHand';
    
    // 获取旧值，检查是否改变
    const oldValue = subdivision[handKey][iIdx] || '';
    const hasChanged = oldValue !== val;
    
    if (!hasChanged) return; // 如果没有改变，不需要备份和更新
    
    // 使用路径更新，只更新单个值
    const path = `notations[${notationIndex}].measures[${mIdx}].beats[${bIdx}].subdivisions[${subIdx}].${handKey}[${iIdx}]`;
    const updateData = {};
    updateData[path] = val;
    
    // 记录编辑动作（优化版撤销）
    const editAction = this.recordNoteEditAction(
      notationIndex, mIdx, bIdx, subIdx, handKey, iIdx, oldValue, val
    );
    this.backupCurrentState(editAction);
    
    this.setData(updateData);
    
    // Quick Win: 使用节流保存，避免频繁写入Storage
    this.throttledSaveNotations();
  },

  onSlotConfirm(e) {
    const ds = e.currentTarget.dataset || {};
    const ctx = { sheet: ds.sheet, measure: ds.measure, beat: ds.beat, subdivision: ds.subdivision, hand: ds.hand, index: ds.index };
    this.commitInlineEdit(ctx, e.detail.value);
  },

  onSlotBlur(e) {
    const ds = e.currentTarget.dataset || {};
    const ctx = { sheet: ds.sheet, measure: ds.measure, beat: ds.beat, subdivision: ds.subdivision, hand: ds.hand, index: ds.index };
    this.commitInlineEdit(ctx, e.detail.value);
  },  // 输入框变化（使用实例变量避免输入回退）
  onEditInput(e) {
    this._editValue = e.detail.value;
  },

  // 确认编辑
  confirmEdit() {
    const { currentEdit, notations } = this.data;
    // 从实例变量读取最新值
    const editValue = this._editValue !== undefined ? this._editValue : this.data.editValue;
    
    // 防护检查：currentEdit是null或undefined
    if (!currentEdit) {
      this._editValue = undefined;
      this.setData({ showEditModal: false });
      return;
    }

    const updatedNotations = JSON.parse(JSON.stringify(notations));

    if (currentEdit.type === 'title') {
      this._editValue = undefined;
      this.setData({ mainTitle: editValue, showEditModal: false, currentEdit: null });
      this.saveTitles();
      this.markNotationChanged(); // 标记为有更改
      return;
    } else if (currentEdit.type === 'subtitle') {
      this._editValue = undefined;
      this.setData({ subTitle: editValue, showEditModal: false, currentEdit: null });
      this.saveTitles();
      this.markNotationChanged(); // 标记为有更改
      return;
    } else if (currentEdit.type === 'globalTempo') {
      this._editValue = undefined;
      this.setData({ globalTempo: parseInt(editValue) || 60, showEditModal: false, currentEdit: null });
      this.saveGlobalTempo();
      return;
    } else if (currentEdit.type === 'label') {
      const notation = updatedNotations.find(n => n.id === currentEdit.id);
      if (notation) {
        notation.label = editValue;
      }
    } else if (currentEdit.type === 'note') {
      const notation = updatedNotations.find(n => n.id === currentEdit.sheet);
      if (notation && notation.measures[currentEdit.measure] && notation.measures[currentEdit.measure].beats[currentEdit.beat]) {
        const subdivision = notation.measures[currentEdit.measure].beats[currentEdit.beat].subdivisions[currentEdit.subdivision];
        if (subdivision) {
          // 若旧数据里 rightHand/leftHand 为字符串，先转换为数组
          if (!Array.isArray(subdivision.rightHand)) {
            subdivision.rightHand = typeof subdivision.rightHand === 'string' ? [subdivision.rightHand || '', ''] : ['', ''];
          }
          if (!Array.isArray(subdivision.leftHand)) {
            subdivision.leftHand = typeof subdivision.leftHand === 'string' ? [subdivision.leftHand || '', ''] : ['', ''];
          }
          // 保证数组长度至少为2
          if (subdivision.rightHand.length < 2) subdivision.rightHand = [subdivision.rightHand[0] || '', ''];
          if (subdivision.leftHand.length < 2) subdivision.leftHand = [subdivision.leftHand[0] || '', ''];

          if (currentEdit.hand === 'right') {
            subdivision.rightHand[currentEdit.index] = editValue;
          } else {
            subdivision.leftHand[currentEdit.index] = editValue;
          }
        }
      }
    }

    this.saveNotationsScoped(updatedNotations);
    this.setNotations(updatedNotations);
    this._editValue = undefined;
    this.setData({ showEditModal: false, currentEdit: null });
  },

  // 关闭弹窗
  closeModal() {
    this._editValue = undefined;
    this.setData({ showEditModal: false });
  },

  // 阻止冒泡
  stopPropagation() {},

  // 清除编辑状态（点击空白区域时调用）
  clearEditing() {
    // 【任务2】选中模式下，禁止通过点击空白处触发任何操作（防止误触）
    if (this.data.isSelectingBeats) {
      return;
    }
    
    // 处理Canvas模式的编辑状态
    if (this.data.canvasEditing) {
      this.commitCanvasEdit();
      this.setData({
        canvasEditing: null,
        canvasEditingValue: '',
        canvasUseNativeInput: false,
        showVirtualKeyboard: false,
        superscriptMode: null,
        superscriptContent: ''
      }, () => { this.syncVkDotAndArpeggioState(); });
      wx.showTabBar({ animation: true });
      return;
    }
    
    // 处理View模式的编辑状态
    if (this.data.editing) {
      // 先提交当前编辑
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
      
      this.setData({ 
        editing: null, 
        editingValue: '',
        showVirtualKeyboard: false,
        superscriptMode: null,
        superscriptContent: ''
      }, () => { this.syncVkDotAndArpeggioState(); });
      this.prevEditing = null;
      this.prevEditingValue = '';

      // 收起键盘时恢复tabBar
      wx.showTabBar({ animation: true });
    }
  },

  // 深拷贝 notations 并显式保留 subdivision 的 hasArpeggio 和 annotation（避免传参/序列化丢失）
  cloneNotationsForExport(notations) {
    return (notations || []).map(n => {
      const notation = { ...n };
      notation.measures = (n.measures || []).map(m => {
        const measure = { ...m };
        measure.beats = (m.beats || []).map(b => {
          const beat = { ...b };
          beat.subdivisions = (b.subdivisions || []).map(sub => {
            const cloned = {
              rightHand: Array.isArray(sub.rightHand) ? [...sub.rightHand] : ['', ''],
              leftHand: Array.isArray(sub.leftHand) ? [...sub.leftHand] : ['', '']
            };
            if (sub.hasArpeggio === true) cloned.hasArpeggio = true;
            // 【修复】保留注记字段
            if (sub.annotation) cloned.annotation = sub.annotation;
            return cloned;
          });
          return beat;
        });
        return measure;
      });
      return notation;
    });
  },

  // 导出选择
  exportPDF() {
    // 将谱面数据存储到全局，供导出页面使用（深拷贝并保留 hasArpeggio）
    const app = getApp();
    app.globalData.exportData = {
      notations: this.cloneNotationsForExport(this.data.notations),
      mainTitle: this.data.mainTitle,
      subTitle: this.data.subTitle,
      globalTempo: this.data.globalTempo,
      mainTitleColor: this.data.mainTitleColor,
      subTitleColor: this.data.subTitleColor,
      rightHandColor: this.data.rightHandColor,
      leftHandColor: this.data.leftHandColor,
      orientation: this.data.orientation,
      measuresPerRow: this.data.measuresPerRow,
      // 元信息
      composer: this.data.composer,
      rootNote: this.data.rootNote,
      scaleType: this.data.scaleType,
      noteCount: this.data.noteCount,
      introduction: this.data.introduction,
      notationType: this.data.notationType,
      difficulty: this.data.difficulty
    };
    
    // 跳转到导出页面
    wx.navigateTo({
      url: '/subpackages/packageA/page/export/export'
    });
  },

  // 触发保存弹窗
  saveToLibrary() {
    // 如果当前谱面来自library文件，显示保存模式选择
    if (this.data.libraryFileId) {
      this.setData({ showSaveModeModal: true });
    } else {
      // 新谱面，直接打开另存为弹窗
      this.openSaveAsDialog();
    }
  },

  // 打开另存为对话框
  openSaveAsDialog() {
    this.setData({
      showSaveToLibraryModal: true,
      saveFileName: this.data.mainTitle || '未命名',
      saveTargetPath: [],
      saveFolderOptions: []
    });
    this.refreshSaveFolderView([]);
  },

  // 保存模式选择
  selectSaveMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ showSaveModeModal: false });
    
    if (mode === 'overwrite') {
      // 保存原文件修改
      this.saveToOriginalFile();
    } else if (mode === 'saveas') {
      // 另存为
      this.openSaveAsDialog();
    }
  },

  // 关闭保存模式选择弹窗
  closeSaveModeModal() {
    this.setData({ showSaveModeModal: false });
  },

  // 保存原文件修改
  saveToOriginalFile() {
    try {
      const code = this.generateNotationCode();
      const updatePayload = {
        file_name: this.data.libraryFileName,
        title: this.data.mainTitle || this.data.libraryFileName,
        author: this.data.subTitle || 'Author: Unknown',
        tempo: this.data.globalTempo || 60,
        rotation: this.data.orientation === 'landscape' ? '手机横屏/平板模式' : '手机竖屏（默认）',
        timing: `${this.data.timeSignatureBeats || 4}/${this.data.timeSignatureBottom || 4}`,
        notationType: this.data.notationType || 'digital',
        composer: this.data.composer,
        rootNote: this.data.rootNote,
        scaleType: this.data.scaleType,
        noteCount: this.data.noteCount,
        difficulty: this.data.difficulty,
        introduction: this.data.introduction,
        conversionRootNote: this.data.conversionRootNote || 'F3',
        globalStyle: this.data.globalStylePortrait,
        code
      };

      const success = libraryManager.updateFile(this.data.libraryFileId, updatePayload);
      if (success) {
        wx.showToast({ title: '已更新原文件', icon: 'success' });
        this.markNotationSaved(); // 标记为已保存
      } else {
        wx.showToast({ title: '未找到原文件', icon: 'none' });
      }
    } catch (err) {
      wx.showToast({ title: '更新失败: ' + err.message, icon: 'none' });
    }
  },

  selectSaveFolder(e) {
    const path = e.currentTarget.dataset.path;
    this.setData({ saveTargetPath: path });
  },

  closeSaveToLibraryModal(silent) {
    const suppressToast = silent === true;
    // 仅用户取消时清除「保存后打开」的待加载数据；来自 confirmSaveToLibrary 的关闭不清除，以便保存后应用
    if (this.data._pendingLoadAfterSave && !suppressToast) {
      wx.removeStorageSync('pending_notation_load');
    }
    this.setData({ showSaveToLibraryModal: false, saveFolderOptions: [], saveFileName: '', saveTargetPath: [], saveFolderItems: [], saveFolderBreadcrumbs: [], saveFolderCurrentPath: [], _pendingLoadAfterSave: false });
    if (!suppressToast) {
      wx.showToast({ title: '已取消保存', icon: 'none' });
    }
  },

  onSaveFileNameInput(e) {
    this.setData({ saveFileName: e.detail.value });
  },

  confirmSaveToLibrary() {
    const name = (this.data.saveFileName || '').trim();
    if (!name) {
      wx.showToast({ title: '请输入文件名', icon: 'none' });
      return;
    }

    try {
      const code = this.generateNotationCode();
      const payload = {
        file_name: name,
        title: this.data.mainTitle || name,
        author: this.data.subTitle || 'Author: Unknown',
        tempo: this.data.globalTempo || 60,
        rotation: this.data.orientation === 'landscape' ? '手机横屏/平板模式' : '手机竖屏（默认）',
        timing: `${this.data.timeSignatureBeats || 4}/${this.data.timeSignatureBottom || 4}`,
        notationType: this.data.notationType || 'digital',
        composer: this.data.composer,
        rootNote: this.data.rootNote,
        scaleType: this.data.scaleType,
        noteCount: this.data.noteCount,
        difficulty: this.data.difficulty,
        introduction: this.data.introduction,
        conversionRootNote: this.data.conversionRootNote || 'F3',
        globalStyle: this.data.globalStylePortrait,
        code
      };

      const created = libraryManager.addFile(this.data.saveTargetPath || [], payload);
      wx.setStorageSync('latest_notation_snapshot_for_library', created);
      wx.showToast({ title: `已保存：${created.file_name}`, icon: 'success' });
      
      // 更新当前文件的library关联信息
      this.setData({
        libraryFileId: created.id,
        libraryFilePath: created.path,
        libraryFileName: created.file_name
      });
      this.saveLibraryFileInfo(); // 持久化库文件关联信息
      this.markNotationSaved(); // 标记为已保存

      this.closeSaveToLibraryModal(true);

      // 若为曲库「保存后打开」流程（当前未保存）：保存完成后加载待打开的曲谱
      const pendingLoad = wx.getStorageSync('pending_notation_load');
      if (pendingLoad && pendingLoad.code && this.data._pendingLoadAfterSave) {
        wx.removeStorageSync('pending_notation_load');
        this.setData({ _pendingLoadAfterSave: false });
        this.showPageLoadingOverlay();
        this.applyLibraryPayload(pendingLoad);
      }
    } catch (err) {
      wx.showToast({ title: '保存失败: ' + err.message, icon: 'none' });
    }
  },

  // 保存弹窗：刷新当前目录内容与面包屑
  refreshSaveFolderView(path = []) {
    const items = libraryManager.getItemsByPath(path || []);
    const folders = items.filter(i => i.type === 'folder');
    const files = items.filter(i => i.type === 'file');
    const breadcrumbs = this.generateSaveBreadcrumbs(path || []);
    this.setData({
      saveFolderCurrentPath: path,
      saveFolderItems: [...folders, ...files],
      saveFolderBreadcrumbs: breadcrumbs,
      saveTargetPath: path
    });
  },

  generateSaveBreadcrumbs(path = []) {
    return path.map((folderId, index) => {
      const folder = libraryManager.getFolderById(folderId);
      return {
        id: folderId,
        name: folder ? folder.name : '未知',
        index,
        display: folder ? folder.name : '未知'
      };
    });
  },

  navigateSaveRoot() {
    this.refreshSaveFolderView([]);
  },

  navigateSaveBreadcrumb(e) {
    const index = e.currentTarget.dataset.index;
    const newPath = this.data.saveFolderCurrentPath.slice(0, index + 1);
    this.refreshSaveFolderView(newPath);
  },

  backSaveFolder() {
    if (!this.data.saveFolderCurrentPath || this.data.saveFolderCurrentPath.length === 0) return;
    const newPath = this.data.saveFolderCurrentPath.slice(0, -1);
    this.refreshSaveFolderView(newPath);
  },

  enterSaveFolder(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || item.type !== 'folder') return;
    const newPath = [...this.data.saveFolderCurrentPath, item.id];
    this.refreshSaveFolderView(newPath);
  },

  // 生成乐谱代码
  // 生成谱面代码（支持单个或多个module）
  generateCodeForNotations(notations) {
    if (!notations || notations.length === 0) {
      throw new Error('当前谱面为空');
    }

    let code = '';
    
    for (const notation of notations) {
      // 支持备注格式: \begin{module}{名称}{备注}
      const remarkPart = notation.remark ? `{${notation.remark}}` : '';
      // 支持排版样式格式: \begin{module}{名称}{备注}{排版参数}
      const stylePart = this.generateStyleParam(notation.style);
      code += `\\begin{module}{${notation.label}}${remarkPart}${stylePart}\n`;
      
      // 根据模板确定每行小节数
      const measuresPerRow = this.getMeasuresPerRowForNotation(notation);
      const totalMeasures = notation.measures.length;
      
      for (let i = 0; i < totalMeasures; i += measuresPerRow) {
        const rowMeasures = notation.measures.slice(i, Math.min(i + measuresPerRow, totalMeasures));
        const lineCode = this.generateLineCode(rowMeasures);
        
        // 生成行内注记代码
        const annotationCode = this.generateLineAnnotationCode(rowMeasures);
        
        // 【新增】检查并生成占位拍标记
        const placeholderCount = this.countLinePlaceholderBeats(rowMeasures);
        const placeholderMark = placeholderCount > 0 ? `#${placeholderCount}` : '';
        
        code += lineCode;
        if (annotationCode) {
          code += annotationCode;
        }
        // 添加占位拍标记
        if (placeholderMark) {
          code += placeholderMark;
        }
        
        // 如果不是最后一行，添加换行符
        if (i + measuresPerRow < totalMeasures) {
          code += '\\\\\n';
        } else {
          code += '\n';
        }
      }
      
      code += `\\end{module}\n\n`;
    }
    
    return code.trim();
  },

  // 生成排版样式参数字符串
  // 返回 {h:160,f:28,s:65} 格式，如果与全局样式相同则返回空字符串
  generateStyleParam(style) {
    if (!style) return '';
    
    const gs = this.getGlobalStyleDefaults();
    const parts = [];
    if (style.measureHeight && style.measureHeight !== gs.measureHeight) {
      parts.push(`h:${style.measureHeight}`);
    }
    if (style.noteFontSize && style.noteFontSize !== gs.noteFontSize) {
      parts.push(`f:${style.noteFontSize}`);
    }
    if (style.lineSpacing && style.lineSpacing !== gs.lineSpacing) {
      parts.push(`s:${style.lineSpacing}`);
    }
    
    return parts.length > 0 ? `{${parts.join(',')}}` : '';
  },

  // 生成行内注记代码
  // 返回 /*"1:速度渐快","5:重音"*/ 格式，如果没有注记则返回空字符串
  generateLineAnnotationCode(measures) {
    const annotations = [];
    let globalIndex = 1;
    
    for (const measure of measures) {
      for (const beat of measure.beats || []) {
        // 【修复】跳过占位拍
        if (beat.isPlaceholder) continue;
        
        for (const subdivision of beat.subdivisions || []) {
          if (subdivision.annotation) {
            annotations.push(`"${globalIndex}:${subdivision.annotation}"`);
          }
          globalIndex++;
        }
      }
    }
    
    return annotations.length > 0 ? `/*${annotations.join(',')}*/` : '';
  },

  // 生成整个谱面的代码
  generateNotationCode() {
    return this.generateCodeForNotations(this.data.notations);
  },

  // 生成一行的代码（包含一个或多个小节）
  generateLineCode(measures) {
    let lineCode = '';
    
    for (let i = 0; i < measures.length; i++) {
      const measure = measures[i];
      lineCode += this.generateMeasureCode(measure);
      
      // 如果不是最后一个小节，添加小节间连接
      if (i < measures.length - 1) {
        lineCode += ' ';
      }
    }
    
    return lineCode;
  },

  // 生成单个小节的代码（跳过占位拍）
  generateMeasureCode(measure) {
    let code = '[';
    
    // 【修复】过滤掉占位拍
    const realBeats = measure.beats.filter(beat => !beat.isPlaceholder);
    
    for (let i = 0; i < realBeats.length; i++) {
      const beat = realBeats[i];
      code += this.generateBeatCode(beat);
      
      // 如果不是最后一拍，添加拍号线
      if (i < realBeats.length - 1) {
        // 检查是否有小节线（自定义拍号中的分组）
        if (beat.barLineAfter) {
          code += '][';
        } else {
          code += '|';
        }
      }
    }
    
    code += ']';
    return code;
  },
  
  // 【新增】统计一行小节中的占位拍数量（只统计最后一个小节的末尾占位拍）
  countLinePlaceholderBeats(measures) {
    if (!measures || measures.length === 0) return 0;
    
    // 只检查最后一个小节
    const lastMeasure = measures[measures.length - 1];
    if (!lastMeasure || !lastMeasure.beats) return 0;
    
    // 从末尾开始统计连续的占位拍数量
    let count = 0;
    for (let i = lastMeasure.beats.length - 1; i >= 0; i--) {
      if (lastMeasure.beats[i].isPlaceholder) {
        count++;
      } else {
        break;
      }
    }
    
    return count;
  },

  // 生成单拍的代码
  generateBeatCode(beat) {
    let code = '';
    
    for (let i = 0; i < beat.subdivisions.length; i++) {
      const subdivision = beat.subdivisions[i];
      code += this.generateSubdivisionCode(subdivision);
      
      // 如果不是最后一个细分，添加分隔符
      if (i < beat.subdivisions.length - 1) {
        code += '+';
      }
    }
    
    return code;
  },

  // 检查音符是否需要用<>包裹（包含特殊修饰符 ' , ^ _）
  needsNoteBracket(note) {
    if (!note || note.length === 0) return false;
    // 检查是否包含特殊修饰符
    return /['',,\^_]/.test(note) || note.length > 1;
  },

  // 为需要的音符添加<>包裹
  wrapNoteIfNeeded(note) {
    if (!note || note.length === 0) return note;
    if (this.needsNoteBracket(note)) {
      // 如果已经被包裹，则不重复包裹
      if ((note.startsWith('<') && note.endsWith('>')) || 
          (note.startsWith('{') && note.endsWith('}'))) {
        return note;
      }
      return `<${note}>`;
    }
    return note;
  },

  // 生成单个subdivision的代码（含琶音 ~ 前缀）
  generateSubdivisionCode(subdivision) {
    const rightHand = subdivision.rightHand || ['', ''];
    const leftHand = subdivision.leftHand || ['', ''];
    
    // 检查是否为空音符
    const hasAnyNote = rightHand[0] || rightHand[1] || leftHand[0] || leftHand[1];
    if (!hasAnyNote) {
      return '-';
    }
    
    // 生成右手和左手字符串（自动为特殊音符添加包裹）
    const rightStr = this.generateHandCode(rightHand, 'right');
    const leftStr = this.generateHandCode(leftHand, 'left');
    const noteCode = `(${rightStr})/(${leftStr})`;
    return subdivision.hasArpeggio ? `~${noteCode}` : noteCode;
  },

  // 生成单手的代码
  generateHandCode(hand, handType) {
    const note0 = hand[0] || '';
    const note1 = hand[1] || '';
    
    if (!note0 && !note1) {
      return '';
    }
    
    // 为包含特殊修饰符的音符添加<>包裹
    const wrappedNote0 = this.wrapNoteIfNeeded(note0);
    const wrappedNote1 = this.wrapNoteIfNeeded(note1);
    
    if (wrappedNote0 && wrappedNote1) {
      // 两个音符都存在
      return `${wrappedNote0},${wrappedNote1}`;
    }
    
    // 只有一个音符
    if (handType === 'right') {
      // 右手：如果只有note1（靠近中轴），直接返回
      // 如果只有note0（远离中轴），返回
      if (wrappedNote1) {
        return wrappedNote1;
      } else {
        return wrappedNote0;
      }
    } else {
      // 左手：如果只有note0（靠近中轴），直接返回
      // 如果只有note1（远离中轴），返回
      if (wrappedNote0) {
        return wrappedNote0;
      } else {
        return wrappedNote1;
      }
    }
  },

  // 备份当前操作（优化版：支持动作记录和完整快照两种模式）
  backupCurrentState(action) {
    // 如果没有提供action参数，使用旧的全量备份逻辑作为兜底
    if (!action) {
      console.warn('backupCurrentState called without action, falling back to full backup');
      return;
    }
    
    // 将动作添加到撤销栈
    this.data.undoStack.push(action);
    
    // 限制撤销栈大小为20步
    if (this.data.undoStack.length > 20) {
      this.data.undoStack.shift();
    }
    
    // 清空重做栈（新操作后不能重做）
    this.data.redoStack = [];
    
    this.setData({ 
      undoStack: this.data.undoStack,
      redoStack: this.data.redoStack 
    });
  },

  // 创建完整快照备份（用于删除module、重置、刷新、导入等大型操作）
  createFullSnapshotAction(actionName) {
    return {
      type: 'full_snapshot',
      name: actionName,
      timestamp: Date.now(),
      snapshot: JSON.parse(JSON.stringify(this.data.notations))
    };
  },
  
  // 记录音符编辑动作
  recordNoteEditAction(notationIndex, mIdx, bIdx, subIdx, handKey, iIdx, oldValue, newValue) {
    return {
      type: 'note_edit',
      timestamp: Date.now(),
      path: {
        notationIndex,
        measureIndex: mIdx,
        beatIndex: bIdx,
        subdivisionIndex: subIdx,
        hand: handKey,
        index: iIdx
      },
      oldValue,
      newValue
    };
  },
  
  // 应用单个动作（用于撤销/重做）
  applyAction(action, isUndo = true) {
    const { type } = action;
    
    // 处理完整快照类型
    if (type === 'full_snapshot') {
      if (isUndo) {
        // 撤销：恢复快照
        const currentSnapshot = JSON.parse(JSON.stringify(this.data.notations));
        const restoredNotations = action.snapshot;
        
        // 更新action的快照为当前状态，以便重做时可以恢复
        action.snapshot = currentSnapshot;
        
        const withOffsets = this.updateMeasureOffsets(restoredNotations);
        this.saveNotationsScoped(withOffsets);
        this.setNotations(withOffsets);
        this.calculatePages();
        return true;
      } else {
        // 重做：恢复到操作后的状态（快照中存储的是操作前的状态，所以重做时需要交换）
        const currentSnapshot = JSON.parse(JSON.stringify(this.data.notations));
        const restoredNotations = action.snapshot;
        
        // 更新action的快照为当前状态
        action.snapshot = currentSnapshot;
        
        const withOffsets = this.updateMeasureOffsets(restoredNotations);
        this.saveNotationsScoped(withOffsets);
        this.setNotations(withOffsets);
        this.calculatePages();
        return true;
      }
    }
    
    // 处理音符编辑类型
    if (type === 'note_edit') {
      const { path, oldValue, newValue } = action;
      const targetValue = isUndo ? oldValue : newValue;
      
      const notations = this.data.notations;
      const notation = notations[path.notationIndex];
      if (!notation) return false;
      
      const measure = notation.measures[path.measureIndex];
      if (!measure) return false;
      
      const beat = measure.beats[path.beatIndex];
      if (!beat) return false;
      
      const subdivision = beat.subdivisions[path.subdivisionIndex];
      if (!subdivision) return false;
      
      // 确保数组存在
      if (!Array.isArray(subdivision[path.hand])) {
        subdivision[path.hand] = ['', ''];
      }
      
      // 应用更改
      const updatePath = `notations[${path.notationIndex}].measures[${path.measureIndex}].beats[${path.beatIndex}].subdivisions[${path.subdivisionIndex}].${path.hand}[${path.index}]`;
      const updateData = {};
      updateData[updatePath] = targetValue;
      
      this.setData(updateData);
      return true;
    }
    
    // 未知的动作类型
    return false;
  },

  // 撤销上一步操作（优化版）
  undo() {
    if (this.data.undoStack.length === 0) {
      wx.showToast({ title: '没有可撤销的操作', icon: 'none' });
      return;
    }
    
    // 取出最后一个动作
    const action = this.data.undoStack.pop();
    
    // 应用撤销
    if (this.applyAction(action, true)) {
      // 将动作添加到重做栈
      this.data.redoStack.push(action);
      
      this.setData({ 
        undoStack: this.data.undoStack,
        redoStack: this.data.redoStack
      });
      
      wx.showToast({ title: '已撤销', icon: 'success', duration: 800 });
      
      // 保存到存储
      this.throttledSaveNotations();
    } else {
      // 如果应用失败，将动作放回撤销栈
      this.data.undoStack.push(action);
      wx.showToast({ title: '撤销失败', icon: 'none' });
    }
  },
  
  // 重做操作
  redo() {
    if (this.data.redoStack.length === 0) {
      wx.showToast({ title: '没有可重做的操作', icon: 'none' });
      return;
    }
    
    // 取出最后一个重做动作
    const action = this.data.redoStack.pop();
    
    // 应用重做
    if (this.applyAction(action, false)) {
      // 将动作添加回撤销栈
      this.data.undoStack.push(action);
      
      this.setData({ 
        undoStack: this.data.undoStack,
        redoStack: this.data.redoStack
      });
      
      wx.showToast({ title: '已重做', icon: 'success', duration: 800 });
      
      // 保存到存储
      this.throttledSaveNotations();
    } else {
      // 如果应用失败，将动作放回重做栈
      this.data.redoStack.push(action);
      wx.showToast({ title: '重做失败', icon: 'none' });
    }
  },

  // 导出为 PNG
  exportAsPNG() {
    // 弃用，使用新的导出流程
    this.openExportOptions();
  },

  // 打开导出选项（先测试图片加载）
  openExportOptions() {
    this.setData({ showExportOptionsModal: true });
  },

  // 关闭导出选项
  closeExportOptions() {
    this.setData({
      showExportOptionsModal: false
    });
  },

  // 已移除：导出前图片加载测试相关逻辑

  // 选择导出模式
  selectExportMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      exportMode: mode
    });
  },

  // 选择A4方向（可被导出规格弹窗复用）
  selectA4Orientation(e) {
    const orientation = e.currentTarget.dataset.orientation;
    this.setData({
      exportA4Orientation: orientation,
      a4Orientation: orientation // 保持原有字段以兼容历史逻辑
    });
  },

  // 选择导出排版模式（compact: 紧凑, loose: 宽松）
  selectExportLayoutMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      exportLayoutMode: mode
    });
  },

  // 背景图片大小变化
  onExportBgSizeChange(e) {
    this.setData({
      exportBgSize: e.detail.value / 100
    });
  },

  // 背景图片透明度变化
  onExportBgOpacityChange(e) {
    this.setData({
      exportBgOpacity: e.detail.value / 100
    });
  },

  // 选择颜色模式
  selectExportColorMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({
      exportColorMode: mode
    });
  },

  // 打开颜色选择器
  // 颜色输入框变化事件
  onExportColorInput(e) {
    const type = e.currentTarget.dataset.type;
    let value = e.detail.value.trim();
    
    // 确保颜色值以#开头
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    
    // 验证是否为有效的颜色格式
    const isValidColor = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
    if (!isValidColor && value.length > 0) {
      return; // 无效颜色不更新
    }
    
    let colorKey;
    if (type === 'rightHand') {
      colorKey = 'exportRightHandColor';
    } else if (type === 'leftHand') {
      colorKey = 'exportLeftHandColor';
    } else {
      colorKey = 'exportSingleColor';
    }
    
    if (value) {
      this.setData({ [colorKey]: value });
    }
  },

  openExportColorPicker(e) {
    const type = e.currentTarget.dataset.type;
    let colorKey;
    
    if (type === 'rightHand') {
      colorKey = 'exportRightHandColor';
    } else if (type === 'leftHand') {
      colorKey = 'exportLeftHandColor';
    } else {
      colorKey = 'exportSingleColor';
    }

    // 预设颜色列表
    const presetColors = [
      '#314D63', // 深蓝灰
      '#F4D096', // 金色
      '#8FB9AB', // 青绿
      '#E57373', // 红色
      '#64B5F6', // 蓝色
      '#81C784', // 绿色
      '#FFD54F', // 黄色
      '#BA68C8', // 紫色
      '#FF8A65', // 橙色
      '#4DB6AC', // 青色
      '#A1887F', // 棕色
      '#90A4AE', // 灰色
      '#000000', // 黑色
      '#FFFFFF'  // 白色
    ];

    wx.showActionSheet({
      itemList: ['深蓝灰', '金色', '青绿', '红色', '蓝色', '绿色', '黄色', '紫色', '橙色', '青色', '棕色', '灰色', '黑色', '白色'],
      success: (res) => {
        if (res.tapIndex >= 0 && res.tapIndex < presetColors.length) {
          this.setData({
            [colorKey]: presetColors[res.tapIndex]
          });
        }
      }
    });
  },

  // 关闭导出规格弹窗
  closeExportSpecsModal() {
    this.setData({ showExportSpecsModal: false });
  },

  // 确认导出规格并开始导出（仅用于分页模式）
  confirmExportSpecs() {
    // 关闭弹窗并开始导出
    this.setData({ showExportSpecsModal: false });

    // 紧凑模式对应横屏排版，宽松模式对应竖屏排版
    const orientationOverride = (this.data.exportLayoutMode === 'compact') ? 'landscape' : 'portrait';
    const isExportLandscape = (orientationOverride === 'landscape');
    
    // 根据排版模式重新计算每个模块的 measuresPerRow
    // 紧凑模式(横屏)：每行小节数 = 基准值 * 2
    // 宽松模式(竖屏)：每行小节数 = 基准值
    const exportNotations = this.data.notations.map(notation => {
      // 使用模块的竖屏基准值，如果没有则回退到当前值或默认值1
      const portraitBase = notation.measuresPerRowPortrait || 
                           (this.data.orientation === 'landscape' ? Math.floor(notation.measuresPerRow / 2) : notation.measuresPerRow) || 
                           1;
      const exportMeasuresPerRow = isExportLandscape ? portraitBase * 2 : portraitBase;
      return {
        ...notation,
        measuresPerRow: exportMeasuresPerRow,
        measuresPerRowPortrait: portraitBase // 保留基准值供导出工具参考
      };
    });

    wx.showLoading({ title: '生成图片中...' });
    const exportUtil = require('../../utils/pdfExport.js');
    exportUtil.exportNotationToPNG({
      notations: exportNotations,
      mainTitle: this.data.mainTitle,
      subTitle: this.data.subTitle,
      globalTempo: this.data.globalTempo,
      mainTitleColor: this.data.mainTitleColor,
      subTitleColor: this.data.subTitleColor,
      rightHandColor: this.data.rightHandColor,
      leftHandColor: this.data.leftHandColor,
      // 元信息
      composer: this.data.composer,
      rootNote: this.data.rootNote,
      scaleType: this.data.scaleType,
      noteCount: this.data.noteCount,
      introduction: this.data.introduction,
      notationType: this.data.notationType,
      difficulty: this.data.difficulty,
      // 覆盖导出时使用的方向（不改变页面的实际 orientation）
      orientation: orientationOverride,
      exportMode: 'paged',
      a4Orientation: this.data.exportA4Orientation || 'portrait',
      exportLayoutMode: this.data.exportLayoutMode || 'compact',
      // 背景图配置
      exportBgOpacity: this.data.exportBgOpacity,
      exportBgSize: this.data.exportBgSize,
      // 颜色配置
      exportColorMode: this.data.exportColorMode,
      exportSingleColor: this.data.exportSingleColor,
      exportRightHandColor: this.data.exportRightHandColor,
      exportLeftHandColor: this.data.exportLeftHandColor
    }).then(result => {
      wx.hideLoading();

      if (Array.isArray(result)) {
        // 分页模式：显示预览窗口
        this.setData({
          showExportPreview: true,
          exportPreviewImages: result,
          currentPreviewPage: 0
        });
      } else {
        wx.showToast({ title: '导出失败：未能生成分页图片', icon: 'none' });
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '导出失败: ' + (err.message || err), icon: 'none' });
    });
  },

  // 确认导出
  confirmExport() {
    const exportMode = this.data.exportMode;
    
    this.setData({
      showExportOptionsModal: false
    });

    // 如果选择的是代码模式，调用导出代码功能
    if (exportMode === 'code') {
      this.exportAsCode();
      return;
    }

    // 分页模式需要先弹出导出规格设置
    if (exportMode === 'paged') {
      this.setData({
        showExportSpecsModal: true,
        // 初始化选项使用当前值
        exportA4Orientation: this.data.a4Orientation || 'portrait',
        exportLayoutMode: this.data.exportLayoutMode || 'compact'
      });
      return;
    }

    // 非分页直接导出（长图）
    wx.showLoading({ title: '生成图片中...' });
    
    const exportUtil = require('../../utils/pdfExport.js');
    
    exportUtil.exportNotationToPNG({
      notations: this.data.notations,
      mainTitle: this.data.mainTitle,
      subTitle: this.data.subTitle,
      globalTempo: this.data.globalTempo,
      mainTitleColor: this.data.mainTitleColor,
      subTitleColor: this.data.subTitleColor,
      rightHandColor: this.data.rightHandColor,
      leftHandColor: this.data.leftHandColor,
      orientation: this.data.orientation,
      measuresPerRow: this.data.measuresPerRow,
      exportMode: this.data.exportMode,
      a4Orientation: this.data.a4Orientation
    }).then(result => {
      wx.hideLoading();
      
      if (this.data.exportMode === 'paged' && Array.isArray(result)) {
        // 分页模式：显示预览窗口
        this.setData({
          exportPreviewImages: result,
          showExportPreview: true,
          currentPreviewPage: 0
        });
      } else {
        // 长图模式：直接保存
        this.promptSaveImage(result);
      }
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '导出失败', icon: 'none' });
      console.error('导出PNG失败:', err);
    });
  },

  // 提示保存图片
  promptSaveImage(tempFilePath) {
    wx.showModal({
      title: '导出成功',
      content: '图片已生成，是否保存到相册？',
      success: (res) => {
        if (res.confirm) {
          this.saveImageToAlbum(tempFilePath);
        } else {
          wx.showToast({ title: '可在右上角分享图片', icon: 'none' });
        }
      }
    });
  },

  // 检查相册权限
  checkAlbumPermission() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum'] === false) {
            wx.showModal({
              title: '权限提示',
              content: '保存图片需要您的授权，是否去设置页面开启权限？',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting['scope.writePhotosAlbum']) {
                        resolve();
                      } else {
                        reject(new Error('AUTH_DENIED'));
                      }
                    },
                    fail: () => reject(new Error('OPEN_SETTING_FAILED'))
                  });
                } else {
                  reject(new Error('USER_CANCELLED'));
                }
              }
            });
          } else {
            resolve();
          }
        },
        fail: (err) => reject(err)
      });
    });
  },

  // 保存图片到相册
  saveImageToAlbum(filePath) {
    this.checkAlbumPermission().then(() => {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: () => {
          wx.showToast({ title: '已保存到相册', icon: 'success' });
        },
        fail: (err) => {
          if (err.errMsg.includes('auth') || err.errMsg.includes('authorize')) {
            wx.showToast({ title: '保存失败，请授权', icon: 'none' });
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      });
    }).catch(err => {
      if (err.message === 'AUTH_DENIED') {
        wx.showToast({ title: '未获得授权', icon: 'none' });
      }
    });
  },

  // 关闭预览窗口
  closeExportPreview() {
    this.setData({
      showExportPreview: false,
      exportPreviewImages: [],
      currentPreviewPage: 0
    });
  },

  // 预览页面切换
  onPreviewPageChange(e) {
    this.setData({
      currentPreviewPage: e.detail.current
    });
  },

  // 保存导出图片到相册
  saveExportImages() {
    const images = this.data.exportPreviewImages;
    let savedCount = 0;
    
    this.checkAlbumPermission().then(() => {
      wx.showLoading({ title: `保存中 0/${images.length}` });
      
      const saveNext = (index) => {
        if (index >= images.length) {
          wx.hideLoading();
          wx.showToast({ 
            title: `已保存${savedCount}张图片`, 
            icon: 'success',
            duration: 2000
          });
          this.closeExportPreview();
          return;
        }
        
        wx.saveImageToPhotosAlbum({
          filePath: images[index],
          success: () => {
            savedCount++;
            wx.showLoading({ title: `保存中 ${savedCount}/${images.length}` });
            saveNext(index + 1);
          },
          fail: (err) => {
            wx.hideLoading();
            if (err.errMsg.includes('auth') || err.errMsg.includes('authorize')) {
              wx.showModal({
                title: '保存失败',
                content: '需要保存相册权限才能导出图片',
                showCancel: false
              });
            } else {
              wx.showModal({
                title: '保存失败',
                content: `已保存${savedCount}/${images.length}张图片`,
                showCancel: false
              });
            }
          }
        });
      };
      
      saveNext(0);
    }).catch((err) => {
      if (err.message === 'AUTH_DENIED') {
        wx.showToast({ title: '未获得授权，无法保存', icon: 'none' });
      }
    });
  },

  // 显示导出格式选择弹窗
  showExportFormatModal() {
    this.setData({ showExportFormatPicker: true });
  },

  // 关闭导出格式选择弹窗
  closeExportFormatPicker() {
    this.setData({ showExportFormatPicker: false });
  },

  // 保存为PNG图片
  saveAsImages() {
    this.setData({ showExportFormatPicker: false });
    this.saveExportImages();
  },

  // 保存为PDF
  saveAsPDF() {
    this.setData({ showExportFormatPicker: false });
    
    const images = this.data.exportPreviewImages;
    if (!images || images.length === 0) {
      wx.showToast({ title: '没有可导出的图片', icon: 'none' });
      return;
    }
    
    // 显示进度弹窗
    this.setData({
      showPdfProgressModal: true,
      pdfProgressPercent: 0,
      pdfProgressStage: '准备导出...',
      pdfExportCancelled: false
    });
    
    const exportUtil = require('../../utils/pdfExport.js');
    const fileName = `${this.data.mainTitle || 'notation'}_${Date.now()}.pdf`;
    const that = this;
    
    // 进度回调函数
    const onProgress = (percent, stage) => {
      if (that.data.pdfExportCancelled) {
        return false; // 返回false表示取消
      }
      that.setData({
        pdfProgressPercent: percent,
        pdfProgressStage: stage
      });
      return true; // 返回true表示继续
    };
    
    exportUtil.imagesToPDF(images, fileName, onProgress)
      .then((pdfPath) => {
        that.setData({
          showPdfProgressModal: false,
          exportedPdfPath: pdfPath,
          exportedPdfFileName: fileName,
          showPdfSuccessModal: true
        });
        
        // 如果路径不在临时目录，说明用户已经选择了保存位置
        if (!pdfPath.includes('USER_DATA_PATH') && !pdfPath.includes('tmp')) {
          wx.showToast({ 
            title: 'PDF生成完毕', 
            icon: 'success',
            duration: 2000
          });
        }
      })
      .catch((err) => {
        that.setData({ showPdfProgressModal: false });
        if (err.message === 'USER_CANCELLED') {
          wx.showToast({ title: '已取消导出', icon: 'none' });
        } else {
          console.error('PDF导出失败:', err);
          wx.showToast({ 
            title: 'PDF导出失败: ' + (err.message || '未知错误'), 
            icon: 'none',
            duration: 3000
          });
        }
      });
  },

  // 取消PDF导出
  cancelPdfExport() {
    this.setData({
      pdfExportCancelled: true,
      pdfProgressStage: '正在取消...'
    });
  },

  // 关闭PDF成功弹窗
  closePdfSuccessModal() {
    this.setData({ showPdfSuccessModal: false });
  },

  // 分享PDF并删除临时文件
  shareAndDeletePdf() {
    const filePath = this.data.exportedPdfPath;
    const fileName = this.data.exportedPdfFileName;
    
    if (!filePath) {
      wx.showToast({ title: '文件路径无效', icon: 'none' });
      return;
    }
    
    console.log('准备分享PDF文件:', filePath);
    
    // 检查 wx.shareFileMessage API 是否可用
    if (typeof wx.shareFileMessage !== 'function') {
      wx.showToast({ 
        title: '当前环境不支持文件分享功能', 
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    // 直接使用原始文件路径进行分享
    // 不再提前删除文件，让系统有足够时间完成传输
    this._doShareFile(filePath, fileName);
  },
  
  // 实际执行文件分享
  _doShareFile(shareFilePath, fileName) {
    const fs = wx.getFileSystemManager();
    const that = this;
    
    // 调用分享功能
    wx.shareFileMessage({
      filePath: shareFilePath,
      fileName: fileName,
      success: () => {
        console.log('文件分享对话框已打开，文件路径:', shareFilePath);
        
        // 不立即关闭弹窗，让用户可以再次分享
        // 也不删除文件，避免传输中断
        wx.showToast({ 
          title: '请在聊天中完成发送', 
          icon: 'none',
          duration: 3000
        });
        
        // 注意：不要在这里删除文件！
        // wx.shareFileMessage 的 success 只表示分享对话框打开
        // 文件传输是异步的，可能需要很长时间
        // 文件会在下次导出时被 cleanupAllExportFiles 清理
      },
      fail: (err) => {
        console.error('文件分享失败:', err);
        const errMsg = err.errMsg || '';
        
        // 用户取消不算失败
        if (errMsg.includes('cancel') || errMsg.includes('取消')) {
          wx.showToast({ 
            title: '已取消分享', 
            icon: 'none',
            duration: 1500
          });
        } else {
          wx.showToast({ 
            title: '分享失败: ' + (errMsg || '未知错误'), 
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  // 关闭PDF成功弹窗并关闭预览
  closePdfSuccessAndPreview() {
    this.setData({ 
      showPdfSuccessModal: false,
      showExportPreview: false,
      exportPreviewImages: [],
      currentPreviewPage: 0
    });
  },

  // 打开导出的PDF
  openExportedPdf() {
    const path = this.data.exportedPdfPath;
    if (!path) {
      wx.showToast({ title: '文件路径无效', icon: 'none' });
      return;
    }
    
    wx.openDocument({
      filePath: path,
      showMenu: true, // 显示右上角菜单，包含转发、保存等
      success: () => {
        console.log('PDF打开成功');
      },
      fail: (err) => {
        console.error('打开PDF失败:', err);
        wx.showToast({ title: '打开失败', icon: 'none' });
      }
    });
  },

  // 分享导出的PDF
  shareExportedPdf() {
    const path = this.data.exportedPdfPath;
    if (!path) {
      wx.showToast({ title: '文件路径无效', icon: 'none' });
      return;
    }
    
    wx.shareFileMessage({
      filePath: path,
      success: () => {
        wx.showToast({ title: '分享成功', icon: 'success' });
      },
      fail: (err) => {
        console.error('分享PDF失败:', err);
        // 如果分享失败，尝试使用 openDocument 的菜单分享
        wx.showModal({
          title: '提示',
          content: '直接分享不支持，请点击"打开"后使用右上角菜单分享',
          showCancel: false
        });
      }
    });
  },

  // 保存PDF到文件管理器
  saveExportedPdfToFiles() {
    const path = this.data.exportedPdfPath;
    const fileName = this.data.exportedPdfFileName;
    if (!path) {
      wx.showToast({ title: '文件路径无效', icon: 'none' });
      return;
    }
    
    // 使用 wx.getFileSystemManager 复制到用户可访问的位置
    wx.saveFileToDisk({
      filePath: path,
      success: () => {
        wx.showToast({ title: '已保存', icon: 'success' });
      },
      fail: (err) => {
        console.error('保存到磁盘失败:', err);
        // 如果 saveFileToDisk 不支持，使用 openDocument
        wx.openDocument({
          filePath: path,
          showMenu: true,
          success: () => {
            wx.showToast({ title: '请使用右上角菜单保存', icon: 'none' });
          },
          fail: () => {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        });
      }
    });
  },

  // 导出为 PNG（旧版本，保留兼容）
  exportAsPNGOld() {
    wx.showLoading({ title: '生成图片中...' });
    
    // 导入导出工具
    const exportUtil = require('../../utils/pdfExport.js');
    
    exportUtil.exportNotationToPNG({
      notations: this.data.notations,
      mainTitle: this.data.mainTitle,
      subTitle: this.data.subTitle,
      globalTempo: this.data.globalTempo,
      mainTitleColor: this.data.mainTitleColor,
      subTitleColor: this.data.subTitleColor,
      rightHandColor: this.data.rightHandColor,
      leftHandColor: this.data.leftHandColor,
      orientation: this.data.orientation,
      measuresPerRow: this.data.measuresPerRow
    }).then(tempFilePath => {
      wx.hideLoading();
      const that = this;
      wx.showModal({
        title: '导出成功',
        content: '图片已生成，是否保存到相册？',
        success(res) {
          if (res.confirm) {
            that.saveImageToAlbum(tempFilePath);
          } else {
            wx.showToast({ title: '可在右上角分享图片', icon: 'none' });
          }
        }
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '导出失败', icon: 'none' });
      console.error('导出PNG失败:', err);
    });
  },

  // 导出为 PDF
  exportAsPDF() {
    wx.showLoading({ title: '生成PDF中...' });
    
    const exportUtil = require('../../utils/pdfExport.js');
    
    exportUtil.exportNotationToPDF({
      notations: this.data.notations,
      mainTitle: this.data.mainTitle,
      subTitle: this.data.subTitle,
      globalTempo: this.data.globalTempo,
      mainTitleColor: this.data.mainTitleColor,
      subTitleColor: this.data.subTitleColor,
      rightHandColor: this.data.rightHandColor,
      leftHandColor: this.data.leftHandColor,
      orientation: this.data.orientation
    }).then(tempFilePath => {
      wx.hideLoading();
      wx.openDocument({
        filePath: tempFilePath,
        fileType: 'pdf',
        success() {
          wx.showToast({ title: 'PDF已生成', icon: 'success' });
        },
        fail(err) {
          wx.showToast({ title: '打开PDF失败', icon: 'none' });
          console.error('打开PDF失败:', err);
        }
      });
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({ title: '导出失败', icon: 'none' });
      console.error('导出PDF失败:', err);
    });
  },

  // ============ 节拍器相关方法 ============
  
  // 加载节拍器设置（使用谱面标题页的速度和拍号设置）
  loadMetronomeSettings() {
    // 速度使用当前谱面的 globalTempo
    const tempo = this.data.globalTempo || 60;
    // 拍数使用当前谱面的拍号设置
    const beatsCount = this.data.timeSignatureBeats || 4;
    
    const beats = Array.from({ length: beatsCount }, (_, i) => i + 1);
    this.setData({ 
      metronomeTempo: tempo,
      metronomeBeatsCount: beatsCount,
      metronomeBeats: beats
    });
  },

  // 切换悬浮节拍器显示
  toggleFloatingMetronome() {
    // 播放模式下使用同步节拍器
    if (this.data.isPlaybackMode && this.data.isPlaying) {
      if (this.data.showFloatingMetronome) {
        this.setData({ showFloatingMetronome: false });
        if (sheetPlaybackManager) {
          sheetPlaybackManager.setMetronomeEnabled(false);
        }
      } else {
        this.loadMetronomeSettings();
        this.setData({ showFloatingMetronome: true });
        // 同步启动节拍器（等待下一个正拍）
        if (sheetPlaybackManager) {
          sheetPlaybackManager.syncMetronomeStart();
        }
      }
      return;
    }

    // 普通模式
    if (this.data.showFloatingMetronome) {
      this.closeFloatingMetronome();
    } else {
      // 重新加载最新设置
      this.loadMetronomeSettings();
      this.setData({ 
        showFloatingMetronome: true,
        actionCollapsed: true  // 收起菜单栏
      });
      this.startMetronome();
    }
  },

  // 关闭悬浮节拍器
  closeFloatingMetronome() {
    this.stopMetronome();
    this.setData({ 
      showFloatingMetronome: false,
      currentMetronomeBeat: -1
    });
  },

  // Quick Win: 启动节拍器 - 使用内存变量和节流setData
  startMetronome() {
    this.ensureMetronomeAudio();
    this._metronomeBeat = 0;
    this._lastMetronomeUpdate = 0;
    this.setData({ currentMetronomeBeat: 0 });
    const interval = 60000 / this.data.metronomeTempo; // 毫秒
    const beatCount = this.data.metronomeBeatsCount;

    this.playMetronomeTick(true); // 播放第一拍（强拍）

    // 使用setInterval + 节流setData
    this.data.metronomeTimer = setInterval(() => {
      this._metronomeBeat = (this._metronomeBeat + 1) % beatCount;
      const now = Date.now();
      // 节流：最多100ms更新一次UI
      if (now - this._lastMetronomeUpdate >= 100) {
        this.setData({ currentMetronomeBeat: this._metronomeBeat });
        this._lastMetronomeUpdate = now;
      }
      this.playMetronomeTick(this._metronomeBeat === 0); // 第一拍是强拍
    }, interval);
  },

  // 停止节拍器
  stopMetronome() {
    if (this.data.metronomeTimer) {
      clearInterval(this.data.metronomeTimer);
      this.data.metronomeTimer = null;
    }
    this.setData({ currentMetronomeBeat: -1 });
  },

  // ===== 翻页加载遮罩 & 悬浮节拍器（80bpm） =====
  showPageLoadingOverlay() {
    this.stopOverlayMetronome();
    this.setData({
      showPageLoadingOverlay: true,
      overlayMetronomeBeat: 0
    });
    this.startOverlayMetronome();
  },

  hidePageLoadingOverlay() {
    this.stopOverlayMetronome();
    this.setData({ showPageLoadingOverlay: false, overlayMetronomeBeat: -1 });
  },

  startOverlayMetronome() {
    this.stopOverlayMetronome();
    const interval = 60000 / (this.data.overlayMetronomeTempo || 80);
    // 仅播放声音，不再通过 setData 驱动动画，改用纯 CSS 动画
    this.playMetronomeTick(true, false);
    let beatIndex = 0;
    this.overlayMetronomeTimer = setInterval(() => {
      beatIndex = (beatIndex + 1) % 4;
      const isAccent = beatIndex === 0;
      this.playMetronomeTick(isAccent, false);
    }, interval);
  },

  stopOverlayMetronome() {
    if (this.overlayMetronomeTimer) {
      clearInterval(this.overlayMetronomeTimer);
      this.overlayMetronomeTimer = null;
    }
  },

  // 播放节拍音效
  playMetronomeTick(isAccent, enableVibration = true) {
    this.ensureMetronomeAudio();
    const ctx = isAccent ? this.highAudioCtx : this.lowAudioCtx;
    try {
      ctx.stop();
      if (ctx.seek) ctx.seek(0);
    } catch (err) {}
    ctx.play();

    // 震动反馈（可选，用于常规节拍器；页面切换节拍器禁用）
    if (enableVibration) {
      wx.vibrateShort({ type: isAccent ? 'heavy' : 'light' });
    }
  },

  // 确保节拍器音频已初始化
  ensureMetronomeAudio() {
    if (!this.highAudioCtx) {
      const ctxHigh = wx.createInnerAudioContext();
      ctxHigh.src = '/assets/metronome/soundhigh.mp3';
      ctxHigh.volume = 0.85;
      this.highAudioCtx = ctxHigh;
    }
    if (!this.lowAudioCtx) {
      const ctxLow = wx.createInnerAudioContext();
      ctxLow.src = '/assets/metronome/soundlow.mp3';
      // 提升响度 1.2 倍，最高不超过 1.0
      ctxLow.volume = Math.min(1, 0.85 * 1.2);
      this.lowAudioCtx = ctxLow;
    }
  },

  // 销毁节拍器音频
  destroyMetronomeAudio() {
    if (this.highAudioCtx) {
      this.highAudioCtx.destroy();
      this.highAudioCtx = null;
    }
    if (this.lowAudioCtx) {
      this.lowAudioCtx.destroy();
      this.lowAudioCtx = null;
    }
  },

  // 预加载Logo图片以优化加载遮罩显示速度
  preloadLogoImage() {
    wx.getImageInfo({
      src: '/assets/img/logo.png',
      success: (res) => {
        console.log('Logo图片预加载成功', res.width, res.height);
      },
      fail: (err) => {
        console.warn('Logo图片预加载失败', err);
      }
    });
  },

  // ========== 导入功能相关方法 ==========

  // 打开导入模态窗口（添加新模块模式）
  openImportModal() {
    // 如果用户未选择"不再显示"，则优先显示帮助文档
    if (!this.data.importHelpDismissed) {
      this.setData({
        showImportHelpModal: true,
        importMode: 'add',
        importTargetModuleId: null
      });
    } else {
      this.setData({
        showImportModal: true,
        importCode: '',
        importError: '',
        importMode: 'add',
        importTargetModuleId: null
      });
    }
  },

  // 打开模块导入（覆盖模式）
  openModuleImport(e) {
    const moduleId = parseInt(e.currentTarget.dataset.id);
    // 如果用户未选择"不再显示"，则优先显示帮助文档
    if (!this.data.importHelpDismissed) {
      this.setData({
        showImportHelpModal: true,
        importMode: 'replace',
        importTargetModuleId: moduleId,
        showModuleSettingsModal: false
      });
    } else {
      this.setData({
        showImportModal: true,
        importCode: '',
        importError: '',
        importMode: 'replace',
        importTargetModuleId: moduleId,
        showModuleSettingsModal: false
      });
    }
  },

  // 关闭导入模态窗口
  closeImportModal() {
    // 清理实例变量
    this._importCode = undefined;
    
    this.setData({
      showImportModal: false,
      importCode: '',
      importError: '',
      importMode: 'add',
      importTargetModuleId: null
    });
  },

  // 显示导入帮助
  showImportHelp() {
    this.setData({
      showImportHelpModal: true
    });
  },

  // 关闭导入帮助（知道了）
  closeImportHelp() {
    this.setData({
      showImportHelpModal: false
    });
    // 如果是从导入入口进入的帮助，关闭后打开导入窗口
    if (this.data.importMode) {
      this.setData({
        showImportModal: true,
        importCode: '',
        importError: ''
      });
    }
  },

  // 不再显示导入帮助
  dismissImportHelp() {
    // 保存用户选择
    wx.setStorageSync('importHelpDismissed', true);
    this.setData({
      importHelpDismissed: true,
      showImportHelpModal: false
    });
    
    // 提示用户可以通过help图标再次打开
    wx.showToast({
      title: '可点击帮助图标再次查看',
      icon: 'none',
      duration: 2500
    });
    
    // 打开导入窗口
    this.setData({
      showImportModal: true,
      importCode: '',
      importError: ''
    });
  },

  // 输入导入代码（使用实例变量避免输入回退）
  onImportCodeInput(e) {
    this._importCode = e.detail.value;
  },

  // 检测是否为完整曲谱 JSON 格式
  isFullNotationJSON(code) {
    try {
      const trimmed = code.trim();
      // 检查是否以 { 开头且以 } 结尾
      if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
        return false;
      }
      
      const parsed = JSON.parse(trimmed);
      // 检查是否包含必要的完整曲谱格式标识
      return parsed.format === 'handpan-notation' && 
             parsed.version && 
             parsed.metadata && 
             parsed.modules;
    } catch (e) {
      return false;
    }
  },

  // 导入完整曲谱 JSON（替换整个曲谱的所有信息）
  importFullNotationJSON(code) {
    try {
      const fullNotation = JSON.parse(code.trim());
      
      // 验证格式
      if (fullNotation.format !== 'handpan-notation') {
        throw new Error('无效的曲谱格式标识');
      }
      
      const { metadata, colors, layout, modules } = fullNotation;
      
      // 解析谱面代码（LaTeX 格式的 modules）
      const parsedModules = this.parseImportCode(modules);
      
      if (!parsedModules || parsedModules.length === 0) {
        throw new Error('未能解析出有效的模块数据');
      }
      
      // 转换为 notation 格式
      const newNotations = parsedModules.map(module => this.convertToNotation(module));
      const notationsWithOffsets = this.updateMeasureOffsets(newNotations);
      
      // 构建更新数据（曲谱信息 + 颜色 + 布局）
      const updateData = {
        // 元信息
        mainTitle: metadata.title || '',
        subTitle: metadata.author || metadata.subtitle || '', // 向后兼容：优先读取author
        composer: metadata.composer || 'Your Name',
        rootNote: metadata.rootNote || 'D',
        scaleType: metadata.scaleType || 'Kurd',
        noteCount: metadata.noteCount || 10,
        difficulty: metadata.difficulty || 1,
        introduction: metadata.introduction || '',
        globalTempo: metadata.tempo || 60,
        notationType: metadata.notationType || 'digital',
        // 颜色配置
        mainTitleColor: (colors && colors.mainTitleColor) || '#314D63',
        subTitleColor: (colors && colors.subTitleColor) || '#8FB9AB',
        rightHandColor: (colors && colors.rightHandColor) || '#F4D096',
        leftHandColor: (colors && colors.leftHandColor) || '#314D63',
        // 布局配置
        orientation: (layout && layout.orientation) || 'portrait',
        measuresPerRow: (layout && layout.measuresPerRow) || 1
      };
      
      // 更新页面数据
      this.setData(updateData);
      
      // 保存谱面数据
      this.saveNotationsScoped(notationsWithOffsets);
      this.setNotations(notationsWithOffsets);
      
      // 保存标题到本地存储
      this.saveTitles();
      
      // 保存颜色配置到本地存储
      wx.setStorageSync('colorSettings', {
        mainTitleColor: updateData.mainTitleColor,
        subTitleColor: updateData.subTitleColor,
        rightHandColor: updateData.rightHandColor,
        leftHandColor: updateData.leftHandColor
      });
      
      return {
        success: true,
        message: `完整曲谱已导入（${parsedModules.length}个模块）`,
        isFullImport: true
      };
    } catch (err) {
      console.error('完整曲谱JSON导入错误：', err);
      return {
        success: false,
        message: err.message || '完整曲谱解析失败'
      };
    }
  },

  // 执行导入（核心逻辑，由 confirmImport 和 performLoadExample 调用）
  performImport(code, importMode = 'add', importTargetModuleId = null) {
    try {
      // 【新增】检测是否为完整曲谱 JSON 格式
      if (this.isFullNotationJSON(code)) {
        // 完整曲谱导入会替换所有数据，忽略 importMode 和 importTargetModuleId
        return this.importFullNotationJSON(code);
      }
      
      // 原有逻辑：解析 LaTeX 格式代码
      const parsedModules = this.parseImportCode(code);
      
      if (!parsedModules || parsedModules.length === 0) {
        throw new Error('未能解析出有效的模块数据');
      }

      // 根据导入模式处理
      if (importMode === 'replace' && importTargetModuleId) {
        // 覆盖模式：首个模块更新当前模块，其余模块紧随其后插入
        const notations = [...this.data.notations];
        const targetIndex = notations.findIndex(n => n.id === importTargetModuleId);
        
        if (targetIndex === -1) {
          throw new Error('未找到目标模块');
        }

        const [firstModule, ...restModules] = parsedModules;

        // 用首个模块更新当前模块，但保留原ID/标签/备注（除非新模块有备注）
        const updatedNotation = this.convertToNotation(firstModule);
        updatedNotation.id = notations[targetIndex].id;
        updatedNotation.label = notations[targetIndex].label;
        // 如果导入的模块没有备注，保留原有备注
        if (!updatedNotation.remark && notations[targetIndex].remark) {
          updatedNotation.remark = notations[targetIndex].remark;
        }
        notations[targetIndex] = updatedNotation;

        // 其余模块按顺序插入在当前模块之后
        if (restModules.length > 0) {
          const insertNotations = restModules.map(module => this.convertToNotation(module));
          notations.splice(targetIndex + 1, 0, ...insertNotations);
        }
        
        const withOffsets = this.updateMeasureOffsets(notations);
        this.saveNotationsScoped(withOffsets);
        this.setNotations(withOffsets);

        return {
          success: true,
          message: restModules.length ? `更新并插入${restModules.length}个` : '成功更新模块'
        };
      } else {
        // 添加模式：添加所有解析出的模块
        const newNotations = parsedModules.map(module => this.convertToNotation(module));
        
        // 合并到现有谱面
        const notations = this.updateMeasureOffsets([...this.data.notations, ...newNotations]);
        this.saveNotationsScoped(notations);
        this.setNotations(notations);

        return {
          success: true,
          message: `已导入${parsedModules.length}个模块`
        };
      }
    } catch (err) {
      console.error('导入错误：', err);
      return {
        success: false,
        message: err.message || '解析失败，请检查代码格式'
      };
    }
  },

  // 确认导入
  confirmImport() {
    // 从实例变量读取最新值
    const code = (this._importCode !== undefined ? this._importCode : this.data.importCode).trim();
    if (!code) {
      this.setData({ importError: '请输入乐谱代码' });
      return;
    }

    // 先备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('导入谱面');
    this.backupCurrentState(snapshotAction);

    const result = this.performImport(code, this.data.importMode, this.data.importTargetModuleId);
    
    if (result.success) {
      this.closeImportModal();
      wx.showToast({
        title: result.message,
        icon: 'success'
      });
    } else {
      this.setData({ importError: result.message });
    }
  },

  // 解析导入代码
  parseImportCode(code) {
    const modules = [];
    
    // 移除所有注释（% 开头到行尾）
    code = code.replace(/%[^\n]*/g, '');
    
    // 提取所有module块，支持可选的备注和排版参数
    // 格式1: \begin{module}{A-1}
    // 格式2: \begin{module}{A-1}{备注}
    // 格式3: \begin{module}{A-1}{备注}{排版信息}
    // 格式4: \begin{module}{A-1}{排版信息} (当第二个括号是排版信息时)
    const moduleRegex = /\\begin\{module\}\{([^}]+)\}(?:\{([^}]*)\})?(?:\{([^}]*)\})?([\s\S]*?)\\end\{module\}/g;
    let match;
    
    while ((match = moduleRegex.exec(code)) !== null) {
      const moduleName = match[1].trim();
      const param2 = match[2] ? match[2].trim() : ''; // 第二个参数（备注或排版信息）
      const param3 = match[3] ? match[3].trim() : ''; // 第三个参数（排版信息）
      const moduleContent = match[4].trim();
      
      // 解析排版信息和备注
      let moduleRemark = '';
      let moduleStyle = null;
      
      if (param3) {
        // 有第三个参数，尝试解析为排版信息
        moduleStyle = this.parseStyleParam(param3);
        moduleRemark = param2; // 第二个参数为备注
      } else if (param2) {
        // 只有第二个参数，尝试判断是排版信息还是备注
        const tryStyle = this.parseStyleParam(param2);
        if (tryStyle) {
          // 成功解析为排版信息
          moduleStyle = tryStyle;
        } else {
          // 解析失败，视为备注
          moduleRemark = param2;
        }
      }
      
      try {
        const parsedModule = this.parseModuleContent(moduleName, moduleContent);
        parsedModule.remark = moduleRemark; // 添加备注字段
        if (moduleStyle) {
          parsedModule.style = moduleStyle; // 添加排版样式字段
        }
        modules.push(parsedModule);
      } catch (err) {
        throw new Error(`模块 ${moduleName} 解析失败: ${err.message}`);
      }
    }
    
    if (modules.length === 0) {
      throw new Error('未找到有效的\\begin{module}...\\end{module}块');
    }
    
    return modules;
  },

  // 解析排版样式参数
  // 支持格式: h:160,f:28,s:65 或 measureHeight:160,noteFontSize:28,lineSpacing:65
  // 返回 { measureHeight, noteFontSize, lineSpacing } 或 null
  parseStyleParam(param) {
    if (!param || param.length === 0) return null;
    
    const style = {};
    let hasValidParam = false;
    
    // 支持简写和完整格式
    const paramMap = {
      'h': 'measureHeight',
      'f': 'noteFontSize',
      's': 'lineSpacing',
      'measureHeight': 'measureHeight',
      'noteFontSize': 'noteFontSize',
      'lineSpacing': 'lineSpacing'
    };
    
    // 按逗号分割
    const parts = param.split(',');
    for (const part of parts) {
      const kv = part.split(':');
      if (kv.length !== 2) continue;
      
      const key = kv[0].trim();
      const value = parseInt(kv[1].trim(), 10);
      
      if (paramMap[key] && !isNaN(value) && value > 0) {
        style[paramMap[key]] = value;
        hasValidParam = true;
      }
    }
    
    return hasValidParam ? style : null;
  },

  // 解析单个模块内容
  parseModuleContent(moduleName, content) {
    // 按 \\ 分割行
    const lines = content.split('\\\\').map(line => line.trim()).filter(line => line.length > 0);
    
    if (lines.length === 0) {
      throw new Error('模块内容为空');
    }
    
    const allMeasures = [];
    let firstLineMeasureCount = 0;
    let maxMeasuresPerLine = 0;
    let lineAnnotationsMap = {}; // 存储每行的注记信息
    
    // 遍历每一行
    lines.forEach((line, idx) => {
      // 【新增】先提取行末占位拍标记 #数字
      const { cleanLine: lineWithoutPlaceholder, placeholderCount } = this.extractPlaceholderMark(line);
      
      // 先提取行内注记 /*"数字:注记","数字:注记"*/
      const { cleanLine, annotations } = this.extractLineAnnotations(lineWithoutPlaceholder);
      
      const measures = this.parseLine(cleanLine);
      
      // 【新增】如果有占位拍标记，在该行最后一个小节添加占位拍
      if (placeholderCount > 0 && measures.length > 0) {
        const lastMeasure = measures[measures.length - 1];
        this.addPlaceholderBeatsToMeasure(lastMeasure, placeholderCount);
      }
      
      if (idx === 0) {
        firstLineMeasureCount = measures.length;
      }
      if (measures.length > maxMeasuresPerLine) {
        maxMeasuresPerLine = measures.length;
      }
      
      // 将注记信息应用到对应的音符位置
      if (annotations && Object.keys(annotations).length > 0) {
        this.applyAnnotationsToMeasures(measures, annotations, allMeasures.length);
      }
      
      allMeasures.push(...measures);
    });
    
    return {
      name: moduleName,
      measures: allMeasures,
      firstLineMeasureCount,
      measuresPerRow: firstLineMeasureCount || maxMeasuresPerLine || 1
    };
  },
  
  // 【新增】提取行末占位拍标记 #数字
  // 返回 { cleanLine: 去除标记后的行内容, placeholderCount: 占位拍数量 }
  extractPlaceholderMark(line) {
    // 匹配行末的 #数字 格式（可能在注记之后或之前）
    // 先检查在行末（可能在空格之后）
    const placeholderRegex = /#(\d+)\s*$/;
    const match = line.match(placeholderRegex);
    
    if (match) {
      const placeholderCount = parseInt(match[1], 10);
      const cleanLine = line.replace(placeholderRegex, '').trim();
      return { cleanLine, placeholderCount };
    }
    
    return { cleanLine: line, placeholderCount: 0 };
  },
  
  // 【新增】向小节添加占位拍（与现有 addRowPlaceholderBeat 逻辑一致）
  addPlaceholderBeatsToMeasure(measure, count) {
    if (!measure || !measure.beats || count <= 0) return;
    
    // 获取参考拍的细分数量（使用第一个非占位拍的细分数）
    let subdivisionsCount = 4; // 默认4个细分
    for (const beat of measure.beats) {
      if (!beat.isPlaceholder && beat.subdivisions && beat.subdivisions.length > 0) {
        subdivisionsCount = beat.subdivisions.length;
        break;
      }
    }
    
    // 【修复】记录添加占位拍之前的最后一个拍的索引（即最后一个真实拍的索引）
    // 在解析时，所有现有的拍都是真实拍，所以直接使用当前长度-1
    const lastRealBeatIndex = measure.beats.length - 1;
    
    // 添加指定数量的占位拍
    for (let i = 0; i < count; i++) {
      const placeholderBeat = {
        subdivisions: [],
        isPlaceholder: true
      };
      
      // 创建空的细分（不带 isPlaceholder，与现有实现一致）
      for (let j = 0; j < subdivisionsCount; j++) {
        placeholderBeat.subdivisions.push({
          rightHand: ['', ''],
          leftHand: ['', '']
        });
      }
      
      measure.beats.push(placeholderBeat);
    }
    
    // 【修复】设置最后一个真实拍的索引（用于小节线定位）
    if (lastRealBeatIndex >= 0) {
      measure.lastRealBeatIndex = lastRealBeatIndex;
    }
  },

  // 提取行内注记
  // 格式: /*"1:速度渐快","5:重音"*/
  // 返回 { cleanLine: 去除注记后的行内容, annotations: { 位置: 注记文本 } }
  extractLineAnnotations(line) {
    const annotationRegex = /\/\*([^*]*)\*\//g;
    const annotations = {};
    
    let cleanLine = line;
    let match;
    
    while ((match = annotationRegex.exec(line)) !== null) {
      const annotationContent = match[1];
      // 解析 "数字:注记" 格式
      const itemRegex = /"(\d+):([^"]+)"/g;
      let itemMatch;
      
      while ((itemMatch = itemRegex.exec(annotationContent)) !== null) {
        const position = parseInt(itemMatch[1], 10);
        const text = itemMatch[2].trim();
        if (!isNaN(position) && text) {
          annotations[position] = text;
        }
      }
      
      // 从原始行中移除注记
      cleanLine = cleanLine.replace(match[0], '');
    }
    
    return { cleanLine: cleanLine.trim(), annotations };
  },

  // 将注记应用到小节中的对应音符位置
  // position 是基于当前行的全局音符列索引（从1开始）
  applyAnnotationsToMeasures(measures, annotations, measureOffset) {
    let globalSubdivisionIndex = 1; // 全局音符列索引，从1开始
    
    for (const measure of measures) {
      for (const beat of measure.beats || []) {
        for (const subdivision of beat.subdivisions || []) {
          if (annotations[globalSubdivisionIndex]) {
            subdivision.annotation = annotations[globalSubdivisionIndex];
          }
          globalSubdivisionIndex++;
        }
      }
    }
  },

  // 解析一行中的所有小节
  parseLine(line) {
    const measures = [];
    
    // 处理小节线：[ ... ] 或 ][ 连写
    // 先将 ][（允许有空格）替换为 ] [，便于分割；连续的 ][ 只当作单个小节分隔
    line = line.replace(/\]\s*\[/g, '] [');
    
    // 使用正则提取所有小节内容
    const measureRegex = /\[(.*?)\]/g;
    let match;
    
    while ((match = measureRegex.exec(line)) !== null) {
      const measureContent = match[1].trim();
      const measure = this.parseMeasure(measureContent);
      measures.push(measure);
    }
    
    if (measures.length === 0) {
      throw new Error('未检测到有效的小节，请检查方括号是否成对并使用 ][ 分隔');
    }
    
    return measures;
  },

  // 解析单个小节
  parseMeasure(content) {
    // 按 | 分割拍
    const beatStrings = content.split('|').map(b => b.trim());
    
    const beats = beatStrings.map(beatStr => this.parseBeat(beatStr));
    
    return { beats };
  },

  // 解析单个拍
  parseBeat(beatStr) {
    // 首先处理隐含的+号：在token之间自动插入+
    // token 包括：<...>、{...}、完整格式6/D、token/、/token、(...)/(...) 格式、- 、单个数字或字母（可选修饰符）、·
    // 注意顺序很重要：
    // 1. <...> 和 {...} 优先匹配，确保包裹的内容作为整体
    // 2. 完整手指定必须先匹配，否则会被拆成两个token
    // 3. 简谱格式：支持 1'、1,、1_、1'^{H} 等带修饰符的音符
    // 4. 多位数音符需要用<>或{}包裹，如<12>；不带包裹的连续数字如8765会被识别为多个单音符8+7+6+5
    // 修饰符正则：支持 ' , _ 以及 ^{...} 格式
    const modifierPattern = "['',,_]*(?:\\^\\{[^}]*\\})?['',,_]*";
    // token正则：按优先级排列
    const tokenRegex = new RegExp(
      '~?<[^>]+>' +                                           // <...> 包裹的内容
      '|~?\\{[^}]+\\}' +                                     // {...} 包裹的内容
      '|~?\\([^)]*\\)\\/\\([^)]*\\)' +                       // (右手)/(左手) 完整格式
      '|~?<[^>]+>\\/' +                                       // <...>/  右手指定
      '|~?\\/<[^>]+>' +                                       // /<...>  左手指定
      '|~?\\{[^}]+\\}\\/' +                                   // {...}/  右手指定
      '|~?\\/\\{[^}]+\\}' +                                   // /{...}  左手指定
      `|~?[0-9A-Za-z]${modifierPattern}\\/[0-9A-Za-z]${modifierPattern}` +  // 完整手指定 如 6/D
      `|~?[0-9A-Za-z]${modifierPattern}\\/` +                  // 右手指定 如 1/
      `|~?\\/[0-9A-Za-z]${modifierPattern}` +                  // 左手指定 如 /1
      '|~?-' +                                                // 空音符
      `|~?[0-9A-Za-z]${modifierPattern}` +                    // 单个音符（带可选修饰符）
      '|~?·',                                                 // 特殊字符
      'g'
    );
    const tokens = beatStr.match(tokenRegex) || [];
    
    // 用 + 连接所有 token
    const processedStr = tokens.join('+');
    
    // 按 + 分割subdivision
    const subdivisionStrings = processedStr.split('+').map(s => s.trim()).filter(s => s.length > 0);
    
    const subdivisions = subdivisionStrings.map(subStr => this.parseSubdivision(subStr));
    
    return { subdivisions };
  },

  // 解析单个subdivision（音符组）
  parseSubdivision(subStr) {
    // 检测并处理琶音标记 '~' - 在音符列前面
    let hasArpeggio = false;
    if (subStr.startsWith('~')) {
      hasArpeggio = true;
      subStr = subStr.slice(1); // 移除'~'前缀
    }
    
    // 音符修饰符模式：支持 ' , _ 以及 ^{...} 格式
    const modifierPatternNotes = "['',,_]*(?:\\^\\{[^}]*\\})?['',,_]*";
    
    // 处理 <4/1> 或 {4/1} 形式：完整手指定的简写
    if ((subStr.startsWith('<') && subStr.endsWith('>')) || 
        (subStr.startsWith('{') && subStr.endsWith('}'))) {
      const content = subStr.slice(1, -1);
      // 检查是否为完整手指定格式（包含/）
      // 匹配：数字/字母（带可选修饰符）或 <...>/{...} 包裹的内容
      const slashMatch = content.match(new RegExp(
        `^(<[^>]+>|\\{[^}]+\\}|[0-9A-Za-z]${modifierPatternNotes})\\/(<[^>]+>|\\{[^}]+\\}|[0-9A-Za-z]${modifierPatternNotes})$`
      ));
      if (slashMatch) {
        const rightToken = slashMatch[1];
        const leftToken = slashMatch[2];
        const rightHand = this.parseHandNotes(this.unwrapBracket(rightToken), 'right');
        const leftHand = this.parseHandNotes(this.unwrapBracket(leftToken), 'left');
        const result = {
          rightHand: [rightHand[0] || '', rightHand[1] || ''],
          leftHand: [leftHand[0] || '', leftHand[1] || '']
        };
        if (hasArpeggio) result.hasArpeggio = true;
        return result;
      }
    }
    
    // 匹配 4/1 形式的完整简写（右手/左手）- 包括 6/D 这样的字母格式，以及简谱格式如 1'/5,
    // 支持修饰符： ' , _ 以及 ^{...}
    // 多位数需要用 <> 或 {} 包裹
    const fullShorthandMatch = subStr.match(new RegExp(
      `^(<[^>]+>|\\{[^}]+\\}|[0-9A-Za-z]${modifierPatternNotes})\\/(<[^>]+>|\\{[^}]+\\}|[0-9A-Za-z]${modifierPatternNotes})$`
    ));
    if (fullShorthandMatch) {
      const rightToken = fullShorthandMatch[1];
      const leftToken = fullShorthandMatch[2];
      const rightHand = this.parseHandNotes(this.unwrapBracket(rightToken), 'right');
      const leftHand = this.parseHandNotes(this.unwrapBracket(leftToken), 'left');
      const result = {
        rightHand: [rightHand[0] || '', rightHand[1] || ''],
        leftHand: [leftHand[0] || '', leftHand[1] || '']
      };
      if (hasArpeggio) result.hasArpeggio = true;
      return result;
    }
    
// 处理手动指定左右手的格式：数字/ 和 /数字 以及 {token}/、/{token}、<token>/、/<token>
    // 例如：1/ → (1)/()（右手only），/1 → ()/(1)（左手only）
    // 支持简谱格式如 1'/、/5,、<1'^{H}>/
    
    // 匹配 <token>/ 或 {token}/ 或 单个数字/字母/ 形式（右手指定）
    const rightHandSpecificMatch = subStr.match(new RegExp(
      `^(<[^>]+>|\\{[^}]+\\}|[0-9A-Za-z]${modifierPatternNotes})\\/$`
    ));
    if (rightHandSpecificMatch) {
      const token = rightHandSpecificMatch[1];
      const unwrapped = this.unwrapBracket(token);
      const rightHand = this.parseHandNotes(unwrapped, 'right');
      const result = {
        rightHand: [rightHand[0] || '', rightHand[1] || ''],
        leftHand: ['', '']
      };
      if (hasArpeggio) result.hasArpeggio = true;
      return result;
    }
    
    // 匹配 /<token> 或 /{token} 或 /单个数字/字母 形式（左手指定）
    const leftHandSpecificMatch = subStr.match(new RegExp(
      `^\\/(<[^>]+>|\\{[^}]+\\}|[0-9A-Za-z]${modifierPatternNotes})$`
    ));
    if (leftHandSpecificMatch) {
      const token = leftHandSpecificMatch[1];
      const unwrapped = this.unwrapBracket(token);
      const leftHand = this.parseHandNotes(unwrapped, 'left');
      const result = {
        rightHand: ['', ''],
        leftHand: [leftHand[0] || '', leftHand[1] || '']
      };
      if (hasArpeggio) result.hasArpeggio = true;
      return result;
    }
    
    // 处理 <12> 或 {12} 形式的多位数或其他token（不包含/，否则已在上面处理）
    if ((subStr.startsWith('<') && subStr.endsWith('>')) || 
        (subStr.startsWith('{') && subStr.endsWith('}'))) {
      const content = subStr.slice(1, -1);
      // 如果内容不包含/，视为单个音符，根据奇偶数分配左右手
      if (!content.includes('/')) {
        // 提取基础音符（去掉修饰符）用于判断奇偶
        const baseNote = content.replace(/['',,_\^\{\}]/g, '').trim();
        const n = parseInt(baseNote, 10);
        if (!Number.isNaN(n)) {
          if (n % 2 === 0) {
            const leftHand = this.parseHandNotes(content, 'left');
            const result = {
              rightHand: ['', ''],
              leftHand: [leftHand[0] || '', leftHand[1] || '']
            };
            if (hasArpeggio) result.hasArpeggio = true;
            return result;
          }
          const rightHand = this.parseHandNotes(content, 'right');
          const result = {
            rightHand: [rightHand[0] || '', rightHand[1] || ''],
            leftHand: ['', '']
          };
          if (hasArpeggio) result.hasArpeggio = true;
          return result;
        }
        // 字母和·视作偶数，放在左手
        const leftHand = this.parseHandNotes(content, 'left');
        const result = {
          rightHand: ['', ''],
          leftHand: [leftHand[0] || '', leftHand[1] || '']
        };
        if (hasArpeggio) result.hasArpeggio = true;
        return result;
      }
    }
    
    // 处理简写 - 表示空音符
    if (subStr === '-') {
      subStr = '()/()';
    }

    // 移除所有空格
    subStr = subStr.replace(/\s+/g, '');

    // 正常格式：(右手)/(左手)
    const match = subStr.match(/^\(([^)]*)\)\/\(([^)]*)\)$/);

    // 辅助：从单括号列表提取奇偶并排布（字母视作偶数）
    const buildFromSingleBracket = (content) => {
      const tokens = content.split(',').map(t => t.trim()).filter(t => t.length > 0);
      const odds = [];
      const evens = [];
      tokens.forEach(t => {
        const n = parseInt(t, 10);
        if (!Number.isNaN(n)) {
          if (n % 2 === 0) {
            evens.push(n.toString());
          } else {
            odds.push(n.toString());
          }
        } else {
          // 非数字token（如字母）视作偶数
          evens.push(t);
        }
      });
      odds.sort((a, b) => parseInt(b, 10) - parseInt(a, 10));
      evens.sort((a, b) => {
        const aNum = parseInt(a, 10);
        const bNum = parseInt(b, 10);
        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return aNum - bNum;
        }
        return a.localeCompare(b);
      });
      const rightHandArr = odds;
      const leftHandArr = evens;
      const result = {
        rightHand: [rightHandArr[0] || '', rightHandArr[1] || ''],
        leftHand: [leftHandArr[0] || '', leftHandArr[1] || '']
      };
      if (hasArpeggio) result.hasArpeggio = true;
      return result;
    };

    if (!match) {
      // 简写1：仅有括号 (1,2,3) => (奇数降序)/(偶数升序)
      const singleBracketMatch = subStr.match(/^\(([^)]*)\)$/);
      if (singleBracketMatch) {
        return buildFromSingleBracket(singleBracketMatch[1]);
      }

      // 简写2：单个数字或字母或·（可选^/_后缀），奇数→右手，偶数/字母/·→左手
      // 支持简谱格式如 1^、5_
      // 注意：这里只匹配单个字符+可选后缀，多位数需要用{}包裹
      if (/^[0-9A-Za-z·][\^_]?$/.test(subStr)) {
        // 提取基础音符（去掉^/_后缀）用于判断奇偶
        const baseNote = subStr.replace(/[\^_]$/, '');
        const n = parseInt(baseNote, 10);
        if (!Number.isNaN(n)) {
          if (n % 2 === 0) {
            const leftHand = this.parseHandNotes(subStr, 'left');
            const result = {
              rightHand: ['', ''],
              leftHand: [leftHand[0] || '', leftHand[1] || '']
            };
            if (hasArpeggio) result.hasArpeggio = true;
            return result;
          }
          const rightHand = this.parseHandNotes(subStr, 'right');
          const result = {
            rightHand: [rightHand[0] || '', rightHand[1] || ''],
            leftHand: ['', '']
          };
          if (hasArpeggio) result.hasArpeggio = true;
          return result;
        }
        // 字母和·视作偶数，放在左手
        const leftHand = this.parseHandNotes(subStr, 'left');
        const result = {
          rightHand: ['', ''],
          leftHand: [leftHand[0] || '', leftHand[1] || '']
        };
        if (hasArpeggio) result.hasArpeggio = true;
        return result;
      }

      // 空字符串或无法匹配时返回空占位，避免整段失败
      if (!subStr) {
        const result = {
          rightHand: ['', ''],
          leftHand: ['', '']
        };
        if (hasArpeggio) result.hasArpeggio = true;
        return result;
      }
      throw new Error(`无效的音符格式: ${subStr}`);
    }

    const rightHandStr = match[1];
    const leftHandStr = match[2];
    
    // 解析右手和左手
    const rightHand = this.parseHandNotes(rightHandStr, 'right');
    const leftHand = this.parseHandNotes(leftHandStr, 'left');
    
    const result = {
      rightHand: [rightHand[0] || '', rightHand[1] || ''],
      leftHand: [leftHand[0] || '', leftHand[1] || '']
    };
    if (hasArpeggio) result.hasArpeggio = true;
    return result;
  },

  // 解析单手音符（返回数组 [slot0, slot1]）
  // 支持 <> 包裹的特殊音符，如 <1,^{5}>,2 应被解析为 ['1,^{5}', '2']
  parseHandNotes(handStr, hand) {
    if (!handStr || handStr.length === 0) {
      return ['', ''];
    }
    
    // 智能分割：考虑 <> 和 {} 包裹的情况
    // <1,^{5}>,2 应被识别为 ['<1,^{5}>', '2'] 而不是 ['<1', '^{5}>', '2']
    const notes = this.smartSplitNotes(handStr);
    
    if (notes.length === 1) {
      // 单个音符：默认放在靠近中轴线的位置
      // 右手：放在slot1（index 1）
      // 左手：放在slot0（index 0，因为左手的slot0更靠近中轴线）
      const parsedNote = this.parseNote(this.unwrapBracket(notes[0]));
      if (hand === 'right') {
        return ['', parsedNote];
      } else {
        return [parsedNote, ''];
      }
    } else if (notes.length === 2) {
      // 两个音符：外侧和内侧
      const note0 = this.parseNote(this.unwrapBracket(notes[0]));
      const note1 = this.parseNote(this.unwrapBracket(notes[1]));
      return [note0, note1];
    } else if (notes.length > 2) {
      // 超过2个，只取前两个
      const note0 = this.parseNote(this.unwrapBracket(notes[0]));
      const note1 = this.parseNote(this.unwrapBracket(notes[1]));
      return [note0, note1];
    }
    
    return ['', ''];
  },

  // 智能分割音符字符串，正确处理 <> 和 {} 包裹（支持嵌套）
  // 例如：<1,^{5,}>,<1'^{H}> -> ['<1,^{5,}>', '<1'^{H}>']
  smartSplitNotes(str) {
    const notes = [];
    let current = '';
    let angleDepth = 0;  // <> 深度
    let braceDepth = 0;  // {} 深度
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      
      // 只有当所有括号都关闭时，逗号才是分隔符
      if (angleDepth === 0 && braceDepth === 0 && char === ',') {
        // 顶层逗号，分割
        if (current.trim()) {
          notes.push(current.trim());
        }
        current = '';
        continue;
      }
      
      // 跟踪括号深度
      if (char === '<') {
        angleDepth++;
      } else if (char === '>') {
        angleDepth = Math.max(0, angleDepth - 1);
      } else if (char === '{') {
        braceDepth++;
      } else if (char === '}') {
        braceDepth = Math.max(0, braceDepth - 1);
      }
      
      current += char;
    }
    
    // 添加最后一个token
    if (current.trim()) {
      notes.push(current.trim());
    }
    
    return notes;
  },

  // 解析单个音符（处理装饰符号）
  // 支持格式：数字/字母 + 可选修饰符（' , _ ^{...}）
  // 例如：1'、5,、3_、1'^{H}、^{1'}5,_
  parseNote(noteStr) {
    if (!noteStr || noteStr.length === 0) {
      return '';
    }
    
    // 先移除首尾的 <> 或 {} 包裹（如果有）
    let cleaned = noteStr.trim();
    if ((cleaned.startsWith('<') && cleaned.endsWith('>')) ||
        (cleaned.startsWith('{') && cleaned.endsWith('}'))) {
      cleaned = cleaned.slice(1, -1);
    }
    
    // 在简谱模式下，保留所有装饰符号（' , _ ^{...}）和·
    // 在数字谱模式下，移除装饰符号但保留·和^{...}
    if (this.data.notationType === 'simplified') {
      // 简谱模式：保留所有修饰符
      // 支持复杂格式如：^{1'}5,_^{H}
      // 直接返回清理后的内容
      return cleaned || '';
    } else {
      // 数字谱模式：移除简单修饰符（' , _），但保留 ^{...} 上标
      // 提取基础音符和上标部分
      let result = '';
      let i = 0;
      
      while (i < cleaned.length) {
        const char = cleaned[i];
        
        // 处理上标 ^{...}
        if (char === '^' && cleaned[i + 1] === '{') {
          // 找到匹配的 }
          let depth = 1;
          let j = i + 2;
          while (j < cleaned.length && depth > 0) {
            if (cleaned[j] === '{') depth++;
            else if (cleaned[j] === '}') depth--;
            j++;
          }
          // 保留整个上标
          result += cleaned.slice(i, j);
          i = j;
        } else if (/['',,]/.test(char)) {
          // 跳过八度修饰符（' 升八度，, 降八度），但保留 _ 下划线（时值标记）
          i++;
        } else {
          // 保留其他字符（数字、字母、·等）
          result += char;
          i++;
        }
      }
      
      return result || '';
    }
  },

  // 辅助方法：从 <content> 中提取内容，或直接返回token
  unwrapBracket(token) {
    if (token.startsWith('<') && token.endsWith('>')) {
      return token.slice(1, -1);
    }
    // 为了向后兼容，仍然支持 {} 格式
    if (token.startsWith('{') && token.endsWith('}')) {
      return token.slice(1, -1);
    }
    return token;
  },

  // 将解析后的模块转换为notation格式
  convertToNotation(parsedModule) {
    const portraitRow = parsedModule.measuresPerRow || parsedModule.firstLineMeasureCount || this.data.measuresPerRowPortrait || this.data.measuresPerRow || 1;
    const factor = this.data.orientation === 'landscape' ? 2 : 1;
    
    // 每个模块包含多个小节
    const measures = parsedModule.measures.map(parsedMeasure => {
      const convertedMeasure = {
        beats: parsedMeasure.beats.map(parsedBeat => {
          const convertedBeat = {
            subdivisions: parsedBeat.subdivisions
          };
          // 【修复】保留占位拍标记
          if (parsedBeat.isPlaceholder) {
            convertedBeat.isPlaceholder = true;
          }
          // 保留其他可能的属性
          if (parsedBeat.barLineAfter) {
            convertedBeat.barLineAfter = true;
          }
          return convertedBeat;
        })
      };
      // 【修复】保留小节的 lastRealBeatIndex（占位拍右侧小节线位置）
      if (parsedMeasure.lastRealBeatIndex !== undefined) {
        convertedMeasure.lastRealBeatIndex = parsedMeasure.lastRealBeatIndex;
      }
      return convertedMeasure;
    });

    // 依据导入数据推断自定义模板
    const tempNotation = {
      measures,
      measuresPerRow: portraitRow
    };
    const inferredTemplate = this.inferTemplateFromNotation(tempNotation);
    
    // 处理样式参数：如果解析出了排版参数则使用，否则使用全局样式
    const moduleStyle = parsedModule.style || {};
    const gs = this.getGlobalStyleDefaults();
    const style = {
      measureHeight: moduleStyle.measureHeight || gs.measureHeight,
      noteFontSize: moduleStyle.noteFontSize || gs.noteFontSize,
      lineSpacing: moduleStyle.lineSpacing || gs.lineSpacing
    };
    
    return {
      id: Date.now() + Math.floor(Math.random() * 10000),
      label: parsedModule.name,
      remark: parsedModule.remark || '', // 添加备注字段
      measures: measures,
      timeSignature: '自由/自由',
      moduleTimeSignature: 'custom',
      moduleCustomTemplate: inferredTemplate,
      measuresPerRowPortrait: portraitRow,
      measuresPerRow: portraitRow * factor,
      style: style // 添加排版样式字段
    };
  },

  // 打开记谱类型选择模态框
  openNotationTypeModal() {
    // ========== 重要：确保使用最新的谱面数据和谱式类型 ==========
    // 从 Storage 重新读取谱式类型，防止状态不同步导致重复转换
    const storedNotationType = wx.getStorageSync('notationType') || 'digital';
    
    // 如果 data 中的 notationType 与存储不一致，更新 data
    if (this.data.notationType !== storedNotationType) {
      console.warn('[谱式转换] 检测到状态不同步，已修正:', 
        this.data.notationType, '->', storedNotationType);
      this.setData({ notationType: storedNotationType });
    }
    
    const currentType = storedNotationType;
    
    // 确保获取最新的谱面数据（防止文件切换后数据未更新）
    const currentNotations = this.data.notations;
    if (!currentNotations || currentNotations.length === 0) {
      wx.showToast({
        title: '谱面为空，无法进行转换',
        icon: 'none'
      });
      return;
    }

    // 初始化首调设置
    this.initConversionRootNote();
    
    // 清理之前的转换缓存，确保使用新鲜数据
    this.setData({
      conversionMappings: [],
      conversionMappingError: '',
      hasEmptyConversionMapping: false,
      currentConversionTableId: null,
      customConversionTable: false,
      customConversionTableObj: {}
    });
    
    // 扫描当前谱面中的所有音符类型
    const noteSet = this.collectAllNoteTypes();
    
    // 生成转换映射数组（三列）
    const conversionMappings = this.generateConversionMappings(noteSet, currentType);
    
    // 检查是否有空的映射（根据转换方向检查目标字段）
    // 数字谱转简谱：检查 simplified 字段
    // 简谱转数字谱：检查 key 字段（数字谱列）
    const hasEmpty = conversionMappings.some(m => {
      if (currentType === 'digital') {
        // 数字谱转简谱，检查简谱列是否为空
        return !m.simplified || m.simplified.trim() === '';
      } else {
        // 简谱转数字谱，检查数字谱列是否为空
        return !m.key || m.key.trim() === '';
      }
    });
    
    // 加载转换表库
    const library = wx.getStorageSync('conversionTableLibrary') || [];
    
    console.log('[谱式转换] 当前谱式:', currentType, 
      '目标谱式:', currentType === 'digital' ? 'simplified' : 'digital',
      '音符数量:', noteSet.size);
    
    this.setData({
      showNotationTypeModal: true,
      notationTypeTemp: currentType === 'digital' ? 'simplified' : 'digital',
      conversionMappings: conversionMappings,
      conversionMappingError: '',
      hasEmptyConversionMapping: hasEmpty,
      conversionTableLibrary: library,
      currentConversionTableId: null,
      conversionMode: 'mapping' // 默认映射转换模式
    });
  },

  // 扫描谱面中所有音符类型（非重集合）
  // 支持解析复杂音符结构如 <1,^{5,}>、<1'^{H}>
  collectAllNoteTypes() {
    const noteSet = new Set();
    const notations = this.data.notations || [];
    
    notations.forEach(notation => {
      if (!notation.measures) return;
      notation.measures.forEach(measure => {
        if (!measure.beats) return;
        measure.beats.forEach(beat => {
          if (!beat.subdivisions) return;
          beat.subdivisions.forEach(sub => {
            // 收集右手音符
            if (sub.rightHand) {
              sub.rightHand.forEach(note => {
                this.extractNoteElements(note).forEach(n => noteSet.add(n));
              });
            }
            // 收集左手音符
            if (sub.leftHand) {
              sub.leftHand.forEach(note => {
                this.extractNoteElements(note).forEach(n => noteSet.add(n));
              });
            }
          });
        });
      });
    });
    
    return noteSet;
  },
  
  /**
   * 从复杂音符结构中提取所有音符元素（非重集合）
   * 支持格式：
   * - 简单音符：1, 2, D, T
   * - 带修饰符：1', 1,, 1_, 1'_
   * - 带上标：1^{H}, ^{H}1, ^{L}1^{R}
   * - 复杂结构：<1,^{5,}>, <1'^{H}>
   * 
   * 返回：主音符（含修饰符）+ 上标内容 的数组
   * 例如 <1,^{5,}> 返回 ['1,', '5,']
   * 例如 <1'^{H}> 返回 ['1'', 'H']
   */
  extractNoteElements(noteStr) {
    if (!noteStr || noteStr.trim() === '' || noteStr === '-') return [];
    
    let cleaned = noteStr.trim();
    
    // 移除外层 <> 或 {} 包裹
    if ((cleaned.startsWith('<') && cleaned.endsWith('>')) ||
        (cleaned.startsWith('{') && cleaned.endsWith('}'))) {
      cleaned = cleaned.slice(1, -1);
    }
    
    const elements = [];
    
    // 提取左上标 ^{...}
    let remaining = cleaned;
    const leftSupMatch = remaining.match(/^\^\{([^}]*)\}(.*)$/);
    if (leftSupMatch) {
      const supContent = leftSupMatch[1];
      remaining = leftSupMatch[2];
      // 解析上标内容中的音符元素
      this.extractSupElements(supContent).forEach(e => elements.push(e));
    }
    
    // 提取右上标 ...^{...}（可能有多个）
    // 使用非贪婪匹配来正确分割
    let rightSupMatches = [];
    let tempRemaining = remaining;
    while (true) {
      const match = tempRemaining.match(/^(.+?)\^\{([^}]*)\}$/);
      if (match) {
        rightSupMatches.push(match[2]);
        tempRemaining = match[1];
      } else {
        break;
      }
    }
    remaining = tempRemaining;
    
    // 处理右上标内容
    rightSupMatches.forEach(supContent => {
      this.extractSupElements(supContent).forEach(e => elements.push(e));
    });
    
    // 解析主音符部分（remaining）
    // 主音符可能是：1, 1', 1,, 1_, 1'_, D, T 等
    if (remaining) {
      const mainNote = this.parseMainNoteElement(remaining);
      if (mainNote) {
        elements.push(mainNote);
      }
    }
    
    return elements;
  },
  
  /**
   * 解析主音符元素，返回"基础音符+八度修饰符"的形式（不含下划线）
   * 下划线 _ 是时值标记，不影响音符本身的音高，因此在识别非重集合时忽略
   * 例如：1'_ -> '1''，5,,_ -> '5,,'，8_ -> '8'
   */
  parseMainNoteElement(str) {
    if (!str) return '';
    
    // 提取基础音符和修饰符
    let baseNote = '';
    let octaveUp = 0;    // ' 的数量
    let octaveDown = 0;  // , 的数量
    // 注意：下划线 _ 是时值标记，不参与音符识别
    
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (char === "'") {
        octaveUp++;
      } else if (char === ',') {
        octaveDown++;
      } else if (char === '_') {
        // 忽略下划线，不计入音符元素
        continue;
      } else if (/[0-9A-Za-z·]/.test(char)) {
        baseNote += char;
      }
    }
    
    if (!baseNote) return '';
    
    // 构建完整的音符元素（仅包含基础音符和八度修饰符）
    let result = baseNote;
    if (octaveUp > 0) {
      result += "'".repeat(octaveUp);
    }
    if (octaveDown > 0) {
      result += ','.repeat(octaveDown);
    }
    // 不添加下划线到结果中
    
    return result;
  },
  
  /**
   * 从上标内容中提取音符元素
   * 上标内容可能是：H, 5, 5,, 1'
   */
  extractSupElements(supContent) {
    if (!supContent) return [];
    
    const elements = [];
    // 上标内容可能是单个音符或带修饰符的音符
    const element = this.parseMainNoteElement(supContent);
    if (element) {
      elements.push(element);
    }
    return elements;
  },

  // 生成转换映射数组（三列：数字谱、简谱、SPN）
  // 支持带八度标记的音符（如 1'、5,,），会自动基于基础音符计算转换值
  // 【修复】确保返回的数据结构中，key始终是"数字谱"列的值，simplified始终是"简谱"列的值
  generateConversionMappings(noteSet, currentType) {
    const defaultTable = this.data.defaultConversionTable;
    const mappings = [];
    
    // 特殊字符列表：在两种谱式中都保持不变
    const specialChars = ['D', 'd', 's', 'P', 'H', 'T', 'F', 'B', 'O', 'x', '·', 'K', 'M', '0'];
    
    // 将Set转换为数组并排序
    const noteArray = Array.from(noteSet).sort((a, b) => {
      // 提取基础音符（去除修饰符）用于比较
      const baseA = this.getBaseNoteForSort(a);
      const baseB = this.getBaseNoteForSort(b);
      
      // 特殊排序：D在最前面，然后是数字1-9
      if (baseA === 'D' || baseA === 'd') return -1;
      if (baseB === 'D' || baseB === 'd') return 1;
      
      // 先按基础音符排序
      const baseCompare = baseA.localeCompare(baseB, undefined, { numeric: true });
      if (baseCompare !== 0) return baseCompare;
      
      // 基础音符相同时，按修饰符排序（无修饰 < 高八度 < 低八度）
      const modA = this.getModifierOrder(a);
      const modB = this.getModifierOrder(b);
      return modA - modB;
    });
    
    noteArray.forEach(note => {
      let digitalValue = '';  // 数字谱列的值
      let simplifiedValue = '';  // 简谱列的值
      let spn = '';
      
      // 提取音符的八度修饰符
      const octaveUpCount = (note.match(/'/g) || []).length;
      const octaveDownCount = (note.match(/,/g) || []).length;
      const baseNote = note.replace(/['',_]/g, '');
      
      // 检查是否是特殊字符（在两种谱式中都保持不变）
      const isSpecialChar = specialChars.includes(baseNote);
      
      if (currentType === 'digital') {
        // 数字谱转简谱：
        // - digitalValue = 当前谱面的数字谱音符 (源)
        // - simplifiedValue = 要转换成的简谱音符 (目标)
        digitalValue = note;
        
        if (isSpecialChar) {
          // 特殊字符保持不变
          simplifiedValue = note;
          // D 的 SPN 特殊处理
          if (baseNote === 'D' || baseNote === 'd') {
            spn = this.simplifiedToSPN('6,');
          }
        } else {
          // 首先尝试精确匹配（带修饰符的完整音符）
          let tableValue = defaultTable[note];
          
          // 如果精确匹配失败，尝试用基础音符查找
          if (tableValue === undefined && baseNote !== note) {
            tableValue = defaultTable[baseNote];
            
            // 找到基础音符的转换值后，叠加八度修饰符
            if (tableValue !== undefined) {
              let baseSimplified = Array.isArray(tableValue) ? tableValue[0] : tableValue;
              
              // 叠加八度修饰符到简谱值
              simplifiedValue = this.applyOctaveModifiers(baseSimplified, octaveUpCount, octaveDownCount);
              // 计算新的SPN（基于带修饰符的简谱值）
              spn = this.simplifiedToSPN(simplifiedValue);
            }
            // 如果找不到，simplifiedValue 保持为空，让用户填写
          } else if (tableValue !== undefined) {
            // 精确匹配成功
            if (Array.isArray(tableValue)) {
              simplifiedValue = tableValue[0] || '';
              spn = tableValue[1] || '';
            } else if (typeof tableValue === 'string') {
              simplifiedValue = tableValue;
              spn = this.simplifiedToSPN(tableValue);
            }
          }
          // 如果找不到，simplifiedValue 保持为空，让用户填写
        }
      } else {
        // 简谱转数字谱：
        // - simplifiedValue = 当前谱面的简谱音符 (源)
        // - digitalValue = 要转换成的数字谱音符 (目标)
        simplifiedValue = note;
        
        if (isSpecialChar) {
          // 特殊字符保持不变
          digitalValue = note;
          // D 的 SPN 特殊处理
          if (baseNote === 'D' || baseNote === 'd') {
            spn = this.simplifiedToSPN('6,');
          }
        } else {
          // 反向查找：仅使用默认表中的精确匹配
          // 【修复】不再使用“基础音符”回退：若表中没有该简谱音符的精确对应项，则目标留空，由用户自行填写。
          // 避免将例如 4' 错误推导为 2'（数字谱为纯数字位，不应靠八度修饰符推导）。
          for (const key in defaultTable) {
            const tableValue = defaultTable[key];
            const tableSimplified = Array.isArray(tableValue) ? tableValue[0] : tableValue;
            if (tableSimplified === note) {
              digitalValue = key;
              spn = Array.isArray(tableValue) ? (tableValue[1] || '') : '';
              if (!spn) {
                spn = this.simplifiedToSPN(note);
              }
              break;
            }
          }
          // 未在默认表中精确匹配到的简谱音符，digitalValue 保持为空，让用户填写
        }
      }
      
      mappings.push({
        key: digitalValue,           // 数字谱列的值（固定显示列）
        simplified: simplifiedValue, // 简谱列的值（可编辑列）
        spn: spn,
        // 保存源音符（用于构建转换表）
        sourceNote: note,
        sourceType: currentType,
        // 兼容旧代码
        value: simplifiedValue
      });
    });
    
    return mappings;
  },

  /**
   * 将八度修饰符应用到音符上
   * @param {string} note - 原音符（可能已有修饰符）
   * @param {number} addOctaveUp - 要添加的高八度数量
   * @param {number} addOctaveDown - 要添加的低八度数量
   * @returns {string} 带修饰符的音符
   */
  applyOctaveModifiers(note, addOctaveUp, addOctaveDown) {
    if (!note) return note;
    
    // 提取现有的八度修饰符
    const existingOctaveUp = (note.match(/'/g) || []).length;
    const existingOctaveDown = (note.match(/,/g) || []).length;
    const baseNote = note.replace(/['',]/g, '');
    
    // 计算最终的八度修饰符
    const totalOctaveUp = existingOctaveUp + addOctaveUp;
    const totalOctaveDown = existingOctaveDown + addOctaveDown;
    
    // 组装结果
    let result = baseNote;
    
    // 高低八度抵消
    if (totalOctaveUp > 0 && totalOctaveDown > 0) {
      const netOctave = totalOctaveUp - totalOctaveDown;
      if (netOctave > 0) {
        result += "'".repeat(netOctave);
      } else if (netOctave < 0) {
        result += ",".repeat(-netOctave);
      }
    } else {
      if (totalOctaveUp > 0) {
        result += "'".repeat(totalOctaveUp);
      }
      if (totalOctaveDown > 0) {
        result += ",".repeat(totalOctaveDown);
      }
    }
    
    return result;
  },
  
  /**
   * 将八度修饰符差值应用到音符上（支持负数差值）
   * @param {string} note - 原音符（可能已有修饰符）
   * @param {number} deltaOctaveUp - 高八度差值（可能为负）
   * @param {number} deltaOctaveDown - 低八度差值（可能为负）
   * @returns {string} 带修饰符的音符
   */
  applyOctaveModifiersDelta(note, deltaOctaveUp, deltaOctaveDown) {
    if (!note) return note;
    
    // 提取现有的八度修饰符
    const existingOctaveUp = (note.match(/'/g) || []).length;
    const existingOctaveDown = (note.match(/,/g) || []).length;
    const baseNote = note.replace(/['',]/g, '');
    
    // 计算最终的净八度偏移
    // existingUp - existingDown + deltaUp - deltaDown
    const netOctave = (existingOctaveUp - existingOctaveDown) + (deltaOctaveUp - deltaOctaveDown);
    
    // 组装结果
    let result = baseNote;
    
    if (netOctave > 0) {
      result += "'".repeat(netOctave);
    } else if (netOctave < 0) {
      result += ",".repeat(-netOctave);
    }
    
    return result;
  },
  
  /**
   * 简谱转SPN（科学音高）
   * 基于首调设置进行转换
   * @param {string} simplified - 简谱音符
   * @returns {string} SPN音高
   */
  simplifiedToSPN(simplified) {
    if (!simplified || simplified === '-') return '';
    
    // 特殊标记不转换
    const specialMarks = ['D', 'd', 's', 'P', 'H', 'T', 'F', 'B', 'O', 'x', '·', 'K', 'M'];
    const baseNote = simplified.replace(/['',_]/g, '');
    if (specialMarks.includes(baseNote)) {
      // D和d视作6,（低音6）
      if (baseNote === 'D' || baseNote === 'd') {
        return this.calculateSPN('6,');
      }
      return '';
    }
    
    return this.calculateSPN(simplified);
  },
  
  /**
   * 根据首调计算SPN
   * @param {string} simplified - 简谱音符（如1, 1', 4,等）
   * @returns {string} SPN音高
   */
  calculateSPN(simplified) {
    if (!simplified) return '';
    
    // 解析首调（如F3）
    const rootNote = this.data.conversionRootNote || 'F3';
    const rootMatch = rootNote.match(/^([A-G][#b]?)(\d)$/);
    if (!rootMatch) return '';
    
    const rootPitch = rootMatch[1];
    const rootOctave = parseInt(rootMatch[2]);
    
    // 简谱到半音偏移的映射（以1为基准）
    const simplifiedToSemitone = {
      '1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11
    };
    
    // SPN音符到半音的映射
    const noteToSemitone = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
      'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8,
      'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    
    // 半音到SPN音符的映射
    const semitoneToNote = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    
    // 解析简谱音符
    let octaveUp = (simplified.match(/'/g) || []).length;
    let octaveDown = (simplified.match(/,/g) || []).length;
    const baseNum = simplified.replace(/['',_]/g, '');
    
    if (!simplifiedToSemitone.hasOwnProperty(baseNum)) return '';
    
    // 计算总半音数
    const rootSemitone = noteToSemitone[rootPitch];
    const noteSemitone = simplifiedToSemitone[baseNum];
    let totalSemitone = rootSemitone + noteSemitone + (octaveUp - octaveDown) * 12;
    
    // 计算最终的八度和音符
    let finalOctave = rootOctave + Math.floor(totalSemitone / 12);
    let finalSemitone = ((totalSemitone % 12) + 12) % 12;
    
    return semitoneToNote[finalSemitone] + finalOctave;
  },
  
  /**
   * 获取音符的基础部分（去除修饰符）用于排序
   * 例如：1' -> 1, 5,, -> 5, D_ -> D
   */
  getBaseNoteForSort(note) {
    if (!note) return '';
    return note.replace(/['',_·]/g, '');
  },
  
  /**
   * 获取音符修饰符的排序顺序
   * 无修饰 = 0, 高八度' = 1, 低八度, = 2, 下划线 = 3
   */
  getModifierOrder(note) {
    if (!note) return 0;
    
    const hasUp = note.includes("'");
    const hasDown = note.includes(',');
    const hasUnderline = note.includes('_');
    
    if (!hasUp && !hasDown && !hasUnderline) return 0;
    if (hasUp && !hasDown) return 1;
    if (hasDown && !hasUp) return 2;
    if (hasUnderline) return 3;
    return 4; // 复合修饰符
  },

  // 转换映射输入变化
  onConversionMappingInput(e) {
    const key = e.currentTarget.dataset.key;
    const value = e.detail.value;
    
    const mappings = this.data.conversionMappings.map(m => {
      if (m.key === key) {
        return { ...m, value: value };
      }
      return m;
    });
    
    // 检查是否有空的映射
    const hasEmpty = mappings.some(m => !m.value || m.value.trim() === '');
    
    this.setData({
      conversionMappings: mappings,
      hasEmptyConversionMapping: hasEmpty,
      conversionMappingError: hasEmpty ? '请填写所有转换映射' : ''
    });
  },

  // 关闭谱式转换模态框
  closeNotationTypeModal() {
    this.setData({
      showNotationTypeModal: false,
      conversionMappings: [],
      conversionMappingError: '',
      hasEmptyConversionMapping: false,
      showConversionRootPicker: false,
      // 清理转换弹窗编辑状态
      showVirtualKeyboard: false,
      conversionEditingKey: null,
      conversionEditingField: null,
      conversionUseNativeInput: false,
      virtualKeyboardDisplay: ''
    });
    // 恢复tabBar显示
    wx.showTabBar({ animation: true });
  },
  
  // ========== 转换表库相关方法 ==========
  
  /**
   * 初始化首调设置（从曲谱rootNote读取）
   * 【Bug修复】如果已有保存的首调设置则保留，不覆盖
   */
  initConversionRootNote() {
    // 如果已经有首调设置且不是默认值，则保留不覆盖
    if (this.data.conversionRootNote && this.data.conversionRootNote !== 'F3') {
      console.log('[Notation] 保留已有首调设置:', this.data.conversionRootNote);
      return this.data.conversionRootNote;
    }
    
    const rootNote = this.data.rootNote || 'D';
    // D小调等价于F调
    let spnRoot = rootNote;
    if (rootNote === 'D') {
      spnRoot = 'F';
    }
    // 默认分配第三音区
    const conversionRootNote = spnRoot + '3';
    this.setData({ conversionRootNote });
    return conversionRootNote;
  },
  
  /**
   * 打开转换表库弹窗
   */
  openConversionLibrary() {
    // 从存储加载转换表库
    const library = wx.getStorageSync('conversionTableLibrary') || [];
    this.setData({
      conversionTableLibrary: library,
      showConversionLibraryModal: true
    });
  },
  
  /**
   * 关闭转换表库弹窗
   */
  closeConversionLibrary() {
    this.setData({ showConversionLibraryModal: false });
  },
  
  /**
   * 选择转换表（仅选中，不立即应用）
   */
  selectConversionTable(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentConversionTableId: id });
  },
  
  /**
   * 应用选中的转换表
   */
  applySelectedConversionTable() {
    const id = this.data.currentConversionTableId;
    
    // 应用选中的转换表
    if (id === null) {
      // 使用默认转换表
      this.applyConversionTable(this.data.defaultConversionTable);
    } else {
      const library = this.data.conversionTableLibrary;
      const table = library.find(t => t.id === id);
      if (table) {
        this.applyConversionTable(table.table);
      }
    }
    
    // 执行转换：根据当前谱式类型决定转换目标
    this.executeConversionFromTable();
    
    // 关闭所有弹窗
    this.closeConversionLibrary();
    this.closeNotationTypeModal();
  },
  
  /**
   * 应用转换表到当前映射
   * 【修复】根据转换方向正确应用转换表值
   */
  applyConversionTable(table) {
    const currentType = this.data.notationType;
    
    const mappings = this.data.conversionMappings.map(m => {
      // 获取源音符（谱面中的实际音符）
      const sourceNote = m.sourceNote || (currentType === 'digital' ? m.key : m.simplified);
      
      if (currentType === 'digital') {
        // 数字谱转简谱：用数字谱音符查找简谱值
        const tableValue = table[sourceNote];
        if (Array.isArray(tableValue)) {
          return { ...m, simplified: tableValue[0] || '', spn: tableValue[1] || '', value: tableValue[0] || '' };
        } else if (typeof tableValue === 'string') {
          return { ...m, simplified: tableValue, spn: this.simplifiedToSPN(tableValue), value: tableValue };
        }
      } else {
        // 简谱转数字谱：反向查找，用简谱音符找数字谱值
        for (const key in table) {
          const tableValue = table[key];
          const simplifiedValue = Array.isArray(tableValue) ? tableValue[0] : tableValue;
          if (simplifiedValue === sourceNote) {
            const spn = Array.isArray(tableValue) ? (tableValue[1] || '') : this.simplifiedToSPN(sourceNote);
            return { ...m, key: key, spn: spn, value: m.simplified };
          }
        }
      }
      return m;
    });
    
    // 检查是否有空的映射（根据转换方向）
    const hasEmpty = mappings.some(m => {
      if (currentType === 'digital') {
        return !m.simplified || m.simplified.trim() === '';
      } else {
        return !m.key || m.key.trim() === '';
      }
    });
    
    this.setData({
      conversionMappings: mappings,
      hasEmptyConversionMapping: hasEmpty,
      conversionMappingError: hasEmpty ? '请填写所有转换映射' : ''
    });
  },
  
  /**
   * 从转换表执行转换（根据当前谱式类型决定转换目标）
   */
  executeConversionFromTable() {
    // 从 Storage 重新读取当前谱式类型，确保状态同步
    const storedType = wx.getStorageSync('notationType') || 'digital';
    const currentType = storedType;
    
    // 如果 data 中的 notationType 与存储不一致，更新 data
    if (this.data.notationType !== currentType) {
      console.warn('[转换表转换] 检测到状态不同步，已修正:', 
        this.data.notationType, '->', currentType);
      this.setData({ notationType: currentType });
    }
    
    // 如果当前是简谱则转换为数字谱，如果是数字谱则转换为简谱
    const targetType = currentType === 'simplified' ? 'digital' : 'simplified';
    
    // 检查是否有空的转换映射
    if (this.data.hasEmptyConversionMapping) {
      wx.showToast({ title: '请填写所有转换映射', icon: 'none' });
      return;
    }
    
    // 构建转换表（从映射数组）
    // 【修复】转换表格式：{源音符: 目标音符}
    // - 数字谱转简谱：{数字谱音符: 简谱音符}
    // - 简谱转数字谱：{简谱音符: 数字谱音符}
    const conversionTable = {};
    this.data.conversionMappings.forEach(m => {
      // 获取源音符和目标音符
      const sourceNote = m.sourceNote || (currentType === 'digital' ? m.key : m.simplified);
      const targetValue = currentType === 'digital' 
        ? (m.simplified && m.simplified.trim())  // 数字谱转简谱，目标是简谱值
        : (m.key && m.key.trim());               // 简谱转数字谱，目标是数字谱值
      
      if (sourceNote && targetValue) {
        conversionTable[sourceNote] = targetValue;
      }
    });
    
    console.log('[转换表转换] 开始转换:', currentType, '->', targetType);
    console.log('[转换表转换] 转换表:', conversionTable);
    
    // 显示加载界面
    this.showPageLoadingOverlay();
    
    // 更新当前谱式（先更新，确保转换时状态正确）
    this.setData({
      notationType: targetType
    });
    
    // 保存到存储（确保状态同步）
    wx.setStorageSync('notationType', targetType);
    
    // 延迟执行转换，让加载界面先显示
    setTimeout(() => {
      // 执行逐位转换
      this.performNotationConversion(conversionTable);
      
      // 【优化】刷新所有折叠模块的内嵌图片
      this.refreshCollapsedModulesImages();
      
      // 隐藏加载界面
      this.hidePageLoadingOverlay();
      
      console.log('[转换表转换] 转换完成:', targetType);
      
      wx.showToast({
        title: '已转换至' + (targetType === 'simplified' ? '简谱' : '数字谱'),
        icon: 'success'
      });
    }, 100);
  },
  
  /**
   * 删除转换表
   */
  deleteConversionTable(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个转换表吗？',
      success: (res) => {
        if (res.confirm) {
          const library = this.data.conversionTableLibrary.filter(t => t.id !== id);
          wx.setStorageSync('conversionTableLibrary', library);
          this.setData({ conversionTableLibrary: library });
          
          // 如果删除的是当前使用的，切回默认
          if (this.data.currentConversionTableId === id) {
            this.setData({ currentConversionTableId: null });
          }
        }
      }
    });
  },
  
  /**
   * 打开新建转换表弹窗
   */
  openNewConversionTableModal() {
    // 生成默认名称
    const library = this.data.conversionTableLibrary;
    let nameIndex = 1;
    while (library.some(t => t.name === `转换表${nameIndex}`)) {
      nameIndex++;
    }
    
    // 使用默认转换表作为模板
    const defaultTable = this.data.defaultConversionTable;
    const tableData = [];
    for (const key in defaultTable) {
      const value = defaultTable[key];
      tableData.push({
        key,
        simplified: Array.isArray(value) ? value[0] : value,
        spn: Array.isArray(value) ? value[1] : ''
      });
    }
    
    this.setData({
      showNewConversionTableModal: true,
      newConversionTableName: `转换表${nameIndex}`,
      newConversionTableData: tableData,
      newTableRootNote: this.data.conversionRootNote || 'F3'
    });
  },
  
  /**
   * 关闭新建转换表弹窗
   */
  closeNewConversionTableModal() {
    this.setData({
      showNewConversionTableModal: false,
      newConversionTableName: '',
      newConversionTableData: [],
      // 清理编辑状态
      showVirtualKeyboard: false,
      newTableEditingIndex: null,
      newTableEditingField: null,
      newTableUseNativeInput: false,
      virtualKeyboardDisplay: ''
    });
    
    // 显示tabBar
    wx.showTabBar({ animation: true });
  },
  
  /**
   * 新建转换表名称输入
   */
  onNewTableNameInput(e) {
    this.setData({ newConversionTableName: e.detail.value });
  },
  
  /**
   * 添加新行到转换表
   */
  addNewConversionRow() {
    const data = this.data.newConversionTableData;
    data.push({ key: '', simplified: '', spn: '' });
    this.setData({ newConversionTableData: data });
  },
  
  /**
   * 保存并应用新建的转换表
   */
  saveAndApplyNewTable() {
    const { newConversionTableName, newConversionTableData } = this.data;
    
    if (!newConversionTableName.trim()) {
      wx.showToast({ title: '请输入转换表名称', icon: 'none' });
      return;
    }
    
    // 构建转换表对象
    const table = {};
    newConversionTableData.forEach(item => {
      if (item.key) {
        table[item.key] = [item.simplified || '', item.spn || ''];
      }
    });
    
    // 保存到库
    const library = this.data.conversionTableLibrary;
    const newTable = {
      id: Date.now(),
      name: newConversionTableName,
      table: table,
      createTime: new Date().toLocaleDateString()
    };
    library.push(newTable);
    wx.setStorageSync('conversionTableLibrary', library);
    
    // 应用新表
    this.applyConversionTable(table);
    
    this.setData({
      conversionTableLibrary: library,
      currentConversionTableId: newTable.id
    });
    
    // 执行转换：根据当前谱式类型决定转换目标
    this.executeConversionFromTable();
    
    this.closeNewConversionTableModal();
    this.closeConversionLibrary();
    this.closeNotationTypeModal(); // 关闭主弹窗
  },
  
  /**
   * 转换表单元格点击（唤起虚拟键盘）
   * 【修复】使用 sourceNote 作为唯一标识符
   */
  onConversionCellTap(e) {
    const { key, field } = e.currentTarget.dataset;
    // key 参数实际传的是 sourceNote，使用它来查找映射
    const mapping = this.data.conversionMappings.find(m => m.sourceNote === key);
    if (!mapping) return;
    
    // 设置虚拟键盘编辑状态，重置原生输入状态
    this.setData({
      showVirtualKeyboard: true,
      virtualKeyboardDisplay: mapping[field] || '',
      conversionEditingKey: key, // 存储的是 sourceNote
      conversionEditingField: field,
      conversionUseNativeInput: false // 点击单元格时优先使用虚拟键盘
    }, () => {
      wx.hideTabBar({ animation: true });
    });
  },
  
  /**
   * 新建转换表单元格点击
   */
  onNewTableCellTap(e) {
    const { index, field } = e.currentTarget.dataset;
    const item = this.data.newConversionTableData[index];
    if (!item) return;
    
    this.setData({
      showVirtualKeyboard: true,
      virtualKeyboardDisplay: item[field] || '',
      newTableEditingIndex: index,
      newTableEditingField: field,
      newTableUseNativeInput: false // 重置为虚拟键盘输入
    }, () => {
      wx.hideTabBar({ animation: true });
    });
  },
  
  /**
   * 新建转换表的原生输入处理
   */
  onNewTableNativeInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    const updatedData = [...this.data.newConversionTableData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    };
    
    // 如果编辑的是simplified字段，需要重新计算SPN（使用新建表的独立首调）
    if (field === 'simplified') {
      updatedData[index].spn = this.calculateSpnFromSimplifiedWithRoot(value, this.data.newTableRootNote);
    }
    
    this.setData({
      newConversionTableData: updatedData,
      virtualKeyboardDisplay: value
    });
  },
  
  /**
   * 新建转换表的原生输入失焦处理
   */
  onNewTableNativeBlur(e) {
    this.setData({
      newTableUseNativeInput: false
    });
  },
  
  // ========== 首调选择器相关 ==========
  
  /**
   * 显示首调选择器
   */
  showConversionRootPicker() {
    const current = this.data.conversionRootNote || 'F3';
    const noteMatch = current.match(/^([A-G][#b]?)(\d)$/);
    
    const noteOptions = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const octaveOptions = ['1', '2', '3', '4', '5', '6'];
    
    let noteIndex = 0;
    let octaveIndex = 2; // 默认第3音区
    
    if (noteMatch) {
      noteIndex = noteOptions.indexOf(noteMatch[1]);
      if (noteIndex === -1) noteIndex = 0;
      octaveIndex = octaveOptions.indexOf(noteMatch[2]);
      if (octaveIndex === -1) octaveIndex = 2;
    }
    
    this.setData({
      showConversionRootPicker: true,
      spnNoteOptions: noteOptions,
      spnOctaveOptions: octaveOptions,
      conversionRootPickerValue: [noteIndex, octaveIndex],
      tempConversionRootNote: current
    });
  },
  
  /**
   * 首调选择器变化
   */
  onConversionRootPickerChange(e) {
    const [noteIndex, octaveIndex] = e.detail.value;
    const note = this.data.spnNoteOptions[noteIndex];
    const octave = this.data.spnOctaveOptions[octaveIndex];
    this.setData({
      tempConversionRootNote: note + octave,
      conversionRootPickerValue: [noteIndex, octaveIndex]
    });
  },
  
  /**
   * 确认首调选择
   * 根据当前打开的弹窗类型，更新对应的首调设置和SPN值
   */
  confirmConversionRootPicker() {
    const newRoot = this.data.tempConversionRootNote;
    const { isNewTableRootPicker, showNewConversionTableModal, showNewAudioMappingTableModal } = this.data;
    
    // 情况1: 谱式转换弹窗中的新建转换表
    if (isNewTableRootPicker && showNewConversionTableModal) {
      this.setData({
        newTableRootNote: newRoot,
        showConversionRootPicker: false,
        isNewTableRootPicker: false
      });
      // 重新计算新建表的SPN
      this.recalculateNewConversionTableSPN(newRoot);
      return;
    }
    
    // 情况2: 音频映射弹窗中的新建转换表
    if (isNewTableRootPicker && showNewAudioMappingTableModal) {
      this.setData({
        newAudioTableRootNote: newRoot,
        showConversionRootPicker: false,
        isNewTableRootPicker: false
      });
      // 重新计算新建音频表的SPN
      this.recalculateNewAudioTableSPN(newRoot);
      return;
    }
    
    // 情况3: 主弹窗的首调设置（影响谱式转换和音频映射两个弹窗）
    this.setData({
      conversionRootNote: newRoot,
      showConversionRootPicker: false,
      isNewTableRootPicker: false
    });
    
    // 重新计算所有SPN
    this.recalculateAllSPN();
  },
  
  /**
   * 关闭首调选择器
   */
  closeConversionRootPicker() {
    this.setData({ 
      showConversionRootPicker: false,
      isNewTableRootPicker: false
    });
  },
  
  /**
   * 重新计算所有SPN值（谱式转换和音频映射弹窗共用同一首调）
   */
  async recalculateAllSPN() {
    // 重新计算谱式转换弹窗的SPN
    const conversionMappings = this.data.conversionMappings.map(m => {
      const newSpn = this.simplifiedToSPN(m.simplified);
      return { ...m, spn: newSpn };
    });
    
    // 获取播放管理器以检查音频可用性
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    
    // 重新计算音频映射弹窗的SPN（如果已加载）
    // 【修复】使用播放管理器的等音名检查方法
    const audioMappings = this.data.audioMappings.map(m => {
      const newSpn = this.calculateSpnFromSimplified(m.simplified);
      let hasAudio = false;
      let actualSpn = newSpn;
      if (newSpn && playbackMgr) {
        const checkResult = playbackMgr.checkSpnAudioAvailable(newSpn);
        hasAudio = checkResult.available;
        actualSpn = checkResult.actualSpn;
      }
      return { 
        ...m, 
        spn: newSpn,
        hasAudio: hasAudio,
        actualSpn: actualSpn
      };
    });
    
    this.setData({ 
      conversionMappings: conversionMappings,
      audioMappings: audioMappings
    });
    
    // 【修复】检查是否需要加载额外的音频分包
    if (this.data.showAudioMappingModal && audioMappings.length > 0) {
      await this.checkAndLoadSubpackagesForMappings(audioMappings);
    }
  },
  
  /**
   * 检查并加载音频映射所需的分包
   * @param {Array} mappings - 音频映射数组
   */
  async checkAndLoadSubpackagesForMappings(mappings) {
    try {
      const playbackMgr = await getSheetPlaybackManager();
      const checkResult = await playbackMgr.checkMappingRequiresSubpackages(mappings);
      
      console.log('[Notation] 分包检查结果:', checkResult);
      
      if (checkResult.needsSubpackages && checkResult.subpackages.length > 0) {
        // 需要加载分包
        const subpackageNames = checkResult.subpackages.map(s => s.displayName).join('、');
        
        wx.showModal({
          title: '需要加载音频',
          content: `当前映射需要加载${subpackageNames}，是否立即加载？`,
          confirmText: '加载',
          cancelText: '稍后',
          success: async (res) => {
            if (res.confirm) {
              // 保存当前状态，准备导航加载
              this.setData({
                _pendingSubpackageReturn: true,
                _pendingAudioMappings: this.data.audioMappings,
                _pendingRootNote: this.data.conversionRootNote,
                _pendingModalWasOpen: this.data.showAudioMappingModal
              });
              
              // 触发分包加载
              const subpackagesToLoad = new Set(checkResult.subpackages.map(s => s.name));
              await playbackMgr.loadRequiredSubpackagesViaNavigation(subpackagesToLoad);
            }
          }
        });
      }
    } catch (e) {
      console.error('[Notation] 检查分包需求失败:', e);
    }
  },
  
  /**
   * 重新计算新建谱式转换表的SPN值
   * @param {string} rootNote - 新的首调设置
   */
  recalculateNewConversionTableSPN(rootNote) {
    const updatedData = this.data.newConversionTableData.map(item => {
      const newSpn = this.calculateSpnFromSimplifiedWithRoot(item.simplified, rootNote);
      return { ...item, spn: newSpn };
    });
    this.setData({ newConversionTableData: updatedData });
  },
  
  /**
   * 重新计算新建音频映射表的SPN值
   * @param {string} rootNote - 新的首调设置
   */
  async recalculateNewAudioTableSPN(rootNote) {
    // 【修复】获取播放管理器以检查音频可用性
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    
    const updatedData = this.data.newAudioMappingTableData.map(item => {
      const newSpn = this.calculateSpnFromSimplifiedWithRoot(item.simplified, rootNote);
      let hasAudio = false;
      if (newSpn && playbackMgr) {
        hasAudio = playbackMgr.mainPackageAudioFiles.has(newSpn) || 
                  playbackMgr.spnToSubpackage.has(newSpn);
      }
      return { 
        ...item, 
        spn: newSpn,
        hasAudio: hasAudio
      };
    });
    this.setData({ newAudioMappingTableData: updatedData });
  },
  
  /**
   * 显示新建表的首调选择器
   */
  showNewTableRootPicker() {
    const current = this.data.newTableRootNote || 'F3';
    const noteMatch = current.match(/^([A-G][#b]?)(\d)$/);
    
    const noteOptions = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
    const octaveOptions = ['1', '2', '3', '4', '5', '6'];
    
    let noteIndex = 0;
    let octaveIndex = 2;
    
    if (noteMatch) {
      noteIndex = noteOptions.indexOf(noteMatch[1]);
      if (noteIndex === -1) noteIndex = 0;
      octaveIndex = octaveOptions.indexOf(noteMatch[2]);
      if (octaveIndex === -1) octaveIndex = 2;
    }
    
    this.setData({
      showConversionRootPicker: true,
      spnNoteOptions: noteOptions,
      spnOctaveOptions: octaveOptions,
      conversionRootPickerValue: [noteIndex, octaveIndex],
      tempConversionRootNote: current,
      isNewTableRootPicker: true
    });
  },

  // 选择谱式类型
  selectNotationType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      notationTypeTemp: type
    });
  },

  // 数据迁移选项变化
  onMigrateChange(e) {
    const checked = e.detail.value;
    this.setData({
      migrateMeasures: checked
    });
  },

  // 自定义转换表选项变化
  onCustomTableChange(e) {
    const checked = e.detail.value;
    this.setData({
      customConversionTable: checked,
      conversionTableText: checked ? this.defaultTableToText() : '',
      conversionTableError: ''
    });
  },

  // 转换表输入变化
  onConversionTableInput(e) {
    const text = e.detail.value;
    this.setData({
      conversionTableText: text
    });
    this.validateConversionTable(text);
  },

  // 默认转换表转为文本格式
  defaultTableToText() {
    const table = this.data.defaultConversionTable;
    const lines = [];
    for (const key in table) {
      if (key !== 'T') { // 排除T重复项
        lines.push(`${key}-${table[key]}`);
      }
    }
    return lines.join('\n');
  },

  // 验证转换表格式
  validateConversionTable(text) {
    if (!text.trim()) {
      this.setData({ conversionTableError: '转换表不能为空' });
      return false;
    }

    const lines = text.trim().split('\n');
    const table = {};
    let hasError = false;
    let errorMsg = '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('%')) continue; // 跳过空行和注释

      const parts = trimmed.split('-');
      if (parts.length !== 2) {
        errorMsg = `格式错误：每行应为 "数字-简谱" 格式，如 "1-3"`;
        hasError = true;
        break;
      }

      const from = parts[0].trim();
      const to = parts[1].trim();

      if (!from || !to) {
        errorMsg = `格式错误：${trimmed} 缺少转换目标`;
        hasError = true;
        break;
      }

      // 验证from是否为有效的数字或D/T
      if (!/^[0-9DT]/.test(from)) {
        errorMsg = `格式错误：${from} 不是有效的数字符号`;
        hasError = true;
        break;
      }

      table[from] = to;
    }

    if (!hasError) {
      this.setData({
        conversionTableError: '',
        customConversionTableObj: table
      });
      return true;
    }

    this.setData({
      conversionTableError: errorMsg
    });
    return false;
  },

  // 确认谱式转换
  confirmNotationTypeChange() {
    const oldType = this.data.notationType;
    const newType = this.data.notationTypeTemp;

    // 防止重复转换：检查目标谱式是否与当前一致
    if (oldType === newType) {
      wx.showToast({
        title: '已是目标谱式，无需转换',
        icon: 'none'
      });
      this.closeNotationTypeModal();
      return;
    }

    // 检查是否有空的转换映射
    if (this.data.hasEmptyConversionMapping) {
      this.setData({
        conversionMappingError: '请填写所有转换映射'
      });
      return;
    }

    // 构建转换表（从映射数组）
    // 【修复】根据转换方向正确选择源和目标：
    // - 数字谱 → 简谱：源是 m.key（数字谱），目标是 m.simplified（简谱）
    // - 简谱 → 数字谱：源是 m.simplified（简谱），目标是 m.key（数字谱）
    const conversionTable = {};
    this.data.conversionMappings.forEach(m => {
      if (oldType === 'digital') {
        // 数字谱转简谱：key(数字谱) -> simplified(简谱)
        if (m.key && m.simplified && m.simplified.trim()) {
          conversionTable[m.key] = m.simplified.trim();
        }
      } else {
        // 简谱转数字谱：simplified(简谱) -> key(数字谱)
        // 【关键修复】使用 sourceNote 作为源（即谱面上的实际音符），key 作为目标
        const sourceNote = m.sourceNote || m.simplified;
        if (sourceNote && m.key && m.key.trim()) {
          conversionTable[sourceNote] = m.key.trim();
        }
      }
    });

    console.log('[谱式转换] 开始转换:', oldType, '->', newType);
    console.log('[谱式转换] 转换表:', conversionTable);

    // 【性能优化】清除音符显示缓存（谱式变更后缓存失效）
    this.clearNoteCache();

    // 先关闭弹窗并显示加载界面
    this.closeNotationTypeModal();
    this.showPageLoadingOverlay();

    // 更新当前谱式（先更新，确保转换时状态正确）
    this.setData({
      notationType: newType
    });

    // 保存到存储（确保状态同步）
    wx.setStorageSync('notationType', newType);

    // 延迟执行转换，让加载界面先显示
    setTimeout(() => {
      // 执行逐位转换
      this.performNotationConversion(conversionTable);
      
      // 【优化】刷新所有折叠模块的内嵌图片
      this.refreshCollapsedModulesImages();
      
      // 隐藏加载界面
      this.hidePageLoadingOverlay();
      
      console.log('[谱式转换] 转换完成:', newType);
      
      wx.showToast({
        title: '已转换至' + (newType === 'simplified' ? '简谱' : '数字谱'),
        icon: 'success'
      });
    }, 100);
  },
  
  /**
   * 设置转换模式
   */
  setConversionMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ conversionMode: mode });
  },
  
  /**
   * 确认转换 - 根据转换模式执行不同的转换逻辑
   */
  confirmConversion() {
    if (this.data.conversionMode === 'noMapping') {
      this.confirmNoMappingConversion();
    } else {
      this.confirmNotationTypeChange();
    }
  },
  
  /**
   * 无映射转换 - 直接切换谱式，不进行实际的音符内容转换
   * 仅切换显示模式，保留原有音符数据
   */
  confirmNoMappingConversion() {
    const newType = this.data.notationTypeTemp;
    
    // 【性能优化】清除音符显示缓存（谱式变更后缓存失效）
    this.clearNoteCache();
    
    // 关闭弹窗
    this.closeNotationTypeModal();
    
    // 更新当前谱式
    this.setData({
      notationType: newType
    });
    
    // 保存到存储
    wx.setStorageSync('notationType', newType);
    
    wx.showToast({
      title: '已切换至' + (newType === 'simplified' ? '简谱' : '数字谱'),
      icon: 'success'
    });
  },

  // 执行谱式转换（逐位转换，避免重复转换）
  performNotationConversion(conversionTable) {
    const newNotations = this.data.notations.map(notation => ({
      ...notation,
      measures: notation.measures.map(measure => ({
        beats: measure.beats.map(beat => ({
          subdivisions: beat.subdivisions.map(sub => ({
            rightHand: sub.rightHand.map(note => this.convertSingleNote(note, conversionTable)),
            leftHand: sub.leftHand.map(note => this.convertSingleNote(note, conversionTable))
          })),
          barLineAfter: beat.barLineAfter
        }))
      }))
    }));

    this.setNotations(newNotations);
    this.saveNotationsScoped(newNotations);
  },

  /**
   * 转换单个音符（支持复杂结构）
   * 
   * 对于复杂音符结构如 <1,^{5,}>，需要分别转换：
   * - 主音符 1, -> 转换后的值
   * - 上标内容 5, -> 转换后的值
   * 
   * 转换后重新组装为完整的音符字符串
   * 
   * 支持带修饰符的音符转换：
   * - 下划线 _ ：时值标记，转换后保留
   * - 单引号 ' ：高八度标记，需要叠加到转换值
   * - 逗号 , ：低八度标记，需要叠加到转换值
   */
  convertSingleNote(note, conversionTable) {
    if (!note || note.trim() === '' || note === '-') {
      return note;
    }
    
    const trimmedNote = note.trim();
    
    // 检测是否被 <> 或 {} 包裹
    let hasBracket = false;
    let bracketType = '';
    let content = trimmedNote;
    
    if ((trimmedNote.startsWith('<') && trimmedNote.endsWith('>')) ||
        (trimmedNote.startsWith('{') && trimmedNote.endsWith('}'))) {
      hasBracket = true;
      bracketType = trimmedNote[0] === '<' ? '<>' : '{}';
      content = trimmedNote.slice(1, -1);
    }
    
    // 简单音符：支持带修饰符的转换
    if (!content.includes('^{')) {
      const converted = this.convertNoteWithModifiers(content, conversionTable);
      // 如果原来有括号包裹，保持包裹
      if (hasBracket) {
        return bracketType === '<>' ? `<${converted}>` : `{${converted}}`;
      }
      return converted;
    }
    
    // 复杂音符：需要分别转换主音符和上标内容
    let result = '';
    let remaining = content;
    
    // 处理左上标 ^{...}
    const leftSupMatch = remaining.match(/^\^\{([^}]*)\}(.*)$/);
    if (leftSupMatch) {
      const supContent = leftSupMatch[1];
      remaining = leftSupMatch[2];
      // 转换上标内容（支持带修饰符）
      const convertedSup = this.convertNoteWithModifiers(supContent, conversionTable);
      result += `^{${convertedSup}}`;
    }
    
    // 处理右上标 ...^{...}
    const rightSupMatch = remaining.match(/^(.+?)\^\{([^}]*)\}$/);
    if (rightSupMatch) {
      const mainPart = rightSupMatch[1];
      const supContent = rightSupMatch[2];
      // 转换主音符部分（支持带修饰符）
      const convertedMain = this.convertNoteWithModifiers(mainPart, conversionTable);
      // 转换上标内容（支持带修饰符）
      const convertedSup = this.convertNoteWithModifiers(supContent, conversionTable);
      result += `${convertedMain}^{${convertedSup}}`;
    } else if (remaining) {
      // 没有右上标，转换剩余部分（支持带修饰符）
      const convertedMain = this.convertNoteWithModifiers(remaining, conversionTable);
      result += convertedMain;
    }
    
    // 如果原来有括号包裹，保持包裹
    if (hasBracket) {
      return bracketType === '<>' ? `<${result}>` : `{${result}}`;
    }
    
    return result;
  },

  /**
   * 转换带修饰符的音符
   * 
   * 查找顺序（按优先级）：
   * 1. 完整匹配（包括所有修饰符）
   * 2. 去掉下划线后匹配（保留八度标记）- 用于简谱转数字谱时，如 1'_ -> 1' -> 6
   * 3. 基础音符匹配（去掉所有修饰符）- 用于数字谱转简谱时，如 4_ -> 4 -> 6
   * 
   * @param {string} noteStr - 带修饰符的音符字符串（如 4_, 1', 5,,_, 1'_）
   * @param {object} conversionTable - 转换表
   * @returns {string} 转换后的音符
   */
  convertNoteWithModifiers(noteStr, conversionTable) {
    if (!noteStr || noteStr === '-') return noteStr;
    
    // 提取修饰符数量
    const underscoreCount = (noteStr.match(/_/g) || []).length;
    const octaveUpCount = (noteStr.match(/'/g) || []).length;
    const octaveDownCount = (noteStr.match(/,/g) || []).length;
    
    // 构建各种匹配形式
    const noteWithoutUnderscore = noteStr.replace(/_/g, ''); // 去掉下划线，保留八度标记
    const baseNote = noteStr.replace(/[_',]/g, ''); // 去掉所有修饰符
    
    if (!baseNote) return noteStr;
    
    // 1. 尝试完整匹配（包括所有修饰符）
    if (conversionTable[noteStr] !== undefined) {
      const tableValue = conversionTable[noteStr];
      if (Array.isArray(tableValue)) {
        return tableValue[0] || noteStr;
      }
      return tableValue;
    }
    
    // 2. 尝试去掉下划线后匹配（保留八度标记）
    // 下划线是时值标记，不影响音符本身，如 1'_ -> 查找 1' -> 得到 6 -> 返回 6_
    if (underscoreCount > 0 && conversionTable[noteWithoutUnderscore] !== undefined) {
      let converted = conversionTable[noteWithoutUnderscore];
      if (Array.isArray(converted)) {
        converted = converted[0] || noteWithoutUnderscore;
      }
      // 转换值不叠加八度（因为八度标记已经在查找时使用了）
      // 只需要保留下划线
      return converted + "_".repeat(underscoreCount);
    }
    
    // 【修复】移除第3步的基础音符匹配逻辑
    // 原来的逻辑会导致未在转换表中配置的音符被"智能"转换（如 1' 通过 1 匹配转换为 3'）
    // 根据用户需求，只有在转换表中明确配置的映射才应该生效
    // 如果转换表中没有对应值，返回原值（保持不变）
    return noteStr;
  },

  // 转换为简谱
  convertToSimplifiedNotation() {
    const table = this.data.customConversionTable 
      ? this.data.customConversionTableObj 
      : this.data.defaultConversionTable;

    const newNotations = this.data.notations.map(notation => ({
      ...notation,
      measures: notation.measures.map(measure => ({
        beats: measure.beats.map(beat => ({
          subdivisions: beat.subdivisions.map(sub => ({
            rightHand: sub.rightHand.map(note => this.convertNoteToSimplified(note, table)),
            leftHand: sub.leftHand.map(note => this.convertNoteToSimplified(note, table))
          })),
          barLineAfter: beat.barLineAfter
        }))
      }))
    }));

    this.setNotations(newNotations);
    this.saveNotationsScoped(newNotations);
  },

  // 转换为数字谱
  convertToDigitalNotation() {
    const table = this.data.customConversionTable 
      ? this.data.customConversionTableObj 
      : this.data.defaultConversionTable;

    // 反向转换表：根据简谱查找对应的数字谱
    // 处理多对一映射的情况（如 'T' 和 'D' 都映射到相同值）
    const reverseTable = {};
    const baseToSourceMap = {}; // 简谱基础音符 -> 数字谱基础音符的映射
    
    for (const key in table) {
      if (key === 'T') continue; // 跳过 T，因为 D 也映射到相同值
      const tableValue = table[key];
      
      // 处理数组格式 [简谱, SPN] 和字符串格式
      const simplifiedValue = Array.isArray(tableValue) ? tableValue[0] : tableValue;
      
      if (simplifiedValue) {
        reverseTable[simplifiedValue] = key;
        
        // 记录基础音符映射（去除八度标记和下划线），用于修饰符查找
        const baseSimplified = simplifiedValue.replace(/['',_]/g, '');
        const baseDigital = key.replace(/['',_]/g, '');
        if (!baseToSourceMap[baseSimplified]) {
          baseToSourceMap[baseSimplified] = baseDigital;
        }
      }
    }

    const newNotations = this.data.notations.map(notation => ({
      ...notation,
      measures: notation.measures.map(measure => ({
        beats: measure.beats.map(beat => ({
          subdivisions: beat.subdivisions.map(sub => ({
            rightHand: sub.rightHand.map(note => this.convertNoteToDigital(note, reverseTable, baseToSourceMap)),
            leftHand: sub.leftHand.map(note => this.convertNoteToDigital(note, reverseTable, baseToSourceMap))
          })),
          barLineAfter: beat.barLineAfter
        }))
      }))
    }));

    this.setNotations(newNotations);
    this.saveNotationsScoped(newNotations);
  },

  // 将音符转换为简谱
  // 支持带修饰符的音符：下划线(_)、八度标记('和,)
  convertNoteToSimplified(note, table) {
    if (!note || note.length === 0) {
      return '';
    }

    // 使用 convertNoteWithModifiers 处理带修饰符的音符
    return this.convertNoteWithModifiers(note, table);
  },

  // 将音符转换为数字谱
  // 支持带修饰符的简谱音符：下划线(_)、八度标记('和,)
  convertNoteToDigital(note, reverseTable, baseToSourceMap) {
    if (!note || note.length === 0) {
      return '';
    }

    // 提取简谱修饰符
    const underscoreCount = (note.match(/_/g) || []).length;
    const octaveUpCount = (note.match(/'/g) || []).length;
    const octaveDownCount = (note.match(/,/g) || []).length;
    
    // 提取基础音符（去掉所有修饰符）
    const baseNote = note.replace(/[_',]/g, '');
    
    if (!baseNote) return note;

    // 首先尝试精确匹配（包含完整修饰符）
    if (reverseTable[note]) {
      return reverseTable[note];
    }
    
    // 尝试去掉下划线后精确匹配（八度标记保留）
    const noteWithoutUnderscore = note.replace(/_/g, '');
    if (reverseTable[noteWithoutUnderscore]) {
      const digitalNote = reverseTable[noteWithoutUnderscore];
      // 保留下划线
      return underscoreCount > 0 ? digitalNote + "_".repeat(underscoreCount) : digitalNote;
    }
    
    // 尝试基础音符匹配
    if (reverseTable[baseNote]) {
      const digitalNote = reverseTable[baseNote];
      // 数字谱中不使用八度标记，只保留下划线
      return underscoreCount > 0 ? digitalNote + "_".repeat(underscoreCount) : digitalNote;
    }
    
    // 使用基础音符映射表查找
    if (baseToSourceMap && baseToSourceMap[baseNote]) {
      const digitalBase = baseToSourceMap[baseNote];
      // 数字谱中不使用八度标记，只保留下划线
      return underscoreCount > 0 ? digitalBase + "_".repeat(underscoreCount) : digitalBase;
    }

    // 无法转换，返回原值
    return note;
  },

  // 加载谱式设置
  // 设置 notations 数据并自动更新分页
  setNotations(notations, forceReinit = false) {
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    
    // Quick Win: 预计算样式值，减少WXML中WXS函数重复调用
    const orientation = this.data.orientation;
    const withStyles = this.precomputeStyles(withOffsets, orientation);
    
    // 【Canvas模式迁移】为每个notation预计算Canvas高度
    const withCanvasHeight = withStyles.map(notation => ({
      ...notation,
      canvasHeight: this.calculateCanvasHeight(notation)
    }));
    
    // 模块增删等结构性变动时，销毁所有旧渲染器，避免持有已失效的Canvas DOM引用
    if (forceReinit && this._canvasRenderers) {
      Object.keys(this._canvasRenderers).forEach(id => {
        if (this._canvasRenderers[id]) {
          this._canvasRenderers[id].destroy();
        }
      });
      this._canvasRenderers = {};
    }
    
    this.setData({ notations: withCanvasHeight });
    this.calculatePages();
    
    // 【Canvas模式迁移】延迟初始化所有Canvas渲染器
    // 结构性变动使用更长延迟确保DOM完全重建
    const delay = forceReinit ? 500 : 300;
    setTimeout(() => {
      this.initAllCanvasRenderers();
    }, delay);
  },
  
  /**
   * 【Canvas模式迁移】初始化当前页面所有notation的Canvas渲染器
   * 这是全面使用Canvas2D模式的核心方法
   */
  initAllCanvasRenderers() {
    const { notations, currentPageModules } = this.data;
    if (!notations || notations.length === 0) return;
    
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    // 获取当前页面可见的modules
    const visibleModules = currentPageModules || notations.map((n, i) => ({ id: n.id, index: i }));
    
    console.log('[Canvas] 初始化所有Canvas渲染器，模块数量:', visibleModules.length);
    
    // 依次初始化每个可见module的Canvas
    visibleModules.forEach(({ id, index }, idx) => {
      const notation = notations[index];
      if (!notation) return;
      
      const existingRenderer = this._canvasRenderers[notation.id];
      
      // 【Bug修复】检查是否需要重新初始化渲染器
      // 情况1: Canvas高度发生变化（如拍号改变、插入行等）
      // 情况2: collapsed状态且tempImagePath被清除（Canvas元素可能被WXML重新创建）
      const expectedHeight = notation.canvasHeight || this.calculateCanvasHeight(notation);
      const needsReinit = existingRenderer && (
        // 高度变化超过阈值
        (existingRenderer.height && Math.abs(existingRenderer.height - expectedHeight) > 5) ||
        // 【关键修复】collapsed状态且无图片时，Canvas元素可能是新创建的，需要重新获取节点
        (notation.collapsed && !notation.tempImagePath)
      );
      
      if (needsReinit) {
        console.log('[Canvas] 需要重新初始化渲染器:', notation.id, 
          'collapsed:', notation.collapsed, 'tempImagePath:', !!notation.tempImagePath,
          'heightChange:', existingRenderer?.height, '->', expectedHeight);
        // 销毁旧渲染器
        if (existingRenderer) {
          existingRenderer.destroy();
          delete this._canvasRenderers[notation.id];
        }
        // 延迟重新初始化（确保新的Canvas节点已渲染）
        // 使用带重试机制的方法，因为Canvas节点可能需要时间才能准备好
        setTimeout(() => {
          this.initCanvasRendererForModuleWithRetry(notation.id, index, 5);
        }, idx * 30 + 100);
        return;
      }
      
      if (existingRenderer) {
        // 渲染器存在且不需要重新初始化，只更新数据并重新渲染
        existingRenderer.setData(notation, this.data.orientation, notation.measuresPerRow || this.data.measuresPerRow);
        existingRenderer.render();
        return;
      }
      
      // 【Bug修复】延迟初始化，使用带重试机制的方法
      // 避免同时初始化太多Canvas导致卡顿，且处理Canvas节点未就绪的情况
      setTimeout(() => {
        this.initCanvasRendererForModuleWithRetry(notation.id, index, 5);
      }, idx * 30); // 每个间隔30ms
    });
  },
  
  /**
   * 【Canvas模式迁移】为单个module初始化Canvas渲染器
   * @param {string} notationId - notation ID
   * @param {number} notationIndex - notation 在数组中的索引
   */
  initCanvasRendererForModule(notationId, notationIndex) {
    const notation = this.data.notations[notationIndex];
    if (!notation) return;
    
    const canvasId = `notation-canvas-${notationId}`;
    
    // 获取Canvas节点
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        // Canvas节点可能还未渲染，稍后重试
        console.log('[Canvas] 等待Canvas节点就绪:', canvasId);
        return;
      }
      
      const canvas = res[0].node;
      const width = res[0].width;
      const height = res[0].height;
      
      if (width === 0 || height === 0) {
        console.log('[Canvas] Canvas尺寸为0，跳过初始化:', canvasId);
        return;
      }
      
      // 如果已有渲染器，先销毁
      if (this._canvasRenderers[notationId]) {
        this._canvasRenderers[notationId].destroy();
      }
      
      // 创建渲染器实例（含已缓存的琶音图）
      const renderer = new CanvasNotationRenderer(this.getCanvasRendererOptions());
      
      // 初始化Canvas
      renderer.init(canvas, width, height);
      
      // 【Bug修复】设置数据（使用notation自己的measuresPerRow，如果没有则使用全局值）
      renderer.setData(notation, this.data.orientation, notation.measuresPerRow || this.data.measuresPerRow);
      
      // 渲染
      renderer.render();
      
      // 保存渲染器实例
      this._canvasRenderers[notationId] = renderer;
      
      this.loadArpeggioImageIfNeeded(canvas);
      
      // 预计算并缓存列坐标（用于播放光标）
      const columnRects = renderer.getAllColumnRects();
      this._columnRectsCache = this._columnRectsCache || {};
      this._columnRectsCache[notationId] = columnRects;
      
      console.log('[Canvas] 模块Canvas初始化完成:', notationId, 'size:', width, 'x', height);
      
      // 【重要】如果是collapsed状态且没有tempImagePath，转换为图片（保持原有行为）
      if (notation.collapsed && !notation.tempImagePath) {
        setTimeout(() => {
          this.convertCanvasToImage(notationId, notationIndex);
        }, 100);
      }
    });
  },
  
  /**
   * 【Bug修复】带重试机制的Canvas渲染器初始化
   * 用于拍号切换等场景，Canvas节点可能需要时间才能准备好
   * @param {string} notationId - 谱面ID
   * @param {number} notationIndex - 谱面索引
   * @param {number} retries - 剩余重试次数
   */
  initCanvasRendererForModuleWithRetry(notationId, notationIndex, retries) {
    // 【Bug修复】重新获取最新的notation数据，避免使用过时数据
    const notation = this.data.notations[notationIndex];
    if (!notation) return;
    
    const canvasId = `notation-canvas-${notationId}`;
    
    // 获取Canvas节点
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      if (!res || !res[0] || !res[0].node) {
        // Canvas节点未找到，如果还有重试次数，延迟后重试
        if (retries > 0) {
          console.log(`[Canvas] 节点未就绪，${retries}次重试后重新初始化:`, canvasId);
          setTimeout(() => {
            this.initCanvasRendererForModuleWithRetry(notationId, notationIndex, retries - 1);
          }, 150);
        } else {
          console.warn('[Canvas] 多次重试后仍未找到Canvas节点:', canvasId);
        }
        return;
      }
      
      const canvas = res[0].node;
      const width = res[0].width;
      const height = res[0].height;
      
      if (width === 0 || height === 0) {
        // 尺寸为0，可能Canvas还没完全渲染，重试
        if (retries > 0) {
          console.log(`[Canvas] 尺寸为0，${retries}次重试:`, canvasId);
          setTimeout(() => {
            this.initCanvasRendererForModuleWithRetry(notationId, notationIndex, retries - 1);
          }, 150);
        }
        return;
      }
      
      // 【Bug修复】找到节点且尺寸有效，直接在这里初始化渲染器（避免再次查询导致的时序问题）
      // 重新获取最新的notation数据
      const currentNotation = this.data.notations[notationIndex];
      if (!currentNotation) return;
      
      // 确保 _canvasRenderers 存在
      if (!this._canvasRenderers) {
        this._canvasRenderers = {};
      }
      
      // 如果已有渲染器，先销毁
      if (this._canvasRenderers[notationId]) {
        this._canvasRenderers[notationId].destroy();
        delete this._canvasRenderers[notationId];
      }
      
      // 创建渲染器实例（含已缓存的琶音图）
      const CanvasNotationRenderer = require('../../utils/canvasRenderer').CanvasNotationRenderer;
      const renderer = new CanvasNotationRenderer(this.getCanvasRendererOptions());
      
      // 初始化Canvas
      renderer.init(canvas, width, height);
      
      // 设置数据
      renderer.setData(currentNotation, this.data.orientation, currentNotation.measuresPerRow || this.data.measuresPerRow);
      
      // 渲染
      renderer.render();
      
      // 保存渲染器实例
      this._canvasRenderers[notationId] = renderer;
      
      this.loadArpeggioImageIfNeeded(canvas);
      
      // 预计算并缓存列坐标（用于播放光标）
      const columnRects = renderer.getAllColumnRects();
      this._columnRectsCache = this._columnRectsCache || {};
      this._columnRectsCache[notationId] = columnRects;
      
      console.log('[Canvas] 模块Canvas初始化完成(带重试):', notationId, 'size:', width, 'x', height);
      
      // 【重要】如果是collapsed状态且没有tempImagePath，转换为图片
      // 【Bug修复】延长等待时间，确保渲染完成后再转换图片（拍号切换等场景需要更长时间）
      const latestNotation = this.data.notations[notationIndex];
      if (latestNotation && latestNotation.collapsed && !latestNotation.tempImagePath) {
        setTimeout(() => {
          this.convertCanvasToImage(notationId, notationIndex);
        }, 200); // 增加延迟从100ms到200ms
      }
    });
  },
  
  /**
   * 验证并修复失效的 tempImagePath
   * 小程序重新进入后，之前生成的临时图片文件可能已被系统清除
   * 检测到失效路径后，清除该路径并触发 Canvas 重新渲染
   */
  validateAndFixTempImages() {
    const { notations, readingMode } = this.data;
    if (!notations || notations.length === 0) return;
    
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    // 收集需要验证的 notations（有 tempImagePath 的）
    const toValidate = notations.filter(n => n.tempImagePath && n.collapsed);
    if (toValidate.length === 0) return;
    
    console.log('[Canvas] 验证临时图片有效性，数量:', toValidate.length);
    
    // 使用 FileSystemManager 检查文件是否存在
    const fs = wx.getFileSystemManager();
    const invalidPaths = [];
    let checkedCount = 0;
    
    toValidate.forEach((notation, idx) => {
      try {
        fs.access({
          path: notation.tempImagePath,
          success: () => {
            // 文件存在，无需处理
            checkedCount++;
            if (checkedCount === toValidate.length) {
              this._fixInvalidTempImages(invalidPaths);
            }
          },
          fail: () => {
            // 文件不存在，需要重新渲染
            console.log('[Canvas] 临时图片失效:', notation.id);
            const notationIndex = notations.findIndex(n => n.id === notation.id);
            if (notationIndex >= 0) {
              invalidPaths.push({ id: notation.id, index: notationIndex });
            }
            checkedCount++;
            if (checkedCount === toValidate.length) {
              this._fixInvalidTempImages(invalidPaths);
            }
          }
        });
      } catch (e) {
        // access 调用异常，视为文件无效
        const notationIndex = notations.findIndex(n => n.id === notation.id);
        if (notationIndex >= 0) {
          invalidPaths.push({ id: notation.id, index: notationIndex });
        }
        checkedCount++;
        if (checkedCount === toValidate.length) {
          this._fixInvalidTempImages(invalidPaths);
        }
      }
    });
  },
  
  /**
   * 修复失效的临时图片路径
   * @private
   */
  _fixInvalidTempImages(invalidPaths) {
    if (!invalidPaths || invalidPaths.length === 0) return;
    
    console.log('[Canvas] 需要重新渲染的模块数量:', invalidPaths.length);
    
    // 批量清除失效的 tempImagePath
    const updateData = {};
    invalidPaths.forEach(({ id, index }) => {
      updateData[`notations[${index}].tempImagePath`] = null;
      updateData[`notations[${index}].canvasHeight`] = this.calculateCanvasHeight(this.data.notations[index]);
    });
    
    this.setData(updateData, () => {
      // 延迟触发重新渲染
      setTimeout(() => {
        invalidPaths.forEach(({ id, index }) => {
          this.initCanvasRendererWithRetry(id, index, 3);
        });
      }, 100);
    });
  },

  // Quick Win: 预计算每个notation的样式值（避免WXML中重复计算）
  precomputeStyles(notations, orientation) {
    const LANDSCAPE_SCALE = 18 / 28;
    const isLandscape = orientation === 'landscape';
    
    return notations.map(notation => {
      const style = notation.style || {};
      const measuresPerRow = notation.measuresPerRow || this.data.measuresPerRow || 1;
      const isMultiMeasure = measuresPerRow > 1;
      
      // 计算基础样式值（优先模块级样式，fallback到全局样式）
      const gs = this.getGlobalStyleDefaults();
      const baseFontSize = style.noteFontSize || gs.noteFontSize;
      const baseMeasureHeight = style.measureHeight || (isMultiMeasure ? 110 : gs.measureHeight);
      const baseLineSpacing = style.lineSpacing || gs.lineSpacing;
      
      // 根据横竖屏计算实际显示值
      const fontSize = isLandscape ? Math.round(baseFontSize * LANDSCAPE_SCALE) : baseFontSize;
      const measureHeight = isLandscape ? Math.round(baseMeasureHeight * LANDSCAPE_SCALE) : baseMeasureHeight;
      const lineSpacing = isLandscape ? Math.round(baseLineSpacing * LANDSCAPE_SCALE) : baseLineSpacing;
      
      // 计算派生样式值
      let slotHeight = Math.round(measureHeight * 0.225);
      if (slotHeight < 18) slotHeight = 18;
      if (slotHeight > 60) slotHeight = 60;
      
      let columnGap = Math.round(measureHeight * 0.05);
      if (columnGap < 4) columnGap = 4;
      if (columnGap > 16) columnGap = 16;
      
      return {
        ...notation,
        _computed: {
          fontSize,
          measureHeight,
          lineSpacing,
          slotHeight,
          columnGap
        }
      };
    });
  },

  // 计算分页：1页最多64小节，创建分页数组
  calculatePages() {
    const notations = this.data.notations || [];
    if (!Array.isArray(notations) || notations.length === 0) {
      this.setData({
        pages: [],
        currentPage: 0,
        totalPages: 1,
        enablePagination: false
      });
      return;
    }

    const MEASURES_PER_PAGE = 64; // 1页最多64小节
    const pages = [];
    let currentPageModules = [];
    let currentMeasureCount = 0;
    let pageStartMeasureCount = 0;

    for (let i = 0; i < notations.length; i++) {
      const notation = notations[i];
      const moduleId = notation.id || `module-${i}`;
      const moduleMeasureCount = (notation.measures && notation.measures.length) || 0;

      // 如果加入当前module会超过每页小节上限，且已有module在页面中，则开启新页面
      if (currentMeasureCount > 0 && currentMeasureCount + moduleMeasureCount > MEASURES_PER_PAGE) {
        // 保存当前页
        pages.push({
          modules: currentPageModules,
          startMeasureCount: pageStartMeasureCount,
          endMeasureCount: pageStartMeasureCount + currentMeasureCount - 1
        });
        // 开启新页面
        currentPageModules = [{ id: moduleId, index: i, measures: moduleMeasureCount }];
        pageStartMeasureCount += currentMeasureCount;
        currentMeasureCount = moduleMeasureCount;
      } else {
        // 添加到当前页面
        currentPageModules.push({ id: moduleId, index: i, measures: moduleMeasureCount });
        currentMeasureCount += moduleMeasureCount;
      }
    }

    // 添加最后一页
    if (currentPageModules.length > 0) {
      pages.push({
        modules: currentPageModules,
        startMeasureCount: pageStartMeasureCount,
        endMeasureCount: pageStartMeasureCount + currentMeasureCount - 1
      });
    }

    // 决定是否启用分页（超过1页时启用）
    const enablePagination = pages.length > 1;
    const totalPages = pages.length || 1;
    
    // 获取当前页的modules（如果当前页超出范围，则显示第一页）
    const newCurrentPage = this.data.currentPage >= pages.length ? 0 : this.data.currentPage;
    const pageModules = pages.length > 0 && pages[newCurrentPage] ? pages[newCurrentPage].modules : [];

    this.setData({
      pages: pages,
      currentPage: newCurrentPage,
      totalPages: totalPages,
      enablePagination: enablePagination,
      currentPageModules: pageModules
    });

    // console.log('分页计算完成:', {pages, totalPages, enablePagination});
  },

  loadNotationType() {
    // 检查是否有预加载数据
    const preloaded = app.globalData;
    if (preloaded && preloaded.preloadedSettings) {
      this.setData({
        notationType: preloaded.preloadedSettings.notationType || 'digital'
      });
      console.log('Using preloaded notation type');
      return;
    }
    
    const notationType = wx.getStorageSync('notationType') || 'digital';
    this.setData({
      notationType: notationType
    });
  },

  // 触摸开始：记录起始位置
  onTouchStart(e) {
    if (!this.data.enablePagination || this.data.totalPages <= 1) return;
    const touches = e.touches;
    if (touches.length > 0) {
      this.setData({
        touchStartX: touches[0].clientX,
        touchStartY: touches[0].clientY
      });
    }
  },

  // 触摸移动：达到切页阈值时提前显示遮罩与节拍器，避免仅点击误触
  onTouchMove(e) {
    if (!this.data.enablePagination || this.data.totalPages <= 1) return;
    try {
      const touches = e.touches;
      if (touches.length === 0) return;
      const moveX = touches[0].clientX;
      const moveY = touches[0].clientY;
      const deltaX = this.data.touchStartX - moveX; // 正数表示向左拖动
      const deltaY = this.data.touchStartY - moveY;
      const minDistance = 50;

      const atFirstPage = this.data.currentPage === 0;
      const atLastPage = this.data.currentPage >= this.data.totalPages - 1;
      // 首尾页不响应越界方向滑动
      if ((atFirstPage && deltaX < 0) || (atLastPage && deltaX > 0)) {
        return;
      }

      // 仅当明确是水平换页拖动且超过阈值时显示遮罩
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
        if (!this.data.showPageLoadingOverlay && !this.data.pageTransitioning) {
          this.showPageLoadingOverlay();
        }
      }
    } catch (err) {
      // 忽略触摸事件错误，避免渲染层报错
      console.warn('Touch move error ignored:', err.message);
    }
  },

  // 触摸结束：检测滑动方向和距离，决定是否切页
  onTouchEnd(e) {
    if (!this.data.enablePagination) return;
    
    const changedTouches = e.changedTouches;
    if (changedTouches.length === 0) return;

    const endX = changedTouches[0].clientX;
    const endY = changedTouches[0].clientY;
    const deltaX = this.data.touchStartX - endX; // 正数表示向左滑动
    const deltaY = this.data.touchStartY - endY;

    // 最小滑动距离（rpx转px需要考虑，这里使用简化的检测）
    const minDistance = 50;
    
    // 检测是否是水平滑动（水平距离 > 垂直距离）
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minDistance) {
      const atFirstPage = this.data.currentPage === 0;
      const atLastPage = this.data.currentPage >= this.data.totalPages - 1;
      if (deltaX > 0) {
        // 向左滑动：加载下一页
        if (atLastPage) {
          this.hidePageLoadingOverlay();
          return;
        }
        this.turnToNextPage();
      } else {
        // 向右滑动：加载上一页
        if (atFirstPage) {
          this.hidePageLoadingOverlay();
          return;
        }
        this.turnToPreviousPage();
      }
    } else {
      // 未达切页条件：若已显示加载遮罩，则及时关闭，避免残留计时器与声音
      if (this.data.showPageLoadingOverlay && !this.data.pageTransitioning) {
        this.hidePageLoadingOverlay();
      }
    }
  },

  // 切到下一页
  turnToNextPage() {
    const currentPage = this.data.currentPage;
    const totalPages = this.data.totalPages;
    
    if (currentPage < totalPages - 1) {
      this.switchToPage(currentPage + 1, 'left');
    } else {
      this.hidePageLoadingOverlay();
    }
  },

  // 切到上一页
  turnToPreviousPage() {
    const currentPage = this.data.currentPage;
    
    if (currentPage > 0) {
      this.switchToPage(currentPage - 1, 'right');
    } else {
      this.hidePageLoadingOverlay();
    }
  },

  // 平滑切换到指定页面
  switchToPage(newPage, direction) {
    // 先立即显示加载遮罩和节拍器，确保优先渲染（若已显示则不重复触发）
    if (!this.data.showPageLoadingOverlay) {
      this.showPageLoadingOverlay();
    }

    // 等待下一帧让遮罩先绘制，再执行淡出与数据切换
    wx.nextTick(() => {
      // 开始过渡动画
      this.setData({
        pageTransitioning: true,
        pageTransitionDirection: direction
      });

      // 等待淡出动画完成后切换内容
      setTimeout(() => {
        const currentPageModules = this.data.pages[newPage] ? this.data.pages[newPage].modules : [];
        
        this.setData({
          currentPage: newPage,
          currentPageModules: currentPageModules
        });

        // 滚动到顶部
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0  // 立即滚动
        });

        // 等待新内容渲染后开始淡入
        setTimeout(() => {
          this.setData({
            pageTransitioning: false
          });

          // 【Bug修复】切页后初始化新页面所有模块的Canvas渲染器
          // 无论是否在阅读模式，都需要初始化新页面的Canvas
          this.initCanvasRenderersForPageAll(newPage);

          // 再等待一帧，关闭加载遮罩与节拍器
          setTimeout(() => {
            this.hidePageLoadingOverlay();
          }, 80);
        }, 50);
      }, 250);  // 淡出动画时长
    });
  },
  
  /**
   * 【Bug修复】为指定页面的所有模块初始化Canvas渲染器
   * 不同于 initCanvasRenderersForPage，此方法处理所有模块（包括非collapsed）
   * @param {number} pageIndex - 页面索引
   */
  initCanvasRenderersForPageAll(pageIndex) {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    const { pages, notations } = this.data;
    
    if (!pages || !pages[pageIndex]) {
      return;
    }
    
    const pageModules = pages[pageIndex].modules || [];
    
    console.log('[Canvas] 初始化页面Canvas, pageIndex:', pageIndex, 'modules:', pageModules.length);
    
    // 为该页面的每个module初始化Canvas渲染器
    setTimeout(() => {
      pageModules.forEach((pm, idx) => {
        const notation = notations[pm.index];
        if (!notation) return;
        
        // 延迟初始化，避免同时初始化太多Canvas导致卡顿
        setTimeout(() => {
          // 销毁旧渲染器（如果存在），确保使用新的Canvas节点
          if (this._canvasRenderers[notation.id]) {
            this._canvasRenderers[notation.id].destroy();
            delete this._canvasRenderers[notation.id];
          }
          
          // 初始化新的渲染器
          this.initCanvasRendererForModule(notation.id, pm.index);
        }, idx * 30);
      });
    }, 100); // 增加延迟以确保WXML渲染完成
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  // ========== 存储状态显示相关方法 ==========

  // 更新存储状态显示
  updateStorageDisplay(hasUnsavedChanges = false) {
    let display = '未保存';
    
    if (this.data.libraryFileId && this.data.libraryFileName) {
      // 构建路径字符串
      const pathNames = [];
      if (this.data.libraryFilePath && this.data.libraryFilePath.length > 0) {
        for (const folderId of this.data.libraryFilePath) {
          const folder = libraryManager.getFolderById(folderId);
          if (folder && folder.name) {
            // 检查是否是ID格式（时间戳_随机串），如果是则跳过或使用默认名称
            if (/^\d+_[a-z0-9]+$/.test(folder.name)) {
              pathNames.push('文件夹'); // 使用默认名称
            } else {
              pathNames.push(folder.name);
            }
          } else {
            pathNames.push('文件夹'); // 默认名称
          }
        }
      }
      
      // 添加文件名
      pathNames.push(this.data.libraryFileName);
      
      // 构建显示字符串
      display = pathNames.join('/');
      
      // 如果有未保存的更改，添加后缀
      if (hasUnsavedChanges) {
        display += '（未保存）';
      }
    }
    
    this.setData({ storageDisplay: display });
  },

  // 标记谱面有更改（用于显示未保存状态）
  markNotationChanged() {
    this.updateStorageDisplay(true);
  },

  // 标记谱面已保存（移除未保存状态）
  markNotationSaved() {
    this.updateStorageDisplay(false);
  },

  // 关闭开屏弹窗
  closeSplashModal() {
    this.setData({ showSplashModal: false });
    // 开屏弹窗关闭后，检查是否需要显示版本更新弹窗
    setTimeout(() => {
      this.checkAndShowUpdateModal();
    }, 300);
  },

  // 检查是否显示开屏弹窗
  checkAndShowSplashModal() {
    const dismissed = wx.getStorageSync('splashModalDismissed');
    if (!dismissed) {
      // 检测是否为平板设备
      const isTablet = this.checkIsTablet();
      this.setData({ showSplashModal: true, isTablet, splashPrivacyExpanded: false });
    } else {
      // 开屏弹窗已被设置为"不再显示"，直接检查版本更新弹窗
      setTimeout(() => {
        this.checkAndShowUpdateModal();
      }, 300);
    }
  },
  
  // ========== 版本更新弹窗相关 ==========
  
  // 检查是否显示版本更新弹窗
  checkAndShowUpdateModal() {
    // 获取用户上次点击"不再显示"时的版本号
    const lastDismissedVersion = wx.getStorageSync('updatePopupLastDismissedVersion');
    
    // 如果上次dismissed的版本与当前版本不同，则显示弹窗
    // 或者从未点击过"不再显示"（lastDismissedVersion为空）
    if (lastDismissedVersion !== CURRENT_VERSION) {
      this.setData({ showUpdateModal: true });
    }
  },
  
  // 关闭版本更新弹窗（仅关闭，不保存"不再显示"状态）
  closeUpdateModal() {
    this.setData({ showUpdateModal: false });
  },
  
  // 版本更新弹窗：不再显示
  onUpdateNeverShowAgain() {
    // 保存当前版本号，表示此版本已被用户dismiss
    wx.setStorageSync('updatePopupLastDismissedVersion', CURRENT_VERSION);
    this.closeUpdateModal();
  },

  // 检测是否为平板设备
  checkIsTablet() {
    try {
      // 使用新版 API 替代已废弃的 wx.getSystemInfoSync
      const windowInfo = wx.getWindowInfo();
      const screenWidth = windowInfo.screenWidth;
      const screenHeight = windowInfo.screenHeight;
      // 平板判断条件：屏幕宽度大于600px，或者屏幕宽高比大于0.6（横屏或接近正方形）
      const aspectRatio = Math.min(screenWidth, screenHeight) / Math.max(screenWidth, screenHeight);
      const isTablet = screenWidth >= 600 || aspectRatio > 0.6;
      return isTablet;
    } catch (e) {
      console.error('检测设备类型失败:', e);
      return false;
    }
  },

  // 开屏弹窗：隐私权限说明展开/收起
  onSplashPrivacyToggle() {
    this.setData({ splashPrivacyExpanded: !this.data.splashPrivacyExpanded });
  },

  // 开屏弹窗：不再显示
  onSplashNeverShowAgain() {
    wx.setStorageSync('splashModalDismissed', true);
    this.closeSplashModal();
  },

  // 开屏弹窗：查看示例
  onSplashViewExample() {
    this.closeSplashModal();
    // 执行"重置-查看示例"功能
    this.loadAndImportExample();
  },

  // 开屏弹窗：新手教程
  onSplashViewManual() {
    // 关闭弹窗
    this.closeSplashModal();
    
    // 延迟导航，确保弹窗先关闭
    setTimeout(() => {
      wx.navigateTo({
        url: '/subpackages/packageB/guide_page/guide',
        fail: () => {
          wx.showToast({
            title: '无法打开新手教程',
            icon: 'none'
          });
        }
      });
    }, 200);
  },

  // ========== 分享功能 ==========

  // 分享给好友
  onShareAppMessage() {
    const title = this.data.mainTitle || 'Handpan Note 记谱';
    const code = this.generateNotationCode();
    
    return {
      title: `${title} - Handpan Note`,
      path: '/pages/notation/notation',
      // 可以传递当前谱面的代码作为参数，但由于长度限制，这里只传递基本信息
      // 实际分享时会使用小程序的默认分享
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const title = this.data.mainTitle || 'Handpan Note 记谱';
    
    return {
      title: `${title} - Handpan Note`,
      // 朋友圈分享不支持path参数
    };
  },
  
  // 解析音符用于虚拟键盘区域A显示
  parseNoteForVK(noteStr) {
    const result = {
      baseNote: '',
      octaveUp: 0,
      octaveDown: 0,
      underline: false,
      leftSup: null,
      rightSup: null,
      // 新增：上标内容的解析结果
      leftSupBase: '',
      leftSupOctaveUp: 0,
      leftSupOctaveDown: 0,
      rightSupBase: '',
      rightSupOctaveUp: 0,
      rightSupOctaveDown: 0
    };
    
    if (!noteStr) return result;
    
    let remaining = noteStr;
    
    // 检查左上标 ^{...}主音符
    const leftSupMatch = remaining.match(/^\^\{([^}]*)\}(.*)$/);
    if (leftSupMatch) {
      result.leftSup = leftSupMatch[1];
      remaining = leftSupMatch[2];
      // 解析左上标内容的音高
      const leftSupParsed = this.parseSupContent(result.leftSup);
      result.leftSupBase = leftSupParsed.baseNote;
      result.leftSupOctaveUp = leftSupParsed.octaveUp;
      result.leftSupOctaveDown = leftSupParsed.octaveDown;
    }
    
    // 检查右上标 主音符^{...}
    const rightSupMatch = remaining.match(/^(.+?)\^\{([^}]*)\}$/);
    if (rightSupMatch) {
      remaining = rightSupMatch[1];
      result.rightSup = rightSupMatch[2];
      // 解析右上标内容的音高
      const rightSupParsed = this.parseSupContent(result.rightSup);
      result.rightSupBase = rightSupParsed.baseNote;
      result.rightSupOctaveUp = rightSupParsed.octaveUp;
      result.rightSupOctaveDown = rightSupParsed.octaveDown;
    }
    
    // 解析主音符部分
    if (remaining) {
      // 统计 ' 的数量（升八度）
      const quoteMatches = remaining.match(/'/g);
      if (quoteMatches) result.octaveUp = quoteMatches.length;
      
      // 统计 , 的数量（降八度）
      const commaMatches = remaining.match(/,/g);
      if (commaMatches) result.octaveDown = commaMatches.length;
      
      // 检查下划线
      if (remaining.includes('_')) result.underline = true;
      
      // 提取基础音符（移除特殊符号）
      result.baseNote = remaining.replace(/['',_]/g, '');
    }
    
    return result;
  },
  
  // 解析上标内容的音高信息
  parseSupContent(supStr) {
    const result = {
      baseNote: '',
      octaveUp: 0,
      octaveDown: 0
    };
    
    if (!supStr) return result;
    
    // 统计 ' 的数量（升八度）
    const quoteMatches = supStr.match(/'/g);
    if (quoteMatches) result.octaveUp = quoteMatches.length;
    
    // 统计 , 的数量（降八度）
    const commaMatches = supStr.match(/,/g);
    if (commaMatches) result.octaveDown = commaMatches.length;
    
    // 提取基础音符（移除特殊符号）
    result.baseNote = supStr.replace(/['',]/g, '');
    
    return result;
  },
  
  // 渲染音符用于显示
  renderNoteForDisplay(noteStr) {
    if (!noteStr) return '';
    
    // 解析音符结构
    let rendered = '';
    let remaining = noteStr;
    
    // 检查左上标 ^{...}主音符
    const leftSupMatch = remaining.match(/^\^\{([^}]*)\}(.+)$/);
    if (leftSupMatch) {
      const supContent = leftSupMatch[1];
      remaining = leftSupMatch[2];
      // 用小字显示左上标（简化显示，实际渲染会更复杂）
      rendered += '⁽' + this.convertToSuperscript(supContent) + '⁾';
    }
    
    // 检查右上标 主音符^{...}
    const rightSupMatch = remaining.match(/^(.+?)\^\{([^}]*)\}$/);
    if (rightSupMatch) {
      const mainNote = rightSupMatch[1];
      const supContent = rightSupMatch[2];
      rendered += this.renderMainNote(mainNote);
      rendered += this.convertToSuperscript(supContent);
    } else {
      rendered += this.renderMainNote(remaining);
    }
    
    return rendered;
  },
  
  // 渲染主音符（处理八度和下划线标记）
  renderMainNote(note) {
    if (!note) return '';
    
    let result = '';
    let baseNote = note;
    let octaveUp = 0;
    let octaveDown = 0;
    let hasUnderline = false;
    
    // 统计 ' 的数量（升八度）
    const quoteMatches = note.match(/'/g);
    if (quoteMatches) octaveUp = quoteMatches.length;
    
    // 统计 , 的数量（降八度）
    const commaMatches = note.match(/,/g);
    if (commaMatches) octaveDown = commaMatches.length;
    
    // 检查下划线
    if (note.includes('_')) hasUnderline = true;
    
    // 提取基础音符
    baseNote = note.replace(/['',_]/g, '');
    
    // 添加升八度点
    if (octaveUp > 0) {
      result += '˙'.repeat(octaveUp);
    }
    
    // 添加基础音符
    result += baseNote;
    
    // 添加下划线标记（用下划符号表示）
    if (hasUnderline) {
      result += '̲'; // Unicode combining low line
    }
    
    // 添加降八度点
    if (octaveDown > 0) {
      result += '̣'.repeat(octaveDown); // Unicode combining dot below
    }
    
    return result;
  },
  
  // 转换为上标字符
  convertToSuperscript(str) {
    if (!str) return '';
    
    // 上标数字映射
    const superscriptMap = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      "'": "ʼ", ',': '̦', '_': '̲',
      'H': 'ᴴ', 'D': 'ᴰ', 'd': 'ᵈ', 's': 'ˢ', 'T': 'ᵀ',
      'P': 'ᴾ', 'F': 'ᶠ', 'B': 'ᴮ', 'O': 'ᴼ', 'x': 'ˣ'
    };
    
    let result = '';
    for (const char of str) {
      result += superscriptMap[char] || char;
    }
    return result;
  },
  
  // ============ 虚拟键盘相关方法 ============
  
  // 显示/隐藏虚拟键盘
  toggleVirtualKeyboard() {
    const newState = !this.data.showVirtualKeyboard;
    const { conversionEditingKey, conversionEditingField, newTableEditingIndex, newTableEditingField, 
            audioMappingEditingIndex, audioMappingEditingField,
            newAudioTableEditingIndex, newAudioTableEditingField } = this.data;
    
    // 如果在新建音频转换表弹窗模式下关闭虚拟键盘，切换到系统键盘输入
    if (!newState && newAudioTableEditingIndex !== null && newAudioTableEditingField !== null) {
      this.setData({
        showVirtualKeyboard: false,
        newAudioTableUseNativeInput: true
      });
      wx.showTabBar({ animation: true });
      return;
    }
    
    // 如果在音频映射弹窗模式下关闭虚拟键盘，切换到系统键盘输入
    if (!newState && audioMappingEditingIndex !== null && audioMappingEditingField !== null) {
      this.setData({
        showVirtualKeyboard: false,
        audioMappingUseNativeInput: true // 标记使用原生输入
      });
      wx.showTabBar({ animation: true });
      return;
    }
    
    // 如果在转换弹窗模式下关闭虚拟键盘，切换到系统键盘输入
    if (!newState && conversionEditingKey !== null) {
      this.setData({
        showVirtualKeyboard: false,
        conversionUseNativeInput: true // 标记使用原生输入
      });
      return;
    }
    
    // 如果在新建转换表弹窗模式下关闭虚拟键盘，切换到系统键盘输入
    if (!newState && newTableEditingIndex !== null) {
      this.setData({
        showVirtualKeyboard: false,
        newTableUseNativeInput: true // 标记使用原生输入
      });
      return;
    }
    
    // 如果在主乐谱 Canvas 编辑状态下点击「切换键盘」：收起虚拟键盘、保持当前音符格选中，并唤起设备原生键盘输入
    if (!newState && this.data.canvasEditing) {
      this.setData({
        showVirtualKeyboard: false,
        canvasUseNativeInput: true
      });
      wx.showTabBar({ animation: true });
      return;
    }
    
    this.setData({
      showVirtualKeyboard: newState
    });
    
    // 控制tabBar的显示/隐藏
    if (newState) {
      // 显示键盘时隐藏tabBar
      wx.hideTabBar({ animation: true });
    } else {
      // 隐藏键盘时显示tabBar
      wx.showTabBar({ animation: true });
    }
  },
  
  // 关闭虚拟键盘
  closeVirtualKeyboard() {
    // 如果有Canvas编辑状态，先提交
    if (this.data.canvasEditing) {
      this.commitCanvasEdit();
    }
    
    this.setData({
      showVirtualKeyboard: false,
      superscriptMode: null,
      superscriptContent: '',
      canvasEditing: null,
      canvasEditingValue: '',
      canvasUseNativeInput: false
    });
    // 显示tabBar
    wx.showTabBar({ animation: true });
  },
  
  // 退格删除 - 根据上标模式删除对应区域的内容
  backspace() {
    const { editingValue, canvasEditingValue, canvasEditing, superscriptMode, superscriptContent,
            conversionEditingKey, conversionEditingField, newTableEditingIndex, newTableEditingField,
            audioMappingEditingIndex, audioMappingEditingField,
            newAudioTableEditingIndex, newAudioTableEditingField } = this.data;
    
    // 处理新建音频转换表弹窗中的删除
    if (newAudioTableEditingIndex !== null && newAudioTableEditingField !== null) {
      this.handleNewAudioTableBackspace();
      return;
    }
    
    // 处理音频映射弹窗中的删除
    if (audioMappingEditingIndex !== null && audioMappingEditingField !== null) {
      this.handleAudioMappingBackspace();
      return;
    }
    
    // 处理转换弹窗中的删除
    if (conversionEditingKey !== null && conversionEditingField !== null) {
      this.handleConversionBackspace();
      return;
    }
    
    // 处理新建转换表弹窗中的删除
    if (newTableEditingIndex !== null && newTableEditingField !== null) {
      this.handleNewTableBackspace();
      return;
    }
    
    const currentValue = canvasEditing ? canvasEditingValue : editingValue;
    
    // 如果在该上标模式中，说明用户正在专门编辑某个上标
    if (superscriptMode) {
      if (superscriptContent.length > 0) {
        const newContent = superscriptContent.slice(0, -1);
        this.setData({ superscriptContent: newContent });
      }
      this.updateSuperscriptDisplay();
      return;
    }
    
    // 普通模式：按优先级从右往左删除 (右上标 -> 主音符 -> 左上标)
    if (currentValue && currentValue.length > 0) {
      const parsed = this.parseNoteForVK(currentValue);
      
      if (parsed.rightSup !== null) {
        if (parsed.rightSup.length > 0) {
          parsed.rightSup = parsed.rightSup.slice(0, -1);
        } else {
          parsed.rightSup = null; // 移除整块右上标
        }
      } else if (parsed.baseNote && parsed.baseNote.length > 0) {
        parsed.baseNote = parsed.baseNote.slice(0, -1);
        // 如果主音符删空了，建议把主装饰位(音高加点、下划线)也清掉
        if (parsed.baseNote.length === 0) {
          parsed.octaveUp = 0;
          parsed.octaveDown = 0;
          parsed.underline = false;
        }
      } else if (parsed.leftSup !== null) {
        if (parsed.leftSup.length > 0) {
          parsed.leftSup = parsed.leftSup.slice(0, -1);
        } else {
          parsed.leftSup = null; // 移除整块左上标
        }
      } else {
        this.updateEditingValue('');
        return;
      }
      
      // 重建完整值
      let reconstructed = '';
      if (parsed.leftSup !== null) {
        reconstructed = '^{' + parsed.leftSup + '}';
      }
      reconstructed += this.buildMainPart(parsed);
      if (parsed.rightSup !== null) {
        reconstructed += '^{' + parsed.rightSup + '}';
      }
      
      this.updateEditingValue(reconstructed);
    }
  },
  
  // 清空输入 - 清空当前音符格全部内容并重置状态
  clearInput() {
    this.setData({
      superscriptMode: null,
      superscriptContent: ''
    });
    this.updateEditingValue('');
  },
  
  // 切换键盘模式（数字/符号）
  switchKeyboardMode() {
    const newMode = this.data.virtualKeyboardMode === 'number' ? 'symbol' : 'number';
    this.setData({
      virtualKeyboardMode: newMode
    });
  },
  
  // 切换说明显示
  toggleKeyboardHelp() {
    this.setData({ showKeyboardHelp: !this.data.showKeyboardHelp });
  },
  
  // ========== 更多设置界面相关函数 ==========
  
  // 打开更多设置界面
  openKeyboardSettings() {
    this.setData({ showKeyboardSettings: true });
  },
  
  // 关闭更多设置界面
  closeKeyboardSettings() {
    this.setData({ showKeyboardSettings: false });
  },
  
  // 设置插入方向
  setInsertDirection(e) {
    const direction = e.currentTarget.dataset.direction;
    this.setData({ insertDirection: direction });
    // 保存到本地存储
    wx.setStorageSync('keyboard_insert_direction', direction);
  },
  
  // 设置是否显示帮助按钮
  setShowHelpBtn(e) {
    const show = e.currentTarget.dataset.show === 'true';
    this.setData({ 
      showHelpBtnSetting: show,
      // 如果关闭帮助按钮，同时关闭帮助显示
      showKeyboardHelp: show ? this.data.showKeyboardHelp : false
    });
    // 保存到本地存储
    wx.setStorageSync('keyboard_show_help_btn', show);
  },
  
  // 切换音高条显示
  togglePitchBar() {
    const newValue = !this.data.pitchBarEnabled;
    this.setData({ pitchBarEnabled: newValue });
    // 保存到本地存储
    wx.setStorageSync('keyboard_pitch_bar_enabled', newValue);
  },
  
  // 切换附点模式
  toggleAddDot() {
    const newValue = !this.data.addDotActive;
    this.setData({ addDotActive: newValue });
    
    if (newValue) {
      // 激活附点模式时，对当前选中的音符添加附点
      this.applyDotToCurrentNote();
    } else {
      // 关闭附点模式时，移除当前选中音符的附点
      this.removeDotFromCurrentNote();
    }
  },
  
  // 对当前选中的音符添加附点标记 '*'
  applyDotToCurrentNote() {
    const { editingValue, canvasEditing, canvasEditingValue } = this.data;
    let currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    
    // 如果没有内容，不处理
    if (!currentValue || currentValue === '' || currentValue === '-') {
      return;
    }
    
    // 检查是否已有附点标记
    if (currentValue.endsWith('*')) {
      return; // 已有附点，不重复添加
    }
    
    // 在音符末尾添加 '*' 标记
    const newValue = currentValue + '*';
    this.updateEditingValue(newValue);
  },
  
  // 移除当前选中音符的附点标记
  removeDotFromCurrentNote() {
    const { editingValue, canvasEditing, canvasEditingValue } = this.data;
    let currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    
    // 如果没有内容，不处理
    if (!currentValue || currentValue === '') {
      return;
    }
    
    // 移除末尾的 '*' 标记
    if (currentValue.endsWith('*')) {
      const newValue = currentValue.slice(0, -1);
      this.updateEditingValue(newValue);
    }
  },
  
  // 切换琶音模式
  toggleAddArpeggio() {
    const newValue = !this.data.addArpeggioActive;
    this.setData({ addArpeggioActive: newValue });
    
    if (newValue) {
      // 激活琶音模式时，对当前选中的音符列添加琶音
      this.applyArpeggioToCurrentColumn();
    } else {
      // 关闭琶音模式时，移除当前选中音符列的琶音
      this.removeArpeggioFromCurrentColumn();
    }
  },
  
  // 对当前选中的音符列添加琶音标记
  applyArpeggioToCurrentColumn() {
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) {
      return;
    }
    
    const { notations } = this.data;
    const { sheet, measure, beat, subdivision } = editInfo;
    
    const notationsClone = JSON.parse(JSON.stringify(notations));
    const notation = notationsClone.find(n => n.id === sheet);
    if (!notation) return;
    
    const currentSubdivision = notation.measures[measure]?.beats?.[beat]?.subdivisions?.[subdivision];
    if (!currentSubdivision) return;
    
    // 检查是否已有琶音标记
    if (currentSubdivision.hasArpeggio) {
      return; // 已有琶音，不重复添加
    }
    
    // 添加琶音标记到音符列
    currentSubdivision.hasArpeggio = true;
    
    this.setData({ notations: notationsClone });
    this.markNotationChanged();
    this.throttledSaveNotations();
    
    // 重新渲染 Canvas
    this.refreshCurrentCanvasRenderer(editInfo);
  },
  
  // 移除当前选中音符列的琶音标记
  removeArpeggioFromCurrentColumn() {
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) {
      return;
    }
    
    const { notations } = this.data;
    const { sheet, measure, beat, subdivision } = editInfo;
    
    const notationsClone = JSON.parse(JSON.stringify(notations));
    const notation = notationsClone.find(n => n.id === sheet);
    if (!notation) return;
    
    const currentSubdivision = notation.measures[measure]?.beats?.[beat]?.subdivisions?.[subdivision];
    if (!currentSubdivision) return;
    
    // 移除琶音标记
    if (currentSubdivision.hasArpeggio) {
      delete currentSubdivision.hasArpeggio;
      
      this.setData({ notations: notationsClone });
      this.markNotationChanged();
      this.throttledSaveNotations();
      
      // 重新渲染 Canvas
      this.refreshCurrentCanvasRenderer(editInfo);
    }
  },
  
  // 刷新当前Canvas渲染器
  refreshCurrentCanvasRenderer(editInfo) {
    if (!editInfo) return;
    
    const { isCanvas, notationIndex, sheet } = editInfo;
    if (isCanvas && notationIndex !== null && notationIndex !== undefined) {
      setTimeout(() => {
        if (this.data.canvasEditing) {
          this.initCanvasRendererForEdit(sheet, notationIndex, null);
        } else {
          this.initCanvasRenderer(sheet, notationIndex);
        }
      }, 50);
    }
  },
  
  // 从更多设置界面插入注记
  insertNoteAnnotationFromSettings() {
    this.closeKeyboardSettings();
    this.insertNoteAnnotation();
  },
  
  // ========== 自定义键盘功能 ==========
  
  // 开始自定义键盘
  startCustomizeKeyboard() {
    // 关闭设置界面，切换到符号键盘，进入自定义模式
    this.setData({
      showKeyboardSettings: false,
      virtualKeyboardMode: 'symbol',
      isCustomizingKeyboard: true,
      customKeyEditingIndex: null
    });
    wx.showToast({ title: '点击按键可编辑', icon: 'none', duration: 2000 });
  },
  
  // 开始编辑某个自定义键
  startEditCustomKey(e) {
    const keyIndex = e.currentTarget.dataset.keyIndex;
    this.setData({ customKeyEditingIndex: keyIndex });
  },
  
  // 自定义键输入
  onCustomKeyInput(e) {
    const keyIndex = e.currentTarget.dataset.keyIndex;
    const value = e.detail.value.trim();
    // 限制为单字符或双字符
    const validValue = value.slice(0, 2);
    const customSymbolKeys = { ...this.data.customSymbolKeys };
    customSymbolKeys[keyIndex] = validValue;
    this.setData({ customSymbolKeys });
  },
  
  // 完成自定义键盘设置
  finishCustomizeKeyboard() {
    const { customSymbolKeys } = this.data;
    // 验证是否有空值
    const hasEmpty = Object.values(customSymbolKeys).some(v => !v || v.trim() === '');
    if (hasEmpty) {
      wx.showToast({ title: '键位不能为空', icon: 'none' });
      return;
    }
    
    this.setData({
      isCustomizingKeyboard: false,
      customKeyEditingIndex: null
    });
    
    // 保存自定义键盘设置到本地存储
    wx.setStorageSync('custom_symbol_keys', customSymbolKeys);
    wx.showToast({ title: '设置已保存', icon: 'success' });
  },
  
  // 恢复默认符号键
  resetCustomSymbolKeys() {
    wx.showModal({
      title: '恢复默认',
      content: '确定要恢复符号键盘为默认设置吗？',
      success: (res) => {
        if (res.confirm) {
          const defaultKeys = { ...this.data.defaultSymbolKeys };
          this.setData({ customSymbolKeys: defaultKeys });
          wx.removeStorageSync('custom_symbol_keys');
          wx.showToast({ title: '已恢复默认', icon: 'success' });
        }
      }
    });
  },
  
  // 加载键盘设置
  loadKeyboardSettings() {
    // 加载插入方向设置
    const savedDirection = wx.getStorageSync('keyboard_insert_direction');
    if (savedDirection) {
      this.setData({ insertDirection: savedDirection });
    }
    
    // 加载帮助按钮显示设置
    const savedShowHelpBtn = wx.getStorageSync('keyboard_show_help_btn');
    if (savedShowHelpBtn !== '' && savedShowHelpBtn !== undefined) {
      this.setData({ showHelpBtnSetting: savedShowHelpBtn });
    }
    
    // 加载音高条显示设置
    const savedPitchBarEnabled = wx.getStorageSync('keyboard_pitch_bar_enabled');
    if (savedPitchBarEnabled !== '' && savedPitchBarEnabled !== undefined) {
      this.setData({ pitchBarEnabled: savedPitchBarEnabled });
    }
    
    // 加载自定义符号键设置
    const savedCustomKeys = wx.getStorageSync('custom_symbol_keys');
    if (savedCustomKeys && typeof savedCustomKeys === 'object') {
      this.setData({ customSymbolKeys: savedCustomKeys });
    }
  },

  // 映射数字键盘到简谱音符
  onVirtualKey(e) {
    const key = e.currentTarget.dataset.key;
    const { editingValue, canvasEditing, canvasEditingValue, superscriptMode, 
            conversionEditingKey, conversionEditingField, 
            newTableEditingIndex, newTableEditingField, audioMappingEditingIndex, audioMappingEditingField,
            newAudioTableEditingIndex, newAudioTableEditingField } = this.data;
    
    // 处理新建音频转换表弹窗中的输入
    if (newAudioTableEditingIndex !== null && newAudioTableEditingField !== null) {
      this.handleNewAudioTableInput(key);
      return;
    }
    
    // 处理音频映射弹窗中的输入
    if (audioMappingEditingIndex !== null && audioMappingEditingField !== null) {
      this.handleAudioMappingInput(key);
      return;
    }
    
    // 处理转换弹窗中的输入
    if (conversionEditingKey !== null && conversionEditingField !== null) {
      this.handleConversionInput(key);
      return;
    }
    
    // 处理新建转换表弹窗中的输入
    if (newTableEditingIndex !== null && newTableEditingField !== null) {
      this.handleNewTableInput(key);
      return;
    }
    
    // 获取当前编辑值（兼容Canvas模式和View模式）
    let currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    
    // 如果在上标模式中
    if (superscriptMode) {
      this.handleSuperscriptInput(key);
      return;
    }
    
    // 普通输入 - 追加到主音符中
    // 解析当前值，提取主音符部分和上标部分
    const parsed = this.parseNoteForVK(currentValue);
    let mainPart = parsed.baseNote + "'".repeat(parsed.octaveUp) + ",".repeat(parsed.octaveDown) + (parsed.underline ? '_' : '');
    
    // 追加新字符到主音符
    mainPart = parsed.baseNote + key + "'".repeat(parsed.octaveUp) + ",".repeat(parsed.octaveDown) + (parsed.underline ? '_' : '');
    
    // 重建完整值
    let reconstructed = '';
    if (parsed.leftSup !== null) {
      reconstructed = '^{' + parsed.leftSup + '}';
    }
    reconstructed += mainPart;
    if (parsed.rightSup !== null) {
      reconstructed += '^{' + parsed.rightSup + '}';
    }
    
    this.updateEditingValue(reconstructed);
  },
  
  /**
   * 处理转换弹窗中的键盘输入
   * 【修复】使用 sourceNote 作为标识符
   */
  handleConversionInput(key) {
    const { conversionEditingKey, conversionEditingField, conversionMappings, virtualKeyboardDisplay, notationType } = this.data;
    const currentValue = virtualKeyboardDisplay || '';
    const newValue = currentValue + key;
    
    // 使用 sourceNote 查找映射（conversionEditingKey 存储的是 sourceNote）
    const mappingIndex = conversionMappings.findIndex(m => m.sourceNote === conversionEditingKey);
    if (mappingIndex === -1) return;
    
    const updatedMappings = [...conversionMappings];
    updatedMappings[mappingIndex] = {
      ...updatedMappings[mappingIndex],
      [conversionEditingField]: newValue
    };
    
    // 如果编辑的是simplified字段，需要重新计算SPN
    if (conversionEditingField === 'simplified') {
      updatedMappings[mappingIndex].spn = this.simplifiedToSPN(newValue);
    }
    
    // 同时更新value字段（用于兼容）
    updatedMappings[mappingIndex].value = updatedMappings[mappingIndex].simplified;
    
    // 检查是否有空映射（根据转换方向）
    const hasEmpty = updatedMappings.some(m => {
      if (notationType === 'digital') {
        return !m.simplified || m.simplified.trim() === '';
      } else {
        return !m.key || m.key.trim() === '';
      }
    });
    
    this.setData({
      conversionMappings: updatedMappings,
      virtualKeyboardDisplay: newValue,
      hasEmptyConversionMapping: hasEmpty
    });
  },
  
  /**
   * 处理新建转换表弹窗中的键盘输入
   */
  handleNewTableInput(key) {
    const { newTableEditingIndex, newTableEditingField, newConversionTableData, virtualKeyboardDisplay } = this.data;
    const currentValue = virtualKeyboardDisplay || '';
    const newValue = currentValue + key;
    
    if (newTableEditingIndex === null || newTableEditingIndex < 0 || newTableEditingIndex >= newConversionTableData.length) return;
    
    const updatedData = [...newConversionTableData];
    updatedData[newTableEditingIndex] = {
      ...updatedData[newTableEditingIndex],
      [newTableEditingField]: newValue
    };
    
    // 如果编辑的是simplified字段，需要重新计算SPN（使用新建表的独立首调）
    if (newTableEditingField === 'simplified') {
      updatedData[newTableEditingIndex].spn = this.calculateSpnFromSimplifiedWithRoot(newValue, this.data.newTableRootNote);
    }
    
    this.setData({
      newConversionTableData: updatedData,
      virtualKeyboardDisplay: newValue
    });
  },
  
  /**
   * 处理转换弹窗中的删除操作
   * 【修复】使用 sourceNote 作为标识符
   */
  handleConversionBackspace() {
    const { conversionEditingKey, conversionEditingField, conversionMappings, virtualKeyboardDisplay, notationType } = this.data;
    const currentValue = virtualKeyboardDisplay || '';
    
    if (currentValue.length === 0) return;
    
    const newValue = currentValue.slice(0, -1);
    
    // 使用 sourceNote 查找映射（conversionEditingKey 存储的是 sourceNote）
    const mappingIndex = conversionMappings.findIndex(m => m.sourceNote === conversionEditingKey);
    if (mappingIndex === -1) return;
    
    const updatedMappings = [...conversionMappings];
    updatedMappings[mappingIndex] = {
      ...updatedMappings[mappingIndex],
      [conversionEditingField]: newValue
    };
    
    // 如果编辑的是simplified字段，需要重新计算SPN
    if (conversionEditingField === 'simplified') {
      updatedMappings[mappingIndex].spn = this.simplifiedToSPN(newValue);
    }
    
    // 同时更新value字段（用于兼容）
    updatedMappings[mappingIndex].value = updatedMappings[mappingIndex].simplified;
    
    // 检查是否有空映射（根据转换方向）
    const hasEmpty = updatedMappings.some(m => {
      if (notationType === 'digital') {
        return !m.simplified || m.simplified.trim() === '';
      } else {
        return !m.key || m.key.trim() === '';
      }
    });
    
    this.setData({
      conversionMappings: updatedMappings,
      virtualKeyboardDisplay: newValue,
      hasEmptyConversionMapping: hasEmpty
    });
  },
  
  /**
   * 处理新建转换表弹窗中的删除操作
   */
  handleNewTableBackspace() {
    const { newTableEditingIndex, newTableEditingField, newConversionTableData, virtualKeyboardDisplay } = this.data;
    const currentValue = virtualKeyboardDisplay || '';
    
    if (currentValue.length === 0) return;
    
    const newValue = currentValue.slice(0, -1);
    
    if (newTableEditingIndex === null || newTableEditingIndex < 0 || newTableEditingIndex >= newConversionTableData.length) return;
    
    const updatedData = [...newConversionTableData];
    updatedData[newTableEditingIndex] = {
      ...updatedData[newTableEditingIndex],
      [newTableEditingField]: newValue
    };
    
    // 如果编辑的是simplified字段，需要重新计算SPN（使用新建表的独立首调）
    if (newTableEditingField === 'simplified') {
      updatedData[newTableEditingIndex].spn = this.calculateSpnFromSimplifiedWithRoot(newValue, this.data.newTableRootNote);
    }
    
    this.setData({
      newConversionTableData: updatedData,
      virtualKeyboardDisplay: newValue
    });
  },

  /**
   * 处理音频映射弹窗中的键盘输入
   */
  async handleAudioMappingInput(key) {
    const { audioMappingEditingIndex, audioMappingEditingField, audioMappings, virtualKeyboardDisplay } = this.data;
    const currentValue = virtualKeyboardDisplay || '';
    const newValue = currentValue + key;

    if (audioMappingEditingIndex === null || audioMappingEditingIndex < 0 || audioMappingEditingIndex >= audioMappings.length) return;

    const updatedMappings = [...audioMappings];
    updatedMappings[audioMappingEditingIndex] = {
      ...updatedMappings[audioMappingEditingIndex],
      [audioMappingEditingField]: newValue
    };

    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;

    // 如果编辑的是simplified字段，需要重新计算SPN（含等音名）
    if (audioMappingEditingField === 'simplified') {
      const newSpn = this.calculateSpnFromSimplified(newValue);
      updatedMappings[audioMappingEditingIndex].spn = newSpn;
      updatedMappings[audioMappingEditingIndex].hasAudio = checkHasAudio(newSpn);
    }

    this.setData({
      audioMappings: updatedMappings,
      virtualKeyboardDisplay: newValue,
      virtualKeyboardRendered: this.renderNoteForDisplay(newValue),
      vkParsed: this.parseNoteForVK(newValue)
    });
  },

  /**
   * 处理音频映射弹窗中的删除操作
   */
  async handleAudioMappingBackspace() {
    const { audioMappingEditingIndex, audioMappingEditingField, audioMappings, virtualKeyboardDisplay } = this.data;
    const currentValue = virtualKeyboardDisplay || '';

    if (currentValue.length === 0) return;

    const newValue = currentValue.slice(0, -1);

    if (audioMappingEditingIndex === null || audioMappingEditingIndex < 0 || audioMappingEditingIndex >= audioMappings.length) return;

    const updatedMappings = [...audioMappings];
    updatedMappings[audioMappingEditingIndex] = {
      ...updatedMappings[audioMappingEditingIndex],
      [audioMappingEditingField]: newValue
    };

    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;

    // 如果编辑的是simplified字段，需要重新计算SPN（含等音名）
    if (audioMappingEditingField === 'simplified') {
      const newSpn = this.calculateSpnFromSimplified(newValue);
      updatedMappings[audioMappingEditingIndex].spn = newSpn;
      updatedMappings[audioMappingEditingIndex].hasAudio = checkHasAudio(newSpn);
    }

    this.setData({
      audioMappings: updatedMappings,
      virtualKeyboardDisplay: newValue,
      virtualKeyboardRendered: this.renderNoteForDisplay(newValue),
      vkParsed: this.parseNoteForVK(newValue)
    });
  },

  /**
   * 处理新建音频转换表弹窗中的键盘输入
   */
  async handleNewAudioTableInput(key) {
    const { newAudioTableEditingIndex, newAudioTableEditingField, newAudioMappingTableData, virtualKeyboardDisplay, newAudioTableRootNote } = this.data;
    const currentValue = virtualKeyboardDisplay || '';
    const newValue = currentValue + key;

    if (newAudioTableEditingIndex === null || newAudioTableEditingIndex < 0 || newAudioTableEditingIndex >= newAudioMappingTableData.length) return;

    const updatedData = [...newAudioMappingTableData];
    updatedData[newAudioTableEditingIndex] = {
      ...updatedData[newAudioTableEditingIndex],
      [newAudioTableEditingField]: newValue
    };

    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;

    // 如果编辑的是simplified字段，需要重新计算SPN（含等音名）
    if (newAudioTableEditingField === 'simplified') {
      const newSpn = this.calculateSpnFromSimplifiedWithRoot(newValue, newAudioTableRootNote);
      updatedData[newAudioTableEditingIndex].spn = newSpn;
      updatedData[newAudioTableEditingIndex].hasAudio = checkHasAudio(newSpn);
    }

    this.setData({
      newAudioMappingTableData: updatedData,
      virtualKeyboardDisplay: newValue,
      virtualKeyboardRendered: this.renderNoteForDisplay(newValue),
      vkParsed: this.parseNoteForVK(newValue)
    });
  },

  /**
   * 处理新建音频转换表弹窗中的删除操作
   */
  async handleNewAudioTableBackspace() {
    const { newAudioTableEditingIndex, newAudioTableEditingField, newAudioMappingTableData, virtualKeyboardDisplay, newAudioTableRootNote } = this.data;
    const currentValue = virtualKeyboardDisplay || '';

    if (currentValue.length === 0) return;

    const newValue = currentValue.slice(0, -1);

    if (newAudioTableEditingIndex === null || newAudioTableEditingIndex < 0 || newAudioTableEditingIndex >= newAudioMappingTableData.length) return;

    const updatedData = [...newAudioMappingTableData];
    updatedData[newAudioTableEditingIndex] = {
      ...updatedData[newAudioTableEditingIndex],
      [newAudioTableEditingField]: newValue
    };

    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;

    // 如果编辑的是simplified字段，需要重新计算SPN（含等音名）
    if (newAudioTableEditingField === 'simplified') {
      const newSpn = this.calculateSpnFromSimplifiedWithRoot(newValue, newAudioTableRootNote);
      updatedData[newAudioTableEditingIndex].spn = newSpn;
      updatedData[newAudioTableEditingIndex].hasAudio = checkHasAudio(newSpn);
    }

    this.setData({
      newAudioMappingTableData: updatedData,
      virtualKeyboardDisplay: newValue,
      virtualKeyboardRendered: this.renderNoteForDisplay(newValue),
      vkParsed: this.parseNoteForVK(newValue)
    });
  },
  
  /**
   * 处理转换弹窗中的原生输入
   * 【修复】使用 sourceNote 作为唯一标识符来查找 mapping
   */
  onConversionNativeInput(e) {
    const { key, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    const currentType = this.data.notationType;
    
    // 使用 sourceNote 作为标识符（key 参数实际传的是 sourceNote）
    const mappingIndex = this.data.conversionMappings.findIndex(m => m.sourceNote === key);
    if (mappingIndex === -1) return;
    
    const updatedMappings = [...this.data.conversionMappings];
    updatedMappings[mappingIndex] = {
      ...updatedMappings[mappingIndex],
      [field]: value
    };
    
    // 如果编辑的是simplified字段，需要重新计算SPN
    if (field === 'simplified') {
      updatedMappings[mappingIndex].spn = this.simplifiedToSPN(value);
    }
    
    // 同时更新value字段（用于兼容）
    updatedMappings[mappingIndex].value = updatedMappings[mappingIndex].simplified;
    
    // 检查是否有空映射（根据转换方向）
    const hasEmpty = updatedMappings.some(m => {
      if (currentType === 'digital') {
        // 数字谱转简谱，检查简谱列是否为空
        return !m.simplified || m.simplified.trim() === '';
      } else {
        // 简谱转数字谱，检查数字谱列是否为空
        return !m.key || m.key.trim() === '';
      }
    });
    
    this.setData({
      conversionMappings: updatedMappings,
      virtualKeyboardDisplay: value,
      hasEmptyConversionMapping: hasEmpty
    });
  },
  
  /**
   * 转换弹窗原生输入失焦
   */
  onConversionNativeBlur(e) {
    // 失焦时重置原生输入状态，但保留编辑位置
    this.setData({
      conversionUseNativeInput: false
    });
  },
  
  // 更新编辑值（同时支持View模式和Canvas模式）
  updateEditingValue(value) {
    const { canvasEditing } = this.data;
    
    // 更新通用显示状态
    const updateData = {
      virtualKeyboardDisplay: value,
      virtualKeyboardRendered: this.renderNoteForDisplay(value),
      vkParsed: this.parseNoteForVK(value)
    };
    
    if (canvasEditing) {
      // Canvas模式：更新canvasEditingValue
      updateData.canvasEditingValue = value;
      this.setData(updateData, () => this.syncVkDotAndArpeggioState());
      
      // 实时更新Canvas显示（脏矩形刷新）
      const renderer = this._canvasRenderers[canvasEditing.notationId];
      if (renderer) {
        renderer.redrawSlot(
          canvasEditing.measureIndex,
          canvasEditing.beatIndex,
          canvasEditing.subIndex,
          canvasEditing.hand,
          canvasEditing.index,
          value,
          true // 保持编辑状态高亮
        );
      }
    } else {
      // View模式：更新editingValue
      updateData.editingValue = value;
      this.setData(updateData, () => this.syncVkDotAndArpeggioState());
      this.prevEditingValue = value;
    }
    
    // 同步更新音高档位显示（传入刚写入的值，避免 setData 未生效时读到旧值导致档位回弹）
    this.updatePitchLevelFromNote(value);
  },
  
  // 加格操作：根据 insertDirection 设置，在当前选中格子左侧或右侧新增一个音符位
  addGrid() {
    const { editing, canvasEditing, insertDirection } = this.data;
    const currentEditing = editing || canvasEditing;
    if (!currentEditing) {
      wx.showToast({ title: '请先选中一个音符位', icon: 'none' });
      return;
    }

    // 【修复】先提交任何未保存的编辑，确保数据一致性
    if (canvasEditing) {
      this.commitCanvasEditDataOnly();
    }
    
    // 重新获取 notations（提交后可能已更新）
    const notations = this.data.notations;

    // 统一获取编辑位置信息 - 使用 ?? 避免 0 被误判为 falsy
    const sheetId = currentEditing.sheet ?? currentEditing.notationId;
    const measureIdx = currentEditing.measure ?? currentEditing.measureIndex;
    const beatIdx = currentEditing.beat ?? currentEditing.beatIndex;
    const subIdx = currentEditing.subdivision ?? currentEditing.subIndex ?? 0;
    
    const notationIndex = notations.findIndex(n => n.id === sheetId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }

    const notation = this.deepCloneNotation(notations[notationIndex]);
    const isCollapsed = notation.collapsed;
    
    // 检查 measureIdx 和 beatIdx 是否有效
    if (measureIdx === undefined || measureIdx === null || beatIdx === undefined || beatIdx === null) {
      wx.showToast({ title: '请先选中一个音符位', icon: 'none' });
      return;
    }
    
    const beatData = notation.measures[measureIdx]?.beats[beatIdx];
    if (!beatData || !beatData.subdivisions) {
      wx.showToast({ title: '无效的拍位', icon: 'none' });
      return;
    }

    // 根据插入方向决定插入位置
    const newSubdivision = {
      rightHand: ['', ''],
      leftHand: ['', '']
    };
    
    if (insertDirection === 'left') {
      // 向左插入：在当前位置前面插入
      beatData.subdivisions.splice(subIdx, 0, newSubdivision);
    } else {
      // 向右插入（默认）：在当前位置后面插入
      beatData.subdivisions.splice(subIdx + 1, 0, newSubdivision);
    }

    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.markNotationChanged(); // 标记为有更改
    
    // 如果是Canvas模式，需要重新渲染
    if (isCollapsed) {
      setTimeout(() => {
        // 【优化】如果正在Canvas编辑模式，使用编辑模式渲染器保持编辑状态
        if (canvasEditing) {
          this.initCanvasRendererForEdit(sheetId, notationIndex, null);
        } else {
          this.initCanvasRenderer(sheetId, notationIndex);
        }
      }, 50);
    }
    
    const directionText = insertDirection === 'left' ? '已向左添加音符位' : '已添加音符位';
    wx.showToast({ title: directionText, icon: 'success' });
  },
  
  // 删除格操作：删除当前选中的音符列
  deleteGrid() {
    const { editing, canvasEditing } = this.data;
    const currentEditing = editing || canvasEditing;
    if (!currentEditing) {
      wx.showToast({ title: '请先选中一个音符位', icon: 'none' });
      return;
    }

    // 【修复】先提交任何未保存的编辑，确保数据一致性
    // 这样可以避免删除时丢失未提交的更改，也避免影响相邻音符
    if (canvasEditing) {
      this.commitCanvasEditDataOnly();
    }
    
    // 重新获取 notations（提交后可能已更新）
    const notations = this.data.notations;

    // 统一获取编辑位置信息 - 使用 ?? 避免 0 被误判为 falsy
    const sheetId = currentEditing.sheet ?? currentEditing.notationId;
    const measureIdx = currentEditing.measure ?? currentEditing.measureIndex;
    const beatIdx = currentEditing.beat ?? currentEditing.beatIndex;
    const subIdx = currentEditing.subdivision ?? currentEditing.subIndex ?? 0;
    // 【修复】获取当前编辑的 hand 和 index，用于后续读取正确的槽位值
    const currentHand = currentEditing.hand || 'right';
    const currentIndex = currentEditing.index ?? 1; // 默认内侧槽位
    
    const notationIndex = notations.findIndex(n => n.id === sheetId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }

    const notation = this.deepCloneNotation(notations[notationIndex]);
    const isCollapsed = notation.collapsed;
    
    // 检查 measureIdx 和 beatIdx 是否有效
    if (measureIdx === undefined || measureIdx === null || beatIdx === undefined || beatIdx === null) {
      wx.showToast({ title: '请先选中一个音符位', icon: 'none' });
      return;
    }
    
    const beatData = notation.measures[measureIdx]?.beats[beatIdx];
    if (!beatData || !beatData.subdivisions) {
      wx.showToast({ title: '无效的拍位', icon: 'none' });
      return;
    }

    // 检查是否至少保留一个subdivision
    if (beatData.subdivisions.length <= 1) {
      // 【任务1】检测是否可以删除整拍：当前位置后续到模块末尾都是空拍
      const canDeleteBeat = this.checkCanDeleteBeat(notation, measureIdx, beatIdx, subIdx);
      if (canDeleteBeat) {
        // 显示删除拍位确认弹窗
        this.setData({
          showDeleteBeatModal: true,
          pendingDeleteBeatInfo: {
            notationIndex,
            measureIndex: measureIdx,
            beatIndex: beatIdx,
            subIndex: subIdx,
            sheetId,
            isCollapsed
          }
        });
      } else {
        wx.showToast({ title: '每拍至少保留一个音符位', icon: 'none' });
      }
      return;
    }

    // 删除当前subdivision
    beatData.subdivisions.splice(subIdx, 1);

    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.markNotationChanged(); // 标记为有更改
    
    // 【优化】删除格后选中下一格而不是退出虚拟键盘，使编辑更流畅
    const newSubdivisions = beatData.subdivisions;
    // 确定新的选中位置：优先选中下一格，如果不存在则选中上一格
    let newSubIdx = subIdx;
    if (newSubIdx >= newSubdivisions.length) {
      newSubIdx = newSubdivisions.length - 1;
    }
    if (newSubIdx < 0) newSubIdx = 0;
    
    // 【修复】获取新选中位置的音符值 - 根据当前编辑的 hand/index 读取正确的槽位
    const newSubdivision = newSubdivisions[newSubIdx];
    const handKey = currentHand === 'right' ? 'rightHand' : 'leftHand';
    const slotArray = newSubdivision?.[handKey];
    const newNoteValue = Array.isArray(slotArray) ? (slotArray[currentIndex] || '') : '';
    
    if (canvasEditing) {
      // Canvas模式：更新编辑位置到新的subdivision
      this.setData({
        canvasEditing: {
          ...canvasEditing,
          subIndex: newSubIdx
        },
        canvasEditingValue: newNoteValue,
        virtualKeyboardDisplay: newNoteValue,
        virtualKeyboardRendered: this.renderNoteForDisplay(newNoteValue),
        vkParsed: this.parseNoteForVK(newNoteValue)
      });
      // 如果是Canvas模式，需要重新渲染
      if (isCollapsed) {
        setTimeout(() => {
          // 【优化】使用编辑模式渲染器保持编辑状态
          this.initCanvasRendererForEdit(sheetId, notationIndex, null);
        }, 50);
      }
    } else {
      // View模式：更新编辑位置到新的subdivision
      this.setData({
        editing: {
          ...editing,
          subdivision: newSubIdx
        },
        editingValue: newNoteValue,
        virtualKeyboardDisplay: newNoteValue,
        virtualKeyboardRendered: this.renderNoteForDisplay(newNoteValue),
        vkParsed: this.parseNoteForVK(newNoteValue)
      });
    }
    
    // 更新音高档位
    this.updatePitchLevelFromNote();
    
    wx.showToast({ title: '已删除音符位', icon: 'success' });
  },
  
  // 【任务1】检查是否可以删除整拍：当前位置后续到模块末尾都是空拍
  checkCanDeleteBeat(notation, measureIdx, beatIdx, subIdx) {
    const measures = notation.measures;
    if (!measures || measures.length === 0) return false;
    
    // 从当前位置开始，检查后续所有音符是否为空
    for (let m = measureIdx; m < measures.length; m++) {
      const measure = measures[m];
      if (!measure || !measure.beats) continue;
      
      for (let b = (m === measureIdx ? beatIdx : 0); b < measure.beats.length; b++) {
        const beat = measure.beats[b];
        if (!beat || !beat.subdivisions) continue;
        
        for (let s = (m === measureIdx && b === beatIdx ? subIdx : 0); s < beat.subdivisions.length; s++) {
          const sub = beat.subdivisions[s];
          // 检查是否为空拍
          if (!this.isEmptySubdivision(sub)) {
            return false; // 发现非空音符，不能删除
          }
        }
      }
    }
    return true; // 后续所有都是空拍
  },
  
  // 【任务1】检查subdivision是否为空
  isEmptySubdivision(subdivision) {
    if (!subdivision) return true;
    const rightHand = subdivision.rightHand || ['', ''];
    const leftHand = subdivision.leftHand || ['', ''];
    // 检查所有槽位是否都为空
    return !rightHand[0] && !rightHand[1] && !leftHand[0] && !leftHand[1];
  },
  
  // 【任务1】关闭删除拍位确认弹窗
  closeDeleteBeatModal() {
    this.setData({
      showDeleteBeatModal: false,
      pendingDeleteBeatInfo: null
    });
  },
  
  // 【任务1】切换删除所有空拍选项
  toggleDeleteBeatAllEmpty() {
    this.setData({
      deleteBeatAllEmpty: !this.data.deleteBeatAllEmpty
    });
  },
  
  // 【任务1】确认删除拍位
  confirmDeleteBeat() {
    const { pendingDeleteBeatInfo, deleteBeatAllEmpty, notations } = this.data;
    if (!pendingDeleteBeatInfo) {
      this.closeDeleteBeatModal();
      return;
    }
    
    // 先备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('删除拍位');
    this.backupCurrentState(snapshotAction);
    
    const { notationIndex, measureIndex, beatIndex, subIndex, sheetId, isCollapsed } = pendingDeleteBeatInfo;
    const notation = this.deepCloneNotation(notations[notationIndex]);
    const measuresPerRow = this.getMeasuresPerRowForNotation(notation) || 1;
    
    if (deleteBeatAllEmpty) {
      // 删除当前位置到末尾所有空拍
      this.deleteEmptyBeatsFromPosition(notation, measureIndex, beatIndex, subIndex, measuresPerRow);
    } else {
      // 只删除当前拍
      this.deleteSingleBeat(notation, measureIndex, beatIndex, measuresPerRow);
    }
    
    // 计算光标应该停留的位置（前一拍的最后一个位置）
    const cursorPosition = this.calculateCursorAfterBeatDelete(notation, measureIndex, beatIndex);
    
    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.markNotationChanged();
    
    // 关闭弹窗并清除编辑状态
    this.setData({
      showDeleteBeatModal: false,
      pendingDeleteBeatInfo: null,
      editing: null,
      editingValue: '',
      canvasEditing: null,
      canvasEditingValue: '',
      showVirtualKeyboard: false
    });
    
    // 如果是Canvas模式，重新渲染
    if (isCollapsed && sheetId) {
      const newHeight = this.calculateCanvasHeight(notation);
      // 【优化】保持Canvas编辑模式不变，用户可以立即点击其他位置继续编辑
      this.setData({
        [`notations[${notationIndex}].canvasHeight`]: newHeight,
        [`notations[${notationIndex}].isCanvasEditing`]: true
      }, () => {
        setTimeout(() => {
          // 使用编辑模式渲染器，保持Canvas交互状态
          this.initCanvasRendererForEdit(sheetId, notationIndex, null);
        }, 50);
      });
    }
    
    // 设置光标到新位置
    if (cursorPosition) {
      setTimeout(() => {
        this.navigateToCursorPosition(sheetId, cursorPosition, isCollapsed, notationIndex);
      }, 100);
    }
    
    wx.showToast({ title: '已删除拍位', icon: 'success' });
  },
  
  // 【任务1】删除从指定位置开始的所有空拍
  deleteEmptyBeatsFromPosition(notation, measureIdx, beatIdx, subIdx, measuresPerRow) {
    const measures = notation.measures;
    if (!measures || measures.length === 0) return;
    
    // 计算当前行信息
    const currentRowIndex = Math.floor(measureIdx / measuresPerRow);
    const rowStartIndex = currentRowIndex * measuresPerRow;
    const rowEndIndex = Math.min(rowStartIndex + measuresPerRow, measures.length);
    
    // 计算该行原始的总拍数（用于后续补足占位）
    let originalBeatsInRow = 0;
    for (let m = rowStartIndex; m < rowEndIndex; m++) {
      const measure = measures[m];
      if (measure && measure.beats) {
        originalBeatsInRow += measure.beats.length;
      }
    }
    
    // 收集要保留的拍位（当前位置之前的）
    let beatsToKeep = [];
    for (let m = rowStartIndex; m <= measureIdx; m++) {
      const measure = measures[m];
      if (!measure || !measure.beats) continue;
      
      for (let b = 0; b < measure.beats.length; b++) {
        if (m === measureIdx && b >= beatIdx) break;
        beatsToKeep.push({ measureIndex: m, beatIndex: b, beat: JSON.parse(JSON.stringify(measure.beats[b])) });
      }
    }
    
    // 如果当前拍的当前位置之前还有音符格，保留它们
    if (subIdx > 0) {
      const currentBeat = measures[measureIdx].beats[beatIdx];
      const partialBeat = {
        subdivisions: currentBeat.subdivisions.slice(0, subIdx)
      };
      beatsToKeep.push({ measureIndex: measureIdx, beatIndex: beatIdx, beat: partialBeat, partial: true });
    }
    
    // 如果保留的拍位为空（即删除的是第一个拍的第一个位置），则删除整行
    if (beatsToKeep.length === 0 || (beatsToKeep.length === 1 && beatsToKeep[0].partial && beatsToKeep[0].beat.subdivisions.length === 0)) {
      // 删除从当前行到末尾的所有内容
      notation.measures.splice(rowStartIndex);
      // 确保至少保留一行空小节
      if (notation.measures.length === 0) {
        notation.measures.push(this.createEmptyMeasure(4, 4)); // 创建默认空小节
      }
      return;
    }
    
    // 计算删除了多少个拍
    const deletedBeatsCount = originalBeatsInRow - beatsToKeep.length;
    
    // 重建当前行及之后的小节结构
    // 删除当前行及之后的所有小节
    notation.measures.splice(rowStartIndex);
    
    // 根据保留的拍位重建小节
    this.rebuildMeasuresFromBeats(notation, beatsToKeep, measuresPerRow);
    
    // 【优化】在行末尾添加占位拍，保持行宽度不变
    if (deletedBeatsCount > 0 && notation.measures.length > 0) {
      const lastMeasureIdx = notation.measures.length - 1;
      const lastMeasure = notation.measures[lastMeasureIdx];
      
      // 记录添加占位拍之前的最后一个非占位拍索引
      const lastRealBeatIndex = lastMeasure.beats.length - 1;
      
      for (let i = 0; i < deletedBeatsCount; i++) {
        // 创建占位拍
        const placeholderBeat = {
          subdivisions: [
            { rightHand: ['', ''], leftHand: ['', ''], isPlaceholder: true },
            { rightHand: ['', ''], leftHand: ['', ''], isPlaceholder: true },
            { rightHand: ['', ''], leftHand: ['', ''], isPlaceholder: true },
            { rightHand: ['', ''], leftHand: ['', ''], isPlaceholder: true }
          ],
          isPlaceholder: true
        };
        lastMeasure.beats.push(placeholderBeat);
      }
      
      // 设置最后一个非占位拍的索引（用于小节线定位）
      lastMeasure.lastRealBeatIndex = lastRealBeatIndex;
    }
  },
  
  // 【任务1】删除单个拍（保持行宽度不变）
  deleteSingleBeat(notation, measureIdx, beatIdx, measuresPerRow) {
    const measure = notation.measures[measureIdx];
    if (!measure || !measure.beats) return;
    
    // 计算当前行信息
    const currentRowIndex = Math.floor(measureIdx / measuresPerRow);
    const rowStartIndex = currentRowIndex * measuresPerRow;
    const rowEndIndex = Math.min(rowStartIndex + measuresPerRow, notation.measures.length);
    
    // 如果小节只有一个拍，需要特殊处理
    if (measure.beats.length <= 1) {
      const measuresInRow = rowEndIndex - rowStartIndex;
      
      if (measuresInRow <= 1 && notation.measures.length > measuresInRow) {
        // 删除整行（同时清理该行的占位拍）
        this.removeRowPlaceholders(notation, rowStartIndex, rowEndIndex);
        notation.measures.splice(rowStartIndex, measuresInRow);
      } else if (notation.measures.length > 1) {
        // 删除当前小节
        notation.measures.splice(measureIdx, 1);
      }
      return;
    }
    
    // 获取被删除拍的细分数（用于创建占位）
    const deletedBeat = measure.beats[beatIdx];
    const subdivisionsCount = deletedBeat?.subdivisions?.length || 4;
    
    // 删除当前拍
    measure.beats.splice(beatIdx, 1);
    
    // 在该行末尾的最后一个小节添加占位拍，保持行宽度不变
    this.addRowPlaceholderBeat(notation, rowStartIndex, rowEndIndex, subdivisionsCount);
  },
  
  // 【任务1】在行末尾添加占位拍（保持行宽度不变）
  // 占位拍添加到beats数组末尾，标记isPlaceholder=true，小节线在最后一个非占位拍后绘制
  addRowPlaceholderBeat(notation, rowStartIndex, rowEndIndex, subdivisionsCount) {
    // 获取该行的最后一个小节
    const lastMeasureIdx = Math.min(rowEndIndex - 1, notation.measures.length - 1);
    if (lastMeasureIdx < rowStartIndex) return;
    
    const lastMeasure = notation.measures[lastMeasureIdx];
    if (!lastMeasure) return;
    
    // 在添加占位拍之前，找到当前最后一个非占位拍的索引
    let currentLastRealBeatIndex = -1;
    if (lastMeasure.beats) {
      for (let i = lastMeasure.beats.length - 1; i >= 0; i--) {
        if (!lastMeasure.beats[i].isPlaceholder) {
          currentLastRealBeatIndex = i;
          break;
        }
      }
    }
    
    // 创建一个占位拍
    const placeholderBeat = {
      subdivisions: [],
      isPlaceholder: true
    };
    
    // 创建空的细分
    for (let i = 0; i < subdivisionsCount; i++) {
      placeholderBeat.subdivisions.push({
        rightHand: ['', ''],
        leftHand: ['', '']
      });
    }
    
    // 添加到该小节的beats数组末尾
    if (!lastMeasure.beats) lastMeasure.beats = [];
    lastMeasure.beats.push(placeholderBeat);
    
    // 标记该小节有占位拍，并记录最后一个非占位拍的索引
    // 如果之前已经有占位拍，保持原来的索引；否则设置为新占位拍前一个
    if (currentLastRealBeatIndex >= 0) {
      lastMeasure.lastRealBeatIndex = currentLastRealBeatIndex;
    } else {
      // 全部都是占位拍的情况（不太可能发生）
      lastMeasure.lastRealBeatIndex = 0;
    }
  },
  
  // 【任务1】移除行的占位拍（删除行时调用）
  removeRowPlaceholders(notation, rowStartIndex, rowEndIndex) {
    for (let m = rowStartIndex; m < rowEndIndex && m < notation.measures.length; m++) {
      const measure = notation.measures[m];
      if (!measure) continue;
      
      // 清空placeholderBeats数组
      if (measure.placeholderBeats) {
        measure.placeholderBeats = [];
      }
      
      // 兼容旧的beats中的占位拍
      if (measure.beats) {
        measure.beats = measure.beats.filter(beat => !beat.isPlaceholder);
      }
    }
  },
  
  // 【任务1】根据保留的拍位重建小节
  rebuildMeasuresFromBeats(notation, beatsToKeep, measuresPerRow) {
    if (beatsToKeep.length === 0) return;
    
    // 确定每小节的拍数（使用第一个完整小节的拍数作为参考）
    const originalMeasure = notation.measures[0];
    const beatsPerMeasure = originalMeasure ? originalMeasure.beats.length : 4;
    
    let currentMeasure = { beats: [] };
    let measureCount = 0;
    
    for (const beatInfo of beatsToKeep) {
      currentMeasure.beats.push(beatInfo.beat);
      
      // 当达到每小节的拍数时，创建新小节
      if (currentMeasure.beats.length >= beatsPerMeasure) {
        notation.measures.push(currentMeasure);
        currentMeasure = { beats: [] };
        measureCount++;
      }
    }
    
    // 添加最后一个不完整的小节（如果有）
    if (currentMeasure.beats.length > 0) {
      notation.measures.push(currentMeasure);
    }
  },
  
  // 【任务1】计算删除拍后光标应该停留的位置
  calculateCursorAfterBeatDelete(notation, measureIdx, beatIdx) {
    const measures = notation.measures;
    if (!measures || measures.length === 0) return null;
    
    // 尝试定位到前一拍的最后一个位置
    if (beatIdx > 0) {
      // 同一小节的前一拍
      const prevBeat = measures[measureIdx]?.beats[beatIdx - 1];
      if (prevBeat && prevBeat.subdivisions) {
        return {
          measureIndex: measureIdx,
          beatIndex: beatIdx - 1,
          subIndex: prevBeat.subdivisions.length - 1
        };
      }
    } else if (measureIdx > 0) {
      // 前一小节的最后一拍
      const prevMeasure = measures[measureIdx - 1];
      if (prevMeasure && prevMeasure.beats && prevMeasure.beats.length > 0) {
        const lastBeat = prevMeasure.beats[prevMeasure.beats.length - 1];
        return {
          measureIndex: measureIdx - 1,
          beatIndex: prevMeasure.beats.length - 1,
          subIndex: lastBeat.subdivisions ? lastBeat.subdivisions.length - 1 : 0
        };
      }
    }
    
    // 默认返回第一个位置
    return { measureIndex: 0, beatIndex: 0, subIndex: 0 };
  },
  
  // 【任务1】导航到光标位置
  navigateToCursorPosition(sheetId, position, isCollapsed, notationIndex) {
    const { notations } = this.data;
    const notation = notations[notationIndex];
    if (!notation) return;
    
    const measure = notation.measures[position.measureIndex];
    if (!measure || !measure.beats) return;
    
    const beat = measure.beats[position.beatIndex];
    if (!beat || !beat.subdivisions) return;
    
    const subdivision = beat.subdivisions[position.subIndex];
    if (!subdivision) return;
    
    // 设置编辑状态到目标位置
    if (isCollapsed) {
      // Canvas模式
      this.setData({
        canvasEditing: {
          notationId: sheetId,
          notationIndex,
          measureIndex: position.measureIndex,
          beatIndex: position.beatIndex,
          subIndex: position.subIndex,
          hand: 'right',
          index: 1
        },
        canvasEditingValue: subdivision.rightHand?.[1] || ''
      }, () => { this.syncVkDotAndArpeggioState(); });
    } else {
      // View模式
      this.setData({
        editing: {
          sheet: sheetId,
          measure: position.measureIndex,
          beat: position.beatIndex,
          subdivision: position.subIndex,
          hand: 'right',
          index: 1
        },
        editingValue: subdivision.rightHand?.[1] || ''
      }, () => { this.syncVkDotAndArpeggioState(); });
    }
  },
  
  // 【任务1】创建空小节
  createEmptyMeasure(beatsPerMeasure = 4, subdivisionsPerBeat = 4) {
    const beats = [];
    for (let i = 0; i < beatsPerMeasure; i++) {
      const subdivisions = [];
      for (let j = 0; j < subdivisionsPerBeat; j++) {
        subdivisions.push({
          rightHand: ['', ''],
          leftHand: ['', '']
        });
      }
      beats.push({ subdivisions });
    }
    return { beats };
  },
  
  // ========== 任务2: 复制粘贴功能 ==========
  
  // 【任务2】处理长按拍位进入选中模式
  onBeatLongPress(e) {
    if (this.data.isPlaybackMode || this.data.readingMode) return;
    
    const { sheet, measure, beat } = e.currentTarget.dataset;
    const notationIndex = this.data.notations.findIndex(n => n.id === sheet);
    if (notationIndex === -1) return;
    
    // 震动反馈
    wx.vibrateShort({ type: 'medium' });
    
    // 计算选中拍位信息
    const selectedBeatsInfo = {};
    selectedBeatsInfo[`${sheet}-${measure}-${beat}`] = true;
    
    // 获取点击位置用于显示气泡
    const touch = e.touches?.[0] || e.detail;
    const touchX = touch?.clientX || touch?.x || 0;
    const touchY = touch?.clientY || touch?.y || 0;
    
    // 设置选中状态并立即显示气泡，同时强制收起菜单栏
    this.setData({
      isSelectingBeats: true,
      beatSelectionStart: { notationId: sheet, measureIndex: measure, beatIndex: beat },
      beatSelectionEnd: { notationId: sheet, measureIndex: measure, beatIndex: beat },
      selectedBeatsInfo,
      canvasSelectStep: 0,
      actionCollapsed: true  // 【优化】强制收起菜单栏
    }, () => {
      // 显示气泡弹窗
      this.showCopyPasteBubbleAtBeat(sheet, measure, beat, touchX, touchY);
    });
    
    // 清除当前编辑状态
    this.clearEditing();
  },
  
  // 【任务2】选中模式下点击拍位
  onBeatTapForSelection(e) {
    const { isSelectingBeats, beatSelectionStart } = this.data;
    if (!isSelectingBeats) return;
    
    const { sheet, measure, beat } = e.currentTarget.dataset;
    
    // 检查是否在同一个module
    if (beatSelectionStart && sheet !== beatSelectionStart.notationId) {
      wx.showToast({ title: '只能选择同一模块内的拍', icon: 'none' });
      return;
    }
    
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
    
    // 更新选择终点
    this.setData({
      beatSelectionEnd: { notationId: sheet, measureIndex: measure, beatIndex: beat }
    }, () => {
      // 更新选中拍位信息
      const selectedBeatsInfo = this.updateSelectedBeatsInfo();
      this.setData({ selectedBeatsInfo });
      
      // 获取点击位置，在点击的拍上方显示气泡
      const touch = e.touches?.[0] || e.detail;
      const touchX = touch?.clientX || touch?.x || 0;
      const touchY = touch?.clientY || touch?.y || 0;
      this.showCopyPasteBubbleAtBeat(sheet, measure, beat, touchX, touchY);
    });
  },
  
  // 【任务2】更新选中拍位信息
  updateSelectedBeatsInfo() {
    const { beatSelectionStart, beatSelectionEnd, notations } = this.data;
    if (!beatSelectionStart || !beatSelectionEnd) return {};
    if (beatSelectionStart.notationId !== beatSelectionEnd.notationId) return {};
    
    const notationIndex = notations.findIndex(n => n.id === beatSelectionStart.notationId);
    if (notationIndex === -1) return {};
    
    const notation = notations[notationIndex];
    const notationId = beatSelectionStart.notationId;
    
    // 计算全局索引
    const startGlobal = this.getGlobalBeatIndex(notation, beatSelectionStart.measureIndex, beatSelectionStart.beatIndex);
    const endGlobal = this.getGlobalBeatIndex(notation, beatSelectionEnd.measureIndex, beatSelectionEnd.beatIndex);
    const minGlobal = Math.min(startGlobal, endGlobal);
    const maxGlobal = Math.max(startGlobal, endGlobal);
    
    // 构建选中拍位信息
    const selectedBeatsInfo = {};
    let globalIdx = 0;
    for (let m = 0; m < notation.measures.length; m++) {
      const measure = notation.measures[m];
      if (!measure || !measure.beats) continue;
      for (let b = 0; b < measure.beats.length; b++) {
        if (globalIdx >= minGlobal && globalIdx <= maxGlobal) {
          selectedBeatsInfo[`${notationId}-${m}-${b}`] = true;
        }
        globalIdx++;
      }
    }
    
    return selectedBeatsInfo;
  },
  
  // 【任务2】Canvas模式长按处理（统一逻辑）
  onCanvasBeatLongPress(notationId, notationIndex, measureIndex, beatIndex, touchX, touchY) {
    if (this.data.isPlaybackMode || this.data.readingMode) return;
    
    // 震动反馈
    wx.vibrateShort({ type: 'medium' });
    
    const { isSelectingBeats, beatSelectionStart } = this.data;
    
    if (!isSelectingBeats) {
      // 进入选中模式
      const selectedBeatsInfo = {};
      selectedBeatsInfo[`${notationId}-${measureIndex}-${beatIndex}`] = true;
      
      this.setData({
        isSelectingBeats: true,
        beatSelectionStart: { notationId, measureIndex, beatIndex },
        beatSelectionEnd: { notationId, measureIndex, beatIndex },
        selectedBeatsInfo,
        canvasSelectStep: 0,
        actionCollapsed: true  // 【优化】强制收起菜单栏
      }, () => {
        this.showCopyPasteBubbleAtBeat(notationId, measureIndex, beatIndex, touchX, touchY);
        // Canvas模式需要重绘以显示选中高亮
        this.redrawCanvasWithSelection(notationId, notationIndex);
      });
    }
  },
  
  // 【任务2】Canvas模式点击处理（选中模式下）
  onCanvasBeatTapForSelection(notationId, notationIndex, measureIndex, beatIndex, touchX, touchY) {
    const { isSelectingBeats, beatSelectionStart } = this.data;
    if (!isSelectingBeats) return;
    
    // 检查是否在同一个module
    if (beatSelectionStart && notationId !== beatSelectionStart.notationId) {
      wx.showToast({ title: '只能选择同一模块内的拍', icon: 'none' });
      return;
    }
    
    // 震动反馈
    wx.vibrateShort({ type: 'light' });
    
    // 更新选择终点
    this.setData({
      beatSelectionEnd: { notationId, measureIndex, beatIndex }
    }, () => {
      // 更新选中拍位信息
      const selectedBeatsInfo = this.updateSelectedBeatsInfo();
      this.setData({ selectedBeatsInfo });
      
      // 显示气泡
      this.showCopyPasteBubbleAtBeat(notationId, measureIndex, beatIndex, touchX, touchY);
      // Canvas模式重绘
      this.redrawCanvasWithSelection(notationId, notationIndex);
    });
  },
  
  // 【任务2】Canvas模式重绘以显示选中高亮
  redrawCanvasWithSelection(notationId, notationIndex) {
    const renderer = this._canvasRenderers[notationId];
    if (renderer) {
      // 传递选中信息给渲染器
      renderer.setSelectionInfo(this.data.selectedBeatsInfo);
      renderer.render();
    }
  },
  
  // 【任务2】在指定拍位上方显示气泡（气泡已移到拍位元素内部，使用绝对定位）
  // 【Bug修复】无论collapsed状态都使用Canvas渲染器计算位置，确保气泡正确显示在尾拍上方
  showCopyPasteBubbleAtBeat(notationId, measureIndex, beatIndex, touchX, touchY) {
    const { notations } = this.data;
    const notationIndex = notations.findIndex(n => n.id === notationId);
    
    if (notationIndex === -1) {
      this.setData({ showBeatSelectionBubble: true });
      return;
    }
    
    // 【统一处理】全面Canvas2D模式下，无论collapsed状态都需要通过渲染器计算位置
    const renderer = this._canvasRenderers[notationId];
    if (renderer) {
      // 获取选中尾拍第一个细分的位置（作为拍位位置）
      const columnRect = renderer.getColumnRect(measureIndex, beatIndex, 0);
      if (columnRect) {
        const bubbleWidth = 180;
        const bubbleHeight = 60;
        // 计算拍位的宽度（假设每个拍有4个细分）
        const beatWidth = columnRect.width * 4;
        // 气泡显示在拍位上方居中
        const bubbleX = columnRect.x + beatWidth / 2 - bubbleWidth / 2;
        const bubbleY = columnRect.y - bubbleHeight - 20;
        
        this.setData({
          showBeatSelectionBubble: true,
          beatBubbleCanvasPosition: { x: Math.max(10, bubbleX), y: Math.max(10, bubbleY) }
        });
        return;
      }
    }
    
    // 如果渲染器不可用或无法获取拍位位置，使用触摸坐标作为备用方案
    const bubbleWidth = 180;
    const bubbleHeight = 60;
    const query = wx.createSelectorQuery().in(this);
    query.select(`#notation-container-${notationId}`).boundingClientRect().exec((res) => {
      if (res && res[0]) {
        const containerRect = res[0];
        const bubbleX = (touchX || containerRect.width / 2) - containerRect.left - bubbleWidth / 2;
        const bubbleY = (touchY || 50) - containerRect.top - bubbleHeight - 20;
        
        this.setData({
          showBeatSelectionBubble: true,
          beatBubbleCanvasPosition: { x: Math.max(10, bubbleX), y: Math.max(10, bubbleY) }
        });
      } else {
        this.setData({ showBeatSelectionBubble: true });
      }
    });
  },
  
  // 【任务2】显示复制/粘贴气泡弹窗（保留旧接口兼容）
  showCopyPasteBubble(x, y) {
    this.showCopyPasteBubbleAtBeat(null, null, null, x, y);
  },
  
  // 【任务2】关闭复制/粘贴气泡弹窗（点击空白区域）
  closeBeatSelectionBubble() {
    const { isSelectingBeats, notations, beatSelectionStart } = this.data;
    
    // 【Bug修复】全面Canvas2D模式下，无论collapsed状态都需要清除选中高亮
    if (isSelectingBeats && beatSelectionStart) {
      const notationIndex = notations.findIndex(n => n.id === beatSelectionStart.notationId);
      if (notationIndex !== -1) {
        const renderer = this._canvasRenderers[beatSelectionStart.notationId];
        if (renderer) {
          renderer.setSelectionInfo({});
          renderer.render();
        }
      }
    }
    
    this.setData({
      showBeatSelectionBubble: false,
      isSelectingBeats: false,
      beatSelectionStart: null,
      beatSelectionEnd: null,
      selectedBeatsInfo: {},
      canvasSelectStep: 0,
      canvasSelectStartInfo: null
    });
  },
  
  // 【任务2】退出选中模式但不关闭气泡（用于复制/粘贴后）
  exitSelectionMode() {
    const { notations, beatSelectionStart } = this.data;
    
    // 【Bug修复】全面Canvas2D模式下，无论collapsed状态都需要清除选中高亮
    if (beatSelectionStart) {
      const notationIndex = notations.findIndex(n => n.id === beatSelectionStart.notationId);
      if (notationIndex !== -1) {
        const renderer = this._canvasRenderers[beatSelectionStart.notationId];
        if (renderer) {
          renderer.setSelectionInfo({});
          renderer.render();
        }
      }
    }
    
    this.setData({
      showBeatSelectionBubble: false,
      isSelectingBeats: false,
      beatSelectionStart: null,
      beatSelectionEnd: null,
      selectedBeatsInfo: {},
      canvasSelectStep: 0,
      canvasSelectStartInfo: null
    });
  },
  
  // 【任务2】复制选中的拍位
  copySelectedBeats() {
    const { beatSelectionStart, beatSelectionEnd, notations } = this.data;
    
    if (!beatSelectionStart || !beatSelectionEnd) {
      wx.showToast({ title: '请先选择拍位', icon: 'none' });
      return;
    }
    
    // 确保起点和终点在同一个module
    if (beatSelectionStart.notationId !== beatSelectionEnd.notationId) {
      wx.showToast({ title: '只能复制同一模块内的拍', icon: 'none' });
      return;
    }
    
    const notationIndex = notations.findIndex(n => n.id === beatSelectionStart.notationId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }
    
    const notation = notations[notationIndex];
    
    // 计算起点和终点的全局拍位索引
    const startGlobal = this.getGlobalBeatIndex(notation, beatSelectionStart.measureIndex, beatSelectionStart.beatIndex);
    const endGlobal = this.getGlobalBeatIndex(notation, beatSelectionEnd.measureIndex, beatSelectionEnd.beatIndex);
    
    // 确保起点小于等于终点
    const minGlobal = Math.min(startGlobal, endGlobal);
    const maxGlobal = Math.max(startGlobal, endGlobal);
    
    // 收集选中的拍位数据并生成代码
    const selectedBeats = [];
    let clipboardCode = '';
    let globalIdx = 0;
    
    for (let m = 0; m < notation.measures.length; m++) {
      const measure = notation.measures[m];
      if (!measure || !measure.beats) continue;
      
      for (let b = 0; b < measure.beats.length; b++) {
        if (globalIdx >= minGlobal && globalIdx <= maxGlobal) {
          const beat = measure.beats[b];
          selectedBeats.push(JSON.parse(JSON.stringify(beat)));
          clipboardCode += '|' + this.generateBeatCode(beat);
        }
        globalIdx++;
      }
    }
    
    // 添加结尾分隔符
    clipboardCode += '|';
    
    // 保存到剪贴板
    this.setData({
      beatClipboard: clipboardCode,
      beatClipboardBeats: selectedBeats
    });
    
    // 复制后退出选中模式
    this.exitSelectionMode();
    
    wx.showToast({ title: `已复制 ${selectedBeats.length} 个拍`, icon: 'success' });
  },
  
  // 【任务2】获取全局拍位索引
  getGlobalBeatIndex(notation, measureIndex, beatIndex) {
    let globalIdx = 0;
    for (let m = 0; m < measureIndex && m < notation.measures.length; m++) {
      const measure = notation.measures[m];
      if (measure && measure.beats) {
        globalIdx += measure.beats.length;
      }
    }
    return globalIdx + beatIndex;
  },
  
  // 【任务2】粘贴拍位
  pasteBeats() {
    const { beatSelectionStart, beatSelectionEnd, beatClipboardBeats, notations } = this.data;
    
    if (!beatClipboardBeats || beatClipboardBeats.length === 0) {
      wx.showToast({ title: '剪贴板为空', icon: 'none' });
      return;
    }
    
    if (!beatSelectionStart || !beatSelectionEnd) {
      wx.showToast({ title: '请先选择粘贴位置', icon: 'none' });
      return;
    }
    
    // 确保起点和终点在同一个module
    if (beatSelectionStart.notationId !== beatSelectionEnd.notationId) {
      wx.showToast({ title: '只能在同一模块内粘贴', icon: 'none' });
      return;
    }
    
    const notationIndex = notations.findIndex(n => n.id === beatSelectionStart.notationId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }
    
    // 先备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('粘贴拍位');
    this.backupCurrentState(snapshotAction);
    
    const notation = this.deepCloneNotation(notations[notationIndex]);
    const isCollapsed = notation.collapsed;
    const sheetId = beatSelectionStart.notationId;
    const measuresPerRow = this.getMeasuresPerRowForNotation(notation) || 1;
    
    // 计算起点和终点的全局拍位索引
    const startGlobal = this.getGlobalBeatIndex(notation, beatSelectionStart.measureIndex, beatSelectionStart.beatIndex);
    const endGlobal = this.getGlobalBeatIndex(notation, beatSelectionEnd.measureIndex, beatSelectionEnd.beatIndex);
    const minGlobal = Math.min(startGlobal, endGlobal);
    const maxGlobal = Math.max(startGlobal, endGlobal);
    
    // 执行粘贴逻辑
    this.executePaste(notation, minGlobal, maxGlobal, beatClipboardBeats, measuresPerRow);
    
    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.markNotationChanged();
    
    // 关闭气泡
    this.closeBeatSelectionBubble();
    
    // 如果是Canvas模式，重新渲染
    if (isCollapsed) {
      const newHeight = this.calculateCanvasHeight(notation);
      this.setData({
        [`notations[${notationIndex}].canvasHeight`]: newHeight
      }, () => {
        setTimeout(() => {
          this.initCanvasRenderer(sheetId, notationIndex);
        }, 50);
      });
    }
    
    wx.showToast({ title: '粘贴成功', icon: 'success' });
  },
  
  // 【任务2】删除选中的拍位
  deleteSelectedBeats() {
    const { beatSelectionStart, beatSelectionEnd, notations } = this.data;
    
    if (!beatSelectionStart || !beatSelectionEnd) {
      wx.showToast({ title: '请先选择拍位', icon: 'none' });
      return;
    }
    
    // 确保起点和终点在同一个module
    if (beatSelectionStart.notationId !== beatSelectionEnd.notationId) {
      wx.showToast({ title: '只能删除同一模块内的拍', icon: 'none' });
      return;
    }
    
    const notationIndex = notations.findIndex(n => n.id === beatSelectionStart.notationId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }
    
    // 先备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('删除选中拍位');
    this.backupCurrentState(snapshotAction);
    
    const notation = this.deepCloneNotation(notations[notationIndex]);
    const isCollapsed = notation.collapsed;
    const sheetId = beatSelectionStart.notationId;
    const measuresPerRow = this.getMeasuresPerRowForNotation(notation) || 1;
    
    // 计算起点和终点的全局拍位索引
    const startGlobal = this.getGlobalBeatIndex(notation, beatSelectionStart.measureIndex, beatSelectionStart.beatIndex);
    const endGlobal = this.getGlobalBeatIndex(notation, beatSelectionEnd.measureIndex, beatSelectionEnd.beatIndex);
    const minGlobal = Math.min(startGlobal, endGlobal);
    const maxGlobal = Math.max(startGlobal, endGlobal);
    
    // 收集所有拍位（不包含占位拍）
    const allBeats = [];
    for (const measure of notation.measures) {
      if (measure && measure.beats) {
        for (const beat of measure.beats) {
          if (!beat.isPlaceholder) {
            allBeats.push(JSON.parse(JSON.stringify(beat)));
          }
        }
      }
    }
    
    // 删除选中区域的拍位
    const deleteCount = maxGlobal - minGlobal + 1;
    allBeats.splice(minGlobal, deleteCount);
    
    // 重新构建小节结构（会自动补足空拍）
    this.rebuildMeasureStructure(notation, allBeats, measuresPerRow);
    
    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.markNotationChanged();
    
    // 退出选中模式
    this.exitSelectionMode();
    
    // 如果是Canvas模式，重新渲染
    if (isCollapsed) {
      const newHeight = this.calculateCanvasHeight(notation);
      this.setData({
        [`notations[${notationIndex}].canvasHeight`]: newHeight
      }, () => {
        setTimeout(() => {
          this.initCanvasRenderer(sheetId, notationIndex);
        }, 50);
      });
    }
    
    wx.showToast({ title: `已删除 ${deleteCount} 个拍`, icon: 'success' });
  },
  
  // 【任务2】执行粘贴操作
  executePaste(notation, startGlobalIdx, endGlobalIdx, pasteBeats, measuresPerRow) {
    // 收集所有拍位
    const allBeats = [];
    for (const measure of notation.measures) {
      if (measure && measure.beats) {
        for (const beat of measure.beats) {
          allBeats.push(JSON.parse(JSON.stringify(beat)));
        }
      }
    }
    
    // 删除选中区域的拍位
    const deleteCount = endGlobalIdx - startGlobalIdx + 1;
    allBeats.splice(startGlobalIdx, deleteCount);
    
    // 在选中位置插入粘贴的拍位
    for (let i = 0; i < pasteBeats.length; i++) {
      allBeats.splice(startGlobalIdx + i, 0, JSON.parse(JSON.stringify(pasteBeats[i])));
    }
    
    // 重新构建小节结构
    this.rebuildMeasureStructure(notation, allBeats, measuresPerRow);
  },
  
  // 【任务2】重新构建小节结构
  rebuildMeasureStructure(notation, allBeats, measuresPerRow) {
    // 获取原有的小节结构（每小节的拍数）
    const originalMeasureStructure = notation.measures.map(m => m.beats ? m.beats.length : 4);
    const beatsPerMeasure = originalMeasureStructure[0] || 4;
    const beatsPerRow = beatsPerMeasure * measuresPerRow; // 每行的总拍数
    
    // 清空现有小节
    notation.measures = [];
    
    // 按照原有结构重建小节
    let beatIdx = 0;
    let measureIdx = 0;
    
    while (beatIdx < allBeats.length) {
      const beatsInThisMeasure = originalMeasureStructure[measureIdx % originalMeasureStructure.length] || beatsPerMeasure;
      const measureBeats = [];
      
      for (let i = 0; i < beatsInThisMeasure && beatIdx < allBeats.length; i++) {
        measureBeats.push(allBeats[beatIdx]);
        beatIdx++;
      }
      
      if (measureBeats.length > 0) {
        notation.measures.push({ beats: measureBeats });
      }
      measureIdx++;
    }
    
    // 确保至少有一个小节
    if (notation.measures.length === 0) {
      notation.measures.push(this.createEmptyMeasure(beatsPerMeasure, 4));
    }
    
    // 【优化】补足最后一行的空拍，防止新增行变形
    // 计算最后一行的起始小节索引
    const totalMeasures = notation.measures.length;
    const lastRowStartIdx = Math.floor((totalMeasures - 1) / measuresPerRow) * measuresPerRow;
    
    // 计算最后一行当前的拍数
    let lastRowBeats = 0;
    for (let m = lastRowStartIdx; m < totalMeasures; m++) {
      const measure = notation.measures[m];
      if (measure && measure.beats) {
        lastRowBeats += measure.beats.length;
      }
    }
    
    // 计算需要补足的空拍数
    const neededPlaceholders = beatsPerRow - lastRowBeats;
    if (neededPlaceholders > 0) {
      // 获取最后一个小节
      const lastMeasure = notation.measures[totalMeasures - 1];
      
      // 记录添加占位拍之前的最后一个非占位拍索引
      const lastRealBeatIndex = lastMeasure.beats.length - 1;
      
      for (let i = 0; i < neededPlaceholders; i++) {
        // 创建占位拍（默认为空，标记 isPlaceholder）
        const placeholderBeat = {
          subdivisions: [
            { rightHand: ['', ''], leftHand: ['', ''] },
            { rightHand: ['', ''], leftHand: ['', ''] },
            { rightHand: ['', ''], leftHand: ['', ''] },
            { rightHand: ['', ''], leftHand: ['', ''] }
          ],
          isPlaceholder: true  // 标记为占位拍
        };
        lastMeasure.beats.push(placeholderBeat);
      }
      
      // 设置最后一个非占位拍的索引（用于小节线定位）
      lastMeasure.lastRealBeatIndex = lastRealBeatIndex;
    }
  },
  
  // 【任务2】View模式拍位点击扩展选择
  onBeatTapForSelection(e) {
    const { isSelectingBeats, beatSelectionStart } = this.data;
    if (!isSelectingBeats || !beatSelectionStart) return;
    
    const { sheet, measure, beat } = e.currentTarget.dataset;
    
    // 检查是否在同一个module
    if (sheet !== beatSelectionStart.notationId) {
      wx.showToast({ title: '只能选择同一模块内的拍', icon: 'none' });
      return;
    }
    
    // 更新选择终点
    this.setData({
      beatSelectionEnd: { notationId: sheet, measureIndex: measure, beatIndex: beat }
    }, () => {
      // 更新选中拍位信息
      const selectedBeatsInfo = this.updateSelectedBeatsInfo();
      this.setData({ selectedBeatsInfo });
    });
    
    // 获取点击位置显示气泡
    const touch = e.detail;
    if (touch && touch.x && touch.y) {
      this.showCopyPasteBubble(touch.x, touch.y);
    } else {
      // 如果没有坐标，在屏幕中央显示
      const screenWidth = wx.getWindowInfo().screenWidth;
      const screenHeight = wx.getWindowInfo().screenHeight;
      this.showCopyPasteBubble(screenWidth / 2, screenHeight / 2);
    }
  },
  
  // 【任务2】检查拍位是否被选中
  isBeatSelected(notationId, measureIndex, beatIndex) {
    const { isSelectingBeats, beatSelectionStart, beatSelectionEnd, notations } = this.data;
    
    if (!isSelectingBeats || !beatSelectionStart || !beatSelectionEnd) return false;
    if (notationId !== beatSelectionStart.notationId) return false;
    
    const notationIndex = notations.findIndex(n => n.id === notationId);
    if (notationIndex === -1) return false;
    
    const notation = notations[notationIndex];
    
    const currentGlobal = this.getGlobalBeatIndex(notation, measureIndex, beatIndex);
    const startGlobal = this.getGlobalBeatIndex(notation, beatSelectionStart.measureIndex, beatSelectionStart.beatIndex);
    const endGlobal = this.getGlobalBeatIndex(notation, beatSelectionEnd.measureIndex, beatSelectionEnd.beatIndex);
    
    const minGlobal = Math.min(startGlobal, endGlobal);
    const maxGlobal = Math.max(startGlobal, endGlobal);
    
    return currentGlobal >= minGlobal && currentGlobal <= maxGlobal;
  },
  
  // 插入行：在当前选中位置的下方插入一行空模板
  insertRow() {
    const { editing, canvasEditing, notations } = this.data;
    const currentEditing = editing || canvasEditing;
    if (!currentEditing) {
      wx.showToast({ title: '请先选中一个音符位', icon: 'none' });
      return;
    }

    // 统一获取编辑位置信息 - 使用 ?? 避免 0 被误判为 falsy
    const sheetId = currentEditing.sheet ?? currentEditing.notationId;
    const measureIdx = currentEditing.measure ?? currentEditing.measureIndex ?? 0;
    
    const notationIndex = notations.findIndex(n => n.id === sheetId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }

    // 先备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('添加行');
    this.backupCurrentState(snapshotAction);

    const notation = this.deepCloneNotation(notations[notationIndex]);
    const isCollapsed = notation.collapsed;
    const measuresPerRow = this.getMeasuresPerRowForNotation(notation) || 1;
    
    // 计算当前行的起始和结束小节索引
    const currentRowIndex = Math.floor(measureIdx / measuresPerRow);
    const rowStartIndex = currentRowIndex * measuresPerRow;
    const rowEndIndex = Math.min(rowStartIndex + measuresPerRow, notation.measures.length);
    
    // 获取当前行的小节，用于生成空模板
    const rowMeasures = notation.measures.slice(rowStartIndex, rowEndIndex);
    
    // 生成当前行的空模板（保持相同的拍数和细分结构）
    const emptyRowMeasures = rowMeasures.map(m => {
      const template = this.buildMeasureTemplate(m);
      return this.createMeasureFromCustomTemplate(template);
    });
    
    // 在当前行后插入空行（rowEndIndex是当前行的下一个位置）
    notation.measures.splice(rowEndIndex, 0, ...emptyRowMeasures);
    
    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    
    // 【Bug修复】插入行后需要重新计算Canvas高度（无论是否collapsed）
    const newHeight = this.calculateCanvasHeight(notation);
    withOffsets[notationIndex] = {
      ...withOffsets[notationIndex],
      canvasHeight: newHeight,
      tempImagePath: null // 清除缓存的图片，强制重绘
    };
    
    this.saveNotationsScoped(withOffsets);
    this.markNotationChanged(); // 标记为有更改
    
    // 【Bug修复】Canvas模式下：需要销毁旧渲染器并重新初始化（因为Canvas尺寸变化）
    // 先更新data以改变Canvas容器尺寸，再重新初始化渲染器
    this.setData({
      notations: withOffsets
    }, () => {
      this.calculatePages();
      
      // 延迟重新初始化Canvas渲染器（等待WXML更新Canvas尺寸）
      setTimeout(() => {
        // 销毁旧渲染器
        if (this._canvasRenderers && this._canvasRenderers[sheetId]) {
          this._canvasRenderers[sheetId].destroy();
          delete this._canvasRenderers[sheetId];
        }
        
        // 重新初始化渲染器
        if (canvasEditing) {
          // 如果正在Canvas编辑模式，使用编辑模式渲染器保持编辑状态
          this.initCanvasRendererForEdit(sheetId, notationIndex, null);
        } else if (isCollapsed) {
          // collapsed模式
          this.initCanvasRenderer(sheetId, notationIndex);
        } else {
          // 非collapsed模式（Canvas常驻）
          this.initCanvasRendererForModule(sheetId, notationIndex);
        }
      }, 100);
    });
    
    wx.showToast({ title: '已插入空行', icon: 'success' });
  },
  
  // 删除行：弹窗确认后删除当前选中位置的整行
  deleteRow() {
    const { editing, canvasEditing, notations } = this.data;
    const currentEditing = editing || canvasEditing;
    if (!currentEditing) {
      wx.showToast({ title: '请先选中一个音符位', icon: 'none' });
      return;
    }

    // 统一获取编辑位置信息 - 使用 ?? 避免 0 被误判为 falsy
    const sheetId = currentEditing.sheet ?? currentEditing.notationId;
    const measureIdx = currentEditing.measure ?? currentEditing.measureIndex ?? 0;
    
    const notationIndex = notations.findIndex(n => n.id === sheetId);
    if (notationIndex === -1) {
      wx.showToast({ title: '未找到谱面', icon: 'none' });
      return;
    }

    const notation = notations[notationIndex];
    const measuresPerRow = this.getMeasuresPerRowForNotation(notation) || 1;
    
    // 计算当前行的起始索引
    const currentRowIndex = Math.floor(measureIdx / measuresPerRow);
    const rowStartIndex = currentRowIndex * measuresPerRow;
    const rowEndIndex = Math.min(rowStartIndex + measuresPerRow, notation.measures.length);
    const measuresInRow = rowEndIndex - rowStartIndex;
    
    // 检查是否是最后一行且模块只有一行
    if (notation.measures.length <= measuresInRow) {
      wx.showToast({ title: '至少保留一行', icon: 'none' });
      return;
    }
    
    // 保存待删除信息并显示确认弹窗
    this.setData({
      showDeleteRowModal: true,
      pendingDeleteRowInfo: {
        notationIndex,
        rowStartIndex,
        measuresPerRow: measuresInRow,
        isCollapsed: notation.collapsed,
        sheetId: sheetId
      }
    });
  },
  
  // 关闭删除行确认弹窗
  closeDeleteRowModal() {
    this.setData({
      showDeleteRowModal: false,
      pendingDeleteRowInfo: null
    });
  },
  
  // 确认删除行
  confirmDeleteRow() {
    const { pendingDeleteRowInfo, notations, canvasEditing } = this.data;
    if (!pendingDeleteRowInfo) {
      this.closeDeleteRowModal();
      return;
    }
    
    // 先备份当前状态（用于撤销）
    const snapshotAction = this.createFullSnapshotAction('删除行');
    this.backupCurrentState(snapshotAction);
    
    const { notationIndex, rowStartIndex, measuresPerRow, isCollapsed, sheetId } = pendingDeleteRowInfo;
    const notation = this.deepCloneNotation(notations[notationIndex]);
    
    // 【任务1】删除行时先清理该行的占位拍
    const rowEndIndex = Math.min(rowStartIndex + measuresPerRow, notation.measures.length);
    this.removeRowPlaceholders(notation, rowStartIndex, rowEndIndex);
    
    // 删除指定行的小节
    notation.measures.splice(rowStartIndex, measuresPerRow);
    
    // 更新notations
    const updatedNotations = [...notations];
    updatedNotations[notationIndex] = notation;
    const withOffsets = this.updateMeasureOffsets(updatedNotations);
    
    // 【Bug修复】删除行后需要重新计算Canvas高度（无论是否collapsed）
    const newHeight = this.calculateCanvasHeight(notation);
    withOffsets[notationIndex] = {
      ...withOffsets[notationIndex],
      canvasHeight: newHeight,
      tempImagePath: null // 清除缓存的图片，强制重绘
    };
    
    this.saveNotationsScoped(withOffsets);
    this.markNotationChanged(); // 标记为有更改
    
    // 清除编辑状态和关闭弹窗
    this.setData({
      notations: withOffsets,
      editing: null,
      editingValue: '',
      canvasEditing: null,
      canvasEditingValue: '',
      canvasUseNativeInput: false,
      showVirtualKeyboard: false,
      showDeleteRowModal: false,
      pendingDeleteRowInfo: null
    }, () => {
      this.calculatePages();
      
      // 【Bug修复】Canvas模式下：需要销毁旧渲染器并重新初始化（因为Canvas尺寸变化）
      setTimeout(() => {
        // 销毁旧渲染器
        if (this._canvasRenderers && this._canvasRenderers[sheetId]) {
          this._canvasRenderers[sheetId].destroy();
          delete this._canvasRenderers[sheetId];
        }
        
        // 重新初始化渲染器
        if (isCollapsed) {
          // collapsed模式
          this.initCanvasRenderer(sheetId, notationIndex);
        } else {
          // 非collapsed模式（Canvas常驻）
          this.initCanvasRendererForModule(sheetId, notationIndex);
        }
      }, 100);
    });
    
    wx.showToast({ title: '已删除行', icon: 'success' });
  },
  
  // 音高增加
  pitchUp() {
    const { editingValue, superscriptMode, superscriptContent } = this.data;
    
    // 如果在上标模式中，调整上标内容的音高
    if (superscriptMode) {
      let newContent = superscriptContent || '';
      if (newContent.includes(',')) {
        newContent = newContent.replace(',', '');
      } else {
        newContent += "'";
      }
      this.setData({ superscriptContent: newContent });
      this.updateSuperscriptDisplay();
      return;
    }
    
    // 检查是否有内容
    let newValue = editingValue || '';
    if (!newValue || newValue === '' || newValue === '-') {
      wx.showToast({ title: '请先输入主音符', icon: 'none' });
      return;
    }
    
    // 解析音符，处理上标情况
    // 如果有右上标 ^{...}，优先调整主音符
    const superscriptMatch = newValue.match(/^(.+?)(\^?\{[^}]*\})$/);
    let mainPart = newValue;
    let suffixPart = '';
    
    if (superscriptMatch) {
      mainPart = superscriptMatch[1];
      suffixPart = superscriptMatch[2];
    }
    
    // 调整主音符的音高
    if (mainPart.includes(',')) {
      mainPart = mainPart.replace(',', '');
    } else {
      mainPart += "'";
    }
    
    newValue = mainPart + suffixPart;
    this.updateEditingValue(newValue);
  },
  
  // 音高降低
  pitchDown() {
    const { editingValue, superscriptMode, superscriptContent } = this.data;
    
    // 如果在上标模式中，调整上标内容的音高
    if (superscriptMode) {
      let newContent = superscriptContent || '';
      if (newContent.includes("'")) {
        newContent = newContent.replace("'", '');
      } else {
        newContent += ',';
      }
      this.setData({ superscriptContent: newContent });
      this.updateSuperscriptDisplay();
      return;
    }
    
    // 检查是否有内容
    let newValue = editingValue || '';
    if (!newValue || newValue === '' || newValue === '-') {
      wx.showToast({ title: '请先输入主音符', icon: 'none' });
      return;
    }
    
    // 解析音符，处理上标情况
    const superscriptMatch = newValue.match(/^(.+?)(\^?\{[^}]*\})$/);
    let mainPart = newValue;
    let suffixPart = '';
    
    if (superscriptMatch) {
      mainPart = superscriptMatch[1];
      suffixPart = superscriptMatch[2];
    }
    
    // 调整主音符的音高
    if (mainPart.includes("'")) {
      mainPart = mainPart.replace("'", '');
    } else {
      mainPart += ',';
    }
    
    newValue = mainPart + suffixPart;
    this.updateEditingValue(newValue);
  },
  
  // 音高复原（保留供外部调用，但胶囊调节器使用setPitchLevel）
  pitchReset() {
    this.setPitchLevel(2); // 设为原音档位
  },

  // ========== 胶囊音高调节器相关 ==========
  
  /**
   * 设置音高档位并应用到当前编辑的音符
   * @param {number} level 档位 0-4: 倍低音、低音、原音、高音、倍高音
   */
  async setPitchLevel(level) {
    // 边界检查
    if (level < 0) level = 0;
    if (level > 4) level = 4;

    const { editingValue, superscriptMode, superscriptContent, pitchLevel: prevLevel,
            conversionEditingKey, conversionEditingField, virtualKeyboardDisplay,
            newTableEditingIndex, newTableEditingField,
            audioMappingEditingIndex, audioMappingEditingField } = this.data;

    // 如果档位没变化，不做处理
    if (level === prevLevel) return;

    // 更新档位显示
    this.setData({
      pitchLevel: level,
      pitchToastVisible: true
    });

    // 显示toast提示
    this.showPitchToast();

    // 计算相对于原音(level=2)的音高偏移
    const offset = level - 2;

    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;

    // 如果在新建音频转换表编辑模式中，调整表中的值
    const { newAudioTableEditingIndex, newAudioTableEditingField } = this.data;
    if (newAudioTableEditingIndex !== null && newAudioTableEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;

      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }

      const updatedData = [...this.data.newAudioMappingTableData];
      updatedData[newAudioTableEditingIndex] = {
        ...updatedData[newAudioTableEditingIndex],
        [newAudioTableEditingField]: newValue
      };

      if (newAudioTableEditingField === 'simplified') {
        const newSpn = this.calculateSpnFromSimplifiedWithRoot(newValue, this.data.newAudioTableRootNote);
        updatedData[newAudioTableEditingIndex].spn = newSpn;
        updatedData[newAudioTableEditingIndex].hasAudio = checkHasAudio(newSpn);
      }

      this.setData({
        newAudioMappingTableData: updatedData,
        virtualKeyboardDisplay: newValue,
        virtualKeyboardRendered: this.renderNoteForDisplay(newValue),
        vkParsed: this.parseNoteForVK(newValue)
      });
      return;
    }

    // 如果在音频映射弹窗编辑模式中，调整映射表中的值
    if (audioMappingEditingIndex !== null && audioMappingEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;

      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }

      const updatedMappings = [...this.data.audioMappings];
      updatedMappings[audioMappingEditingIndex] = {
        ...updatedMappings[audioMappingEditingIndex],
        [audioMappingEditingField]: newValue
      };

      if (audioMappingEditingField === 'simplified') {
        const newSpn = this.calculateSpnFromSimplified(newValue);
        updatedMappings[audioMappingEditingIndex].spn = newSpn;
        updatedMappings[audioMappingEditingIndex].hasAudio = checkHasAudio(newSpn);
      }

      this.setData({
        audioMappings: updatedMappings,
        virtualKeyboardDisplay: newValue,
        virtualKeyboardRendered: this.renderNoteForDisplay(newValue),
        vkParsed: this.parseNoteForVK(newValue)
      });
      return;
    }
    
    // 如果在转换弹窗编辑模式中，调整转换表中的值
    if (conversionEditingKey !== null && conversionEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      // 移除音高符号，然后根据档位添加新的
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;
      
      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }
      
      // 更新转换表映射
      const mappingIndex = this.data.conversionMappings.findIndex(m => m.key === conversionEditingKey);
      if (mappingIndex !== -1) {
        const updatedMappings = [...this.data.conversionMappings];
        updatedMappings[mappingIndex] = {
          ...updatedMappings[mappingIndex],
          [conversionEditingField]: newValue
        };
        
        // 如果编辑的是simplified字段，需要重新计算SPN
        if (conversionEditingField === 'simplified') {
          updatedMappings[mappingIndex].spn = this.simplifiedToSPN(newValue);
        }
        updatedMappings[mappingIndex].value = updatedMappings[mappingIndex].simplified;
        
        const hasEmpty = updatedMappings.some(m => !m.simplified || m.simplified.trim() === '');
        
        this.setData({
          conversionMappings: updatedMappings,
          virtualKeyboardDisplay: newValue,
          hasEmptyConversionMapping: hasEmpty
        });
      }
      return;
    }
    
    // 如果在新建转换表编辑模式中，调整新建表中的值
    if (newTableEditingIndex !== null && newTableEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      // 移除音高符号，然后根据档位添加新的
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;
      
      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }
      
      // 更新新建转换表数据
      const updatedData = [...this.data.newConversionTableData];
      updatedData[newTableEditingIndex] = {
        ...updatedData[newTableEditingIndex],
        [newTableEditingField]: newValue
      };
      
      // 如果编辑的是simplified字段，需要重新计算SPN（使用新建表的独立首调）
      if (newTableEditingField === 'simplified') {
        updatedData[newTableEditingIndex].spn = this.calculateSpnFromSimplifiedWithRoot(newValue, this.data.newTableRootNote);
      }
      
      this.setData({
        newConversionTableData: updatedData,
        virtualKeyboardDisplay: newValue
      });
      return;
    }
    
    // 如果在上标模式中，调整上标内容的音高
    if (superscriptMode) {
      // 解析上标内容，提取基础音符部分（保留下划线）
      const supParsed = this.parseSupContent(superscriptContent || '');
      let baseContent = supParsed.baseNote; // 只保留基础音符
      let hasUnderline = (superscriptContent || '').includes('_');
      
      // 根据新档位构建上标内容：基础音符 + 音高符号 + 下划线
      let newContent = baseContent;
      if (offset > 0) {
        newContent += "'".repeat(offset);
      } else if (offset < 0) {
        newContent += ','.repeat(-offset);
      }
      if (hasUnderline) {
        newContent += '_';
      }
      
      this.setData({ superscriptContent: newContent });
      this.updateSuperscriptDisplay();
      return;
    }
    
    // 处理主音符 - 使用 parseNoteForVK 正确解析，保持上标内容不变
    // 获取当前编辑值（兼容Canvas模式和View模式）
    const { canvasEditing, canvasEditingValue } = this.data;
    let currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    
    if (!currentValue || currentValue === '' || currentValue === '-') {
      return; // 没有内容时只更新档位显示
    }
    
    // 使用标准解析函数解析音符结构
    const parsed = this.parseNoteForVK(currentValue);
    
    // 只修改主音符的音高，保持上标内容完全不变
    parsed.octaveUp = offset > 0 ? offset : 0;
    parsed.octaveDown = offset < 0 ? -offset : 0;
    
    // 重建完整值：左上标 + 主音符（基础音符+音高+下划线） + 右上标
    let reconstructed = '';
    if (parsed.leftSup !== null) {
      reconstructed = '^{' + parsed.leftSup + '}';
    }
    reconstructed += this.buildMainPart(parsed);
    if (parsed.rightSup !== null) {
      reconstructed += '^{' + parsed.rightSup + '}';
    }
    
    // 使用统一的更新函数（同时处理View模式和Canvas模式）
    this.updateEditingValue(reconstructed);
  },

  /**
   * 显示音高提示toast
   */
  showPitchToast() {
    // 清除之前的定时器
    if (this._pitchToastTimer) {
      clearTimeout(this._pitchToastTimer);
    }
    
    this.setData({ pitchToastVisible: true });
    
    // 1秒后隐藏
    this._pitchToastTimer = setTimeout(() => {
      this.setData({ pitchToastVisible: false });
    }, 1000);
  },

  /**
   * 音高调节器向上按钮点击
   */
  pitchUp() {
    const { pitchLevel } = this.data;
    if (pitchLevel < 4) {
      wx.vibrateShort({ type: 'light' });
      this.setPitchLevel(pitchLevel + 1);
    }
  },

  /**
   * 音高调节器向下按钮点击
   */
  pitchDown() {
    const { pitchLevel } = this.data;
    if (pitchLevel > 0) {
      wx.vibrateShort({ type: 'light' });
      this.setPitchLevel(pitchLevel - 1);
    }
  },

  /**
   * 音高调节器拖动开始
   */
  onPitchTouchStart(e) {
    // 初始化拖动进度为当前档位对应的位置
    const currentProgress = this.pitchLevelToProgress(this.data.pitchLevel);
    this.setData({ 
      pitchDragging: true,
      pitchDragProgress: currentProgress
    });
    // 记录轨道信息用于后续拖动
    this._initPitchTrackRect(e);
  },

  /**
   * 音高调节器拖动中 - 实时跟随手指，不做吸附
   */
  onPitchTouchMove(e) {
    if (!this.data.pitchDragging) return;
    
    const touch = e.touches[0];
    if (!this._pitchTrackRect) {
      this._initPitchTrackRect(e);
      return;
    }
    
    const rect = this._pitchTrackRect;
    const trackTop = rect.top;
    const trackHeight = rect.height;
    const touchY = touch.clientY;
    
    // 计算相对位置（从底部算起），转换为百分比
    const relativeY = touchY - trackTop;
    let progress = ((trackHeight - relativeY) / trackHeight) * 100;
    
    // 限制范围 20-100 (对应5个档位的显示高度)
    if (progress < 20) progress = 20;
    if (progress > 100) progress = 100;
    
    // 实时更新进度条高度（不吸附）
    this.setData({ pitchDragProgress: progress });
    
    // 计算预览档位，用于实时显示档位提示（拖动时不震动）
    const previewLevel = this.progressToPitchLevel(progress);
    if (this._lastPreviewLevel !== previewLevel) {
      this._lastPreviewLevel = previewLevel;
      // 实时显示档位提示
      this.setData({ 
        pitchLevel: previewLevel,
        pitchToastVisible: true 
      });
    }
  },

  /**
   * 音高调节器拖动结束 - 弹性吸附到最近档位
   */
  onPitchTouchEnd() {
    if (!this.data.pitchDragging) return;
    
    const { pitchDragProgress } = this.data;
    
    // 计算最近的档位
    const targetLevel = this.progressToPitchLevel(pitchDragProgress);
    const targetProgress = this.pitchLevelToProgress(targetLevel);
    
    // 吸附到档位时震动反馈
    wx.vibrateShort({ type: 'light' });
    
    // 弹性动画吸附到目标位置
    this.setData({ 
      pitchDragging: false,
      pitchDragProgress: targetProgress,
      pitchLevel: targetLevel
    });
    
    // 应用档位到音符
    this.applyPitchLevelToNote(targetLevel);
    
    // 清理
    this._pitchTrackRect = null;
    this._lastPreviewLevel = null;
    
    // 显示提示
    this.showPitchToast();
  },

  /**
   * 初始化轨道位置信息
   */
  _initPitchTrackRect(e) {
    const query = wx.createSelectorQuery().in(this);
    query.select('.pitch-capsule-track').boundingClientRect((rect) => {
      if (rect) {
        this._pitchTrackRect = rect;
      }
    }).exec();
  },

  /**
   * 将进度百分比转换为档位 (0-4)
   * 进度 20% = 档位0, 40% = 档位1, 60% = 档位2, 80% = 档位3, 100% = 档位4
   */
  progressToPitchLevel(progress) {
    // 进度范围 20-100 映射到档位 0-4
    const normalized = (progress - 20) / 80; // 0-1
    const level = Math.round(normalized * 4);
    return Math.max(0, Math.min(4, level));
  },

  /**
   * 将档位转换为进度百分比
   * 档位0 = 20%, 档位1 = 40%, 档位2 = 60%, 档位3 = 80%, 档位4 = 100%
   */
  pitchLevelToProgress(level) {
    return 20 + level * 20;
  },

  /**
   * 将档位应用到当前编辑的音符（提取自 setPitchLevel）
   */
  applyPitchLevelToNote(level) {
    const { editingValue, superscriptMode, superscriptContent, 
            canvasEditing, canvasEditingValue,
            conversionEditingKey, conversionEditingField, virtualKeyboardDisplay,
            newTableEditingIndex, newTableEditingField,
            audioMappingEditingIndex, audioMappingEditingField } = this.data;
    
    // 计算相对于原音(level=2)的音高偏移
    const offset = level - 2;
    
    // 如果在新建音频转换表编辑模式中
    const { newAudioTableEditingIndex, newAudioTableEditingField } = this.data;
    if (newAudioTableEditingIndex !== null && newAudioTableEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;
      
      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }
      
      this.handleNewAudioTablePitchChange(newValue);
      return;
    }
    
    // 如果在音频映射编辑模式中
    if (audioMappingEditingIndex !== null && audioMappingEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;
      
      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }
      
      this.handleAudioMappingPitchChange(newValue);
      return;
    }
    
    // 如果在转换弹窗编辑模式中
    if (conversionEditingKey !== null && conversionEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;
      
      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }
      
      this.handleConversionPitchChange(newValue);
      return;
    }
    
    // 如果在新建转换表编辑模式中
    if (newTableEditingIndex !== null && newTableEditingField !== null) {
      const currentValue = virtualKeyboardDisplay || '';
      let basePart = currentValue.replace(/['',]+/g, '');
      let newValue = basePart;
      
      if (offset > 0) {
        newValue = basePart + "'".repeat(offset);
      } else if (offset < 0) {
        newValue = basePart + ','.repeat(-offset);
      }
      
      this.handleNewTablePitchChange(newValue);
      return;
    }
    
    // 如果在上标模式中
    if (superscriptMode) {
      let basePart = (superscriptContent || '').replace(/['',_]+/g, '');
      let hasUnderline = (superscriptContent || '').includes('_');
      let newContent = basePart;
      
      if (offset > 0) {
        newContent += "'".repeat(offset);
      } else if (offset < 0) {
        newContent += ','.repeat(-offset);
      }
      if (hasUnderline) {
        newContent += '_';
      }
      
      this.setData({ superscriptContent: newContent });
      this.updateSuperscriptDisplay();
      return;
    }
    
    // 获取当前编辑值（兼容Canvas模式和View模式）
    const currentValue = canvasEditing ? canvasEditingValue : editingValue;
    if (!currentValue || currentValue === '' || currentValue === '-') {
      return; // 无内容时不处理
    }
    
    // 解析当前音符
    const parsed = this.parseNoteForVK(currentValue);
    
    // 应用新的音高偏移
    if (offset > 0) {
      parsed.octaveUp = offset;
      parsed.octaveDown = 0;
    } else if (offset < 0) {
      parsed.octaveUp = 0;
      parsed.octaveDown = -offset;
    } else {
      parsed.octaveUp = 0;
      parsed.octaveDown = 0;
    }
    
    // 重建完整值
    let reconstructed = '';
    if (parsed.leftSup !== null) {
      reconstructed = '^{' + parsed.leftSup + '}';
    }
    reconstructed += this.buildMainPart(parsed);
    if (parsed.rightSup !== null) {
      reconstructed += '^{' + parsed.rightSup + '}';
    }
    
    this.updateEditingValue(reconstructed);
  },

  /**
   * 根据当前编辑的音符值反推音高档位
   * 在打开虚拟键盘或切换音符时调用
   * @param {string} [valueOverride] 若传入，则用此值反推档位（避免 setData 未生效时读到旧值）
   */
  updatePitchLevelFromNote(valueOverride) {
    const { editingValue, canvasEditing, canvasEditingValue, superscriptMode, superscriptContent } = this.data;
    
    let octaveUp = 0;
    let octaveDown = 0;

    if (typeof valueOverride === 'string') {
      // 调用方刚写入的值，直接用来反推
      const parsed = this.parseNoteForVK(valueOverride);
      octaveUp = parsed.octaveUp;
      octaveDown = parsed.octaveDown;
    } else if (superscriptMode) {
      // 在上标编辑模式下，根据上标内容反推档位
      const supParsed = this.parseSupContent(superscriptContent || '');
      octaveUp = supParsed.octaveUp;
      octaveDown = supParsed.octaveDown;
    } else {
      // 在主音符模式下，解析完整字符串并提取主音符部分的音高符号
      // Canvas 模式使用 canvasEditingValue，View 模式使用 editingValue
      const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
      const parsed = this.parseNoteForVK(currentValue);
      octaveUp = parsed.octaveUp;
      octaveDown = parsed.octaveDown;
    }
    
    // 计算净偏移
    const netOffset = octaveUp - octaveDown;
    
    // 映射到档位（-2到+2映射为0到4）
    let level = 2 + netOffset;
    if (level < 0) level = 0;
    if (level > 4) level = 4;
    
    this.setData({ pitchLevel: level });
  },
  
  // 更新上标模式下的显示
  updateSuperscriptDisplay() {
    const { superscriptMode, superscriptContent, editingValue, canvasEditing, canvasEditingValue } = this.data;
    
    // Canvas 模式用 canvasEditingValue 保留主音符，View 模式用 editingValue
    const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    const parsed = this.parseNoteForVK(currentValue);
    
    // 根据上标模式更新解析结果，同时解析上标内容的音高信息
    if (superscriptMode === 'right') {
      parsed.rightSup = superscriptContent;
      const supParsed = this.parseSupContent(superscriptContent || '');
      parsed.rightSupBase = supParsed.baseNote;
      parsed.rightSupOctaveUp = supParsed.octaveUp;
      parsed.rightSupOctaveDown = supParsed.octaveDown;
    } else if (superscriptMode === 'left') {
      parsed.leftSup = superscriptContent;
      const supParsed = this.parseSupContent(superscriptContent || '');
      parsed.leftSupBase = supParsed.baseNote;
      parsed.leftSupOctaveUp = supParsed.octaveUp;
      parsed.leftSupOctaveDown = supParsed.octaveDown;
    }
    
    // 构建显示字符串
    let display = '';
    if (parsed.leftSup !== null) {
      display += '^{' + parsed.leftSup + '}';
    }
    display += this.buildMainPart(parsed);
    if (parsed.rightSup !== null) {
      display += '^{' + parsed.rightSup + '}';
    }
    
    this.setData({
      virtualKeyboardDisplay: display,
      vkParsed: parsed
    });
    if (canvasEditing) {
      this.setData({ canvasEditingValue: display });
    }
  },
  
  // 切换下划线（添加/移除）
  addUnderline() {
    const { editingValue, canvasEditing, canvasEditingValue, superscriptMode, superscriptContent } = this.data;
    
    // 如果在上标模式中，切换上标内容的下划线
    if (superscriptMode) {
      // 解析上标内容，确保下划线在最右侧
      const supParsed = this.parseSupContent(superscriptContent || '');
      let hasUnderline = (superscriptContent || '').includes('_');
      
      // 重建上标内容：基础音符 + 音高符号 + 下划线（切换）
      let newContent = supParsed.baseNote;
      if (supParsed.octaveUp > 0) {
        newContent += "'".repeat(supParsed.octaveUp);
      } else if (supParsed.octaveDown > 0) {
        newContent += ','.repeat(supParsed.octaveDown);
      }
      // 切换下划线：有则移除，无则添加
      if (!hasUnderline) {
        newContent += '_';
      }
      // hasUnderline 时不添加 '_'，即移除下划线
      
      this.setData({ superscriptContent: newContent });
      this.updateSuperscriptDisplay();
      return;
    }
    
    // 获取当前编辑值（兼容Canvas模式和View模式）
    let newValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    
    // 检查是否有内容
    if (!newValue || newValue === '' || newValue === '-') {
      wx.showToast({ title: '请先输入主音符', icon: 'none' });
      return;
    }
    
    // 使用标准解析函数解析音符结构
    const parsed = this.parseNoteForVK(newValue);
    
    // 切换下划线：有则移除，无则添加
    parsed.underline = !parsed.underline;
    
    // 重建完整值：左上标 + 主音符（基础音符+音高+下划线） + 右上标
    let reconstructed = '';
    if (parsed.leftSup !== null) {
      reconstructed = '^{' + parsed.leftSup + '}';
    }
    reconstructed += this.buildMainPart(parsed);
    if (parsed.rightSup !== null) {
      reconstructed += '^{' + parsed.rightSup + '}';
    }
    
    this.updateEditingValue(reconstructed);
  },
  
  // 插入备注到当前音符列上方
  insertNoteAnnotation() {
    const { notations } = this.data;
    
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) {
      wx.showToast({ title: '请先选择音符位', icon: 'none' });
      return;
    }
    
    const { sheet, measure, beat, subdivision } = editInfo;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;
    
    // 获取当前subdivision
    const currentMeasure = notation.measures[measure];
    const currentBeat = currentMeasure?.beats?.[beat];
    const currentSubdivision = currentBeat?.subdivisions?.[subdivision];
    
    if (!currentSubdivision) return;
    
    // 检查当前是否已有备注
    const currentAnnotation = currentSubdivision.annotation || '';
    
    // 显示自定义模态框
    this.setData({
      showAnnotationModal: true,
      annotationModalMode: 'add',
      currentAnnotation: {
        sheet: sheet,
        measure: measure,
        beat: beat,
        subdivision: subdivision,
        text: currentAnnotation,
        isCanvas: editInfo.isCanvas,
        notationIndex: editInfo.notationIndex
      }
    });
  },
  
  // 编辑现有备注
  editAnnotation(e) {
    const { sheet, measure, beat, subdivision } = e.currentTarget.dataset;
    const { notations } = this.data;
    
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;
    
    const currentMeasure = notation.measures[measure];
    const currentBeat = currentMeasure?.beats?.[beat];
    const currentSubdivision = currentBeat?.subdivisions?.[subdivision];
    
    if (!currentSubdivision) return;
    
    const currentAnnotation = currentSubdivision.annotation || '';
    
    this.setData({
      showAnnotationModal: true,
      annotationModalMode: 'edit',
      currentAnnotation: {
        sheet: sheet,
        measure: measure,
        beat: beat,
        subdivision: subdivision,
        text: currentAnnotation
      }
    });
  },
  
  // 确认备注输入
  confirmAnnotation() {
    const { currentAnnotation, notations } = this.data;
    const newAnnotation = (currentAnnotation.text || '').trim();
    const isCanvas = currentAnnotation.isCanvas;
    const notationIndex = currentAnnotation.notationIndex;
    const sheetId = currentAnnotation.sheet;
    
    const notationsClone = JSON.parse(JSON.stringify(notations));
    const targetNotation = notationsClone.find(n => n.id === sheetId);
    
    if (targetNotation) {
      const targetSubdivision = targetNotation.measures[currentAnnotation.measure]?.beats?.[currentAnnotation.beat]?.subdivisions?.[currentAnnotation.subdivision];
      if (targetSubdivision) {
        if (newAnnotation) {
          targetSubdivision.annotation = newAnnotation;
        } else {
          // 如果输入为空，删除备注字段
          delete targetSubdivision.annotation;
        }
        
        this.setData({ 
          notations: notationsClone,
          showAnnotationModal: false,
          annotationModalMode: 'add',
          currentAnnotation: { sheet: null, measure: null, beat: null, subdivision: null, text: '', isCanvas: false, notationIndex: null }
        });
        this.markNotationChanged();
        
        // 如果是 Canvas 模式，需要重新渲染
        if (isCanvas && notationIndex !== null && notationIndex !== undefined) {
          setTimeout(() => {
            // 【优化】如果正在Canvas编辑模式，使用编辑模式渲染器保持编辑状态
            if (this.data.canvasEditing) {
              this.initCanvasRendererForEdit(sheetId, notationIndex, null);
            } else {
              this.initCanvasRenderer(sheetId, notationIndex);
            }
          }, 50);
        }
        
        if (newAnnotation) {
          wx.showToast({ title: '注记已更新', icon: 'success' });
        } else {
          wx.showToast({ title: '注记已清除', icon: 'none' });
        }
      }
    }
  },
  
  // 取消备注输入
  cancelAnnotation() {
    this.setData({
      showAnnotationModal: false,
      annotationModalMode: 'add',
      currentAnnotation: { sheet: null, measure: null, beat: null, subdivision: null, text: '' }
    });
  },
  
  // 更新备注输入
  updateAnnotationText(e) {
    const text = e.detail.value;
    this.setData({
      'currentAnnotation.text': text
    });
  },
  
  // 处理备注输入框失去焦点
  onAnnotationBlur(e) {
    // 移除自动清除逻辑，只在确认/取消时处理
  },
  
  // 复制当前音符位的底层源代码
  copyCurrentNote() {
    const { editingValue } = this.data;
    
    if (!editingValue || editingValue === '' || editingValue === '-') {
      wx.showToast({ title: '当前音符为空', icon: 'none' });
      return;
    }
    
    // 保存到虚拟剪贴板
    this.setData({ vkClipboard: editingValue });
    
    wx.showToast({ 
      title: '已复制', 
      icon: 'success',
      duration: 1000
    });
  },
  
  // 粘贴音符
  pasteNote() {
    const { vkClipboard } = this.data;
    
    if (!vkClipboard) {
      wx.showToast({ title: '剪贴板为空', icon: 'none' });
      return;
    }
    
    // 粘贴到当前编辑位置
    this.updateEditingValue(vkClipboard);
    
    wx.showToast({ 
      title: '已粘贴', 
      icon: 'success',
      duration: 1000
    });
  },
  
  // 切换左上标模式
  toggleLeftSuperscript() {
    const { superscriptMode, editingValue, canvasEditing, canvasEditingValue, superscriptContent } = this.data;
    
    if (superscriptMode === 'left') {
      // 已经在左上标模式，完成并退出
      this.completeSuperscript();
    } else {
      // 获取当前编辑值（兼容Canvas模式和View模式）
      const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
      
      // 解析当前值，提取已有的左上标
      const parsed = this.parseNoteForVK(currentValue);
      
      // 检查是否已有主音符
      if (!parsed.baseNote || parsed.baseNote === '' || parsed.baseNote === '-') {
        wx.showToast({ title: '请先输入主音符', icon: 'none' });
        return;
      }
      
      // 进入左上标模式
      this.setData({
        superscriptMode: 'left',
        superscriptContent: parsed.leftSup || '',
        virtualKeyboardDisplay: '^{' + (parsed.leftSup || '') + '}' + this.buildMainPart(parsed) + (parsed.rightSup !== null ? '^{' + parsed.rightSup + '}' : '')
      });
      this.updateVkParsedForSuperscript('left');
      
      // 同步更新音高档位（基于上标内容）
      this.updatePitchLevelFromNote();
    }
  },
  
  // 切换右上标模式
  toggleRightSuperscript() {
    const { superscriptMode, editingValue, canvasEditing, canvasEditingValue, superscriptContent } = this.data;
    
    if (superscriptMode === 'right') {
      // 已经在右上标模式，完成并退出
      this.completeSuperscript();
    } else {
      // 获取当前编辑值（兼容Canvas模式和View模式）
      const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
      
      // 解析当前值，提取已有的右上标
      const parsed = this.parseNoteForVK(currentValue);
      
      // 检查是否已有主音符
      if (!parsed.baseNote || parsed.baseNote === '' || parsed.baseNote === '-') {
        wx.showToast({ title: '请先输入主音符', icon: 'none' });
        return;
      }
      
      // 进入右上标模式
      this.setData({
        superscriptMode: 'right',
        superscriptContent: parsed.rightSup || '',
        virtualKeyboardDisplay: (parsed.leftSup !== null ? '^{' + parsed.leftSup + '}' : '') + this.buildMainPart(parsed) + '^{' + (parsed.rightSup || '') + '}'
      });
      this.updateVkParsedForSuperscript('right');
      
      // 同步更新音高档位（基于上标内容）
      this.updatePitchLevelFromNote();
    }
  },
  
  // 构建主音符部分字符串
  buildMainPart(parsed) {
    return parsed.baseNote + "'".repeat(parsed.octaveUp) + ",".repeat(parsed.octaveDown) + (parsed.underline ? '_' : '');
  },
  
  // 更新vkParsed用于上标模式显示
  updateVkParsedForSuperscript(mode) {
    const { editingValue, canvasEditing, canvasEditingValue, superscriptContent } = this.data;
    // 获取当前编辑值（兼容Canvas模式和View模式）
    const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    const parsed = this.parseNoteForVK(currentValue);
    
    if (mode === 'left') {
      parsed.leftSup = superscriptContent;
    } else if (mode === 'right') {
      parsed.rightSup = superscriptContent;
    }
    
    this.setData({ vkParsed: parsed });
  },
  
  // 右上标（兼容旧方法）
  rightSuperscript() {
    this.toggleRightSuperscript();
  },
  
  // 左上标（兼容旧方法）
  leftSuperscript() {
    this.toggleLeftSuperscript();
  },
  
  // 处理上标输入
  handleSuperscriptInput(key) {
    const { superscriptContent, superscriptMode, editingValue, canvasEditing, canvasEditingValue } = this.data;
    const newContent = (superscriptContent || '') + key;
    // Canvas 模式用 canvasEditingValue 保留主音符，View 模式用 editingValue
    const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    const parsed = this.parseNoteForVK(currentValue);
    
    // 解析新上标内容的音高信息
    const supParsed = this.parseSupContent(newContent);
    
    if (superscriptMode === 'right') {
      parsed.rightSup = newContent;
      parsed.rightSupBase = supParsed.baseNote;
      parsed.rightSupOctaveUp = supParsed.octaveUp;
      parsed.rightSupOctaveDown = supParsed.octaveDown;
      this.setData({
        superscriptContent: newContent,
        virtualKeyboardDisplay: (parsed.leftSup !== null ? '^{' + parsed.leftSup + '}' : '') + this.buildMainPart(parsed) + '^{' + newContent + '}',
        virtualKeyboardRendered: this.renderNoteForDisplay((parsed.leftSup !== null ? '^{' + parsed.leftSup + '}' : '') + this.buildMainPart(parsed) + '^{' + newContent + '}'),
        vkParsed: parsed
      });
    } else if (superscriptMode === 'left') {
      parsed.leftSup = newContent;
      parsed.leftSupBase = supParsed.baseNote;
      parsed.leftSupOctaveUp = supParsed.octaveUp;
      parsed.leftSupOctaveDown = supParsed.octaveDown;
      this.setData({
        superscriptContent: newContent,
        virtualKeyboardDisplay: '^{' + newContent + '}' + this.buildMainPart(parsed) + (parsed.rightSup !== null ? '^{' + parsed.rightSup + '}' : ''),
        virtualKeyboardRendered: this.renderNoteForDisplay('^{' + newContent + '}' + this.buildMainPart(parsed) + (parsed.rightSup !== null ? '^{' + parsed.rightSup + '}' : '')),
        vkParsed: parsed
      });
    }
    
    // Canvas 模式下保持「逻辑完整值」在 canvasEditingValue，便于完成上标时写入谱面
    if (canvasEditing) {
      const fullValue = superscriptMode === 'right'
        ? (parsed.leftSup !== null ? '^{' + parsed.leftSup + '}' : '') + this.buildMainPart(parsed) + '^{' + newContent + '}'
        : '^{' + newContent + '}' + this.buildMainPart(parsed) + (parsed.rightSup !== null ? '^{' + parsed.rightSup + '}' : '');
      this.setData({ canvasEditingValue: fullValue });
    }
  },
  
  // 完成上标输入
  completeSuperscript() {
    const { superscriptMode, superscriptContent, editingValue, canvasEditing, canvasEditingValue } = this.data;
    // Canvas 模式用 canvasEditingValue 保留主音符，View 模式用 editingValue
    const currentValue = canvasEditing ? (canvasEditingValue || '') : (editingValue || '');
    const parsed = this.parseNoteForVK(currentValue);
    
    // 更新上标内容
    if (superscriptMode === 'right') {
      parsed.rightSup = superscriptContent;
    } else if (superscriptMode === 'left') {
      parsed.leftSup = superscriptContent;
    }
    
    // 重建完整值
    let newValue = '';
    if (parsed.leftSup !== null) {
      newValue = '^{' + parsed.leftSup + '}';
    }
    newValue += this.buildMainPart(parsed);
    if (parsed.rightSup !== null) {
      newValue += '^{' + parsed.rightSup + '}';
    }
    
    this.setData({
      superscriptMode: null,
      superscriptContent: ''
    });
    
    // 用统一接口写回，兼容 View / Canvas
    this.updateEditingValue(newValue);
    if (!canvasEditing) {
      this.prevEditingValue = newValue;
    }
  },
  
  // 确认输入并关闭键盘
  confirmAndClose() {
    const { editing, canvasEditing } = this.data;
    
    // 如果在上标模式中，先完成上标
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    // 提交编辑
    if (canvasEditing) {
      this.commitCanvasEdit();
    } else if (editing) {
      this.commitInlineEdit(editing, this.data.editingValue);
    }
    
    // 关闭键盘
    this.setData({
      editing: null,
      editingValue: '',
      canvasEditing: null,
      canvasEditingValue: '',
      showVirtualKeyboard: false,
      superscriptMode: null,
      superscriptContent: ''
    });
    
    // 恢复tabBar
    wx.showTabBar({ animation: true });
  },
  
  // 移动到下一行（同位置的下一个subdivision）
  moveToNextLine() {
    const { notations } = this.data;
    
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;
    
    const { sheet, measure, hand, index, isCanvas } = editInfo;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;
    
    // 先提交当前编辑
    if (isCanvas) {
      this.commitCanvasEdit();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }
    
    // 获取每行小节数
    const measuresPerRow = this.getMeasuresPerRowForNotation(notation) || 1;
    
    // 计算当前所在行号（从0开始）
    const currentRow = Math.floor(measure / measuresPerRow);
    
    // 计算下一行的第一个小节索引
    const nextRowFirstMeasure = (currentRow + 1) * measuresPerRow;
    
    // 检查是否超出范围
    const totalMeasures = notation.measures?.length || 0;
    if (nextRowFirstMeasure >= totalMeasures) {
      // 已经是最后一行，保持不动
      return;
    }
    
    // 跳转到下一行第一个小节的第一个beat的第一个subdivision
    // 保持手和索引不变
    this.navigateToSlotUnified({
      sheet,
      measure: nextRowFirstMeasure,
      beat: 0,
      subdivision: 0,
      hand,
      index,
      isCanvas
    });
    
    // 自动滚动到新位置（仅 View 模式）
    if (!isCanvas) {
      this.scrollToActiveCell();
    }
  },
  
  // 向上移动（移动到上一个相邻槽位）
  // 槽位顺序：rightHand[0] -> rightHand[1] -> leftHand[0] -> leftHand[1]
  moveCursorUp() {
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;

    const { sheet, measure, beat, subdivision, hand, index, isCanvas } = editInfo;
    
    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    // 【性能优化】使用延迟提交，避免阻塞视觉切换
    if (isCanvas) {
      this.debouncedCommitCanvas();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }

    // 确定上一个槽位
    let newHand = hand;
    let newIndex = index;
    
    // 槽位顺序：rightHand[0](0) -> rightHand[1](1) -> leftHand[0](2) -> leftHand[1](3)
    // 当前位置映射
    let currentPos = (hand === 'right' ? 0 : 2) + index;
    
    // 向上移动
    if (currentPos > 0) {
      currentPos -= 1;
      newHand = currentPos < 2 ? 'right' : 'left';
      newIndex = currentPos % 2;
    }
    // 如果已经在最顶部，保持不动
    
    // 导航到新位置
    this.navigateToSlotUnified({
      sheet,
      measure,
      beat,
      subdivision,
      hand: newHand,
      index: newIndex,
      isCanvas
    });
  },
  
  // 向下移动（移动到下一个相邻槽位）
  moveCursorDown() {
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;

    const { sheet, measure, beat, subdivision, hand, index, isCanvas } = editInfo;
    
    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    // 【性能优化】使用延迟提交，避免阻塞视觉切换
    if (isCanvas) {
      this.debouncedCommitCanvas();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }

    // 确定下一个槽位
    let newHand = hand;
    let newIndex = index;
    
    // 槽位顺序：rightHand[0](0) -> rightHand[1](1) -> leftHand[0](2) -> leftHand[1](3)
    // 当前位置映射
    let currentPos = (hand === 'right' ? 0 : 2) + index;
    
    // 向下移动
    if (currentPos < 3) {
      currentPos += 1;
      newHand = currentPos < 2 ? 'right' : 'left';
      newIndex = currentPos % 2;
    }
    // 如果已经在最底部，保持不动
    
    // 导航到新位置
    this.navigateToSlotUnified({
      sheet,
      measure,
      beat,
      subdivision,
      hand: newHand,
      index: newIndex,
      isCanvas
    });
  },
  
  // 导航到指定槽位
  // 【性能优化】使用缓存减少重复计算
  navigateToSlot(sheet, measure, beat, subdivision, hand, index) {
    const { notations } = this.data;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;
    
    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    const slotArray = notation.measures[measure]?.beats[beat]?.subdivisions[subdivision]?.[hand === 'right' ? 'rightHand' : 'leftHand'];
    const currentValue = Array.isArray(slotArray) ? (slotArray[index] || '') : '';
    
    // 【优化】使用缓存获取解析结果
    this.setData({
      editing: { sheet, measure, beat, subdivision, hand, index },
      editingValue: currentValue,
      virtualKeyboardDisplay: currentValue,
      virtualKeyboardRendered: this.getCachedNoteDisplay(currentValue),
      vkParsed: this.getCachedNoteParsed(currentValue),
      superscriptMode: null,
      superscriptContent: ''
    });
    
    this.prevEditing = this.data.editing;
    this.prevEditingValue = currentValue;
  },
  
  // 向左移动编辑位置（移动到上一个subdivision）
  moveCursorLeft() {
    const { notations } = this.data;
    
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;

    const { sheet, measure, beat, subdivision, hand, index, isCanvas } = editInfo;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;

    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }

    // 【性能优化】使用延迟提交，避免阻塞视觉切换
    if (isCanvas) {
      this.debouncedCommitCanvas();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }

    let newMeasure = measure;
    let newBeat = beat;
    let newSubdivision = subdivision - 1;

    // 如果当前subdivision是第一个，移动到上一个beat的最后一个subdivision
    if (newSubdivision < 0) {
      newBeat = beat - 1;
      if (newBeat < 0) {
        // 移动到上一个measure
        newMeasure = measure - 1;
        if (newMeasure < 0) {
          wx.showToast({ title: '已是第一个音符位', icon: 'none' });
          return;
        }
        newBeat = notation.measures[newMeasure].beats.length - 1;
      }
      newSubdivision = notation.measures[newMeasure].beats[newBeat].subdivisions.length - 1;
    }

    // 使用统一的导航函数
    this.navigateToSlotUnified({
      sheet,
      measure: newMeasure,
      beat: newBeat,
      subdivision: newSubdivision,
      hand,
      index,
      isCanvas
    });
  },
  
  // 向右移动编辑位置（移动到下一个subdivision）
  moveCursorRight() {
    const { notations } = this.data;
    
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;

    const { sheet, measure, beat, subdivision, hand, index, isCanvas } = editInfo;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;

    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }

    // 【性能优化】使用延迟提交，避免阻塞视觉切换
    if (isCanvas) {
      this.debouncedCommitCanvas();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }

    const currentBeat = notation.measures[measure].beats[beat];
    let newMeasure = measure;
    let newBeat = beat;
    let newSubdivision = subdivision + 1;

    // 如果当前subdivision是最后一个，移动到下一个beat的第一个subdivision
    if (newSubdivision >= currentBeat.subdivisions.length) {
      newBeat = beat + 1;
      newSubdivision = 0;
      if (newBeat >= notation.measures[measure].beats.length) {
        // 移动到下一个measure
        newMeasure = measure + 1;
        newBeat = 0;
        if (newMeasure >= notation.measures.length) {
          wx.showToast({ title: '已是最后一个音符位', icon: 'none' });
          return;
        }
      }
    }

    // 使用统一的导航函数
    this.navigateToSlotUnified({
      sheet,
      measure: newMeasure,
      beat: newBeat,
      subdivision: newSubdivision,
      hand,
      index,
      isCanvas
    });
  },

  // 向右上方移动（等价于 up + right 两次）
  moveCursorUpRight() {
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;

    const { sheet, measure, beat, subdivision, hand, index, isCanvas } = editInfo;
    const { notations } = this.data;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;

    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    // 【性能优化】使用延迟提交，避免阻塞视觉切换
    if (isCanvas) {
      this.debouncedCommitCanvas();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }

    // 计算向上移动后的槽位
    let currentPos = (hand === 'right' ? 0 : 2) + index;
    let newPos = currentPos > 0 ? currentPos - 1 : currentPos;
    let newHand = newPos < 2 ? 'right' : 'left';
    let newIndex = newPos % 2;

    // 计算向右移动后的位置
    const currentBeat = notation.measures[measure].beats[beat];
    let newMeasure = measure;
    let newBeat = beat;
    let newSubdivision = subdivision + 1;

    if (newSubdivision >= currentBeat.subdivisions.length) {
      newBeat = beat + 1;
      newSubdivision = 0;
      if (newBeat >= notation.measures[measure].beats.length) {
        newMeasure = measure + 1;
        newBeat = 0;
        if (newMeasure >= notation.measures.length) {
          // 已到最后，只执行向上移动
          this.navigateToSlotUnified({
            sheet,
            measure,
            beat,
            subdivision,
            hand: newHand,
            index: newIndex,
            isCanvas
          });
          return;
        }
      }
    }

    // 导航到新位置（右上方）
    this.navigateToSlotUnified({
      sheet,
      measure: newMeasure,
      beat: newBeat,
      subdivision: newSubdivision,
      hand: newHand,
      index: newIndex,
      isCanvas
    });
  },

  // 向右下方移动（等价于 down + right 两次）
  moveCursorDownRight() {
    // 使用统一的编辑状态获取函数
    const editInfo = this.getCurrentEditingInfo();
    if (!editInfo) return;

    const { sheet, measure, beat, subdivision, hand, index, isCanvas } = editInfo;
    const { notations } = this.data;
    const notation = notations.find(n => n.id === sheet);
    if (!notation) return;

    // 如果在上标模式中，先完成上标保存
    if (this.data.superscriptMode) {
      this.completeSuperscript();
    }
    
    // 【性能优化】使用延迟提交，避免阻塞视觉切换
    if (isCanvas) {
      this.debouncedCommitCanvas();
    } else {
      this.commitInlineEdit(this.data.editing, this.data.editingValue);
    }

    // 计算向下移动后的槽位
    let currentPos = (hand === 'right' ? 0 : 2) + index;
    let newPos = currentPos < 3 ? currentPos + 1 : currentPos;
    let newHand = newPos < 2 ? 'right' : 'left';
    let newIndex = newPos % 2;

    // 计算向右移动后的位置
    const currentBeat = notation.measures[measure].beats[beat];
    let newMeasure = measure;
    let newBeat = beat;
    let newSubdivision = subdivision + 1;

    if (newSubdivision >= currentBeat.subdivisions.length) {
      newBeat = beat + 1;
      newSubdivision = 0;
      if (newBeat >= notation.measures[measure].beats.length) {
        newMeasure = measure + 1;
        newBeat = 0;
        if (newMeasure >= notation.measures.length) {
          // 已到最后，只执行向下移动
          this.navigateToSlotUnified({
            sheet,
            measure,
            beat,
            subdivision,
            hand: newHand,
            index: newIndex,
            isCanvas
          });
          return;
        }
      }
    }

    // 导航到新位置（右下方）
    this.navigateToSlotUnified({
      sheet,
      measure: newMeasure,
      beat: newBeat,
      subdivision: newSubdivision,
      hand: newHand,
      index: newIndex,
      isCanvas
    });
  },

  // 切换到原生键盘
  switchToNativeKeyboard() {
    // 隐藏虚拟键盘，让原生键盘自动唤起
    this.setData({
      showVirtualKeyboard: false
    });
    // 恢复tabBar
    wx.showTabBar({ animation: true });
  },

  // ========== 曲谱播放功能 ==========

  /**
   * 切换播放状态
   * 修改：首次点击时打开音频映射弹窗，如果已保存映射且覆盖所有音符则跳过弹窗
   */
  togglePlayback() {
    if (this.data.isPlaybackMode) {
      // 当前在播放模式中
      if (this.data.isPlaying) {
        // 正在播放，停止播放
        this.stopPlayback();
      } else {
        // 播放模式但已暂停，退出播放模式
        this.exitPlaybackMode();
      }
    } else {
      // 检查是否可以跳过音频映射弹窗
      this.checkAndStartPlayback();
    }
  },
  
  /**
   * 检查保存的映射并决定是否跳过弹窗
   * 【修复】如果 saveAudioMappingToScore 为 false，则始终显示弹窗
   */
  async checkAndStartPlayback() {
    // 【修复】如果用户选择不保存映射（即每次都显示弹窗），直接打开弹窗
    if (!this.data.saveAudioMappingToScore) {
      console.log('[Playback] saveAudioMappingToScore 为 false，显示音频映射弹窗');
      this.openAudioMappingModal();
      return;
    }
    
    // 获取保存的映射（从当前曲谱文件数据中）
    const savedMappings = this.data.savedAudioMappings;
    
    if (savedMappings && Array.isArray(savedMappings) && savedMappings.length > 0) {
      // 分析当前谱面使用的音符
      const usedNotes = this.analyzeUsedNotes();
      const savedNoteKeys = new Set(savedMappings.map(m => m.key));
      
      // 检查当前使用的音符是否都在保存的映射中
      let allNotesCovered = true;
      let newNotes = [];
      
      for (const note of usedNotes) {
        if (!savedNoteKeys.has(note)) {
          // 检查是否是特殊标记（不需要映射的）
          const specialMarks = new Set(['s', 'H', 'B', 'O', 'M', '-', '']);
          if (!specialMarks.has(note)) {
            allNotesCovered = false;
            newNotes.push(note);
          }
        }
      }
      
      if (allNotesCovered) {
        // 所有音符都已映射，直接进入播放模式
        console.log('[Playback] 使用保存的音频映射，跳过弹窗');
        try {
          const playbackMgr = await getSheetPlaybackManager();
          // 同步首调设置
          playbackMgr.setConversionRootNote(this.data.conversionRootNote);
          playbackMgr.setCustomAudioMappings(savedMappings);
          
          // 【修复】检查是否需要加载分包
          const checkResult = await playbackMgr.checkMappingRequiresSubpackages(savedMappings);
          if (checkResult.needsSubpackages && checkResult.subpackages.length > 0) {
            // 需要加载分包，保存状态后导航
            this.setData({
              _pendingSubpackageReturn: true,
              _pendingAudioMappings: savedMappings,
              _pendingRootNote: this.data.conversionRootNote
            });
            
            const subpackagesToLoad = new Set(checkResult.subpackages.map(s => s.name));
            await playbackMgr.loadRequiredSubpackagesViaNavigation(subpackagesToLoad);
            // 加载完成后会在 onShow 中继续
            return;
          }
          
          this.enterPlaybackMode();
        } catch (e) {
          console.error('[Playback] 应用保存的映射失败:', e);
          this.openAudioMappingModal();
        }
        return;
      } else {
        // 有新音符，需要显示弹窗并提示
        console.log('[Playback] 检测到新音符类型:', newNotes);
        this.setData({
          audioMappingNewNotesHint: `谱面出现新音符类型: ${newNotes.join(', ')}，请确认映射`
        });
      }
    }
    
    // 打开音频映射弹窗
    this.openAudioMappingModal();
  },
  
  /**
   * 切换保存映射到曲谱的开关
   */
  toggleSaveAudioMapping() {
    this.setData({
      saveAudioMappingToScore: !this.data.saveAudioMappingToScore
    });
  },
  
  /**
   * 从播放器设置打开音频映射弹窗
   */
  async openAudioMappingFromSettings() {
    // 停止当前播放
    if (this.data.isPlaying) {
      this.stopPlayback();
    }
    
    // 关闭设置面板
    this.setData({ showPlaybackSettings: false });
    
    // 延迟打开映射弹窗
    setTimeout(() => {
      this.openAudioMappingModal(true); // 传入 true 表示从设置打开
    }, 200);
  },

  /**
   * 【优化】检查数字谱中是否包含音高修饰符（' 或 ,）
   * 如果包含，说明用户可能需要切换到简谱模式
   * @returns {{hasPitchModifiers: boolean, modifiedNotes: Array}} 检测结果
   */
  checkDigitalNotationForPitchModifiers() {
    const usedNotes = this.analyzeUsedNotes();
    const modifiedNotes = [];
    
    for (const note of usedNotes) {
      // 检查是否包含高八度标记 ' 或低八度标记 ,
      if (note.includes("'") || note.includes(',')) {
        // 确认是数字音符带修饰符（如 1', 2,, 等）
        const baseNote = note.replace(/['`,_]/g, '');
        if (/^[1-7]$/.test(baseNote)) {
          modifiedNotes.push(note);
        }
      }
    }
    
    return {
      hasPitchModifiers: modifiedNotes.length > 0,
      modifiedNotes: modifiedNotes
    };
  },
  
  /**
   * 打开音频映射弹窗
   * 加载可用音频文件列表，并根据当前谱式初始化映射表
   * @param {boolean} fromSettings - 是否从播放器设置打开（用于恢复保存状态）
   */
  async openAudioMappingModal(fromSettings = false) {
    // 显示加载状态
    wx.showLoading({ title: '加载音频...' });
    
    try {
      // 【优化】如果当前是数字谱，检查是否包含音高修饰符
      if (this.data.notationType === 'digital') {
        const checkResult = this.checkDigitalNotationForPitchModifiers();
        if (checkResult.hasPitchModifiers) {
          wx.hideLoading();
          
          // 提示用户可能需要切换谱式
          const result = await new Promise((resolve) => {
            wx.showModal({
              title: '检测到音高标记',
              content: `当前为"数字谱"模式，但谱面中包含音高标记（如 ${checkResult.modifiedNotes.slice(0, 3).join(', ')}${checkResult.modifiedNotes.length > 3 ? ' 等' : ''}）。\n\n是否切换到"简谱"模式以正确解析这些音符？`,
              confirmText: '切换谱式',
              cancelText: '继续',
              success: (res) => resolve(res)
            });
          });
          
          if (result.confirm) {
            // 用户选择切换谱式，打开谱式转换弹窗
            this.openNotationTypeModal();
            return;
          }
          
          // 用户选择继续，重新显示加载状态
          wx.showLoading({ title: '加载音频...' });
        }
      }
      
      // 获取播放管理器
      const playbackMgr = await getSheetPlaybackManager();
      
      // 【修复】确保播放管理器的音频文件列表已加载
      // 这会填充 mainPackageAudioFiles 和 availableAudioFiles
      await playbackMgr.loadAvailableAudioFiles();
      
      // 加载可用音频文件列表（首次打开时缓存到本地）
      if (!this.data.audioMappingsLoaded) {
        // 使用播放管理器的主分包文件列表
        const audioFiles = new Set(playbackMgr.mainPackageAudioFiles);
        this.setData({ 
          availableAudioFiles: Array.from(audioFiles),
          audioMappingsLoaded: true
        });
      }
      
      // 根据当前谱式初始化映射表
      let mappings = this.initializeAudioMappings();
      
      // 如果有保存的映射，合并使用保存的 SPN 值
      const savedMappings = this.data.savedAudioMappings;
      if (savedMappings && Array.isArray(savedMappings)) {
        const savedMap = new Map(savedMappings.map(m => [m.key, m]));
        mappings = mappings.map(m => {
          const saved = savedMap.get(m.key);
          if (saved && saved.spn) {
            // 【修复】使用播放管理器的等音名检查方法
            const checkResult = playbackMgr.checkSpnAudioAvailable(saved.spn);
            return {
              ...m,
              spn: saved.spn,
              hasAudio: checkResult.available,
              actualSpn: checkResult.actualSpn
            };
          }
          return m;
        });
      }
      
      // 【修复】重新检查所有映射的音频可用性（包括等音名检查）
      mappings = mappings.map(m => {
        if (m.spn) {
          // 使用播放管理器的等音名检查方法
          const checkResult = playbackMgr.checkSpnAudioAvailable(m.spn);
          return { 
            ...m, 
            hasAudio: checkResult.available,
            actualSpn: checkResult.actualSpn // 实际使用的SPN（可能是等音名）
          };
        }
        return m;
      });
      
      // 如果从设置打开，保持之前的保存状态；否则重置
      const updateData = {
        showAudioMappingModal: true,
        audioMappings: mappings
      };
      
      if (!fromSettings) {
        // 清除新音符提示（如果之前有的话，在 checkAndStartPlayback 中设置的）
        // updateData.audioMappingNewNotesHint = ''; // 保留提示让用户看到
      }
      
      this.setData(updateData);
      
      // 后台预加载音频资源（利用弹窗打开的时间）
      this.preloadAudioInBackground(mappings);
      
      // 【修复】检查是否需要加载分包并提示用户
      await this.checkAndLoadSubpackagesForMappings(mappings);
      
    } catch (e) {
      console.error('[Notation] 打开音频映射弹窗失败:', e);
      wx.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 加载可用音频文件列表
   */
  async loadAvailableAudioFiles() {
    return new Promise((resolve) => {
      // 预设的音频文件列表（从目录中实际存在的文件，包含特殊音符音频）
      const presetFiles = new Set([
        'A3', 'A4', 'A5', 'Bb3', 'Bb5', 'C4', 'C5', 'C6',
        'D3', 'D4', 'D5', 'E3', 'E4', 'E5', 'F3', 'F4', 'F5',
        'G3', 'G4', 'G5', 'SLAP',
        'd', 'T', 'K', 'P', 'x'  // 特殊音符音频
      ]);
      resolve(presetFiles);
    });
  },

  /**
   * 初始化音频映射表
   * 根据当前谱式（数字谱/简谱）生成映射数组
   * 只显示曲谱中用到的非重音符集合
   */
  initializeAudioMappings() {
    const notationType = this.data.notationType;
    const defaultTable = this.data.defaultConversionTable;
    const availableAudio = new Set(this.data.availableAudioFiles);
    const mappings = [];
    
    // 分析谱面中实际使用的音符
    const usedNotes = this.analyzeUsedNotes();
    
    // 重音符/特殊演奏技法（不需要显示在映射表中，因为它们通常不映射到音高）
    // 注意：d, T, K, P, x, F, · 这些特殊音符需要显示在映射表中，因为它们有实际的音频文件
    const specialNotes = new Set(['s', 'H', 'B', 'O', 'M']);
    
    // 特殊音符处理函数
    // 【优化】D音按简谱的"6,"（低音6）动态计算SPN
    const getSpecialNoteSpn = (note) => {
      if (note === 'd') {
        return availableAudio.has('d') ? 'd' : (availableAudio.has('T') ? 'T' : (availableAudio.has('K') ? 'K' : 'D3'));
      } else if (note === 'T') {
        return availableAudio.has('T') ? 'T' : (availableAudio.has('d') ? 'd' : (availableAudio.has('K') ? 'K' : 'D3'));
      } else if (note === 'K') {
        return availableAudio.has('K') ? 'K' : (availableAudio.has('T') ? 'T' : (availableAudio.has('d') ? 'd' : 'D3'));
      } else if (note === 'P') {
        return availableAudio.has('P') ? 'P' : 'x';
      } else if (note === 'x') {
        return availableAudio.has('x') ? 'x' : 'D3';
      } else if (note === 'F') {
        return availableAudio.has('x') ? 'x' : 'D3';
      } else if (note === '·') {
        return availableAudio.has('x') ? 'x' : 'D3';
      } else if (note === 'D') {
        // 【优化】D音按简谱"6,"动态计算，以便移调时正确分配音频
        return this.calculateSpnFromSimplified('6,');
      }
      return '';
    };
    
    // 判断是否为特殊音符（需要特殊处理SPN的）
    const isSpecialMappingNote = (note) => {
      const baseNote = note.replace(/[',_]/g, '');
      return ['d', 'T', 'K', 'P', 'x', 'F', '·', 'D'].includes(baseNote);
    };
    
    if (notationType === 'simplified') {
      // ===== 简谱模式：直接从谱面中使用的简谱音符构建映射表 =====
      // 已处理的音符集合，避免重复
      const processedNotes = new Set();
      
      // 遍历所有使用的音符
      usedNotes.forEach(note => {
        if (processedNotes.has(note)) return;
        
        // 获取基础音符（去掉八度标记）
        const baseNote = note.replace(/[',_]/g, '');
        
        // 跳过重音符/特殊技法标记
        if (specialNotes.has(baseNote)) return;
        
        // 跳过空音符和占位符
        if (!baseNote || baseNote === '-' || baseNote === '+' || baseNote === '0') return;
        
        processedNotes.add(note);
        
        let spn = '';
        
        // 处理特殊音符的映射
        if (isSpecialMappingNote(note)) {
          spn = getSpecialNoteSpn(baseNote);
        } else {
          // 普通简谱音符：使用 calculateSpnFromSimplified 计算正确的 SPN
          spn = this.calculateSpnFromSimplified(note);
        }
        
        mappings.push({
          key: note, // 简谱模式下 key 和 simplified 相同
          simplified: note,
          spn: spn,
          hasAudio: spn ? availableAudio.has(spn) : false,
          isUsed: true
        });
      });
      
      // 按照音高排序：先按基础音符数字排序，再按八度标记排序
      mappings.sort((a, b) => {
        const aBase = a.simplified.replace(/[',_]/g, '');
        const bBase = b.simplified.replace(/[',_]/g, '');
        
        // 特殊音符放在最后
        const aIsSpecial = isSpecialMappingNote(a.simplified);
        const bIsSpecial = isSpecialMappingNote(b.simplified);
        if (aIsSpecial && !bIsSpecial) return 1;
        if (!aIsSpecial && bIsSpecial) return -1;
        if (aIsSpecial && bIsSpecial) return aBase.localeCompare(bBase);
        
        // 数字音符按音高排序
        const aNum = parseInt(aBase) || 99;
        const bNum = parseInt(bBase) || 99;
        
        // 计算八度偏移
        const aOctaveUp = (a.simplified.match(/'/g) || []).length;
        const aOctaveDown = (a.simplified.match(/,/g) || []).length;
        const bOctaveUp = (b.simplified.match(/'/g) || []).length;
        const bOctaveDown = (b.simplified.match(/,/g) || []).length;
        
        const aOctave = aOctaveUp - aOctaveDown;
        const bOctave = bOctaveUp - bOctaveDown;
        
        // 先按八度排序，再按音符数字排序
        if (aOctave !== bOctave) return aOctave - bOctave;
        return aNum - bNum;
      });
      
    } else {
      // ===== 数字谱模式：保持原有逻辑 =====
      // 根据默认转换表构建映射，只保留曲谱中用到的音符
      Object.keys(defaultTable).forEach(key => {
        const [simplified, defaultSpn] = defaultTable[key];
        
        // 检查这个音符是否在曲谱中使用
        const isUsed = usedNotes.has(key);
        
        // 只显示曲谱中用到的非特殊音符
        if (!isUsed) return;
        
        // 跳过重音符/特殊技法标记
        if (specialNotes.has(key)) return;
        
        // 计算实际SPN（基于当前首调设置）
        let spn = defaultSpn || '';
        
        // 【优化】处理D_DYNAMIC标记，动态计算D音的SPN
        if (spn === 'D_DYNAMIC') {
          spn = this.calculateSpnFromSimplified('6,'); // D音按6,（低音6）计算
        }
        
        // 处理特殊音符的默认映射
        if (!spn || spn === '') {
          spn = getSpecialNoteSpn(key);
        }
        
        mappings.push({
          key: key,
          simplified: simplified,
          spn: spn,
          hasAudio: spn ? availableAudio.has(spn) : false,
          isUsed: true
        });
      });
    }
    
    // 如果没有找到任何用到的音符，显示默认的常用音符作为示例
    if (mappings.length === 0) {
      if (notationType === 'simplified') {
        // 简谱模式：显示简谱常用音符
        const defaultSimplified = ['1', '2', '3', '4', '5', '6', '7', "1'", "2'"];
        defaultSimplified.forEach(note => {
          const spn = this.calculateSpnFromSimplified(note);
          mappings.push({
            key: note,
            simplified: note,
            spn: spn || '',
            hasAudio: spn ? availableAudio.has(spn) : false,
            isUsed: false
          });
        });
      } else {
        // 数字谱模式：显示数字谱常用音符
        const defaultKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        defaultKeys.forEach(key => {
          if (defaultTable[key]) {
            const [simplified, spn] = defaultTable[key];
            mappings.push({
              key: key,
              simplified: simplified,
              spn: spn || '',
              hasAudio: spn ? availableAudio.has(spn) : false,
              isUsed: false
            });
          }
        });
      }
    }
    
    return mappings;
  },

  /**
   * 分析谱面中实际使用的音符
   * 返回音符集合（包含带八度标记的简谱音符）
   */
  analyzeUsedNotes() {
    const usedNotes = new Set();
    const notations = this.data.notations;
    
    if (!notations || !Array.isArray(notations)) return usedNotes;
    
    notations.forEach(notation => {
      if (!notation.measures) return;
      notation.measures.forEach(measure => {
        if (!measure.beats) return;
        measure.beats.forEach(beat => {
          if (!beat.subdivisions) return;
          beat.subdivisions.forEach(sub => {
            const extractNote = (noteStr) => {
              if (!noteStr || typeof noteStr !== 'string') return;
              // 清理音符字符串
              let cleaned = noteStr.replace(/[()]/g, '').trim();
              if (!cleaned || cleaned === '-' || cleaned === '+') return;
              
              // 提取装饰音（左上标）并单独添加
              const graceMatch = cleaned.match(/\^{([^}]+)}/);
              if (graceMatch) {
                const graceNote = graceMatch[1].replace(/[_*]/g, '');
                if (graceNote) usedNotes.add(graceNote);
              }
              
              // 去掉左上标
              cleaned = cleaned.replace(/\^{[^}]*}/g, '');
              // 去掉下划线和附点记号（保留八度标记）
              cleaned = cleaned.replace(/[_*]/g, '');
              
              if (cleaned) usedNotes.add(cleaned);
            };
            
            if (Array.isArray(sub.rightHand)) {
              sub.rightHand.forEach(extractNote);
            }
            if (Array.isArray(sub.leftHand)) {
              sub.leftHand.forEach(extractNote);
            }
          });
        });
      });
    });
    
    return usedNotes;
  },

  /**
   * 后台预加载音频资源
   */
  async preloadAudioInBackground(mappings) {
    try {
      const playbackMgr = await getSheetPlaybackManager();
      
      // 加载所有需要的音频
      const spnList = mappings
        .filter(m => m.spn && m.hasAudio)
        .map(m => m.spn);
      
      if (spnList.length > 0) {
        await playbackMgr.loadSounds(new Set(spnList), this.data.notationType, 2);
        console.log('[Notation] 后台预加载完成:', spnList.length, '个音频');
      }
    } catch (e) {
      console.warn('[Notation] 后台预加载失败:', e.message);
    }
  },

  /**
   * 关闭音频映射弹窗
   */
  closeAudioMappingModal() {
    this.setData({ 
      showAudioMappingModal: false,
      audioMappingNewNotesHint: '' // 清除新音符提示
    });
  },

  /**
   * 音频映射单元格点击
   * 简谱列唤起虚拟键盘，其他列使用原生输入
   */
  onAudioMappingCellTap(e) {
    const { index, field } = e.currentTarget.dataset;
    const mapping = this.data.audioMappings[index];
    
    if (field === 'simplified') {
      // 简谱列：唤起虚拟键盘
      this.setData({
        audioMappingEditingIndex: index,
        audioMappingEditingField: field,
        audioMappingUseNativeInput: false,
        showVirtualKeyboard: true,
        virtualKeyboardDisplay: mapping.simplified || '',
        virtualKeyboardRendered: this.renderNoteForDisplay(mapping.simplified || ''),
        vkParsed: this.parseNoteForVK(mapping.simplified || ''),
        virtualKeyboardMode: 'number',
        superscriptMode: null
      }, () => {
        wx.hideTabBar({ animation: true });
      });
    } else if (field === 'key') {
      // 数字谱列：使用原生输入
      this.setData({
        audioMappingEditingIndex: index,
        audioMappingEditingField: field,
        audioMappingUseNativeInput: true
      });
    } else {
      // SPN列：使用原生输入
      this.setData({
        audioMappingEditingIndex: index,
        audioMappingEditingField: field,
        audioMappingUseNativeInput: true
      });
    }
  },

  /**
   * 音频映射原生输入处理
   */
  async onAudioMappingNativeInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    const mappings = [...this.data.audioMappings];
    mappings[index][field] = value;
    
    // 获取播放管理器检查音频可用性
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    
    // 如果修改了simplified，自动更新SPN（基于首调计算）
    if (field === 'simplified') {
      const newSpn = this.calculateSpnFromSimplified(value);
      mappings[index].spn = newSpn;
      // 【优化】使用等音名检查方法
      if (playbackMgr && newSpn) {
        const checkResult = playbackMgr.checkSpnAudioAvailable(newSpn);
        mappings[index].hasAudio = checkResult.available;
        mappings[index].actualSpn = checkResult.actualSpn;
      } else {
        mappings[index].hasAudio = false;
      }
    }
    
    // 如果手动修改了SPN，更新hasAudio状态
    if (field === 'spn') {
      // 【优化】使用等音名检查方法
      if (playbackMgr && value) {
        const checkResult = playbackMgr.checkSpnAudioAvailable(value);
        mappings[index].hasAudio = checkResult.available;
        mappings[index].actualSpn = checkResult.actualSpn;
      } else {
        mappings[index].hasAudio = false;
      }
    }
    
    this.setData({ audioMappings: mappings });
    
    // 【修复】如果修改的是SPN字段，检查是否需要加载分包
    if (field === 'spn' && value) {
      this.checkSingleSpnSubpackage(value);
    }
  },
  
  /**
   * 检查单个SPN是否需要加载分包
   * @param {string} spn - SPN音符名
   */
  async checkSingleSpnSubpackage(spn) {
    try {
      const playbackMgr = await getSheetPlaybackManager();
      // 等音名解析：C#4 等可能实际从 Db4 所在分包加载
      const check = playbackMgr.checkSpnAudioAvailable(spn);
      const resolvedSpn = check.available ? check.actualSpn : spn;

      // 如果在扩展分包中但分包未加载
      const subpackage = playbackMgr.spnToSubpackage.get(resolvedSpn);
      if (subpackage && !playbackMgr.isSubpackageLoaded(subpackage)) {
        const config = playbackMgr.subpackageAudioMappings[subpackage];
        const displayName = config?.displayName || subpackage;
        
        wx.showModal({
          title: '需要加载音频',
          content: `${spn} 需要加载${displayName}，是否立即加载？`,
          confirmText: '加载',
          cancelText: '稍后',
          success: async (res) => {
            if (res.confirm) {
              // 保存当前状态
              this.setData({
                _pendingSubpackageReturn: true,
                _pendingAudioMappings: this.data.audioMappings,
                _pendingRootNote: this.data.conversionRootNote,
                _pendingModalWasOpen: this.data.showAudioMappingModal
              });
              
              // 加载分包
              await playbackMgr.loadSubpackageViaNavigation(subpackage);
            }
          }
        });
      }
    } catch (e) {
      console.error('[Notation] 检查SPN分包失败:', e);
    }
  },

  /**
   * 音频映射原生输入失焦处理
   */
  onAudioMappingNativeBlur() {
    this.setData({
      audioMappingEditingIndex: null,
      audioMappingEditingField: null,
      audioMappingUseNativeInput: false
    });
  },

  /**
   * 根据简谱音符计算SPN
   * @param {string} simplified - 简谱音符（如 1, 2', 3,, 等）
   * @returns {string} SPN名称
   */
  calculateSpnFromSimplified(simplified) {
    if (!simplified) return '';
    
    // 简谱数字到音名的基础映射（以C为1）
    const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
    const noteToSemitones = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    
    // 解析首调设置
    const rootNote = this.data.conversionRootNote || 'F3';
    const rootMatch = rootNote.match(/^([A-G][#b]?)(\d)$/);
    if (!rootMatch) return '';
    
    const rootName = rootMatch[1];
    const rootOctave = parseInt(rootMatch[2]);
    
    // 解析简谱音符
    let baseNote = simplified.replace(/[',_]/g, '');
    const octaveUp = (simplified.match(/'/g) || []).length;
    const octaveDown = (simplified.match(/,/g) || []).length;
    
    // 特殊音符直接返回
    if (['s', 'P', 'T', 'H', 'F', 'B', 'O', 'x', '·', 'K', 'M', 'D', 'd'].includes(baseNote)) {
      return '';
    }
    
    // 数字到音程的映射（半音数）
    const degreeToSemitones = {
      '1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11
    };
    
    if (!degreeToSemitones.hasOwnProperty(baseNote)) return '';
    
    // 计算音符的绝对半音位置
    const rootSemitones = noteToSemitones[rootName.charAt(0)] + (rootName.includes('#') ? 1 : rootName.includes('b') ? -1 : 0);
    const noteSemitones = (rootSemitones + degreeToSemitones[baseNote]) % 12;
    const octave = rootOctave + octaveUp - octaveDown + Math.floor((rootSemitones + degreeToSemitones[baseNote]) / 12);
    
    // 半音数到音名的映射
    const semitonesToNote = {
      0: 'C', 1: 'C#', 2: 'D', 3: 'Eb', 4: 'E', 5: 'F',
      6: 'F#', 7: 'G', 8: 'Ab', 9: 'A', 10: 'Bb', 11: 'B'
    };
    
    const noteName = semitonesToNote[noteSemitones];
    return `${noteName}${octave}`;
  },

  /**
   * 试听音频
   */
  async previewAudio(e) {
    const { index } = e.currentTarget.dataset;
    const mapping = this.data.audioMappings[index];
    
    if (!mapping.spn || !mapping.hasAudio) {
      wx.showToast({ title: '无音频文件', icon: 'none' });
      return;
    }
    
    try {
      this.setData({ audioMappingPreviewPlaying: index });
      
      const playbackMgr = await getSheetPlaybackManager();
      await playbackMgr.previewSound(mapping.spn, 0.8);
      
      // 短暂显示播放状态后重置
      setTimeout(() => {
        this.setData({ audioMappingPreviewPlaying: null });
      }, 500);
    } catch (e) {
      console.error('[Notation] 试听失败:', e);
      this.setData({ audioMappingPreviewPlaying: null });
      wx.showToast({ title: '播放失败', icon: 'none' });
    }
  },

  /**
   * 打开音频映射表库
   */
  openAudioMappingLibrary() {
    // 复用转换表库的数据
    const library = wx.getStorageSync('conversionTableLibrary') || [];
    this.setData({
      conversionTableLibrary: library,
      showAudioMappingLibrary: true
    });
  },

  /**
   * 关闭音频映射表库
   */
  closeAudioMappingLibrary() {
    this.setData({ showAudioMappingLibrary: false });
  },

  /**
   * 应用选中的音频映射表
   */
  async applyAudioMappingTable() {
    const tableId = this.data.currentAudioMappingTableId;
    
    // 获取播放管理器以检查音频可用性
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    
    let mappings;
    
    if (tableId === null) {
      // 使用默认表
      mappings = this.initializeAudioMappings();
    } else {
      // 使用选中的表
      const library = this.data.conversionTableLibrary;
      const table = library.find(t => t.id === tableId);
      
      if (table && table.data) {
        mappings = table.data.map(item => ({
          ...item,
          hasAudio: false // 先置为false，后面统一检查
        }));
      }
    }
    
    if (mappings) {
      // 【修复】使用播放管理器检查音频可用性（含等音名：如 C#4 视为 Db4 可用）
      if (playbackMgr) {
        mappings = mappings.map(item => ({
          ...item,
          hasAudio: item.spn ? playbackMgr.checkSpnAudioAvailable(item.spn).available : false
        }));
      }
      
      this.setData({
        audioMappings: mappings,
        showAudioMappingLibrary: false
      });
      
      // 【修复】检查是否需要加载分包
      await this.checkAndLoadSubpackagesForMappings(mappings);
    }
  },

  /**
   * 选择音频映射表
   */
  selectAudioMappingTable(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentAudioMappingTableId: id === 'null' ? null : id });
  },

  /**
   * 打开选中的音频映射表进行编辑/查看
   */
  async openSelectedAudioMappingTable() {
    const tableId = this.data.currentAudioMappingTableId;
    
    // 【修复】获取播放管理器以检查音频可用性
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    
    // 检查音频可用性（含等音名：如 C#4 视为 Db4 可用）
    const checkAudioAvailable = (spn) => {
      if (!spn || !playbackMgr) return false;
      return playbackMgr.checkSpnAudioAvailable(spn).available;
    };

    if (tableId === null) {
      // 使用默认表作为模板打开
      const defaultTable = this.data.defaultConversionTable;
      const tableData = Object.keys(defaultTable).map(key => {
        const [simplified, spn] = defaultTable[key];
        return {
          key: key,
          simplified: simplified,
          spn: spn || '',
          hasAudio: checkAudioAvailable(spn)
        };
      });
      
      this.setData({
        showNewAudioMappingTableModal: true,
        showAudioMappingLibrary: false,
        newAudioMappingTableName: '默认转换表（副本）',
        newAudioMappingTableData: tableData,
        newAudioTableRootNote: this.data.conversionRootNote || 'F3',
        editingAudioMappingTableId: null // 新建
      });
    } else {
      // 打开已有的转换表进行编辑
      const library = this.data.conversionTableLibrary;
      const table = library.find(t => t.id === tableId);
      
      if (table && table.data) {
        const tableData = table.data.map(item => ({
          ...item,
          hasAudio: checkAudioAvailable(item.spn)
        }));
        
        this.setData({
          showNewAudioMappingTableModal: true,
          showAudioMappingLibrary: false,
          newAudioMappingTableName: table.name,
          newAudioMappingTableData: tableData,
          newAudioTableRootNote: table.rootNote || this.data.conversionRootNote || 'F3',
          editingAudioMappingTableId: tableId
        });
      }
    }
  },

  /**
   * 打开新建音频映射转换表弹窗
   */
  async openNewAudioMappingTable() {
    const defaultTable = this.data.defaultConversionTable;
    
    // 【修复】获取播放管理器以检查音频可用性
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    
    // 检查音频可用性（含等音名）
    const checkAudioAvailable = (spn) => {
      if (!spn || !playbackMgr) return false;
      return playbackMgr.checkSpnAudioAvailable(spn).available;
    };

    // 使用默认转换表作为模板
    const tableData = Object.keys(defaultTable).map(key => {
      const [simplified, spn] = defaultTable[key];
      return {
        key: key,
        simplified: simplified,
        spn: spn || '',
        hasAudio: checkAudioAvailable(spn)
      };
    });

    // 生成唯一名称
    const library = this.data.conversionTableLibrary || [];
    let nameIndex = 1;
    while (library.some(t => t.name === `转换表${nameIndex}`)) {
      nameIndex++;
    }
    
    this.setData({
      showNewAudioMappingTableModal: true,
      showAudioMappingLibrary: false,
      newAudioMappingTableName: `转换表${nameIndex}`,
      newAudioMappingTableData: tableData,
      newAudioTableRootNote: this.data.conversionRootNote || 'F3',
      editingAudioMappingTableId: null // 新建
    });
  },

  /**
   * 关闭新建音频映射转换表弹窗
   */
  closeNewAudioMappingTable() {
    this.setData({
      showNewAudioMappingTableModal: false,
      newAudioMappingTableName: '',
      newAudioMappingTableData: [],
      newAudioTableEditingIndex: null,
      newAudioTableEditingField: null,
      newAudioTableUseNativeInput: false,
      editingAudioMappingTableId: null
    });
    // 如果虚拟键盘是打开的，关闭它
    if (this.data.showVirtualKeyboard) {
      this.setData({ showVirtualKeyboard: false });
      wx.showTabBar({ animation: true });
    }
  },

  /**
   * 新建转换表名称输入
   */
  onNewAudioMappingTableNameInput(e) {
    this.setData({ newAudioMappingTableName: e.detail.value });
  },

  /**
   * 显示新建转换表的首调选择器
   */
  showNewAudioTableRootPicker() {
    // 解析当前首调
    const rootNote = this.data.newAudioTableRootNote || 'F3';
    const match = rootNote.match(/^([A-G][#b]?)(\d)$/);
    let noteIndex = 5; // 默认F
    let octaveIndex = 2; // 默认3
    
    if (match) {
      const noteNames = this.data.spnNoteOptions;
      noteIndex = noteNames.indexOf(match[1]);
      if (noteIndex === -1) noteIndex = 5;
      
      const octaves = this.data.spnOctaveOptions;
      octaveIndex = octaves.indexOf(match[2]);
      if (octaveIndex === -1) octaveIndex = 2;
    }
    
    this.setData({
      showConversionRootPicker: true,
      conversionRootPickerValue: [noteIndex, octaveIndex],
      tempConversionRootNote: rootNote,
      isNewTableRootPicker: true // 标记为新建表的首调选择器
    });
  },

  /**
   * 新建转换表单元格点击
   */
  onNewAudioTableCellTap(e) {
    const { index, field } = e.currentTarget.dataset;
    const item = this.data.newAudioMappingTableData[index];
    
    if (field === 'simplified') {
      // 简谱列：唤起虚拟键盘
      this.setData({
        newAudioTableEditingIndex: index,
        newAudioTableEditingField: field,
        newAudioTableUseNativeInput: false,
        showVirtualKeyboard: true,
        virtualKeyboardDisplay: item.simplified || '',
        virtualKeyboardRendered: this.renderNoteForDisplay(item.simplified || ''),
        vkParsed: this.parseNoteForVK(item.simplified || ''),
        virtualKeyboardMode: 'number',
        superscriptMode: null
      }, () => {
        wx.hideTabBar({ animation: true });
      });
    } else {
      // 数字谱列/SPN列：使用原生输入
      this.setData({
        newAudioTableEditingIndex: index,
        newAudioTableEditingField: field,
        newAudioTableUseNativeInput: true
      });
    }
  },

  /**
   * 新建转换表的原生输入处理
   */
  async onNewAudioTableNativeInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const value = e.detail.value;

    const updatedData = [...this.data.newAudioMappingTableData];
    updatedData[index] = {
      ...updatedData[index],
      [field]: value
    };

    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;

    // 如果修改了simplified，自动更新SPN
    if (field === 'simplified') {
      const newSpn = this.calculateSpnFromSimplifiedWithRoot(value, this.data.newAudioTableRootNote);
      updatedData[index].spn = newSpn;
      updatedData[index].hasAudio = checkHasAudio(newSpn);
    }

    // 如果手动修改了SPN，更新hasAudio状态（含等音名）
    if (field === 'spn') {
      updatedData[index].hasAudio = checkHasAudio(value);
    }

    this.setData({ newAudioMappingTableData: updatedData });
  },

  /**
   * 新建转换表的原生输入失焦处理
   */
  onNewAudioTableNativeBlur() {
    this.setData({
      newAudioTableEditingIndex: null,
      newAudioTableEditingField: null,
      newAudioTableUseNativeInput: false
    });
  },

  /**
   * 添加新行到转换表
   */
  addNewAudioTableRow() {
    const updatedData = [...this.data.newAudioMappingTableData];
    updatedData.push({
      key: '',
      simplified: '',
      spn: '',
      hasAudio: false
    });
    this.setData({ newAudioMappingTableData: updatedData });
  },

  /**
   * 根据简谱音符和指定首调计算SPN
   */
  calculateSpnFromSimplifiedWithRoot(simplified, rootNote) {
    if (!simplified) return '';
    
    const noteToSemitones = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    
    const rootMatch = (rootNote || 'F3').match(/^([A-G][#b]?)(\d)$/);
    if (!rootMatch) return '';
    
    const rootName = rootMatch[1];
    const rootOctave = parseInt(rootMatch[2]);
    
    let baseNote = simplified.replace(/[',_]/g, '');
    const octaveUp = (simplified.match(/'/g) || []).length;
    const octaveDown = (simplified.match(/,/g) || []).length;
    
    // 特殊音符直接返回
    if (['s', 'P', 'T', 'H', 'F', 'B', 'O', 'x', '·', 'K', 'M', 'D', 'd'].includes(baseNote)) {
      return '';
    }
    
    const degreeToSemitones = {
      '1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11
    };
    
    if (!degreeToSemitones.hasOwnProperty(baseNote)) return '';
    
    const rootSemitones = noteToSemitones[rootName.charAt(0)] + (rootName.includes('#') ? 1 : rootName.includes('b') ? -1 : 0);
    const noteSemitones = (rootSemitones + degreeToSemitones[baseNote]) % 12;
    const octave = rootOctave + octaveUp - octaveDown + Math.floor((rootSemitones + degreeToSemitones[baseNote]) / 12);
    
    const semitonesToNote = {
      0: 'C', 1: 'C#', 2: 'D', 3: 'Eb', 4: 'E', 5: 'F',
      6: 'F#', 7: 'G', 8: 'Ab', 9: 'A', 10: 'Bb', 11: 'B'
    };
    
    const noteName = semitonesToNote[noteSemitones];
    return `${noteName}${octave}`;
  },

  /**
   * 应用新建的音频映射转换表
   */
  async applyNewAudioMappingTable() {
    const { newAudioMappingTableName, newAudioMappingTableData, newAudioTableRootNote,
            editingAudioMappingTableId } = this.data;

    if (!newAudioMappingTableName || newAudioMappingTableName.trim() === '') {
      wx.showToast({ title: '请输入转换表名称', icon: 'none' });
      return;
    }

    // 过滤掉空行
    const validData = newAudioMappingTableData.filter(item =>
      item.key || item.simplified || item.spn
    );

    if (validData.length === 0) {
      wx.showToast({ title: '转换表不能为空', icon: 'none' });
      return;
    }

    // 保存到库
    let library = wx.getStorageSync('conversionTableLibrary') || [];

    if (editingAudioMappingTableId) {
      // 更新已有的表
      const index = library.findIndex(t => t.id === editingAudioMappingTableId);
      if (index !== -1) {
        library[index] = {
          ...library[index],
          name: newAudioMappingTableName,
          data: validData,
          rootNote: newAudioTableRootNote,
          updateTime: new Date().toLocaleString()
        };
      }
    } else {
      // 创建新表
      const newTable = {
        id: Date.now().toString(),
        name: newAudioMappingTableName,
        data: validData,
        rootNote: newAudioTableRootNote,
        createTime: new Date().toLocaleString()
      };
      library.push(newTable);
    }

    wx.setStorageSync('conversionTableLibrary', library);

    // 应用到音频映射弹窗（含等音名检查）
    let playbackMgr = null;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.warn('[Notation] 获取播放管理器失败:', e);
    }
    const checkHasAudio = (spn) => spn && playbackMgr ? playbackMgr.checkSpnAudioAvailable(spn).available : false;
    const mappings = validData.map(item => ({
      ...item,
      hasAudio: checkHasAudio(item.spn),
      isUsed: true
    }));
    
    this.setData({
      audioMappings: mappings,
      conversionTableLibrary: library,
      showNewAudioMappingTableModal: false,
      showAudioMappingLibrary: false,
      newAudioMappingTableName: '',
      newAudioMappingTableData: [],
      editingAudioMappingTableId: null
    });
    
    // 如果虚拟键盘是打开的，关闭它
    if (this.data.showVirtualKeyboard) {
      this.setData({ showVirtualKeyboard: false });
      wx.showTabBar({ animation: true });
    }
    
    wx.showToast({ title: '已应用', icon: 'success' });
  },

  /**
   * 确认音频映射并开始播放
   */
  async confirmAudioMappingAndPlay() {
    // 将映射设置到播放管理器
    try {
      const playbackMgr = await getSheetPlaybackManager();
      // 同步首调设置
      playbackMgr.setConversionRootNote(this.data.conversionRootNote);
      playbackMgr.setCustomAudioMappings(this.data.audioMappings);
      
      // 如果用户选择保存映射到曲谱
      if (this.data.saveAudioMappingToScore) {
        await this.saveAudioMappingsToScore(this.data.audioMappings);
      }
      
      // 关闭弹窗，清除提示
      this.setData({ 
        showAudioMappingModal: false,
        audioMappingNewNotesHint: ''
      });
      
      // 进入播放模式
      this.enterPlaybackMode();
    } catch (e) {
      console.error('[Notation] 设置音频映射失败:', e);
      wx.showToast({ title: '启动失败', icon: 'none' });
    }
  },
  
  /**
   * 保存音频映射到当前曲谱
   * @param {Array} mappings - 音频映射数组
   */
  async saveAudioMappingsToScore(mappings) {
    // 更新本地状态
    this.setData({ savedAudioMappings: mappings });
    
    // 如果当前有关联的库文件，同步保存到库文件数据
    const fileId = this.data.libraryFileId;
    if (fileId) {
      try {
        const currentFile = libraryManager.getFileById(fileId);
        if (currentFile) {
          // 保存映射到文件数据
          const updateData = {
            ...currentFile,
            savedAudioMappings: mappings.map(m => ({
              key: m.key,
              simplified: m.simplified,
              spn: m.spn
            }))
          };
          libraryManager.updateFile(fileId, updateData);
          console.log('[Notation] 音频映射已保存到曲谱文件');
        }
      } catch (e) {
        console.error('[Notation] 保存音频映射到文件失败:', e);
      }
    }
    
    // 同时保存到临时存储（用于未关联库文件的情况）
    try {
      wx.setStorageSync('temp_audio_mappings', mappings.map(m => ({
        key: m.key,
        simplified: m.simplified,
        spn: m.spn
      })));
    } catch (e) {
      console.warn('[Notation] 保存临时音频映射失败:', e);
    }
  },
  
  /**
   * 从曲谱加载保存的音频映射
   * 在打开曲谱或初始化时调用
   */
  loadSavedAudioMappings() {
    // 首先尝试从库文件加载
    const fileId = this.data.libraryFileId;
    if (fileId) {
      try {
        const currentFile = libraryManager.getFileById(fileId);
        if (currentFile && currentFile.savedAudioMappings) {
          console.log('[Notation] 从曲谱文件加载保存的音频映射');
          this.setData({ 
            savedAudioMappings: currentFile.savedAudioMappings,
            saveAudioMappingToScore: true // 如果有保存的映射，默认勾选
          });
          return;
        }
      } catch (e) {
        console.warn('[Notation] 从文件加载音频映射失败:', e);
      }
    }
    
    // 如果没有关联库文件，尝试从临时存储加载
    try {
      const tempMappings = wx.getStorageSync('temp_audio_mappings');
      if (tempMappings && Array.isArray(tempMappings) && tempMappings.length > 0) {
        console.log('[Notation] 从临时存储加载音频映射');
        this.setData({ savedAudioMappings: tempMappings });
      }
    } catch (e) {
      console.warn('[Notation] 加载临时音频映射失败:', e);
    }
  },

  /**
   * 进入播放模式
   * 优化版：
   * 1. 并行预加载音频资源和初始化Canvas
   * 2. 切换为单页滚动模式（取消分页）
   * 3. 支持光标跟随滚动
   */
  async enterPlaybackMode() {
    // 保存当前状态用于恢复
    this._savedReadingMode = this.data.readingMode;
    this._savedPaginationState = {
      enablePagination: this.data.enablePagination,
      currentPage: this.data.currentPage,
      currentPageModules: this.data.currentPageModules,
      pages: this.data.pages
    };
    
    // 获取当前选中的音符格作为起始位置
    let startColumnId = null;
    if (this.data.editing) {
      const { sheet, measure, beat, subdivision } = this.data.editing;
      // 找到 sheet 对应的 moduleIndex
      const moduleIndex = this.data.notations.findIndex(n => n.id === sheet);
      if (moduleIndex >= 0) {
        startColumnId = `${moduleIndex}-${measure}-${beat}-${subdivision}`;
      }
    }

    // ======== 切换为单页滚动模式 ========
    // 将所有module放在一页，取消分页
    const allModules = this.data.notations.map((n, i) => ({
      id: n.id,
      index: i,
      measures: n.measures ? n.measures.length : 0
    }));

    // 进入播放模式
    this.setData({
      isPlaybackMode: true,
      isPlaying: false,
      isPaused: false,
      readingMode: true, // 切换到阅读模式
      showLayoutMenu: false,
      editing: null, // 清除编辑状态
      editingValue: '',
      showVirtualKeyboard: false,
      playbackStartColumn: startColumnId,
      showPlaybackLoading: true,
      playbackLoadingText: '准备播放...',
      // 单页模式：禁用分页，显示所有modules
      enablePagination: false,
      currentPage: 0,
      currentPageModules: allModules,
      // 播放控制相关
      playbackProgress: 0,
      playbackDuration: 0,
      playbackCurrentTime: 0,
      playbackTempo: this.data.globalTempo || 60,
      playbackMode: 'single', // 'single' 单曲, 'loop' 循环
      playbackFollowCursor: true, // 视角跟随光标
      metronomeActive: false,
      showPlaybackSettings: false,
      showInlineTempoSlider: false // 内联速度调节杠
    });

    // 隐藏底部导航栏
    wx.hideTabBar({ animation: true });

    // 收起所有module的工具图标并初始化Canvas渲染器
    this.collapseAllNotationsForPlayback();
    
    // ======== 并行执行：Canvas初始化 + 音频预加载 ========
    this.setData({ playbackLoadingText: '加载谱面...' });
    const canvasReadyPromise = this.waitForAllCanvasInitialization();
    const audioPreloadPromise = this.preloadPlaybackAudio();
    
    // 等待两者都完成
    await Promise.all([canvasReadyPromise, audioPreloadPromise]);
    
    // 初始化播放光标
    this.initPlaybackCursors();
    
    // ======== 预生成时间线，使点击定位可以正常工作 ========
    try {
      const playbackMgr = await getSheetPlaybackManager();
      const notations = this.data.notations;
      const tempo = this.data.globalTempo || 60;
      const startColumnId = this.data.playbackStartColumn;
      const pageInfo = {
        pages: this.data.pages,
        currentPage: this.data.currentPage
      };
      
      // 【Bug 修复】同步播放模式到 sheetPlaybackManager
      // 确保 playbackMode 与 loopEnabled 状态一致，避免"单曲"模式下仍然循环播放
      playbackMgr.setLoopMode(this.data.playbackMode === 'loop');
      
      // 生成时间线（但不开始播放）
      playbackMgr.generateTimeline(notations, tempo, startColumnId, pageInfo);
      console.log('[Playback] 时间线预生成完成，循环模式:', this.data.playbackMode === 'loop');
    } catch (e) {
      console.warn('[Playback] 时间线预生成失败（播放时会重试）:', e.message);
    }

    // 标记播放准备就绪，但不自动开始播放
    // 让用户自行点击播放按钮，以确保界面完全加载、音画同步
    this._playbackReady = true;
    this._firstPlayback = true; // 标记为首次播放，需要倒计时
    
    this.setData({ 
      showPlaybackLoading: false,
      isPlaying: false,
      isPaused: false
    });
    
    console.log('[Playback] 播放界面准备就绪，等待用户点击播放');
  },
  
  /**
   * 为播放模式收起所有notations（单页模式）
   * 所有 module 的 canvas 初始均在 DOM 中（tempImagePath = null），保证渲染器可初始化。
   * 缓存命中的 module 在渲染器初始化后跳过 render() + convertCanvasToImage()，
   * 原因：切页后仅当前页在 DOM 中，退出播放恢复分页时非当前页 canvas 被销毁；再次进入播放时
   * 若仅对 toRender 初始化，则“来自缓存”的 module 未初始化渲染器，且其 canvas 被 tempImagePath 隐藏不在 DOM，
   * 无法后续初始化。直接复用上次的缓存图片，仅未命中的 module 做完整绘制，从而实现增量渲染。
   */
  collapseAllNotationsForPlayback() {
    // 确保 _canvasRenderers 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    if (!this._columnRectsCache) {
      this._columnRectsCache = {};
    }
    
    // 【优化】设置当前文件ID，切换文件时清除旧缓存
    const currentFileId = this.data.libraryFileId || this.data.libraryFileName || 'local_editing';
    PlaybackCanvasCacheManager.setCurrentFile(currentFileId);
    
    const orientation = this.data.orientation || 'portrait';
    const measuresPerRow = this.data.measuresPerRow || 1;
    const { toRender, fromCache } = PlaybackCanvasCacheManager.analyzeModules(
      this.data.notations,
      orientation,
      measuresPerRow
    );
    
    // 所有 module 的 canvas 都在 DOM 中（tempImagePath 初始为 null），保证渲染器可初始化
    // 缓存命中的 module 会在渲染器初始化后跳过 render + convertCanvasToImage，直接设置缓存图片
    this._cachedModuleImages = {};
    fromCache.forEach(c => {
      this._cachedModuleImages[c.moduleId] = c.imagePath;
    });
    
    const notations = this.data.notations.map((notation, index) => {
      const cachedInfo = fromCache.find(c => c.moduleId === notation.id);
      return {
        ...notation,
        collapsed: true,
        canvasHeight: this.calculateCanvasHeight(notation),
        tempImagePath: null,
        isCanvasEditing: false,
        cursorVisible: false,
        _contentHash: cachedInfo ? cachedInfo.hash :
          PlaybackCanvasCacheManager.generateModuleHash(notation, orientation, measuresPerRow)
      };
    });
    
    this._modulesToRender = this.data.notations.map((_, i) => i);
    this._moduleHashes = {};
    this.data.notations.forEach((n, i) => {
      this._moduleHashes[n.id] = PlaybackCanvasCacheManager.generateModuleHash(n, orientation, measuresPerRow);
    });
    
    console.log(`[Playback] 增量渲染：${notations.length} 个 module，缓存命中 ${fromCache.length} 个（跳过渲染），需重绘 ${toRender.length} 个`);
    
    this.setData({ notations }, () => {
      setTimeout(() => {
        // 【Bug修复】为所有 module 初始化渲染器，确保非本页 module 也有渲染器，光标与点击定位可用
        this.data.notations.forEach((notation, index) => {
          this.initCanvasRendererWithRetry(notation.id, index, 5);
        });
      }, 100);
    });
  },
  
  /**
   * 等待所有Canvas渲染器初始化完成（播放模式下需要所有module）
   */
  waitForAllCanvasInitialization() {
    return new Promise((resolve) => {
      const checkInterval = 100;
      const maxWaitTime = 8000; // 最多等待8秒（等待图片转换完成）
      let waitedTime = 0;
      
      const checkReady = () => {
        waitedTime += checkInterval;
        
        // 检查是否所有模块都已转换为图片（必须有tempImagePath）
        // 播放模式下必须等待图片转换完成，以避免Canvas2d层级过高的问题
        const notations = this.data.notations;
        
        let allReady = notations.every((notation, index) => {
          if (!notation.collapsed) return true;
          // 必须有tempImagePath才算准备就绪（图片转换完成）
          return !!notation.tempImagePath;
        });
        
        // 更新加载进度（基于图片转换完成数量）
        const readyCount = notations.filter((n, i) => 
          !n.collapsed || n.tempImagePath
        ).length;
        this.setData({ 
          playbackLoadingText: `加载谱面 (${readyCount}/${notations.length})...` 
        });
        
        if (allReady || waitedTime >= maxWaitTime) {
          if (waitedTime >= maxWaitTime && !allReady) {
            console.warn('[Playback] 等待图片转换超时，部分模块可能使用Canvas显示');
          }
          setTimeout(resolve, 50);
        } else {
          setTimeout(checkReady, checkInterval);
        }
      };
      
      setTimeout(checkReady, 150);
    });
  },
  
  /**
   * 预加载播放所需的音频资源
   * 在Canvas初始化的同时并行加载，减少等待时间
   */
  async preloadPlaybackAudio() {
    try {
      // 获取播放管理器实例
      const playbackMgr = await getSheetPlaybackManager();
      
      // 更新加载提示
      this.setData({ playbackLoadingText: '加载音频资源...' });
      
      // 分析所需音符并预加载
      const notations = this.data.notations;
      const notationType = this.data.notationType || 'digital';
      const requiredNotes = playbackMgr.analyzeRequiredNotes(notations, notationType);
      
      console.log('[Notation] 预加载音符:', Array.from(requiredNotes));
      
      // 加载音频
      const loadResult = await playbackMgr.loadSounds(requiredNotes, notationType);
      
      if (loadResult.loaded > 0) {
        console.log(`[Notation] 音频预加载完成: ${loadResult.loaded}个`);
      }
      
      return loadResult;
    } catch (e) {
      console.warn('[Notation] 音频预加载失败（播放时会重试）:', e.message);
      return { success: false, loaded: 0, failed: 0 };
    }
  },
  
  /**
   * 等待Canvas渲染器初始化完成
   * @returns {Promise} 当所有可见模块的Canvas初始化完成时resolve
   */
  waitForCanvasInitialization() {
    return new Promise((resolve) => {
      // 给予足够时间让Canvas节点就绪和渲染完成
      // collapseAllNotations 中使用 50ms 延迟初始化
      // initCanvasRenderer 完成后还需要 100ms 转换为图片
      const checkInterval = 100;
      const maxWaitTime = 2000; // 最多等待2秒
      let waitedTime = 0;
      
      const checkReady = () => {
        waitedTime += checkInterval;
        
        // 检查是否所有可见模块都已有渲染器或图片
        const visibleIndices = this.getVisibleModuleIndices();
        const notations = this.data.notations;
        
        let allReady = visibleIndices.every(index => {
          const notation = notations[index];
          if (!notation || !notation.collapsed) return true; // 未收起的不需要检查
          
          // 检查是否有图片或渲染器
          return notation.tempImagePath || 
                 (this._canvasRenderers && this._canvasRenderers[notation.id]);
        });
        
        if (allReady || waitedTime >= maxWaitTime) {
          // 额外等待一帧确保UI更新完成
          setTimeout(resolve, 50);
        } else {
          setTimeout(checkReady, checkInterval);
        }
      };
      
      // 首次检查给予更多初始化时间
      setTimeout(checkReady, 150);
    });
  },

  /**
   * 退出播放模式
   * 恢复分页状态和之前的阅读模式设置
   * 同时释放不必要的缓存以避免内存超限
   */
  exitPlaybackMode() {
    // 停止播放并清理播放器缓存（仅当已加载时）
    if (sheetPlaybackManager) {
      sheetPlaybackManager.stopPlayback();
      // 清除时间线缓存以释放内存
      sheetPlaybackManager.timeline = [];
      sheetPlaybackManager.currentEventIndex = 0;
      // 清除进度更新计时器
      sheetPlaybackManager._lastProgressUpdate = 0;
      
      // 清除音频缓冲区以释放大量内存（下次播放时会重新加载）
      // 注意：这会增加下次播放的加载时间，但能有效避免内存超限
      if (sheetPlaybackManager.audioBuffers && sheetPlaybackManager.audioBuffers.size > 20) {
        console.log('[Notation] 释放音频缓存，当前缓存数量:', sheetPlaybackManager.audioBuffers.size);
        // 保留系统音频（节拍器等），清除其他
        const systemAudios = ['_countdown', '_metronome'];
        for (const key of sheetPlaybackManager.audioBuffers.keys()) {
          if (!systemAudios.includes(key)) {
            sheetPlaybackManager.audioBuffers.delete(key);
          }
        }
      }
      
      // 清除增益节点缓存
      if (sheetPlaybackManager.gainNodes) {
        sheetPlaybackManager.gainNodes.forEach((node, key) => {
          if (key !== '_countdown' && key !== '_metronome') {
            try { node.disconnect(); } catch (e) {}
          }
        });
        // 只保留系统音频的增益节点
        const countdown = sheetPlaybackManager.gainNodes.get('_countdown');
        const metronome = sheetPlaybackManager.gainNodes.get('_metronome');
        sheetPlaybackManager.gainNodes.clear();
        if (countdown) sheetPlaybackManager.gainNodes.set('_countdown', countdown);
        if (metronome) sheetPlaybackManager.gainNodes.set('_metronome', metronome);
      }
    }

    // 清除播放光标动画
    this.clearPlaybackCursors();
    
    // 清除光标位置缓存
    if (this._columnRectsCache) {
      this._columnRectsCache = {};
    }
    
    // 清除播放模式增量渲染缓存映射
    this._cachedModuleImages = null;

    // 恢复之前的状态
    const savedState = this._savedPaginationState || {};
    this.setData({
      isPlaybackMode: false,
      isPlaying: false,
      isPaused: false,
      showPlaybackCountdown: false,
      showPlaybackLoading: false,
      playbackHighlightColumn: '',
      playbackPrevColumns: {},
      readingMode: this._savedReadingMode || false,
      // 恢复分页状态
      enablePagination: savedState.enablePagination !== undefined ? savedState.enablePagination : true,
      currentPage: savedState.currentPage || 0,
      currentPageModules: savedState.currentPageModules || [],
      pages: savedState.pages || [],
      // 重置播放控制状态
      showPlaybackSettings: false,
      showInlineTempoSlider: false,
      metronomeActive: false
    });

    // 清理保存的状态
    this._savedPaginationState = null;
    this._currentPlayingModuleIndex = -1;
    
    // 重置播放流程标记
    this._playbackReady = false;
    this._firstPlayback = false;

    // 如果之前不是阅读模式，展开所有notations
    if (!this._savedReadingMode) {
      this.expandAllNotations();
    }

    // 恢复底部导航栏
    wx.showTabBar({ animation: true });

    // 清理残影定时器
    if (this._fadeoutTimer) {
      clearTimeout(this._fadeoutTimer);
      this._fadeoutTimer = null;
    }
    
    // 触发垃圾回收提示（小程序环境下可能不生效，但不会有负面影响）
    console.log('[Notation] 播放模式已退出，内存缓存已清理');
  },

  /**
   * 开始播放
   */
  async startPlayback() {
    const notations = this.data.notations;
    // 优先使用播放界面设置的速度，若没有则使用全局速度
    const tempo = this.data.playbackTempo || this.data.globalTempo || 60;
    const notationType = this.data.notationType || 'digital';
    const startColumnId = this.data.playbackStartColumn;
    const pageInfo = {
      pages: this.data.pages,
      currentPage: this.data.currentPage
    };

    // 获取播放管理器实例（触发延迟加载）
    let playbackMgr;
    try {
      playbackMgr = await getSheetPlaybackManager();
    } catch (e) {
      console.error('[Notation] 加载播放模块失败:', e);
      wx.showToast({
        title: e.message || '加载失败',
        icon: 'none'
      });
      this.exitPlaybackMode();
      return;
    }

    // 设置回调
    playbackMgr.onLoadingStateChange = (isLoading, message) => {
      // 清除之前的超时计时器
      if (this._loadingTimeoutTimer) {
        clearTimeout(this._loadingTimeoutTimer);
        this._loadingTimeoutTimer = null;
      }
      
      this.setData({
        showPlaybackLoading: isLoading,
        playbackLoadingText: message || '加载中...'
      });
      
      // 【Bug修复】如果开始显示加载状态，设置超时保护（30秒后自动关闭）
      if (isLoading) {
        this._loadingTimeoutTimer = setTimeout(() => {
          console.warn('[Notation] 加载提示超时，自动关闭');
          if (this.data.showPlaybackLoading) {
            this.setData({ showPlaybackLoading: false });
          }
          this._loadingTimeoutTimer = null;
        }, 30000); // 30秒超时
      }
    };

    playbackMgr.onCountdownTick = (secondsLeft) => {
      this.setData({
        showPlaybackCountdown: secondsLeft > 0,
        countdownNumber: secondsLeft
      });
      
      // 倒计时结束时的特殊处理
      if (secondsLeft === 0) {
        // 显示 "♪" 符号并短暂延迟后隐藏
        this.setData({ showPlaybackCountdown: true, countdownNumber: 0 });
        setTimeout(() => {
          this.setData({ showPlaybackCountdown: false });
        }, 500);
      }
    };

    playbackMgr.onColumnHighlight = (columnInfo) => {
      this.handleColumnHighlight(columnInfo);
    };

    playbackMgr.onPageChange = (pageIndex, preloadNext) => {
      this.handlePlaybackPageChange(pageIndex, preloadNext);
    };

    playbackMgr.onPlaybackEnd = () => {
      this.handlePlaybackEnd();
    };
    
    // 进度更新回调
    playbackMgr.onProgressUpdate = (currentTime, duration) => {
      this.updatePlaybackProgress(currentTime, duration);
    };

    playbackMgr.onError = (error) => {
      console.error('[Notation] 播放错误:', error);
      wx.showToast({
        title: error.message || '播放出错',
        icon: 'none'
      });
      // 【Bug修复】确保在错误时重置播放状态
      this.setData({ isPlaying: false, isPaused: false });
      this.exitPlaybackMode();
    };

    // 【Bug修复】添加播放开始回调，确保状态在真正开始播放后设置
    playbackMgr.onPlaybackStart = () => {
      this.setData({ isPlaying: true, isPaused: false });
    };

    // 启动播放（根据 countdownEnabled 决定是否跳过倒计时）
    const playbackOptions = {
      skipCountdown: !this.data.countdownEnabled
    };
    
    try {
      // 先设置加载状态，避免用户认为无反应
      this.setData({ showPlaybackLoading: true, playbackLoadingText: '准备播放...' });
      
      await playbackMgr.startPlayback(
        notations,
        tempo,
        notationType,
        startColumnId,
        pageInfo,
        playbackOptions
      );
      
      // 播放成功启动后隐藏加载提示，设置播放状态
      // 注意：如果有倒计时，isPlaying 会在倒计时结束后由 onPlaybackStart 回调设置
      this.setData({ 
        showPlaybackLoading: false,
        isPlaying: true, 
        isPaused: false 
      });
    } catch (e) {
      console.error('[Notation] 启动播放失败:', e);
      this.setData({ showPlaybackLoading: false, isPlaying: false, isPaused: false });
      this.exitPlaybackMode();
    }
  },

  /**
   * 取消播放倒计时，立即开始播放
   */
  cancelPlaybackCountdown() {
    if (sheetPlaybackManager) {
      sheetPlaybackManager.skipCountdown();
    }
    this.setData({ showPlaybackCountdown: false });
  },

  /**
   * 停止播放
   */
  stopPlayback() {
    if (sheetPlaybackManager) {
      sheetPlaybackManager.stopPlayback();
    }
    this.exitPlaybackMode();
  },

  /**
   * 切换播放/暂停状态
   * 首次点击播放时会触发倒计时动画（如果启用），暂停后继续则直接恢复
   */
  togglePlayPause() {
    if (this.data.isPlaying) {
      // 暂停播放
      if (sheetPlaybackManager) {
        sheetPlaybackManager.pausePlayback();
      }
      this.setData({ isPlaying: false, isPaused: true });
    } else if (this.data.isPaused) {
      // 检查播放管理器是否真正在暂停状态（区分点击定位 vs 真正暂停）
      const isReallyPaused = sheetPlaybackManager && sheetPlaybackManager.isPaused;
      const isReallyPlaying = sheetPlaybackManager && sheetPlaybackManager.isPlaying;
      
      if (isReallyPaused && !this.data.countdownEnabled) {
        // 从真正的暂停状态恢复播放（倒计时关闭时直接恢复）
        sheetPlaybackManager.resumePlayback();
        this.setData({ isPlaying: true, isPaused: false });
      } else if (isReallyPaused && this.data.countdownEnabled) {
        // 倒计时开启时，需要重新开始播放（带倒计时）
        this._firstPlayback = false;
        this.startPlayback();
      } else if (!isReallyPlaying) {
        // 【Bug修复】播放管理器没有真正在播放（可能是之前播放失败或从未开始）
        // 需要重新开始播放，而不是尝试恢复
        this._firstPlayback = false;
        this.setData({ isPaused: false }); // 重置UI暂停状态
        this.startPlayback();
      } else {
        // 从点击定位状态开始播放
        this._firstPlayback = false;
        this.startPlayback();
      }
    } else if (this._firstPlayback) {
      // 首次播放 - 根据设置决定是否倒计时
      this._firstPlayback = false;
      this.startPlayback();
    } else {
      // 从头开始播放（比如播放结束后再次点击）
      this._firstPlayback = true; // 重置为首次播放状态
      this.startPlayback();
    }
  },
  
  /**
   * 终止播放并退出播放模式
   */
  stopAndExitPlayback() {
    wx.showModal({
      title: '结束播放',
      content: '确定要退出播放模式吗？',
      confirmText: '退出',
      confirmColor: '#e57373',
      success: (res) => {
        if (res.confirm) {
          this.exitPlaybackMode();
        }
      }
    });
  },
  
  /**
   * 跳转到上一个module开始播放
   */
  playbackPrevModule() {
    if (!sheetPlaybackManager) return;
    
    const currentModuleIndex = this._currentPlayingModuleIndex || 0;
    const prevModuleIndex = Math.max(0, currentModuleIndex - 1);
    
    if (prevModuleIndex !== currentModuleIndex) {
      // 从上一个module的第一列开始
      const startColumnId = `${prevModuleIndex}-0-0-0`;
      sheetPlaybackManager.seekToColumn(startColumnId);
      
      wx.showToast({
        title: `跳转到第${prevModuleIndex + 1}段`,
        icon: 'none',
        duration: 1000
      });
    }
  },
  
  /**
   * 跳转到下一个module开始播放
   */
  playbackNextModule() {
    if (!sheetPlaybackManager) return;
    
    const currentModuleIndex = this._currentPlayingModuleIndex || 0;
    const maxModuleIndex = this.data.notations.length - 1;
    const nextModuleIndex = Math.min(maxModuleIndex, currentModuleIndex + 1);
    
    if (nextModuleIndex !== currentModuleIndex) {
      // 从下一个module的第一列开始
      const startColumnId = `${nextModuleIndex}-0-0-0`;
      sheetPlaybackManager.seekToColumn(startColumnId);
      
      wx.showToast({
        title: `跳转到第${nextModuleIndex + 1}段`,
        icon: 'none',
        duration: 1000
      });
    }
  },
  
  /**
   * 切换内联速度调节杠显示
   */
  toggleInlineTempoSlider() {
    this.setData({ showInlineTempoSlider: !this.data.showInlineTempoSlider });
  },
  
  /**
   * 内联速度调节杠变化
   */
  onInlineTempoChange(e) {
    const tempo = e.detail.value;
    this.setData({ playbackTempo: tempo });
    
    // 实时更新播放速度
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setTempo(tempo);
    }
  },
  
  /**
   * 速度滑动条触摸开始
   */
  onTempoTrackTouchStart(e) {
    this._tempoTrackTouching = true;
    this._updateTempoFromTouch(e);
  },
  
  /**
   * 速度滑动条触摸移动
   */
  onTempoTrackTouchMove(e) {
    if (!this._tempoTrackTouching) return;
    this._updateTempoFromTouch(e);
  },
  
  /**
   * 速度滑动条触摸结束
   */
  onTempoTrackTouchEnd() {
    this._tempoTrackTouching = false;
  },
  
  /**
   * 根据触摸位置更新速度值
   * 范围：20~180 BPM
   * 拇指使用 bottom + translateY(50%)，视觉中心在“数值线”上方约半颗拇指，需补偿使手指与拇指中心对齐
   */
  _updateTempoFromTouch(e) {
    const touch = e.touches[0];
    const query = wx.createSelectorQuery().in(this);
    query.select('.inline-tempo-track').boundingClientRect((rect) => {
      if (!rect) return;
      
      // 计算触摸位置相对于轨道的比例（从底部算起，0=20bpm，1=180bpm）
      const trackHeight = rect.height;
      const touchY = touch.clientY - rect.top;
      const ratio = 1 - (touchY / trackHeight);
      
      // 拇指视觉中心比 bottom 高约半颗拇指（轨道 380rpx、拇指 40rpx → 约 5.26%），
      // 手指在 R 时应对应“拇指中心在 R”，故取值用 R - 半拇指比例
      const thumbHalfRatio = 20 / 380;
      const adjustedRatio = ratio - thumbHalfRatio;
      const clampedRatio = Math.max(0, Math.min(1, adjustedRatio));
      const tempo = Math.round(20 + clampedRatio * 160);
      
      this.setData({ playbackTempo: tempo });
      
      // 实时更新播放速度
      if (sheetPlaybackManager) {
        sheetPlaybackManager.setTempo(tempo);
      }
    }).exec();
  },
  
  /**
   * 设置预设速度档位
   */
  setTempoPreset(e) {
    const tempo = parseInt(e.currentTarget.dataset.tempo, 10);
    if (isNaN(tempo)) return;
    
    this.setData({ playbackTempo: tempo });
    
    // 实时更新播放速度
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setTempo(tempo);
    }
  },
  
  /**
   * 速度输入框内容变化
   */
  onTempoInputChange(e) {
    const value = e.detail.value;
    // 输入过程中暂不更新，等blur时再处理
  },
  
  /**
   * 速度输入框失焦 - 应用输入值
   */
  onTempoInputBlur(e) {
    let tempo = parseInt(e.detail.value, 10);
    
    // 验证范围
    if (isNaN(tempo) || tempo < 5) {
      tempo = 5;
    } else if (tempo > 200) {
      tempo = 200;
    }
    
    this.setData({ playbackTempo: tempo });
    
    // 实时更新播放速度
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setTempo(tempo);
    }
  },
  
  /**
   * 显示速度调节滑块（弹窗方式，保留备用）
   */
  showTempoSlider() {
    this.setData({ showTempoSlider: true });
  },
  
  /**
   * 隐藏速度调节滑块
   */
  hideTempoSlider() {
    this.setData({ showTempoSlider: false });
  },
  
  /**
   * 速度改变处理
   */
  onTempoChange(e) {
    const tempo = e.detail.value;
    this.setData({ playbackTempo: tempo });
    
    // 实时更新播放速度
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setTempo(tempo);
    }
  },
  
  /**
   * 切换播放模式（单曲/循环）
   */
  togglePlaybackMode() {
    const newMode = this.data.playbackMode === 'single' ? 'loop' : 'single';
    this.setData({ playbackMode: newMode });
    
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setLoopMode(newMode === 'loop');
    }
    
    wx.showToast({
      title: newMode === 'loop' ? '循环播放' : '单曲播放',
      icon: 'none',
      duration: 1000
    });
  },
  
  /**
   * 设置播放模式为单曲
   */
  setPlaybackModeSingle() {
    this.setData({ playbackMode: 'single' });
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setLoopMode(false);
    }
  },
  
  /**
   * 设置播放模式为循环
   */
  setPlaybackModeLoop() {
    this.setData({ playbackMode: 'loop' });
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setLoopMode(true);
    }
  },
  
  /**
   * 切换播放节拍器
   */
  togglePlaybackMetronome() {
    const newState = !this.data.metronomeActive;
    this.setData({ metronomeActive: newState });
    
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setMetronome(newState);
    }
  },
  
  /**
   * 显示播放设置面板
   */
  togglePlaybackSettings() {
    this.setData({ showPlaybackSettings: !this.data.showPlaybackSettings });
  },
  
  /**
   * 隐藏播放设置面板
   */
  hidePlaybackSettings() {
    this.setData({ showPlaybackSettings: false });
  },
  
  /**
   * 切换视角跟随（开关控件）
   */
  toggleFollowCursor(e) {
    const follow = e.detail.value;
    this.setData({ playbackFollowCursor: follow });
  },
  
  /**
   * 切换视角跟随（按钮点击）
   */
  toggleFollowCursorBtn() {
    const follow = !this.data.playbackFollowCursor;
    this.setData({ playbackFollowCursor: follow });
    wx.showToast({
      title: follow ? '视角跟随已开启' : '视角跟随已关闭',
      icon: 'none',
      duration: 1000
    });
  },
  
  /**
   * 切换倒计时开关
   */
  toggleCountdown() {
    const enabled = !this.data.countdownEnabled;
    this.setData({ countdownEnabled: enabled });
  },
  
  /**
   * 从头开始播放
   */
  replayFromStart() {
    // 重置到第一列
    const startColumnId = '0-0-0-0';
    this.setData({ 
      playbackStartColumn: startColumnId,
      playbackProgress: 0,
      playbackCurrentTimeStr: '0:00'
    });
    
    // 如果播放管理器已初始化，跳转到开头
    if (sheetPlaybackManager && sheetPlaybackManager.timeline && sheetPlaybackManager.timeline.length > 0) {
      sheetPlaybackManager.seekToColumn(startColumnId);
      
      // 更新光标到开头
      const firstEvent = sheetPlaybackManager.timeline.find(e => !e.isGraceNote);
      if (firstEvent && this.onColumnHighlight) {
        this.handleColumnHighlight({
          columnId: firstEvent.columnId,
          pageIndex: firstEvent.pageIndex,
          moduleIndex: firstEvent.moduleIndex
        });
      }
    }
    
    // 如果当前已暂停或未播放，标记为从头播放状态
    if (!this.data.isPlaying) {
      this._firstPlayback = true;
      this.setData({ isPaused: false });
    }
    
    // 开始播放
    this.startPlayback();
  },
  
  /**
   * 向左移动一列（已播放的上一个位置）
   */
  moveColumnLeft() {
    if (!sheetPlaybackManager || !sheetPlaybackManager.timeline || sheetPlaybackManager.timeline.length === 0) return;
    
    // 如果正在播放，先暂停
    const wasPlaying = this.data.isPlaying;
    if (wasPlaying) {
      sheetPlaybackManager.pausePlayback();
      this.setData({ isPlaying: false, isPaused: true });
    }
    
    // 获取当前位置，向前移动
    let currentIndex = sheetPlaybackManager.currentEventIndex;
    
    // 找到上一个非装饰音的事件
    let prevIndex = currentIndex - 1;
    while (prevIndex >= 0 && sheetPlaybackManager.timeline[prevIndex].isGraceNote) {
      prevIndex--;
    }
    
    if (prevIndex < 0) {
      prevIndex = 0;
    }
    
    const targetEvent = sheetPlaybackManager.timeline[prevIndex];
    if (targetEvent) {
      sheetPlaybackManager.currentEventIndex = prevIndex;
      
      // 更新进度条
      const totalDuration = sheetPlaybackManager.getTotalDuration();
      const progress = totalDuration > 0 ? (targetEvent.absoluteTime / totalDuration) * 100 : 0;
      this.setData({
        playbackProgress: progress,
        playbackCurrentTimeStr: this.formatPlaybackTime(targetEvent.absoluteTime),
        playbackStartColumn: targetEvent.columnId
      });
      
      // 更新播放偏移
      sheetPlaybackManager.playbackOffset = targetEvent.absoluteTime;
      
      // 触发光标更新
      if (targetEvent.columnId) {
        this.handleColumnHighlight({
          columnId: targetEvent.columnId,
          pageIndex: targetEvent.pageIndex,
          moduleIndex: targetEvent.moduleIndex
        });
        
        // 播放该位置的声音
        const parts = targetEvent.columnId.split('-');
        if (parts.length === 4) {
          const moduleIndex = parseInt(parts[0], 10);
          const measureIndex = parseInt(parts[1], 10);
          const beatIndex = parseInt(parts[2], 10);
          const subIndex = parseInt(parts[3], 10);
          this._playColumnNotes(moduleIndex, measureIndex, beatIndex, subIndex);
        }
      }
    }
  },
  
  /**
   * 向右移动一列（下一个位置）
   */
  moveColumnRight() {
    if (!sheetPlaybackManager || !sheetPlaybackManager.timeline || sheetPlaybackManager.timeline.length === 0) return;
    
    // 如果正在播放，先暂停
    const wasPlaying = this.data.isPlaying;
    if (wasPlaying) {
      sheetPlaybackManager.pausePlayback();
      this.setData({ isPlaying: false, isPaused: true });
    }
    
    // 获取当前位置，向后移动
    let currentIndex = sheetPlaybackManager.currentEventIndex;
    
    // 找到下一个非装饰音的事件
    let nextIndex = currentIndex + 1;
    while (nextIndex < sheetPlaybackManager.timeline.length && sheetPlaybackManager.timeline[nextIndex].isGraceNote) {
      nextIndex++;
    }
    
    if (nextIndex >= sheetPlaybackManager.timeline.length) {
      nextIndex = sheetPlaybackManager.timeline.length - 1;
      // 找到最后一个非装饰音事件
      while (nextIndex >= 0 && sheetPlaybackManager.timeline[nextIndex].isGraceNote) {
        nextIndex--;
      }
    }
    
    const targetEvent = sheetPlaybackManager.timeline[nextIndex];
    if (targetEvent) {
      sheetPlaybackManager.currentEventIndex = nextIndex;
      
      // 更新进度条
      const totalDuration = sheetPlaybackManager.getTotalDuration();
      const progress = totalDuration > 0 ? (targetEvent.absoluteTime / totalDuration) * 100 : 0;
      this.setData({
        playbackProgress: progress,
        playbackCurrentTimeStr: this.formatPlaybackTime(targetEvent.absoluteTime),
        playbackStartColumn: targetEvent.columnId
      });
      
      // 更新播放偏移
      sheetPlaybackManager.playbackOffset = targetEvent.absoluteTime;
      
      // 触发光标更新
      if (targetEvent.columnId) {
        this.handleColumnHighlight({
          columnId: targetEvent.columnId,
          pageIndex: targetEvent.pageIndex,
          moduleIndex: targetEvent.moduleIndex
        });
        
        // 播放该位置的声音
        const parts = targetEvent.columnId.split('-');
        if (parts.length === 4) {
          const moduleIndex = parseInt(parts[0], 10);
          const measureIndex = parseInt(parts[1], 10);
          const beatIndex = parseInt(parts[2], 10);
          const subIndex = parseInt(parts[3], 10);
          this._playColumnNotes(moduleIndex, measureIndex, beatIndex, subIndex);
        }
      }
    }
  },
  
  /**
   * 进度条拖动
   */
  onProgressDrag(e) {
    if (!sheetPlaybackManager) return;
    
    const touch = e.touches[0];
    const query = wx.createSelectorQuery().in(this);
    query.select('.player-progress-track').boundingClientRect((rect) => {
      if (!rect) return;
      
      const x = touch.clientX - rect.left;
      const progress = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      // 更新显示
      this.setData({ playbackProgress: progress });
      
      // 实时更新时间显示
      const totalDuration = sheetPlaybackManager.getTotalDuration();
      const currentTime = (progress / 100) * totalDuration;
      this.setData({
        playbackCurrentTimeStr: this.formatPlaybackTime(currentTime)
      });
    }).exec();
  },
  
  /**
   * 节拍器音量改变
   */
  onMetronomeVolumeChange(e) {
    const volume = e.detail.value;
    this.setData({ metronomeVolume: volume });
    
    if (sheetPlaybackManager) {
      sheetPlaybackManager.setMetronomeVolume(volume / 100);
    }
  },
  
  /**
   * 进度条点击跳转
   */
  seekPlayback(e) {
    if (!sheetPlaybackManager) return;
    
    const touch = e.touches ? e.touches[0] : e;
    const query = wx.createSelectorQuery().in(this);
    query.select('.playback-progress-track').boundingClientRect((rect) => {
      if (!rect) return;
      
      const x = touch.clientX - rect.left;
      const progress = Math.max(0, Math.min(100, (x / rect.width) * 100));
      
      sheetPlaybackManager.seekToProgress(progress);
      this.setData({ playbackProgress: progress });
    }).exec();
  },
  
  /**
   * 阻止事件冒泡
   */
  preventBubble() {
    // 空函数，仅用于阻止事件冒泡
  },
  
  /**
   * 格式化时间显示
   */
  formatPlaybackTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  },
  
  /**
   * 更新播放进度（由播放管理器回调）
   */
  updatePlaybackProgress(currentTime, duration) {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    this.setData({
      playbackProgress: progress,
      playbackCurrentTime: currentTime,
      playbackDuration: duration,
      playbackCurrentTimeStr: this.formatPlaybackTime(currentTime),
      playbackDurationStr: this.formatPlaybackTime(duration)
    });
  },

  /**
   * 处理列高亮 - 使用 View 层光标 + CSS transition 实现流畅动画
   * 支持光标可见性控制：只在播放当前module时显示光标
   */
  handleColumnHighlight(columnInfo) {
    const { columnId, pageIndex, moduleIndex: currentModuleIdx } = columnInfo;
    const prevColumn = this.data.playbackHighlightColumn;

    // 更新高亮列状态（仅用于 View 模式的 CSS 类切换）
    const playbackPrevColumns = { ...this.data.playbackPrevColumns };
    
    // 清除之前的淡出列
    if (this._fadeoutTimer) {
      clearTimeout(this._fadeoutTimer);
    }

    // 将上一个高亮列标记为淡出
    if (prevColumn) {
      playbackPrevColumns[prevColumn] = true;
    }

    const updateData = {
      playbackHighlightColumn: columnId,
      playbackPrevColumns
    };

    // 解析columnId获取高亮位置 (moduleIndex-measureIndex-beatIndex-subdivisionIndex)
    if (columnId) {
      const parts = columnId.split('-');
      if (parts.length === 4) {
        const moduleIndex = parseInt(parts[0], 10);
        const measureIndex = parseInt(parts[1], 10);
        const beatIndex = parseInt(parts[2], 10);
        const subIndex = parseInt(parts[3], 10);
        
        // ===== 光标可见性控制 =====
        // 检查是否切换了module
        const prevModuleIndex = this._currentPlayingModuleIndex;
        if (moduleIndex !== prevModuleIndex) {
          // 隐藏前一个module的光标
          if (prevModuleIndex >= 0 && prevModuleIndex < this.data.notations.length) {
            updateData[`notations[${prevModuleIndex}].cursorVisible`] = false;
          }
          // 显示当前module的光标
          updateData[`notations[${moduleIndex}].cursorVisible`] = true;
          this._currentPlayingModuleIndex = moduleIndex;
          
          // 【Bug修复】切换module时预检查渲染器是否存在，不存在则预先重建
          const notation = this.data.notations[moduleIndex];
          if (notation && !this._canvasRenderers[notation.id]) {
            console.log('[Playback] 切换module时检测到渲染器丢失，预先重建:', notation.id);
            // 触发渲染器重建（会在animatePlaybackCursor中处理）
          }
        } else {
          // 在同一module内播放时，确保光标可见性为true（修复播放时光标消失的问题）
          // 因为可能在初始化时cursorVisible为false，需要确保播放时始终为true
          if (this.data.notations[moduleIndex] && !this.data.notations[moduleIndex].cursorVisible) {
            updateData[`notations[${moduleIndex}].cursorVisible`] = true;
          }
        }
        
        // 获取当前模块对应的notation
        const notation = this.data.notations[moduleIndex];
        if (notation && notation.collapsed) {
          // 先更新数据（包括可见性）
          this.setData(updateData, () => {
            // 然后移动光标
            this.animatePlaybackCursor(notation.id, measureIndex, beatIndex, subIndex);
          });
          
          // 延迟清除淡出效果
          this._fadeoutTimer = setTimeout(() => {
            if (prevColumn) {
              const newPrevColumns = { ...this.data.playbackPrevColumns };
              delete newPrevColumns[prevColumn];
              this.setData({ playbackPrevColumns: newPrevColumns });
            }
          }, 600);
          return; // 已在回调中处理
        }
      }
    }

    this.setData(updateData);

    // 延迟清除淡出效果
    this._fadeoutTimer = setTimeout(() => {
      if (prevColumn) {
        const newPrevColumns = { ...this.data.playbackPrevColumns };
        delete newPrevColumns[prevColumn];
        this.setData({ playbackPrevColumns: newPrevColumns });
      }
    }, 600);
  },
  
  /**
   * 使用 animate API 移动播放光标（高性能，不使用 setData）
   * 修复：确保简谱模式下也能正确移动光标
   * @param {string} notationId - 谱面ID
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   */
  animatePlaybackCursor(notationId, measureIndex, beatIndex, subIndex) {
    // 确保 _canvasRenderers 和 _columnRectsCache 存在
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    if (!this._columnRectsCache) {
      this._columnRectsCache = {};
    }
    
    // 从缓存获取列坐标
    let columnRects = this._columnRectsCache[notationId];
    
    // 如果没有缓存或为空，尝试从渲染器获取
    if (!columnRects || columnRects.length === 0) {
      let renderer = this._canvasRenderers[notationId];
      
      // 【Bug修复】如果渲染器不存在，尝试重新初始化
      if (!renderer) {
        console.warn('[Playback] 渲染器不存在，尝试重建:', notationId);
        
        // 查找该notation的索引
        const notationIndex = this.data.notations.findIndex(n => n.id === notationId);
        if (notationIndex !== -1) {
          // 异步重建渲染器，并在完成后重试光标移动
          this._rebuildRendererAndRetryCursor(notationId, notationIndex, measureIndex, beatIndex, subIndex);
        } else {
          console.warn('[Playback] 无法找到notation索引:', notationId);
        }
        return;
      }
      
      if (renderer) {
        // 尝试直接获取特定列的坐标（最高效）
        const rect = renderer.getColumnRect(measureIndex, beatIndex, subIndex);
        if (rect) {
          this.doAnimateCursor(notationId, rect);
          return;
        }
        
        // 尝试获取所有列坐标并缓存
        columnRects = renderer.getAllColumnRects();
        if (columnRects && columnRects.length > 0) {
          this._columnRectsCache[notationId] = columnRects;
          console.log('[Playback] 延迟获取列坐标缓存:', notationId, ', 列数:', columnRects.length);
        } else {
          console.warn('[Playback] 渲染器返回空列坐标:', notationId);
        }
      }
    }
    
    if (!columnRects || columnRects.length === 0) {
      console.warn('[Playback] 无法获取列坐标:', notationId);
      return;
    }
    
    // 查找对应的列坐标
    const targetRect = columnRects.find(col => 
      col.measureIndex === measureIndex && 
      col.beatIndex === beatIndex && 
      col.subIndex === subIndex
    );
    
    if (targetRect) {
      this.doAnimateCursor(notationId, targetRect);
    } else {
      // 调试：输出可用的列信息帮助定位问题
      console.warn('[Playback] 未找到目标列:', notationId, 
        `目标:(${measureIndex},${beatIndex},${subIndex})`,
        '可用列数:', columnRects.length,
        '首列:', columnRects[0] ? `(${columnRects[0].measureIndex},${columnRects[0].beatIndex},${columnRects[0].subIndex})` : 'N/A');
    }
  },
  
  /**
   * 【Bug修复】重建丢失的渲染器并重试光标移动
   * 当播放过程中发现渲染器丢失时，尝试重新初始化并恢复光标
   * @param {string} notationId - 谱面ID
   * @param {number} notationIndex - 谱面索引
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   */
  _rebuildRendererAndRetryCursor(notationId, notationIndex, measureIndex, beatIndex, subIndex) {
    // 防止重复重建
    if (this._rebuildingRenderers && this._rebuildingRenderers[notationId]) {
      console.log('[Playback] 渲染器正在重建中，跳过:', notationId);
      return;
    }
    
    // 标记正在重建
    if (!this._rebuildingRenderers) {
      this._rebuildingRenderers = {};
    }
    this._rebuildingRenderers[notationId] = true;
    
    // 使用带重试的初始化方法
    console.log('[Playback] 开始重建渲染器:', notationId);
    
    // 获取Canvas节点并初始化渲染器
    const canvasId = `notation-canvas-${notationId}`;
    const query = wx.createSelectorQuery();
    query.select(`#${canvasId}`).fields({ node: true, size: true }).exec((res) => {
      // 清除重建标记
      delete this._rebuildingRenderers[notationId];
      
      if (!res || !res[0] || !res[0].node) {
        console.warn('[Playback] 重建渲染器失败，Canvas节点不存在:', canvasId);
        return;
      }
      
      const canvas = res[0].node;
      const width = res[0].width;
      const height = res[0].height;
      
      if (width === 0 || height === 0) {
        console.warn('[Playback] 重建渲染器失败，Canvas尺寸为0:', canvasId);
        return;
      }
      
      // 获取最新的notation数据
      const notation = this.data.notations[notationIndex];
      if (!notation || notation.id !== notationId) {
        console.warn('[Playback] 重建渲染器失败，notation数据不匹配');
        return;
      }
      
      // 创建渲染器实例（含已缓存的琶音图）
      const CanvasNotationRenderer = require('../../utils/canvasRenderer').CanvasNotationRenderer;
      const renderer = new CanvasNotationRenderer(this.getCanvasRendererOptions());
      
      // 初始化Canvas
      renderer.init(canvas, width, height);
      
      // 设置数据
      renderer.setData(notation, this.data.orientation, notation.measuresPerRow || this.data.measuresPerRow);
      
      // 渲染
      renderer.render();
      
      // 保存渲染器实例
      this._canvasRenderers[notationId] = renderer;
      
      this.loadArpeggioImageIfNeeded(canvas);
      
      // 获取列坐标并缓存
      const columnRects = renderer.getAllColumnRects();
      if (columnRects && columnRects.length > 0) {
        this._columnRectsCache[notationId] = columnRects;
        console.log('[Playback] 渲染器重建成功:', notationId, '列数:', columnRects.length);
        
        // 重试移动光标
        setTimeout(() => {
          this.animatePlaybackCursor(notationId, measureIndex, beatIndex, subIndex);
        }, 50);
      } else {
        console.warn('[Playback] 渲染器重建后列坐标为空:', notationId);
      }
    });
  },
  
  /**
   * 执行光标动画
   * 优化版：使用CSS transition实现平滑移动，支持视角跟随
   * @param {string} notationId - 谱面ID
   * @param {Object} rect - 目标位置 {x, y, width, height}
   */
  doAnimateCursor(notationId, rect) {
    const cursorSelector = `#cursor-${notationId}`;
    
    // 找到对应的notation索引
    const notations = this.data.notations;
    const index = notations.findIndex(n => n.id === notationId);
    if (index === -1) return;
    
    // 使用 setData 同时更新尺寸和位置，让CSS transition处理动画
    const updateData = {};
    
    // 确保光标可见性为true（修复播放时光标消失的问题）
    if (!notations[index].cursorVisible) {
      updateData[`notations[${index}].cursorVisible`] = true;
    }
    
    // 更新光标尺寸（如果需要）
    if (notations[index].cursorWidth !== rect.width) {
      updateData[`notations[${index}].cursorWidth`] = rect.width;
    }
    if (notations[index].cursorHeight !== rect.height) {
      updateData[`notations[${index}].cursorHeight`] = rect.height;
    }
    
    // 更新光标位置
    updateData[`notations[${index}].cursorX`] = rect.x;
    updateData[`notations[${index}].cursorY`] = rect.y;
    
    // 只有在有变化时才更新
    if (Object.keys(updateData).length > 0) {
      this.setData(updateData);
    }
    
    // 注意：不再使用 this.animate() API，因为它设置的 transform 会与 style 中的 transform 冲突
    // 改为完全依赖 CSS transition 来实现平滑移动（在 .playback-cursor 中已设置 transition: transform 60ms）
    
    // ======== 视角跟随光标 ========
    if (this.data.playbackFollowCursor && this.data.isPlaying) {
      this.scrollToCursor(notationId, rect, index);
    }
  },
  
  /**
   * 滚动页面使光标保持在视野中央
   * @param {string} notationId - 谱面ID
   * @param {Object} rect - 光标在module内的位置
   * @param {number} moduleIndex - module索引
   */
  scrollToCursor(notationId, rect, moduleIndex) {
    // 防抖：避免频繁滚动
    if (this._scrollDebounceTimer) {
      clearTimeout(this._scrollDebounceTimer);
    }
    
    this._scrollDebounceTimer = setTimeout(() => {
      // 获取module容器的位置
      const query = wx.createSelectorQuery().in(this);
      query.select(`#notation-container-${notationId}`).boundingClientRect();
      query.selectViewport().scrollOffset();
      query.exec((res) => {
        if (!res || !res[0] || !res[1]) return;
        
        const containerRect = res[0];
        const scrollInfo = res[1];
        const windowInfo = wx.getWindowInfo();
        const screenHeight = windowInfo.windowHeight;
        
        // 计算光标在屏幕上的绝对Y位置
        const cursorAbsoluteY = containerRect.top + rect.y + rect.height / 2;
        
        // 目标：让光标保持在屏幕中央偏上位置（约40%的位置）
        const targetScreenY = screenHeight * 0.4;
        
        // 计算需要滚动的距离
        const scrollDelta = cursorAbsoluteY - targetScreenY;
        
        // 只有当光标偏离目标位置超过一定阈值时才滚动
        if (Math.abs(scrollDelta) > screenHeight * 0.15) {
          const targetScrollTop = Math.max(0, scrollInfo.scrollTop + scrollDelta);
          
          wx.pageScrollTo({
            scrollTop: targetScrollTop,
            duration: 150 // 平滑滚动
          });
        }
      });
    }, 50); // 50ms 防抖
  },
  
  /**
   * 更新光标尺寸（内部方法）
   * @deprecated 使用 doAnimateCursor 代替，它会同时更新尺寸和位置
   */
  updateCursorSize(notationId, width, height) {
    const notations = this.data.notations;
    const index = notations.findIndex(n => n.id === notationId);
    if (index !== -1) {
      const updateData = {};
      if (notations[index].cursorWidth !== width) {
        updateData[`notations[${index}].cursorWidth`] = width;
      }
      if (notations[index].cursorHeight !== height) {
        updateData[`notations[${index}].cursorHeight`] = height;
      }
      if (Object.keys(updateData).length > 0) {
        this.setData(updateData);
      }
    }
  },
  
  /**
   * 初始化播放光标（进入播放模式时调用）
   * 所有光标初始为隐藏状态，只有播放到对应module时才显示
   * 修复：确保简谱模式下也能正确初始化光标
   */
  initPlaybackCursors() {
    // 确保缓存对象存在
    if (!this._columnRectsCache) {
      this._columnRectsCache = {};
    }
    if (!this._canvasRenderers) {
      this._canvasRenderers = {};
    }
    
    // 记录当前播放的module索引（初始为-1表示未开始）
    this._currentPlayingModuleIndex = -1;
    
    const notations = this.data.notations;
    const updateData = {};
    
    console.log('[Playback] 初始化播放光标, notationType:', this.data.notationType, ', modules:', notations.length);
    
    notations.forEach((notation, index) => {
      // 所有光标初始隐藏
      updateData[`notations[${index}].cursorVisible`] = false;
      
      if (notation.collapsed) {
        // 获取列坐标缓存
        let columnRects = this._columnRectsCache[notation.id];
        
        // 如果没有缓存，尝试从渲染器获取
        if (!columnRects || columnRects.length === 0) {
          const renderer = this._canvasRenderers[notation.id];
          if (renderer) {
            columnRects = renderer.getAllColumnRects();
            this._columnRectsCache[notation.id] = columnRects;
            console.log('[Playback] 从渲染器获取列坐标:', notation.id, ', 列数:', columnRects.length);
          } else {
            // 【Bug修复】渲染器不存在时，尝试重建
            console.warn('[Playback] 渲染器不存在，尝试重建:', notation.id);
            this.initCanvasRendererForModuleWithRetry(notation.id, index, 5);
          }
        }
        
        if (columnRects && columnRects.length > 0) {
          const firstRect = columnRects[0];
          // 预设光标尺寸和位置（但保持隐藏）
          updateData[`notations[${index}].cursorWidth`] = firstRect.width;
          updateData[`notations[${index}].cursorHeight`] = firstRect.height;
          updateData[`notations[${index}].cursorX`] = firstRect.x;
          updateData[`notations[${index}].cursorY`] = firstRect.y;
          console.log('[Playback] 设置光标初始位置:', notation.id, firstRect);
        } else {
          console.warn('[Playback] 没有列坐标缓存:', notation.id);
        }
      }
    });
    
    this.setData(updateData);
  },
  
  /**
   * 清除播放光标 - 隐藏所有module的光标
   */
  clearPlaybackCursors() {
    const notations = this.data.notations;
    const updateData = {};
    
    // 隐藏所有光标
    notations.forEach((notation, index) => {
      updateData[`notations[${index}].cursorVisible`] = false;
    });
    
    // 重置当前播放module索引
    this._currentPlayingModuleIndex = -1;
    
    this.setData(updateData);
  },

  /**
   * 处理播放过程中的翻页
   * 注意：播放模式下已禁用分页（单页滚动模式），此函数不应执行切页
   */
  handlePlaybackPageChange(pageIndex, preloadNext) {
    // 播放模式下禁用分页，所有module都在一页，不需要切页
    if (!this.data.enablePagination) {
      return;
    }
    
    if (pageIndex !== this.data.currentPage) {
      // 执行翻页（仅在非播放模式或启用分页时）
      const pages = this.data.pages;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const pageModules = pages[pageIndex].modules;
        this.setData({
          currentPage: pageIndex,
          currentPageModules: pageModules
        });
      }
    }
  },

  /**
   * 处理播放结束
   */
  handlePlaybackEnd() {
    // 隐藏最后一个module的光标
    if (this._currentPlayingModuleIndex >= 0) {
      const updateData = {};
      updateData[`notations[${this._currentPlayingModuleIndex}].cursorVisible`] = false;
      this.setData(updateData);
    }
    
    // 检查是否为循环模式
    if (this.data.playbackMode === 'loop') {
      // 循环模式：从头开始
      wx.showToast({
        title: '循环播放中...',
        icon: 'none',
        duration: 1000
      });
      
      // 重置进度
      this.setData({ playbackProgress: 0 });
      this._currentPlayingModuleIndex = -1;
      
      // 重新开始播放
      if (sheetPlaybackManager) {
        sheetPlaybackManager.seekToColumn('0-0-0-0');
      }
    } else {
      // 单曲模式：显示完成提示
      wx.showToast({
        title: '播放完成',
        icon: 'success',
        duration: 1500
      });
      
      // 更新状态为暂停（而非退出）
      this.setData({ 
        isPlaying: false, 
        isPaused: false,
        playbackProgress: 100 
      });
      
      // 标记为首次播放，下次点击播放会触发倒计时
      this._firstPlayback = true;
    }
  },

  /**
   * 播放模式下的节拍器切换
   * 会同步到当前播放位置
   */
  toggleFloatingMetronomeInPlayback() {
    if (this.data.showFloatingMetronome) {
      this.closeFloatingMetronome();
      if (sheetPlaybackManager) {
        sheetPlaybackManager.setMetronomeEnabled(false);
      }
    } else {
      // 重新加载设置
      this.loadMetronomeSettings();
      this.setData({
        showFloatingMetronome: true
      });
      // 同步启动节拍器
      if (sheetPlaybackManager) {
        sheetPlaybackManager.syncMetronomeStart();
      }
    }
  },

  /**
   * 监听页面隐藏/切换（自动停止播放）
   */
  onPlaybackPageHide() {
    if (this.data.isPlaybackMode && this.data.isPlaying) {
      this.stopPlayback();
    }
  },

  /**
   * 监听应用后台切换（自动暂停播放）
   */
  setupPlaybackListeners() {
    // 监听应用切入后台
    wx.onAppHide(() => {
      if (this.data.isPlaybackMode && this.data.isPlaying) {
        this.stopPlayback();
      }
    });

    // 监听音频中断（来电、闹钟等）
    wx.onAudioInterruptionBegin(() => {
      if (this.data.isPlaybackMode && this.data.isPlaying) {
        this.stopPlayback();
        wx.showToast({
          title: '播放已中断',
          icon: 'none'
        });
      }
    });
  }
});
