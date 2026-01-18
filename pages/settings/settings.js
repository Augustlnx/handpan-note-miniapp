const app = getApp();
const libraryManager = require('../../utils/libraryManager');

Page({
  data: {
    // 用户信息
    userAvatar: '', // 用户头像URL
    userNickname: '', // 用户昵称
    isLoggedIn: false, // 是否已登录（已设置头像昵称）
    defaultUid: '', // 默认随机UID
    
    // 头像昵称编辑弹窗
    showProfileModal: false, // 是否显示头像昵称编辑弹窗
    tempAvatar: '', // 临时头像（用户选择但未保存）
    tempNickname: '', // 临时昵称（用户输入但未保存）
    
    // VIP卡片
    vipCardLoaded: false, // VIP卡片是否加载成功
    vipCardError: false, // VIP卡片加载失败
    vipLoadAttempts: 0, // 加载尝试次数
    
    // 图标和Logo加载状态
    refreshIconLoaded: false, // 清除缓存图标是否加载成功
    refreshIconError: false, // 清除缓存图标加载失败
    refreshIconAttempts: 0, // 清除缓存图标加载尝试次数
    logoLoaded: false, // Logo是否加载成功
    logoError: false, // Logo加载失败
    logoAttempts: 0, // Logo加载尝试次数
    
    // 颜色设置
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
    this.loadUserInfo();
    this.delayLoadVipCard();
    this.delayLoadIcons();
  },

  onShow() {
    // 每次显示时重新加载设置，确保透明度滑块正确显示
    this.loadSettings();
  },

  // ========== 用户信息相关 ==========
  
  // 加载用户信息
  loadUserInfo() {
    const savedUserInfo = wx.getStorageSync('userInfo');
    if (savedUserInfo && savedUserInfo.avatarUrl) {
      this.setData({
        userAvatar: savedUserInfo.avatarUrl,
        userNickname: savedUserInfo.nickName,
        isLoggedIn: true
      });
    } else {
      // 生成随机UID
      const savedUid = wx.getStorageSync('defaultUid');
      const uid = savedUid || this.generateRandomUid();
      if (!savedUid) {
        wx.setStorageSync('defaultUid', uid);
      }
      this.setData({
        defaultUid: uid,
        userNickname: '碟友' + uid,
        isLoggedIn: false
      });
    }
  },
  
  // 生成随机4位UID
  generateRandomUid() {
    return String(Math.floor(1000 + Math.random() * 9000));
  },
  
  // 点击头像区域，打开编辑弹窗
  onTapUserProfile() {
    this.setData({
      showProfileModal: true,
      tempAvatar: this.data.userAvatar || '',
      tempNickname: this.data.isLoggedIn ? this.data.userNickname : ''
    });
  },
  
  // 关闭头像昵称编辑弹窗
  closeProfileModal() {
    this.setData({
      showProfileModal: false,
      tempAvatar: '',
      tempNickname: ''
    });
  },
  
  // 用户选择头像（从相册选择）
  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl;
    if (avatarUrl) {
      this.setData({
        tempAvatar: avatarUrl
      });
    }
  },
  
  // 昵称输入
  onNicknameInput(e) {
    this.setData({
      tempNickname: e.detail.value
    });
  },
  
  // 昵称输入框失焦（微信会自动填充昵称）
  onNicknameBlur(e) {
    if (e.detail.value) {
      this.setData({
        tempNickname: e.detail.value
      });
    }
  },
  
  // 保存头像和昵称
  saveProfile() {
    const { tempAvatar, tempNickname, defaultUid } = this.data;
    
    // 验证：至少需要设置一项
    if (!tempAvatar && !tempNickname) {
      wx.showToast({
        title: '请设置头像或昵称',
        icon: 'none'
      });
      return;
    }
    
    // 如果没有设置昵称，使用默认昵称
    const finalNickname = tempNickname || ('碟友' + defaultUid);
    
    // 保存到本地存储
    const userInfo = {
      avatarUrl: tempAvatar,
      nickName: finalNickname
    };
    wx.setStorageSync('userInfo', userInfo);
    
    // 更新页面数据
    this.setData({
      userAvatar: tempAvatar,
      userNickname: finalNickname,
      isLoggedIn: !!(tempAvatar || tempNickname),
      showProfileModal: false,
      tempAvatar: '',
      tempNickname: ''
    });
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
  },
  
  // ========== VIP卡片加载 ==========
  
  // 延迟加载VIP卡片（等待分包加载）
  delayLoadVipCard() {
    this.setData({ vipLoadAttempts: 0, vipCardLoaded: false, vipCardError: false });
    setTimeout(() => {
      this.setData({ vipCardLoaded: true });
    }, 1000);
  },
  
  // VIP卡片加载成功
  onVipCardLoad() {
    this.setData({ vipCardError: false });
  },
  
  // VIP卡片加载失败，重试
  onVipCardError() {
    const attempts = this.data.vipLoadAttempts + 1;
    if (attempts < 3) {
      this.setData({ vipLoadAttempts: attempts, vipCardLoaded: false });
      setTimeout(() => {
        this.setData({ vipCardLoaded: true });
      }, 3000);
    } else {
      this.setData({ vipCardError: true });
    }
  },

  // ========== 图标和Logo加载 ==========
  
  // 延迟加载图标和Logo
  delayLoadIcons() {
    this.setData({ 
      refreshIconLoaded: false, 
      refreshIconError: false, 
      refreshIconAttempts: 0,
      logoLoaded: false,
      logoError: false,
      logoAttempts: 0
    });
    setTimeout(() => {
      this.setData({ 
        refreshIconLoaded: true,
        logoLoaded: true
      });
    }, 500);
  },
  
  // 清除缓存图标加载成功
  onRefreshIconLoad() {
    this.setData({ refreshIconError: false });
  },
  
  // 清除缓存图标加载失败，重试
  onRefreshIconError() {
    const attempts = this.data.refreshIconAttempts + 1;
    if (attempts < 3) {
      this.setData({ refreshIconAttempts: attempts, refreshIconLoaded: false });
      setTimeout(() => {
        this.setData({ refreshIconLoaded: true });
      }, 2000);
    } else {
      this.setData({ refreshIconError: true });
    }
  },
  
  // Logo加载成功
  onLogoLoad() {
    this.setData({ logoError: false });
  },
  
  // Logo加载失败，重试
  onLogoError() {
    const attempts = this.data.logoAttempts + 1;
    if (attempts < 3) {
      this.setData({ logoAttempts: attempts, logoLoaded: false });
      setTimeout(() => {
        this.setData({ logoLoaded: true });
      }, 2000);
    } else {
      this.setData({ logoError: true });
    }
  },

  // ========== 颜色设置相关 ==========
  
  // 加载设置
  loadSettings() {
    const savedSettings = wx.getStorageSync('colorSettings') || {};
    const backgroundOpacity = wx.getStorageSync('backgroundOpacity');
    // 确保 backgroundOpacity 是有效数字，否则使用默认值10
    const opacityValue = (typeof backgroundOpacity === 'number' && !isNaN(backgroundOpacity)) 
      ? backgroundOpacity 
      : (backgroundOpacity !== '' && backgroundOpacity !== null && !isNaN(Number(backgroundOpacity))) 
        ? Number(backgroundOpacity) 
        : 10;
    
    this.setData({
      mainTitleColor: savedSettings.mainTitleColor || '#314D63',
      subTitleColor: savedSettings.subTitleColor || '#8FB9AB',
      rightHandColor: savedSettings.rightHandColor || '#F4D096',
      leftHandColor: savedSettings.leftHandColor || '#314D63',
      backgroundOpacity: opacityValue
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

  // 打开新手教程页面
  showUserManual() {
    wx.navigateTo({
      url: '/subpackages/packageB/guide_page/guide',
      fail: () => {
        wx.showToast({
          title: '无法打开新手教程',
          icon: 'none'
        });
      }
    });
  },

  // 关闭用户手册（保留兼容）
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
            // 重新初始化示例曲谱
            libraryManager.initSampleData();
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
