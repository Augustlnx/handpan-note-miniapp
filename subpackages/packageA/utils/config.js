/**
 * 谱面导出配置文件
 * 
 * 【模式说明】
 * 导出共有5种模式：
 * 1. longImage - 长图模式（无分页，整个谱面导出为一张长图）
 * 2. pagedPortraitCompact - 分页A4竖向-紧凑模式
 * 3. pagedPortraitLoose - 分页A4竖向-宽松模式
 * 4. pagedLandscapeCompact - 分页A4横向-紧凑模式
 * 5. pagedLandscapeLoose - 分页A4横向-宽松模式
 * 
 * 【参数结构说明】
 * - COMMON_CONFIG: 所有模式共用的基础参数
 * - MODE_CONFIGS: 各模式特有的参数配置
 */

// ==================== A4 尺寸常量（像素，300 DPI） ====================
const A4_WIDTH = 2480;     // A4纵向宽度（约 210mm）
const A4_HEIGHT = 3508;    // A4纵向高度（约 297mm）
const CONTENT_PADDING = 120;  // 内容边距

// A4 横向尺寸（宽高互换）
const A4_LANDSCAPE_WIDTH = A4_HEIGHT;
const A4_LANDSCAPE_HEIGHT = A4_WIDTH;

// 内容区域宽度
const CONTENT_WIDTH = A4_WIDTH - CONTENT_PADDING * 2;
const CONTENT_LANDSCAPE_WIDTH = A4_LANDSCAPE_WIDTH - CONTENT_PADDING * 2;


// ==================== 所有模式共用的基础参数 ====================
const COMMON_CONFIG = {
  // ---------- 设备像素比 ----------
  dpr: 5,  // 设备像素比，值越高导出图片越清晰，但文件越大
  
  // ---------- 默认颜色配置 ----------
  defaultRightHandColor: '#F4D096',   // 右手音符默认颜色（金色）
  defaultLeftHandColor: '#314D63',    // 左手音符默认颜色（深蓝灰）
  defaultSingleColor: '#314D63',      // 单色模式默认颜色
  defaultMainTitleColor: '#314D63',   // 主标题默认颜色
  defaultSubTitleColor: '#8FB9AB',    // 副标题默认颜色
  
  // ---------- 中央横线颜色 ----------
  centerLineColor: '#E0E0E0',         // 小节中央横线颜色
  
  // ---------- 小节编号颜色 ----------
  measureIndexColor: '#9AA0A6',       // 小节编号颜色
  
  // ---------- 模块标签颜色 ----------
  moduleLabelColor: '#314D63',        // 模块编号颜色（如 A-1）
  moduleRemarkColor: '#999999',       // 模块备注颜色
  
  // ---------- 注记颜色 ----------
  annotationColor: '#666666',         // 注记文字颜色
  
  // ---------- 简介文字颜色 ----------
  introductionColor: '#666666',       // 简介文字颜色
  
  // ---------- 各种线条颜色 ----------
  measureLineColor: '#000000',        // 小节线（左右竖线）颜色
  beatLineColor: '#CCCCCC',           // 拍线（拍子分隔线）颜色
  subdivisionLineColor: '#E8E8E8',    // 音符分割线（16分音符分隔线）颜色
  
  // ---------- 音符轨道位置（百分比，相对于小节高度） ----------
  trackRightHand1: 0.12,   // 右手第一轨道位置（12%）
  trackRightHand2: 0.38,   // 右手第二轨道位置（38%）
  trackLeftHand1: 0.65,    // 左手第一轨道位置（65%）
  trackLeftHand2: 0.91,    // 左手第二轨道位置（91%）
  
  // ---------- 水印文字 ----------
  watermarkLabelText: '微信小程序',      // 右上角水印下方文字
  watermarkLabelColor: '#314D63',            // 水印文字颜色
  
  // ---------- 底部品牌标识回退文字 ----------
  brandingFallbackText: 'Orbit Note',        // 品牌logo加载失败时的回退文字
  brandingFallbackColor: '#DBCC97',          // 回退文字颜色
  brandingFallbackFont: 'italic 28px serif', // 回退文字字体
  
  // ---------- 文字水印（图片加载失败时的回退） ----------
  textWatermarkText: 'Handpan Note',
  textWatermarkColor: '#314D63',
  textWatermarkOpacity: 0.1,
  textWatermarkFont: 'bold 48px sans-serif',
  
  // ---------- rpx 转 px 比例 ----------
  rpxToPxRatio: 0.5,  // 1rpx ≈ 0.5px
};


