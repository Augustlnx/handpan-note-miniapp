/**
 * Canvas2D 谱面渲染器配置参数
 * 
 * 所有尺寸单位说明：
 * - 带 Rpx 后缀的：表示 rpx 单位，会自动转换为屏幕实际像素
 * - 带 Ratio 后缀的：表示比例系数，基于某个基准值计算
 * - 其他：px 像素或纯数值
 * 
 * 调整指南：
 * - 如需调整整体大小，修改 BASE_SETTINGS 中的基准值
 * - 如需调整某个元素相对大小，修改对应的 Ratio 系数
 * 
 * 重要说明：
 * - 这些参数需要与 notation.wxml 中 WXS 模块和 notation.wxss 中的样式保持一致
 * - 修改此配置时，请同步检查 CSS 相关样式
 */

// ============================================================
// 基础设置 - 影响整体布局的核心参数
// ============================================================
const BASE_SETTINGS = {
  // 竖屏模式小节默认高度 (rpx) - 对应 CSS .measure { height: 160rpx }
  measureHeightDefault: 160,
  
  // 多小节模式（每行>1小节）的小节高度 (rpx) - 对应 CSS .multi-measure .measure { height: 110rpx }
  measureHeightMulti: 110,
  
  // 竖屏模式音符字体大小 (rpx) - 默认字号
  noteFontSizeDefault: 28,
  
  // 竖屏模式行间距 (rpx) - 对应 CSS .staff-container { row-gap }
  lineSpacingDefault: 65,
  
  // 横屏模式缩放比例（所有尺寸乘以此系数）- 对应 WXS LANDSCAPE_SCALE = 18/28
  landscapeScale: 18 / 28,  // ≈ 0.643
};

// ============================================================
// 布局参数 - 控制各元素间距和位置
// ============================================================
const LAYOUT_SETTINGS = {
  // 画布左侧边距 (rpx) - 与 CSS .notation-sheet padding 对应
  // 【Bug修复】增加左右边距，防止小节线被页边距截断
  // 边距需要至少为小节线宽度的一半（barLineWidth=5rpx，所以至少需要3rpx）
  canvasLeftPadding: 4,
  
  // 画布右侧边距 (rpx)
  canvasRightPadding: 4,
  
  // 画布顶部边距 (rpx) - 为小节编号预留空间
  canvasTopPadding: 32,
  
  // 画布底部边距 (rpx)
  canvasBottomPadding: 16,
  
  // 小节编号距离小节顶部的偏移量 (rpx) - 对应 CSS .measure-index { top: -28rpx }
  measureIndexOffsetY: 5,
  
  // 槽位高度占小节高度的比例 - 计算公式: slotHeight = measureHeight * 0.225
  // 默认: 160 * 0.225 = 36rpx，对应 CSS .note-slot { height: 36rpx }
  slotHeightRatio: 0.225,
  
  // 槽位高度最小值 (rpx) - 防止过小不可点击
  slotHeightMin: 18,
  
  // 槽位高度最大值 (rpx) - 防止过大影响布局
  slotHeightMax: 60,
  
  // 列间距（上下两个槽位之间）占小节高度的比例
  // 默认: 160 * 0.05 = 8rpx，对应 CSS .note-column { gap: 8rpx }
  columnGapRatio: 0.05,
  
  // 列间距最小值 (rpx)
  columnGapMin: 4,
  
  // 列间距最大值 (rpx)
  columnGapMax: 16,
  
  // 【优化】内侧槽位远离中轴线的偏移量 (rpx)
  // 用于防止靠近中轴的两个槽位（右手index=1，左手index=0）的音高圆点混淆
  innerSlotOffset: 3,
  
  // 备注文字距小节顶部的距离 (rpx)
  annotationOffsetY: 24,
  
  // 备注背景高度 (rpx)
  annotationBgHeight: 20,
  
  // 备注文字底部距小节顶部的距离 (rpx)
  annotationTextBottomY: 6,
  
  // 备注背景内边距 (rpx)
  annotationPaddingX: 6,
};

