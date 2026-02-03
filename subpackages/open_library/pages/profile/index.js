/**
 * 个人中心页面
 * 类似artist-profile的设计，包含"主页-歌曲-合集"三个Tab
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    headerHeight: 200,
    
    // 用户信息
    userInfo: {
      name: '我的音乐',
      bio: '收藏喜欢的曲谱，创建专属歌单',
      backgroundGradient: ['#314D63', '#F2C94C']
    },
    
    // 统计数据
    stats: {
      playlistCount: 0,
      favoriteCount: 0,
      collectionCount: 0
    },
    
    // Tab相关
    activeTab: 'home', // 'home' | 'songs' | 'collections'
    
    // 歌单列表
    playlists: [],
    
    // 收藏的歌曲
    favoriteSongs: [],
    
    // 收藏的合集
    favoriteCollections: [],
    
    // 弹窗状态
    showCreateModal: false,
    showManageMenu: false,
    newPlaylistName: '',
    currentPlaylist: null,
    
    // 输入弹窗
    showInputModal: false,
    inputModalTitle: '',
    inputModalValue: '',
    inputModalCallback: null
  },

  onLoad() {
    this.initSystemInfo();
    this.loadUserData();
  },
  
  onShow() {
    this.loadUserData();
  },

  initSystemInfo() {
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const headerHeight = statusBarHeight + 180;
      
      this.setData({
        statusBarHeight,
        headerHeight
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
  },

  async loadUserData() {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      // 初始化歌单（确保有默认歌单）
      dataService.initUserPlaylists();
      
      // 获取统计数据
      const stats = dataService.getUserStats();
      
      // 获取歌单列表
      const playlists = dataService.getUserPlaylists().map(playlist => {
        // 如果是"我喜欢"歌单，使用全局收藏数量
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
      
      // 获取收藏的歌曲
      const favoriteSongs = await dataService.getFavoriteSongs();
      
      // 获取收藏的合集
      const favoriteCollections = await dataService.getFavoriteCollectionDetails();
      
      this.setData({
        stats,
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

  goBack() {
    wx.navigateBack();
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // ========== 歌单操作 ==========
  
  // 进入歌单详情
  goToPlaylistDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/playlist-detail/index?id=${item.id}`
    });
  },
  
  // 显示创建歌单弹窗
  showCreatePlaylist() {
    this.setData({
      showCreateModal: true,
      newPlaylistName: ''
    });
  },
  
  // 关闭创建弹窗
  closeCreateModal() {
    this.setData({
      showCreateModal: false,
      newPlaylistName: ''
    });
  },
  
  // 输入歌单名称
  onPlaylistNameInput(e) {
    this.setData({ newPlaylistName: e.detail.value });
  },
  
  // 确认创建歌单
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
      this.loadUserData();
    } else {
      wx.showToast({ title: '创建失败', icon: 'none' });
    }
  },
  
  // 显示歌单管理菜单
  showPlaylistMenu(e) {
    const item = e.currentTarget.dataset.item;
    this.setData({
      currentPlaylist: item,
      showManageMenu: true
    });
  },
  
  // 关闭管理菜单
  closeManageMenu() {
    this.setData({
      showManageMenu: false,
      currentPlaylist: null
    });
  },
  
  // 重命名歌单
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
            this.loadUserData();
          }
        }
      }
    });
  },
  
  // 删除歌单
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
            this.loadUserData();
          }
        }
      }
    });
  },
  
  // ========== 输入弹窗 ==========
  
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

  // ========== 歌曲操作 ==========
  
  goToSongDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.id}`
    });
  },
  
  toggleFavorite(e) {
    const songId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleFavorite(songId);
    
    if (!isFavorite) {
      // 取消收藏后从列表移除
      const favoriteSongs = this.data.favoriteSongs.filter(s => s.id !== songId);
      this.setData({ favoriteSongs });
    }
    
    // 更新统计和歌单
    this.loadUserData();
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },
  
  showSongActions(e) {
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
            this.toggleFavorite({ currentTarget: { dataset: { id: item.id } } });
            break;
        }
      }
    });
  },
  
  // 显示添加到歌单选择
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
          this.loadUserData();
        } else {
          wx.showToast({ title: '歌曲已在歌单中', icon: 'none' });
        }
      }
    });
  },

  // ========== 合集操作 ==========
  
  goToCollectionDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/category-list/index?type=collection&id=${item.id}`
    });
  },
  
  toggleCollectionFavorite(e) {
    const collectionId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleCollectionFavorite(collectionId);
    
    if (!isFavorite) {
      // 取消收藏后从列表移除
      const favoriteCollections = this.data.favoriteCollections.filter(c => c.id !== collectionId);
      this.setData({ favoriteCollections });
    }
    
    // 更新统计
    this.loadUserData();
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  // ========== 阻止冒泡 ==========
  stopPropagation() {},

  // ========== 分享 ==========
  onShareAppMessage() {
    return {
      title: '我的音乐 - 星轨乐库',
      path: '/subpackages/open_library/pages/index/index?tab=2'
    };
  }
});