// ==================== 各模式特有的参数配置 ====================

/**
 * 长图模式配置
 */
const LONG_IMAGE_CONFIG = {
  // ---------- 音符连携比例系数 ----------
  noteScaleFactor: 1.0,  // 长图模式不缩放
  
  // ---------- 标题区块连携比例系数 ----------
  // 控制标题区中的字体和元素大小
  titleScaleFactor: 1.0,  // 长图模式不缩放
  
  // ---------- 画布尺寸 ----------
  portraitWidth: 400,     // 竖向模式画布宽度
  landscapeWidth: 600,    // 横向模式画布宽度
  leftMargin: 10,         // 左边距
  contentPadding: 20,     // 内容两侧总边距（width - contentPadding = contentWidth）
  
  // ---------- 标题区块 ----------
  titleBlockHeight: 80,           // 标题区块总高度
  titleBlockTopPadding: 10,       // 标题区块顶部padding
  
  // 主标题
  mainTitleFontSize: 24,          // 主标题字号
  mainTitleFontWeight: 'bold',    // 主标题字重
  mainTitleOffsetY: 25,           // 主标题Y偏移（相对于currentY）
  mainTitleLineHeight: 35,        // 主标题占用的行高
  
  // 副标题
  subTitleFontSize: 14,           // 副标题字号
  subTitleOffsetY: 15,            // 副标题Y偏移
  subTitleLineHeight: 25,         // 副标题占用的行高
  
  // 简介
  introFontSize: 12,              // 简介字号
  introLineHeight: 16,            // 简介行高
  introMaxWidthRatio: 0.9,        // 简介最大宽度（相对于画布宽度的比例）
  introTopMargin: 5,              // 简介顶部间距
  introBottomMargin: 5,           // 简介底部间距
  
  // 参数信息行（速度、谱式、难度）
  paramsTopMargin: 12,            // 参数行顶部间距
  paramsRowHeight: 22,            // 参数行高度
  paramIconSize: 14,              // 参数图标大小
  paramIconTextGap: 6,            // 图标与文字间距
  paramValueFontSize: 13,         // 参数值字号
  paramValueFontWeight: 'bold',   // 参数值字重
  paramCol1XRatio: 0.17,          // 速度列X位置（相对于宽度的比例）
  paramCol2XRatio: 0.50,          // 谱式列X位置
  paramCol3XRatio: 0.83,          // 难度列X位置
  paramColOffset: 40,             // 列内容相对于列位置的偏移
  
  // 难度星星
  starSize: 9,                    // 星星大小
  starGap: 1,                     // 星星间距
  starActiveColor: '#FFD700',     // 激活星星颜色
  starInactiveColor: '#E0E0E0',   // 未激活星星颜色
  starInactiveOpacity: 0.3,       // 使用图标时未激活星星的透明度
  
  // ---------- 模块区域 ----------
  notationLabelHeight: 50,        // 模块标签区域高度（包含编号和备注）
  sectionGap: 15,                 // 模块间距
  sectionBottomPadding: 15,       // 模块底部padding
  bottomPadding: 70,              // 页面底部预留间距
  
  // 模块标签字号
  moduleLabelFontSizePortrait: 18,   // 竖向模式模块编号字号
  moduleLabelFontSizeLandscape: 14,  // 横向模式模块编号字号
  moduleRemarkFontSizePortrait: 16,  // 竖向模式备注字号
  moduleRemarkFontSizeLandscape: 12, // 横向模式备注字号
  moduleLabelRemarkGap: 12,          // 编号与备注的间距
  moduleLabelOffsetY: 20,            // 模块标签Y偏移
  moduleContentOffsetY: 50,          // 模块内容开始的Y偏移（相对于模块起始Y）
  
  // ---------- 小节区域 ----------
  // 紧凑模式默认值
  compactMeasureHeightRpx: 160,   // 紧凑模式小节高度（rpx）
  compactLineSpacingRpx: 55,      // 紧凑模式行间距（rpx）
  compactNoteFontSizeRpx: 28,     // 紧凑模式音符字号（rpx）
  
  // 宽松模式默认值
  looseMeasureHeightRpx: 240,     // 宽松模式小节高度（rpx）
  looseLineSpacingRpx: 88,        // 宽松模式行间距（rpx）
  looseNoteFontSizeRpx: 36,       // 宽松模式音符字号（rpx）
  
  // 小节计数字号
  measureIndexFontSizeSingle: 11,   // 单小节模式字号
  measureIndexFontSizeMulti: 10,    // 多小节模式字号
  measureIndexOffsetY: 5,           // 小节编号Y偏移（相对于小节顶部，向上）
  
  // ---------- 线条宽度 ----------
  measureLineWidth: 2,              // 小节线宽度（左右竖线）
  beatLineWidth: 1,                 // 拍线宽度
  subdivisionLineWidth: 0.5,        // 音符分割线宽度
  centerLineWidth: 0.5,             // 中央横线宽度
  
  // 音符分割线的垂直范围（相对于小节高度的百分比）
  subdivisionLineTopRatio: 0.25,    // 分割线顶部位置
  subdivisionLineBottomRatio: 0.75, // 分割线底部位置
  
  // ---------- 音符相关参数 ----------
  // 紧凑模式
  compactDotSizeRatio: 0.20,        // 紧凑模式音高圆点大小（相对于字号）
  compactDotGap: 0.5,               // 紧凑模式音高圆点间距（固定px）
  compactSupDotSizeRatio: 0.13,     // 紧凑模式上标音高圆点大小
  
  // 宽松模式
  looseDotSizeRatio: 0.25,          // 宽松模式音高圆点大小
  looseDotGapRatio: 0.03,           // 宽松模式音高圆点间距（相对于字号）
  looseSupDotSizeRatio: 0.12,       // 宽松模式上标音高圆点大小
  
  // 上标
  supFontSizeRatio: 0.55,           // 上标字号（相对于主音符字号）
  supOffsetXRatio: 0.5,             // 上标X偏移（相对于主音符字号）
  supOffsetYRatio: 0.4,             // 上标Y偏移（相对于主音符字号）
  
  // 上标音高圆点偏移（相对于上标字号）
  supOctaveUpOffsetRatio: 0.65,     // 上标上加点偏移
  supOctaveDownOffsetRatioCompact: 0.45,  // 紧凑模式上标下加点偏移
  supOctaveDownOffsetRatioLoose: 0.4,     // 宽松模式上标下加点偏移
  
  // 主音符音高圆点偏移
  octaveUpTextHalfHeightRatio: 0.45,      // 文字半高比例（用于计算偏移）
  octaveUpOffsetMultiplier: 1.1,          // 上加点偏移乘数
  octaveDownOffsetMultiplierCompact: 0.65, // 紧凑模式下加点偏移乘数
  octaveDownOffsetMultiplierLoose: 0.85,   // 宽松模式下加点偏移乘数
  
  // 下划线
  underlineThicknessRatio: 0.08,    // 下划线粗细（相对于字号）
  underlineWidthRatio: 0.8,         // 下划线宽度（相对于字号）
  underlineOffsetRatio: 0.5,        // 下划线偏移（相对于文字半高）
  underlineExtraOffset: 3,          // 下划线额外偏移（px）
  
  // 注记字号
  annotationFontSizeRatio: 0.65,    // 注记字号（相对于音符字号）
  annotationOffsetY: 8,             // 注记Y偏移（相对于小节顶部，向上）
  
  // ---------- 水印配置 ----------
  // 右上角水印（mini_program_code.jpg）
  watermarkMargin: 20,                    // 水印边距
  watermarkScaleBase: 0.12,               // 水印基础比例（相对于页面宽度）
  watermarkLabelGap: 6,                   // 水印与下方文字间距
  watermarkLabelFontSize: 8,             // 水印下方文字字号
  
  // 右下角背景图（bg2.png）
  bgOpacity: 0.1,                         // 背景图透明度
  bgSizeScale: 0.67,                      // 背景图大小比例（相对于页面宽度）
  bgMaxHeightRatio: 0.5,                  // 背景图最大高度（相对于页面高度）
  
  // 底部品牌logo（logo3.png）
  brandingHeight: 24,                     // 品牌logo高度
  brandingBottomMargin: 15,               // 品牌logo距底部距离
};

