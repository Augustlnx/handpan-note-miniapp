/**
 * Canvas2D 谱面渲染器
 * 用于在collapsed模式下高性能渲染谱面，替代多层View嵌套
 * 
 * 设计要点：
 * 1. DPR适配 - 支持高清屏幕渲染
 * 2. 坐标映射 - 支持点击位置到音符索引的映射
 * 3. 脏矩形刷新 - 支持局部重绘
 * 4. 严格复刻View布局 - 保持与原View渲染一致的视觉效果
 * 5. 同层渲染 - 使用 type="2d" 实现Canvas与View同层
 */

// 导入配置参数
const {
  BASE_SETTINGS,
  LAYOUT_SETTINGS,
  LINE_SETTINGS,
  FONT_SETTINGS,
  OCTAVE_SETTINGS,
  SUPERSCRIPT_SETTINGS,
  DEFAULT_COLORS,
  EDITING_COLORS,
  PLAYBACK_SETTINGS,
  CANVAS_IMAGE_SETTINGS,
  REDRAW_SETTINGS
} = require('../pages/notation/config.js');

/**
 * 解析简谱音符格式
 * @param {string} note - 音符字符串
 * @returns {Object} 解析结果
 */
function parseSimplifiedNote(note) {
  if (!note || note === '') {
    return { baseNote: '', octaveUp: 0, octaveDown: 0, underline: false, leftSup: '', rightSup: '' };
  }
  
  let octaveUp = 0;
  let octaveDown = 0;
  let underline = false;
  let baseNote = '';
  let leftSup = '';
  let rightSup = '';
  let remaining = note;
  
  // 解析左上标 ^{...}
  if (remaining.indexOf('^{') === 0) {
    const endIdx = remaining.indexOf('}');
    if (endIdx > 2) {
      leftSup = remaining.substring(2, endIdx);
      remaining = remaining.substring(endIdx + 1);
    }
  }
  
  // 解析右上标 ...^{...}
  const rightSupIdx = remaining.lastIndexOf('^{');
  if (rightSupIdx > 0) {
    const endBrace = remaining.indexOf('}', rightSupIdx);
    if (endBrace > rightSupIdx + 2) {
      rightSup = remaining.substring(rightSupIdx + 2, endBrace);
      remaining = remaining.substring(0, rightSupIdx);
    }
  }
  
  // 统计 ' 的数量（高八度）
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] === "'") octaveUp++;
  }
  
  // 统计 , 的数量（低八度）
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] === ',') octaveDown++;
  }
  
  // 检查是否有 _ （时值减半下划线）
  if (remaining.indexOf('_') !== -1) {
    underline = true;
  }
  
  // 提取基础音符
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] !== "'" && remaining[i] !== ',' && remaining[i] !== '_') {
      baseNote += remaining[i];
    }
  }
  
  return { baseNote, octaveUp, octaveDown, underline, leftSup, rightSup };
}

/**
 * Canvas谱面渲染器类
 */
class CanvasNotationRenderer {
  constructor(options = {}) {
    this.canvas = null;
    this.ctx = null;
    this.dpr = wx.getWindowInfo().pixelRatio || 2;
    this.notation = null;
    this.orientation = 'portrait';
    this.measuresPerRow = 1;
    this.colors = { ...DEFAULT_COLORS, ...options.colors };
    
    // 布局缓存
    this.layoutCache = null;
    
    // 点击区域映射表
    this.hitAreas = [];
    
    // 播放高亮状态
    this.playbackHighlight = null;
    this.playbackFadeColumns = [];
  }
  
  /**
   * 初始化Canvas
   * @param {Object} canvas - Canvas实例
   * @param {number} width - 逻辑宽度(px)
   * @param {number} height - 逻辑高度(px)
   */
  init(canvas, width, height) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    // 设置高清渲染
    canvas.width = width * this.dpr;
    canvas.height = height * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
    
