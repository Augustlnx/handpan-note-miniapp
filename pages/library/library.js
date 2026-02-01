// pages/library/library.js
const libraryManager = require('../../utils/libraryManager.js');

Page({
  data: {
    // 标签状态
    activeTab: 'personal', // 'personal' | 'public'
    
    // 界面控制
    editMode: false,
    showSearchBar: false,
    showSortMenu: false,
    showMenu: false,
    showInputModal: false,
    showFolderPicker: false,
    showFabMenu: false, // 悬浮按钮菜单
    showImportModal: false, // 导入弹窗
    showNewFileModal: false, // 新建文件弹窗
    showImportJsonModal: false, // 导入JSON曲谱弹窗
    importJsonCode: '', // 导入的JSON代码
    importJsonError: '', // JSON解析错误
    importJsonPreview: null, // 解析预览数据
    
    // 数据状态
    currentPath: [], // 当前文件夹路径
    breadcrumbs: [], // 面包屑导航
    displayItems: [], // 当前显示的项目列表
    recentFiles: [], // 最近打开的文件
    allFolders: [], // 所有文件夹列表（用于移动）
    
    // 搜索和排序
    searchKeyword: '',
    sortType: 'name', // 'name' | 'createTime' | 'modifyTime'
    
    // 选择状态
    selectedCount: 0,
    
    // 弹窗状态
    menuItems: [],
    currentItem: null,
    inputModalTitle: '',
    inputModalPlaceholder: '',
    inputModalValue: '',
    inputModalCallback: null,
    
    // 导入弹窗状态
    importFileName: '',
    importTargetPath: [],
    importFolderItems: [],
    importFolderBreadcrumbs: [],
    importFolderCurrentPath: [],
    importSnapshot: null,
    
    // 新建文件数据
    newFileData: {
      file_name: '',
      title: '',
      subtitle: 'Author: Unknown',
      composer: 'Your Name',
      rootNote: 'D',
      scaleType: 'Kurd',
      noteCount: 10,
      tempo: 60,
      timing: '4/4',
      notationType: 'digital',
      difficulty: 1,
      introduction: ''
    },
    
    // 选项数据
    rootNoteOptions: ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'],
    scaleTypeOptions: [
      'Aegean', 'Akebono', 'Amara / Celtic Minor', 'Ashakiran / Sabye', 'Avebury',
      'Blues', 'Equinox', 'Hijaz / Harmonic Minor', 'Integral', 'Kurd / Annaziska',
      'La Sirena', 'Low Mystic', 'Magic Voyage', 'Major', 'Minor', 'Nordlys',
      'Onoleo', 'Oxalista', 'Pentatonic', 'Pygmy / Low Pygmy', 'Raga Desh',
      'Romanian', 'Saladin', 'Ursa Minor', 'Ysha Savita', 'Multi scale', 'Other scale'
    ],
    scaleTypeDisplayOptions: [
      'Aegean', 'Akebono', 'Amara', 'Ashakiran', 'Avebury',
      'Blues', 'Equinox', 'Hijaz', 'Integral', 'Kurd',
      'La Sirena', 'Low Mystic', 'Magic Voyage', 'Major', 'Minor', 'Nordlys',
      'Onoleo', 'Oxalista', 'Pentatonic', 'Pygmy', 'Raga Desh',
      'Romanian', 'Saladin', 'Ursa Minor', 'Ysha Savita', 'Multi scale', 'Other scale'
    ],
    noteCountOptions: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    timingOptions: ['3/4', '4/4', '6/8', '自由设定'],
    notationTypeOptions: ['digital', 'simplified'],
    
    // iOS风格选择器状态
    showRootNotePicker: false,
    showScaleTypePicker: false,
    showNoteCountPicker: false,
    rootNotePickerValue: [2], // 默认D
    scaleTypePickerValue: [9], // 默认Kurd
    noteCountPickerValue: [3], // 默认10音
    tempRootNote: 'D',
    tempScaleType: 'Kurd',
    tempNoteCount: 10,
    
    // 分包图片动态路径（延迟加载）
    subpkgImgs: {
      search: '',
      sort: '',
      more: '',
      folderClose: '',
      star: '',
      engineering: '',
      fileAdd: '',
      folderPlus: '',
      plus: '',
      fileConversion: ''
    }
  },

  onLoad() {
    // 初始化示例数据（仅首次使用时）
    libraryManager.initSampleData();
    this.loadLibraryData();
    
    // 初始化分包图片重试计数器
    this.subpkgImgRetryCount = {};
    
    // 1秒后开始加载分包图片（等待分包下载）
    setTimeout(() => {
      this.loadSubpkgImages();
    }, 1000);
  },

  // 分包图片配置
  getSubpkgImgConfig() {
    return {
      search: '/subpackages/resources/icons/library/搜索_search.png',
      sort: '/subpackages/resources/icons/library/排序_sort.png',
      more: '/subpackages/resources/icons/library/更多_more-app.png',
      folderClose: '/subpackages/resources/icons/library/文件夹-关_folder-close.png',
      star: '/subpackages/resources/icons/library/星星_star.png',
      engineering: '/subpackages/resources/icons/library/工程车_engineering-vehicle.png',
      fileAdd: '/subpackages/resources/icons/library/file-addition.png',
      folderPlus: '/subpackages/resources/icons/library/folder-plus.png',
      plus: '/subpackages/resources/icons/library/加_plus.svg',
      fileConversion: '/subpackages/resources/icons/library/file-conversion-folder.png'
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

  // 分包图片加载失败处理（5秒后重试，最多3次）
  onSubpkgImgError(e) {
    const type = e.currentTarget.dataset.type;
    if (!type) return;
    
    // 初始化重试计数
    if (!this.subpkgImgRetryCount[type]) {
      this.subpkgImgRetryCount[type] = 0;
    }
    
    // 最多重试3次
    if (this.subpkgImgRetryCount[type] >= 3) {
      console.warn(`[Library] 分包图片 ${type} 加载失败，已达最大重试次数`);
      return;
    }
    
    this.subpkgImgRetryCount[type]++;
    console.log(`[Library] 分包图片 ${type} 加载失败，5秒后进行第 ${this.subpkgImgRetryCount[type]} 次重试...`);
    
    // 5秒后重试
    setTimeout(() => {
      const config = this.getSubpkgImgConfig();
      const newPath = config[type] + '?t=' + Date.now();
      this.setData({
        [`subpkgImgs.${type}`]: newPath
      });
    }, 5000);
  },

  onShow() {
    // 每次显示页面时刷新数据
    this.loadLibraryData();
  },

  // ========== 数据加载 ==========
  loadLibraryData() {
    const currentPath = this.data.currentPath;
    const searchKeyword = this.data.searchKeyword;
    const sortType = this.data.sortType;

    // 获取当前目录的内容
    let items = libraryManager.getItemsByPath(currentPath);

    // 搜索过滤
    if (searchKeyword) {
      items = items.filter(item => 
        item.name && item.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.file_name && item.file_name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // 排序
    items = this.sortItems(items, sortType);

    // 更新面包屑
    const breadcrumbs = this.generateBreadcrumbs(currentPath);

    // 获取最近打开的文件
    const recentFiles = libraryManager.getRecentFiles();

    // 获取所有文件夹（用于移动功能）
    const allFolders = libraryManager.getAllFolders();

    this.setData({
      displayItems: items,
      breadcrumbs,
      recentFiles,
      allFolders
    });
  },

  // 排序项目
  sortItems(items, sortType) {
    const folders = items.filter(item => item.type === 'folder');
    const files = items.filter(item => item.type === 'file');

    const sortFn = (a, b) => {
      switch(sortType) {
        case 'name':
          const nameA = a.name || a.file_name || '';
          const nameB = b.name || b.file_name || '';
          return nameA.localeCompare(nameB);
        case 'createTime':
          return (b.createTime || 0) - (a.createTime || 0);
        case 'modifyTime':
          return (b.modifyTime || 0) - (a.modifyTime || 0);
        default:
          return 0;
      }
    };

    return [...folders.sort(sortFn), ...files.sort(sortFn)];
  },

  // 生成面包屑导航
  generateBreadcrumbs(path) {
    return path.map((folderId, index) => {
      const folder = libraryManager.getFolderById(folderId);
      return {
        id: folderId,
        name: folder ? folder.name : '未知',
        index
      };
    });
  },

  // ========== 标签切换 ==========
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    if (tab === 'public') {
      wx.showToast({
        title: '功能开发中',
        icon: 'none',
        duration: 2000
      });
    }
    this.setData({ activeTab: tab });
  },

  // ========== 导航操作 ==========
  navigateToRoot() {
    this.setData({ 
      currentPath: [],
      searchKeyword: '',
      editMode: false,
      showFabMenu: false
    }, () => {
      this.loadLibraryData();
    });
  },

  navigateToFolder(e) {
    const index = e.currentTarget.dataset.index;
    const newPath = this.data.currentPath.slice(0, index + 1);
    this.setData({ 
      currentPath: newPath,
      editMode: false,
      showFabMenu: false
    }, () => {
      this.loadLibraryData();
    });
  },

  enterFolder(e) {
    if (this.data.editMode) return;
    
    const item = e.currentTarget.dataset.item;
    if (item.type !== 'folder') return;

    const newPath = [...this.data.currentPath, item.id];
    this.setData({ 
      currentPath: newPath,
      searchKeyword: '',
      showFabMenu: false
    }, () => {
      this.loadLibraryData();
    });
  },

  navigateBackFolder() {
    if (this.data.currentPath.length === 0) return;
    const newPath = this.data.currentPath.slice(0, -1);
    this.setData({ currentPath: newPath, editMode: false, showFabMenu: false }, () => {
      this.loadLibraryData();
    });
  },

  // ========== 工具栏操作 ==========
  toggleSearchBar() {
    this.setData({ 
      showSearchBar: !this.data.showSearchBar,
      showSortMenu: false,
      showFabMenu: false
    });
  },

  toggleSortMenu() {
    this.setData({ 
      showSortMenu: !this.data.showSortMenu,
      showSearchBar: false,
      showFabMenu: false
    });
  },

  toggleEditMode() {
    const newEditMode = !this.data.editMode;
    
    // 退出编辑模式时清除选择状态
    if (!newEditMode) {
      const items = this.data.displayItems.map(item => ({
        ...item,
        selected: false
      }));
      this.setData({ 
        editMode: newEditMode,
        displayItems: items,
        selectedCount: 0,
        showFabMenu: false
      });
    } else {
      this.setData({ 
        editMode: newEditMode,
        showFabMenu: false
      });
    }
  },

  // ========== 悬浮按钮菜单 ==========
  toggleFabMenu() {
    this.setData({ showFabMenu: !this.data.showFabMenu });
  },

  closeFabMenu() {
    this.setData({ showFabMenu: false });
  },

  // ========== 搜索操作 ==========
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword }, () => {
      this.loadLibraryData();
    });
  },

  cancelSearch() {
    this.setData({ 
      showSearchBar: false,
      searchKeyword: ''
    }, () => {
      this.loadLibraryData();
    });
  },

  // ========== 排序操作 ==========
  changeSortType(e) {
    const sortType = e.currentTarget.dataset.type;
    this.setData({ 
      sortType,
      showSortMenu: false
    }, () => {
      this.loadLibraryData();
    });
  },

  // ========== 文件操作辅助方法 ==========
  // 构造文件payload对象
  _buildFilePayload(item) {
    return {
      id: item.id,
      path: item.path || [],
      file_name: item.file_name,
      title: item.title,
      subtitle: item.subtitle,
      tempo: item.tempo,
      rotation: item.rotation,
      timing: item.timing,
      notationType: item.notationType || 'digital', // 保留谱式类型
      composer: item.composer,
      rootNote: item.rootNote,
      scaleType: item.scaleType,
      noteCount: item.noteCount,
      difficulty: item.difficulty,
      introduction: item.introduction,
      code: item.code
    };
  },

  // 加载文件到记谱页
  _loadFileToNotation(item, addToRecent = true) {
    const payload = this._buildFilePayload(item);
    wx.setStorageSync('pending_notation_load', payload);
    wx.showLoading({ title: '加载谱面...', mask: true });
    wx.switchTab({
      url: '/pages/notation/notation',
      success: () => {
        if (addToRecent) {
          libraryManager.addRecentFile(item);
          this.loadLibraryData();
        }
      },
      fail: () => {
        wx.showToast({ title: '打开失败，请重试', icon: 'none' });
        wx.hideLoading();
      }
    });
  },

  // ========== 文件操作 ==========
  openFile(e) {
    if (this.data.editMode) return;
    
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '覆盖当前谱面？',
      content: '打开该乐谱会覆盖记谱页当前内容，请在切换前及时保存当前谱面数据，是否继续？',
      confirmText: '继续',
      cancelText: '取消',
      success: (res) => {
        if (!res.confirm) return;
        this._loadFileToNotation(item);
      }
    });
  },

  openRecentFile(e) {
    const file = e.currentTarget.dataset.file;
    this.openFile({ currentTarget: { dataset: { item: file } } });
  },

  // ========== 菜单操作 ==========
  showFolderMenu(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      currentItem: item,
      showMenu: true,
      menuItems: [
        { text: '重命名', icon: '/assets/icons/folder-rename.png', action: 'renameFolder' },
        { text: '删除', icon: '/assets/icons/file_delete.svg', action: 'deleteFolder' }
      ]
    });
  },

  showFileMenu(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      currentItem: item,
      showMenu: true,
      menuItems: [
        { text: '打开', icon: '/subpackages/resources/icons/library/file-rename.png', action: 'openFile' },
        { text: '重命名', icon: '/assets/icons/folder-rename.png', action: 'renameFile' },
        { text: item.starred ? '取消收藏' : '收藏', icon: '/subpackages/resources/icons/library/星星_star.png', action: 'toggleStar' },
        { text: '移动', icon: '/subpackages/resources/icons/library/file-conversion-folder.png', action: 'moveFile' },
        { text: '删除', icon: '/assets/icons/file_delete.svg', action: 'deleteFile' }
      ]
    });
  },

  showItemMenu(e) {
    const item = e.currentTarget.dataset.item;
    if (item.type === 'folder') {
      this.showFolderMenu(e);
    } else {
      this.showFileMenu(e);
    }
  },

  handleMenuAction(e) {
    const action = e.currentTarget.dataset.action;
    const item = this.data.currentItem;

    this.closeMenu();

    switch(action) {
      case 'openFile':
        this.openFile({ currentTarget: { dataset: { item } } });
        break;
      case 'renameFolder':
        this.showRenameModal(item, 'folder');
        break;
      case 'renameFile':
        this.showRenameModal(item, 'file');
        break;
      case 'deleteFolder':
        this.confirmDelete(item, 'folder');
        break;
      case 'deleteFile':
        this.confirmDelete(item, 'file');
        break;
      case 'toggleStar':
        this.toggleStar({ currentTarget: { dataset: { id: item.id } } });
        break;
      case 'moveFile':
        this.showMoveFilePicker(item);
        break;
    }
  },

  closeMenu() {
    this.setData({ 
      showMenu: false,
      currentItem: null
    });
  },

  // ========== 添加操作 ==========
  addNewFile() {
    this.closeFabMenu();
    // 重置新建文件数据
    this.setData({
      showNewFileModal: true,
      newFileData: {
        file_name: '',
        title: '',
        subtitle: 'Author: Unknown',
        composer: 'Your Name',
        rootNote: 'D',
        scaleType: 'Kurd',
        noteCount: 10,
        tempo: 60,
        timing: '4/4',
        notationType: 'digital',
        difficulty: 1,
        introduction: ''
      }
    });
  },

  // 新建文件表单输入处理
  onNewFileNameInput(e) {
    this.setData({ 'newFileData.file_name': e.detail.value });
  },

  onNewFileTitleInput(e) {
    this.setData({ 'newFileData.title': e.detail.value });
  },

  onNewFileSubtitleInput(e) {
    this.setData({ 'newFileData.subtitle': e.detail.value });
  },

  onNewFileComposerInput(e) {
    this.setData({ 'newFileData.composer': e.detail.value });
  },

  onNewFileRootNoteChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 'newFileData.rootNote': this.data.rootNoteOptions[index] });
  },

  onNewFileScaleTypeChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 'newFileData.scaleType': this.data.scaleTypeOptions[index] });
  },

  onNewFileNoteCountChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 'newFileData.noteCount': this.data.noteCountOptions[index] });
  },

  onNewFileTempoInput(e) {
    let tempo = parseInt(e.detail.value) || 60;
    tempo = Math.max(20, Math.min(300, tempo));
    this.setData({ 'newFileData.tempo': tempo });
  },

  onNewFileTimingChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 'newFileData.timing': this.data.timingOptions[index] });
  },

  onNewFileNotationTypeChange(e) {
    const index = parseInt(e.detail.value);
    this.setData({ 'newFileData.notationType': this.data.notationTypeOptions[index] });
  },

  onNewFileDifficultyTap(e) {
    const level = parseInt(e.currentTarget.dataset.star);
    this.setData({ 'newFileData.difficulty': level });
  },

  onNewFileIntroInput(e) {
    this.setData({ 'newFileData.introduction': e.detail.value });
  },

  confirmNewFile() {
    const data = this.data.newFileData;
    
    if (!data.file_name) {
      wx.showToast({ title: '文件名不能为空', icon: 'none' });
      return;
    }

    // 创建默认谱面数据（空模块 A-1，四行占位）
    const defaultCode = `\\begin{module}{A-1}
[----|----|----|----]\\\\
[----|----|----|----]\\\\
[----|----|----|----]\\\\
[----|----|----|----]
\\end{module}
`;

    const newFile = {
      file_name: data.file_name,
      title: data.title || data.file_name,
      subtitle: data.subtitle || 'Author: Unknown',
      composer: data.composer || '',
      rootNote: data.rootNote || 'D',
      scaleType: data.scaleType || 'Kurd',
      noteCount: data.noteCount || 10,
      tempo: data.tempo || 60,
      rotation: "手机竖屏（默认）",
      timing: data.timing || "4/4",
      notationType: data.notationType || 'digital',
      difficulty: data.difficulty || 1,
      introduction: data.introduction || '',
      code: defaultCode
    };

    const created = libraryManager.addFile(this.data.currentPath, newFile);
    
    this.setData({ showNewFileModal: false });
    wx.showToast({ title: `创建成功：${created.file_name}`, icon: 'success' });
    this.loadLibraryData();
    
    // 自动打开新创建的文件
    setTimeout(() => {
      this._loadFileToNotation(created);
    }, 300);
  },

  closeNewFileModal() {
    this.setData({ showNewFileModal: false });
  },

  // ========== 导入JSON曲谱方法 ==========
  
  // 打开导入JSON弹窗
  openImportJsonModal() {
    this.setData({
      showNewFileModal: false,
      showImportJsonModal: true,
      importJsonCode: '',
      importJsonError: '',
      importJsonPreview: null
    });
  },
  
  // 关闭导入JSON弹窗
  closeImportJsonModal() {
    this.setData({
      showImportJsonModal: false,
      importJsonCode: '',
      importJsonError: '',
      importJsonPreview: null
    });
  },
  
  // 输入JSON代码
  onImportJsonInput(e) {
    const code = e.detail.value;
    this.setData({ importJsonCode: code });
    
    // 实时解析验证
    this._parseImportJson(code);
  },
  
  // 解析导入的JSON
  _parseImportJson(code) {
    if (!code || !code.trim()) {
      this.setData({
        importJsonError: '',
        importJsonPreview: null
      });
      return;
    }
    
    try {
      const trimmed = code.trim();
      
      // 检查是否为JSON格式
      if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
        this.setData({
          importJsonError: '请输入有效的JSON格式代码',
          importJsonPreview: null
        });
        return;
      }
      
      const parsed = JSON.parse(trimmed);
      
      // 检查是否为完整曲谱格式
      if (parsed.format !== 'handpan-notation') {
        this.setData({
          importJsonError: '不是有效的曲谱格式，请确认代码来源',
          importJsonPreview: null
        });
        return;
      }
      
      if (!parsed.metadata || !parsed.modules) {
        this.setData({
          importJsonError: '缺少必要的曲谱数据',
          importJsonPreview: null
        });
        return;
      }
      
      // 解析成功，显示预览
      this.setData({
        importJsonError: '',
        importJsonPreview: {
          title: parsed.metadata.title || '未命名',
          composer: parsed.metadata.composer || '未知',
          rootNote: parsed.metadata.rootNote || 'D',
          scaleType: parsed.metadata.scaleType || 'Kurd'
        }
      });
      
    } catch (e) {
      this.setData({
        importJsonError: 'JSON格式错误：' + (e.message || '解析失败'),
        importJsonPreview: null
      });
    }
  },
  
  // 确认导入JSON
  confirmImportJson() {
    const code = this.data.importJsonCode.trim();
    
    if (!this.data.importJsonPreview) {
      wx.showToast({ title: '请先输入有效的曲谱代码', icon: 'none' });
      return;
    }
    
    try {
      const parsed = JSON.parse(code);
      const { metadata, colors, layout, modules } = parsed;
      
      // 生成文件名（使用标题或默认值）
      const fileName = metadata.title || '导入的曲谱';
      
      // 构建新文件数据
      const newFile = {
        type: 'file',
        file_name: fileName,
        title: metadata.title || '',
        subtitle: metadata.subtitle || 'Author: Unknown',
        composer: metadata.composer || 'Your Name',
        rootNote: metadata.rootNote || 'D',
        scaleType: metadata.scaleType || 'Kurd',
        noteCount: metadata.noteCount || 10,
        tempo: metadata.tempo || 60,
        timing: '4/4',
        notationType: metadata.notationType || 'digital',
        difficulty: metadata.difficulty || 1,
        introduction: metadata.introduction || '',
        // 颜色配置
        colors: colors || {
          mainTitleColor: '#314D63',
          subTitleColor: '#8FB9AB',
          rightHandColor: '#F4D096',
          leftHandColor: '#314D63'
        },
        // 布局配置
        layout: layout || {
          orientation: 'portrait',
          measuresPerRow: 1
        },
        // 谱面代码
        code: modules,
        createTime: Date.now(),
        modifyTime: Date.now()
      };
      
      // 添加到当前目录
      const created = libraryManager.addFile(this.data.currentPath, newFile);
      
      // 关闭弹窗
      this.setData({ 
        showImportJsonModal: false,
        importJsonCode: '',
        importJsonError: '',
        importJsonPreview: null
      });
      
      wx.showToast({ title: '导入成功', icon: 'success' });
      this.loadLibraryData();
      
      // 自动打开导入的文件
      setTimeout(() => {
        this._loadFileToNotation(created);
      }, 300);
      
    } catch (e) {
      console.error('导入JSON失败:', e);
      wx.showToast({ title: '导入失败: ' + e.message, icon: 'none' });
    }
  },

  // ========== iOS风格选择器方法 ==========
  
  // 主音选择器
  showRootNotePicker() {
    const currentIndex = this.data.rootNoteOptions.indexOf(this.data.newFileData.rootNote);
    this.setData({
      showRootNotePicker: true,
      rootNotePickerValue: [currentIndex >= 0 ? currentIndex : 2],
      tempRootNote: this.data.newFileData.rootNote
    });
  },
  
  closeRootNotePicker() {
    this.setData({ showRootNotePicker: false });
  },
  
  onRootNotePickerChange(e) {
    const index = e.detail.value[0];
    this.setData({
      tempRootNote: this.data.rootNoteOptions[index],
      rootNotePickerValue: [index]
    });
  },
  
  confirmRootNotePicker() {
    this.setData({
      'newFileData.rootNote': this.data.tempRootNote,
      showRootNotePicker: false
    });
  },
  
  // 调式选择器
  showScaleTypePicker() {
    const currentIndex = this.data.scaleTypeOptions.indexOf(this.data.newFileData.scaleType);
    this.setData({
      showScaleTypePicker: true,
      scaleTypePickerValue: [currentIndex >= 0 ? currentIndex : 9],
      tempScaleType: this.data.newFileData.scaleType
    });
  },
  
  closeScaleTypePicker() {
    this.setData({ showScaleTypePicker: false });
  },
  
  onScaleTypePickerChange(e) {
    const index = e.detail.value[0];
    this.setData({
      tempScaleType: this.data.scaleTypeOptions[index],
      scaleTypePickerValue: [index]
    });
  },
  
  confirmScaleTypePicker() {
    this.setData({
      'newFileData.scaleType': this.data.tempScaleType,
      showScaleTypePicker: false
    });
  },
  
  // 音位数选择器
  showNoteCountPicker() {
    const currentIndex = this.data.noteCountOptions.indexOf(this.data.newFileData.noteCount);
    this.setData({
      showNoteCountPicker: true,
      noteCountPickerValue: [currentIndex >= 0 ? currentIndex : 3],
      tempNoteCount: this.data.newFileData.noteCount
    });
  },
  
  closeNoteCountPicker() {
    this.setData({ showNoteCountPicker: false });
  },
  
  onNoteCountPickerChange(e) {
    const index = e.detail.value[0];
    this.setData({
      tempNoteCount: this.data.noteCountOptions[index],
      noteCountPickerValue: [index]
    });
  },
  
  confirmNoteCountPicker() {
    this.setData({
      'newFileData.noteCount': this.data.tempNoteCount,
      showNoteCountPicker: false
    });
  },
  
  // 阻止事件冒泡
  stopPropagation() {},

  addNewFolder() {
    this.closeFabMenu();
    this.showInputModal({
      title: '新建文件夹',
      placeholder: '请输入文件夹名称',
      value: '',
      callback: (name) => {
        if (!name) {
          wx.showToast({ title: '文件夹名称不能为空', icon: 'none' });
          return;
        }

        libraryManager.addFolder(this.data.currentPath, name);
        wx.showToast({ title: '创建成功', icon: 'success' });
        this.loadLibraryData();
      }
    });
  },

  importFromNotation() {
    this.closeFabMenu();
    const snapshot = wx.getStorageSync('latest_notation_snapshot_for_library');

    if (!snapshot || !snapshot.code) {
      wx.showModal({
        title: '需要先在记谱页保存',
        content: '请在“记谱”页面点击“保存到曲库”后再回来导入。',
        confirmText: '去记谱',
        success: (res) => {
          if (res.confirm) {
            wx.switchTab({ url: '/pages/notation/notation' });
          }
        }
      });
      return;
    }

    this.setData({
      showImportModal: true,
      importFileName: snapshot.file_name || snapshot.title || '未命名',
      importTargetPath: [],
      importFolderItems: [],
      importFolderBreadcrumbs: [],
      importFolderCurrentPath: [],
      importSnapshot: snapshot
    });
    this.refreshImportFolderView([]);
  },

  closeImportModal(silent) {
    const suppressToast = silent === true;
    this.setData({
      showImportModal: false,
      importFileName: '',
      importTargetPath: [],
      importFolderItems: [],
      importFolderBreadcrumbs: [],
      importFolderCurrentPath: [],
      importSnapshot: null
    });
    if (!suppressToast) {
      wx.showToast({ title: '已取消导入', icon: 'none' });
    }
  },

  onImportFileNameInput(e) {
    this.setData({ importFileName: e.detail.value });
  },

  confirmImportFromNotation() {
    const snapshot = this.data.importSnapshot || wx.getStorageSync('latest_notation_snapshot_for_library');
    if (!snapshot || !snapshot.code) {
      wx.showToast({ title: '暂无可导入的谱面', icon: 'none' });
      return;
    }

    const name = (this.data.importFileName || '').trim();
    if (!name) {
      wx.showToast({ title: '请输入文件名', icon: 'none' });
      return;
    }

    const { id, ...rest } = snapshot; // 避免复用旧ID
    const payload = {
      ...rest,
      file_name: name,
      title: snapshot.title || name
    };

    const created = libraryManager.addFile(this.data.importTargetPath || [], payload);
    wx.showToast({ title: `已导入：${created.file_name}`, icon: 'success' });
    this.closeImportModal(true);
    this.loadLibraryData();
  },

  refreshImportFolderView(path = []) {
    const items = libraryManager.getItemsByPath(path || []);
    const folders = items.filter(i => i.type === 'folder');
    const files = items.filter(i => i.type === 'file');
    const breadcrumbs = this.generateImportBreadcrumbs(path || []);
    this.setData({
      importFolderCurrentPath: path,
      importFolderItems: [...folders, ...files],
      importFolderBreadcrumbs: breadcrumbs,
      importTargetPath: path
    });
  },

  generateImportBreadcrumbs(path = []) {
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

  navigateImportRoot() {
    this.refreshImportFolderView([]);
  },

  navigateImportBreadcrumb(e) {
    const index = e.currentTarget.dataset.index;
    const newPath = this.data.importFolderCurrentPath.slice(0, index + 1);
    this.refreshImportFolderView(newPath);
  },

  backImportFolder() {
    if (!this.data.importFolderCurrentPath || this.data.importFolderCurrentPath.length === 0) return;
    const newPath = this.data.importFolderCurrentPath.slice(0, -1);
    this.refreshImportFolderView(newPath);
  },

  enterImportFolder(e) {
    const item = e.currentTarget.dataset.item;
    if (!item || item.type !== 'folder') return;
    const newPath = [...this.data.importFolderCurrentPath, item.id];
    this.refreshImportFolderView(newPath);
  },

  // ========== 重命名操作 ==========
  showRenameModal(item, type) {
    const currentName = type === 'folder' ? item.name : item.file_name;
    this.showInputModal({
      title: type === 'folder' ? '重命名文件夹' : '重命名文件',
      placeholder: '请输入新名称',
      value: currentName,
      callback: (newName) => {
        if (!newName) {
          wx.showToast({ title: '名称不能为空', icon: 'none' });
          return;
        }

        if (type === 'folder') {
          libraryManager.renameFolder(item.id, newName);
        } else {
          libraryManager.renameFile(item.id, newName);
        }

        wx.showToast({ title: '重命名成功', icon: 'success' });
        this.loadLibraryData();
      }
    });
  },

  // ========== 删除操作 ==========
  confirmDelete(item, type) {
    wx.showModal({
      title: '确认删除',
      content: `确定要删除${type === 'folder' ? '文件夹' : '文件'}"${type === 'folder' ? item.name : item.file_name}"吗？${type === 'folder' ? '文件夹内的所有内容也将被删除。' : ''}`,
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          if (type === 'folder') {
            libraryManager.deleteFolder(item.id);
          } else {
            libraryManager.deleteFile(item.id);
          }
          wx.showToast({ title: '删除成功', icon: 'success' });
          this.loadLibraryData();
        }
      }
    });
  },

  // ========== 收藏操作 ==========
  toggleStar(e) {
    const id = e.currentTarget.dataset.id;
    libraryManager.toggleFileStar(id);
    this.loadLibraryData();
  },

  // ========== 移动操作 ==========
  showMoveFilePicker(item) {
    this.setData({
      currentItem: item,
      showFolderPicker: true
    });
  },

  selectTargetFolder(e) {
    const targetPath = e.currentTarget.dataset.path;
    const item = this.data.currentItem;

    // 解析路径
    let parsedPath = [];
    try {
      parsedPath = typeof targetPath === 'string' ? JSON.parse(targetPath) : targetPath;
    } catch (e) {
      parsedPath = [];
    }

    // 检查是否移动到当前位置
    if (JSON.stringify(parsedPath) === JSON.stringify(this.data.currentPath)) {
      wx.showToast({ title: '已在当前位置', icon: 'none' });
      this.closeFolderPicker();
      return;
    }

    // 判断是批量移动还是单个移动
    if (item.selectedItems && item.selectedItems.length > 0) {
      // 批量移动
      item.selectedItems.forEach(file => {
        libraryManager.moveFile(file.id, parsedPath);
      });
      wx.showToast({ title: `已移动${item.selectedItems.length}个文件`, icon: 'success' });
      this.setData({ editMode: false }, () => {
        this.closeFolderPicker();
        this.loadLibraryData();
      });
    } else {
      // 单个移动
      libraryManager.moveFile(item.id, parsedPath);
      wx.showToast({ title: '移动成功', icon: 'success' });
      this.closeFolderPicker();
      this.loadLibraryData();
    }
  },

  closeFolderPicker() {
    this.setData({ 
      showFolderPicker: false,
      currentItem: null
    });
  },

  // ========== 批量操作 ==========
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    const items = this.data.displayItems.map(item => {
      if (item.id === id) {
        return { ...item, selected: !item.selected };
      }
      return item;
    });

    const selectedCount = items.filter(item => item.selected).length;

    this.setData({ 
      displayItems: items,
      selectedCount
    });
  },

  batchDelete() {
    const selectedItems = this.data.displayItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请先选择项目', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedItems.length} 个项目吗？`,
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          selectedItems.forEach(item => {
            if (item.type === 'folder') {
              libraryManager.deleteFolder(item.id);
            } else {
              libraryManager.deleteFile(item.id);
            }
          });
          
          wx.showToast({ title: '删除成功', icon: 'success' });
          this.setData({ editMode: false }, () => {
            this.loadLibraryData();
          });
        }
      }
    });
  },

  batchMove() {
    const selectedItems = this.data.displayItems.filter(item => item.selected && item.type === 'file');
    
    if (selectedItems.length === 0) {
      wx.showToast({ title: '请选择要移动的文件', icon: 'none' });
      return;
    }

    this.setData({
      currentItem: { selectedItems },
      showFolderPicker: true
    });
  },

  // ========== 通用弹窗 ==========
  showInputModal({ title, placeholder, value, callback }) {
    this.setData({
      showInputModal: true,
      inputModalTitle: title,
      inputModalPlaceholder: placeholder,
      inputModalValue: value,
      inputModalCallback: callback
    });
  },

  onModalInput(e) {
    this.setData({ inputModalValue: e.detail.value });
  },

  confirmInput() {
    const callback = this.data.inputModalCallback;
    const value = this.data.inputModalValue;
    
    this.closeInputModal();
    
    if (callback) {
      callback(value);
    }
  },

  closeInputModal() {
    this.setData({
      showInputModal: false,
      inputModalTitle: '',
      inputModalPlaceholder: '',
      inputModalValue: '',
      inputModalCallback: null
    });
  },

  stopPropagation() {
    // 阻止事件冒泡
  },

  // ========== 分享功能 ==========

  // 分享给好友
  onShareAppMessage() {
    return {
      title: 'Handpan Note 曲库 - 发现更多手碟音乐',
      path: '/pages/library/library'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'Handpan Note 曲库 - 发现更多手碟音乐'
    };
  }
});