/**
 * 分页A4竖向-紧凑模式配置
 */
const PAGED_PORTRAIT_COMPACT_CONFIG = {
  // ---------- 页面尺寸 ----------
  // 使用 A4_WIDTH, A4_HEIGHT, CONTENT_PADDING 计算
  
  // ---------- 音符连携比例系数 ----------
  // 整体缩放音符相关参数（字号、音高圆点、上标、下划线等）
  // 值为1.0表示不缩放，小于1.0表示缩小，大于1.0表示放大
  noteScaleFactor: 0.7,
  
  // ---------- 标题区块连携比例系数 ----------
  // 控制标题区中的字体和元素大小
  titleScaleFactor: 0.75,  // 紧凑模式缩小标题区
  
  // ---------- 分页特有参数 ----------
  // 非首页顶部边距（从顶部边距开始，不显示水印时使用）
  nonFirstPageTopMargin: 15,
  
  // ---------- 标题区块 ----------
  titleBlockHeight: 80,
  titleBlockTopPadding: 0,        // 分页模式顶部从 topMargin 开始
  
  // 主标题
  mainTitleFontSize: 24,
  mainTitleFontWeight: 'bold',
  mainTitleOffsetY: 25,
  mainTitleLineHeight: 35,
  
  // 副标题
  subTitleFontSize: 14,
  subTitleOffsetY: 15,
  subTitleLineHeight: 25,
  
  // 简介
  introFontSize: 12,
  introLineHeight: 16,
  introMaxWidthRatio: 0.9,
  introTopMargin: 5,
  introBottomMargin: 5,
  
  // 参数信息行
  paramsTopMargin: 12,
  paramsRowHeight: 22,
  paramIconSize: 14,
  paramIconTextGap: 6,
  paramValueFontSize: 13,
  paramValueFontWeight: 'bold',
  paramCol1XRatio: 0.17,
  paramCol2XRatio: 0.50,
  paramCol3XRatio: 0.83,
  paramColOffset: 40,
  
  // 难度星星
  starSize: 9,
  starGap: 1,
  starActiveColor: '#FFD700',
  starInactiveColor: '#E0E0E0',
  starInactiveOpacity: 0.3,
  
  // ---------- 模块区域 ----------
  notationLabelHeight: 25,        // 分页模式标签高度较小
  sectionGap: 15,
  sectionBottomPadding: 15,
  bottomReserve: 10,              // 底部预留间距（避免内容顶格底部）
  
  // 模块标签字号（分页竖向使用竖向字号）
  moduleLabelFontSize: 12,
  moduleRemarkFontSize: 10,
  moduleLabelRemarkGap: 8,
  moduleLabelOffsetY: 20,
  moduleContentOffsetY: 50,
  
  // ---------- 小节区域（紧凑模式） ----------
  defaultMeasureHeightRpx: 130,
  defaultLineSpacingRpx: 55,
  defaultNoteFontSizeRpx: 28,
  
  // 谱面高度计算时的乘数（用于计算模块总高度）
  measureHeightMultiplier: 1.5,
  
  // 小节计数字号
  measureIndexFontSizeSingle: 11,
  measureIndexFontSizeMulti: 10,
  measureIndexOffsetY: 5,
  
  // ---------- 线条宽度 ----------
  measureLineWidth: 2,
  beatLineWidth: 1,
  subdivisionLineWidth: 0.5,
  centerLineWidth: 0.5,
  subdivisionLineTopRatio: 0.25,
  subdivisionLineBottomRatio: 0.75,
  
  // ---------- 音符相关参数（紧凑模式） ----------
  dotSizeRatio: 0.19,
  dotGap: 0.5,
  supDotSizeRatio: 0.13,
  supFontSizeRatio: 0.55,
  supOffsetXRatio: 0.5,
  supOffsetYRatio: 0.4,
  supOctaveUpOffsetRatio: 0.65,
  supOctaveDownOffsetRatio: 0.45,
  octaveUpTextHalfHeightRatio: 0.45,
  octaveUpOffsetMultiplier: 1.1,
  octaveDownOffsetMultiplier: 0.85,
  underlineThicknessRatio: 0.08,
  underlineWidthRatio: 0.8,
  underlineOffsetRatio: 0.5,
  underlineExtraOffset: 2,
  annotationFontSizeRatio: 0.65,
  annotationOffsetY: 8,
  
  // ---------- 琶音符号参数（紧凑模式） ----------
  arpeggioWidth: 6,                      // 琶音符号宽度
  
  // ---------- 水印配置 ----------
  watermarkMargin: 20,
  watermarkScaleBase: 0.08,
  watermarkLandscapeScaleMultiplier: 1,  // 竖向模式不缩小
  watermarkLabelGap: 6,
  watermarkLabelFontSize: 10,
  watermarkReserveTopExtra: 10,          // 水印下方额外预留空间
  
  // 右下角背景图
  bgOpacity: 0.1,
  bgSizeScale: 0.67,
  bgLandscapeScaleMultiplier: 1,         // 竖向模式不缩小
  bgMaxHeightRatio: 0.5,
  
  // 底部品牌logo
  brandingHeight: 24,
  brandingBottomMargin: 15,
  
  // ---------- 分页特有参数 ----------
  measuresPerRowFallback: 250,            // 每行小节数回退计算的除数
};

