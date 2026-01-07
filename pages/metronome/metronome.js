Page({
  data: {
    tempo: 120,
    beatsOptions: ['1', '2', '3', '4', '5', '6', '7', '8'],
    beatsIndex: 3, // 默认 4
    noteValueOptions: ['2', '4', '8', '16'],
    noteValueIndex: 1, // 默认 4
    beats: [1, 2, 3, 4],
    currentBeat: -1,
    isPlaying: false,
    volume: 80,
    timer: null,
    audioContext: null
  },

  onLoad() {
    // 创建音频上下文
    this.audioContext = wx.createInnerAudioContext();
    this.ensureMetronomeAudio();
    this.loadSettings();
    this.updateBeats();
  },

  onUnload() {
    this.stopMetronome();
    if (this.audioContext) {
      this.audioContext.destroy();
    }
    this.saveSettings();
    this.destroyMetronomeAudio();
  },

  // 加载设置
  loadSettings() {
    const settings = wx.getStorageSync('metronomeSettings') || {};
    if (settings.tempo) {
      this.setData({ tempo: settings.tempo });
    }
    if (settings.beatsIndex !== undefined) {
      this.setData({ beatsIndex: settings.beatsIndex });
    }
  },

  // 保存设置
  saveSettings() {
    const beatCount = parseInt(this.data.beatsOptions[this.data.beatsIndex]);
    wx.setStorageSync('metronomeSettings', {
      tempo: this.data.tempo,
      beatsIndex: this.data.beatsIndex,
      beatsCount: beatCount
    });
  },

  // 增加速度
  increaseTempo() {
    let tempo = this.data.tempo + 5;
    if (tempo > 300) tempo = 300;
    this.setData({ tempo });
    this.saveSettings();
    if (this.data.isPlaying) {
      this.restartMetronome();
    }
  },

  // 减少速度
  decreaseTempo() {
    let tempo = this.data.tempo - 5;
    if (tempo < 20) tempo = 20;
    this.setData({ tempo });
    this.saveSettings();
    if (this.data.isPlaying) {
      this.restartMetronome();
    }
  },

  // 速度输入（结束时验证）
  onTempoBlur(e) {
    let tempo = parseInt(e.detail.value) || 120;
    // 范围检查在失焦时执行
    if (tempo > 300) {
      tempo = 300;
      wx.showToast({
        title: '最大BPM为300',
        icon: 'none'
      });
    }
    if (tempo < 20) {
      tempo = 20;
      wx.showToast({
        title: '最小BPM为20',
        icon: 'none'
      });
    }
    this.setData({ tempo });
    this.saveSettings();
    if (this.data.isPlaying) {
      this.restartMetronome();
    }
  },

  // 拍数改变
  onBeatsChange(e) {
    this.setData({ beatsIndex: e.detail.value });
    this.updateBeats();
    this.saveSettings();
    if (this.data.isPlaying) {
      this.restartMetronome();
    }
  },

  // 拍值改变
  onNoteValueChange(e) {
    this.setData({ noteValueIndex: e.detail.value });
  },

  // 更新拍数显示
  updateBeats() {
    const beatCount = parseInt(this.data.beatsOptions[this.data.beatsIndex]);
    const beats = Array.from({ length: beatCount }, (_, i) => i + 1);
    this.setData({ beats, currentBeat: -1 });
  },

  // 音量改变
  onVolumeChange(e) {
    const volume = e.detail.value;
    this.setData({ volume });
    if (this.audioContext) {
      this.audioContext.volume = volume / 100;
    }
  },

  // 切换节拍器
  toggleMetronome() {
    if (this.data.isPlaying) {
      this.stopMetronome();
    } else {
      this.startMetronome();
    }
  },

  // 开始节拍器
  startMetronome() {
    this.ensureMetronomeAudio();
    this.setData({ isPlaying: true, currentBeat: 0 });
    const interval = 60000 / this.data.tempo; // 毫秒

    this.playTick(true); // 播放第一拍（强拍）

    this.timer = setInterval(() => {
      let nextBeat = (this.data.currentBeat + 1) % this.data.beats.length;
      this.setData({ currentBeat: nextBeat });
      this.playTick(nextBeat === 0); // 第一拍是强拍
    }, interval);
  },

  // 停止节拍器
  stopMetronome() {
    this.setData({ isPlaying: false, currentBeat: -1 });
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },

  // 重启节拍器
  restartMetronome() {
    this.stopMetronome();
    this.startMetronome();
  },

  // 播放节拍音
  playTick(isAccent) {
    this.ensureMetronomeAudio();
    const ctx = isAccent ? this.highAudioCtx : this.lowAudioCtx;
    try {
      ctx.stop();
      if (ctx.seek) ctx.seek(0);
    } catch (err) {}
    ctx.play();

    if (isAccent) {
      wx.vibrateShort({ type: 'heavy' });
    } else {
      wx.vibrateShort({ type: 'light' });
    }
  },

  // 确保节拍器音频已初始化
  ensureMetronomeAudio() {
    if (!this.highAudioCtx) {
      const ctxHigh = wx.createInnerAudioContext();
      ctxHigh.src = '/assets/metronome/soundhigh.wav';
      ctxHigh.volume = 0.85;
      this.highAudioCtx = ctxHigh;
    }
    if (!this.lowAudioCtx) {
      const ctxLow = wx.createInnerAudioContext();
      ctxLow.src = '/assets/metronome/soundlow.wav';
      // 提升响度 1.2 倍，最高不超过 1.0
      ctxLow.volume = Math.min(1, 0.85 * 1.2);
      this.lowAudioCtx = ctxLow;
    }
  },

  // 销毁节拍器音频
  destroyMetronomeAudio() {
    if (this.highAudioCtx) {
      this.highAudioCtx.destroy();
      this.highAudioCtx = null;
    }
    if (this.lowAudioCtx) {
      this.lowAudioCtx.destroy();
      this.lowAudioCtx = null;
    }
  },

  // ========== 分享功能 ==========

  // 分享给好友
  onShareAppMessage() {
    return {
      title: 'Handpan Note 节拍器 - 精准的练习工具',
      path: '/pages/metronome/metronome'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: 'Handpan Note 节拍器 - 精准的练习工具'
    };
  }
})