// ============================================================
// 线条参数 - 控制各种线条的粗细
// 说明：需与 CSS 中的 .bar-line, .beat-line 等样式保持一致
// ============================================================
const LINE_SETTINGS = {
  // 小节线（竖线）宽度 (rpx) - 对应 CSS .bar-line { border-left: 5rpx }
  barLineWidth: 5,
  
  // 拍子分隔线宽度 (rpx) - 对应 CSS .beat-line { width: 2rpx }
  beatLineWidth: 2,
  
  // 细分分隔线宽度 (rpx) - 对应 CSS .subdivision-line { width: 1rpx }
  // 【优化】稍微加粗，比拍线略细但比原来粗
  subdivisionLineWidth: 1.5,
  
  // 细分线高度占小节高度的比例 - 默认50%，即小节中央部分
  subdivisionLineHeightRatio: 0.5,
  
  // 细分线起始位置占小节高度的比例（从顶部算）- 默认25%开始
  subdivisionLineStartRatio: 0.25,
  
  // 上下手分隔线（中轴线）高度 (rpx) - 对应 CSS .note-box-top { border-bottom: 1rpx }
  // 【优化】中轴线与拍线一样粗，便于视觉区分上下手
  // 这条线位于小节高度的50%位置，分隔右手(上)和左手(下)
  handDividerHeight: 2,
  
  // 编辑状态边框宽度 (rpx)
  editingBorderWidth: 2,
  
  // 多小节模式线条粗细调整（横屏两栏时）
  // 【Bug修复】紧凑模式下小节线与拍线粗细一致，避免过粗
  // 对应 CSS .staff-container.multi-measure .bar-line { width: 2rpx }
  barLineWidthMulti: 2,
  // 对应 CSS .staff-container.multi-measure .beat-line { width: 2rpx }
  beatLineWidthMulti: 2,
};

// ============================================================
// 字体参数 - 控制各种文字的大小
// ============================================================
const FONT_SETTINGS = {
  // 小节编号字体大小 - 单小节模式 (rpx) - 对应 CSS .measure-index { font-size: 22rpx }
  measureIndexFontSizeSingle: 22,
  
  // 小节编号字体大小 - 多小节模式 (rpx) - 对应 CSS .multi-measure .measure-index { font-size: 15rpx }
  measureIndexFontSizeMulti: 15,
  
  // 小节编号字体粗细
  measureIndexFontWeight: 500,
  
  // 音符字体粗细
  noteFontWeight: 'bold',
  
  // 上标字号占主字号的比例 - 对应 WXS getSupFontSize = fontSize * 0.55
  supFontSizeRatio: 0.55,
  
  // 备注字体大小 (rpx)
  annotationFontSize: 18,
  
  // 备注字体粗细
  annotationFontWeight: 400,
  
  // 字体族
  fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
};