/**
 * 分页A4竖向-宽松模式配置
 */
const PAGED_PORTRAIT_LOOSE_CONFIG = {
  // ---------- 页面尺寸 ----------
  // 使用 A4_WIDTH, A4_HEIGHT, CONTENT_PADDING 计算
  
  // ---------- 音符连携比例系数 ----------
  noteScaleFactor: 1.0,  // 宽松模式不缩放
  
  // ---------- 标题区块连携比例系数 ----------
  titleScaleFactor: 1.0,  // 宽松模式不缩放
  
  // ---------- 分页特有参数 ----------
  nonFirstPageTopMargin: 15,
  
  // ---------- 标题区块 ----------
  titleBlockHeight: 80,
  titleBlockTopPadding: 0,
  
  // 主标题
  mainTitleFontSize: 24,
  mainTitleFontWeight: 'bold',
  mainTitleOffsetY: 25,
  mainTitleLineHeight: 35,
  
  // 副标题
  subTitleFontSize: 14,
  subTitleOffsetY: 15,
  subTitleLineHeight: 25,
  
  // 简介
  introFontSize: 12,
  introLineHeight: 16,
  introMaxWidthRatio: 0.9,
  introTopMargin: 5,
  introBottomMargin: 5,
  
  // 参数信息行
  paramsTopMargin: 12,
  paramsRowHeight: 22,
  paramIconSize: 14,
  paramIconTextGap: 6,
  paramValueFontSize: 13,
  paramValueFontWeight: 'bold',
  paramCol1XRatio: 0.17,
  paramCol2XRatio: 0.50,
  paramCol3XRatio: 0.83,
  paramColOffset: 40,
  
  // 难度星星
  starSize: 9,
  starGap: 1,
  starActiveColor: '#FFD700',
  starInactiveColor: '#E0E0E0',
  starInactiveOpacity: 0.3,
  
  // ---------- 模块区域 ----------
  notationLabelHeight: 25,
  sectionGap: 15,
  sectionBottomPadding: 15,
  bottomReserve: 10,
  
  // 模块标签字号
  moduleLabelFontSize: 18,
  moduleRemarkFontSize: 16,
  moduleLabelRemarkGap: 12,
  moduleLabelOffsetY: 20,
  moduleContentOffsetY: 50,
  
  // ---------- 小节区域（宽松模式） ----------
  defaultMeasureHeightRpx: 200,
  defaultLineSpacingRpx: 78,
  defaultNoteFontSizeRpx: 36,
  
  measureHeightMultiplier: 1.5,
  
  // 小节计数字号
  measureIndexFontSizeSingle: 11,
  measureIndexFontSizeMulti: 10,
  measureIndexOffsetY: 5,
  
  // ---------- 线条宽度 ----------
  measureLineWidth: 2,
  beatLineWidth: 1,
  subdivisionLineWidth: 0.5,
  centerLineWidth: 0.5,
  subdivisionLineTopRatio: 0.25,
  subdivisionLineBottomRatio: 0.75,
  
  // ---------- 音符相关参数（宽松模式） ----------
  dotSizeRatio: 0.24,
  dotGapRatio: 0.03,
  supDotSizeRatio: 0.12,
  supFontSizeRatio: 0.55,
  supOffsetXRatio: 0.5,
  supOffsetYRatio: 0.4,
  supOctaveUpOffsetRatio: 0.68,
  supOctaveDownOffsetRatio: 0.4,
  octaveUpTextHalfHeightRatio: 0.45,
  octaveUpOffsetMultiplier: 1.1,
  octaveDownOffsetMultiplier: 0.85,
  underlineThicknessRatio: 0.1,
  underlineWidthRatio: 0.8,
  underlineOffsetRatio: 0.6,
  underlineExtraOffset: 3,
  annotationFontSizeRatio: 0.65,
  annotationOffsetY: 8,
  
  // ---------- 琶音符号参数（宽松模式） ----------
  arpeggioWidth: 9,                      // 琶音符号宽度（宽松模式更大）
  
  // ---------- 水印配置 ----------
  watermarkMargin: 20,
  watermarkScaleBase: 0.08,
  watermarkLandscapeScaleMultiplier: 1,
  watermarkLabelGap: 6,
  watermarkLabelFontSize: 10,
  watermarkReserveTopExtra: 10,
  
  // 右下角背景图
  bgOpacity: 0.1,
  bgSizeScale: 0.67,
  bgLandscapeScaleMultiplier: 1,
  bgMaxHeightRatio: 0.5,
  
  // 底部品牌logo
  brandingHeight: 24,
  brandingBottomMargin: 15,
  
  // ---------- 分页特有参数 ----------
  measuresPerRowFallback: 250,
};