    this.width = width;
    this.height = height;
  }
  
  /**
   * 设置谱面数据
   * @param {Object} notation - 谱面数据
   * @param {string} orientation - 屏幕方向
   * @param {number} measuresPerRow - 每行小节数
   */
  setData(notation, orientation, measuresPerRow) {
    this.notation = notation;
    this.orientation = orientation;
    this.measuresPerRow = notation.measuresPerRow || measuresPerRow || 1;
    this.layoutCache = null; // 清除布局缓存
    this.hitAreas = []; // 清除点击区域
  }
  
  /**
   * 更新颜色配置
   */
  updateColors(rightHandColor, leftHandColor) {
    this.colors.rightHand = rightHandColor || DEFAULT_COLORS.rightHand;
    this.colors.leftHand = leftHandColor || DEFAULT_COLORS.leftHand;
  }
  
  /**
   * 获取横屏缩放系数
   */
  getLandscapeScale() {
    return this.orientation === 'landscape' ? BASE_SETTINGS.landscapeScale : 1;
  }
  
  /**
   * 获取字号（根据横竖屏缩放）
   */
  getFontSize() {
    const style = this.notation?.style || {};
    let baseSize = style.noteFontSize || BASE_SETTINGS.noteFontSizeDefault;
    return baseSize * this.getLandscapeScale();
  }
  
  /**
   * 获取小节高度
   */
  getMeasureHeight() {
    const style = this.notation?.style || {};
    const isMultiMeasure = this.measuresPerRow > 1;
    let defaultHeight = isMultiMeasure ? BASE_SETTINGS.measureHeightMulti : BASE_SETTINGS.measureHeightDefault;
    let measureHeight = style.measureHeight || defaultHeight;
    return Math.round(measureHeight * this.getLandscapeScale());
  }
  
  /**
   * 获取行间距
   */
  getLineSpacing() {
    const style = this.notation?.style || {};
    let lineSpacing = style.lineSpacing || BASE_SETTINGS.lineSpacingDefault;
    return Math.round(lineSpacing * this.getLandscapeScale());
  }
  
  /**
   * 获取槽位高度
   */
  getSlotHeight() {
    const measureHeight = this.getMeasureHeight();
    let height = Math.round(measureHeight * LAYOUT_SETTINGS.slotHeightRatio);
    height = Math.max(LAYOUT_SETTINGS.slotHeightMin, height);
    height = Math.min(LAYOUT_SETTINGS.slotHeightMax, height);
    return height;
  }
  
  /**
   * 获取列间距
   */
  getColumnGap() {
    const measureHeight = this.getMeasureHeight();
    let gap = Math.round(measureHeight * LAYOUT_SETTINGS.columnGapRatio);
    gap = Math.max(LAYOUT_SETTINGS.columnGapMin, gap);
    gap = Math.min(LAYOUT_SETTINGS.columnGapMax, gap);
    return gap;
  }
  
  /**
   * 获取八度点大小
   */
  getOctaveDotSize() {
    const fontSize = this.getFontSize();
    let size = Math.round(fontSize * OCTAVE_SETTINGS.octaveDotSizeRatio);
    size = Math.max(OCTAVE_SETTINGS.octaveDotSizeMin, size);
    size = Math.min(OCTAVE_SETTINGS.octaveDotSizeMax, size);
    return size;
  }
  
  /**
   * 获取上标字号
   */
  getSupFontSize() {
    return Math.round(this.getFontSize() * FONT_SETTINGS.supFontSizeRatio);
  }
  
  /**
   * 获取上标八度点大小
   */
  getSupOctaveDotSize() {
    const fontSize = this.getFontSize();
    let size = Math.round(fontSize * OCTAVE_SETTINGS.supOctaveDotSizeRatio);
    size = Math.max(OCTAVE_SETTINGS.supOctaveDotSizeMin, size);
    size = Math.min(OCTAVE_SETTINGS.supOctaveDotSizeMax, size);
    return size;
  }
  
  /**
   * 获取下划线粗细
   */
  getUnderlineThickness() {
    const fontSize = this.getFontSize();
    let thickness = Math.round(fontSize * OCTAVE_SETTINGS.underlineThicknessRatio);
    thickness = Math.max(OCTAVE_SETTINGS.underlineThicknessMin, thickness);
    thickness = Math.min(OCTAVE_SETTINGS.underlineThicknessMax, thickness);
    return thickness;
  }
  
  /**
   * rpx转px（适配不同屏幕）
   */
  rpx2px(rpx) {
    // 微信小程序标准: 750rpx = 屏幕宽度
    const screenWidth = wx.getWindowInfo().screenWidth || 375;
    return rpx * screenWidth / 750;
  }
  
  /**
   * 获取画布内边距（px）
   */
  getPadding() {
    return {
      left: this.rpx2px(LAYOUT_SETTINGS.canvasLeftPadding),
      right: this.rpx2px(LAYOUT_SETTINGS.canvasRightPadding),
      top: this.rpx2px(LAYOUT_SETTINGS.canvasTopPadding),
      bottom: this.rpx2px(LAYOUT_SETTINGS.canvasBottomPadding)
    };
  }
  
  /**
   * 计算布局并缓存
   * @returns {Object} 布局信息
   */
  calculateLayout() {
    if (this.layoutCache) return this.layoutCache;
    
    const notation = this.notation;
    if (!notation || !notation.measures) {
      return null;
    }
    
    const measureHeight = this.rpx2px(this.getMeasureHeight());
    const lineSpacing = this.rpx2px(this.getLineSpacing());
    const measuresPerRow = this.measuresPerRow;
    const padding = this.getPadding();
    
    // 可用绘制区域宽度（减去左右内边距）
    const availableWidth = this.width - padding.left - padding.right;
    const measureWidth = availableWidth / measuresPerRow;
    
    // 计算总行数
    const totalRows = Math.ceil(notation.measures.length / measuresPerRow);
    
    // 计算总高度（包含行间距和上下内边距）
    const totalHeight = padding.top + totalRows * measureHeight + (totalRows - 1) * lineSpacing + padding.bottom;
    
    // 构建小节布局
    const measuresLayout = [];
    notation.measures.forEach((measure, measureIndex) => {
      const row = Math.floor(measureIndex / measuresPerRow);
      const col = measureIndex % measuresPerRow;
      
      // x坐标：从左内边距开始
      const x = padding.left + col * measureWidth;
      // y坐标：从顶部内边距开始
      const y = padding.top + row * (measureHeight + lineSpacing);
      
      measuresLayout.push({
        measureIndex,
        x,
        y,
        width: measureWidth,
        height: measureHeight,
        row,
        col,
        measure
      });
    });
    
    this.layoutCache = {
      measureHeight,
      lineSpacing,
      measuresPerRow,
      measureWidth,
      totalRows,
      totalHeight,
      padding,
      measures: measuresLayout
    };
    
    return this.layoutCache;
  }
  
  /**
   * 绘制整个谱面
   */
  render() {
    if (!this.ctx || !this.notation) return;
    
    const layout = this.calculateLayout();
    if (!layout) return;
    
    const ctx = this.ctx;
    
    // 清除画布
    ctx.clearRect(0, 0, this.width, this.height);
    
    // 填充白色背景
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // 清除点击区域
    this.hitAreas = [];
    
    // 绘制每个小节
    layout.measures.forEach(measureLayout => {
      this.drawMeasure(measureLayout);
    });
    
    // 注意：播放高亮已迁移至 View 层实现（使用 playback-cursor-overlay）
    // 不再在 Canvas 上绘制黄色高亮，避免层级问题
  }
  
  /**
   * 绘制单个小节
   * @param {Object} measureLayout - 小节布局信息
   */
  drawMeasure(measureLayout) {
    const ctx = this.ctx;
    const { measureIndex, x, y, width, height, measure, col } = measureLayout;
    const measuresPerRow = this.measuresPerRow;
    const measureOffset = this.notation.measureOffset || 0;
    
    // 绘制小节编号 - 放在小节左上角上方
    const indexFontSize = this.rpx2px(
      measuresPerRow > 1 ? FONT_SETTINGS.measureIndexFontSizeMulti : FONT_SETTINGS.measureIndexFontSizeSingle
    );
    ctx.fillStyle = this.colors.measureIndex;
    ctx.font = `${FONT_SETTINGS.measureIndexFontWeight} ${indexFontSize}px ${FONT_SETTINGS.fontFamily}`;
    ctx.textAlign = 'left'; // 左对齐，避免被遮挡
    ctx.textBaseline = 'bottom';
    const indexText = String(measureOffset + measureIndex + 1);
    // 小节编号位于小节左侧上方
    ctx.fillText(indexText, x + this.rpx2px(2), y - this.rpx2px(LAYOUT_SETTINGS.measureIndexOffsetY));
    
    // 绘制左侧小节线（仅每行第一个小节）
    if (col === 0) {
      ctx.fillStyle = this.colors.barLine;
      ctx.fillRect(x, y, this.rpx2px(LINE_SETTINGS.barLineWidth), height);
    }
    
    // 绘制右侧小节线
    ctx.fillStyle = this.colors.barLine;
    ctx.fillRect(x + width - this.rpx2px(LINE_SETTINGS.barLineWidth), y, this.rpx2px(LINE_SETTINGS.barLineWidth), height);
    
    // 计算每拍和每个细分的宽度
    const beats = measure.beats || [];
    const beatWidth = width / beats.length;
    
    beats.forEach((beat, beatIndex) => {
      const beatX = x + beatIndex * beatWidth;
      
      // 绘制拍子分隔线（跳过第一个）
      if (beatIndex > 0 && !beat.barLineAfter) {
        ctx.fillStyle = this.colors.beatLine;
        ctx.fillRect(beatX, y, this.rpx2px(LINE_SETTINGS.beatLineWidth), height);
      }
      
      // 处理中间小节线（自定义拍号）
      if (beat.barLineAfter) {
        ctx.fillStyle = this.colors.barLine;
        ctx.fillRect(
          beatX + beatWidth - this.rpx2px(LINE_SETTINGS.barLineWidth / 2), 
          y, 
          this.rpx2px(LINE_SETTINGS.barLineWidth), 
          height
        );
      }
      
      // 绘制细分
      const subdivisions = beat.subdivisions || [];
      const subWidth = beatWidth / subdivisions.length;
      
      subdivisions.forEach((subdivision, subIndex) => {
        const subX = beatX + subIndex * subWidth;
        
        // 绘制细分分隔线（跳过第一个）
        if (subIndex > 0) {
          ctx.fillStyle = this.colors.subdivisionLine;
          const lineHeight = height * LINE_SETTINGS.subdivisionLineHeightRatio;
          const lineY = y + height * LINE_SETTINGS.subdivisionLineStartRatio;
          ctx.fillRect(subX, lineY, this.rpx2px(LINE_SETTINGS.subdivisionLineWidth), lineHeight);
        }
        
        // 绘制备注（如果有）
        if (subdivision.annotation) {
          this.drawAnnotation(subX, y, subWidth, subdivision.annotation);
        }
        
        // 绘制上下手分隔线
        const dividerY = y + height / 2;
        ctx.fillStyle = this.colors.handDivider;
        ctx.fillRect(subX, dividerY - this.rpx2px(LINE_SETTINGS.handDividerHeight / 2), subWidth, this.rpx2px(LINE_SETTINGS.handDividerHeight));
        
        // 绘制右手音符（上半部分）
        this.drawNoteSlots(
          subX, y, subWidth, height / 2,
          subdivision.rightHand,
          'right',
          measureIndex, beatIndex, subIndex
        );
        
        // 绘制左手音符（下半部分）
        this.drawNoteSlots(
          subX, y + height / 2, subWidth, height / 2,
          subdivision.leftHand,
          'left',
          measureIndex, beatIndex, subIndex
        );
      });
    });
  }
  
  /**
   * 绘制备注
   */
  drawAnnotation(x, y, width, text) {
    const ctx = this.ctx;
    const fontSize = this.rpx2px(FONT_SETTINGS.annotationFontSize);
    
    ctx.font = `${FONT_SETTINGS.annotationFontWeight} ${fontSize}px ${FONT_SETTINGS.fontFamily}`;
    
    // 测量文字宽度
    const textWidth = ctx.measureText(text).width;
    const bgPadding = this.rpx2px(LAYOUT_SETTINGS.annotationPaddingX);
    const bgHeight = this.rpx2px(LAYOUT_SETTINGS.annotationBgHeight);
    const offsetY = this.rpx2px(LAYOUT_SETTINGS.annotationOffsetY);
    const textBottomY = this.rpx2px(LAYOUT_SETTINGS.annotationTextBottomY);
    
    // 绘制背景
    ctx.fillStyle = DEFAULT_COLORS.annotationBackground;
    ctx.fillRect(
      x + width / 2 - textWidth / 2 - bgPadding / 2,
      y - offsetY,
      textWidth + bgPadding,
      bgHeight
    );
    
    // 绘制文字
    ctx.fillStyle = this.colors.annotation;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(text, x + width / 2, y - textBottomY);
  }
  
  /**
   * 绘制音符槽位
   * @param {number} x - 左上角x
   * @param {number} y - 左上角y
   * @param {number} width - 宽度
   * @param {number} height - 高度
   * @param {Array} notes - 音符数组 [外侧, 内侧]
   * @param {string} hand - 'right' 或 'left'
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   */
  drawNoteSlots(x, y, width, height, notes, hand, measureIndex, beatIndex, subIndex) {
    const slotHeight = this.rpx2px(this.getSlotHeight());
    const columnGap = this.rpx2px(this.getColumnGap());
    
    // 计算两个槽位的位置（居中排列）
    const totalSlotsHeight = slotHeight * 2 + columnGap;
    const startY = y + (height - totalSlotsHeight) / 2;
    
    const color = hand === 'right' ? this.colors.rightHand : this.colors.leftHand;
    const notesArray = Array.isArray(notes) ? notes : ['', ''];
    
    // 绘制两个槽位
    for (let index = 0; index < 2; index++) {
      const slotY = startY + index * (slotHeight + columnGap);
      const note = notesArray[index] || '';
      
      // 记录点击区域
      this.hitAreas.push({
        x: x,
        y: slotY,
        width: width,
        height: slotHeight,
        measureIndex,
        beatIndex,
        subIndex,
        hand,
        index,
        note
      });
      
      // 如果有音符，绘制它
      if (note) {
        this.drawNote(x, slotY, width, slotHeight, note, color);
      }
    }
  }
  
  /**
   * 绘制单个音符（支持简谱语法）
   * @param {number} x - 槽位x
   * @param {number} y - 槽位y
   * @param {number} width - 槽位宽度
   * @param {number} height - 槽位高度
   * @param {string} note - 音符内容
   * @param {string} color - 颜色
   */
  drawNote(x, y, width, height, note, color) {
    const ctx = this.ctx;
    const parsed = parseSimplifiedNote(note);
    const fontSize = this.rpx2px(this.getFontSize());
    const supFontSize = this.rpx2px(this.getSupFontSize());
    const dotSize = this.rpx2px(this.getOctaveDotSize());
    const supDotSize = this.rpx2px(this.getSupOctaveDotSize());
    
    const centerX = x + width / 2;
    const centerY = y + height / 2;
    
    // 设置字体
    ctx.font = `${FONT_SETTINGS.noteFontWeight} ${fontSize}px ${FONT_SETTINGS.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    
    // 计算主音符宽度
    const baseNoteWidth = parsed.baseNote ? ctx.measureText(parsed.baseNote).width : 0;
    
    // 计算左上标宽度
    let leftSupWidth = 0;
    if (parsed.leftSup) {
      ctx.font = `${FONT_SETTINGS.noteFontWeight} ${supFontSize}px ${FONT_SETTINGS.fontFamily}`;
      leftSupWidth = ctx.measureText(parsed.leftSup.replace(/['|,]/g, '')).width + supDotSize;
    }
    
    // 计算右上标宽度
    let rightSupWidth = 0;
    if (parsed.rightSup) {
      ctx.font = `${FONT_SETTINGS.noteFontWeight} ${supFontSize}px ${FONT_SETTINGS.fontFamily}`;
      rightSupWidth = ctx.measureText(parsed.rightSup.replace(/['|,]/g, '')).width + supDotSize;
    }
    
    // 总宽度
    const totalWidth = leftSupWidth + baseNoteWidth + rightSupWidth;
    let currentX = centerX - totalWidth / 2;
    
    // 绘制左上标
    if (parsed.leftSup) {
      this.drawSuperscript(
        currentX + leftSupWidth / 2, 
        centerY + fontSize * OCTAVE_SETTINGS.supVerticalOffsetRatio, 
        parsed.leftSup, 
        color
      );
      currentX += leftSupWidth;
    }
    
    // 绘制主音符
    if (parsed.baseNote) {
      ctx.font = `${FONT_SETTINGS.noteFontWeight} ${fontSize}px ${FONT_SETTINGS.fontFamily}`;
      ctx.fillStyle = color;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // 绘制上八度点
      if (parsed.octaveUp > 0) {
        for (let i = 0; i < parsed.octaveUp; i++) {
          ctx.beginPath();
          ctx.arc(
            currentX + baseNoteWidth / 2,
            centerY - fontSize / 2 - dotSize / 2 - i * (dotSize + OCTAVE_SETTINGS.octaveDotGap),
            dotSize / 2,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      // 绘制音符文字
      ctx.fillText(parsed.baseNote, currentX + baseNoteWidth / 2, centerY);
      
      // 绘制下划线（时值减半）
      if (parsed.underline) {
        const underlineThickness = this.rpx2px(this.getUnderlineThickness());
        ctx.fillRect(
          currentX + baseNoteWidth / 2 - baseNoteWidth / 2,
          centerY + fontSize / 2 + OCTAVE_SETTINGS.underlineOffsetY,
          baseNoteWidth,
          underlineThickness
        );
      }
      
      // 绘制下八度点
      if (parsed.octaveDown > 0) {
        for (let i = 0; i < parsed.octaveDown; i++) {
          ctx.beginPath();
          ctx.arc(
            currentX + baseNoteWidth / 2,
            centerY + fontSize / 2 + dotSize / 2 + i * (dotSize + OCTAVE_SETTINGS.octaveDotGap) + OCTAVE_SETTINGS.octaveDotGap,
            dotSize / 2,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      }
      
      currentX += baseNoteWidth;
    }
    
    // 绘制右上标
    if (parsed.rightSup) {
      this.drawSuperscript(
        currentX + rightSupWidth / 2, 
        centerY + fontSize * OCTAVE_SETTINGS.supVerticalOffsetRatio, 
        parsed.rightSup, 
        color
      );
    }
  }
  
  /**
   * 绘制上标
   */
  drawSuperscript(x, y, sup, color) {
    const ctx = this.ctx;
    const supFontSize = this.rpx2px(this.getSupFontSize());
    const supDotSize = this.rpx2px(this.getSupOctaveDotSize());
    
    // 解析上标内容
    let octaveUp = 0;
    let octaveDown = 0;
    let baseNote = '';
    
    for (let i = 0; i < sup.length; i++) {
      if (sup[i] === "'") octaveUp++;
      else if (sup[i] === ',') octaveDown++;
      else baseNote += sup[i];
    }
    
    ctx.font = `${FONT_SETTINGS.noteFontWeight} ${supFontSize}px ${FONT_SETTINGS.fontFamily}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 绘制上八度点
    if (octaveUp > 0) {
      for (let i = 0; i < octaveUp; i++) {
        ctx.beginPath();
        ctx.arc(
          x, 
          y - supFontSize / 2 - supDotSize / 2 - i * (supDotSize + OCTAVE_SETTINGS.supOctaveDotGap), 
          supDotSize / 2, 
          0, Math.PI * 2
        );
        ctx.fill();
      }
    }
    
    // 绘制文字
    if (baseNote) {
      ctx.fillText(baseNote, x, y);
    }
    
    // 绘制下八度点
    if (octaveDown > 0) {
      for (let i = 0; i < octaveDown; i++) {
        ctx.beginPath();
        ctx.arc(
          x, 
          y + supFontSize / 2 + supDotSize / 2 + i * (supDotSize + OCTAVE_SETTINGS.supOctaveDotGap), 
          supDotSize / 2, 
          0, Math.PI * 2
        );
        ctx.fill();
      }
    }
  }
  
  /**
   * 局部重绘单个音符位置（脏矩形刷新）
   * 优化版：精确控制清除区域，避免覆盖相邻元素
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   * @param {string} hand - 'right' 或 'left'
   * @param {number} slotIndex - 槽位索引
   * @param {string} newNote - 新音符值
   * @param {boolean} isEditing - 是否处于编辑状态
   */
  redrawSlot(measureIndex, beatIndex, subIndex, hand, slotIndex, newNote, isEditing = false) {
    if (!this.ctx || !this.notation) return;
    
    const ctx = this.ctx;
    const layout = this.calculateLayout();
    if (!layout) return;
    
    // 找到对应的点击区域
    const hitArea = this.hitAreas.find(area => 
      area.measureIndex === measureIndex &&
      area.beatIndex === beatIndex &&
      area.subIndex === subIndex &&
      area.hand === hand &&
      area.index === slotIndex
    );
    
    if (!hitArea) return;
    
    // 获取小节布局信息
    const measureLayout = layout.measures.find(m => m.measureIndex === measureIndex);
    if (!measureLayout) return;
    
    // 获取扩展清除区域的边距（防止八度点和上标残影）
    // 使用较小的扩展值，避免影响相邻元素
    const fontSize = this.rpx2px(this.getFontSize());
    const dotSize = this.rpx2px(this.getOctaveDotSize());
    
    // 垂直方向扩展：考虑八度点高度
    const vPadding = Math.ceil(dotSize * 2 + 4);
    // 水平方向扩展：考虑上标宽度
    const hPadding = Math.ceil(fontSize * 0.3);
    
    // 计算清除区域，但不要超出细分列的边界
    const subX = hitArea.x;
    const clearX = subX; // 不扩展左边界，避免覆盖左侧分隔线
    const clearWidth = hitArea.width; // 不扩展右边界，避免覆盖右侧分隔线
    const clearY = Math.max(0, hitArea.y - vPadding);
    const clearHeight = hitArea.height + vPadding * 2;
    
    // 清除目标区域
    ctx.clearRect(clearX, clearY, clearWidth, clearHeight);
    
    // 填充白色背景
    ctx.fillStyle = this.colors.background;
    ctx.fillRect(clearX, clearY, clearWidth, clearHeight);
    
    // 重绘可能被清除的相邻分隔线和其他音符
    this.redrawAdjacentElements(measureIndex, beatIndex, subIndex, hand, slotIndex, hitArea, layout, measureLayout);
    
    // 如果处于编辑状态，绘制高亮背景
    if (isEditing) {
      const editColor = hand === 'right' ? EDITING_COLORS.rightHandEditBg : EDITING_COLORS.leftHandEditBg;
      const borderColor = hand === 'right' ? EDITING_COLORS.rightHandEditBorder : EDITING_COLORS.leftHandEditBorder;
      
      ctx.fillStyle = editColor;
      ctx.fillRect(hitArea.x + 1, hitArea.y + 1, hitArea.width - 2, hitArea.height - 2);
      
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = this.rpx2px(LINE_SETTINGS.editingBorderWidth);
      ctx.strokeRect(hitArea.x + 1, hitArea.y + 1, hitArea.width - 2, hitArea.height - 2);
    }
    
    // 绘制音符
    if (newNote) {
      const color = hand === 'right' ? this.colors.rightHand : this.colors.leftHand;
      this.drawNote(hitArea.x, hitArea.y, hitArea.width, hitArea.height, newNote, color);
    }
    
    // 更新点击区域中的音符值
    hitArea.note = newNote;
  }
  
  /**
   * 重绘相邻元素（分隔线和同列其他音符）
   * 优化版：更全面地处理可能被影响的相邻元素
   */
  redrawAdjacentElements(measureIndex, beatIndex, subIndex, hand, slotIndex, hitArea, layout, measureLayout) {
    const ctx = this.ctx;
    const { x: measureX, y: measureY, width: measureWidth, height: measureHeight, measure, col } = measureLayout;
    const beats = measure.beats || [];
    if (beatIndex >= beats.length) return;
    
    const beatWidth = measureWidth / beats.length;
    const beat = beats[beatIndex];
    const subdivisions = beat.subdivisions || [];
    if (subIndex >= subdivisions.length) return;
    
    const subWidth = beatWidth / subdivisions.length;
    const subX = measureX + beatIndex * beatWidth + subIndex * subWidth;
    
    // 1. 重绘当前细分的左侧分隔线
    if (subIndex > 0) {
      ctx.fillStyle = this.colors.subdivisionLine;
      const lineHeight = measureHeight * LINE_SETTINGS.subdivisionLineHeightRatio;
      const lineY = measureY + measureHeight * LINE_SETTINGS.subdivisionLineStartRatio;
      ctx.fillRect(subX, lineY, this.rpx2px(LINE_SETTINGS.subdivisionLineWidth), lineHeight);
    }
    
    // 2. 重绘下一个细分的分隔线（右侧边界）
    if (subIndex < subdivisions.length - 1) {
      const nextSubX = subX + subWidth;
      ctx.fillStyle = this.colors.subdivisionLine;
      const lineHeight = measureHeight * LINE_SETTINGS.subdivisionLineHeightRatio;
      const lineY = measureY + measureHeight * LINE_SETTINGS.subdivisionLineStartRatio;
      ctx.fillRect(nextSubX, lineY, this.rpx2px(LINE_SETTINGS.subdivisionLineWidth), lineHeight);
    }
    
    // 3. 重绘中轴线（上下手分隔线）
    const dividerY = measureY + measureHeight / 2;
    ctx.fillStyle = this.colors.handDivider;
    ctx.fillRect(subX, dividerY - this.rpx2px(LINE_SETTINGS.handDividerHeight / 2), subWidth, this.rpx2px(LINE_SETTINGS.handDividerHeight));
    
    // 4. 重绘拍子分隔线（如果当前是拍子的第一个细分）
    if (subIndex === 0 && beatIndex > 0) {
      const beatX = measureX + beatIndex * beatWidth;
      // 检查是否有中间小节线
      const prevBeat = beats[beatIndex - 1];
      if (prevBeat && prevBeat.barLineAfter) {
        // 绘制小节线
        ctx.fillStyle = this.colors.barLine;
        ctx.fillRect(beatX - this.rpx2px(LINE_SETTINGS.barLineWidth / 2), measureY, this.rpx2px(LINE_SETTINGS.barLineWidth), measureHeight);
      } else {
        // 绘制拍子分隔线
        ctx.fillStyle = this.colors.beatLine;
        ctx.fillRect(beatX, measureY, this.rpx2px(LINE_SETTINGS.beatLineWidth), measureHeight);
      }
    }
    
    // 5. 重绘左侧小节线（如果是该行第一个小节的第一个细分）
    if (col === 0 && beatIndex === 0 && subIndex === 0) {
      ctx.fillStyle = this.colors.barLine;
      ctx.fillRect(measureX, measureY, this.rpx2px(LINE_SETTINGS.barLineWidth), measureHeight);
    }
    
    // 6. 重绘右侧小节线（如果是最后一个细分）
    if (subIndex === subdivisions.length - 1 && beatIndex === beats.length - 1) {
      ctx.fillStyle = this.colors.barLine;
      ctx.fillRect(measureX + measureWidth - this.rpx2px(LINE_SETTINGS.barLineWidth), measureY, this.rpx2px(LINE_SETTINGS.barLineWidth), measureHeight);
    }
    
    // 7. 重绘同一细分列中的其他音符槽位（可能被垂直扩展区域影响）
    const sameColumnSlots = this.hitAreas.filter(area => 
      area.measureIndex === measureIndex &&
      area.beatIndex === beatIndex &&
      area.subIndex === subIndex &&
      !(area.hand === hand && area.index === slotIndex) // 排除当前槽位
    );
    
    sameColumnSlots.forEach(otherSlot => {
      if (otherSlot.note) {
        const color = otherSlot.hand === 'right' ? this.colors.rightHand : this.colors.leftHand;
        this.drawNote(otherSlot.x, otherSlot.y, otherSlot.width, otherSlot.height, otherSlot.note, color);
      }
    });
    
    // 8. 重绘小节计数（如果是右手第一行的格子，清除区域可能会擦除小节计数）
    if (hand === 'right' && slotIndex === 0) {
      const measureOffset = this.notation.measureOffset || 0;
      const indexFontSize = this.rpx2px(
        this.measuresPerRow > 1 ? FONT_SETTINGS.measureIndexFontSizeMulti : FONT_SETTINGS.measureIndexFontSizeSingle
      );
      ctx.fillStyle = this.colors.measureIndex;
      ctx.font = `${FONT_SETTINGS.measureIndexFontWeight} ${indexFontSize}px ${FONT_SETTINGS.fontFamily}`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      const indexText = String(measureOffset + measureIndex + 1);
      ctx.fillText(indexText, measureX + this.rpx2px(2), measureY - this.rpx2px(LAYOUT_SETTINGS.measureIndexOffsetY));
    }
  }
  
  /**
   * 重绘相邻的分隔线（保留用于向后兼容）
   * @deprecated 请使用 redrawAdjacentElements
   */
  redrawAdjacentLines(measureIndex, beatIndex, subIndex, hand, hitArea, layout) {
    const measureLayout = layout.measures.find(m => m.measureIndex === measureIndex);
    if (measureLayout) {
      this.redrawAdjacentElements(measureIndex, beatIndex, subIndex, hand, 0, hitArea, layout, measureLayout);
    }
  }
  
  /**
   * 设置播放高亮列
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   */
  setPlaybackHighlight(measureIndex, beatIndex, subIndex) {
    // 保存之前的高亮位置用于淡出
    if (this.playbackHighlight) {
      this.playbackFadeColumns.push({
        ...this.playbackHighlight,
        fadeStartTime: Date.now()
      });
      // 限制淡出列数量
      if (this.playbackFadeColumns.length > 3) {
        this.playbackFadeColumns.shift();
      }
    }
    
    this.playbackHighlight = measureIndex !== null ? { measureIndex, beatIndex, subIndex } : null;
    this.render(); // 重新渲染
  }
  
  /**
   * 清除播放高亮
   */
  clearPlaybackHighlight() {
    this.playbackHighlight = null;
    this.playbackFadeColumns = [];
    this.render();
  }
  
  /**
   * 绘制播放高亮效果
   */
  drawPlaybackHighlight() {
    if (!this.playbackHighlight) return;
    
    const ctx = this.ctx;
    const layout = this.calculateLayout();
    if (!layout) return;
    
    const { measureIndex, beatIndex, subIndex } = this.playbackHighlight;
    
    // 找到对应小节布局
    const measureLayout = layout.measures.find(m => m.measureIndex === measureIndex);
    if (!measureLayout) return;
    
    const { x, y, width, height, measure } = measureLayout;
    const beats = measure.beats || [];
    if (beatIndex >= beats.length) return;
    
    const beatWidth = width / beats.length;
    const beat = beats[beatIndex];
    const subdivisions = beat.subdivisions || [];
    if (subIndex >= subdivisions.length) return;
    
    const subWidth = beatWidth / subdivisions.length;
    const subX = x + beatIndex * beatWidth + subIndex * subWidth;
    
    // 绘制淡出列
    const now = Date.now();
    this.playbackFadeColumns.forEach(fadeCol => {
      const elapsed = now - fadeCol.fadeStartTime;
      if (elapsed < PLAYBACK_SETTINGS.fadeoutDuration) {
        const alpha = 1 - elapsed / PLAYBACK_SETTINGS.fadeoutDuration;
        this.drawColumnHighlight(fadeCol.measureIndex, fadeCol.beatIndex, fadeCol.subIndex, alpha * 0.5);
      }
    });
    
    // 绘制当前高亮列
    ctx.fillStyle = PLAYBACK_SETTINGS.highlightColor;
    ctx.fillRect(subX, y, subWidth, height);
    
    // 绘制高亮边框
    ctx.strokeStyle = PLAYBACK_SETTINGS.highlightBorderColor;
    ctx.lineWidth = this.rpx2px(PLAYBACK_SETTINGS.highlightBorderWidth);
    ctx.strokeRect(subX, y, subWidth, height);
  }
  
  /**
   * 绘制列高亮（用于淡出效果）
   */
  drawColumnHighlight(measureIndex, beatIndex, subIndex, alpha) {
    const ctx = this.ctx;
    const layout = this.calculateLayout();
    if (!layout) return;
    
    const measureLayout = layout.measures.find(m => m.measureIndex === measureIndex);
    if (!measureLayout) return;
    
    const { x, y, width, height, measure } = measureLayout;
    const beats = measure.beats || [];
    if (beatIndex >= beats.length) return;
    
    const beatWidth = width / beats.length;
    const beat = beats[beatIndex];
    const subdivisions = beat.subdivisions || [];
    if (subIndex >= subdivisions.length) return;
    
    const subWidth = beatWidth / subdivisions.length;
    const subX = x + beatIndex * beatWidth + subIndex * subWidth;
    
    ctx.fillStyle = `rgba(255, 193, 7, ${alpha * 0.35})`;
    ctx.fillRect(subX, y, subWidth, height);
  }
  
  /**
   * 点击测试 - 根据坐标找到对应的音符位置
   * @param {number} x - 点击x坐标
   * @param {number} y - 点击y坐标
   * @returns {Object|null} 点击的音符位置信息
   */
  hitTest(x, y) {
    for (const area of this.hitAreas) {
      if (x >= area.x && x <= area.x + area.width &&
          y >= area.y && y <= area.y + area.height) {
        return {
          measureIndex: area.measureIndex,
          beatIndex: area.beatIndex,
          subIndex: area.subIndex,
          hand: area.hand,
          index: area.index,
          note: area.note,
          rect: {
            x: area.x,
            y: area.y,
            width: area.width,
            height: area.height
          }
        };
      }
    }
    return null;
  }
  
  /**
   * 获取Canvas所需的高度
   * @returns {number} 高度(px)
   */
  getRequiredHeight() {
    const layout = this.calculateLayout();
    if (!layout) return 200;
    return layout.totalHeight;
  }
  
  /**
   * 获取指定列的坐标信息（用于播放光标定位）
   * @param {number} measureIndex - 小节索引
   * @param {number} beatIndex - 拍索引
   * @param {number} subIndex - 细分索引
   * @returns {Object|null} 列的坐标和尺寸 {x, y, width, height}
   */
  getColumnRect(measureIndex, beatIndex, subIndex) {
    const layout = this.calculateLayout();
    if (!layout) return null;
    
    const measureLayout = layout.measures.find(m => m.measureIndex === measureIndex);
    if (!measureLayout) return null;
    
    const { x, y, width, height, measure } = measureLayout;
    const beats = measure.beats || [];
    if (beatIndex >= beats.length) return null;
    
    const beatWidth = width / beats.length;
    const beat = beats[beatIndex];
    const subdivisions = beat.subdivisions || [];
    if (subIndex >= subdivisions.length) return null;
    
    const subWidth = beatWidth / subdivisions.length;
    const subX = x + beatIndex * beatWidth + subIndex * subWidth;
    
    return {
      x: subX,
      y: y,
      width: subWidth,
      height: height
    };
  }
  
  /**
   * 获取所有列的坐标信息（用于预计算播放光标轨迹）
   * @returns {Array} 所有列的坐标数组
   */
  getAllColumnRects() {
    const layout = this.calculateLayout();
    if (!layout) return [];
    
    const columns = [];
    
    layout.measures.forEach(measureLayout => {
      const { measureIndex, x, y, width, height, measure } = measureLayout;
      const beats = measure.beats || [];
      const beatWidth = width / beats.length;
      
      beats.forEach((beat, beatIndex) => {
        const subdivisions = beat.subdivisions || [];
        const subWidth = beatWidth / subdivisions.length;
        
        subdivisions.forEach((sub, subIndex) => {
          const subX = x + beatIndex * beatWidth + subIndex * subWidth;
          columns.push({
            measureIndex,
            beatIndex,
            subIndex,
            x: subX,
            y: y,
            width: subWidth,
            height: height
          });
        });
      });
    });
    
    return columns;
  }
  
  /**
   * 将Canvas转换为临时图片路径
   * 使用2倍DPR导出，确保图片清晰度
   * @returns {Promise<string>} 图片临时路径
   */
  toTempImage() {
    return new Promise((resolve, reject) => {
      if (!this.canvas) {
        reject(new Error('Canvas not initialized'));
        return;
      }
      
      // Canvas实际像素尺寸（已经是 width * dpr）
      const canvasPixelWidth = this.width * this.dpr;
      const canvasPixelHeight = this.height * this.dpr;
      
      // 导出图片使用更高分辨率，确保清晰度
      // destWidth/destHeight 设为 Canvas 像素尺寸的 2 倍
      const exportScale = 2;
      
      wx.canvasToTempFilePath({
        canvas: this.canvas,
        x: 0,
        y: 0,
        width: canvasPixelWidth,
        height: canvasPixelHeight,
        destWidth: canvasPixelWidth * exportScale,
        destHeight: canvasPixelHeight * exportScale,
        fileType: CANVAS_IMAGE_SETTINGS.fileType,
        quality: CANVAS_IMAGE_SETTINGS.quality,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (err) => {
          console.error('Canvas to image failed:', err);
          reject(err);
        }
      });
    });
  }
  
  /**
   * 获取图片显示尺寸（确保与Canvas像素一致）
   * 公式: Image Display Width = Canvas Pixel Width / Device Pixel Ratio
   * @returns {Object} {width, height} 显示尺寸(px)
   */
  getImageDisplaySize() {
    return {
      width: this.width,
      height: this.height
    };
  }
  
  /**
   * 销毁渲染器
   */
  destroy() {
    this.canvas = null;
    this.ctx = null;
    this.notation = null;
    this.layoutCache = null;
    this.hitAreas = [];
    this.playbackHighlight = null;
    this.playbackFadeColumns = [];
  }
}

module.exports = {
  CanvasNotationRenderer,
  parseSimplifiedNote,
  DEFAULT_COLORS,
  BASE_SETTINGS,
  LAYOUT_SETTINGS,
  LINE_SETTINGS,
  FONT_SETTINGS,
  OCTAVE_SETTINGS,
  EDITING_COLORS,
  PLAYBACK_SETTINGS,
  CANVAS_IMAGE_SETTINGS
};