// ============================================================
// 八度点和下划线参数
// 说明：这些参数对应 WXS 中的 getOctaveDotSize, getUnderlineThickness 等函数
// ============================================================
const OCTAVE_SETTINGS = {
  // ==================== 主音符八度点参数 ====================
  
  // 八度点大小占字号的比例 - 对应 WXS getOctaveDotSize = fontSize * 0.25
  octaveDotSizeRatio: 0.25,
  
  // 八度点最小大小 (rpx) - 防止过小不可见
  octaveDotSizeMin: 5,
  
  // 八度点最大大小 (rpx) - 防止过大影响布局
  octaveDotSizeMax: 12,
  
  // 八度点之间的间距 (rpx) - 多个八度点时的垂直间距
  // 对应 CSS .octave-dots-up/.octave-dots-down { gap: 2rpx }
  octaveDotGap: 1,
  
  // 八度点距离音符的偏移距离 (rpx)
  // 上方点容器 margin-bottom: -7rpx (紧贴音符)
  // 下方点容器 margin-top: -2rpx (紧贴音符)
  octaveDotOffsetUp: 0,
  octaveDotOffsetDown: -1,
  
  // ==================== 上标八度点参数 ====================
  
  // 上标八度点大小占字号的比例 - 上标的圆点比主音符的小
  supOctaveDotSizeRatio: 0.18,
  
  // 上标八度点最小大小 (rpx)
  supOctaveDotSizeMin: 3,
  
  // 上标八度点最大大小 (rpx)
  supOctaveDotSizeMax: 6,
  
  // 上标八度点间距 (rpx)
  supOctaveDotGap: 1,
  
  // ==================== 下划线参数（时值减半标记） ====================
  
  // 下划线粗细占字号的比例 - 对应 CSS text-decoration-thickness: 4rpx
  underlineThicknessRatio: 0.14,
  
  // 下划线最小粗细 (rpx)
  underlineThicknessMin: 2,
  
  // 下划线最大粗细 (rpx)
  underlineThicknessMax: 6,
  
  // 下划线距音符底部的距离 (rpx) - 对应 CSS text-underline-offset: 0rpx
  underlineOffsetY: 0,
  
  // 下划线宽度系数 - 下划线宽度 = 音符宽度 * 此系数
  underlineWidthRatio: 1.0,
  
  // ==================== 下划线与低八度圆点共存参数 ====================
  // 当音符同时有下划线和低八度圆点时，低八度圆点显示在下划线下方
  
  // 下划线与低八度圆点之间的基础间距 (rpx)
  underlineDotGapBase: 1,
  
  // 间距随字号缩放的比例 - 实际间距 = underlineDotGapBase + fontSize * underlineDotGapRatio
  underlineDotGapRatio: 0.04,
  
  // 间距最小值 (rpx)
  underlineDotGapMin: 1,
  
  // 间距最大值 (rpx)
  underlineDotGapMax: 4,
  
  // ==================== 上标位置参数 ====================
  
  // 上标相对主音符的垂直偏移比例（负数表示向上）
  // 计算: supY = centerY + fontSize * supVerticalOffsetRatio
  supVerticalOffsetRatio: -0.3,
  
  // 上标水平偏移量 (rpx) - 左/右上标与主音符的水平间距
  // 对应 CSS .note-sup-left { margin-right: -2rpx }
  supHorizontalOffsetLeft: -2,
  supHorizontalOffsetRight: 0,
};

// ============================================================
// 上标详细参数（独立配置，便于精确控制）
// 对应 CSS .note-superscript-container 和相关样式
// ============================================================
const SUPERSCRIPT_SETTINGS = {
  // 上标容器最小宽度 (rpx) - 确保点击区域足够大
  containerMinWidth: 20,
  
  // 上标容器最小高度 (rpx)
  containerMinHeight: 24,
  
  // 上标字号占主音符字号的比例 (与 FONT_SETTINGS.supFontSizeRatio 保持一致)
  // 对应 WXS getSupFontSize = fontSize * 0.55
  fontSizeRatio: 0.55,
  
  // 上标八度点大小占上标字号的比例
  // 对应 WXS getSupOctaveDotSize
  octaveDotSizeRatio: 0.33,
  
  // 上标八度点最小大小 (rpx)
  octaveDotSizeMin: 3,
  
  // 上标八度点最大大小 (rpx)
  octaveDotSizeMax: 6,
  
  // 上标八度点间距 (rpx)
  octaveDotGap: 1,
  
  // 左上标距离主音符的水平间距 (rpx)
  // 对应 CSS .note-sup-left { margin-right: -2rpx }
  horizontalGapLeft: -2,
  
  // 右上标距离主音符的水平间距 (rpx)
  // 对应 CSS .note-sup-right { margin-left: 0 }
  horizontalGapRight: 0,
  
  // 上标垂直偏移量 - 相对于主音符中心向上偏移的比例
  // 对应 CSS .note-superscript-container 的相对定位
  verticalOffsetRatio: -0.3,
};

