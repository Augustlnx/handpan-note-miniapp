const app = getApp();

Page({
  data: {
    mainTitleColor: '#314D63',
    subTitleColor: '#8FB9AB',
    rightHandColor: '#F4D096',
    leftHandColor: '#314D63',
    backgroundOpacity: 10, // 背景图片透明度（默认10%）
    showUserManual: false,
    showChangelog: false
  },

  onLoad() {
    this.loadSettings();
  },

  onShow() {
    // 每次显示时重新加载设置，确保透明度滑块正确显示
    this.loadSettings();
  },

  // 加载设置
  loadSettings() {
    const savedSettings = wx.getStorageSync('colorSettings') || {};
    const backgroundOpacity = wx.getStorageSync('backgroundOpacity');
    this.setData({
      mainTitleColor: savedSettings.mainTitleColor || '#314D63',
      subTitleColor: savedSettings.subTitleColor || '#8FB9AB',
      rightHandColor: savedSettings.rightHandColor || '#F4D096',
      leftHandColor: savedSettings.leftHandColor || '#314D63',
      backgroundOpacity: backgroundOpacity !== undefined ? backgroundOpacity : 10
    });
  },

  // 主标题颜色输入
  onMainTitleColorInput(e) {
    let value = e.detail.value.trim();
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    if (this.isValidColor(value)) {
      this.setData({ mainTitleColor: value });
    }
  },

  // 副标题颜色输入
  onSubTitleColorInput(e) {
    let value = e.detail.value.trim();
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    if (this.isValidColor(value)) {
      this.setData({ subTitleColor: value });
    }
  },

  // 右手颜色输入
  onRightHandColorInput(e) {
    let value = e.detail.value.trim();
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    if (this.isValidColor(value)) {
      this.setData({ rightHandColor: value });
    }
  },

  // 左手颜色输入
  onLeftHandColorInput(e) {
    let value = e.detail.value.trim();
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    if (this.isValidColor(value)) {
      this.setData({ leftHandColor: value });
    }
  },

  // 验证颜色格式
  isValidColor(color) {
    const regex = /^#([0-9A-F]{3}|[0-9A-F]{6})$/i;
    return regex.test(color);
  },

  // 背景透明度变化
  onBackgroundOpacityChange(e) {
    const value = e.detail.value;
    this.setData({ backgroundOpacity: value });
    // 即时写入，便于其他页面 onShow 读取最新值
    wx.setStorageSync('backgroundOpacity', value);
    app.globalData.backgroundOpacity = value;
  },

  // 保存设置
  saveSettings() {
    const { mainTitleColor, subTitleColor, rightHandColor, leftHandColor, backgroundOpacity } = this.data;

    // 验证颜色
    if (!this.isValidColor(mainTitleColor) || 
        !this.isValidColor(subTitleColor) || 
        !this.isValidColor(rightHandColor) || 
        !this.isValidColor(leftHandColor)) {
      wx.showToast({
        title: '请输入有效的颜色值',
        icon: 'none'
      });
      return;
    }

    const settings = {
      mainTitleColor,
      subTitleColor,
      rightHandColor,
      leftHandColor
    };

    wx.setStorageSync('colorSettings', settings);
    wx.setStorageSync('backgroundOpacity', backgroundOpacity);
    app.globalData.colorSettings = settings;
    app.globalData.backgroundOpacity = backgroundOpacity;

    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },

  // 恢复默认设置
  resetSettings() {
    // 直接执行，无需确认
    this.setData({
      mainTitleColor: '#314D63',
      subTitleColor: '#8FB9AB',
      rightHandColor: '#F4D096',
      leftHandColor: '#314D63',
      backgroundOpacity: 10
    });

    wx.setStorageSync('colorSettings', {
      mainTitleColor: '#314D63',
      subTitleColor: '#8FB9AB',
      rightHandColor: '#F4D096',
      leftHandColor: '#314D63'
    });
    wx.setStorageSync('backgroundOpacity', 10);
    app.globalData.colorSettings = {
      mainTitleColor: '#314D63',
      subTitleColor: '#8FB9AB',
      rightHandColor: '#F4D096',
      leftHandColor: '#314D63'
    };
    app.globalData.backgroundOpacity = 10;

    wx.showToast({
      title: '已恢复默认',
      icon: 'success'
    });
  },

  // 显示用户手册
  showUserManual() {
    this.setData({ showUserManual: true });
  },

  // 关闭用户手册
  closeUserManual() {
    this.setData({ showUserManual: false });
  },

  // 显示更新日志
  showChangelog() {
    this.setData({ showChangelog: true });
  },

  // 关闭更新日志
  closeChangelog() {
    this.setData({ showChangelog: false });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存数据吗？此操作不可撤销。',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.clearStorageSync();
            wx.showToast({
              title: '缓存已清除，请重新启动小程序',
              icon: 'none',
              duration: 3000
            });
            // 清除后重新加载设置
            this.loadSettings();
          } catch (e) {
            console.error('清除缓存失败:', e);
            wx.showToast({
              title: '清除缓存失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  // 阻止冒泡
  stopPropagation() {},

  // ========== 分享功能 ==========

  // 分享给好友
  onShareAppMessage() {
    return {
      title: 'Handpan Note 设置 - 个性化配置',
      path: '/pages/settings/settings'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'Handpan Note 设置 - 个性化配置'
    };
  }
});
