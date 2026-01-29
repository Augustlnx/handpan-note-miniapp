// subpackages/audio2/placeholder/index.js
// 音频分包加载页面 - 低音区音频
// 【优化】添加加载状态反馈和自动返回逻辑

const app = getApp();

Page({
  data: {
    loadingText: '正在加载低音区音频...',
    subpackageName: 'audio2',
    audioRange: '低音区 (A2-G2)',
    loadingProgress: 0,
    isLoaded: false
  },

  onLoad(options) {
    console.log('[Audio2 Loader] 分包页面已加载，开始初始化');
    
    // 分包页面加载成功，说明分包已下载完成
    // 通知主包分包已就绪
    this.notifySubpackageReady();
    
    // 更新加载状态
    this.setData({ 
      loadingProgress: 100,
      isLoaded: true,
      loadingText: '低音区音频加载完成！'
    });
  },

  onReady() {
    // 【优化】页面渲染完成后，如果已加载成功，立即返回
    // 不再等待固定时间，由主包的检查逻辑控制返回
    if (this.data.isLoaded) {
      // 短暂显示成功状态后返回
      setTimeout(() => {
        this.navigateBack();
      }, 300);
    }
  },

  /**
   * 通知主包分包已就绪
   */
  notifySubpackageReady() {
    // 方法1: 通过全局事件通知（主要方式）
    if (app && app.globalData) {
      app.globalData.loadedAudioSubpackages = app.globalData.loadedAudioSubpackages || new Set();
      app.globalData.loadedAudioSubpackages.add(this.data.subpackageName);
      console.log(`[Audio2 Loader] 已添加到全局状态: ${this.data.subpackageName}`);
    }

    // 方法2: 通过事件通道通知（如果有）
    try {
      const eventChannel = this.getOpenerEventChannel();
      if (eventChannel && eventChannel.emit) {
        eventChannel.emit('subpackageLoaded', {
          subpackageName: this.data.subpackageName,
          success: true
        });
        console.log(`[Audio2 Loader] 已通过事件通道通知: ${this.data.subpackageName}`);
      }
    } catch (e) {
      console.warn('[Audio2 Loader] 事件通道通知失败:', e);
    }

    console.log(`[Audio2 Loader] 分包 ${this.data.subpackageName} 已就绪`);
  },

  /**
   * 返回上一页
   */
  navigateBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) {
      wx.navigateBack({
        delta: 1,
        fail: () => {
          console.warn('[Audio2 Loader] navigateBack 失败，尝试 switchTab');
          // 如果返回失败，尝试切换到主页
          wx.switchTab({
            url: '/pages/notation/notation'
          });
        }
      });
    } else {
      // 如果是直接打开的，切换到主页
      wx.switchTab({
        url: '/pages/notation/notation'
      });
    }
  },

  onUnload() {
    console.log('[Audio2 Loader] 分包页面已卸载');
  }
});
