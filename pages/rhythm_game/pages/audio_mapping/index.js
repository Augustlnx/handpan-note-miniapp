/**
 * 音频映射配置页面
 * 功能：配置谱面音符到手碟音频的映射关系
 * 复用notation页面的映射逻辑，以全屏页面形式展示
 */
const app = getApp();

// 默认转换表（数字谱 -> [简谱, SPN]）
const DEFAULT_CONVERSION_TABLE = {
  'D': ['6,', 'D_DYNAMIC'],
  '0': ['0', ''],
  'd': ['d', ''],
  '1': ['3', 'A3'],
  '2': ['4', 'Bb3'],
  '3': ['5', 'C4'],
  '4': ['6', 'D4'],
  '5': ['7', 'E4'],
  '6': ["1'", 'F4'],
  '7': ["2'", 'G4'],
  '8': ["3'", 'A4'],
  '9': ["5'", 'C5'],
  '10': ["6'", 'D5'],
  '11': ["7'", 'E5'],
  's': ['s', ''],
  'P': ['P', ''],
  'H': ['H', ''],
  'T': ['T', ''],
  'F': ['F', ''],
  'B': ['B', ''],
  'O': ['O', ''],
  'x': ['x', ''],
  '·': ['·', ''],
  'K': ['K', ''],
  'M': ['M', '']
};

// SPN音名选项
const SPN_NOTE_OPTIONS = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const SPN_OCTAVE_OPTIONS = ['1', '2', '3', '4', '5', '6'];