/**
 * 分页A4横向-紧凑模式配置
 */
const PAGED_LANDSCAPE_COMPACT_CONFIG = {
  // ---------- 页面尺寸 ----------
  // 使用 A4_LANDSCAPE_WIDTH, A4_LANDSCAPE_HEIGHT, CONTENT_PADDING 计算
  
  // ---------- 音符连携比例系数 ----------
  noteScaleFactor: 1.0,  // 横向紧凑模式不缩放
  
  // ---------- 标题区块连携比例系数 ----------
  titleScaleFactor: 1.0,  // 横向紧凑模式不缩放
  
  // ---------- 分页特有参数 ----------
  nonFirstPageTopMargin: 15,
  
  // ---------- 标题区块 ----------
  titleBlockHeight: 80,
  titleBlockTopPadding: 0,
  
  // 主标题
  mainTitleFontSize: 24,
  mainTitleFontWeight: 'bold',
  mainTitleOffsetY: 25,
  mainTitleLineHeight: 35,
  
  // 副标题
  subTitleFontSize: 14,
  subTitleOffsetY: 15,
  subTitleLineHeight: 25,
  
  // 简介
  introFontSize: 12,
  introLineHeight: 16,
  introMaxWidthRatio: 0.9,
  introTopMargin: 5,
  introBottomMargin: 5,
  
  // 参数信息行
  paramsTopMargin: 12,
  paramsRowHeight: 22,
  paramIconSize: 14,
  paramIconTextGap: 6,
  paramValueFontSize: 13,
  paramValueFontWeight: 'bold',
  paramCol1XRatio: 0.17,
  paramCol2XRatio: 0.50,
  paramCol3XRatio: 0.83,
  paramColOffset: 40,
  
  // 难度星星
  starSize: 9,
  starGap: 1,
  starActiveColor: '#FFD700',
  starInactiveColor: '#E0E0E0',
  starInactiveOpacity: 0.3,
  
  // ---------- 模块区域 ----------
  notationLabelHeight: 25,
  sectionGap: 15,
  sectionBottomPadding: 15,
  bottomReserve: 10,
  
  // 模块标签字号（横向模式字号较小）
  moduleLabelFontSize: 14,
  moduleRemarkFontSize: 12,
  moduleLabelRemarkGap: 12,
  moduleLabelOffsetY: 20,
  moduleContentOffsetY: 50,
  
  // ---------- 小节区域（紧凑模式） ----------
  defaultMeasureHeightRpx: 160,
  defaultLineSpacingRpx: 55,
  defaultNoteFontSizeRpx: 28,
  
  measureHeightMultiplier: 1.5,
  
  // 小节计数字号
  measureIndexFontSizeSingle: 11,
  measureIndexFontSizeMulti: 10,
  measureIndexOffsetY: 5,
  
  // ---------- 线条宽度 ----------
  measureLineWidth: 2,
  beatLineWidth: 1,
  subdivisionLineWidth: 0.5,
  centerLineWidth: 0.5,
  subdivisionLineTopRatio: 0.25,
  subdivisionLineBottomRatio: 0.75,
  
  // ---------- 音符相关参数（紧凑模式） ----------
  dotSizeRatio: 0.19,
  dotGap: 0.5,
  supDotSizeRatio: 0.13,
  supFontSizeRatio: 0.55,
  supOffsetXRatio: 0.5,
  supOffsetYRatio: 0.4,
  supOctaveUpOffsetRatio: 0.65,
  supOctaveDownOffsetRatio: 0.45,
  octaveUpTextHalfHeightRatio: 0.45,
  octaveUpOffsetMultiplier: 1.1,
  octaveDownOffsetMultiplier: 0.85,
  underlineThicknessRatio: 0.08,
  underlineWidthRatio: 0.8,
  underlineOffsetRatio: 0.5,
  underlineExtraOffset: 3,
  annotationFontSizeRatio: 0.65,
  annotationOffsetY: 8,
  
  // ---------- 琶音符号参数（紧凑模式） ----------
  arpeggioWidth: 6,                      // 琶音符号宽度
  
  // ---------- 水印配置 ----------
  watermarkMargin: 20,
  watermarkScaleBase: 0.08,
  watermarkLandscapeScaleMultiplier: 2/3,  // 横向模式水印缩小1/3
  watermarkLabelGap: 6,
  watermarkLabelFontSize: 10,
  watermarkReserveTopExtra: 10,
  
  // 右下角背景图
  bgOpacity: 0.1,
  bgSizeScale: 0.67,
  bgLandscapeScaleMultiplier: 0.5,         // 横向模式背景图减半
  bgMaxHeightRatio: 0.5,
  
  // 底部品牌logo
  brandingHeight: 24,
  brandingBottomMargin: 15,
  
  // ---------- 分页特有参数 ----------
  measuresPerRowFallback: 250,
};

