/**
 * 制谱人个人主页
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    headerHeight: 200,
    
    artist: {},
    songs: [],
    collections: [],
    
    activeTab: 'songs'
  },

  onLoad(options) {
    this.initSystemInfo();
    
    if (options.id) {
      this.loadArtistDetail(options.id);
    }
  },

  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const headerHeight = statusBarHeight + 180; // 导航栏 + 额外空间
      
      this.setData({
        statusBarHeight,
        headerHeight
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  async loadArtistDetail(id) {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      const artistDetail = await dataService.getArtistDetail(id);
      
      if (!artistDetail) {
        wx.hideLoading();
        wx.showToast({
          title: '制谱人不存在',
          icon: 'none'
        });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }
      
      // 更新歌曲收藏状态
      const songs = (artistDetail.songs || []).map(song => ({
        ...song,
        isFavorite: dataService.isFavorite(song.id)
      }));
      
      this.setData({
        artist: artistDetail,
        songs,
        collections: artistDetail.collections || []
      });
      
      wx.hideLoading();
      
    } catch (e) {
      console.error('加载制谱人详情失败', e);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  goBack() {
    wx.navigateBack();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  goToSongDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.id}`
    });
  },

  goToCollectionDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=collection&id=${item.id}`
    });
  },

  toggleFavorite(e) {
    const songId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleFavorite(songId);
    
    const songs = this.data.songs.map(song => {
      if (song.id === songId) {
        return { ...song, isFavorite };
      }
      return song;
    });
    
    this.setData({ songs });
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  showSongActions(e) {
    const item = e.currentTarget.dataset.item;
    
    wx.showActionSheet({
      itemList: ['试听', '打开曲谱', '分享'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            wx.showToast({ title: '试听功能开发中', icon: 'none' });
            break;
          case 1:
            this.goToSongDetail({ currentTarget: { dataset: { item } } });
            break;
          case 2:
            break;
        }
      }
    });
  },

  onShareAppMessage() {
    const { artist } = this.data;
    return {
      title: `${artist.name} - 星轨乐库制谱人`,
      path: `/subpackages/open_library/pages/artist-profile/index?id=${artist.id}`
    };
  }
});
