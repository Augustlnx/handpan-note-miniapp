/**
 * 分类详情页
 * 
 * 根据不同的type参数展示不同的列表：
 * - featured: 精选歌曲
 * - recent: 最近上新
 * - hot: 热门排行
 * - rootNote: 按调式筛选
 * - scaleType: 按音阶筛选
 * - tag: 按标签筛选
 * - collection: 合集详情（需要id参数）
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    
    type: '',
    id: '',
    pageTitle: '曲谱列表',
    
    // 列表类型
    listType: 'songs', // 'songs' | 'collections'
    
    // 筛选
    showFilter: false,
    filterOptions: [],
    currentFilter: '',
    
    // 数据
    songs: [],
    collections: [],
    collection: null, // 合集详情
    
    isLoading: true
  },

  onLoad(options) {
    this.initSystemInfo();
    
    const { type, id } = options;
    this.setData({ type, id });
    
    this.setupPage(type, id);
    this.loadData(type, id);
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

  /**
   * 根据类型配置页面
   */
  setupPage(type, id) {
    const config = {
      featured: {
        title: '精选歌曲',
        listType: 'songs',
        showFilter: false
      },
      recent: {
        title: '最近上新',
        listType: 'songs',
        showFilter: false
      },
      hot: {
        title: '热门排行',
        listType: 'songs',
        showFilter: false
      },
      rootNote: {
        title: '按调式浏览',
        listType: 'songs',
        showFilter: true,
        filterLoader: () => dataService.getAllRootNotes()
      },
      scaleType: {
        title: '按音阶浏览',
        listType: 'songs',
        showFilter: true,
        filterLoader: () => dataService.getAllScaleTypes()
      },
      tag: {
        title: '按风格浏览',
        listType: 'songs',
        showFilter: true,
        filterLoader: () => dataService.getHotTags(20)
      },
      collection: {
        title: '合集详情',
        listType: 'songs',
        showFilter: false
      },
      collections: {
        title: '全部合集',
        listType: 'collections',
        showFilter: false
      }
    };
    
    const pageConfig = config[type] || { title: '曲谱列表', listType: 'songs', showFilter: false };
    
    this.setData({
      pageTitle: pageConfig.title,
      listType: pageConfig.listType,
      showFilter: pageConfig.showFilter
    });
    
    // 加载筛选选项
    if (pageConfig.showFilter && pageConfig.filterLoader) {
      pageConfig.filterLoader().then(options => {
        this.setData({ filterOptions: options });
      });
    }
  },

  /**
   * 加载数据
   */
  async loadData(type, id) {
    this.setData({ isLoading: true });
    
    try {
      let songs = [];
      let collections = [];
      let collection = null;
      
      switch (type) {
        case 'featured':
          songs = await dataService.getFeaturedSongs(50);
          break;
        case 'recent':
          songs = await dataService.getRecentSongs(50);
          break;
        case 'hot':
          songs = await dataService.getHotSongs(50);
          break;
        case 'rootNote':
          if (this.data.currentFilter) {
            songs = await dataService.getSongsByRootNote(this.data.currentFilter);
          } else {
            songs = await dataService.getHotSongs(50);
          }
          break;
        case 'scaleType':
          if (this.data.currentFilter) {
            songs = await dataService.getSongsByScaleType(this.data.currentFilter);
          } else {
            songs = await dataService.getHotSongs(50);
          }
          break;
        case 'tag':
          if (this.data.currentFilter) {
            songs = await dataService.getSongsByTag(this.data.currentFilter);
          } else {
            songs = await dataService.getHotSongs(50);
          }
          break;
        case 'collection':
          if (id) {
            const detail = await dataService.getCollectionDetail(id);
            if (detail) {
              collection = detail;
              songs = detail.songs || [];
              this.setData({ pageTitle: detail.title });
            }
          }
          break;
        case 'collections':
          collections = await dataService.getAllCollections();
          break;
        default:
          songs = await dataService.getHotSongs(50);
      }
      
      // 更新收藏状态
      songs = songs.map(song => ({
        ...song,
        isFavorite: dataService.isFavorite(song.id)
      }));
      
      this.setData({
        songs,
        collections,
        collection,
        isLoading: false
      });
      
    } catch (e) {
      console.error('加载数据失败', e);
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

  onFilterChange(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ currentFilter: value });
    this.loadData(this.data.type, this.data.id);
  },

  goToSongDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.id}`
    });
  },

  goToCollectionDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.redirectTo({
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

  loadMore() {
    // TODO: 分页加载
  }
});
