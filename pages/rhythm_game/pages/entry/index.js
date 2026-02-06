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
  },

  onUnload() {
    wx.showTabBar({ animation: false });
  },

  /**
   * 检查当前notation页面是否有谱面数据
   */
  checkCurrentNotation() {
    try {
      // 从本地存储读取当前谱面数据
      const notationData = wx.getStorageSync('currentNotationData');
      const notations = wx.getStorageSync('notations');
      
      if (notationData && notations && notations.length > 0) {
        // 检查是否有实际音符数据
        let hasNotes = false;
        for (const notation of notations) {
          if (notation.measures && notation.measures.length > 0) {
            for (const measure of notation.measures) {
              if (measure.beats && measure.beats.length > 0) {
                for (const beat of measure.beats) {
                  if (beat.subdivisions) {
                    for (const sub of beat.subdivisions) {
                      if ((sub.right && sub.right !== '-') || (sub.left && sub.left !== '-')) {
                        hasNotes = true;
                        break;
                      }
                    }
                  }
                  if (hasNotes) break;
                }
              }
              if (hasNotes) break;
            }
          }
          if (hasNotes) break;
        }
        
        this.setData({
          currentNotationData: notationData,
          hasCurrentNotation: hasNotes
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
      await libraryManager.init();
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
    const notations = wx.getStorageSync('notations') || [];
    
    return {
      title: notationData?.mainTitle || '未命名曲谱',
      composer: notationData?.composer || '',
      tempo: notationData?.globalTempo || 80,
      timeSignatureBeats: notationData?.timeSignatureBeats || 4,
      timeSignatureBottom: notationData?.timeSignatureBottom || 4,
      notationType: notationData?.notationType || 'digital',
      rootNote: notationData?.rootNote || 'D',
      scaleType: notationData?.scaleType || 'Kurd',
      rightHandColor: notationData?.rightHandColor || '#F4D096',
      leftHandColor: notationData?.leftHandColor || '#314D63',
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
  async loadLibraryFolder(path) {
    this.setData({ isLoading: true, loadingText: '加载中...' });
    
    try {
      const items = await libraryManager.getItemsAtPath(path);
      const breadcrumbs = path.map((name, index) => ({
        name,
        path: path.slice(0, index + 1)
      }));
      
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
      const newPath = [...this.data.currentPath, item.name];
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
  async onConfirmSelection() {
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
      // 从曲库加载完整数据
      const fullData = await libraryManager.loadFileData(sheet.id);
      
      if (!fullData || !fullData.notations || fullData.notations.length === 0) {
        throw new Error('谱面数据为空');
      }
      
      const sheetData = {
        ...sheet,
        ...fullData,
        notations: fullData.notations
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
