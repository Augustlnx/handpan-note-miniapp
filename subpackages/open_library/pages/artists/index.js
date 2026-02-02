/**
 * 制谱人列表页
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    safeAreaBottom: 0,
    tabbarBottom: 80,
    artists: [],
    isLoading: true
  },

  onLoad() {
    this.initSystemInfo();
    this.loadArtists();
  },

  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const safeAreaBottom = systemInfo.safeArea
        ? systemInfo.screenHeight - systemInfo.safeArea.bottom
        : 0;
      const tabbarBottom = 60 + safeAreaBottom; // 120rpx ≈ 60px + 安全区
      this.setData({
        statusBarHeight,
        safeAreaBottom,
        tabbarBottom
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  async loadArtists() {
    this.setData({ isLoading: true });
    
    try {
      const artists = await dataService.getAllArtists();
      this.setData({ artists, isLoading: false });
    } catch (e) {
      console.error('加载制谱人失败', e);
      this.setData({ isLoading: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  goToIndex() {
    wx.redirectTo({
      url: '/subpackages/open_library/pages/index/index?tab=0'
    });
  },

  goToSettings() {
    wx.redirectTo({
      url: '/subpackages/open_library/pages/index/index?tab=2'
    });
  },

  goToArtistDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/artist-profile/index?id=${item.id}`
    });
  }
});
