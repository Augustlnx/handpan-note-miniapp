// 新手教程页面
Page({
  data: {
    currentStep: 0,
    totalSteps: 5,
    guides: [
      { 
        id: 1, 
        image: '/subpackages/packageB/img/guide1.jpg',
        title: '第 1 步',
        description: '认识界面'
      },
      { 
        id: 2, 
        image: '/subpackages/packageB/img/guide2.jpg',
        title: '第 2 步',
        description: '基础操作'
      },
      { 
        id: 3, 
        image: '/subpackages/packageB/img/guide3.jpg',
        title: '第 3 步',
        description: '编辑记谱'
      },
      { 
        id: 4, 
        image: '/subpackages/packageB/img/guide4.jpg',
        title: '第 4 步',
        description: '高级功能'
      },
      { 
        id: 5, 
        image: '/subpackages/packageB/img/guide5.jpg',
        title: '第 5 步',
        description: '导出分享'
      }
    ],
    indicatorDots: false,
    autoplay: false,
    circular: false,
    duration: 300
  },

  onLoad() {
    // 初始化
  },

  // swiper 切换回调
  onSwiperChange(e) {
    const current = e.detail.current;
    this.setData({
      currentStep: current
    });
  },

  // 点击指示器切换
  onIndicatorTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentStep: index
    });
  },

  // 上一步
  onPrevTap() {
    if (this.data.currentStep > 0) {
      this.setData({
        currentStep: this.data.currentStep - 1
      });
    }
  },

  // 下一步
  onNextTap() {
    if (this.data.currentStep < this.data.totalSteps - 1) {
      this.setData({
        currentStep: this.data.currentStep + 1
      });
    } else {
      // 最后一步，完成教程
      this.finishGuide();
    }
  },

  // 跳过教程
  onSkipTap() {
    this.finishGuide();
  },

  // 完成教程
  finishGuide() {
    wx.navigateBack({
      fail: () => {
        // 如果无法返回，跳转到首页
        wx.switchTab({
          url: '/pages/notation/notation'
        });
      }
    });
  },

  // 图片加载完成
  onImageLoad(e) {
    console.log('Guide image loaded:', e.currentTarget.dataset.index);
  },

  // 图片加载失败
  onImageError(e) {
    console.error('Guide image load error:', e.currentTarget.dataset.index);
  }
});
