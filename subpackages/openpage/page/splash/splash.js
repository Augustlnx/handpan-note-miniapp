// 开屏等待页面
Page({
  data: {
    countdown: 2,
    showButton: false,
    imageLoaded: false,
    countdownFinished: false,
    posterSrc: ''
  },

  countdownTimer: null,
  loadRetryCount: 0,
  maxRetries: 3,
  loadTimer: null,
  hasStartedCountdown: false,
  imageFormats: ['webp', 'jpeg', 'png'],

  onLoad() {
    // 立即开始预加载主包
    this.preloadMainPackage();
    
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
