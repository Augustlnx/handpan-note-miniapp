/**
 * 谱面详情预览页
 * 
 * 功能：
 * - 展示曲谱详细信息
 * - Canvas绘制谱面预览（使用紧凑模式、A4竖向布局）
 * - 试听/打开曲谱操作
 * - 收藏功能
 */

const dataService = require('../../utils/dataService.js');
const sheetRenderer = require('../../utils/sheetPreviewRenderer.js');

// 缓存系统信息
let _systemInfoCache = null;

/**
 * 获取系统信息（使用新API，兼容旧版本）
 */
function getSystemInfo() {
  if (_systemInfoCache) return _systemInfoCache;
  
  try {
    // 使用新的分离API（微信基础库2.20.1+）
    const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : null;
    const deviceInfo = wx.getDeviceInfo ? wx.getDeviceInfo() : null;
    
    if (windowInfo && deviceInfo) {
      _systemInfoCache = {
        statusBarHeight: windowInfo.statusBarHeight || 20,
        screenHeight: windowInfo.screenHeight,
        screenWidth: windowInfo.screenWidth,
        windowWidth: windowInfo.windowWidth,
        windowHeight: windowInfo.windowHeight,
        safeArea: windowInfo.safeArea,
        pixelRatio: windowInfo.pixelRatio || 2
      };
    } else {
      // 降级使用旧API
      const sysInfo = wx.getSystemInfoSync();
      _systemInfoCache = {
        statusBarHeight: sysInfo.statusBarHeight || 20,
        screenHeight: sysInfo.screenHeight,
        screenWidth: sysInfo.screenWidth,
        windowWidth: sysInfo.windowWidth,
        windowHeight: sysInfo.windowHeight,
        safeArea: sysInfo.safeArea,
        pixelRatio: sysInfo.pixelRatio || 2
      };
    }
  } catch (e) {
    console.error('获取系统信息失败', e);
    _systemInfoCache = {
      statusBarHeight: 20,
      screenHeight: 667,
      screenWidth: 375,
      windowWidth: 375,
      windowHeight: 603,
      safeArea: { bottom: 667 },
      pixelRatio: 2
    };
  }
  
  return _systemInfoCache;
}

