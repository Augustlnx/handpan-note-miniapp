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

// 可用的手碟音频文件列表
const HANDPAN_AUDIO_FILES = [
  'A3', 'A4', 'A5', 'Bb3', 'Bb5', 'C4', 'C5', 'C6', 
  'D3', 'D4', 'D5', 'E3', 'E4', 'E5', 'F3', 'F4', 'F5', 
  'G3', 'G4', 'G5', 'SLAP'
];

// 预设参数库 - 与metronome共享存储
const PRESET_HANDPAN_PARAMS = [
  {
    id: 'preset-d-kurd-12',
    name: 'D-Kurd 12音（默认）',
    timestamp: Date.now(),
    isPreset: true,
    notes: DEFAULT_HANDPAN_NOTES
  }
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
    audioLoading: false,
    
    // ========== 编辑器相关 ==========
    handpanEditorVisible: false,
    editorNotes: [],
    editorSelectedId: null,
    editorSelectedNote: null,
    editorSecondSelectedId: null,
    editorSecondNote: null,
    editorHistory: [],
    
    // 参数库
    handpanParamsLibrary: [],
    currentHandpanParamsId: 'default',
    handpanParamsLibraryVisible: false,
    handpanSaveParamsVisible: false,
    handpanSaveParamsName: '',
    
    // 导入
    handpanImportVisible: false,
    handpanImportJson: '',
    handpanImportError: '',
    
    // 帮助
    helpVisible: false,
    helpTitle: '',
    helpContent: ''
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
    
    // 加载参数库
    this.loadHandpanParamsLibrary();
    
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
      // 预加载节拍器音频
      await webAudioManager.preloadAllAudio(true);
      
      // 收集手碟需要的音符
      const notesNeeded = this.collectHandpanNotes();
      // 预加载手碟音频
      await webAudioManager.preloadHandpanAudio(notesNeeded);
      
      console.log('[HandpanSetup] 音频预加载完成');
    } catch (e) {
      console.warn('[HandpanSetup] 音频预加载失败:', e);
    }
    
    this.setData({ audioLoading: false });
  },

  /**
   * 收集手碟需要的音符
   */
  collectHandpanNotes() {
    const notesSet = new Set(['SLAP']);
    
    // 收集手碟上的所有音符
    const handpanNotes = this.data.handpanNotes || DEFAULT_HANDPAN_NOTES;
    for (const note of handpanNotes) {
      if (note.note) {
        notesSet.add(note.note);
      }
    }
    
    // 收集常驻按钮音符
    const residentButtons = this.data.residentButtons || DEFAULT_RESIDENT_BUTTONS;
    for (const btn of residentButtons) {
      if (btn.spn) {
        notesSet.add(btn.spn);
      }
    }
    
    return Array.from(notesSet);
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
      url: '/pages/rhythm_game/pages/gameplay/index'
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  stopPropagation() {},

  // ========== 电子手碟编辑器 ==========

  /**
   * 将音符数据转换为渲染数据（与metronome一致）
   */
  convertNotesToRenderData(notes) {
    return notes.map(note => {
      const mapping = NOTE_MAPPING[note.note] || {};
      const jianpu = note.jianpu || mapping.jianpu || note.note;
      const shuzipu = note.shuzipu || mapping.shuzipu || note.note;
      
      return {
        ...note,
        jianpu,
        shuzipu,
        active: false,
        displayText: note.note,
        displayDotsUp: 0,
        displayDotsDown: 0,
        renderX: ((note.cx - note.rx) / 1000) * 100,
        renderY: ((note.cy - note.ry) / 1000) * 100,
        renderW: (note.rx * 2 / 1000) * 100,
        renderH: (note.ry * 2 / 1000) * 100
      };
    });
  },

  /**
   * 打开编辑器
   */
  onOpenHandpanEditor() {
    const editorNotes = this.convertNotesToRenderData(
      this.data.handpanNotes.length > 0 
        ? JSON.parse(JSON.stringify(this.data.handpanNotes))
        : JSON.parse(JSON.stringify(DEFAULT_HANDPAN_NOTES))
    );
    
    this.setData({
      handpanEditorVisible: true,
      editorNotes,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null,
      editorHistory: [JSON.stringify(editorNotes)]
    });
  },

  /**
   * 关闭编辑器
   */
  onCloseHandpanEditor() {
    this.setData({ 
      handpanEditorVisible: false,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  /**
   * 点击画布背景取消选中
   */
  onEditorBackgroundTap() {
    this.setData({
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  /**
   * 编辑器音符触摸开始
   */
  onEditorNoteTouchStart(e) {
    const noteId = e.currentTarget.dataset.id;
    const note = this.data.editorNotes.find(n => n.id === noteId);
    
    if (!note) return;
    
    // 如果点击的是第二个选中的音符，取消第二个选中
    if (this.data.editorSecondSelectedId === noteId) {
      this.setData({ editorSecondSelectedId: null, editorSecondNote: null });
      return;
    }
    
    // 如果点击的是第一个选中的音符
    if (this.data.editorSelectedId === noteId) {
      if (this.data.editorSecondSelectedId !== null) {
        const newFirst = this.data.editorNotes.find(n => n.id === this.data.editorSecondSelectedId);
        this.setData({
          editorSelectedId: this.data.editorSecondSelectedId,
          editorSelectedNote: newFirst ? { ...newFirst } : null,
          editorSecondSelectedId: null,
          editorSecondNote: null
        });
      } else {
        this.setData({ editorSelectedId: null, editorSelectedNote: null });
      }
      return;
    }
    
    // 如果已有第一个选中，进入双选模式
    if (this.data.editorSelectedId !== null) {
      this.setData({ editorSecondSelectedId: noteId, editorSecondNote: { ...note } });
      return;
    }
    
    // 单选模式
    this.setData({
      editorSelectedId: noteId,
      editorSelectedNote: { ...note },
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
    
    this.editorTouchStartX = e.touches[0].clientX;
    this.editorTouchStartY = e.touches[0].clientY;
    this.editorNoteStartCx = note.cx;
    this.editorNoteStartCy = note.cy;
  },

  /**
   * 编辑器音符拖动
   */
  onEditorNoteTouchMove(e) {
    if (this.data.editorSelectedId === null) return;
    
    const touch = e.touches[0];
    const dx = touch.clientX - this.editorTouchStartX;
    const dy = touch.clientY - this.editorTouchStartY;
    
    const query = wx.createSelectorQuery();
    query.select('.he-canvas-bg-fullscreen').boundingClientRect();
    query.exec((res) => {
      if (res[0]) {
        const canvasSize = res[0].width;
        const scale = 1000 / canvasSize;
        
        const newCx = Math.round(Math.max(50, Math.min(950, this.editorNoteStartCx + dx * scale)));
        const newCy = Math.round(Math.max(50, Math.min(950, this.editorNoteStartCy + dy * scale)));
        
        this.updateEditorNote({ cx: newCx, cy: newCy });
      }
    });
  },

  /**
   * 编辑器音符触摸结束
   */
  onEditorNoteTouchEnd() {
    this.saveEditorHistory();
  },

  /**
   * 清除第二个选中
   */
  onClearSecondSelection() {
    this.setData({ editorSecondSelectedId: null, editorSecondNote: null });
  },

  /**
   * 交换双选基准位置
   */
  onSwapBaseNote() {
    if (this.data.editorSelectedId === null || this.data.editorSecondSelectedId === null) return;
    
    this.setData({
      editorSelectedId: this.data.editorSecondSelectedId,
      editorSecondSelectedId: this.data.editorSelectedId,
      editorSelectedNote: this.data.editorSecondNote,
      editorSecondNote: this.data.editorSelectedNote
    });
  },

  /**
   * 更新编辑器中的音符
   */
  updateEditorNote(updates) {
    const selectedId = this.data.editorSelectedId;
    if (selectedId === null) return;
    
    const editorNotes = this.data.editorNotes.map(n => {
      if (n.id === selectedId) {
        const updated = { ...n, ...updates };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const selectedNote = editorNotes.find(n => n.id === selectedId);
    this.setData({ editorNotes, editorSelectedNote: selectedNote ? { ...selectedNote } : null });
  },

  /**
   * 属性面板滑块变化
   */
  onEditorPropChange(e) {
    const prop = e.currentTarget.dataset.prop;
    const value = parseInt(e.detail.value);
    this.updateEditorNote({ [prop]: value });
  },

  /**
   * 属性面板数值输入框变化
   */
  onEditorValueInput(e) {
    const prop = e.currentTarget.dataset.prop;
    const value = parseInt(e.detail.value);
    if (!isNaN(value)) {
      this.updateEditorNote({ [prop]: value });
    }
  },

  /**
   * 属性面板数值输入框失焦
   */
  onEditorValueBlur(e) {
    const prop = e.currentTarget.dataset.prop;
    let value = parseInt(e.detail.value);
    
    if (isNaN(value)) {
      const currentNote = this.data.editorNotes.find(n => n.id === this.data.editorSelectedId);
      if (currentNote) value = currentNote[prop];
      else return;
    }
    
    if (prop === 'cx' || prop === 'cy') {
      value = Math.max(50, Math.min(950, value));
    } else if (prop === 'rx' || prop === 'ry') {
      value = Math.max(20, Math.min(200, value));
    } else if (prop === 'angle') {
      value = Math.max(-180, Math.min(180, value));
    }
    
    this.updateEditorNote({ [prop]: value });
    this.saveEditorHistory();
  },

  /**
   * 音符名称变化
   */
  onEditorNoteNameChange(e) {
    const value = e.detail.value.trim().toUpperCase();
    const mapping = NOTE_MAPPING[value];
    const updates = { note: value };
    if (mapping) {
      updates.jianpu = mapping.jianpu;
      updates.shuzipu = mapping.shuzipu;
    }
    this.updateEditorNote(updates);
    this.saveEditorHistory();
  },

  /**
   * 简谱名称变化
   */
  onEditorJianpuChange(e) {
    this.updateEditorNote({ jianpu: e.detail.value.trim() });
    this.saveEditorHistory();
  },

  /**
   * 数字谱名称变化
   */
  onEditorShuzipuChange(e) {
    this.updateEditorNote({ shuzipu: e.detail.value.trim() });
    this.saveEditorHistory();
  },

  /**
   * 添加音符
   */
  onEditorAddNote() {
    const maxId = Math.max(...this.data.editorNotes.map(n => n.id), -1);
    const newNote = {
      id: maxId + 1,
      note: 'New',
      cx: 500,
      cy: 500,
      rx: 60,
      ry: 50,
      angle: 0,
      active: false,
      renderX: 44,
      renderY: 45,
      renderW: 12,
      renderH: 10
    };
    
    const editorNotes = [...this.data.editorNotes, newNote];
    this.setData({
      editorNotes,
      editorSelectedId: newNote.id,
      editorSelectedNote: { ...newNote }
    });
    this.saveEditorHistory();
  },

  /**
   * 恢复选中音符为默认参数
   */
  onEditorResetNote() {
    const selectedId = this.data.editorSelectedId;
    if (selectedId === null) return;
    
    const defaultNote = DEFAULT_HANDPAN_NOTES.find(n => n.id === selectedId);
    if (!defaultNote) {
      wx.showToast({ title: '无默认参数', icon: 'none' });
      return;
    }
    
    const editorNotes = this.data.editorNotes.map(n => {
      if (n.id === selectedId) {
        const restored = { ...defaultNote };
        restored.renderX = ((restored.cx - restored.rx) / 1000) * 100;
        restored.renderY = ((restored.cy - restored.ry) / 1000) * 100;
        restored.renderW = (restored.rx * 2 / 1000) * 100;
        restored.renderH = (restored.ry * 2 / 1000) * 100;
        return restored;
      }
      return n;
    });
    
    const selectedNote = editorNotes.find(n => n.id === selectedId);
    this.setData({ editorNotes, editorSelectedNote: selectedNote ? { ...selectedNote } : null });
    this.saveEditorHistory();
    wx.showToast({ title: '已恢复默认', icon: 'success' });
  },

  /**
   * 删除选中音符
   */
  onEditorDeleteNote() {
    const selectedId = this.data.editorSelectedId;
    if (selectedId === null) return;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个音符吗？',
      success: (res) => {
        if (res.confirm) {
          const editorNotes = this.data.editorNotes.filter(n => n.id !== selectedId);
          this.setData({
            editorNotes,
            editorSelectedId: null,
            editorSelectedNote: null,
            editorSecondSelectedId: null,
            editorSecondNote: null
          });
          this.saveEditorHistory();
        }
      }
    });
  },

  /**
   * 保存编辑历史
   */
  saveEditorHistory() {
    const history = [...this.data.editorHistory];
    const currentState = JSON.stringify(this.data.editorNotes);
    
    if (history[history.length - 1] !== currentState) {
      history.push(currentState);
      if (history.length > 20) history.shift();
      this.setData({ editorHistory: history });
    }
  },

  /**
   * 撤销
   */
  onUndoHandpanEdit() {
    const history = [...this.data.editorHistory];
    if (history.length <= 1) {
      wx.showToast({ title: '没有可撤销的操作', icon: 'none' });
      return;
    }
    
    history.pop();
    const prevState = JSON.parse(history[history.length - 1]);
    
    this.setData({
      editorNotes: prevState,
      editorHistory: history,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorSecondSelectedId: null,
      editorSecondNote: null
    });
  },

  // ========== 双选对齐功能 ==========

  /**
   * 水平对称
   */
  onAlignHorizontalSymmetry() {
    const { editorSelectedNote, editorSecondNote, editorNotes } = this.data;
    if (!editorSelectedNote || !editorSecondNote) return;
    
    const baseNote = editorSelectedNote;
    const targetId = this.data.editorSecondSelectedId;
    
    const mirrorCx = 1000 - baseNote.cx;
    const mirrorAngle = -baseNote.angle;
    
    const updatedNotes = editorNotes.map(n => {
      if (n.id === targetId) {
        const updated = { ...n, cx: mirrorCx, angle: mirrorAngle };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const updatedSecondNote = updatedNotes.find(n => n.id === targetId);
    this.setData({ editorNotes: updatedNotes, editorSecondNote: updatedSecondNote ? { ...updatedSecondNote } : null });
    this.saveEditorHistory();
    wx.showToast({ title: '已水平对称', icon: 'success' });
  },

  /**
   * 垂直齐平
   */
  onAlignVerticalFlat() {
    const { editorSelectedNote, editorSecondNote, editorNotes } = this.data;
    if (!editorSelectedNote || !editorSecondNote) return;
    
    const baseNote = editorSelectedNote;
    const targetId = this.data.editorSecondSelectedId;
    
    const updatedNotes = editorNotes.map(n => {
      if (n.id === targetId) {
        const updated = { ...n, cy: baseNote.cy };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const updatedSecondNote = updatedNotes.find(n => n.id === targetId);
    this.setData({ editorNotes: updatedNotes, editorSecondNote: updatedSecondNote ? { ...updatedSecondNote } : null });
    this.saveEditorHistory();
    wx.showToast({ title: '已垂直齐平', icon: 'success' });
  },

  /**
   * 对齐大小
   */
  onAlignMatchSize() {
    const { editorSelectedNote, editorSecondNote, editorNotes } = this.data;
    if (!editorSelectedNote || !editorSecondNote) return;
    
    const baseNote = editorSelectedNote;
    const targetId = this.data.editorSecondSelectedId;
    
    const updatedNotes = editorNotes.map(n => {
      if (n.id === targetId) {
        const updated = { ...n, rx: baseNote.rx, ry: baseNote.ry };
        updated.renderX = ((updated.cx - updated.rx) / 1000) * 100;
        updated.renderY = ((updated.cy - updated.ry) / 1000) * 100;
        updated.renderW = (updated.rx * 2 / 1000) * 100;
        updated.renderH = (updated.ry * 2 / 1000) * 100;
        return updated;
      }
      return n;
    });
    
    const updatedSecondNote = updatedNotes.find(n => n.id === targetId);
    this.setData({ editorNotes: updatedNotes, editorSecondNote: updatedSecondNote ? { ...updatedSecondNote } : null });
    this.saveEditorHistory();
    wx.showToast({ title: '已对齐大小', icon: 'success' });
  },

  /**
   * 复制位置JSON
   */
  onCopyPositionJSON() {
    const notesData = this.data.editorNotes.map(n => ({
      id: n.id,
      note: n.note,
      cx: n.cx,
      cy: n.cy,
      rx: n.rx,
      ry: n.ry,
      angle: n.angle
    }));
    
    const jsonStr = JSON.stringify(notesData, null, 2);
    
    wx.setClipboardData({
      data: jsonStr,
      success: () => wx.showToast({ title: '已复制到剪贴板', icon: 'success' })
    });
  },

  /**
   * 重置参数
   */
  onResetHandpanParams() {
    wx.showModal({
      title: '重置参数',
      content: '确定要恢复默认参数吗？',
      success: (res) => {
        if (res.confirm) {
          const editorNotes = this.convertNotesToRenderData(DEFAULT_HANDPAN_NOTES);
          this.setData({
            editorNotes,
            editorSelectedId: null,
            editorSelectedNote: null,
            editorSecondSelectedId: null,
            editorSecondNote: null,
            editorHistory: [JSON.stringify(editorNotes)]
          });
        }
      }
    });
  },

  /**
   * 应用编辑
   */
  onApplyHandpanEditor() {
    const displayMode = this.data.displayMode;
    const handpanNotes = this.data.editorNotes.map(n => ({
      ...n,
      active: false,
      displayText: this.getDisplayText(n.note, displayMode)
    }));
    
    this.setData({
      handpanNotes,
      handpanEditorVisible: false
    });
    
    // 保存到本地存储（与metronome共享）
    wx.setStorageSync('handpanNotes', handpanNotes);
    
    // 重新验证映射
    this.validateMapping();
    
    wx.showToast({ title: '应用成功', icon: 'success' });
  },

  // ========== 参数库 ==========

  /**
   * 加载参数库（与metronome共享存储）
   */
  loadHandpanParamsLibrary() {
    try {
      const userLibrary = wx.getStorageSync('handpanParamsLibrary') || [];
      const library = [...PRESET_HANDPAN_PARAMS, ...userLibrary];
      this.setData({ handpanParamsLibrary: library });
    } catch (e) {
      console.error('[HandpanSetup] 加载参数库失败:', e);
      this.setData({ handpanParamsLibrary: PRESET_HANDPAN_PARAMS });
    }
  },

  /**
   * 保存参数库
   */
  saveHandpanParamsLibrary() {
    try {
      const userLibrary = this.data.handpanParamsLibrary.filter(p => !p.isPreset);
      wx.setStorageSync('handpanParamsLibrary', userLibrary);
    } catch (e) {
      console.error('[HandpanSetup] 保存参数库失败:', e);
    }
  },

  /**
   * 打开参数库弹窗
   */
  onOpenHandpanParamsLibrary() {
    this.setData({ handpanParamsLibraryVisible: true });
  },

  /**
   * 关闭参数库弹窗
   */
  onCloseHandpanParamsLibrary() {
    this.setData({ handpanParamsLibraryVisible: false });
  },

  /**
   * 选择参数
   */
  onSelectHandpanParams(e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ currentHandpanParamsId: id });
  },

  /**
   * 应用选中的参数
   */
  onApplySelectedHandpanParams() {
    const id = this.data.currentHandpanParamsId;
    let notes;
    
    if (id === 'default') {
      notes = DEFAULT_HANDPAN_NOTES;
    } else {
      const params = this.data.handpanParamsLibrary.find(p => p.id === id);
      if (!params) {
        wx.showToast({ title: '参数不存在', icon: 'none' });
        return;
      }
      notes = params.notes;
    }
    
    const editorNotes = this.convertNotesToRenderData(notes);
    this.setData({
      editorNotes,
      editorSelectedId: null,
      editorSelectedNote: null,
      editorHistory: [JSON.stringify(editorNotes)],
      handpanParamsLibraryVisible: false
    });
    
    wx.showToast({ title: '参数已加载', icon: 'success' });
  },

  /**
   * 删除参数
   */
  onDeleteHandpanParams(e) {
    const id = e.currentTarget.dataset.id;
    const params = this.data.handpanParamsLibrary.find(p => p.id === id);
    
    if (params && params.isPreset) {
      wx.showToast({ title: '预设参数不能删除', icon: 'none', duration: 2000 });
      return;
    }
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个参数吗？',
      success: (res) => {
        if (res.confirm) {
          const library = this.data.handpanParamsLibrary.filter(p => p.id !== id);
          this.setData({ handpanParamsLibrary: library });
          this.saveHandpanParamsLibrary();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  /**
   * 打开保存参数弹窗
   */
  onSaveHandpanParams() {
    this.setData({ handpanSaveParamsVisible: true, handpanSaveParamsName: '' });
  },

  /**
   * 关闭保存参数弹窗
   */
  onCloseHandpanSaveParams() {
    this.setData({ handpanSaveParamsVisible: false });
  },

  /**
   * 参数名称输入
   */
  onHandpanSaveParamsNameInput(e) {
    this.setData({ handpanSaveParamsName: e.detail.value });
  },

  /**
   * 确认保存参数
   */
  onConfirmSaveHandpanParams() {
    const name = this.data.handpanSaveParamsName.trim();
    if (!name) {
      wx.showToast({ title: '请输入参数名称', icon: 'none' });
      return;
    }
    
    const notes = this.data.editorNotes.map(n => ({
      id: n.id,
      note: n.note,
      jianpu: n.jianpu || '',
      shuzipu: n.shuzipu || '',
      cx: n.cx,
      cy: n.cy,
      rx: n.rx,
      ry: n.ry,
      angle: n.angle
    }));
    
    const newParams = {
      id: Date.now().toString(),
      name,
      notes,
      noteCount: notes.length,
      createTime: Date.now()
    };
    
    const library = [...this.data.handpanParamsLibrary, newParams];
    this.setData({ handpanParamsLibrary: library, handpanSaveParamsVisible: false });
    this.saveHandpanParamsLibrary();
    
    wx.showToast({ title: '保存成功', icon: 'success' });
  },

  // ========== 导入参数 ==========

  /**
   * 打开导入弹窗
   */
  onImportHandpanParams() {
    this.setData({ handpanImportVisible: true, handpanImportJson: '', handpanImportError: '' });
  },

  /**
   * 关闭导入弹窗
   */
  onCloseHandpanImport() {
    this.setData({ handpanImportVisible: false });
  },

  /**
   * 导入JSON输入
   */
  onHandpanImportJsonInput(e) {
    this.setData({ handpanImportJson: e.detail.value, handpanImportError: '' });
  },

  /**
   * 确认导入
   */
  onConfirmHandpanImport() {
    const jsonStr = this.data.handpanImportJson.trim();
    if (!jsonStr) {
      this.setData({ handpanImportError: '请输入JSON数据' });
      return;
    }
    
    try {
      const notes = JSON.parse(jsonStr);
      
      if (!Array.isArray(notes)) throw new Error('数据必须是数组格式');
      if (notes.length === 0) throw new Error('数组不能为空');
      
      notes.forEach((note, index) => {
        if (typeof note.cx !== 'number' || typeof note.cy !== 'number') {
          throw new Error(`第${index + 1}个音符缺少cx或cy字段`);
        }
        if (typeof note.rx !== 'number' || typeof note.ry !== 'number') {
          throw new Error(`第${index + 1}个音符缺少rx或ry字段`);
        }
      });
      
      const editorNotes = this.convertNotesToRenderData(notes);
      this.setData({
        editorNotes,
        editorSelectedId: null,
        editorSelectedNote: null,
        editorHistory: [JSON.stringify(editorNotes)],
        handpanImportVisible: false
      });
      
      wx.showToast({ title: '导入成功', icon: 'success' });
    } catch (e) {
      this.setData({ handpanImportError: '解析失败: ' + e.message });
    }
  },

  // ========== 帮助 ==========

  onCloseHelp() {
    this.setData({ helpVisible: false });
  },

  onInputFocus() {},
  onInputBlur() {}
});
