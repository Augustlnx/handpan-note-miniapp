/**
 * 歌单详情页面
 * 显示歌单内的曲谱列表，支持管理操作
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    headerHeight: 200,
    
    // 歌单信息
    playlist: null,
    playlistId: '',
    
    // 歌曲列表
    songs: [],
    
    // 编辑模式
    editMode: false,
    selectedSongs: [],
    
    // 弹窗
    showRenameModal: false,
    newName: ''
  },

  onLoad(options) {
    this.initSystemInfo();
    
    if (options.id) {
      this.setData({ playlistId: options.id });
      this.loadPlaylistDetail(options.id);
    }
  },
  
  onShow() {
    // 返回时刷新数据
    if (this.data.playlistId) {
      this.loadPlaylistDetail(this.data.playlistId);
    }
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

  async loadPlaylistDetail(id) {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      const playlist = await dataService.getPlaylistDetail(id);
      
      if (!playlist) {
        wx.hideLoading();
        wx.showToast({
          title: '歌单不存在',
          icon: 'none'
        });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }
      
      this.setData({
        playlist,
        songs: playlist.songs || []
      });
      
      wx.hideLoading();
      
    } catch (e) {
      console.error('加载歌单详情失败', e);
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

  // ========== 歌单操作 ==========
  
  // 显示重命名弹窗
  showRenameModal() {
    if (this.data.playlist.isDefault) {
      wx.showToast({ title: '默认歌单无法重命名', icon: 'none' });
      return;
    }
    
    this.setData({
      showRenameModal: true,
      newName: this.data.playlist.name
    });
  },
  
  closeRenameModal() {
    this.setData({
      showRenameModal: false,
      newName: ''
    });
  },
  
  onRenameInput(e) {
    this.setData({ newName: e.detail.value });
  },
  
  confirmRename() {
    const newName = this.data.newName.trim();
    if (!newName) {
      wx.showToast({ title: '名称不能为空', icon: 'none' });
      return;
    }
    
    const success = dataService.renamePlaylist(this.data.playlistId, newName);
    if (success) {
      wx.showToast({ title: '重命名成功', icon: 'success' });
      this.closeRenameModal();
      this.loadPlaylistDetail(this.data.playlistId);
    }
  },
  
  // 删除歌单
  deletePlaylist() {
    if (this.data.playlist.isDefault) {
      wx.showToast({ title: '默认歌单无法删除', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除歌单"${this.data.playlist.name}"吗？`,
      confirmText: '删除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          const success = dataService.deletePlaylist(this.data.playlistId);
          if (success) {
            wx.showToast({ title: '删除成功', icon: 'success' });
            setTimeout(() => wx.navigateBack(), 1000);
          }
        }
      }
    });
  },
  
  // 显示更多操作
  showMoreActions() {
    const items = ['重命名'];
    if (!this.data.playlist.isDefault) {
      items.push('删除歌单');
    }
    
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        if (res.tapIndex === 0) {
          this.showRenameModal();
        } else if (res.tapIndex === 1) {
          this.deletePlaylist();
        }
      }
    });
  },

  // ========== 编辑模式 ==========
  
  toggleEditMode() {
    const editMode = !this.data.editMode;
    this.setData({
      editMode,
      selectedSongs: editMode ? [] : []
    });
  },
  
  toggleSelectSong(e) {
    const songId = e.currentTarget.dataset.id;
    let selectedSongs = [...this.data.selectedSongs];
    
    const index = selectedSongs.indexOf(songId);
    if (index > -1) {
      selectedSongs.splice(index, 1);
    } else {
      selectedSongs.push(songId);
    }
    
    this.setData({ selectedSongs });
  },
  
  selectAll() {
    const allIds = this.data.songs.map(s => s.id);
    this.setData({ selectedSongs: allIds });
  },
  
  deselectAll() {
    this.setData({ selectedSongs: [] });
  },
  
  // 批量删除
  batchRemove() {
    if (this.data.selectedSongs.length === 0) {
      wx.showToast({ title: '请先选择歌曲', icon: 'none' });
      return;
    }
    
    wx.showModal({
      title: '确认移除',
      content: `确定要从歌单中移除 ${this.data.selectedSongs.length} 首歌曲吗？`,
      confirmText: '移除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          this.data.selectedSongs.forEach(songId => {
            dataService.removeSongFromPlaylist(this.data.playlistId, songId);
          });
          
          wx.showToast({ title: '移除成功', icon: 'success' });
          this.setData({
            editMode: false,
            selectedSongs: []
          });
          this.loadPlaylistDetail(this.data.playlistId);
        }
      }
    });
  },

  // ========== 歌曲操作 ==========
  
  goToSongDetail(e) {
    if (this.data.editMode) return;
    
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.id}`
    });
  },
  
  toggleFavorite(e) {
    const songId = e.currentTarget.dataset.id;
    const isFavorite = dataService.toggleFavorite(songId);
    
    // 更新本地列表状态
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
    
    // 如果是"我喜欢"歌单，取消收藏后需要刷新列表
    if (this.data.playlistId === dataService.DEFAULT_PLAYLIST_ID && !isFavorite) {
      this.loadPlaylistDetail(this.data.playlistId);
    }
  },
  
  showSongActions(e) {
    const item = e.currentTarget.dataset.item;
    
    const items = ['查看曲谱', item.isFavorite ? '取消收藏' : '添加收藏'];
    if (!this.data.playlist.isDefault || this.data.playlistId !== dataService.DEFAULT_PLAYLIST_ID) {
      items.push('从歌单移除');
    }
    
    wx.showActionSheet({
      itemList: items,
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.goToSongDetail({ currentTarget: { dataset: { item } } });
            break;
          case 1:
            this.toggleFavorite({ currentTarget: { dataset: { id: item.id } } });
            break;
          case 2:
            this.removeSongFromPlaylist(item);
            break;
        }
      }
    });
  },
  
  removeSongFromPlaylist(song) {
    wx.showModal({
      title: '确认移除',
      content: `确定要将"${song.title}"从歌单中移除吗？`,
      confirmText: '移除',
      confirmColor: '#ff4444',
      success: (res) => {
        if (res.confirm) {
          const success = dataService.removeSongFromPlaylist(this.data.playlistId, song.id);
          if (success) {
            wx.showToast({ title: '已移除', icon: 'success' });
            this.loadPlaylistDetail(this.data.playlistId);
          }
        }
      }
    });
  },

  // ========== 阻止冒泡 ==========
  stopPropagation() {},

  // ========== 分享 ==========
  onShareAppMessage() {
    const { playlist } = this.data;
    return {
      title: `${playlist ? playlist.name : '我的歌单'} - 星轨乐库`,
      path: `/subpackages/open_library/pages/playlist-detail/index?id=${this.data.playlistId}`
    };
  }
});