Page({
  data: {
    statusBarHeight: 20,
    safeAreaBottom: 0,
    
    // 曲谱数据
    song: null,
    
    // 收藏状态
    isFavorite: false,
    
    // Canvas相关
    canvasWidth: 300,
    canvasHeight: 400,
    isCanvasLoading: true,
    previewImage: '',
    
    // 深色渐变背景（基于#314D63主题）
    bgGradient: 'linear-gradient(180deg, #1a2a3a 0%, #243447 25%, #314D63 50%, #2a4055 75%, #1e3244 100%)'
  },

  onLoad(options) {
    this.initSystemInfo();
    
    if (options.id) {
      this.loadSongDetail(options.id);
    }
  },

  /**
   * 初始化系统信息
   */
  initSystemInfo() {
    const sysInfo = getSystemInfo();
    const statusBarHeight = sysInfo.statusBarHeight;
    const safeAreaBottom = sysInfo.safeArea 
      ? sysInfo.screenHeight - sysInfo.safeArea.bottom 
      : 0;
    
    // 计算Canvas宽度（占满容器，减去左右padding）
    const screenWidth = sysInfo.windowWidth;
    const canvasWidth = Math.floor(screenWidth - 48); // 24px * 2 padding
    
    this.setData({
      statusBarHeight,
      safeAreaBottom,
      canvasWidth,
      // 初始高度，后续会根据内容自适应
      canvasHeight: Math.floor(canvasWidth * 1.2)
    });
  },

  /**
   * 加载曲谱详情
   */
  async loadSongDetail(id) {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      const song = await dataService.getSongDetail(id);
      
      if (!song) {
        wx.hideLoading();
        wx.showToast({
          title: '曲谱不存在',
          icon: 'none'
        });
        setTimeout(() => wx.navigateBack(), 1500);
        return;
      }
      
      // 检查收藏状态
      const isFavorite = dataService.isFavorite(id);
      
      this.setData({
        song,
        isFavorite
        // 不再修改bgGradient，使用固定的深色渐变
      });
      
      wx.hideLoading();
      
      // 绘制谱面预览
      this.drawSheetPreview(song);
      
    } catch (e) {
      console.error('加载曲谱详情失败', e);
      wx.hideLoading();
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 绘制谱面预览
   * 使用紧凑模式、A4竖向布局，只绘制谱面数据
   */
  drawSheetPreview(song) {
    this.setData({ isCanvasLoading: true, previewImage: '' });
    
    // 解析谱面代码
    let notations = [];
    if (song.code && song.code.trim()) {
      try {
        notations = sheetRenderer.parseNotationCode(song.code);
        console.log('解析谱面结果:', notations.length, '个模块');
      } catch (e) {
        console.error('解析谱面代码失败', e);
      }
    }
    
    // 如果没有有效数据，显示占位
    if (!notations || notations.length === 0) {
      console.log('无谱面数据，显示占位符');
      this.drawPlaceholder();
      return;
    }
    
    // 计算所需高度
    const width = this.data.canvasWidth;
    const requiredHeight = sheetRenderer.calculatePreviewHeight(notations, width);
    const canvasHeight = Math.max(200, Math.min(requiredHeight + 20, 800)); // 限制最大高度
    
    // 获取设备像素比
    const sysInfo = getSystemInfo();
    const dpr = Math.min(sysInfo.pixelRatio || 2, 3); // 限制最大3倍，避免内存溢出
    
    console.log('Canvas尺寸:', width, 'x', canvasHeight, 'dpr:', dpr);
    this.setData({ canvasHeight }, () => {
      // 使用 nextTick 确保视图更新完成，再加延迟确保 Canvas 渲染
      wx.nextTick(() => {
        setTimeout(() => {
          this.renderCanvasContent(notations, width, canvasHeight, dpr);
        }, 100);
      });
    });
  },

  /**
   * 渲染 Canvas 内容
   */
  renderCanvasContent(notations, width, canvasHeight, dpr) {
    const query = wx.createSelectorQuery().in(this);
    query.select('#sheetCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log('Canvas查询结果:', res);
        if (!res || !res[0] || !res[0].node) {
          console.error('获取Canvas失败，res:', res);
          this.setData({ isCanvasLoading: false });
          return;
        }
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        // 设置Canvas尺寸（高清）
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(canvasHeight * dpr);
        ctx.scale(dpr, dpr);
        
        // 绘制白色背景
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, canvasHeight);
        
        // 绘制谱面
        sheetRenderer.drawSheetPreview(ctx, notations, width, canvasHeight);
        
        console.log('谱面绘制完成，开始导出图片...');
        
        // 保存 canvas 引用用于导出
        this._canvas = canvas;
        
        // 导出为高清图片
        setTimeout(() => {
          console.log('正在调用 canvasToTempFilePath...');
          wx.canvasToTempFilePath({
            canvas: canvas,
            x: 0,
            y: 0,
            width: width,
            height: canvasHeight,
            destWidth: Math.floor(width * dpr),
            destHeight: Math.floor(canvasHeight * dpr),
            fileType: 'png',
            quality: 1,
            success: (res) => {
              console.log('canvasToTempFilePath 成功:', res.tempFilePath);
              if (res.tempFilePath) {
                this.setData({
                  previewImage: res.tempFilePath,
                  isCanvasLoading: false
                }, () => {
                  console.log('previewImage 已设置:', this.data.previewImage);
                });
              } else {
                console.error('tempFilePath 为空');
                this.setData({ isCanvasLoading: false });
              }
            },
            fail: (err) => {
              console.error('canvasToTempFilePath 失败:', err);
              this.setData({ isCanvasLoading: false });
            }
          });
        }, 200);
      });
  },

  /**
   * 绘制占位提示
   */
  drawPlaceholder() {
    const width = this.data.canvasWidth;
    const height = 200;
    
    // 获取设备像素比
    const sysInfo = getSystemInfo();
    const dpr = Math.min(sysInfo.pixelRatio || 2, 3);
    
    this.setData({ canvasHeight: height }, () => {
      wx.nextTick(() => {
        setTimeout(() => {
          this.renderPlaceholderContent(width, height, dpr);
        }, 100);
      });
    });
  },

  /**
   * 渲染占位内容
   */
  renderPlaceholderContent(width, height, dpr) {
    const query = wx.createSelectorQuery().in(this);
    query.select('#sheetCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        console.log('Placeholder Canvas查询结果:', res);
        if (!res || !res[0] || !res[0].node) {
          console.error('Placeholder: 获取Canvas失败');
          this.setData({ isCanvasLoading: false });
          return;
        }
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        ctx.scale(dpr, dpr);
        
        // 白色背景
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // 占位提示
        sheetRenderer.drawPlaceholder(ctx, width, height);
        
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas: canvas,
            x: 0,
            y: 0,
            width: width,
            height: height,
            destWidth: Math.floor(width * dpr),
            destHeight: Math.floor(height * dpr),
            fileType: 'png',
            quality: 1,
            success: (res) => {
              console.log('Placeholder 图片生成成功:', res.tempFilePath);
              this.setData({
                previewImage: res.tempFilePath,
                isCanvasLoading: false
              });
            },
            fail: (err) => {
              console.error('Placeholder 图片生成失败:', err);
              this.setData({ isCanvasLoading: false });
            }
          });
        }, 150);
      });
  },

  /**
   * 预览图片加载成功
   */
  onPreviewImageLoad(e) {
    console.log('预览图片加载成功:', e.detail);
  },

  /**
   * 预览图片加载失败
   */
  onPreviewImageError(e) {
    console.error('预览图片加载失败:', e.detail);
    // 图片加载失败时清除 previewImage，让 Canvas 重新显示
    this.setData({ previewImage: '' });
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 跳转到发布者主页
   */
  goToArtist() {
    const { song } = this.data;
    if (song && song.artistId) {
      wx.navigateTo({
        url: `/subpackages/open_library/pages/artist-profile/index?id=${song.artistId}`
      });
    }
  },

  /**
   * 切换收藏状态
   */
  toggleFavorite() {
    const { song } = this.data;
    if (!song) return;
    
    const isFavorite = dataService.toggleFavorite(song.id);
    this.setData({ isFavorite });
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  /**
   * 试听
   */
  previewPlay() {
    wx.showToast({
      title: '试听功能开发中',
      icon: 'none'
    });
  },

  /**
   * 打开曲谱
   */
  openSheet() {
    const { song } = this.data;
    if (!song) return;
    
    // 检查曲谱是否有实际的代码数据
    if (!song.code) {
      wx.showToast({
        title: '该曲谱暂无谱面数据',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '打开曲谱',
      content: '将在记谱页打开此曲谱，是否继续？',
      confirmText: '确定',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          // 构建谱面数据
          const payload = {
            id: song.id,
            path: [],
            file_name: song.file_name || song.title,
            title: song.title,
            author: song.author || song.subtitle, // 使用 author 字段，向后兼容 subtitle
            tempo: song.tempo,
            timing: song.timing || '4/4',
            rotation: song.rotation || '手机竖屏（默认）',
            notationType: song.notationType || 'digital',
            composer: song.artistName,
            rootNote: song.rootNote,
            scaleType: song.scaleType,
            noteCount: song.noteCount,
            difficulty: song.difficulty,
            introduction: song.introduction,
            code: song.code,
            isFromOpenLibrary: true
          };
          
          // 存储到本地
          wx.setStorageSync('pending_notation_load', payload);
          
          // 跳转到记谱页
          wx.switchTab({
            url: '/pages/notation/notation',
            success: () => {
              wx.showToast({
                title: '正在加载曲谱...',
                icon: 'loading'
              });
            },
            fail: () => {
              wx.showToast({
                title: '跳转失败',
                icon: 'none'
              });
            }
          });
        }
      }
    });
  },

  /**
   * 显示更多操作
   */
  showMoreActions() {
    const { song, isFavorite } = this.data;
    
    wx.showActionSheet({
      itemList: [
        isFavorite ? '取消收藏' : '收藏',
        '添加到歌单',
        '查看发布者',
        '分享'
      ],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.toggleFavorite();
            break;
          case 1:
            this.showAddToPlaylist();
            break;
          case 2:
            this.goToArtist();
            break;
          case 3:
            // 分享
            break;
        }
      }
    });
  },

  /**
   * 显示添加到歌单选择
   */
  showAddToPlaylist() {
    const { song } = this.data;
    if (!song) return;
    
    const playlists = dataService.getUserPlaylists().filter(p => !p.isDefault);
    
    if (playlists.length === 0) {
      wx.showModal({
        title: '暂无歌单',
        content: '您还没有创建歌单，是否前往"我的"页面创建？',
        confirmText: '前往',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/subpackages/open_library/pages/index/index?tab=2'
            });
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
          wx.showToast({ 
            title: `已添加到"${playlist.name}"`, 
            icon: 'success' 
          });
        } else {
          wx.showToast({ 
            title: '歌曲已在歌单中', 
            icon: 'none' 
          });
        }
      }
    });
  },

  /**
   * 分享给朋友
   */
  onShareAppMessage() {
    const { song } = this.data;
    return {
      title: song ? `${song.title} - ${song.publisherName || song.artistName}` : '星轨乐库曲谱',
      path: `/subpackages/open_library/pages/sheet-preview/index?id=${song?.id || ''}`
    };
  },

  /**
   * 分享到朋友圈
   */
  onShareTimeline() {
    const { song } = this.data;
    return {
      title: song ? `${song.title} - 星轨乐库` : '星轨乐库曲谱'
    };
  }
});
