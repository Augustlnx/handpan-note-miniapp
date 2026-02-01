/**
 * 制谱人列表页
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
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
      this.setData({
        statusBarHeight: systemInfo.statusBarHeight || 20
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

  goBack() {
    wx.navigateBack();
  },

  goToArtistDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/artist-profile/index?id=${item.id}`
    });
  }
});