/**
 * 分页A4横向-宽松模式配置
 */
const PAGED_LANDSCAPE_LOOSE_CONFIG = {
  // ---------- 页面尺寸 ----------
  // 使用 A4_LANDSCAPE_WIDTH, A4_LANDSCAPE_HEIGHT, CONTENT_PADDING 计算
  
  // ---------- 音符连携比例系数 ----------
  noteScaleFactor: 1.0,  // 横向宽松模式不缩放
  
  // ---------- 标题区块连携比例系数 ----------
  titleScaleFactor: 1.0,  // 横向宽松模式不缩放
  
  // ---------- 分页特有参数 ----------
  nonFirstPageTopMargin: 15,
  
  // ---------- 标题区块 ----------
  titleBlockHeight: 80,
  titleBlockTopPadding: 0,
  
  // 主标题
  mainTitleFontSize: 24,
  mainTitleFontWeight: 'bold',
  mainTitleOffsetY: 25,
  mainTitleLineHeight: 35,
  
  // 副标题
  subTitleFontSize: 14,
  subTitleOffsetY: 15,
  subTitleLineHeight: 25,
  
  // 简介
  introFontSize: 12,
  introLineHeight: 16,
  introMaxWidthRatio: 0.9,
  introTopMargin: 5,
  introBottomMargin: 5,
  
  // 参数信息行
  paramsTopMargin: 12,
  paramsRowHeight: 22,
  paramIconSize: 14,
  paramIconTextGap: 6,
  paramValueFontSize: 13,
  paramValueFontWeight: 'bold',
  paramCol1XRatio: 0.17,
  paramCol2XRatio: 0.50,
  paramCol3XRatio: 0.83,
  paramColOffset: 40,
  
  // 难度星星
  starSize: 9,
  starGap: 1,
  starActiveColor: '#FFD700',
  starInactiveColor: '#E0E0E0',
  starInactiveOpacity: 0.3,
  
  // ---------- 模块区域 ----------
  notationLabelHeight: 25,
  sectionGap: 15,
  sectionBottomPadding: 15,
  bottomReserve: 10,
  
  // 模块标签字号（横向模式字号较小）
  moduleLabelFontSize: 14,
  moduleRemarkFontSize: 12,
  moduleLabelRemarkGap: 12,
  moduleLabelOffsetY: 20,
  moduleContentOffsetY: 50,
  
  // ---------- 小节区域（宽松模式） ----------
  defaultMeasureHeightRpx: 240,
  defaultLineSpacingRpx: 88,
  defaultNoteFontSizeRpx: 36,
  
  measureHeightMultiplier: 1.5,
  
  // 小节计数字号
  measureIndexFontSizeSingle: 11,
  measureIndexFontSizeMulti: 10,
  measureIndexOffsetY: 5,
  
  // ---------- 线条宽度 ----------
  measureLineWidth: 2,
  beatLineWidth: 1,
  subdivisionLineWidth: 0.5,
  centerLineWidth: 0.5,
  subdivisionLineTopRatio: 0.25,
  subdivisionLineBottomRatio: 0.75,
  
  // ---------- 音符相关参数（宽松模式） ----------
  dotSizeRatio: 0.24,
  dotGapRatio: 0.03,
  supDotSizeRatio: 0.12,
  supFontSizeRatio: 0.55,
  supOffsetXRatio: 0.5,
  supOffsetYRatio: 0.4,
  supOctaveUpOffsetRatio: 0.65,
  supOctaveDownOffsetRatio: 0.4,
  octaveUpTextHalfHeightRatio: 0.45,
  octaveUpOffsetMultiplier: 1.1,
  octaveDownOffsetMultiplier: 0.85,
  underlineThicknessRatio: 0.08,
  underlineWidthRatio: 0.8,
  underlineOffsetRatio: 0.5,
  underlineExtraOffset: 3,
  annotationFontSizeRatio: 0.65,
  annotationOffsetY: 8,
  
  // ---------- 琶音符号参数（宽松模式） ----------
  arpeggioWidth: 9,                      // 琶音符号宽度（宽松模式更大）
  
  // ---------- 水印配置 ----------
  watermarkMargin: 20,
  watermarkScaleBase: 0.08,
  watermarkLandscapeScaleMultiplier: 2/3,
  watermarkLabelGap: 6,
  watermarkLabelFontSize: 10,
  watermarkReserveTopExtra: 10,
  
  // 右下角背景图
  bgOpacity: 0.1,
  bgSizeScale: 0.67,
  bgLandscapeScaleMultiplier: 0.5,
  bgMaxHeightRatio: 0.5,
  
  // 底部品牌logo
  brandingHeight: 24,
  brandingBottomMargin: 15,
  
  // ---------- 分页特有参数 ----------
  measuresPerRowFallback: 250,
};


