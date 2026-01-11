const app = getApp();
const libraryManager = require('../../utils/libraryManager.js');

// 内置示例数据（完整示例，包含所有module）
const BUILTIN_EXAMPLE = {
  title: 'Urban',
  subtitle: 'Author: Kate Stone',
  tempo: 60,
  code: "\\begin{module}{Intro}\n[(8)/(4)+ -+-+ (6)/()| (8)/(4) +-+-+ (6)/()| (8)/(4) +-+-+-|-+-+-+-]\\\\\n[(7)/(3) +-+-+ (5)/()|(7)/(3)+ -+-+ (5)/()| (7)/(3) +-+-+-|-+-+-+-]\\\\\n[(6)/(2) +-+-+ (4)/()|(6)/(2)+ -+-+ (4)/()| (6)/(2) +-+-+-|-+-+-+-]\\\\\n[(5)/(1) +-+-+ (5)/()|(5)/(1) +-+-+ (5)/()| (5)/(1) +-+-+-|-+-+-+-]\\\\\n[(8)/(4)+ -+-+ (6)/()| (8)/(4)+ -+-+ (6)/()| (8)/(4) +-+-+-|()/(4)+(7)/()+()/(8)+-]\\\\\n[(7)/(3) +-+-+ (5)/()|(7)/(3) +-+-+ (5)/()| (7)/(3) +-+-+-|()/(3)+-+(5)/()+-]\\\\\n[(6)/(2) +-+-+ (4)/()|(6)/(2)+ -+-+ (4)/()| (6)/(2) +-+-+-|()/(8)+(7)/()+()/(6)+-]\\\\\n[(5)/(1) +-+-+ (5)/()|(5)/(1) +-+-+ (5)/()| (5)/(1) +-+-+-|()/(1)+-+(3)/()+-]\\\\\n[(6)/(2) +-+-+ (4)/()|(6)/(2)+ -+-+ (4)/()| (6)/(2) +-+-+-|()/(4)+-+-+-]\\\\\n[(7)/(3) +-+-+ (5)/()|(7)/(3) +-+-+ (5)/()| (7)/(3) +-+-+-|()/(3)+-+(5)/()+-]\\\\\n[(8)/(4)+ -+-+-|- +-+-+ -|-+-+-+-|-+-+-+-]\\\\\n[()/(s)+ -+-+-|()/(s)+-+-+ -|()/(s)+-+-+-|()/(s)+-+(D)/()+-]\\\\\n\\end{module}\n\\begin{module}{A-1}\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-]\\\\\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(6)/(D)+-+ ()/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|(7)/(D)+-+ ()/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(8)/(D)+-+ ()/(1)+-]\\\\\n[(7)/(D)+ -+1+ (d)/()|()/(D)+-+ (7)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (7)/(1)+-]\\\\\n[8+ -+-+-|7+-+6+-|5+ -+-+ -|6+-+ 5+-]\\\\\n\\end{module}\n\\begin{module}{A-2}\n[6/D -/1{d/}|/D-6/1-|6/D -/1{d/}|/D-6/1-]\\\\\n[6/D -/1{d/}|/D-6/1-|7/D -/1{d/}|6/D-/1-]\\\\\n[5/D -/1{d/}|/D-5/1-|5/D -/1{d/}|/D-5/1-]\\\\\n[5/D -/1{d/}|/D-5/1-|6/D -/1{d/}|7/D-/1-]\\\\\n[8/D -/1{d/}|/D-8/1-|8/D -/1{d/}|/D-8/1-]\\\\\n[8/D -/1{d/}|/D-8/1-|7/D -/1{d/}|8/D-/1-]\\\\\n[7/D -/1{d/}|/D-7/1-|7/D -/1{d/}|/D-7/1-]\\\\\n[8---|7-6-|5---|6-5-]\n\\end{module}\n\\begin{module}{B-1}\n[1/4-/4{1/}|/4-1/4-|1/4-/4{1/}|/4-1/4-]\\\\\n[1/5-/5{1/}|/5-1/5-|1/5-/5{1/}|/5-1/5-]\\\\\n[1/6-/6{1/}|/6-1/6-|1/6-/6{1/}|/6-1/6-]\\\\\n[1/7-/7{1/}|/7-1/7-|8765|4-5-]\\\\\n\\end{module}\n\\begin{module}{B-2}\n[1/4-/4{1/}|/4-1/4-|1/4-/4{1/}|/4-1/4-]\\\\\n[1/5-/5{1/}|/5-1/5-|1/5-/5{1/}|/5-1/5-]\\\\\n[1/6-/6{1/}|/6-1/6-|1/6-/6{1/}|/6-1/6-]\\\\\n[1/7-/7{1/}|/7-1/7-|8765|6-5-]\\\\\n\\end{module}\n\\begin{module}{C-1}\n[8/4-4{8/}|4-8/4-|8/4-4{8/}|4-8/4-]\\\\\n[6/2-2{6/}|2-6/2-|6/2-2{6/}|2-6/2-]\\\\\n[7/3-/3{7/}|/3-7/3-|7/3-/3{7/}|/3-7/3-]\\\\\n[5/1-/1{5/}|/1-5/1-|5/1-/1{5/}|/1-5/1-]\\\\\n\\end{module}\n\\begin{module}{C-2}\n[8/4-4{8/}|4-8/4-|8/4-4{8/}|4-8/4-]\\\\\n[6/2-2{6/}|2-6/2-|6/2-2{6/}|2-8/2-]\\\\\n[7/3-/3{7/}|/3-7/3-|7/3-/3{7/}|/3-7/3-]\\\\\n[5/1-/1{5/}|/1-5/1-|5/1-/1{5/}|/1-5/1-]\\\\\n[6/2-2{6/}|2-6/2-|6/2-2{6/}|2-6/2-]\\\\\n[7/3-/3{7/}|/3-7/3-|7/3-/3{7/}|/3-7/3-]\\\\\n[8/4---|----|----|----]\\\\\n[()/(s)+ -+-+-|()/(s)+-+-+ -|()/(s)+-+-+-|()/(s)+-+(D)/()+-]\\\\\n\\end{module}\n\\begin{module}{A-3}\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-]\\\\\n[(6)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (6)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(6)/(D)+-+ ()/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-]\\\\\n[(5)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (5)/(1)+-|(6)/(D)+ -+()/(1)+ (d)/()|(7)/(D)+-+ ()/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-]\\\\\n[(8)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (8)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|(8)/(D)+-+ ()/(1)+-]\\\\\n[(7)/(D)+ -+1+ (d)/()|()/(D)+-+ (7)/(1)+-|(7)/(D)+ -+()/(1)+ (d)/()|()/(D)+-+ (7)/(1)+-]\\\\\n[8+ -+-+-|7+-+6+-|5+ -+-+ -|6+-+ 5+-]\\\\\n\\end{module}\n\\begin{module}{A-4}\n[6/D -/1{d/}|/D-6/1-|6/D -/1{d/}|/D-6/1-]\\\\\n[6/D -/1{d/}|/D-6/1-|7/D -/1{d/}|6/D-/1-]\\\\\n[5/D -/1{d/}|/D-5/1-|5/D -/1{d/}|/D-5/1-]\\\\\n[5/D -/1{d/}|/D-5/1-|6/D -/1{d/}|7/D-/1-]\\\\\n[8/D -/1{d/}|/D-8/1-|8/D -/1{d/}|/D-8/1-]\\\\\n[8/D -/1{d/}|/D-8/1-|7/D -/1{d/}|8/D-/1-]\\\\\n[7/D -/1{d/}|/D-7/1-|7/D -/1{d/}|/D-7/1-]\\\\\n[8---|7-6-|5---|6-5-]\n\\end{module}\n\\begin{module}{B-3}\n[1/4-/4{1/}|/4-1/4-|1/4-/4{1/}|/4-1/4-]\\\\\n[1/5-/5{1/}|/5-1/5-|1/5-/5{1/}|/5-1/5-]\\\\\n[1/6-/6{1/}|/6-1/6-|1/6-/6{1/}|/6-1/6-]\\\\\n[1/7-/7{1/}|/7-1/7-|8765|4-5-]\\\\\n\\end{module}\n\\begin{module}{B-4}\n[1/4-/4{1/}|/4-1/4-|1/4-/4{1/}|/4-1/4-]\\\\\n[1/5-/5{1/}|/5-1/5-|1/5-/5{1/}|/5-1/5-]\\\\\n[1/6-/6{1/}|/6-1/6-|1/6-/6{1/}|/6-1/6-]\\\\\n[1/7-/7{1/}|/7-1/7-|8765|6-5-]\\\\\n\\end{module}\n\\begin{module}{C-3}\n[8/4-4{8/}|4-8/4-|8/4-4{8/}|4-8/4-]\\\\\n[6/2-2{6/}|2-6/2-|6/2-2{6/}|2-6/2-]\\\\\n[7/3-/3{7/}|/3-7/3-|7/3-/3{7/}|/3-7/3-]\\\\\n[5/1-/1{5/}|/1-5/1-|5/1-/1{5/}|/1-5/1-]\\\\\n\\end{module}\n\\begin{module}{C-4}\n[8/4-4{8/}|4-8/4-|8/4-4{8/}|4-8/4-]\\\\\n[6/2-2{6/}|2-6/2-|6/2-2{6/}|2-8/2-]\\\\\n[7/3-/3{7/}|/3-7/3-|7/3-/3{7/}|/3-7/3-]\\\\\n[5/1-/1{5/}|/1-5/1-|5/1-/1{5/}|/1-5/1-]\\\\\n[6/2-2{6/}|2-6/2-|6/2-2{6/}|2-6/2-]\\\\\n[7/3-/3{7/}|/3-7/3-|7/3-/3{7/}|/3-7/3-]\\\\\n[8/4---|----|----|----]\\\\\n[()/(s)+ -+-+-|()/(s)+-+-+ -|()/(s)+-+-+-|()/(s)+-+(D)/()+-]\\\\\n\\end{module}\n\\begin{module}{End}\n[8/4--6|4-8/-|6---|4{8/}65]\\\\[7/3--/5|/3-7-|/5---|/3--7]\\\\\n[6/2--4|2-6/-|4---|2-6/-]\\\\[5/1--3|/1-5-|/3---|1-/5-]\\\\\n[8/4---|----|----|----]\n\\end{module}\n"
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
    // 模块标签编辑弹窗
    showLabelEditModal: false,
    labelEditModuleId: null,
    labelEditName: '',
    labelEditRemark: '',
    
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
    defaultConversionTable: { // 默认转换表（数字谱到简谱）
      '1': '3',
      '2': '4',
      '3': '5',
      '4': '6',
      '5': '7',
      '6': '1^.',
      '7': '2^.',
      '8': '3^.',
      '9': '5^.',
      'D': '6_.',
      'T': '6_.' // T也作为10的表示
    },
    customConversionTableObj: {}, // 解析后的自定义转换表
    // 导出功能相关
    showExportOptionsModal: false,
    exportMode: 'long', // 'long' 长图模式, 'paged' 分页模式
    a4Orientation: 'portrait', // A4纸张方向: 'portrait' 纵向, 'landscape' 横向
    showExportPreview: false,
    exportPreviewImages: [],
    currentPreviewPage: 0,
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

    // 撤销功能相关
    undoStack: [], // 保存最近5步操作的谱面代码备份

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

    // 阅读模式相关
    readingMode: false // false: 编辑模式, true: 阅读模式
  },

  onLoad() {
    // 初始化临时编辑状态
    this.prevEditing = null;
    this.prevEditingValue = '';
    
    // 预加载Logo图片以提升加载遮罩显示速度
    this.preloadLogoImage();
    
    this.loadNotations();
    this.loadTitles();
    this.loadGlobalTempo();
    this.loadMetronomeSettings();
    this.initOrientationListener();
    this.loadImportHelpSettings();
    this.loadNotationType();
    this.loadLibraryFileInfo(); // 加载库文件关联信息
    this.calculatePages(); // 初始化分页
    
    // 延迟检查开屏弹窗，不阻塞主流程，优化 onLoad 性能
    setTimeout(() => {
      this.checkAndShowSplashModal();
    }, 100);
  },

  onShow() {
    // 回到该页时刷新标题/颜色/透明度设置，确保设置页调整即时生效
    this.loadTitles();

    // 若有待加载的曲库数据则应用
    const pending = wx.getStorageSync('pending_notation_load');
    if (pending && pending.code) {
      // 先显示加载遮罩，等导入完成后再关闭
      this.showPageLoadingOverlay();
      wx.removeStorageSync('pending_notation_load');
      this.applyLibraryPayload(pending);
    } else {
      wx.hideLoading();
      this.updateStorageDisplay(false); // 更新存储显示
    }
  },

  // 应用曲库传入的数据并覆盖当前谱面
  applyLibraryPayload(payload) {
    if (!payload || !payload.code) return;

    // 无论当前什么模式，打开新文件时先切换回竖屏模式，避免横屏布局错误
    // 文件的orientation设置会在导入后生效
    const orientation = 'portrait';
    const timingText = payload.timing || `${payload.timeSignatureBeats || 4}/${payload.timeSignatureBottom || 4}`;
    const [beatsStr, bottomStr] = (timingText || '4/4').split('/');
    const beats = parseInt(beatsStr, 10) || 4;
    const bottom = parseInt(bottomStr, 10) || 4;

    this.setData({
      mainTitle: payload.title || payload.file_name || '未命名',
      subTitle: payload.subtitle || 'Author: Unknown',
      globalTempo: payload.tempo || 60,
      orientation,
      timeSignatureBeats: beats,
      timeSignatureBottom: bottom,
      timeSignatureDisplay: timingText,
      currentTimeSignatureType: 'standard',
      // 保存文件来源信息
      libraryFileId: payload.id || null,
      libraryFilePath: payload.path || null,
      libraryFileName: payload.file_name || null
    }, () => {
      this.saveTitles();
      this.saveGlobalTempo();
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
  },

  onUnload() {
    // 页面卸载时关闭节拍器
    this.closeFloatingMetronome();
    this.destroyMetronomeAudio();
    // 页面卸载时也确保关闭翻页加载遮罩与其节拍器
    this.hidePageLoadingOverlay();
  },

  // 加载标题与副标题
  loadTitles() {
    // 从存储中读取
    const mainTitle = wx.getStorageSync('mainTitle') || 'Note Title';
    const subTitle = wx.getStorageSync('subTitle') || 'Author: Your Name';
    
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
    
    this.setData({ 
      mainTitle, 
      subTitle, 
      mainTitleColor,
      subTitleColor,
      rightHandColor, 
      leftHandColor,
      backgroundOpacity: opacity
    });
  },

  // 保存标题与副标题
  saveTitles() {
    wx.setStorageSync('mainTitle', this.data.mainTitle);
    wx.setStorageSync('subTitle', this.data.subTitle);
  },

  // 加载全局速度
  loadGlobalTempo() {
    const globalTempo = wx.getStorageSync('globalTempo') || 60;
    this.setData({ globalTempo });
  },

  // 保存全局速度
  saveGlobalTempo() {
    wx.setStorageSync('globalTempo', this.data.globalTempo);
  },

  // 加载库文件关联信息（使刷新后不丢失存储位置）
  loadLibraryFileInfo() {
    const libraryInfo = wx.getStorageSync('libraryFileInfo');
    if (libraryInfo) {
      this.setData({
        libraryFileId: libraryInfo.id || null,
        libraryFilePath: libraryInfo.path || null,
        libraryFileName: libraryInfo.fileName || null
      });
      this.updateStorageDisplay(false);
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
    // 先检查是否有自定义拍号
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
    const prevBeats = this.data.timeSignatureBeats;
    this.setData({ timeSignatureBeats: beats });
    const initial = [ this.createNotation('A-1', false), this.createNotation('A-2', false) ];
    const withOffsets = this.updateMeasureOffsets(initial);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.setData({ timeSignatureBeats: beats });
    // 还原（无必要，但保持语义）
    this.setData({ timeSignatureBeats: prevBeats || beats });
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

  // 保存到当前拍号的独立存储
  saveNotationsScoped(notations) {
    const key = this.getNotationStorageKey();
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    app.globalData.notations = withOffsets;
    wx.setStorageSync(key, withOffsets);
  },

  // 直接指定key保存谱面数据
  saveNotationsScopedWithKey(notations, key) {
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    app.globalData.notations = withOffsets;
    wx.setStorageSync(key, withOffsets);
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
          if (!beat.subdivisions) {
            // 将缺省的拍转换为单个 subdivision，保留原左右手值
            const rh = ensureArray2(beat.rightHand);
            const lh = ensureArray2(beat.leftHand);
            return {
              subdivisions: [
                { rightHand: rh, leftHand: lh }
              ]
            };
          }

          // 已有 subdivisions，则逐个规范化，不补齐数量
          const subs = (beat.subdivisions || []).map(sub => ({
            rightHand: ensureArray2(sub.rightHand),
            leftHand: ensureArray2(sub.leftHand)
          }));

          return { subdivisions: subs };
        });
        return { beats };
      });
      // 不再强制截断/补足固定小节数，保留导入的实际行数
      // 确保有 collapsed 属性（旧数据可能没有）
      if (newNotation.collapsed === undefined) {
        newNotation.collapsed = false;
      }
      // 确保有 style 属性（旧数据可能没有）
      if (!newNotation.style) {
        newNotation.style = {
          measureHeight: 160, // 单行高度，默认160rpx
          noteFontSize: 28, // 音符字体大小，默认28rpx
          lineSpacing: 65 // 行间距，默认65rpx
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
          { subdivisions: [ { rightHand: ['1', '3'], leftHand: ['', '9'] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] },
          { subdivisions: [ { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] },
          { subdivisions: [ { rightHand: ['', 's'], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] },
          // 如果是3/4则示例仅取前三拍
          ...(beats === 4 ? [ { subdivisions: [ { rightHand: ['1', '3'], leftHand: ['', '9'] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] }, { rightHand: ['', ''], leftHand: ['', ''] } ] } ] : [])
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
      style: { // 默认样式参数
        measureHeight: 160, // 单行高度，默认160rpx
        noteFontSize: 28, // 音符字体大小，默认28rpx
        lineSpacing: 65 // 行间距，默认65rpx
      }
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

    // 先备份当前状态
    this.backupCurrentState();

    // 提取前一个模块的字母前缀 (例如 "A-1" -> "A", "D-4" -> "D")
    const prevLabel = notations[afterIndex].label;
    const match = prevLabel.match(/^([A-Z]+)-/);
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
    newNotation.style = {
      measureHeight: sourceStyle.measureHeight || 160,
      noteFontSize: sourceStyle.noteFontSize || 28,
      lineSpacing: sourceStyle.lineSpacing || 65
    };
    
    // 在指定位置后插入
    notations.splice(afterIndex + 1, 0, newNotation);

    // 重新编号：从插入位置开始到末尾，按顺序编号
    this.relabelNotations(notations, afterIndex, prefix);

    const withOffsets = this.updateMeasureOffsets(notations);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    wx.showToast({ title: '已添加谱面', icon: 'success' });
  },

  // 重新编号模块（从指定位置开始）
  relabelNotations(notations, startIndex, prefix) {
    let counter = 1;
    // 先找到同前缀的起始位置
    let sameGroupStart = startIndex;
    while (sameGroupStart > 0) {
      const label = notations[sameGroupStart - 1].label;
      const match = label.match(/^([A-Z]+)-/);
      if (match && match[1] === prefix) {
        sameGroupStart--;
      } else {
        break;
      }
    }

    // 从起始位置开始重新编号所有同前缀的模块
    for (let i = sameGroupStart; i < notations.length; i++) {
      const label = notations[i].label;
      const match = label.match(/^([A-Z]+)-/);
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
      content: '确定删除吗？此操作可能无法恢复。',
      success(res) {
        if (res.confirm) {
          // 先备份当前状态
          that.backupCurrentState();
          
          // 找到被删除模块的索引和前缀
          const deleteIndex = that.data.notations.findIndex(n => n.id === id);
          let prefix = 'A'; // 默认前缀
          if (deleteIndex !== -1) {
            const deleteLabel = that.data.notations[deleteIndex].label;
            const match = deleteLabel.match(/^([A-Z]+)-/);
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
          that.setNotations(withOffsets);
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
      content: '确定将该板块的音符数据全部清空吗？',
      success(res) {
        if (!res.confirm) return;
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
        // 备份当前状态
        that.backupCurrentState();
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

  // 弹窗确认清空（不可撤销提示）
  showClearConfirm() {
    const that = this;
    wx.showModal({
      title: '确认清空',
      content: '将清空所有谱面数据，此操作可能无法恢复，是否继续？',
      success(res) {
        if (res.confirm) {
          // 先备份当前状态
          that.backupCurrentState();
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

    // 清空时强制恢复全局拍号为4/4，并退出自定义模式
    that.setData({
      timeSignatureBeats: defaultBeats,
      timeSignatureBottom: 4,
      timeSignatureDisplay: '4/4',
      currentTimeSignatureType: 'standard',
      measuresPerRowPortrait: portraitRow,
      measuresPerRow: portraitRow * factor
    });
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

  // 读取示例文件并导入（不可撤销提示）
  loadAndImportExample() {
    const that = this;
    wx.showModal({
      title: '确认加载示例',
      content: '将清空现有谱面并加载示例，此操作可能无法恢复，是否继续？',
      success(res) {
        if (res.confirm) {
          // 先备份当前状态
          that.backupCurrentState();
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
      const subtitle = exampleData.subtitle || '';
      const tempo = exampleData.tempo || 120;
      const code = exampleData.code || '';
      
      // 保存标题等信息
      wx.setStorageSync('mainTitle', title);
      wx.setStorageSync('subTitle', subtitle);
      wx.setStorageSync('globalTempo', tempo);
      
      // 更新页面数据
      that.setData({
        mainTitle: title,
        subTitle: subtitle,
        globalTempo: tempo
      });
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
        // 备份当前状态
        that.backupCurrentState();
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
    
    this.setData({
      showCustomTimeSignatureModal: true,
      customTimeSignatureTemplate: template,
      customTimeSignatureError: ''
    });
  },

  // 关闭自由设定模态框
  closeCustomTimeSignatureModal() {
    // 清理实例变量
    this._customTimeSignatureTemplate = undefined;
    
    this.setData({
      showCustomTimeSignatureModal: false,
      customTimeSignatureTemplate: '',
      customTimeSignatureError: ''
    });
  },

  // 自由设定模板输入变化（使用实例变量避免输入回退）
  onCustomTimeSignatureInput(e) {
    const template = e.detail.value;
    this._customTimeSignatureTemplate = template;
    // 实时验证（仅更新错误状态，不更新值）
    this.validateCustomTemplate(template);
  },

  // 验证自由设定模板
  validateCustomTemplate(template) {
    let error = '';
    
    if (!template) {
      error = '请输入模板';
    } else if (!/^[\[\]\|\\-]+$/.test(template)) {
      error = '只能包含 [ ] | - 四种符号';
    } else if ((template.match(/-/g) || []).length > 35) {
      error = '音符位"-"不能超过35个';
    } else if (!template.startsWith('[') || !template.endsWith(']')) {
      error = '必须以"["开始，"]"结束';
    }
    
    // 仅在错误状态变化时更新，避免输入回退
    if (this.data.customTimeSignatureError !== error) {
      this.setData({ customTimeSignatureError: error });
    }
    return error === '';
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
    const beatStructure = parsed.beatStructure;
    const beatCount = parsed.totalBeats;

    // 保存自定义拍号模板
    const customTimeSignature = {
      type: 'custom',
      template: template,
      noteCount: beatCount, // 使用实际拍数而不只是 - 的数量
      beatStructure: beatStructure // 保存完整结构
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
      this.saveNotationsScopedWithKey(withOffsets, key);
      this.setData({ 
        notations: withOffsets, 
        timeSignatureBeats: beatCount,
        currentTimeSignatureType: 'custom'
      });
    } else {
      // 现有数据存在，则将所有现有模块的所有行都转换为新的自定义拍号格式
      const migrated = scoped.map(notation => {
        // 为每个现有模块创建新的measure数组，使用自定义模板格式
        const newMeasures = notation.measures.map((_, idx) => {
          if (idx === 0) {
            // 保留第一个measure的示例数据
            return {
              beats: beatStructure.map((beat, beatIdx) => ({
                subdivisions: Array.from({ length: beat.noteCount }).map((_, subIdx) => {
                  // 尝试保留原有的手指数据
                  const oldMeasure = notation.measures[0];
                  const oldBeat = oldMeasure.beats[Math.min(beatIdx, oldMeasure.beats.length - 1)];
                  return {
                    rightHand: subIdx === 0 && beatIdx === 0 ? ['7', '8'] : ['', ''],
                    leftHand: subIdx === 0 && beatIdx === 0 ? ['', '8'] : ['', '']
                  };
                })
                , barLineAfter: beat.barLineAfter
              }))
            };
          }
          // 其他measure为空白
          return {
            beats: beatStructure.map(beat => ({
              subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
                rightHand: ['', ''],
                leftHand: ['', '']
              }))
              , barLineAfter: beat.barLineAfter
            }))
          };
        });
        
        return {
          ...notation,
          measures: newMeasures,
          timeSignature: '自由/自由',
          customTemplate: template,
          moduleTimeSignature: undefined // 清除模块级设置，使用全局设置
        };
      });
      
      const withOffsets = this.updateMeasureOffsets(migrated);
      this.saveNotationsScopedWithKey(withOffsets, key);
      this.setData({ 
        notations: withOffsets, 
        timeSignatureBeats: beatCount,
        currentTimeSignatureType: 'custom'
      });
    }

    this.closeCustomTimeSignatureModal();
    wx.showToast({ title: '自由设定已应用，所有模块已更新', icon: 'none' });
  },

  // 根据自定义模板创建谱面
  createNotationWithCustomTemplate(label, withExample = false, template) {
    // 解析模板获取每拍的结构
    const parsed = this.parseCustomTemplate(template);
    const beatStructure = parsed.beatStructure;
    const beatsCount = parsed.totalBeats;
    const portraitRow = this.countBracketGroups(template) || this.data.measuresPerRowPortrait || this.data.measuresPerRow || 1;
    const factor = this.data.orientation === 'landscape' ? 2 : 1;

    const measures = Array.from({ length: 4 }).map((_, idx) => {
      if (withExample && idx === 0) {
        // 第一个小节填入示例
        return {
          beats: beatStructure.map((beat, beatIdx) => ({
            subdivisions: Array.from({ length: beat.noteCount }).map((_, subIdx) => ({
              rightHand: beatIdx === 0 && subIdx === 0 ? ['7', '8'] : ['', ''],
              leftHand: beatIdx === 0 && subIdx === 0 ? ['', '8'] : ['', '']
            })),
            barLineAfter: beat.barLineAfter
          }))
        };
      }
      // 其他小节为空白占位符
      return {
        beats: beatStructure.map(beat => ({
          subdivisions: Array.from({ length: beat.noteCount }).map(() => ({
            rightHand: ['', ''],
            leftHand: ['', '']
          })),
          barLineAfter: beat.barLineAfter
        }))
      };
    });

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

  // 将单个小节数据转换为代码片段 [ ... ]
  buildMeasureCode(measure) {
    if (!measure || !Array.isArray(measure.beats)) return '[]';

    const beatStrings = measure.beats.map(beat => {
      const subs = Array.isArray(beat.subdivisions) ? beat.subdivisions : [];
      const subStrings = subs.map(sub => {
        const rh = Array.isArray(sub.rightHand) ? sub.rightHand : ['', ''];
        const lh = Array.isArray(sub.leftHand) ? sub.leftHand : ['', ''];
        const rhText = [rh[0] || '', rh[1] || ''].filter(Boolean).join(',');
        const lhText = [lh[0] || '', lh[1] || ''].filter(Boolean).join(',');
        return `(${rhText})/(${lhText})`;
      });
      return subStrings.join('+');
    });

    const content = beatStrings.join('|');
    return `[${content}]`;
  },

  // 将单个notation转换为完整module代码（保留行数与每行小节数）
  buildModuleCodeFromNotation(notation) {
    if (!notation) return '';
    const perRow = this.getMeasuresPerRowForNotation(notation) || 1;
    const measures = Array.isArray(notation.measures) ? notation.measures : [];
    const lines = [];
    for (let i = 0; i < measures.length; i += perRow) {
      const slice = measures.slice(i, i + perRow);
      const line = slice.map(m => this.buildMeasureCode(m)).join('');
      lines.push(line);
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
    let storedMeasureHeight = style.measureHeight || 160;
    let storedNoteFontSize = style.noteFontSize || 28;
    let storedLineSpacing = style.lineSpacing || 65;

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

  // 恢复模块设置到默认值
  resetModuleSettings() {
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

  // 恢复模块默认设置
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

    // 重置为默认设置
    notation.style = {
      measureHeight: 160,
      noteFontSize: 28,
      lineSpacing: 65
    };

    const normalized = this.normalizeBarLines(updated);
    const withOffsets = this.updateMeasureOffsets(normalized);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    
    // 重新打开设置界面以显示默认值
    this.openModuleSettings({ currentTarget: { dataset: { id: currentModuleId } } });
    
    wx.showToast({ title: '已恢复默认设置', icon: 'success' });
    // 备份当前状态
    this.backupCurrentState();
  },

  // 应用模块设置
  applyModuleSettings() {
    const { 
      currentModuleId, 
      moduleLineCount, 
      moduleTimeSignatureBeats, 
      moduleMeasureHeight,
      moduleNoteFontSize,
      moduleLineSpacing
    } = this.data;
    
    // 从实例变量读取模块自定义模板（如果有）
    const moduleCustomTemplate = this._moduleCustomTemplate !== undefined 
      ? this._moduleCustomTemplate 
      : this.data.moduleCustomTemplate;
    
    // 验证行数
    const lineCount = parseInt(moduleLineCount) || 0;
    if (!lineCount || lineCount < 1 || lineCount > 20) {
      this.setData({ moduleLineCountError: '请输入1-20之间的整数' });
      return;
    }

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

    // 验证自定义拍号（如果选择了自由设定）
    let sanitizedModuleTemplate = moduleCustomTemplate;
    if (moduleTimeSignatureBeats === 'custom') {
      if (!moduleCustomTemplate) {
        this.setData({ moduleCustomTemplateError: '请输入自定义模板' });
        return;
      }
      if (!this.validateModuleCustomTemplate(moduleCustomTemplate)) {
        return;
      }
      sanitizedModuleTemplate = this.sanitizeTemplateString(moduleCustomTemplate);
      if (!sanitizedModuleTemplate) {
        this.setData({ moduleCustomTemplateError: '模板不能为空或仅包含小节线' });
        return;
      }
      this.setData({ moduleCustomTemplate: sanitizedModuleTemplate });
    }
    
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

    // 横屏模式下需要将用户输入的值转换回竖屏基准值存储
    // isLandscape 已在上方验证部分定义
    // 横屏输入值 * 28/18 = 竖屏存储值（反向缩放）
    const reverseScaleRatio = 28 / 18; // 反向缩放比例
    const storedMeasureHeight = isLandscape ? Math.round(moduleMeasureHeight * reverseScaleRatio) : moduleMeasureHeight;
    const storedNoteFontSize = isLandscape ? Math.round(moduleNoteFontSize * reverseScaleRatio) : moduleNoteFontSize;
    const storedLineSpacing = isLandscape ? Math.round(moduleLineSpacing * reverseScaleRatio) : moduleLineSpacing;

    // 应用样式设置（存储竖屏基准值）
    if (!notation.style) {
      notation.style = {};
    }
    notation.style.measureHeight = storedMeasureHeight;
    notation.style.noteFontSize = storedNoteFontSize;
    notation.style.lineSpacing = storedLineSpacing;

    // 应用行数变化（横屏模式下行数需要乘以2还原为实际小节数）
    const storedPerRow = notation.measuresPerRow || this.getMeasuresPerRowForNotation(notation) || 1;
    const currentMeasureCount = (notation.measures || []).length;
    const currentLines = Math.max(1, Math.ceil(currentMeasureCount / storedPerRow));
    
    // 横屏模式下用户输入的行数是竖屏的一半，需要乘以2
    const actualLineCount = isLandscape ? lineCount * 2 : lineCount;

    if (actualLineCount > currentLines) {
      // 增加行数
      const addLines = actualLineCount - currentLines;
      const addMeasures = addLines * storedPerRow;
      for (let i = 0; i < addMeasures; i++) {
        const template = sanitizedModuleTemplate || this.convertBeatsCountToTemplate(moduleTimeSignatureBeats === 'custom' ? 4 : moduleTimeSignatureBeats);
        notation.measures.push(this.createMeasureFromCustomTemplate(template));
      }
    } else if (actualLineCount < currentLines) {
      // 减少行数
      const keepMeasures = Math.max(0, actualLineCount * storedPerRow);
      notation.measures = notation.measures.slice(0, keepMeasures);
    }

    // 然后应用拍号变化（如果有）
    if (moduleTimeSignatureBeats === 3 || moduleTimeSignatureBeats === 4) {
      this.applyModuleTimeSignature(notation, moduleTimeSignatureBeats, true, '');
      notation.moduleTimeSignature = moduleTimeSignatureBeats;
      notation.timeSignature = `${moduleTimeSignatureBeats}/4`;
      notation.moduleCustomTemplate = undefined;
    } else if (moduleTimeSignatureBeats === 'custom') {
      this.applyModuleTimeSignature(notation, 'custom', true, sanitizedModuleTemplate);
      notation.moduleTimeSignature = 'custom';
      notation.timeSignature = '自由/自由';
      notation.moduleCustomTemplate = sanitizedModuleTemplate;
    }

    const normalized = this.normalizeBarLines(updated);
    const withOffsets = this.updateMeasureOffsets(normalized);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
    this.closeModuleSettingsModal();
    wx.showToast({ title: '设置已修改', icon: 'success' });
    // 备份当前状态
    this.backupCurrentState();
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
      this.saveNotationsScoped(withOffsets);
      this.setNotations(withOffsets);
      wx.showToast({ title: `已切换为 ${beatsCount}/4，所有模块已更新`, icon: 'none' });
      return;
    }
    
    // 初始化该拍号的默认谱面
    const initial = [ this.createNotation('A-1', true, beatsCount), this.createNotation('A-2', false, beatsCount) ];
    const withOffsets = this.updateMeasureOffsets(initial);
    this.saveNotationsScoped(withOffsets);
    this.setNotations(withOffsets);
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
    const updatedNotations = (this.data.notations || []).map(n => {
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

    this.setData({
      orientation: newOrientation,
      notations: updatedNotations
    });
    
    this.calculatePages();
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

  // 编辑副标题
  editSubTitle() {
    // 使用实例变量存储临时值
    this._editValue = this.data.subTitle;
    
    this.setData({
      showEditModal: true,
      editModalTitle: '编辑副标题',
      editValue: this.data.subTitle,
      editInputType: 'text',
      editPlaceholder: '输入记谱本副标题',
      currentEdit: { type: 'subtitle' }
    });
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

  // 底部操作栏折叠/展开
  toggleActionBar() {
    this.setData({ actionCollapsed: !this.data.actionCollapsed });
  },

  // 切换阅读模式
  toggleReadingMode() {
    const newReadingMode = !this.data.readingMode;
    this.setData({ readingMode: newReadingMode });
    
    if (newReadingMode) {
      // 进入阅读模式：收起所有module的谱面图标
      this.collapseAllNotations();
    } else {
      // 退出阅读模式：一键展开所有module
      this.expandAllNotations();
    }
  },

  // 收起单个谱面的图标行
  toggleNotationCollapse(e) {
    const notationId = e.currentTarget.dataset.id;
    const notations = this.data.notations.map(notation => {
      if (notation.id === notationId) {
        return { ...notation, collapsed: !notation.collapsed };
      }
      return notation;
    });
    this.setData({ notations });
  },

  // 收起所有谱面的图标行
  collapseAllNotations() {
    const notations = this.data.notations.map(notation => ({
      ...notation,
      collapsed: true
    }));
    this.setData({ notations });
  },

  // 展开所有谱面的图标行
  expandAllNotations() {
    const notations = this.data.notations.map(notation => ({
      ...notation,
      collapsed: false
    }));
    this.setData({ notations });
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

      const notation = this.data.notations.find(n => n.id === sId);
      if (!notation) {
        wx.showToast({ title: '未找到谱面', icon: 'none' });
        return;
      }
      const slotArray = notation.measures[mIdx].beats[bIdx].subdivisions[subIdx][hand === 'right' ? 'rightHand' : 'leftHand'];
      const currentValue = Array.isArray(slotArray) ? (slotArray[iIdx] || '') : '';

      // 先更新编辑状态，立即显示输入框
      this.setData({
        editing: { sheet: sId, measure: mIdx, beat: bIdx, subdivision: subIdx, hand, index: iIdx },
        editingValue: currentValue
      });

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
    },

  // 内嵌输入变化：实时保存到谱面，避免切换位置丢失
  onSlotInput(e) {
    const value = e.detail.value;
    const { editing } = this.data;
    if (!editing) {
      this.setData({ editingValue: value });
      return;
    }

    // 在简谱模式下，允许最多4个字符（如 "8^." 或 "8_."）
    // 在数字谱模式下，允许最多2个字符
    const maxLen = this.data.notationType === 'simplified' ? 4 : 2;
    if (value.length > maxLen) {
      return;
    }

    // 只更新 editingValue，不立即更新 notations
    this.setData({ editingValue: value });
    
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
    const oldValue = subdivision[handKey][iIdx];
    const hasChanged = oldValue !== val;
    
    if (!hasChanged) return; // 如果没有改变，不需要备份和更新
    
    // 使用路径更新，只更新单个值
    const path = `notations[${notationIndex}].measures[${mIdx}].beats[${bIdx}].subdivisions[${subIdx}].${handKey}[${iIdx}]`;
    const updateData = {};
    updateData[path] = val;
    
    // 先备份当前状态
    this.backupCurrentState();
    
    this.setData(updateData);
    
    // 异步保存
    setTimeout(() => {
      this.saveNotationsScoped(this.data.notations);
      this.markNotationChanged(); // 标记为有更改
    }, 100);
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
      return;
    } else if (currentEdit.type === 'subtitle') {
      this._editValue = undefined;
      this.setData({ subTitle: editValue, showEditModal: false, currentEdit: null });
      this.saveTitles();
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
    if (this.data.editing) {
      this.setData({ editing: null, editingValue: '' });
    }
  },

  // 导出选择
  exportPDF() {
    // 直接打开新的导出选项
    this.openExportOptions();
  },

  // 导出为代码
  exportAsCode() {
    try {
      const code = this.generateNotationCode();
      this.setData({
        exportedCode: code,
        showExportCodeModal: true
      });
    } catch (err) {
      wx.showToast({
        title: '导出失败: ' + err.message,
        icon: 'none'
      });
    }
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
        subtitle: this.data.subTitle || 'Author: Unknown',
        tempo: this.data.globalTempo || 60,
        rotation: this.data.orientation === 'landscape' ? '手机横屏/平板模式' : '手机竖屏（默认）',
        timing: `${this.data.timeSignatureBeats || 4}/${this.data.timeSignatureBottom || 4}`,
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
    this.setData({ showSaveToLibraryModal: false, saveFolderOptions: [], saveFileName: '', saveTargetPath: [], saveFolderItems: [], saveFolderBreadcrumbs: [], saveFolderCurrentPath: [] });
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
        subtitle: this.data.subTitle || 'Author: Unknown',
        tempo: this.data.globalTempo || 60,
        rotation: this.data.orientation === 'landscape' ? '手机横屏/平板模式' : '手机竖屏（默认）',
        timing: `${this.data.timeSignatureBeats || 4}/${this.data.timeSignatureBottom || 4}`,
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
      code += `\\begin{module}{${notation.label}}${remarkPart}\n`;
      
      // 根据模板确定每行小节数
      const measuresPerRow = this.getMeasuresPerRowForNotation(notation);
      const totalMeasures = notation.measures.length;
      
      for (let i = 0; i < totalMeasures; i += measuresPerRow) {
        const rowMeasures = notation.measures.slice(i, Math.min(i + measuresPerRow, totalMeasures));
        const lineCode = this.generateLineCode(rowMeasures);
        code += lineCode;
        
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

  // 生成单个小节的代码
  generateMeasureCode(measure) {
    let code = '[';
    
    for (let i = 0; i < measure.beats.length; i++) {
      const beat = measure.beats[i];
      code += this.generateBeatCode(beat);
      
      // 如果不是最后一拍，添加拍号线
      if (i < measure.beats.length - 1) {
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

  // 生成单个subdivision的代码
  generateSubdivisionCode(subdivision) {
    const rightHand = subdivision.rightHand || ['', ''];
    const leftHand = subdivision.leftHand || ['', ''];
    
    // 检查是否为空音符
    const hasAnyNote = rightHand[0] || rightHand[1] || leftHand[0] || leftHand[1];
    if (!hasAnyNote) {
      return '-';
    }
    
    // 生成右手和左手字符串
    const rightStr = this.generateHandCode(rightHand, 'right');
    const leftStr = this.generateHandCode(leftHand, 'left');
    
    return `(${rightStr})/(${leftStr})`;
  },

  // 生成单手的代码
  generateHandCode(hand, handType) {
    const note0 = hand[0] || '';
    const note1 = hand[1] || '';
    
    if (!note0 && !note1) {
      return '';
    }
    
    if (note0 && note1) {
      // 两个音符都存在
      return `${note0},${note1}`;
    }
    
    // 只有一个音符
    if (handType === 'right') {
      // 右手：如果只有note1（靠近中轴），直接返回
      // 如果只有note0（远离中轴），返回两个位置
      if (note1) {
        return note1;
      } else {
        return note0;
      }
    } else {
      // 左手：如果只有note0（靠近中轴），直接返回
      // 如果只有note1（远离中轴），返回两个位置
      if (note0) {
        return note0;
      } else {
        return note1;
      }
    }
  },

  // 关闭导出代码窗口
  closeExportCodeModal() {
    this.setData({
      showExportCodeModal: false,
      exportedCode: ''
    });
  },

  // 复制代码到剪贴板
  copyExportedCode() {
    const code = this.data.exportedCode;
    wx.setClipboardData({
      data: code,
      success: () => {
        wx.showToast({
          title: '代码已复制',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  // 备份当前谱面状态
  backupCurrentState() {
    const code = this.generateCodeForNotations(this.data.notations);
    // 检查是否与上一个备份相同，避免重复备份
    if (this.data.undoStack.length > 0 && this.data.undoStack[this.data.undoStack.length - 1] === code) {
      return; // 不备份相同状态
    }
    this.data.undoStack.push(code);
    if (this.data.undoStack.length > 5) {
      this.data.undoStack.shift();
    }
    this.setData({ undoStack: this.data.undoStack });
  },

  // 撤销上一步操作
  undo() {
    if (this.data.undoStack.length === 0) {
      wx.showToast({ title: '没有可撤销的操作', icon: 'none' });
      return;
    }
    
    // 显示加载界面
    wx.showLoading({ title: '正在撤销...' });
    
    const code = this.data.undoStack.pop();
    this.setData({ undoStack: this.data.undoStack });
    
    try {
      // 解析并恢复谱面
      const parsed = this.parseImportCode(code);
      if (!parsed || !parsed.length) {
        wx.hideLoading();
        wx.showToast({ title: '恢复失败', icon: 'none' });
        return;
      }
      const notations = parsed.map(module => this.convertToNotation(module));
      this.setNotations(notations);
      
      wx.hideLoading();
      wx.showToast({ title: '已撤销上一步', icon: 'success' });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: '撤销失败: ' + error.message, icon: 'none' });
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

  // 选择A4方向
  selectA4Orientation(e) {
    const orientation = e.currentTarget.dataset.orientation;
    this.setData({
      a4Orientation: orientation
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

  // 保存图片到相册
  saveImageToAlbum(filePath) {
    wx.saveImageToPhotosAlbum({
      filePath: filePath,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg.includes('auth')) {
          wx.showModal({
            title: '提示',
            content: '需要授权保存相册权限',
            showCancel: false
          });
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' });
        }
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
          if (err.errMsg.includes('auth')) {
            wx.showModal({
              title: '提示',
              content: '需要授权保存相册权限',
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
      })
      .catch((err) => {
        that.setData({ showPdfProgressModal: false });
        if (err.message === 'USER_CANCELLED') {
          wx.showToast({ title: '已取消导出', icon: 'none' });
        } else {
          console.error('PDF导出失败:', err);
          wx.showToast({ title: 'PDF生成失败: ' + (err.message || '未知错误'), icon: 'none' });
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
      wx.showModal({
        title: '导出成功',
        content: '图片已生成，是否保存到相册？',
        success(res) {
          if (res.confirm) {
            wx.saveImageToPhotosAlbum({
              filePath: tempFilePath,
              success() {
                wx.showToast({ title: '已保存到相册', icon: 'success' });
              },
              fail(err) {
                if (err.errMsg.includes('auth')) {
                  wx.showModal({
                    title: '提示',
                    content: '需要授权保存相册权限',
                    showCancel: false
                  });
                } else {
                  wx.showToast({ title: '保存失败', icon: 'none' });
                }
              }
            });
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

  // 启动节拍器
  startMetronome() {
    this.ensureMetronomeAudio();
    this.setData({ currentMetronomeBeat: 0 });
    const interval = 60000 / this.data.metronomeTempo; // 毫秒

    this.playMetronomeTick(true); // 播放第一拍（强拍）

    this.data.metronomeTimer = setInterval(() => {
      let nextBeat = (this.data.currentMetronomeBeat + 1) % this.data.metronomeBeatsCount;
      this.setData({ currentMetronomeBeat: nextBeat });
      this.playMetronomeTick(nextBeat === 0); // 第一拍是强拍
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

  // 执行导入（核心逻辑，由 confirmImport 和 performLoadExample 调用）
  performImport(code, importMode = 'add', importTargetModuleId = null) {
    try {
      // 解析代码
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

    const result = this.performImport(code, this.data.importMode, this.data.importTargetModuleId);
    
    if (result.success) {
      this.closeImportModal();
      wx.showToast({
        title: result.message,
        icon: 'success'
      });
      // 备份当前状态
      this.backupCurrentState();
    } else {
      this.setData({ importError: result.message });
    }
  },

  // 解析导入代码
  parseImportCode(code) {
    const modules = [];
    
    // 移除所有注释（% 开头到行尾）
    code = code.replace(/%[^\n]*/g, '');
    
    // 提取所有module块，支持可选的备注参数
    // 格式1: \begin{module}{A-1} 或 格式2: \begin{module}{A-1}{备注}
    const moduleRegex = /\\begin\{module\}\{([^}]+)\}(?:\{([^}]*)\})?([\s\S]*?)\\end\{module\}/g;
    let match;
    
    while ((match = moduleRegex.exec(code)) !== null) {
      const moduleName = match[1].trim();
      const moduleRemark = match[2] ? match[2].trim() : ''; // 可选的备注
      const moduleContent = match[3].trim();
      
      try {
        const parsedModule = this.parseModuleContent(moduleName, moduleContent);
        parsedModule.remark = moduleRemark; // 添加备注字段
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
    
    // 遍历每一行
    lines.forEach((line, idx) => {
      const measures = this.parseLine(line);
      if (idx === 0) {
        firstLineMeasureCount = measures.length;
      }
      if (measures.length > maxMeasuresPerLine) {
        maxMeasuresPerLine = measures.length;
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
    // token 包括：{...}、完整格式6/D、token/、/token、(...)/(...) 格式、- 、单个数字或字母、·
    // 注意顺序很重要：完整手指定必须先匹配，否则会被拆成两个token
    const tokenRegex = /{[^}]+}|[0-9A-Za-z]+\/[0-9A-Za-z]+|[0-9A-Za-z]+\/|\/[0-9A-Za-z]+|\/\{[^}]+\}|\{[^}]+\}\/|\([^)]*\)\/\([^)]*\)|-|[0-9A-Za-z]|·/g;
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
    // 处理 {4/1} 形式：完整手指定的简写
    if (subStr.startsWith('{') && subStr.endsWith('}') && subStr.includes('/')) {
      const content = subStr.slice(1, -1);
      const slashMatch = content.match(/^({[^}]+}|[0-9A-Za-z]+)\/({[^}]+}|[0-9A-Za-z]+)$/);
      if (slashMatch) {
        const rightToken = slashMatch[1];
        const leftToken = slashMatch[2];
        const rightHand = this.parseHandNotes(this.unwrapBracket(rightToken), 'right');
        const leftHand = this.parseHandNotes(this.unwrapBracket(leftToken), 'left');
        return {
          rightHand: [rightHand[0] || '', rightHand[1] || ''],
          leftHand: [leftHand[0] || '', leftHand[1] || '']
        };
      }
    }
    
    // 匹配 4/1 形式的完整简写（右手/左手）- 包括 6/D 这样的字母格式
    const fullShorthandMatch = subStr.match(/^({[^}]+}|[0-9A-Za-z]+)\/({[^}]+}|[0-9A-Za-z]+)$/);
    if (fullShorthandMatch) {
      const rightToken = fullShorthandMatch[1];
      const leftToken = fullShorthandMatch[2];
      const rightHand = this.parseHandNotes(this.unwrapBracket(rightToken), 'right');
      const leftHand = this.parseHandNotes(this.unwrapBracket(leftToken), 'left');
      return {
        rightHand: [rightHand[0] || '', rightHand[1] || ''],
        leftHand: [leftHand[0] || '', leftHand[1] || '']
      };
    }
    
    // 处理手动指定左右手的格式：数字/ 和 /数字 以及 {token}/、/{token}
    // 例如：1/ → (1)/()（右手only），/1 → ()/(1)（左手only），{12/} → {12}/()（右手only），/{12} → ()/{12}（左手only）
    
    // 匹配 {token}/ 或 数字/ 形式（右手指定）
    const rightHandSpecificMatch = subStr.match(/^({[^}]+}|[0-9A-Za-z]+)\/$/);
    if (rightHandSpecificMatch) {
      const token = rightHandSpecificMatch[1];
      const unwrapped = this.unwrapBracket(token);
      const rightHand = this.parseHandNotes(unwrapped, 'right');
      return {
        rightHand: [rightHand[0] || '', rightHand[1] || ''],
        leftHand: ['', '']
      };
    }
    
    // 匹配 /{token} 或 /数字 形式（左手指定）
    const leftHandSpecificMatch = subStr.match(/^\/({[^}]+}|[0-9A-Za-z]+)$/);
    if (leftHandSpecificMatch) {
      const token = leftHandSpecificMatch[1];
      const unwrapped = this.unwrapBracket(token);
      const leftHand = this.parseHandNotes(unwrapped, 'left');
      return {
        rightHand: ['', ''],
        leftHand: [leftHand[0] || '', leftHand[1] || '']
      };
    }
    
    // 处理 {12} 形式的多位数或其他token
    if (subStr.startsWith('{') && subStr.endsWith('}')) {
      const content = subStr.slice(1, -1);
      const rightHand = this.parseHandNotes(content, 'right');
      return {
        rightHand: [rightHand[0] || '', rightHand[1] || ''],
        leftHand: ['', '']
      };
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
      return {
        rightHand: [rightHandArr[0] || '', rightHandArr[1] || ''],
        leftHand: [leftHandArr[0] || '', leftHandArr[1] || '']
      };
    };

    if (!match) {
      // 简写1：仅有括号 (1,2,3) => (奇数降序)/(偶数升序)
      const singleBracketMatch = subStr.match(/^\(([^)]*)\)$/);
      if (singleBracketMatch) {
        return buildFromSingleBracket(singleBracketMatch[1]);
      }

      // 简写2：单个数字或字母或·，奇数→右手，偶数/字母/·→左手
      if (/^[0-9A-Za-z·]+$/.test(subStr)) {
        const n = parseInt(subStr, 10);
        if (!Number.isNaN(n)) {
          if (n % 2 === 0) {
            const leftHand = this.parseHandNotes(subStr, 'left');
            return {
              rightHand: ['', ''],
              leftHand: [leftHand[0] || '', leftHand[1] || '']
            };
          }
          const rightHand = this.parseHandNotes(subStr, 'right');
          return {
            rightHand: [rightHand[0] || '', rightHand[1] || ''],
            leftHand: ['', '']
          };
        }
        // 字母和·视作偶数，放在左手
        const leftHand = this.parseHandNotes(subStr, 'left');
        return {
          rightHand: ['', ''],
          leftHand: [leftHand[0] || '', leftHand[1] || '']
        };
      }

      // 空字符串或无法匹配时返回空占位，避免整段失败
      if (!subStr) {
        return {
          rightHand: ['', ''],
          leftHand: ['', '']
        };
      }
      throw new Error(`无效的音符格式: ${subStr}`);
    }

    const rightHandStr = match[1];
    const leftHandStr = match[2];
    
    // 解析右手和左手
    const rightHand = this.parseHandNotes(rightHandStr, 'right');
    const leftHand = this.parseHandNotes(leftHandStr, 'left');
    
    return {
      rightHand: [rightHand[0] || '', rightHand[1] || ''],
      leftHand: [leftHand[0] || '', leftHand[1] || '']
    };
  },

  // 解析单手音符（返回数组 [slot0, slot1]）
  parseHandNotes(handStr, hand) {
    if (!handStr || handStr.length === 0) {
      return ['', ''];
    }
    
    // 按逗号分割
    const notes = handStr.split(',').map(n => n.trim());
    
    if (notes.length === 1) {
      // 单个音符：默认放在靠近中轴线的位置
      // 右手：放在slot1（index 1）
      // 左手：放在slot0（index 0，因为左手的slot0更靠近中轴线）
      const parsedNote = this.parseNote(notes[0]);
      if (hand === 'right') {
        return ['', parsedNote];
      } else {
        return [parsedNote, ''];
      }
    } else if (notes.length === 2) {
      // 两个音符：外侧和内侧
      const note0 = this.parseNote(notes[0]);
      const note1 = this.parseNote(notes[1]);
      return [note0, note1];
    } else if (notes.length > 2) {
      // 超过2个，只取前两个
      const note0 = this.parseNote(notes[0]);
      const note1 = this.parseNote(notes[1]);
      return [note0, note1];
    }
    
    return ['', ''];
  },

  // 解析单个音符（处理装饰符号）
  parseNote(noteStr) {
    if (!noteStr || noteStr.length === 0) {
      return '';
    }
    
    // 在简谱模式下，保留装饰符号（^. 或 _.）和·
    // 在数字谱模式下，移除装饰符号但保留·
    if (this.data.notationType === 'simplified') {
      // 简谱模式：保留修饰符，允许字母/数字/·
      let cleaned = noteStr.replace(/\{_(.+?)_\}/, '$1');
      const match = cleaned.match(/^([0-9A-Za-z·]+)([\^_]\.)?/);
      if (match) {
        return (match[1] || '') + (match[2] || '');
      }
      // 无法匹配时，返回去除空白后的原始内容，避免丢失字母和·
      cleaned = cleaned.trim();
      return cleaned || '';
    } else {
      // 数字谱模式：移除修饰符，但允许字母/数字/·
      let cleaned = noteStr;
      cleaned = cleaned.replace(/\{_(.+?)_\}/, '$1');
      cleaned = cleaned.replace(/[\^_]\./g, '');

      if (!/^[0-9A-Za-z·]+$/.test(cleaned)) {
        const tokenMatch = cleaned.match(/[0-9A-Za-z·]+/);
        if (tokenMatch) {
          cleaned = tokenMatch[0];
        } else {
          // 无法解析也不丢弃，直接返回去空白后的原始内容
          cleaned = cleaned.trim();
          return cleaned || '';
        }
      }

      return cleaned;
    }
  },

  // 辅助方法：从 {content} 中提取内容，或直接返回token
  unwrapBracket(token) {
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
      return {
        beats: parsedMeasure.beats.map(parsedBeat => {
          return {
            subdivisions: parsedBeat.subdivisions
          };
        })
      };
    });

    // 依据导入数据推断自定义模板
    const tempNotation = {
      measures,
      measuresPerRow: portraitRow
    };
    const inferredTemplate = this.inferTemplateFromNotation(tempNotation);
    
    return {
      id: Date.now() + Math.floor(Math.random() * 10000),
      label: parsedModule.name,
      remark: parsedModule.remark || '', // 添加备注字段
      measures: measures,
      timeSignature: '自由/自由',
      moduleTimeSignature: 'custom',
      moduleCustomTemplate: inferredTemplate,
      measuresPerRowPortrait: portraitRow,
      measuresPerRow: portraitRow * factor
    };
  },

  // 打开记谱类型选择模态框
  openNotationTypeModal() {
    const currentType = this.data.notationType || 'digital';
    this.setData({
      showNotationTypeModal: true,
      notationTypeTemp: currentType,
      migrateMeasures: true,
      customConversionTable: false,
      conversionTableText: '',
      conversionTableError: ''
    });
  },

  // 关闭谱式转换模态框
  closeNotationTypeModal() {
    this.setData({
      showNotationTypeModal: false,
      notationTypeTemp: this.data.notationType,
      conversionTableText: '',
      conversionTableError: ''
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

    // 验证转换表（如果使用自定义）
    if (this.data.customConversionTable) {
      if (!this.validateConversionTable(this.data.conversionTableText)) {
        return;
      }
    }

    // 如果从简谱转到数字谱，不需要特殊处理
    // 如果从数字谱转到简谱，需要根据转换表转换数据
    if (oldType === newType) {
      wx.showToast({
        title: '谱式未改变',
        icon: 'none'
      });
      return;
    }

    // 更新当前谱式
    this.setData({
      notationType: newType
    });

    // 保存到存储
    wx.setStorageSync('notationType', newType);

    // 处理数据
    if (this.data.migrateMeasures) {
      // 迁移数据：转换所有音符
      if (newType === 'simplified') {
        this.convertToSimplifiedNotation();
      } else {
        // 从简谱转到数字谱
        this.convertToDigitalNotation();
      }
      wx.showToast({
        title: '已转换至' + (newType === 'simplified' ? '简谱' : '数字谱'),
        icon: 'success'
      });
    } else {
      // 清空所有谱面数据
      const emptyNotations = this.data.notations.map(notation => ({
        ...notation,
        measures: notation.measures.map(measure => ({
          beats: measure.beats.map(beat => ({
            subdivisions: beat.subdivisions.map(() => ({
              rightHand: ['', ''],
              leftHand: ['', '']
            })),
            barLineAfter: beat.barLineAfter
          }))
        }))
      }));
      
      this.setData({
        notations: emptyNotations
      });
      this.saveNotationsScoped(emptyNotations);
      
      wx.showToast({
        title: '已清空数据并转换至' + (newType === 'simplified' ? '简谱' : '数字谱'),
        icon: 'success'
      });
    }

    this.closeNotationTypeModal();
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
    // 处理多对一映射的情况（如 'T' 和 'D' 都映射到 '6_.'）
    const reverseTable = {};
    const baseToSourceMap = {}; // 基础音符（不含修饰符）到源音符的映射
    
    for (const key in table) {
      if (key === 'T') continue; // 跳过 T，因为 D 也映射到相同值
      const value = table[key];
      reverseTable[value] = key;
      
      // 记录基础音符映射，用于修饰符查找
      const baseNote = value.replace(/[\^_]\.$/g, '');
      if (!baseToSourceMap[baseNote]) {
        baseToSourceMap[baseNote] = key;
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
  convertNoteToSimplified(note, table) {
    if (!note || note.length === 0) {
      return '';
    }

    // 提取数字部分（支持修饰符如^.和_.）
    const baseNote = note.replace(/[\^_]\./g, '');
    const modifiers = note.match(/[\^_]\./g) ? note.match(/[\^_]\./g)[0] : '';

    if (!table[baseNote]) {
      return note; // 无法转换，返回原值
    }

    const simplified = table[baseNote];
    return simplified + modifiers;
  },

  // 将音符转换为数字谱
  convertNoteToDigital(note, reverseTable, baseToSourceMap) {
    if (!note || note.length === 0) {
      return '';
    }

    // 提取修饰符（如 ^. 或 _.）
    const modifierMatch = note.match(/[\^_]\.$/);
    const modifier = modifierMatch ? modifierMatch[0] : '';
    
    // 移除修饰符后的基础部分
    const baseNote = note.replace(/[\^_]\.$/g, '');

    // 首先尝试精确匹配（包含修饰符）
    if (reverseTable[note]) {
      return reverseTable[note];
    }
    
    // 如果有修饰符，尝试基础音符加修饰符的转换
    if (modifier && baseToSourceMap && baseToSourceMap[baseNote]) {
      const sourceDigital = baseToSourceMap[baseNote];
      // 检查源表中是否有相应的修饰符版本
      return sourceDigital + modifier;
    }
    
    // 尝试基础音符匹配
    if (reverseTable[baseNote]) {
      return reverseTable[baseNote];
    }

    // 无法转换，返回原值
    return note;
  },

  // 加载谱式设置
  // 设置 notations 数据并自动更新分页
  setNotations(notations) {
    const normalized = this.normalizeBarLines(notations);
    const withOffsets = this.updateMeasureOffsets(normalized);
    this.setData({ notations: withOffsets });
    this.calculatePages();
  },

  // 计算分页：根据24小节分割，创建分页数组
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

    const MEASURES_PER_PAGE = 24;
    const pages = [];
    let currentPageModules = [];
    let currentMeasureCount = 0;
    let pageStartMeasureCount = 0;

    for (let i = 0; i < notations.length; i++) {
      const notation = notations[i];
      const moduleId = notation.id || `module-${i}`;
      const moduleMeasureCount = (notation.measures && notation.measures.length) || 0;

      // 如果加入当前module会超过24小节，且已有module在页面中，则开启新页面
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

          // 再等待一帧，关闭加载遮罩与节拍器
          setTimeout(() => {
            this.hidePageLoadingOverlay();
          }, 80);
        }, 50);
      }, 250);  // 淡出动画时长
    });
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
  },

  // 检查是否显示开屏弹窗
  checkAndShowSplashModal() {
    const dismissed = wx.getStorageSync('splashModalDismissed');
    if (!dismissed) {
      // 检测是否为平板设备
      const isTablet = this.checkIsTablet();
      this.setData({ showSplashModal: true, isTablet });
    }
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

  // 开屏弹窗：用户手册
  onSplashViewManual() {
    // 关闭弹窗
    this.closeSplashModal();
    
    // 延迟导航，确保弹窗先关闭
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/settings/settings',
        fail: () => {
          wx.showToast({
            title: '无法打开帮助页面',
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
  }
});

