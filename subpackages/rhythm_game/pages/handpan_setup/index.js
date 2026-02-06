/**
 * 手碟设置页面
 * 功能：配置电子手碟布局和常驻按钮映射
 * 复用metronome页面的手碟编辑器逻辑
 */
const app = getApp();
const { webAudioManager } = require('../../../../utils/webAudioManager.js');

// 默认手碟参数
const DEFAULT_HANDPAN_NOTES = [
  { id: 0, note: "D3", cx: 500, cy: 574, rx: 179, ry: 156, angle: -90 },
  { id: 1, note: "A3", cx: 660, cy: 848, rx: 149, ry: 99, angle: 67 },
  { id: 2, note: "Bb3", cx: 340, cy: 848, rx: 149, ry: 99, angle: -67 },
  { id: 3, note: "C4", cx: 855, cy: 633, rx: 127, ry: 98, angle: 19 },
  { id: 4, note: "D4", cx: 145, cy: 633, rx: 127, ry: 98, angle: -19 },
  { id: 5, note: "E4", cx: 864, cy: 367, rx: 113, ry: 89, angle: -23 },
  { id: 6, note: "F4", cx: 136, cy: 367, rx: 113, ry: 89, angle: 23 },
  { id: 7, note: "G4", cx: 710, cy: 175, rx: 103, ry: 78, angle: -55 },
  { id: 8, note: "A4", cx: 290, cy: 175, rx: 103, ry: 78, angle: 55 },
  { id: 9, note: "C5", cx: 500, cy: 100, rx: 85, ry: 92, angle: 180 },
  { id: 10, note: "D5", cx: 400, cy: 325, rx: 99, ry: 84, angle: 50 },
  { id: 11, note: "E5", cx: 600, cy: 325, rx: 99, ry: 84, angle: -50 }
];

// 默认常驻按钮
const DEFAULT_RESIDENT_BUTTONS = [
  { id: 'btn_s', label: 's', spn: 'SLAP', color: '#8FB9AB' },
  { id: 'btn_T', label: 'T', spn: '', color: '#8FB9AB' },
  { id: 'btn_d', label: 'd', spn: '', color: '#8FB9AB' },
  { id: 'btn_P', label: 'P', spn: '', color: '#8FB9AB' },
  { id: 'btn_x', label: 'x', spn: '', color: '#8FB9AB' }
];

// 音名-简谱-数字谱映射
const NOTE_MAPPING = {
  'F3': { jianpu: '1', shuzipu: '12' },
  'G3': { jianpu: '2', shuzipu: '13' },
  'A3': { jianpu: '3', shuzipu: '1' },
  'Bb3': { jianpu: '4', shuzipu: '2' },
  'C4': { jianpu: '5', shuzipu: '3' },
  'D4': { jianpu: '6', shuzipu: '4' },
  'E4': { jianpu: '7', shuzipu: '5' },
  'F4': { jianpu: "1'", shuzipu: '6' },
  'G4': { jianpu: "2'", shuzipu: '7' },
  'A4': { jianpu: "3'", shuzipu: '8' },
  'Bb4': { jianpu: "4'", shuzipu: '14' },
  'C5': { jianpu: "5'", shuzipu: '9' },
  'D5': { jianpu: "6'", shuzipu: '10' },
  'E5': { jianpu: "7'", shuzipu: '11' },
  'D3': { jianpu: 'D', shuzipu: 'D' },
  'E3': { jianpu: '7,', shuzipu: '15' }
};