// ============================================================
// 颜色配置
// ============================================================
const DEFAULT_COLORS = {
  // 右手音符颜色 - 对应 CSS 变量或 data 属性 rightHandColor
  rightHand: '#F4D096',
  
  // 左手音符颜色 - 对应 CSS 变量或 data 属性 leftHandColor
  leftHand: '#314D63',
  
  // 小节线颜色 - 对应 CSS .bar-line { background-color }
  barLine: '#000000',
  
  // 拍子分隔线颜色 - 对应 CSS .beat-line { background-color }
  beatLine: '#CCCCCC',
  
  // 细分分隔线颜色 - 对应 CSS .subdivision-line { background-color }
  subdivisionLine: '#E8E8E8',
  
  // 小节编号颜色 - 对应 CSS .measure-index { color }
  measureIndex: '#9AA0A6',
  
  // 备注文字颜色
  annotation: '#666666',
  
  // 上下手分隔线（中轴线）颜色
  handDivider: '#E0E0E0',
  
  // 背景颜色
  background: '#FFFFFF',
  
  // 备注背景颜色
  annotationBackground: 'rgba(255, 255, 255, 0.9)',
};

// ============================================================
// 编辑状态颜色
// ============================================================
const EDITING_COLORS = {
  // 右手编辑背景色
  rightHandEditBg: 'rgba(244,208,150,0.22)',
  
  // 左手编辑背景色
  leftHandEditBg: 'rgba(49,77,99,0.16)',
  
  // 右手编辑边框色
  rightHandEditBorder: '#F4D096',
  
  // 左手编辑边框色
  leftHandEditBorder: '#314D63',
};

// ============================================================
// 播放高亮参数
// ============================================================
const PLAYBACK_SETTINGS = {
  // 当前播放列高亮背景色
  highlightColor: 'rgba(255, 193, 7, 0.35)',
  
  // 高亮边框颜色
  highlightBorderColor: 'rgba(255, 152, 0, 0.6)',
  
  // 高亮边框宽度 (rpx)
  highlightBorderWidth: 2,
  
  // 淡出列的背景色
  fadeoutColor: 'rgba(255, 193, 7, 0.15)',
  
  // 淡出动画时长 (ms)
  fadeoutDuration: 200,
  
  // 光标层动画过渡时长 (ms) - 用于View层光标平滑移动
  cursorTransitionDuration: 80,
  
  // 光标圆角 (rpx)
  cursorBorderRadius: 4,
  
  // 光标层z-index
  cursorZIndex: 100,
  
  // 光标发光效果颜色
  cursorGlowColor: 'rgba(255, 193, 7, 0.5)',
  
  // 光标发光模糊半径 (px)
  cursorGlowBlur: 8,
};

// ============================================================
// Canvas转图片设置
// ============================================================
const CANVAS_IMAGE_SETTINGS = {
  // 图片格式
  fileType: 'png',
  
  // 图片质量 (0-1)
  quality: 1.0,
  
  // 是否在转图后销毁Canvas
  destroyCanvasAfterConvert: true,
  
  // 转图延迟 (ms) - 等待Canvas渲染完成
  convertDelay: 100,
  
  // 导出缩放倍数 - 用于提高图片清晰度
  exportScale: 2,
};

// ============================================================
// 重绘区域扩展参数（防止边缘残影）
// ============================================================
const REDRAW_SETTINGS = {
  // 重绘区域水平扩展像素 (px) - 防止相邻列元素残影
  horizontalPadding: 2,
  
  // 重绘区域垂直扩展像素 (px) - 防止上下元素残影
  verticalPadding: 2,
  
  // 重绘时是否同时刷新相邻分隔线
  refreshAdjacentLines: true,
};

// ============================================================
// 导出所有配置
// ============================================================
module.exports = {
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
  REDRAW_SETTINGS,
};
