// 开屏等待页面
const app = getApp();

Page({
  data: {
    countdown: 2,
    showButton: false,
    imageLoaded: false,
    countdownFinished: false,
    posterSrc: '',
    preloadProgress: 0, // 预加载进度 (0-100)
    preloadStatus: '' // 预加载状态文字
  },

  countdownTimer: null,
  loadRetryCount: 0,
  maxRetries: 3,
  loadTimer: null,
  hasStartedCountdown: false,
  imageFormats: ['webp', 'jpeg', 'png'],
  preloadComplete: false, // 预加载是否完成

  onLoad() {
    // 立即开始预加载主包和数据
    this.preloadMainPackage();
    
    // 并行预加载 notation 页面所需的数据
    this.preloadNotationData();
    
    // 立即加载海报图片，从 webp 开始
    this.loadPosterImage();
  },

  onUnload() {
    // 清理所有定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  },

  // 加载海报图片
  loadPosterImage() {
    // 按照 webp -> jpeg -> png 的顺序尝试
    const formatIndex = this.loadRetryCount % this.imageFormats.length;
    const format = this.imageFormats[formatIndex];
    const newSrc = `/subpackages/openpage/img/open.${format}`;
    
    console.log(`Trying to load image: ${newSrc} (Attempt ${this.loadRetryCount + 1})`);
    
    this.setData({
      posterSrc: newSrc
    });
  },

  // 图片加载完成回调
  onImageLoad() {
    console.log('Image loaded successfully');
    
    // 清理可能存在的重试定时器
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
    
    this.setData({ 
      imageLoaded: true,
      showButton: true 
    });
    
    // 开始倒计时（确保只启动一次）
    if (!this.hasStartedCountdown) {
      this.hasStartedCountdown = true;
      this.startCountdown();
    }
  },

  // 图片加载失败
  onImageError(e) {
    console.error('Image load error:', e.detail, 'Format:', this.data.posterSrc);
    
    this.loadRetryCount++;
    
    if (this.loadRetryCount < this.maxRetries) {
      // 快速重试，几乎无延迟
      this.loadTimer = setTimeout(() => {
        this.loadPosterImage();
      }, 50);
    } else {
      // 重试次数用完，直接显示按钮让用户可以进入
      console.log('All image formats failed, showing button anyway');
      this.setData({ 
        imageLoaded: true,
        showButton: true
      });
      
      if (!this.hasStartedCountdown) {
        this.hasStartedCountdown = true;
        this.startCountdown();
      }
    }
  },

  // 预加载主包
  preloadMainPackage() {
    // 使用 wx.loadSubpackage 预下载主包相关资源
    // 由于我们在独立分包中，需要确保主包可用
    if (wx.loadSubpackage) {
      // 尝试预加载 resources 分包
      wx.loadSubpackage({
        name: 'resources',
        success: () => {
          console.log('Resources subpackage preloaded');
        },
        fail: (err) => {
          console.log('Resources preload failed:', err);
        }
      });
    }

    // 预加载 notation 页面，实现无缝衔接
    if (wx.preloadPage) {
      wx.preloadPage({
        url: '/pages/notation/notation',
        success: () => {
          console.log('Notation page preloaded');
        },
        fail: (err) => {
          console.log('Notation page preload failed:', err);
        }
      });
    }
  },

  // 预加载 notation 页面所需的数据
  preloadNotationData() {
    this.setData({ preloadStatus: '正在加载数据...' });
    
    const tasks = [];
    let completedTasks = 0;
    const totalTasks = 6;
    
    const updateProgress = (taskName) => {
      completedTasks++;
      const progress = Math.round((completedTasks / totalTasks) * 100);
      this.setData({ 
        preloadProgress: progress,
        preloadStatus: taskName 
      });
      
      if (completedTasks >= totalTasks) {
        this.preloadComplete = true;
        this.setData({ preloadStatus: '准备就绪' });
        console.log('All notation data preloaded');
      }
    };

    // 1. 预加载标题信息
    try {
      const mainTitle = wx.getStorageSync('mainTitle') || 'Note Title';
      const subTitle = wx.getStorageSync('subTitle') || 'Author: Unknown';
      const metaInfo = wx.getStorageSync('notationMetaInfo') || {};
      
      // 存储到全局数据供 notation 页面快速读取
      if (app && app.globalData) {
        app.globalData.preloadedTitles = {
          mainTitle,
          subTitle,
          composer: metaInfo.composer || 'Your Name',
          rootNote: metaInfo.rootNote || 'D',
          scaleType: metaInfo.scaleType || 'Kurd',
          noteCount: metaInfo.noteCount || 10,
          difficulty: metaInfo.difficulty || 1,
          introduction: metaInfo.introduction || ''
        };
      }
      updateProgress('加载标题');
    } catch (e) {
      console.log('Preload titles failed:', e);
      updateProgress('加载标题');
    }

    // 2. 预加载颜色设置
    try {
      const colorSettings = wx.getStorageSync('colorSettings') || {};
      if (app && app.globalData) {
        app.globalData.preloadedColors = {
          mainTitleColor: colorSettings.mainTitleColor || '#314D63',
          subTitleColor: colorSettings.subTitleColor || '#8FB9AB',
          rightHandColor: colorSettings.rightHandColor || '#F4D096',
          leftHandColor: colorSettings.leftHandColor || '#314D63'
        };
      }
      updateProgress('加载配色');
    } catch (e) {
      console.log('Preload colors failed:', e);
      updateProgress('加载配色');
    }

    // 3. 预加载谱面数据
    try {
      const timeSignatureBeats = wx.getStorageSync('timeSignatureBeats') || 4;
      const customTimeSignature = wx.getStorageSync('customTimeSignature');
      
      let notationsKey = `notations_${timeSignatureBeats}`;
      if (customTimeSignature && customTimeSignature.type === 'custom') {
        notationsKey = `notations_custom_${customTimeSignature.noteCount}`;
      }
      
      const notations = wx.getStorageSync(notationsKey);
      if (app && app.globalData) {
        app.globalData.preloadedNotations = {
          data: notations || [],
          key: notationsKey,
          timeSignatureBeats,
          customTimeSignature
        };
      }
      updateProgress('加载谱面');
    } catch (e) {
      console.log('Preload notations failed:', e);
      updateProgress('加载谱面');
    }

    // 4. 预加载全局速度和节拍器设置
    try {
      const globalTempo = wx.getStorageSync('globalTempo') || 60;
      const metronomeSoundType = wx.getStorageSync('metronomeSoundType') || 'click';
      
      if (app && app.globalData) {
        app.globalData.preloadedTempo = {
          globalTempo,
          metronomeSoundType
        };
      }
      updateProgress('加载速度');
    } catch (e) {
      console.log('Preload tempo failed:', e);
      updateProgress('加载速度');
    }

    // 5. 预加载库文件关联信息
    try {
      const libraryInfo = wx.getStorageSync('libraryFileInfo');
      if (app && app.globalData) {
        app.globalData.preloadedLibraryInfo = libraryInfo || null;
      }
      updateProgress('加载关联');
    } catch (e) {
      console.log('Preload library info failed:', e);
      updateProgress('加载关联');
    }

    // 6. 预加载谱式类型和背景透明度
    try {
      const notationType = wx.getStorageSync('notationType') || 'digital';
      const backgroundOpacity = wx.getStorageSync('backgroundOpacity');
      const storedOpacity = typeof backgroundOpacity === 'number' ? backgroundOpacity : parseFloat(backgroundOpacity);
      const opacity = Number.isFinite(storedOpacity) ? Math.max(10, storedOpacity) : 10;
      
      if (app && app.globalData) {
        app.globalData.preloadedSettings = {
          notationType,
          backgroundOpacity: opacity / 100
        };
        // 标记预加载完成
        app.globalData.notationPreloaded = true;
      }
      updateProgress('加载完成');
    } catch (e) {
      console.log('Preload settings failed:', e);
      updateProgress('加载完成');
    }
  },

  // 开始倒计时
  startCountdown() {
    let count = 2;
    
    this.countdownTimer = setInterval(() => {
      count--;
      
      if (count <= 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        // 倒计时结束，不自动进入，等待用户点击
        this.setData({ 
          countdown: 0,
          countdownFinished: true 
        });
      } else {
        this.setData({ countdown: count });
      }
    }, 1000);
  },

  // 点击立即开始按钮
  onStartTap() {
    // 清理定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    
    this.enterApp();
  },

  // 进入主程序
  enterApp() {
    wx.reLaunch({
      url: '/pages/notation/notation',
      fail: (err) => {
        console.error('Failed to enter app:', err);
        // 备用方案：使用 switchTab
        wx.switchTab({
          url: '/pages/notation/notation',
          fail: (err2) => {
            console.error('SwitchTab also failed:', err2);
            wx.showToast({
              title: '加载失败，请重试',
              icon: 'none'
            });
          }
        });
      }
    });
  }
});
