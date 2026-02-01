/**
 * 公开曲库首页
 * 
 * 功能：
 * - 轮播Banner展示
 * - 金刚区快捷入口
 * - 精选歌曲、最近上新、精选合集、宝藏制谱人
 * - 热度排行榜
 * - 自定义TabBar
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    // 系统信息
    statusBarHeight: 20,
    navHeight: 88,
    safeAreaBottom: 0,
    
    // 轮播图
    banners: [],
    currentBanner: 0,
    
    // 数据列表
    featuredSongs: [],
    recentSongs: [],
    collections: [],
    artists: [],
    hotSongs: [],
    
    // 状态
    isRefreshing: false,
    isLoading: true
  },

  onLoad() {
    this.initSystemInfo();
    this.loadData();
  },

  onShow() {
    // 每次显示时更新收藏状态
    this.updateFavoriteStatus();
  },

  onPullDownRefresh() {
    this.setData({ isRefreshing: true });
    this.loadData().then(() => {
      this.setData({ isRefreshing: false });
    });
  },

  /**
   * 初始化系统信息
   */
  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const navHeight = statusBarHeight + 44; // 44为导航栏高度
      const safeAreaBottom = systemInfo.safeArea 
        ? systemInfo.screenHeight - systemInfo.safeArea.bottom 
        : 0;
      
      this.setData({
        statusBarHeight,
        navHeight,
        safeAreaBottom
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  /**
   * 加载所有数据
   */
  async loadData() {
    try {
      this.setData({ isLoading: true });
      
      // 并行加载所有数据
      const [
        banners,
        featuredSongs,
        recentSongs,
        collections,
        artists,
        hotSongs
      ] = await Promise.all([
        dataService.getBanners(),
        dataService.getFeaturedSongs(8),
        dataService.getRecentSongs(8),
        dataService.getFeaturedCollections(6),
        dataService.getRecommendedArtists(6),
        dataService.getHotSongs(10)
      ]);
      
      // 更新收藏状态
      const hotSongsWithFavorite = hotSongs.map(song => ({
        ...song,
        isFavorite: dataService.isFavorite(song.id)
      }));
      
      this.setData({
        banners,
        featuredSongs,
        recentSongs,
        collections,
        artists,
        hotSongs: hotSongsWithFavorite,
        isLoading: false
      });
    } catch (e) {
      console.error('加载数据失败', e);
      this.setData({ isLoading: false });
      wx.showToast({
        title: '加载失败，请重试',
        icon: 'none'
      });
    }
  },

  /**
   * 更新收藏状态
   */
  updateFavoriteStatus() {
    const { hotSongs } = this.data;
    if (hotSongs.length === 0) return;
    
    const updatedSongs = hotSongs.map(song => ({
      ...song,
      isFavorite: dataService.isFavorite(song.id)
    }));
    
    this.setData({ hotSongs: updatedSongs });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack({
      fail: () => {
        // 如果无法返回，则跳转到主页
        wx.switchTab({ url: '/pages/library/library' });
      }
    });
  },

  /**
   * 跳转到搜索页
   */
  goToSearch() {
    wx.navigateTo({
      url: '/subpackages/open_library/pages/search/index'
    });
  },

  /**
   * 轮播图切换
   */
  onBannerChange(e) {
    this.setData({ currentBanner: e.detail.current });
  },

  /**
   * 点击轮播图
   */
  onBannerTap(e) {
    const item = e.currentTarget.dataset.item;
    if (!item) return;
    
    switch (item.type) {
      case 'song':
        wx.navigateTo({
          url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.targetId}`
        });
        break;
      case 'collection':
        wx.navigateTo({
          url: `/subpackages/open_library/pages/category-list/index?type=collection&id=${item.targetId}`
        });
        break;
      case 'artists':
        wx.navigateTo({
          url: '/subpackages/open_library/pages/artists/index'
        });
        break;
      default:
        break;
    }
  },

  /**
   * 跳转到分类页面
   */
  goToCategory(e) {
    const type = e.currentTarget.dataset.type;
    if (type === 'artist') {
      wx.navigateTo({
        url: '/subpackages/open_library/pages/artists/index'
      });
    } else {
      wx.navigateTo({
        url: `/subpackages/open_library/pages/category-list/index?type=${type}`
      });
    }
  },

  /**
   * 跳转到更多页面
   */
  goToMore(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=${type}`
    });
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
   * 跳转到合集详情
   */
  goToCollectionDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=collection&id=${item.id}`
    });
  },

  /**
   * 跳转到制谱人列表
   */
  goToArtists() {
    wx.navigateTo({
      url: '/subpackages/open_library/pages/artists/index'
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
   * 跳转到设置页面
   */
  goToSettings() {
    wx.switchTab({
      url: '/pages/settings/settings'
    });
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite(e) {
    const songId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleFavorite(songId);
    
    // 更新列表中的状态
    const hotSongs = this.data.hotSongs.map(song => {
      if (song.id === songId) {
        return { ...song, isFavorite };
      }
      return song;
    });
    
    this.setData({ hotSongs });
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none',
      duration: 1500
    });
  },

  /**
   * 显示操作菜单
   */
  showActionSheet(e) {
    const item = e.currentTarget.dataset.item;
    
    wx.showActionSheet({
      itemList: ['试听', '打开曲谱', '查看制谱人', '分享'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            // 试听
            this.previewSong(item);
            break;
          case 1:
            // 打开曲谱
            this.goToSongDetail({ currentTarget: { dataset: { item } } });
            break;
          case 2:
            // 查看制谱人
            wx.navigateTo({
              url: `/subpackages/open_library/pages/artist-profile/index?id=${item.artistId}`
            });
            break;
          case 3:
            // 分享
            this.shareSong(item);
            break;
        }
      }
    });
  },

  /**
   * 预览歌曲
   */
  previewSong(item) {
    wx.showToast({
      title: '试听功能开发中',
      icon: 'none'
    });
  },

  /**
   * 分享歌曲
   */
  shareSong(item) {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  /**
   * 分享给朋友
   */
  onShareAppMessage() {
    return {
      title: '星轨乐库 - 发现更多手碟音乐',
      path: '/subpackages/open_library/pages/index/index'
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    return {
      title: '星轨乐库 - 发现更多手碟音乐'
    };
  }
});
