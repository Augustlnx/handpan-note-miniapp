/**
 * 公开曲库首页 - 三合一 TabBar 布局
 * 
 * 功能：
 * - Tab 0: 曲谱库 (轮播Banner、金刚区、歌曲列表、排行榜等)
 * - Tab 1: 制谱人列表
 * - Tab 2: 我的 (收藏、歌单管理)
 * - 自定义 TabBar，切换时保持不动
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    // ========== 系统信息 ==========
    statusBarHeight: 20,
    navHeight: 88,
    safeAreaBottom: 0,
    tabbarBottom: 80,
    profileHeaderHeight: 200,
    
    // ========== TabBar 状态 ==========
    activeTabIndex: 0, // 0: 曲谱库, 1: 制谱人, 2: 我的
    
    // ========== Tab 0: 曲谱库数据 ==========
    banners: [],
    currentBanner: 0,
    featuredSongs: [],
    recentSongs: [],
    featuredSongsGroups: [],
    recentSongsGroups: [],
    currentFeaturedPage: 0,
    currentRecentPage: 0,
    collections: [],
    artists: [],
    hotSongs: [],
    isRefreshing: false,
    isLoading: true,
    
    // ========== Tab 1: 制谱人数据 ==========
    allArtists: [],
    isLoadingArtists: true,
    
    // ========== Tab 2: 我的数据 ==========
    profileInfo: {
      name: '我的音乐',
      bio: '收藏喜欢的曲谱，创建专属歌单',
      backgroundGradient: ['#667eea', '#764ba2']
    },
    profileStats: {
      playlistCount: 0,
      favoriteCount: 0,
      collectionCount: 0
    },
    profileActiveTab: 'home', // 'home' | 'songs' | 'collections'
    playlists: [],
    favoriteSongs: [],
    favoriteCollections: [],
    
    // ========== 弹窗状态 ==========
    showCreateModal: false,
    showManageMenu: false,
    newPlaylistName: '',
    currentPlaylist: null,
    showInputModal: false,
    inputModalTitle: '',
    inputModalValue: '',
    inputModalCallback: null
  },

  onLoad(options) {
    this.initSystemInfo();
    this.loadLibraryData();
    
    // 支持通过 URL 参数切换到指定 Tab
    if (options && options.tab !== undefined) {
      const tabIndex = parseInt(options.tab);
      if (tabIndex >= 0 && tabIndex <= 2) {
        this.setData({ activeTabIndex: tabIndex });
        if (tabIndex === 1) {
          this.loadArtistsData();
        } else if (tabIndex === 2) {
          this.loadProfileData();
        }
      }
    }
  },

  onShow() {
    // 每次显示时更新收藏状态
    this.updateFavoriteStatus();
    // 如果当前是"我的"Tab，刷新用户数据
    if (this.data.activeTabIndex === 2) {
      this.loadProfileData();
    }
  },

  onPullDownRefresh() {
    this.setData({ isRefreshing: true });
    this.loadLibraryData().then(() => {
      this.setData({ isRefreshing: false });
    });
  },

  // ========== 初始化 ==========

  initSystemInfo() {
    try {
      const windowInfo = wx.getWindowInfo();
      const deviceInfo = wx.getDeviceInfo();
      const statusBarHeight = windowInfo.statusBarHeight || 20;
      const navHeight = statusBarHeight + 44;
      const safeAreaBottom = windowInfo.safeArea
        ? deviceInfo.screenHeight - windowInfo.safeArea.bottom
        : 0;
      const tabbarBottom = 60 + safeAreaBottom;
      const profileHeaderHeight = statusBarHeight + 180;

      this.setData({
        statusBarHeight,
        navHeight,
        safeAreaBottom,
        tabbarBottom,
        profileHeaderHeight
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  // ========== TabBar 切换 ==========

  switchToTab(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    if (index === this.data.activeTabIndex) return;
    
    this.setData({ activeTabIndex: index });
    
    // 切换到对应Tab时加载数据
    if (index === 1 && this.data.allArtists.length === 0) {
      this.loadArtistsData();
    } else if (index === 2) {
      this.loadProfileData();
    }
  },

  // ========== Tab 0: 曲谱库方法 ==========

  async loadLibraryData() {
    try {
      this.setData({ isLoading: true });
      
      const [
        banners,
        featuredSongs,
        recentSongs,
        collectionsRaw,
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
      // 按 id 去重，避免 wx:key 重复告警
      const collections = (collectionsRaw || []).filter(
        (c, i, arr) => arr.findIndex(x => x.id === c.id) === i
      );
      
      const hotSongsWithFavorite = hotSongs.map(song => ({
        ...song,
        isFavorite: dataService.isFavorite(song.id)
      }));
      const featuredWithFavorite = featuredSongs.map(song => ({
        ...song,
        isFavorite: dataService.isFavorite(song.id)
      }));
      const recentWithFavorite = recentSongs.map(song => ({
        ...song,
        isFavorite: dataService.isFavorite(song.id)
      }));
      const chunk = (arr, n) => {
        const groups = [];
        for (let i = 0; i < arr.length; i += n) groups.push(arr.slice(i, i + n));
        return groups;
      };
      const featuredSongsGroups = chunk(featuredWithFavorite, 3);
      const recentSongsGroups = chunk(recentWithFavorite, 3);
      
      this.setData({
        banners,
        featuredSongs: featuredWithFavorite,
        recentSongs: recentWithFavorite,
        featuredSongsGroups,
        recentSongsGroups,
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

  updateFavoriteStatus() {
    const { hotSongs, featuredSongs, recentSongs } = this.data;
    const chunk = (arr, n) => {
      const groups = [];
      for (let i = 0; i < arr.length; i += n) groups.push(arr.slice(i, i + n));
      return groups;
    };
    const withFavorite = (list) => (list || []).map(song => ({ ...song, isFavorite: dataService.isFavorite(song.id) }));
    
    const updatedHot = withFavorite(hotSongs);
    const updatedFeatured = withFavorite(featuredSongs);
    const updatedRecent = withFavorite(recentSongs);
    
    this.setData({
      hotSongs: updatedHot,
      featuredSongs: updatedFeatured,
      recentSongs: updatedRecent,
      featuredSongsGroups: chunk(updatedFeatured, 3),
      recentSongsGroups: chunk(updatedRecent, 3)
    });
  },

  goBack() {
    wx.navigateBack({
      fail: () => {
        wx.switchTab({ url: '/pages/library/library' });
      }
    });
  },

  goToSearch() {
    wx.navigateTo({
      url: '/subpackages/open_library/pages/search/index'
    });
  },

  onBannerChange(e) {
    this.setData({ currentBanner: e.detail.current });
  },

  onFeaturedSwiperChange(e) {
    this.setData({ currentFeaturedPage: e.detail.current });
  },
  onRecentSwiperChange(e) {
    this.setData({ currentRecentPage: e.detail.current });
  },

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
        this.setData({ activeTabIndex: 1 });
        this.loadArtistsData();
        break;
      case 'notice':
        // 公告类型：点击不跳转
        break;
      default:
        break;
    }
  },

  goToCategory(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=${type}`
    });
  },

  goToMore(e) {
    const type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=${type}`
    });
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

  goToArtistDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/artist-profile/index?id=${item.id}`
    });
  },

  toggleFavorite(e) {
    const songId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleFavorite(songId);
    
    const updateSongs = (list) => list.map(song => {
      const updated = song.id === songId ? { ...song, isFavorite } : { ...song };
      return updated;
    });
    const chunk = (arr, n) => {
      const groups = [];
      for (let i = 0; i < arr.length; i += n) groups.push(arr.slice(i, i + n));
      return groups;
    };
    
    const hotSongs = updateSongs(this.data.hotSongs);
    const featuredSongs = updateSongs(this.data.featuredSongs);
    const recentSongs = updateSongs(this.data.recentSongs);
    const featuredSongsGroups = chunk(featuredSongs, 3);
    const recentSongsGroups = chunk(recentSongs, 3);
    
    this.setData({
      hotSongs,
      featuredSongs,
      recentSongs,
      featuredSongsGroups,
      recentSongsGroups
    });
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none',
      duration: 1500
    });
  },

  showActionSheet(e) {
    const item = e.currentTarget.dataset.item;
    
    wx.showActionSheet({
      itemList: ['试听', '打开曲谱', '查看制谱人', '分享'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.previewSong(item);
            break;
          case 1:
            this.goToSongDetail({ currentTarget: { dataset: { item } } });
            break;
          case 2:
            wx.navigateTo({
              url: `/subpackages/open_library/pages/artist-profile/index?id=${item.artistId}`
            });
            break;
          case 3:
            this.shareSong(item);
            break;
        }
      }
    });
  },

  previewSong(item) {
    wx.showToast({
      title: '试听功能开发中',
      icon: 'none'
    });
  },

  shareSong(item) {
    wx.showToast({
      title: '分享功能开发中',
      icon: 'none'
    });
  },

  // ========== Tab 1: 制谱人方法 ==========

  async loadArtistsData() {
    this.setData({ isLoadingArtists: true });
    
    try {
      const allArtists = await dataService.getAllArtists();
      this.setData({ allArtists, isLoadingArtists: false });
    } catch (e) {
      console.error('加载制谱人失败', e);
      this.setData({ isLoadingArtists: false });
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  // ========== Tab 2: 我的方法 ==========

  async loadProfileData() {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      dataService.initUserPlaylists();
      
      const profileStats = dataService.getUserStats();
      
      const playlists = dataService.getUserPlaylists().map(playlist => {
        let songCount = playlist.songIds ? playlist.songIds.length : 0;
        if (playlist.id === dataService.DEFAULT_PLAYLIST_ID) {
          songCount = dataService.getFavorites().length;
        }
        return {
          ...playlist,
          songCount,
          source: playlist.isDefault ? '默认歌单' : '自建歌单'
        };
      });
      
      const favoriteSongs = await dataService.getFavoriteSongs();
      const favoriteCollections = await dataService.getFavoriteCollectionDetails();
      
      this.setData({
        profileStats,
        playlists,
        favoriteSongs: favoriteSongs.map(song => ({
          ...song,
          isFavorite: true
        })),
        favoriteCollections: favoriteCollections.map(col => ({
          ...col,
          isFavorite: true
        }))
      });
      
      wx.hideLoading();
      
    } catch (e) {
      console.error('加载用户数据失败', e);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  switchProfileTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ profileActiveTab: tab });
  },

  // 歌单操作
  goToPlaylistDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/playlist-detail/index?id=${item.id}`
    });
  },

  showCreatePlaylist() {
    this.setData({
      showCreateModal: true,
      newPlaylistName: ''
    });
  },

  closeCreateModal() {
    this.setData({
      showCreateModal: false,
      newPlaylistName: ''
    });
  },

  onPlaylistNameInput(e) {
    this.setData({ newPlaylistName: e.detail.value });
  },

  confirmCreatePlaylist() {
    const name = this.data.newPlaylistName.trim();
    if (!name) {
      wx.showToast({ title: '请输入歌单名称', icon: 'none' });
      return;
    }
    
    const newPlaylist = dataService.createPlaylist(name);
    if (newPlaylist) {
      wx.showToast({ title: '创建成功', icon: 'success' });
      this.closeCreateModal();
      this.loadProfileData();
    } else {
      wx.showToast({ title: '创建失败', icon: 'none' });
    }
  },

  showPlaylistMenu(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      currentPlaylist: item,
      showManageMenu: true
    });
  },

  closeManageMenu() {
    this.setData({
      showManageMenu: false,
      currentPlaylist: null
    });
  },

  renamePlaylist() {
    const playlist = this.data.currentPlaylist;
    this.closeManageMenu();
    
    this.setData({
      showInputModal: true,
      inputModalTitle: '重命名歌单',
      inputModalValue: playlist.name,
      inputModalCallback: (newName) => {
        if (newName && newName.trim()) {
          const success = dataService.renamePlaylist(playlist.id, newName.trim());
          if (success) {
            wx.showToast({ title: '重命名成功', icon: 'success' });
            this.loadProfileData();
          }
        }
      }
    });
  },

  deletePlaylist() {
    const playlist = this.data.currentPlaylist;
    this.closeManageMenu();
    
    if (playlist.isDefault) {
      wx.showToast({ title: '默认歌单无法删除', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除歌单"${playlist.name}"吗？`,
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          const success = dataService.deletePlaylist(playlist.id);
          if (success) {
            wx.showToast({ title: '删除成功', icon: 'success' });
            this.loadProfileData();
          }
        }
      }
    });
  },

  // 输入弹窗
  onModalInputChange(e) {
    this.setData({ inputModalValue: e.detail.value });
  },

  closeInputModal() {
    this.setData({
      showInputModal: false,
      inputModalTitle: '',
      inputModalValue: '',
      inputModalCallback: null
    });
  },

  confirmInputModal() {
    const callback = this.data.inputModalCallback;
    const value = this.data.inputModalValue;
    this.closeInputModal();
    if (callback) {
      callback(value);
    }
  },

  // 歌曲操作
  toggleProfileFavorite(e) {
    const songId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleFavorite(songId);
    
    if (!isFavorite) {
      const favoriteSongs = this.data.favoriteSongs.filter(s => s.id !== songId);
      this.setData({ favoriteSongs });
    }
    
    this.loadProfileData();
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  showProfileSongActions(e) {
    const item = e.currentTarget.dataset.item;
    
    wx.showActionSheet({
      itemList: ['查看曲谱', '添加到歌单', '取消收藏'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.goToSongDetail({ currentTarget: { dataset: { item } } });
            break;
          case 1:
            this.showAddToPlaylist(item);
            break;
          case 2:
            this.toggleProfileFavorite({ currentTarget: { dataset: { id: item.id } } });
            break;
        }
      }
    });
  },

  showAddToPlaylist(song) {
    const playlists = this.data.playlists.filter(p => !p.isDefault);
    
    if (playlists.length === 0) {
      wx.showModal({
        title: '暂无歌单',
        content: '您还没有创建歌单，是否现在创建？',
        confirmText: '创建',
        success: (res) => {
          if (res.confirm) {
            this.showCreatePlaylist();
          }
        }
      });
      return;
    }
    
    const names = playlists.map(p => p.name);
    wx.showActionSheet({
      itemList: names,
      success: (res) => {
        const playlist = playlists[res.tapIndex];
        const success = dataService.addSongToPlaylist(playlist.id, song.id);
        if (success) {
          wx.showToast({ title: `已添加到"${playlist.name}"`, icon: 'success' });
          this.loadProfileData();
        } else {
          wx.showToast({ title: '歌曲已在歌单中', icon: 'none' });
        }
      }
    });
  },

  // 合集操作
  toggleCollectionFavorite(e) {
    const collectionId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleCollectionFavorite(collectionId);
    
    if (!isFavorite) {
      const favoriteCollections = this.data.favoriteCollections.filter(c => c.id !== collectionId);
      this.setData({ favoriteCollections });
    }
    
    this.loadProfileData();
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  // 阻止冒泡
  stopPropagation() {},

  // ========== 分享 ==========

  onShareAppMessage() {
    return {
      title: '星轨乐库 - 发现更多手碟音乐',
      path: '/subpackages/open_library/pages/index/index'
    };
  },

  onShareTimeline() {
    return {
      title: '星轨乐库 - 发现更多手碟音乐'
    };
  }
});
