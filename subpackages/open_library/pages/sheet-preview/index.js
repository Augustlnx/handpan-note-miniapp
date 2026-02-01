/**
 * 谱面详情预览页
 * 
 * 功能：
 * - 展示曲谱详细信息
 * - Canvas绘制谱面第一页预览
 * - 试听/打开曲谱操作
 * - 收藏功能
 */

const dataService = require('../../utils/dataService.js');

Page({
  data: {
    statusBarHeight: 20,
    safeAreaBottom: 0,
    
    // 曲谱数据
    song: null,
    relatedSongs: [],
    
    // 收藏状态
    isFavorite: false,
    
    // Canvas相关
    canvasWidth: 300,
    canvasHeight: 400,
    isCanvasLoading: true,
    previewImage: '',
    
    // 背景渐变
    bgGradient: 'linear-gradient(180deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)'
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
    try {
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      const safeAreaBottom = systemInfo.safeArea 
        ? systemInfo.screenHeight - systemInfo.safeArea.bottom 
        : 0;
      
      // 计算Canvas尺寸（适配屏幕宽度）
      const screenWidth = systemInfo.windowWidth;
      const canvasWidth = Math.floor(screenWidth * 0.85);
      const canvasHeight = Math.floor(canvasWidth * 1.4); // 保持合适的宽高比
      
      this.setData({
        statusBarHeight,
        safeAreaBottom,
        canvasWidth,
        canvasHeight
      });
    } catch (e) {
      console.error('获取系统信息失败', e);
    }
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
      
      // 根据封面渐变色设置背景
      let bgGradient = this.data.bgGradient;
      if (song.coverGradient && song.coverGradient.length >= 2) {
        bgGradient = `linear-gradient(180deg, ${song.coverGradient[0]} 0%, ${song.coverGradient[1]} 100%)`;
      }
      
      this.setData({
        song,
        isFavorite,
        bgGradient
      });
      
      wx.hideLoading();
      
      // 加载相关推荐
      this.loadRelatedSongs(song);
      
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
   * 加载相关推荐
   */
  async loadRelatedSongs(song) {
    try {
      // 根据相同调式或标签推荐
      const results = await dataService.searchSongs('', {
        rootNote: song.rootNote
      });
      
      // 排除当前曲谱，取前4个
      const relatedSongs = results
        .filter(s => s.id !== song.id)
        .slice(0, 4);
      
      this.setData({ relatedSongs });
    } catch (e) {
      console.error('加载相关推荐失败', e);
    }
  },

  /**
   * 绘制谱面第一页预览
   * 参考 pdfExport.js 的绘制逻辑
   */
  drawSheetPreview(song) {
    this.setData({ isCanvasLoading: true });
    
    const query = wx.createSelectorQuery();
    query.select('#sheetCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0] || !res[0].node) {
          console.error('获取Canvas失败');
          this.setData({ isCanvasLoading: false });
          return;
        }
        
        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getSystemInfoSync().pixelRatio || 2;
        
        // 设置Canvas尺寸
        canvas.width = this.data.canvasWidth * dpr;
        canvas.height = this.data.canvasHeight * dpr;
        ctx.scale(dpr, dpr);
        
        const width = this.data.canvasWidth;
        const height = this.data.canvasHeight;
        
        // 绘制白色背景
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制标题
        const titleY = 40;
        ctx.fillStyle = '#314D63';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(song.title || '', width / 2, titleY);
        
        // 绘制副标题
        ctx.fillStyle = '#8FB9AB';
        ctx.font = '14px sans-serif';
        ctx.fillText(song.subtitle || '', width / 2, titleY + 24);
        
        // 绘制元信息
        const metaY = titleY + 50;
        ctx.fillStyle = '#666666';
        ctx.font = '12px sans-serif';
        const metaText = `${song.artistName} | ${song.rootNote}-${song.scaleType} | ${song.tempo} BPM`;
        ctx.fillText(metaText, width / 2, metaY);
        
        // 绘制分隔线
        ctx.strokeStyle = '#EEEEEE';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(20, metaY + 20);
        ctx.lineTo(width - 20, metaY + 20);
        ctx.stroke();
        
        // 绘制简化的谱面内容示意
        this.drawSimplifiedSheet(ctx, song, width, height, metaY + 40);
        
        // 绘制水印
        ctx.fillStyle = 'rgba(49, 77, 99, 0.1)';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText('Orbit Note 星轨手碟记谱', width / 2, height - 30);
        
        // 导出为图片
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvas: canvas,
            success: (res) => {
              this.setData({
                previewImage: res.tempFilePath,
                isCanvasLoading: false
              });
            },
            fail: (err) => {
              console.error('导出预览图失败', err);
              this.setData({ isCanvasLoading: false });
            }
          });
        }, 100);
      });
  },

  /**
   * 绘制简化的谱面内容示意
   */
  drawSimplifiedSheet(ctx, song, width, height, startY) {
    const leftMargin = 20;
    const contentWidth = width - 40;
    const lineHeight = 50;
    const beatWidth = contentWidth / 4;
    
    // 绘制模块标签
    ctx.fillStyle = '#314D63';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('A-1', leftMargin, startY);
    
    // 绘制4行谱面示意
    for (let row = 0; row < 4; row++) {
      const y = startY + 20 + row * (lineHeight + 20);
      
      // 绘制小节
      for (let beat = 0; beat <= 4; beat++) {
        const x = leftMargin + beat * beatWidth;
        
        // 小节线
        ctx.strokeStyle = '#CCCCCC';
        ctx.lineWidth = beat === 0 || beat === 4 ? 2 : 1;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + lineHeight);
        ctx.stroke();
      }
      
      // 中央横线
      ctx.strokeStyle = '#DDDDDD';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(leftMargin, y + lineHeight / 2);
      ctx.lineTo(leftMargin + contentWidth, y + lineHeight / 2);
      ctx.stroke();
      
      // 绘制示意音符
      ctx.fillStyle = '#F4D096';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      
      // 随机示意音符
      for (let beat = 0; beat < 4; beat++) {
        const noteX = leftMargin + beat * beatWidth + beatWidth / 2;
        const notes = ['1', '2', '3', '4', '5', '6', '7', '-'];
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        
        if (randomNote !== '-') {
          // 上方音符（右手）
          ctx.fillStyle = '#F4D096';
          ctx.fillText(randomNote, noteX, y + lineHeight * 0.35);
          
          // 下方音符（左手）
          ctx.fillStyle = '#314D63';
          const randomNote2 = notes[Math.floor(Math.random() * notes.length)];
          if (randomNote2 !== '-') {
            ctx.fillText(randomNote2, noteX, y + lineHeight * 0.75);
          }
        }
      }
    }
  },

  /**
   * 返回上一页
   */
  goBack() {
    wx.navigateBack();
  },

  /**
   * 跳转到制谱人主页
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
   * 跳转到相关曲谱
   */
  goToRelatedSong(e) {
    const item = e.currentTarget.dataset.item;
    wx.redirectTo({
      url: `/subpackages/open_library/pages/sheet-preview/index?id=${item.id}`
    });
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
    
    // TODO: 实现试听功能
    // 可以调用主包的播放器
  },

  /**
   * 打开曲谱
   */
  openSheet() {
    const { song } = this.data;
    if (!song) return;
    
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
            file_name: song.title,
            title: song.title,
            subtitle: song.subtitle,
            tempo: song.tempo,
            composer: song.artistName,
            rootNote: song.rootNote,
            scaleType: song.scaleType,
            noteCount: song.noteCount,
            difficulty: song.difficulty,
            introduction: song.introduction,
            code: song.code || '',
            notationType: 'digital'
          };
          
          // 存储到本地，供记谱页读取
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
        '查看制谱人',
        '分享'
      ],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            this.toggleFavorite();
            break;
          case 1:
            this.goToArtist();
            break;
          case 2:
            // 分享
            break;
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
      title: song ? `${song.title} - ${song.artistName}` : '星轨乐库曲谱',
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
