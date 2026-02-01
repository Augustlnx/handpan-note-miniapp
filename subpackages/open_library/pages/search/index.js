/**
 * 搜索页面
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    keyword: '',
    isSearching: false,
    activeTab: 'songs',
    
    // 搜索历史
    searchHistory: [],
    
    // 热搜榜
    hotSearchLeft: [],
    hotSearchRight: [],
    
    // 热门标签
    hotTags: [],
    
    // 搜索结果
    searchResults: {
      songs: [],
      artists: [],
      collections: []
    },
    hasResults: false
  },

  onLoad() {
    this.initSystemInfo();
    this.loadInitialData();
  },

  /**
   * 初始化系统信息
   */
  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 20
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  /**
   * 加载初始数据
   */
  async loadInitialData() {
    try {
      // 加载搜索历史
      const searchHistory = dataService.getSearchHistory();
      
      // 加载热门歌曲作为热搜
      const hotSongs = await dataService.getHotSongs(10);
      const hotSearchLeft = hotSongs.slice(0, 5).map((song, index) => ({
        rank: index + 1,
        title: song.title,
        isHot: index < 3
      }));
      const hotSearchRight = hotSongs.slice(5, 10).map((song, index) => ({
        rank: index + 6,
        title: song.title
      }));
      
      // 加载热门标签
      const hotTags = await dataService.getHotTags(10);
      
      this.setData({
        searchHistory,
        hotSearchLeft,
        hotSearchRight,
        hotTags
      });
    } catch (e) {
      console.error('加载初始数据失败', e);
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 输入关键词
   */
  onInput(e) {
    const keyword = e.detail.value;
    this.setData({ keyword });
    
    // 防抖搜索
    if (this._searchTimer) {
      clearTimeout(this._searchTimer);
    }
    
    if (keyword.trim()) {
      this._searchTimer = setTimeout(() => {
        this.doSearch(keyword);
      }, 300);
    } else {
      this.setData({
        searchResults: { songs: [], artists: [], collections: [] },
        hasResults: false
      });
    }
  },

  /**
   * 清空输入
   */
  clearInput() {
    this.setData({
      keyword: '',
      searchResults: { songs: [], artists: [], collections: [] },
      hasResults: false
    });
  },

  /**
   * 确认搜索
   */
  onSearch(e) {
    const keyword = e.detail.value || this.data.keyword;
    if (keyword.trim()) {
      this.doSearch(keyword);
      dataService.addSearchHistory(keyword);
      this.setData({
        searchHistory: dataService.getSearchHistory()
      });
    }
  },

  /**
   * 执行搜索
   */
  async doSearch(keyword) {
    if (!keyword.trim()) return;
    
    this.setData({ isSearching: true });
    
    try {
      const results = await dataService.search(keyword);
      const hasResults = results.songs.length > 0 || 
                         results.artists.length > 0 || 
                         results.collections.length > 0;
      
      // 根据结果数量自动切换Tab
      let activeTab = 'songs';
      if (results.songs.length === 0) {
        if (results.artists.length > 0) {
          activeTab = 'artists';
        } else if (results.collections.length > 0) {
          activeTab = 'collections';
        }
      }
      
      this.setData({
        searchResults: results,
        hasResults,
        activeTab,
        isSearching: false
      });
    } catch (e) {
      console.error('搜索失败', e);
      this.setData({ isSearching: false });
      wx.showToast({
        title: '搜索失败',
        icon: 'none'
      });
    }
  },

  /**
   * 从历史记录搜索
   */
  searchFromHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch(keyword);
  },

  /**
   * 从热搜搜索
   */
  searchFromHot(e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ keyword });
    this.doSearch(keyword);
    dataService.addSearchHistory(keyword);
    this.setData({
      searchHistory: dataService.getSearchHistory()
    });
  },

  /**
   * 从标签搜索
   */
  searchFromTag(e) {
    const tag = e.currentTarget.dataset.tag;
    this.setData({ keyword: tag });
    this.doSearch(tag);
    dataService.addSearchHistory(tag);
    this.setData({
      searchHistory: dataService.getSearchHistory()
    });
  },

  /**
   * 删除单条历史
   */
  removeHistory(e) {
    const keyword = e.currentTarget.dataset.keyword;
    dataService.removeSearchHistory(keyword);
    this.setData({
      searchHistory: dataService.getSearchHistory()
    });
  },

  /**
   * 清空历史
   */
  clearHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          dataService.clearSearchHistory();
          this.setData({ searchHistory: [] });
        }
      }
    });
  },

  /**
   * 切换结果Tab
   */
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  /**
   * 跳转到歌曲详情
   */
  goToSongDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.id}`
    });
  },

  /**
   * 跳转到制谱人详情
   */
  goToArtistDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/artist-profile/index?id=${item.id}`
    });
  },

  /**
   * 跳转到合集详情
   */
  goToCollectionDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=collection&id=${item.id}`
    });
  }
});