Page({
  data: {
    // 谱面数据
    sheetData: null,
    
    // 手碟音符
    handpanNotes: [],
    
    // 常驻按钮
    residentButtons: [],
    
    // 编辑常驻按钮
    editingButtonId: null,
    editingButtonLabel: '',
    showButtonEditor: false,
    
    // 显示模式
    displayMode: 'note', // 'note', 'jianpu', 'shuzipu'
    displayModeLabels: { note: '音名', jianpu: '简谱', shuzipu: '数字谱' },
    
    // 音量
    handpanVolume: 80,
    
    // 映射验证
    mappingValid: false,
    missingNotes: [], // 缺少的音符
    
    // 加载状态
    isLoading: false,
    audioLoading: false
  },

  onLoad(options) {
    wx.hideTabBar({ animation: false });
    
    // 获取谱面数据
    const sheetData = app.globalData?.rhythmGameSheet;
    if (!sheetData) {
      wx.showToast({ title: '未找到谱面数据', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    
    this.setData({ sheetData });
    
    // 初始化手碟
    this.initHandpan();
    
    // 初始化常驻按钮
    this.initResidentButtons();
    
    // 预加载音频
    this.preloadAudio();
    
    // 验证映射
    this.validateMapping();
  },

  /**
   * 初始化手碟
   */
  initHandpan() {
    // 尝试从本地存储读取用户保存的手碟配置
    let notes = wx.getStorageSync('handpanNotes');
    if (!notes || notes.length === 0) {
      notes = JSON.parse(JSON.stringify(DEFAULT_HANDPAN_NOTES));
    }
    
    // 为每个音符添加显示信息
    const displayMode = this.data.displayMode;
    notes = notes.map(note => {
      const mapping = NOTE_MAPPING[note.note] || {};
      return {
        ...note,
        displayText: this.getDisplayText(note.note, displayMode),
        jianpu: mapping.jianpu || note.note,
        shuzipu: mapping.shuzipu || note.note,
        renderX: (note.cx - note.rx) / 10,
        renderY: (note.cy - note.ry) / 10,
        renderW: (note.rx * 2) / 10,
        renderH: (note.ry * 2) / 10
      };
    });
    
    this.setData({ handpanNotes: notes });
  },

  /**
   * 初始化常驻按钮
   */
  initResidentButtons() {
    const buttons = JSON.parse(JSON.stringify(DEFAULT_RESIDENT_BUTTONS));
    this.setData({ residentButtons: buttons });
  },

  /**
   * 获取显示文本
   */
  getDisplayText(note, mode) {
    const mapping = NOTE_MAPPING[note];
    if (!mapping) return note;
    
    switch (mode) {
      case 'jianpu': return mapping.jianpu || note;
      case 'shuzipu': return mapping.shuzipu || note;
      default: return note;
    }
  },

  /**
   * 预加载音频
   */
  async preloadAudio() {
    this.setData({ audioLoading: true });
    
    try {
      await webAudioManager.init();
      await webAudioManager.preloadAllAudio(true);
      console.log('[HandpanSetup] 音频预加载完成');
    } catch (e) {
      console.warn('[HandpanSetup] 音频预加载失败:', e);
    }
    
    this.setData({ audioLoading: false });
  },

  /**
   * 验证映射是否完整
   */
  validateMapping() {
    const sheet = this.data.sheetData;
    const handpanNotes = this.data.handpanNotes;
    const residentButtons = this.data.residentButtons;
    
    if (!sheet || !sheet.audioMappings) {
      this.setData({ mappingValid: false, missingNotes: [] });
      return;
    }
    
    // 收集手碟上所有可用的SPN
    const availableSpns = new Set();
    for (const note of handpanNotes) {
      availableSpns.add(note.note);
    }
    for (const btn of residentButtons) {
      if (btn.spn) availableSpns.add(btn.spn);
    }
    
    // 检查映射表中所有需要的SPN是否都存在
    const missingNotes = [];
    for (const [key, value] of Object.entries(sheet.audioMappings)) {
      const spn = value[1];
      if (spn && spn !== '' && spn !== 'D_DYNAMIC' && !availableSpns.has(spn)) {
        missingNotes.push({ key, spn });
      }
    }
    
    this.setData({
      mappingValid: missingNotes.length === 0,
      missingNotes
    });
  },

  /**
   * 切换显示模式
   */
  onToggleDisplayMode() {
    const modes = ['note', 'jianpu', 'shuzipu'];
    const currentIndex = modes.indexOf(this.data.displayMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    
    // 更新所有音符的显示文本
    const notes = this.data.handpanNotes.map(note => ({
      ...note,
      displayText: this.getDisplayText(note.note, nextMode)
    }));
    
    this.setData({
      displayMode: nextMode,
      handpanNotes: notes
    });
  },

  /**
   * 手碟音符触摸开始
   */
  onNoteTouchStart(e) {
    const note = e.currentTarget.dataset.note;
    const id = e.currentTarget.dataset.id;
    
    // 播放音频
    this.playNote(note);
    
    // 视觉反馈
    const notes = this.data.handpanNotes.map(n => ({
      ...n,
      active: n.id === id
    }));
    this.setData({ handpanNotes: notes });
  },

  /**
   * 手碟音符触摸结束
   */
  onNoteTouchEnd(e) {
    const notes = this.data.handpanNotes.map(n => ({
      ...n,
      active: false
    }));
    this.setData({ handpanNotes: notes });
  },

  /**
   * 常驻按钮触摸
   */
  onResidentBtnTouchStart(e) {
    const id = e.currentTarget.dataset.id;
    const btn = this.data.residentButtons.find(b => b.id === id);
    
    if (btn && btn.spn) {
      this.playNote(btn.spn);
    }
    
    // 视觉反馈
    const buttons = this.data.residentButtons.map(b => ({
      ...b,
      active: b.id === id
    }));
    this.setData({ residentButtons: buttons });
  },

  /**
   * 常驻按钮触摸结束
   */
  onResidentBtnTouchEnd() {
    const buttons = this.data.residentButtons.map(b => ({
      ...b,
      active: false
    }));
    this.setData({ residentButtons: buttons });
  },

  /**
   * 长按编辑常驻按钮
   */
  onResidentBtnLongPress(e) {
    const id = e.currentTarget.dataset.id;
    const btn = this.data.residentButtons.find(b => b.id === id);
    
    if (btn) {
      this.setData({
        editingButtonId: id,
        editingButtonLabel: btn.label,
        showButtonEditor: true
      });
    }
  },

  /**
   * 编辑按钮标签输入
   */
  onButtonLabelInput(e) {
    this.setData({ editingButtonLabel: e.detail.value });
  },

  /**
   * 确认编辑按钮
   */
  onConfirmButtonEdit() {
    const { editingButtonId, editingButtonLabel, residentButtons } = this.data;
    
    const newButtons = residentButtons.map(btn => {
      if (btn.id === editingButtonId) {
        return { ...btn, label: editingButtonLabel || btn.label };
      }
      return btn;
    });
    
    this.setData({
      residentButtons: newButtons,
      showButtonEditor: false,
      editingButtonId: null
    });
    
    this.validateMapping();
  },

  /**
   * 取消编辑按钮
   */
  onCancelButtonEdit() {
    this.setData({
      showButtonEditor: false,
      editingButtonId: null
    });
  },

  /**
   * 播放音符
   */
  playNote(note) {
    try {
      webAudioManager.playNote(note, this.data.handpanVolume / 100);
    } catch (e) {
      console.warn('[HandpanSetup] 播放音符失败:', e);
    }
  },

  /**
   * 音量变化
   */
  onVolumeChange(e) {
    this.setData({ handpanVolume: e.detail.value });
  },

  /**
   * 开始演奏
   */
  onStartPlay() {
    if (!this.data.mappingValid) {
      wx.showModal({
        title: '映射不完整',
        content: `以下音符在手碟上找不到对应按键：${this.data.missingNotes.map(n => n.key + '(' + n.spn + ')').join(', ')}`,
        showCancel: false
      });
      return;
    }
    
    // 保存配置到全局
    app.globalData.rhythmGameSheet = {
      ...this.data.sheetData,
      handpanNotes: this.data.handpanNotes,
      residentButtons: this.data.residentButtons,
      displayMode: this.data.displayMode,
      handpanVolume: this.data.handpanVolume
    };
    
    // 跳转到游戏页面
    wx.navigateTo({
      url: '/subpackages/rhythm_game/pages/gameplay/index'
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  stopPropagation() {}
});