// ==================== 模式配置映射 ====================

/**
 * 根据导出参数获取对应的模式配置
 * @param {Object} options - 导出选项
 * @param {string} options.exportMode - 'long' | 'paged'
 * @param {string} options.a4Orientation - 'portrait' | 'landscape'
 * @param {string} options.exportLayoutMode - 'compact' | 'loose'
 * @returns {Object} 合并后的配置对象
 */
function getExportConfig(options) {
  const exportMode = options.exportMode || 'long';
  const a4Orientation = options.a4Orientation || 'portrait';
  const exportLayoutMode = options.exportLayoutMode || 'compact';
  
  let modeConfig;
  
  if (exportMode === 'long') {
    // 长图模式
    modeConfig = LONG_IMAGE_CONFIG;
  } else {
    // 分页模式
    if (a4Orientation === 'landscape') {
      // 横向
      modeConfig = exportLayoutMode === 'loose' 
        ? PAGED_LANDSCAPE_LOOSE_CONFIG 
        : PAGED_LANDSCAPE_COMPACT_CONFIG;
    } else {
      // 竖向
      modeConfig = exportLayoutMode === 'loose'
        ? PAGED_PORTRAIT_LOOSE_CONFIG
        : PAGED_PORTRAIT_COMPACT_CONFIG;
    }
  }
  
  // 合并通用配置和模式配置
  return Object.assign({}, COMMON_CONFIG, modeConfig);
}

