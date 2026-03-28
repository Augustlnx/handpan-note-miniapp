/**
 * 音游入口页面
 * 功能：选择曲谱来源、显示曲库列表、进入音频映射配置
 */
const app = getApp();
const libraryManager = require('../../../../utils/libraryManager.js');

Page({
  data: {
    // 弹窗显示状态
    showSourceModal: true, // 首次进入显示来源选择弹窗
    
    // 来源选择
    sourceType: '', // 'current' | 'library'
    
    // 曲库浏览（复用library页面逻辑）
    showLibraryBrowser: false,
    currentPath: [],
    breadcrumbs: [],
    displayItems: [],
    
    // 当前选中的曲谱
    selectedSheet: null,
    
    // 加载状态
    isLoading: false,
    loadingText: '',
    
    // 当前notation页面的谱面数据
    currentNotationData: null,
    hasCurrentNotation: false,
    
    // 分包图片
    subpkgImgs: {
      folderClose: '/subpackages/resources/icons/library/文件夹-关_folder-close.png',
      star: '/subpackages/resources/icons/library/星星_star.png'
    }
  },

  onLoad(options) {
    // 隐藏tabBar
    wx.hideTabBar({ animation: false });
    
    // 检查当前notation页面是否有谱面数据
    this.checkCurrentNotation();
    
    // 预加载曲库数据
    this.preloadLibrary();
  },

  onShow() {
    wx.hideTabBar({ animation: false });
    
    // 从音频映射页面返回时，重置界面状态
    if (!this.data.showSourceModal && !this.data.showLibraryBrowser) {
      this.setData({
        showSourceModal: true,
        sourceType: '',
        selectedSheet: null
      });
    }
  },

  onUnload() {
    wx.showTabBar({ animation: false });
  },

  /**
   * 检查当前notation页面是否有谱面数据
   */
  checkCurrentNotation() {
    try {
      // 从notation页面实际使用的存储键读取数据
      const mainTitle = wx.getStorageSync('mainTitle') || '未命名曲谱';
      const subTitle = wx.getStorageSync('subTitle') || '';
      const globalTempo = wx.getStorageSync('globalTempo') || 60;
      const timeSignatureBeats = wx.getStorageSync('timeSignatureBeats') || 4;
      const customTimeSignature = wx.getStorageSync('customTimeSignature');
      const notationType = wx.getStorageSync('notationType') || 'digital';
      const metaInfo = wx.getStorageSync('notationMetaInfo') || {};

      // 根据拍号确定正确的存储键
      let notationKey;
      if (customTimeSignature && customTimeSignature.type === 'custom') {
        notationKey = `notations_custom_${customTimeSignature.noteCount}`;
      } else {
        notationKey = `notations_${timeSignatureBeats}_4`;
      }

      // 读取谱面数据
      let notations = wx.getStorageSync(notationKey);
      if (!notations || !Array.isArray(notations) || notations.length === 0) {
        // 兼容旧数据：尝试读取全局 notations 键
        notations = wx.getStorageSync('notations');
      }

      // 只要有谱面数据结构就认为可用（空谱面也是内容）
      const hasNotation = Array.isArray(notations) && notations.length > 0;

      if (hasNotation) {
        const notationData = {
          mainTitle,
          subTitle,
          globalTempo,
          timeSignatureBeats,
          timeSignatureBottom: 4,
          notationType,
          composer: metaInfo.composer || 'Your Name',
          rootNote: metaInfo.rootNote || 'D',
          scaleType: metaInfo.scaleType || 'Kurd',
          noteCount: metaInfo.noteCount || 10,
          difficulty: metaInfo.difficulty || 1,
          introduction: metaInfo.introduction || ''
        };

        this.setData({
          currentNotationData: notationData,
          hasCurrentNotation: true
        });
      }
    } catch (e) {
      console.warn('[RhythmGame Entry] 读取当前谱面失败:', e);
    }
  },

  /**
   * 预加载曲库数据
   */
  async preloadLibrary() {
    try {
      await libraryManager.initSampleData();
    } catch (e) {
      console.warn('[RhythmGame Entry] 预加载曲库失败:', e);
    }
  },

  /**
   * 选择当前谱面
   */
  onSelectCurrentNotation() {
    if (!this.data.hasCurrentNotation) {
      wx.showToast({
        title: '当前无可用谱面',
        icon: 'none'
      });
      return;
    }
    
    // 构建谱面数据
    const sheetData = this.buildSheetDataFromCurrent();
    
    this.setData({
      sourceType: 'current',
      selectedSheet: sheetData,
      showSourceModal: false
    });
    
    // 直接进入音频映射页面
    this.navigateToAudioMapping(sheetData);
  },

  /**
   * 从当前notation构建谱面数据
   */
  buildSheetDataFromCurrent() {
    const notationData = this.data.currentNotationData;
    const timeSignatureBeats = notationData?.timeSignatureBeats || 4;
    const customTimeSignature = wx.getStorageSync('customTimeSignature');

    // 根据拍号读取正确的谱面数据
    let notationKey;
    if (customTimeSignature && customTimeSignature.type === 'custom') {
      notationKey = `notations_custom_${customTimeSignature.noteCount}`;
    } else {
      notationKey = `notations_${timeSignatureBeats}_4`;
    }
    let notations = wx.getStorageSync(notationKey);
    if (!notations || !Array.isArray(notations) || notations.length === 0) {
      notations = wx.getStorageSync('notations') || [];
    }
    
    return {
      title: notationData?.mainTitle || '未命名曲谱',
      composer: notationData?.composer || '',
      tempo: notationData?.globalTempo || 80,
      timeSignatureBeats: timeSignatureBeats,
      timeSignatureBottom: notationData?.timeSignatureBottom || 4,
      notationType: notationData?.notationType || 'digital',
      rootNote: notationData?.rootNote || 'D',
      scaleType: notationData?.scaleType || 'Kurd',
      rightHandColor: wx.getStorageSync('rightHandColor') || '#F4D096',
      leftHandColor: wx.getStorageSync('leftHandColor') || '#314D63',
      notations: notations,
      source: 'current'
    };
  },

  /**
   * 选择从曲库选择
   */
  onSelectFromLibrary() {
    this.setData({
      sourceType: 'library',
      showSourceModal: false,
      showLibraryBrowser: true
    });
    
    // 加载曲库根目录
    this.loadLibraryFolder([]);
  },

  /**
   * 加载曲库文件夹
   */
  loadLibraryFolder(path) {
    this.setData({ isLoading: true, loadingText: '加载中...' });
    
    try {
      const items = libraryManager.getItemsByPath(path);
      const breadcrumbs = path.map((folderId, index) => {
        const folder = libraryManager.getFolderById(folderId);
        return {
          name: folder ? folder.name : '未知',
          path: path.slice(0, index + 1)
        };
      });
      
      this.setData({
        currentPath: path,
        breadcrumbs,
        displayItems: items,
        isLoading: false
      });
    } catch (e) {
      console.error('[RhythmGame Entry] 加载曲库失败:', e);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    }
  },

  /**
   * 进入文件夹
   */
  onEnterFolder(e) {
    const item = e.currentTarget.dataset.item;
    if (item.type === 'folder') {
      const newPath = [...this.data.currentPath, item.id];
      this.loadLibraryFolder(newPath);
    }
  },

  /**
   * 返回上级目录
   */
  onNavigateBack() {
    if (this.data.currentPath.length > 0) {
      const newPath = this.data.currentPath.slice(0, -1);
      this.loadLibraryFolder(newPath);
    }
  },

  /**
   * 导航到根目录
   */
  onNavigateToRoot() {
    this.loadLibraryFolder([]);
  },

  /**
   * 点击面包屑
   */
  onBreadcrumbTap(e) {
    const index = e.currentTarget.dataset.index;
    const newPath = this.data.breadcrumbs[index].path;
    this.loadLibraryFolder(newPath);
  },

  /**
   * 选择曲谱文件
   */
  onSelectFile(e) {
    const item = e.currentTarget.dataset.item;
    if (item.type !== 'file') return;
    
    this.setData({
      selectedSheet: {
        ...item,
        source: 'library',
        libraryPath: [...this.data.currentPath]
      }
    });
  },

  /**
   * 确认选择曲谱
   */
  onConfirmSelection() {
    const sheet = this.data.selectedSheet;
    if (!sheet) {
      wx.showToast({
        title: '请选择曲谱',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ isLoading: true, loadingText: '加载谱面数据...' });
    
    try {
      // 从曲库加载完整文件数据
      const fullData = libraryManager.getFileById(sheet.id);
      
      if (!fullData) {
        throw new Error('找不到谱面文件');
      }
      
      const sheetData = {
        title: fullData.file_name || fullData.title || '未命名曲谱',
        composer: fullData.composer || '',
        tempo: fullData.tempo || 80,
        timeSignatureBeats: 4,
        timeSignatureBottom: 4,
        notationType: fullData.notationType || 'digital',
        rootNote: fullData.rootNote || 'D',
        scaleType: fullData.scaleType || 'Kurd',
        noteCount: fullData.noteCount || 10,
        difficulty: fullData.difficulty || 1,
        introduction: fullData.introduction || '',
        code: fullData.code,
        source: 'library',
        libraryPath: sheet.libraryPath || []
      };
      
      this.setData({
        selectedSheet: sheetData,
        showLibraryBrowser: false,
        isLoading: false
      });
      
      // 进入音频映射页面
      this.navigateToAudioMapping(sheetData);
    } catch (e) {
      console.error('[RhythmGame Entry] 加载谱面失败:', e);
      wx.showToast({
        title: '加载谱面失败',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    }
  },

  /**
   * 导航到音频映射页面
   */
  navigateToAudioMapping(sheetData) {
    // 存储选中的谱面数据到全局
    app.globalData = app.globalData || {};
    app.globalData.rhythmGameSheet = sheetData;
    
    wx.navigateTo({
      url: '/pages/rhythm_game/pages/audio_mapping/index'
    });
  },

  /**
   * 取消选择
   */
  onCancel() {
    if (this.data.showLibraryBrowser) {
      this.setData({
        showLibraryBrowser: false,
        showSourceModal: true,
        selectedSheet: null
      });
    } else {
      // 返回上一页
      wx.navigateBack();
    }
  },

  /**
   * 返回按钮
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  }
});