Page({
  data: {
    // 谱面数据
    sheetData: null,
    
    // 谱式选择
    notationType: 'digital', // 'digital' 或 'simplified'
    
    // 首调设置
    conversionRootNote: 'F3',
    conversionRootPickerValue: [5, 2], // F3
    showRootPicker: false,
    spnNoteOptions: SPN_NOTE_OPTIONS,
    spnOctaveOptions: SPN_OCTAVE_OPTIONS,
    
    // 转换表
    conversionTable: {},
    conversionMappings: [], // [{key, simplified, spn}]
    
    // 从谱面提取的音符
    extractedNotes: [],
    
    // 过滤后的映射列表（只显示谱面使用的音符）
    filteredMappings: [],
    
    // 编辑状态
    editingIndex: null,
    editingField: null,
    editingValue: '',
    
    // 加载状态
    isLoading: false
  },

  onLoad(options) {
    wx.hideTabBar({ animation: false });
    
    // 获取传递的谱面数据
    const sheetData = app.globalData?.rhythmGameSheet;
    if (!sheetData) {
      wx.showToast({
        title: '未找到谱面数据',
        icon: 'none'
      });
      setTimeout(() => wx.navigateBack(), 1500);
      return;
    }
    
    this.setData({
      sheetData,
      notationType: sheetData.notationType || 'digital'
    });
    
    // 初始化转换表
    this.initConversionTable();
    
    // 提取谱面中使用的音符
    this.extractNotesFromSheet();
  },

  /**
   * 初始化转换表
   */
  initConversionTable() {
    const table = { ...DEFAULT_CONVERSION_TABLE };
    const mappings = [];
    
    for (const [key, value] of Object.entries(table)) {
      mappings.push({
        key,
        simplified: value[0],
        spn: value[1]
      });
    }
    
    this.setData({
      conversionTable: table,
      conversionMappings: mappings
    });
    
    // 初始化时更新过滤列表
    this.updateFilteredMappings();
  },

  /**
   * 更新过滤后的映射列表
   */
  updateFilteredMappings() {
    const { conversionMappings, extractedNotes } = this.data;
    
    let filtered = [];
    
    if (extractedNotes.length > 0) {
      // 有提取的音符时，只显示匹配的
      conversionMappings.forEach((item, index) => {
        if (extractedNotes.includes(item.key)) {
          filtered.push({
            ...item,
            originalIndex: index
          });
        }
      });
    }
    
    // 如果没有匹配到任何音符，显示数字谱常用的音符(1-11)
    if (filtered.length === 0) {
      const commonKeys = ['D', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      conversionMappings.forEach((item, index) => {
        if (commonKeys.includes(item.key)) {
          filtered.push({
            ...item,
            originalIndex: index
          });
        }
      });
    }
    
    this.setData({ filteredMappings: filtered });
  },

  /**
   * 从谱面提取使用的音符
   */
  extractNotesFromSheet() {
    const sheet = this.data.sheetData;
    if (!sheet || !sheet.notations) return;
    
    const notesSet = new Set();
    
    for (const notation of sheet.notations) {
      if (!notation.measures) continue;
      for (const measure of notation.measures) {
        if (!measure.beats) continue;
        for (const beat of measure.beats) {
          if (!beat.subdivisions) continue;
          for (const sub of beat.subdivisions) {
            // 处理右手音符 - 支持数组格式和字符串格式
            const rightHand = sub.rightHand || sub.right || [];
            if (Array.isArray(rightHand)) {
              for (const note of rightHand) {
                if (note && note !== '-' && note !== '') {
                  const baseNote = this.extractBaseNote(note);
                  if (baseNote) notesSet.add(baseNote);
                }
              }
            } else if (rightHand && rightHand !== '-' && rightHand !== '') {
              const baseNote = this.extractBaseNote(rightHand);
              if (baseNote) notesSet.add(baseNote);
            }
            
            // 处理左手音符 - 支持数组格式和字符串格式
            const leftHand = sub.leftHand || sub.left || [];
            if (Array.isArray(leftHand)) {
              for (const note of leftHand) {
                if (note && note !== '-' && note !== '') {
                  const baseNote = this.extractBaseNote(note);
                  if (baseNote) notesSet.add(baseNote);
                }
              }
            } else if (leftHand && leftHand !== '-' && leftHand !== '') {
              const baseNote = this.extractBaseNote(leftHand);
              if (baseNote) notesSet.add(baseNote);
            }
          }
        }
      }
    }
    
    this.setData({
      extractedNotes: Array.from(notesSet).sort()
    });
    
    // 更新过滤后的映射列表
    this.updateFilteredMappings();
  },

  /**
   * 提取基础音符（去除八度标记和修饰符）
   */
  extractBaseNote(note) {
    if (!note) return '';
    // 移除上标 ^{...}
    let cleaned = note.replace(/\^\{[^}]*\}/g, '');
    // 移除八度标记 ' 和 ,
    cleaned = cleaned.replace(/[',_*]/g, '');
    return cleaned;
  },

  /**
   * 切换谱式
   */
  onNotationTypeChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ notationType: type });
  },

  /**
   * 打开首调选择器
   */
  onOpenRootPicker() {
    this.setData({ showRootPicker: true });
  },

  /**
   * 关闭首调选择器
   */
  onCloseRootPicker() {
    this.setData({ showRootPicker: false });
  },

  /**
   * 首调选择器变化
   */
  onRootPickerChange(e) {
    const value = e.detail.value;
    const note = SPN_NOTE_OPTIONS[value[0]];
    const octave = SPN_OCTAVE_OPTIONS[value[1]];
    this.setData({
      conversionRootNote: note + octave,
      conversionRootPickerValue: value
    });
  },

  /**
   * 确认首调选择
   */
  onConfirmRootPicker() {
    this.setData({ showRootPicker: false });
    // 重新计算映射
    this.recalculateMappings();
  },

  /**
   * 重新计算映射
   */
  recalculateMappings() {
    // 根据首调重新计算SPN
    // 这里简化处理，实际应该根据首调偏移计算
    console.log('[AudioMapping] 首调已更新为:', this.data.conversionRootNote);
  },

  /**
   * 开始编辑映射
   */
  onStartEdit(e) {
    const { index, field } = e.currentTarget.dataset;
    const mapping = this.data.conversionMappings[index];
    
    this.setData({
      editingIndex: index,
      editingField: field,
      editingValue: field === 'simplified' ? mapping.simplified : mapping.spn
    });
  },

  /**
   * 编辑输入
   */
  onEditInput(e) {
    this.setData({ editingValue: e.detail.value });
  },

  /**
   * 完成编辑
   */
  onEditBlur() {
    const { editingIndex, editingField, editingValue, conversionMappings } = this.data;
    
    if (editingIndex !== null && editingField) {
      const newMappings = [...conversionMappings];
      if (editingField === 'simplified') {
        newMappings[editingIndex].simplified = editingValue;
      } else {
        newMappings[editingIndex].spn = editingValue;
      }
      
      this.setData({
        conversionMappings: newMappings,
        editingIndex: null,
        editingField: null,
        editingValue: ''
      });
    }
  },

  /**
   * 确认映射配置，进入手碟设置页面
   */
  onConfirm() {
    const { sheetData, notationType, conversionRootNote, conversionMappings } = this.data;
    
    // 构建映射表对象
    const mappingTable = {};
    for (const mapping of conversionMappings) {
      mappingTable[mapping.key] = [mapping.simplified, mapping.spn];
    }
    
    // 更新全局数据
    app.globalData.rhythmGameSheet = {
      ...sheetData,
      notationType,
      conversionRootNote,
      audioMappings: mappingTable
    };
    
    // 导航到手碟设置页面
    wx.navigateTo({
      url: '/pages/rhythm_game/pages/handpan_setup/index'
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 阻止事件冒泡
   */
  stopPropagation() {}
});