/**
 * 判断当前模式是否为紧凑模式
 * @param {string} exportLayoutMode - 'compact' | 'loose'
 * @returns {boolean}
 */
function isCompactMode(exportLayoutMode) {
  return exportLayoutMode !== 'loose';
}

/**
 * 判断当前是否为横向模式（A4横向或长图横向）
 * @param {Object} options - 导出选项
 * @returns {boolean}
 */
function isLandscapeMode(options) {
  if (options.exportMode === 'paged') {
    return options.a4Orientation === 'landscape';
  }
  return options.orientation === 'landscape';
}


// ==================== 导出模块 ====================

module.exports = {
  // A4 尺寸常量
  A4_WIDTH,
  A4_HEIGHT,
  A4_LANDSCAPE_WIDTH,
  A4_LANDSCAPE_HEIGHT,
  CONTENT_PADDING,
  CONTENT_WIDTH,
  CONTENT_LANDSCAPE_WIDTH,
  
  // 配置对象
  COMMON_CONFIG,
  LONG_IMAGE_CONFIG,
  PAGED_PORTRAIT_COMPACT_CONFIG,
  PAGED_PORTRAIT_LOOSE_CONFIG,
  PAGED_LANDSCAPE_COMPACT_CONFIG,
  PAGED_LANDSCAPE_LOOSE_CONFIG,
  
  // 工具函数
  getExportConfig,
  isCompactMode,
  isLandscapeMode,
};
