// 谱面导出工具 - 纯前端实现（Canvas 绘制）

// 引入配置文件
const exportConfig = require('./config.js');

// A4 尺寸常量（从配置文件读取）
const A4_WIDTH = exportConfig.A4_WIDTH;
const A4_HEIGHT = exportConfig.A4_HEIGHT;
const CONTENT_PADDING = exportConfig.CONTENT_PADDING;
const CONTENT_WIDTH = exportConfig.CONTENT_WIDTH;
const A4_LANDSCAPE_WIDTH = exportConfig.A4_LANDSCAPE_WIDTH;
const A4_LANDSCAPE_HEIGHT = exportConfig.A4_LANDSCAPE_HEIGHT;
const CONTENT_LANDSCAPE_WIDTH = exportConfig.CONTENT_LANDSCAPE_WIDTH;

// ==================== 全局单例模式 ====================
// 【重要】解决真机上多次导出时 Canvas 和 Image 资源问题

// 全局单例 Canvas 实例
var _sharedCanvas = null;

// 全局 Image 对象缓存（缓存已创建的 Image 对象，而非 Base64 数据）
var _imageObjCache = {};

// 全局 Base64 数据缓存（作为备用，当 Image 对象需要重建时使用）
var _imageBase64Cache = {};

/**
 * 获取全局共享的 OffscreenCanvas 实例（单例模式）
 * @returns {OffscreenCanvas} 共享的 Canvas 实例
 */
function getSharedCanvas() {
  if (!_sharedCanvas) {
    console.log('[getSharedCanvas] 创建全局共享 Canvas 实例');
    _sharedCanvas = wx.createOffscreenCanvas({ type: '2d' });
  } else {
    console.log('[getSharedCanvas] 复用已有 Canvas 实例');
  }
  return _sharedCanvas;
}

/**
 * 重置 Canvas 上下文状态（在每次绑制前调用）
 * 由于 Canvas 是复用的，需要清理上一次绑制残留的状态
 * @param {OffscreenCanvas} canvas - Canvas 实例
 * @param {number} width - 目标宽度
 * @param {number} height - 目标高度
 * @returns {CanvasRenderingContext2D} 重置后的上下文
 */
function resetCanvasContext(canvas, width, height) {
  // 设置画布尺寸（这会隐式清空画布内容）
  canvas.width = width;
  canvas.height = height;
  
  var ctx = canvas.getContext('2d');
  
  // 显式重置变换矩阵
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  
  // 重置透明度
  ctx.globalAlpha = 1;
  
  // 重置合成操作
  ctx.globalCompositeOperation = 'source-over';
  
  // 重置裁剪区域（通过 save/restore 无法重置，但重设 canvas 尺寸会重置）
  
  // 重置绑制样式
  ctx.fillStyle = '#000000';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 1;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';
  
  // 重置字体
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'start';
  ctx.textBaseline = 'alphabetic';
  
  // 重置阴影
  ctx.shadowBlur = 0;
  ctx.shadowColor = 'rgba(0, 0, 0, 0)';
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  
  // 显式清空画布（双重保险）
  ctx.clearRect(0, 0, width, height);
  
  console.log('[resetCanvasContext] Canvas 上下文已重置, 尺寸:', width, 'x', height);
  
  return ctx;
}

// ==================== 全局单例模式结束 ====================

// 将错误对象转换为可读提示
function readableError(err, fallback) {
  if (!err) return fallback || '未知错误';
  if (typeof err === 'string') return err;
  if (err.errMsg) return err.errMsg;
  if (err.message) return err.message;
  return fallback || '未知错误';
}

// 解析简谱音符，提取基础音符、八度标记、下划线、上标和附点
// 支持格式: 1' (高八度), 1,, (低两个八度), 1_ (带下划线), ^{H}1, 1^{H}, 1* (附点)
// @param {string} note - 音符字符串
// @returns {Object} {baseNote, octaveUp, octaveDown, underline, leftSup, rightSup, hasDot}
function parseSimplifiedNote(note) {
  if (!note || typeof note !== 'string') {
    return { baseNote: '', octaveUp: 0, octaveDown: 0, underline: false, leftSup: '', rightSup: '', hasDot: false };
  }
  
  let octaveUp = 0;
  let octaveDown = 0;
  let underline = false;
  let hasDot = false; // 附点标记
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
  
  // 检查是否有 * （附点标记）- 在末尾
  if (remaining.endsWith('*')) {
    hasDot = true;
    remaining = remaining.slice(0, -1);
  }
  
  // 统计 ' 的数量（高八度）
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] === "'") {
      octaveUp++;
    }
  }
  
  // 统计 , 的数量（低八度）
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] === ',') {
      octaveDown++;
    }
  }
  
  // 检查是否有 _ （时值减半下划线）
  if (remaining.indexOf('_') !== -1) {
    underline = true;
  }
  
  // 提取基础音符（移除 ', , 和 _）
  for (let i = 0; i < remaining.length; i++) {
    if (remaining[i] !== "'" && remaining[i] !== ',' && remaining[i] !== '_') {
      baseNote += remaining[i];
    }
  }
  
  return {
    baseNote,
    octaveUp,
    octaveDown,
    underline,
    leftSup,
    rightSup,
    hasDot,
    // 兼容旧版本的属性
    hasOctaveUp: octaveUp > 0,
    hasOctaveDown: octaveDown > 0
  };
}

// 解析上标内容的音高信息
function parseSupContent(supStr) {
  const result = {
    baseNote: '',
    octaveUp: 0,
    octaveDown: 0
  };
  
  if (!supStr || supStr === '') return result;
  
  // 统计 ' 的数量（升八度）
  for (let i = 0; i < supStr.length; i++) {
    if (supStr[i] === "'") {
      result.octaveUp++;
    }
  }
  
  // 统计 , 的数量（降八度）
  for (let i = 0; i < supStr.length; i++) {
    if (supStr[i] === ',') {
      result.octaveDown++;
    }
  }
  
  // 提取基础音符（移除特殊符号）
  for (let i = 0; i < supStr.length; i++) {
    if (supStr[i] !== "'" && supStr[i] !== ',') {
      result.baseNote += supStr[i];
    }
  }
  
  return result;
}

// 绘制多个八度点（上加点或下加点）
// @param {CanvasRenderingContext2D} ctx - Canvas 上下文
// @param {number} x - 中心X坐标
// @param {number} y - 起始Y坐标
// @param {boolean} isUp - 是否是上加点（true=上加点，false=下加点）
// @param {number} dotCount - 点的数量
// @param {number} dotSize - 点的大小
// @param {number} dotGap - 点之间的间距
// @param {string} color - 点的颜色
function drawOctaveDots(ctx, x, y, isUp, dotCount, dotSize, dotGap, color) {
  if (!dotCount || dotCount <= 0) return;
  
  const direction = isUp ? -1 : 1; // 上加点向上，下加点向下
  
  ctx.fillStyle = color || '#000000';
  for (let i = 0; i < dotCount; i++) {
    const dotY = y + (i * (dotSize + dotGap) * direction);
    ctx.beginPath();
    ctx.arc(x, dotY, dotSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 绘制下划线
function drawUnderline(ctx, x, y, width, thickness, color) {
  ctx.strokeStyle = color || '#000000';
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
}

// 绘制琶音符号（竖向波浪线）
// @param {CanvasRenderingContext2D} ctx - Canvas 上下文
// @param {number} x - 左上角x坐标
// @param {number} y - 左上角y坐标  
// @param {number} width - 符号宽度
// @param {number} height - 符号高度
function drawArpeggioSymbol(ctx, x, y, width, height) {
  const centerX = x + width / 2;
  const startY = y + height * 0.1;
  const endY = y + height * 0.9;
  const waveHeight = endY - startY;
  
  // 波浪线参数
  const amplitude = width * 0.35; // 波浪振幅
  
  ctx.save();
  ctx.strokeStyle = '#333333';
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  
  ctx.beginPath();
  ctx.moveTo(centerX, startY);
  
  // 绘制波浪曲线（使用正弦波）
  const steps = 30;
  for (let i = 1; i <= steps; i++) {
    const progress = i / steps;
    const cy = startY + progress * waveHeight;
    const cx = centerX + Math.sin(progress * Math.PI * 8) * amplitude;
    ctx.lineTo(cx, cy);
  }
  
  ctx.stroke();
  ctx.restore();
}

// 弹窗提示导出失败原因，方便调试
function notifyExportFailure(err) {
  const reason = readableError(err, '导出失败，原因未知');
  wx.showModal({
    title: '导出失败',
    content: reason,
    showCancel: false
  });
}

/**
 * 导出谱面为 PNG 图片
 * @param {Object} options - 包含 notations, mainTitle, subTitle, globalTempo, exportMode ('long' | 'paged')
 * @returns {Promise<Array|String>} - 返回临时文件路径（长图模式）或路径数组（分页模式）
 */
function exportNotationToPNG(options) {
  var exportMode = options.exportMode;
  if (exportMode === undefined) exportMode = 'long';

  var promise = (exportMode === 'paged') ? exportAsPages(options) : exportAsLongImage(options);
  return promise.catch(function(err){
    console.error('导出PNG失败', err);
    notifyExportFailure(err);
    return Promise.reject(err);
  });
}

/**
 * 导出为长图
 */
function exportAsLongImage(data) {
  return new Promise((resolve, reject) => {
    try {
      // 【单例模式】使用全局共享的 Canvas 实例
      const canvas = getSharedCanvas();
      console.log('[exportAsLongImage] 使用共享 Canvas 实例');
      drawNotationOnCanvas(canvas, data, resolve, reject, false);
    } catch (e) {
      console.error('获取 Canvas 失败:', e);
      // 如果共享实例出问题，尝试重建
      _sharedCanvas = null;
      reject(new Error('创建画布失败，请重试: ' + (e.message || e)));
    }
  });
}

/**
 * 导出为分页图片
 */
function exportAsPages(data) {
  return new Promise((resolve, reject) => {
    try {
      // 【单例模式】使用全局共享的 Canvas 实例
      const canvas = getSharedCanvas();
      console.log('[exportAsPages] 使用共享 Canvas 实例');
      drawNotationOnCanvas(canvas, data, resolve, reject, true);
    } catch (e) {
      console.error('获取 Canvas 失败:', e);
      // 如果共享实例出问题，尝试重建
      _sharedCanvas = null;
      reject(new Error('创建画布失败，请重试: ' + (e.message || e)));
    }
  });
}

/**
 * 在 Canvas 上绘制谱面
 */
function drawNotationOnCanvas(canvas, data, resolve, reject, isPaged) {
  // 获取模式配置
  const modeConfig = exportConfig.getExportConfig({
    exportMode: isPaged ? 'paged' : 'long',
    a4Orientation: data.a4Orientation || 'portrait',
    exportLayoutMode: data.exportLayoutMode || 'compact'
  });
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  var notations = data.notations;
  var mainTitle = data.mainTitle;
  var subTitle = data.subTitle;
  var globalTempo = data.globalTempo;
  var mainTitleColor = data.mainTitleColor;
  var subTitleColor = data.subTitleColor;
  var orientation = data.orientation;
  var a4Orientation = data.a4Orientation || 'portrait'; // A4纸张方向，默认纵向
  
  // 导出自定义颜色配置
  var colorMode = data.exportColorMode || 'dual'; // 'dual' 双色模式, 'single' 单色模式
  var singleColor = data.exportSingleColor || commonConfig.defaultSingleColor;
  var exportRightHandColor = data.exportRightHandColor || data.rightHandColor || commonConfig.defaultRightHandColor;
  var exportLeftHandColor = data.exportLeftHandColor || data.leftHandColor || commonConfig.defaultLeftHandColor;
  
  // 根据颜色模式确定实际使用的颜色
  var rightHandColor, leftHandColor;
  if (colorMode === 'single') {
    rightHandColor = singleColor;
    leftHandColor = singleColor;
  } else {
    rightHandColor = exportRightHandColor;
    leftHandColor = exportLeftHandColor;
  }
  
  // 背景图配置（优先使用传入的值，否则使用配置默认值）
  var bgOpacity = data.exportBgOpacity !== undefined ? data.exportBgOpacity : modeConfig.bgOpacity;
  var bgSize = data.exportBgSize !== undefined ? data.exportBgSize : modeConfig.bgSizeScale;
  
  const ctx = canvas.getContext('2d');
  const dpr = commonConfig.dpr; // 设备像素比
  
  // 根据A4方向确定页面尺寸
  const isA4Landscape = (a4Orientation === 'landscape');
  const pagedWidth = isA4Landscape ? A4_LANDSCAPE_WIDTH : A4_WIDTH;
  const pagedHeight = isA4Landscape ? A4_LANDSCAPE_HEIGHT : A4_HEIGHT;
  const pagedContentWidth = isA4Landscape ? CONTENT_LANDSCAPE_WIDTH : CONTENT_WIDTH;
  
  // 根据分页模式选择宽度
  const width = isPaged ? pagedWidth / dpr : (orientation === 'landscape' ? modeConfig.landscapeWidth : modeConfig.portraitWidth);
  const contentWidth = isPaged ? pagedContentWidth / dpr : width - (modeConfig.contentPadding || 20);
  const leftMargin = isPaged ? CONTENT_PADDING / dpr : (modeConfig.leftMargin || 10);
  
  // 计算各个部分的高度
  const titleBlockHeight = modeConfig.titleBlockHeight;
  const measureLineHeight = 70; // 每行小节的高度（基准值）
  const rowGap = 12; // 行间距，避免上下行的竖线视觉连贯
  const notationLabelHeight = modeConfig.notationLabelHeight; // 模块编号的高度
  const sectionGap = modeConfig.sectionGap; // 模块间距
  const bottomPadding = modeConfig.bottomPadding || 70; // 底部预留间距
  
  // 计算每个模块需要的行数（模块优先，其次全局，再回退默认）
  const isLandscape = orientation === 'landscape';
  const resolveMeasuresPerRow = (notation) => {
    // 优先使用模块已计算好的 measuresPerRow（导出时已根据排版模式重新计算）
    if (notation && typeof notation.measuresPerRow === 'number' && notation.measuresPerRow > 0) {
      return notation.measuresPerRow;
    }
    // 如果模块有竖屏基准值，则根据导出方向计算
    if (notation && typeof notation.measuresPerRowPortrait === 'number' && notation.measuresPerRowPortrait > 0) {
      return isLandscape ? notation.measuresPerRowPortrait * 2 : notation.measuresPerRowPortrait;
    }
    if (typeof data.measuresPerRow === 'number' && data.measuresPerRow > 0) {
      return data.measuresPerRow;
    }
    return isPaged ? Math.floor(contentWidth / (modeConfig.measuresPerRowFallback || 250)) : (isLandscape ? 2 : 1);
  };
  
  // 获取用户调整系数（默认50表示1.0倍，范围0-100）
  const lineSpacingMultiplier = data.lineSpacingAdjust !== undefined 
    ? (data.lineSpacingAdjust / 50) : 1.0;
  const measureHeightMultiplier = data.measureHeightAdjust !== undefined 
    ? (data.measureHeightAdjust / 50) : 1.0;
  
  const notationHeights = notations.map(notation => {
    const measuresPerRow = resolveMeasuresPerRow(notation);
    const measureCount = notation.measures ? notation.measures.length : 4;
    const rowCount = Math.ceil(measureCount / measuresPerRow);
    
    // 获取样式设置来计算高度
    const style = notation.style || {};
    const exportLayoutMode = data.exportLayoutMode || 'compact';
    const isLooseMode = exportLayoutMode === 'loose';
    
    // 与 drawNotationSection 中的计算方式完全一致
    const defaultMeasureHeight = modeConfig.defaultMeasureHeightRpx || 
      (isLooseMode ? modeConfig.looseMeasureHeightRpx : modeConfig.compactMeasureHeightRpx) || 
      (isLooseMode ? 240 : 160);
    const defaultLineSpacing = modeConfig.defaultLineSpacingRpx || 
      (isLooseMode ? modeConfig.looseLineSpacingRpx : modeConfig.compactLineSpacingRpx) || 
      (isLooseMode ? 98 : 65);
    
    // 应用用户调整系数
    const measureHeightRpx = (style.measureHeight || defaultMeasureHeight) * measureHeightMultiplier;
    const lineSpacing = (style.lineSpacing || defaultLineSpacing) * lineSpacingMultiplier;
    const rpxToPxRatio = commonConfig.rpxToPxRatio;
    const lineSpacingPx = Math.round(lineSpacing * rpxToPxRatio);
    
    // 将rpx转换为px
    const measureHeight = Math.round(measureHeightRpx * rpxToPxRatio);
    const rowGap = lineSpacingPx;
    
    const totalRowsHeight = (rowCount * measureHeight) + Math.max(0, rowCount - 1) * rowGap;
    // 使用与 drawNotationSection 一致的计算方式
    const moduleContentOffsetY = modeConfig.moduleContentOffsetY || 50;
    const sectionBottomPadding = modeConfig.sectionBottomPadding || 15;
    return moduleContentOffsetY + totalRowsHeight + sectionBottomPadding;
  });
  
  if (!isPaged) {
    // 长图模式：预加载图片后再绘制所有内容（与分页模式保持一致）
    preloadWatermarkImages(canvas).then(function(images) {
      var watermarkImg = images.watermarkImg;
      var bgImg = images.bgImg;
      var brandingImg = images.brandingImg;
      var icons = {
        timingIcon: images.timingIcon,
        noteChangeIcon: images.noteChangeIcon,
        crownIcon: images.crownIcon,
        starIcon: images.starIcon
      };
      
      // 底部预留空间，确保谱面内容和页面底端有足够间隔
      const totalHeight = titleBlockHeight + notationHeights.reduce((sum, h) => sum + h, 0) + bottomPadding;
      
      // 【单例模式】使用 resetCanvasContext 重置画布状态
      resetCanvasContext(canvas, width * dpr, totalHeight * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      // 绘制背景
      ctx.fillStyle = '#ffffffff';
      ctx.fillRect(0, 0, width, totalHeight);
      
      let currentY = 10;
      
      // 绘制标题区 - 传递整个data对象和图标
      currentY = drawTitleBlock(ctx, data, 0, currentY, width, icons, modeConfig);
      
      // 获取导出布局模式
      const exportLayoutMode = data.exportLayoutMode || 'compact';
      
      // 用户调整参数
      const adjustParams = {
        lineSpacingAdjust: data.lineSpacingAdjust,
        measureHeightAdjust: data.measureHeightAdjust,
        dotSizeAdjust: data.dotSizeAdjust,
        dotUpOffsetAdjust: data.dotUpOffsetAdjust,
        dotDownOffsetAdjust: data.dotDownOffsetAdjust,
        underlineThicknessAdjust: data.underlineThicknessAdjust,
        underlineOffsetAdjust: data.underlineOffsetAdjust,
        supFontSizeAdjust: data.supFontSizeAdjust
      };
      
      // 绘制所有谱面模块（传入modeConfig和adjustParams确保配置正确生效）
      notations.forEach((notation, idx) => {
        const measuresPerRow = resolveMeasuresPerRow(notation);
        currentY = drawNotationSection(ctx, notation, leftMargin, currentY, contentWidth, 
                                       rightHandColor, leftHandColor, measuresPerRow, isLandscape, exportLayoutMode, modeConfig, adjustParams, images.arpeggioIcon);
      });
      
      // 叠加绘制水印与背景后导出
      addTopRightWatermarkWithLabel(ctx, watermarkImg, width, totalHeight);
      addCornerBackgroundImage(ctx, bgImg, width, totalHeight, bgOpacity, bgSize);
      addBottomCenterBranding(ctx, brandingImg, width, totalHeight);
      wx.canvasToTempFilePath({
        canvas,
        success: (res) => resolve(res.tempFilePath),
        fail: (err) => reject(new Error('canvasToTempFilePath failed (long image): ' + readableError(err)))
      });
    }).catch((err) => {
      console.warn('水印/背景图片加载失败，使用文字水印', readableError(err));
      
      // 图片加载失败时，仍需绘制内容（不使用图标）
      // 底部预留60rpx（约30px），确保谱面内容和页面底端有足够间隔
      const totalHeight = titleBlockHeight + notationHeights.reduce((sum, h) => sum + h, 0) + bottomPadding;
      
      // 【单例模式】使用 resetCanvasContext 重置画布状态
      resetCanvasContext(canvas, width * dpr, totalHeight * dpr);
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      // 绘制背景
      ctx.fillStyle = '#ffffffff';
      ctx.fillRect(0, 0, width, totalHeight);
      
      let currentY = 10;
      
      // 绘制标题区 - 传递整个data对象，无图标
      currentY = drawTitleBlock(ctx, data, 0, currentY, width, null, modeConfig);
      
      // 获取导出布局模式
      const exportLayoutMode = data.exportLayoutMode || 'compact';
      
      // 用户调整参数
      const adjustParams = {
        lineSpacingAdjust: data.lineSpacingAdjust,
        measureHeightAdjust: data.measureHeightAdjust,
        dotSizeAdjust: data.dotSizeAdjust,
        dotUpOffsetAdjust: data.dotUpOffsetAdjust,
        dotDownOffsetAdjust: data.dotDownOffsetAdjust,
        underlineThicknessAdjust: data.underlineThicknessAdjust,
        underlineOffsetAdjust: data.underlineOffsetAdjust,
        supFontSizeAdjust: data.supFontSizeAdjust
      };
      
      // 绘制所有谱面模块（传入modeConfig和adjustParams确保配置正确生效）
      notations.forEach((notation, idx) => {
        const measuresPerRow = resolveMeasuresPerRow(notation);
        currentY = drawNotationSection(ctx, notation, leftMargin, currentY, contentWidth, 
                                       rightHandColor, leftHandColor, measuresPerRow, isLandscape, exportLayoutMode, modeConfig, adjustParams);
      });
      
      // 回退为文字水印
      addTextWatermark(ctx, width / 2, totalHeight / 2);
      addBottomCenterBranding(ctx, null, width, totalHeight);
      wx.canvasToTempFilePath({
        canvas,
        success: (res) => resolve(res.tempFilePath),
        fail: (err) => reject(new Error('canvasToTempFilePath failed (long image, text fallback): ' + readableError(err)))
      });
    });
  } else {
    // 分页模式：预加载图片后逐页生成
    preloadWatermarkImages(canvas).then(function(images) {
      var watermarkImg = images.watermarkImg;
      var bgImg = images.bgImg;
      var brandingImg = images.brandingImg;
      var icons = {
        timingIcon: images.timingIcon,
        noteChangeIcon: images.noteChangeIcon,
        crownIcon: images.crownIcon,
        starIcon: images.starIcon,
        arpeggioIcon: images.arpeggioIcon
      };
      generatePagedImages(canvas, ctx, dpr, data, notations, notationHeights, 
        mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor,
        rightHandColor, leftHandColor, resolve, reject, watermarkImg, bgImg, brandingImg, icons);
    }).catch((err) => {
      console.warn('水印/背景图片加载失败，分页模式使用文字水印', readableError(err));
      // 图片加载失败则使用文字水印回退
      generatePagedImages(canvas, ctx, dpr, data, notations, notationHeights, 
        mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor,
        rightHandColor, leftHandColor, resolve, reject, null, null, null, null);
    });
  }
}

/**
 * 绘制节拍器图标（简化版）
 */
function drawMetronomeIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  
  // 绘制底座（矩形）
  const baseWidth = size * 0.7;
  const baseHeight = size * 0.2;
  ctx.fillRect(x + (size - baseWidth) / 2, y + size - baseHeight, baseWidth, baseHeight);
  
  // 绘制主体（三角形）
  ctx.beginPath();
  ctx.moveTo(x + size / 2, y); // 顶点
  ctx.lineTo(x + size * 0.2, y + size * 0.8); // 左下
  ctx.lineTo(x + size * 0.8, y + size * 0.8); // 右下
  ctx.closePath();
  ctx.fill();
  
  // 绘制摆锤（小圆）
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size * 0.5, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

/**
 * 绘制谱式图标（简化版）
 */
function drawNotationTypeIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = size * 0.1;
  
  // 绘制五线谱的三条线
  const lineSpacing = size * 0.25;
  for (let i = 0; i < 3; i++) {
    const lineY = y + size * 0.2 + i * lineSpacing;
    ctx.beginPath();
    ctx.moveTo(x, lineY);
    ctx.lineTo(x + size, lineY);
    ctx.stroke();
  }
  
  // 绘制音符符头
  ctx.beginPath();
  ctx.arc(x + size * 0.3, y + size * 0.45, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // 绘制符干
  ctx.beginPath();
  ctx.moveTo(x + size * 0.45, y + size * 0.45);
  ctx.lineTo(x + size * 0.45, y + size * 0.1);
  ctx.stroke();
  
  ctx.restore();
}

/**
 * 绘制难度图标（简化版）
 */
function drawDifficultyIcon(ctx, x, y, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.08;
  
  // 绘制皇冠底座
  const baseY = y + size * 0.75;
  ctx.fillRect(x, baseY, size, size * 0.25);
  
  // 绘制三个尖峰
  ctx.beginPath();
  // 左峰
  ctx.moveTo(x, baseY);
  ctx.lineTo(x + size * 0.15, y);
  ctx.lineTo(x + size * 0.3, baseY);
  // 中峰
  ctx.lineTo(x + size * 0.35, y + size * 0.15);
  ctx.lineTo(x + size * 0.5, y);
  ctx.lineTo(x + size * 0.65, y + size * 0.15);
  ctx.lineTo(x + size * 0.7, baseY);
  // 右峰
  ctx.lineTo(x + size * 0.85, y);
  ctx.lineTo(x + size, baseY);
  ctx.closePath();
  ctx.fill();
  
  // 绘制装饰圆点
  ctx.fillStyle = '#ffffff';
  const dotSize = size * 0.08;
  ctx.beginPath();
  ctx.arc(x + size * 0.15, y + size * 0.3, dotSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + size * 0.5, y + size * 0.25, dotSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + size * 0.85, y + size * 0.3, dotSize, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

/**
 * 绘制标题区块
 * @param {Object} data - 包含所有元信息的数据对象
 * @param {Object} icons - 包含各种图标的对象 {timingIcon, noteChangeIcon, crownIcon, starIcon}
 * @param {Object} modeConfig - 当前模式的配置参数（可选，用于分页模式传入）
 */
function drawTitleBlock(ctx, data, x, y, width, icons, modeConfig) {
  // 获取配置（如果未传入则根据当前data计算）
  const config = modeConfig || exportConfig.getExportConfig({
    exportMode: data.isPaged ? 'paged' : 'long',
    a4Orientation: data.a4Orientation || 'portrait',
    exportLayoutMode: data.exportLayoutMode || 'compact'
  });
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  // 获取标题区块连携比例系数（用于整体缩放标题区元素）
  // 如果data中有用户调整的titleScaleAdjust，则叠加到基础系数上
  const baseTitleScaleFactor = config.titleScaleFactor || 1.0;
  const titleScaleAdjust = data.titleScaleAdjust !== undefined ? (data.titleScaleAdjust / 50) : 1.0;
  const titleScaleFactor = baseTitleScaleFactor * titleScaleAdjust;
  
  const mainTitle = data.mainTitle;
  const subTitle = data.subTitle;
  const globalTempo = data.globalTempo;
  const mainTitleColor = data.mainTitleColor || commonConfig.defaultMainTitleColor;
  const subTitleColor = data.subTitleColor || commonConfig.defaultSubTitleColor;
  const composer = data.composer || '';
  const rootNote = data.rootNote || '';
  const scaleType = data.scaleType || '';
  const noteCount = data.noteCount || '';
  const introduction = data.introduction || '';
  const notationType = data.notationType || 'digital';
  const difficulty = data.difficulty || 1;
  
  // 应用连携比例系数的参数
  const mainTitleFontSize = Math.round(config.mainTitleFontSize * titleScaleFactor);
  const mainTitleOffsetY = Math.round(config.mainTitleOffsetY * titleScaleFactor);
  const mainTitleLineHeight = Math.round(config.mainTitleLineHeight * titleScaleFactor);
  const subTitleFontSize = Math.round(config.subTitleFontSize * titleScaleFactor);
  const subTitleOffsetY = Math.round(config.subTitleOffsetY * titleScaleFactor);
  const subTitleLineHeight = Math.round(config.subTitleLineHeight * titleScaleFactor);
  const introFontSize = Math.round(config.introFontSize * titleScaleFactor);
  const introLineHeight = Math.round(config.introLineHeight * titleScaleFactor);
  const introTopMargin = Math.round(config.introTopMargin * titleScaleFactor);
  const introBottomMargin = Math.round(config.introBottomMargin * titleScaleFactor);
  const paramsTopMargin = Math.round(config.paramsTopMargin * titleScaleFactor);
  const paramsRowHeight = Math.round(config.paramsRowHeight * titleScaleFactor);
  const iconSize = Math.round(config.paramIconSize * titleScaleFactor);
  const paramGap = Math.round(config.paramIconTextGap * titleScaleFactor);
  const paramColOffset = Math.round(config.paramColOffset * titleScaleFactor);
  const paramValueFontSize = Math.round(config.paramValueFontSize * titleScaleFactor);
  const starSize = Math.round(config.starSize * titleScaleFactor);
  const starGap = Math.round(config.starGap * titleScaleFactor);
  
  let currentY = y;
  
  // 1. 主标题
  ctx.fillStyle = mainTitleColor;
  ctx.font = `${config.mainTitleFontWeight} ${mainTitleFontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(mainTitle || 'Handpan Note', width / 2, currentY + mainTitleOffsetY);
  currentY += mainTitleLineHeight;
  
  // 2. 副标题行：副标题 | 制谱人 | 主音-调式 音位数音
  const subTitleParts = [];
  if (subTitle) subTitleParts.push(subTitle);
  if (composer) subTitleParts.push(composer);
  // 调式名称处理：如果包含 " / "，取第一部分
  const scaleDisplay = scaleType.indexOf(' / ') > -1 ? scaleType.split(' / ')[0] : scaleType;
  if (rootNote && scaleDisplay) {
    subTitleParts.push(`${rootNote}-${scaleDisplay} ${noteCount}音`);
  }
  
  if (subTitleParts.length > 0) {
    ctx.fillStyle = subTitleColor;
    ctx.font = `${subTitleFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(subTitleParts.join(' | '), width / 2, currentY + subTitleOffsetY);
    currentY += subTitleLineHeight;
  }
  
  // 3. 简介文本（如果存在）
  if (introduction && introduction.trim()) {
    currentY += introTopMargin;
    ctx.fillStyle = commonConfig.introductionColor;
    ctx.font = `${introFontSize}px sans-serif`;
    ctx.textAlign = 'center';
    // 简介可能较长，需要处理换行
    const maxWidth = width * config.introMaxWidthRatio;
    const introLines = wrapText(ctx, introduction, maxWidth);
    introLines.forEach((line, idx) => {
      ctx.fillText(line, width / 2, currentY + introFontSize + idx * introLineHeight);
    });
    currentY += introLines.length * introLineHeight + introBottomMargin;
  }
  
  // 4. 参数信息行：速度 | 谱式 | 难度（三个参数同行，图标+值 垂直居中）
  currentY += paramsTopMargin;
  const paramsY = currentY + Math.round(10 * titleScaleFactor);
  
  // 计算三列位置（均匀分布）
  const col1X = width * config.paramCol1XRatio;  // 速度
  const col2X = width * config.paramCol2XRatio;  // 谱式
  const col3X = width * config.paramCol3XRatio;  // 难度
  
  // 速度：图标 + 值
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  
  // 绘制速度图标 - 直接使用 Image 对象
  if (icons && icons.timingIcon) {
    ctx.drawImage(icons.timingIcon, col1X - paramColOffset, paramsY - iconSize / 2, iconSize, iconSize);
  } else {
    drawMetronomeIcon(ctx, col1X - paramColOffset, paramsY - iconSize / 2, iconSize, commonConfig.defaultSubTitleColor);
  }
  
  // 绘制速度数值
  ctx.fillStyle = commonConfig.defaultMainTitleColor;
  ctx.font = `${config.paramValueFontWeight} ${paramValueFontSize}px sans-serif`;
  ctx.fillText(`${globalTempo}`, col1X - paramColOffset + iconSize + paramGap, paramsY);
  
  // 谱式：图标 + 值
  ctx.textAlign = 'left';
  
  // 绘制谱式图标 - 直接使用 Image 对象
  if (icons && icons.noteChangeIcon) {
    ctx.drawImage(icons.noteChangeIcon, col2X - paramColOffset, paramsY - iconSize / 2, iconSize, iconSize);
  } else {
    drawNotationTypeIcon(ctx, col2X - paramColOffset, paramsY - iconSize / 2, iconSize, commonConfig.defaultSubTitleColor);
  }
  
  // 绘制谱式数值
  ctx.fillStyle = commonConfig.defaultMainTitleColor;
  ctx.font = `${config.paramValueFontWeight} ${paramValueFontSize}px sans-serif`;
  const notationTypeDisplay = notationType === 'simplified' ? '简谱' : '数字谱';
  ctx.fillText(notationTypeDisplay, col2X - paramColOffset + iconSize + paramGap, paramsY);
  
  // 难度：图标 + 星星
  ctx.textAlign = 'left';
  
  // 绘制难度图标 - 直接使用 Image 对象
  const diffColOffset = paramColOffset + Math.round(5 * titleScaleFactor);
  if (icons && icons.crownIcon) {
    ctx.drawImage(icons.crownIcon, col3X - diffColOffset, paramsY - iconSize / 2, iconSize, iconSize);
  } else {
    drawDifficultyIcon(ctx, col3X - diffColOffset, paramsY - iconSize / 2, iconSize, commonConfig.defaultSubTitleColor);
  }
  
  // 绘制星星
  const starStartX = col3X - diffColOffset + iconSize + paramGap;
  for (let i = 0; i < 5; i++) {
    const starX = starStartX + i * (starSize + starGap);
    if (icons && icons.starIcon) {
      // 使用实际星星图标，根据难度值调整透明度 - 直接使用 Image 对象
      ctx.globalAlpha = i < difficulty ? 1.0 : config.starInactiveOpacity;
      ctx.drawImage(icons.starIcon, starX, paramsY - starSize / 2, starSize, starSize);
      ctx.globalAlpha = 1.0;
    } else {
      drawStar(ctx, starX, paramsY - starSize / 2, starSize, i < difficulty ? config.starActiveColor : config.starInactiveColor);
    }
  }
  
  currentY += paramsRowHeight;
  
  return currentY + Math.round(10 * titleScaleFactor);
}



/**
 * 文字换行处理
 */
function wrapText(ctx, text, maxWidth) {
  const lines = [];
  const paragraphs = text.split('\n');
  
  paragraphs.forEach(paragraph => {
    let line = '';
    for (let i = 0; i < paragraph.length; i++) {
      const testLine = line + paragraph[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line.length > 0) {
        lines.push(line);
        line = paragraph[i];
      } else {
        line = testLine;
      }
    }
    if (line) lines.push(line);
  });
  
  return lines.length > 0 ? lines : [''];
}

/**
 * 绘制五角星
 */
function drawStar(ctx, x, y, size, color) {
  const spikes = 5;
  const outerRadius = size / 2;
  const innerRadius = outerRadius * 0.4;
  
  ctx.fillStyle = color;
  ctx.beginPath();
  
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const angle = (Math.PI / 2) + (i * Math.PI / spikes);
    const px = x + outerRadius + Math.cos(angle) * radius;
    const py = y + outerRadius - Math.sin(angle) * radius;
    
    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }
  
  ctx.closePath();
  ctx.fill();
}

/**
 * 绘制单个谱面模块（不包含白色卡片框）
 * @param {Object} modeConfig - 当前模式的配置参数（可选）
 * @param {Object} adjustParams - 用户调整参数（可选）{lineSpacingAdjust, measureHeightAdjust}
 */
function drawNotationSection(ctx, notation, x, y, width, rightHandColor, leftHandColor, measuresPerRow, isLandscape = false, exportLayoutMode = 'compact', modeConfig = null, adjustParams = null, arpeggioIcon = null) {
  // 获取配置
  const config = modeConfig || exportConfig.getExportConfig({
    exportMode: 'long', // 默认使用长图模式配置
    a4Orientation: isLandscape ? 'landscape' : 'portrait',
    exportLayoutMode: exportLayoutMode
  });
  const commonConfig = exportConfig.COMMON_CONFIG;
  const rpxToPxRatio = commonConfig.rpxToPxRatio;
  
  // 获取用户调整系数（默认50表示1.0倍，范围0-100）
  const lineSpacingMultiplier = adjustParams && adjustParams.lineSpacingAdjust !== undefined 
    ? (adjustParams.lineSpacingAdjust / 50) : 1.0;
  const measureHeightMultiplier = adjustParams && adjustParams.measureHeightAdjust !== undefined 
    ? (adjustParams.measureHeightAdjust / 50) : 1.0;
  
  // 获取样式设置，默认值从配置读取
  const style = notation.style || {};
  const isLooseMode = exportLayoutMode === 'loose';
  
  // 根据模式获取默认值
  const defaultMeasureHeight = config.defaultMeasureHeightRpx || (isLooseMode ? config.looseMeasureHeightRpx : config.compactMeasureHeightRpx) || (isLooseMode ? 240 : 160);
  const defaultLineSpacing = config.defaultLineSpacingRpx || (isLooseMode ? config.looseLineSpacingRpx : config.compactLineSpacingRpx) || (isLooseMode ? 98 : 65);
  const defaultNoteFontSize = config.defaultNoteFontSizeRpx || (isLooseMode ? config.looseNoteFontSizeRpx : config.compactNoteFontSizeRpx) || (isLooseMode ? 36 : 28);
  
  // 应用用户调整系数
  const measureHeightRpx = (style.measureHeight || defaultMeasureHeight) * measureHeightMultiplier;
  const noteFontSize = style.noteFontSize || defaultNoteFontSize;
  const lineSpacing = (style.lineSpacing || defaultLineSpacing) * lineSpacingMultiplier;
  
  // 将rpx转换为px
  const noteFontSizePx = Math.round(noteFontSize * rpxToPxRatio);
  const lineSpacingPx = Math.round(lineSpacing * rpxToPxRatio);
  const measureHeight = Math.round(measureHeightRpx * rpxToPxRatio);
  const rowGap = lineSpacingPx; // 使用自定义行间距
  
  const measureCount = notation.measures ? notation.measures.length : 4;
  const rowCount = Math.ceil(measureCount / measuresPerRow);
  
  // 绘制模块编号（例如 A-1）
  ctx.fillStyle = commonConfig.moduleLabelColor;
  const labelFontSize = isLandscape ? config.moduleLabelFontSizeLandscape || config.moduleLabelFontSize : config.moduleLabelFontSizePortrait || config.moduleLabelFontSize;
  ctx.font = `bold ${labelFontSize}px sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText(notation.label || '', x, y + config.moduleLabelOffsetY);
  
  // 绘制备注（如果存在）
  if (notation.remark) {
    const labelWidth = ctx.measureText(notation.label || '').width;
    ctx.fillStyle = commonConfig.moduleRemarkColor;
    const remarkFontSize = isLandscape ? config.moduleRemarkFontSizeLandscape || config.moduleRemarkFontSize : config.moduleRemarkFontSizePortrait || config.moduleRemarkFontSize;
    ctx.font = `${remarkFontSize}px sans-serif`;
    ctx.fillText(notation.remark, x + labelWidth + config.moduleLabelRemarkGap, y + config.moduleLabelOffsetY);
  }
  
  let currentY = y + config.moduleContentOffsetY; // 模块内容开始位置
  const measureWidth = width / measuresPerRow;
  
  // 绘制谱面小节
  const measureOffset = notation.measureOffset || 0;
  notation.measures.forEach((measure, mIdx) => {
    const rowIdx = Math.floor(mIdx / measuresPerRow);
    const colIdx = mIdx % measuresPerRow;
    const measureX = x + (colIdx * measureWidth);
    const measureY = currentY + (rowIdx * (measureHeight + rowGap));
    const measureDisplayIndex = measureOffset + mIdx + 1; // 小节编号从1开始
    drawMeasure(ctx, measure, measureX, measureY, measureWidth, rightHandColor, leftHandColor, 
                measureHeight, noteFontSizePx, measureDisplayIndex, measuresPerRow, exportLayoutMode, config, adjustParams, arpeggioIcon);
  });
  
  const sectionHeight = config.moduleContentOffsetY + (rowCount * measureHeight) + Math.max(0, rowCount - 1) * rowGap + config.sectionBottomPadding;
  return y + sectionHeight;
}

/**
 * 绘制模块的部分行（用于分页拆分）
 * @param {number} rowStart - 从第几行开始绘制（0-based）
 * @param {number} rows - 绘制多少行
 * @param {boolean} showLabel - 是否绘制模块标签
 * @param {Object} modeConfig - 当前模式的配置参数（可选）
 * @param {Object} adjustParams - 用户调整参数（可选）{lineSpacingAdjust, measureHeightAdjust}
 */
function drawNotationSectionPartial(ctx, notation, x, y, width, rightHandColor, leftHandColor, measuresPerRow, rowStart, rows, showLabel, isLandscape = false, exportLayoutMode = 'compact', modeConfig = null, adjustParams = null, arpeggioIcon = null) {
  // 获取配置
  const config = modeConfig || exportConfig.getExportConfig({
    exportMode: 'paged',
    a4Orientation: isLandscape ? 'landscape' : 'portrait',
    exportLayoutMode: exportLayoutMode
  });
  const commonConfig = exportConfig.COMMON_CONFIG;
  const rpxToPxRatio = commonConfig.rpxToPxRatio;
  
  // 获取用户调整系数（默认50表示1.0倍，范围0-100）
  const lineSpacingMultiplier = adjustParams && adjustParams.lineSpacingAdjust !== undefined 
    ? (adjustParams.lineSpacingAdjust / 50) : 1.0;
  const measureHeightMultiplier = adjustParams && adjustParams.measureHeightAdjust !== undefined 
    ? (adjustParams.measureHeightAdjust / 50) : 1.0;
  
  // 获取样式设置，默认值从配置读取
  const style = notation.style || {};
  const isLooseMode = exportLayoutMode === 'loose';
  
  const defaultMeasureHeight = config.defaultMeasureHeightRpx || (isLooseMode ? 240 : 160);
  const defaultLineSpacing = config.defaultLineSpacingRpx || (isLooseMode ? 98 : 65);
  const defaultNoteFontSize = config.defaultNoteFontSizeRpx || (isLooseMode ? 36 : 28);
  
  // 应用用户调整系数
  const measureHeightRpx = (style.measureHeight || defaultMeasureHeight) * measureHeightMultiplier;
  const noteFontSize = style.noteFontSize || defaultNoteFontSize;
  const lineSpacing = (style.lineSpacing || defaultLineSpacing) * lineSpacingMultiplier;
  
  // 将rpx转换为px
  const noteFontSizePx = Math.round(noteFontSize * rpxToPxRatio);
  const lineSpacingPx = Math.round(lineSpacing * rpxToPxRatio);
  const measureHeight = Math.round(measureHeightRpx * rpxToPxRatio);
  const rowGap = lineSpacingPx; // 使用自定义行间距
  
  const measureCount = notation.measures ? notation.measures.length : 4;
  const totalRows = Math.ceil(measureCount / measuresPerRow);
  const drawRows = Math.min(rows, Math.max(0, totalRows - rowStart));

  // 标题（可选）
  if (showLabel) {
    ctx.fillStyle = commonConfig.moduleLabelColor;
    const labelFontSize = config.moduleLabelFontSize || (isLandscape ? 14 : 18);
    ctx.font = `bold ${labelFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(notation.label || '', x, y + config.moduleLabelOffsetY);
    
    // 绘制备注（如果存在）
    if (notation.remark) {
      const labelWidth = ctx.measureText(notation.label || '').width;
      ctx.fillStyle = commonConfig.moduleRemarkColor;
      const remarkFontSize = config.moduleRemarkFontSize || (isLandscape ? 12 : 16);
      ctx.font = `${remarkFontSize}px sans-serif`;
      ctx.fillText(notation.remark, x + labelWidth + config.moduleLabelRemarkGap, y + config.moduleLabelOffsetY);
    }
    
    y += config.moduleContentOffsetY; // 模块内容开始位置
  }

  const measureWidth = width / measuresPerRow;
  const startMeasureIndex = rowStart * measuresPerRow;
  const endMeasureIndex = Math.min(measureCount, startMeasureIndex + drawRows * measuresPerRow);

  const measureOffset = notation.measureOffset || 0;
  for (let mIdx = startMeasureIndex; mIdx < endMeasureIndex; mIdx++) {
    const localIndex = mIdx - startMeasureIndex;
    const rowIdx = Math.floor(localIndex / measuresPerRow);
    const colIdx = localIndex % measuresPerRow;
    const measureX = x + (colIdx * measureWidth);
    const measureY = y + (rowIdx * (measureHeight + rowGap));
    const measureDisplayIndex = measureOffset + mIdx + 1; // 小节编号从1开始
    drawMeasure(ctx, notation.measures[mIdx], measureX, measureY, measureWidth, rightHandColor, leftHandColor,
                measureHeight, noteFontSizePx, measureDisplayIndex, measuresPerRow, exportLayoutMode, config, adjustParams, arpeggioIcon);
  }

  const sectionHeight = (drawRows * measureHeight) + Math.max(0, drawRows - 1) * rowGap + config.sectionBottomPadding;
  return y + sectionHeight;
}

/**
 * 单个小节
 */
function drawNotationSheet(ctx, notation, x, y, width, rightHandColor, leftHandColor, isLandscape = false) {
  // 此函数已被 drawNotationSection 替代，保留以兼容旧代码
  return drawNotationSection(ctx, notation, x, y, width, rightHandColor, leftHandColor, isLandscape ? 2 : 1, isLandscape);
}

/**
 * 生成分页图片
 */
function generatePagedImages(canvas, ctx, dpr, data, notations, notationHeights, 
                             mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor,
                             rightHandColor, leftHandColor, resolve, reject,
                             watermarkImg, bgImg, brandingImg, icons) {
  // 获取模式配置
  const modeConfig = exportConfig.getExportConfig({
    exportMode: 'paged',
    a4Orientation: data.a4Orientation || 'portrait',
    exportLayoutMode: data.exportLayoutMode || 'compact'
  });
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  // 根据A4方向确定页面尺寸
  const a4Orientation = data.a4Orientation || 'portrait';
  const isA4Landscape = (a4Orientation === 'landscape');
  const pageWidth = (isA4Landscape ? A4_LANDSCAPE_WIDTH : A4_WIDTH) / dpr;
  const pageHeight = (isA4Landscape ? A4_LANDSCAPE_HEIGHT : A4_HEIGHT) / dpr;
  const contentWidth = (isA4Landscape ? CONTENT_LANDSCAPE_WIDTH : CONTENT_WIDTH) / dpr;
  const leftMargin = CONTENT_PADDING / dpr;
  const topMargin = CONTENT_PADDING / dpr;
  const bottomMargin = CONTENT_PADDING / dpr;
  const contentHeight = pageHeight - topMargin - bottomMargin;
  // 预留底部间距
  const bottomReserve = modeConfig.bottomReserve || 10;
  const effectiveContentHeight = contentHeight - bottomReserve;
  const isLandscape = data.orientation === 'landscape';
  
  // 使用配置参数
  const titleBlockHeight = modeConfig.titleBlockHeight || 80;
  const rpxToPxRatio = commonConfig.rpxToPxRatio || 0.5;

  const resolveMeasuresPerRow = (notation) => {
    // 优先使用模块已计算好的 measuresPerRow（导出时已根据排版模式重新计算）
    if (notation && typeof notation.measuresPerRow === 'number' && notation.measuresPerRow > 0) {
      return notation.measuresPerRow;
    }
    // 如果模块有竖屏基准值，则根据导出方向计算
    if (notation && typeof notation.measuresPerRowPortrait === 'number' && notation.measuresPerRowPortrait > 0) {
      return isLandscape ? notation.measuresPerRowPortrait * 2 : notation.measuresPerRowPortrait;
    }
    if (typeof data.measuresPerRow === 'number' && data.measuresPerRow > 0) {
      return data.measuresPerRow;
    }
    // 使用配置参数计算回退值
    const fallbackDivisor = modeConfig.measuresPerRowFallback || 250;
    return Math.floor(contentWidth / fallbackDivisor);
  };

  // 非首页顶部预留边距（由于水印只在第一页，非首页不需要预留水印高度）
  const nonFirstPageTopMargin = modeConfig.nonFirstPageTopMargin || 15;

  // 分页算法（逐行判断并可拆分模块）
  const pages = [];
  let currentPage = { includeTitle: true, segments: [] };
  let usedHeight = titleBlockHeight; // 第一页预留标题
  
  // 获取用户调整系数（默认50表示1.0倍，范围0-100）
  const lineSpacingMultiplier = data.lineSpacingAdjust !== undefined 
    ? (data.lineSpacingAdjust / 50) : 1.0;
  const measureHeightMultiplier = data.measureHeightAdjust !== undefined 
    ? (data.measureHeightAdjust / 50) : 1.0;

  const flushPage = () => {
    if (currentPage.segments.length > 0) {
      pages.push(currentPage);
      currentPage = { includeTitle: false, segments: [] };
      // 非首页：使用配置的非首页顶部边距，而不是水印预留高度
      usedHeight = nonFirstPageTopMargin;
    }
  };

  notations.forEach((notation) => {
    const measuresPerRow = resolveMeasuresPerRow(notation);
    const measureCount = notation.measures ? notation.measures.length : 4;
    const totalRows = Math.ceil(measureCount / measuresPerRow);
    
    // 获取样式设置来计算高度，使用配置文件中的默认值
    const style = notation.style || {};
    const defaultMeasureHeight = modeConfig.defaultMeasureHeightRpx;
    const defaultLineSpacing = modeConfig.defaultLineSpacingRpx;
    
    // 应用用户调整系数
    const measureHeightRpx = (style.measureHeight || defaultMeasureHeight) * measureHeightMultiplier;
    const lineSpacing = (style.lineSpacing || defaultLineSpacing) * lineSpacingMultiplier;
    const lineSpacingPx = Math.round(lineSpacing * rpxToPxRatio);
    
    // 将rpx转换为px
    const measureHeight = Math.round(measureHeightRpx * rpxToPxRatio);
    const rowGap = lineSpacingPx;
    
    // 模块内容偏移（用于标签区域）
    const moduleContentOffsetY = modeConfig.moduleContentOffsetY || 50;
    const sectionBottomPadding = modeConfig.sectionBottomPadding || 15;
    
    let rowStart = 0;
    let firstSlice = true;

    while (rowStart < totalRows) {
      const available = effectiveContentHeight - usedHeight;
      // 使用 moduleContentOffsetY 替代 notationLabelHeight，保持与实际绘制一致
      const labelH = firstSlice ? moduleContentOffsetY : 0;
      // 估算最多可放行数（保留 sectionBottomPadding 间距）
      const perRowApprox = measureHeight + rowGap;
      let rowsFit = Math.floor((available - labelH - sectionBottomPadding + rowGap) / perRowApprox);
      if (rowsFit <= 0) {
        // 换新页
        flushPage();
        continue;
      }
      rowsFit = Math.min(rowsFit, totalRows - rowStart);

      currentPage.segments.push({
        notation,
        rowStart,
        rows: rowsFit,
        showLabel: firstSlice
      });

      // 使用与 drawNotationSectionPartial 一致的高度计算
      const rowsHeight = rowsFit * measureHeight + Math.max(0, rowsFit - 1) * rowGap;
      usedHeight += labelH + rowsHeight + sectionBottomPadding;

      rowStart += rowsFit;
      firstSlice = false;

      // 检查是否需要换页：考虑下一行的完整高度（行高 + 间距）
      if (rowStart < totalRows && usedHeight + measureHeight + rowGap > effectiveContentHeight) {
        flushPage();
      }
    }
  });

  // 收尾
  flushPage();
  
  // 生成所有页面图片
  const tempFilePaths = [];
  let pageIndex = 0;
  
  function generateNextPage() {
    if (pageIndex >= pages.length) {
      resolve(tempFilePaths);
      return;
    }
    
    const page = pages[pageIndex];
    
    // 【单例模式】使用 resetCanvasContext 重置画布状态
    resetCanvasContext(canvas, pageWidth * dpr, pageHeight * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // 绘制背景
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(0, 0, pageWidth, pageHeight);
    
    let currentY = topMargin;
    
    // 第一页绘制标题
    if (page.includeTitle) {
      currentY = drawTitleBlock(ctx, data, leftMargin, currentY, pageWidth, icons, modeConfig);
    } else {
      // 非首页：使用配置的非首页顶部边距
      const nonFirstPageTopMargin = modeConfig.nonFirstPageTopMargin || 15;
      currentY += nonFirstPageTopMargin;
    }

    // 用户调整参数
    const adjustParams = {
      lineSpacingAdjust: data.lineSpacingAdjust,
      measureHeightAdjust: data.measureHeightAdjust,
      dotSizeAdjust: data.dotSizeAdjust,
      dotUpOffsetAdjust: data.dotUpOffsetAdjust,
      dotDownOffsetAdjust: data.dotDownOffsetAdjust,
      underlineThicknessAdjust: data.underlineThicknessAdjust,
      underlineOffsetAdjust: data.underlineOffsetAdjust,
      supFontSizeAdjust: data.supFontSizeAdjust
    };

    // 绘制该页的谱面片段（可跨页拆分模块，传入modeConfig和adjustParams确保配置正确生效）
    const exportLayoutMode = data.exportLayoutMode || 'compact';
    page.segments.forEach(seg => {
      const measuresPerRow = resolveMeasuresPerRow(seg.notation);
      currentY = drawNotationSectionPartial(
        ctx,
        seg.notation,
        leftMargin,
        currentY,
        contentWidth,
        rightHandColor,
        leftHandColor,
        measuresPerRow,
        seg.rowStart,
        seg.rows,
        seg.showLabel,
        isLandscape,
        exportLayoutMode,
        modeConfig,
        adjustParams,
        icons && icons.arpeggioIcon ? icons.arpeggioIcon : null
      );
    });
    
    // 添加水印与右下角背景（水印只在第一页显示）
    if (watermarkImg && page.includeTitle) {
      addTopRightWatermarkWithLabel(ctx, watermarkImg, pageWidth, pageHeight, isA4Landscape);
    }
    if (bgImg) {
      // 从data获取背景配置
      const bgOpacity = data.exportBgOpacity !== undefined ? data.exportBgOpacity : 0.1;
      const bgSize = data.exportBgSize !== undefined ? data.exportBgSize : 0.67;
      addCornerBackgroundImage(ctx, bgImg, pageWidth, pageHeight, bgOpacity, bgSize);
    }
    if (!watermarkImg && !bgImg && page.includeTitle) {
      // 首页图片都不可用时回退文字水印
      addTextWatermark(ctx, pageWidth / 2, pageHeight / 2);
    }
    // 底部居中添加 Orbit Note 品牌标识
    addBottomCenterBranding(ctx, brandingImg, pageWidth, pageHeight);
    
    // 导出当前页
    wx.canvasToTempFilePath({
      canvas: canvas,
      success: (res) => {
        tempFilePaths.push(res.tempFilePath);
        pageIndex++;
        generateNextPage();
      },
      fail: (err) => {
        reject(new Error('canvasToTempFilePath failed (paged, page ' + (pageIndex + 1) + '): ' + readableError(err)));
      }
    });
  }
  
  generateNextPage();
}

/**
 * 预加载水印、背景图片、品牌 Logo 和参数图标
 * 【单例模式】优先使用缓存的 Image 对象，避免重复文件读取
 */

// 图片资源的 key 常量，用于缓存索引
var IMAGE_KEYS = {
  WATERMARK: 'watermark',
  BG: 'bg',
  BRANDING: 'branding',
  TIMING: 'timing',
  NOTE_CHANGE: 'noteChange',
  CROWN: 'crown',
  STAR: 'star',
  ARPEGGIO: 'arpeggio'
};

// 图片候选路径配置
var IMAGE_CANDIDATES = {
  watermark: [
    '/subpackages/packageA/img/mini_program_code.jpg',
    'subpackages/packageA/img/mini_program_code.jpg',
    '../../img/mini_program_code.jpg'
  ],
  bg: [
    '/subpackages/packageA/img/bg2.png',
    'subpackages/packageA/img/bg2.png',
    '../../img/bg2.png'
  ],
  branding: [
    '/subpackages/packageA/img/logo3.png',
    'subpackages/packageA/img/logo3.png',
    '../../img/logo3.png'
  ],
  timing: [
    '/subpackages/packageA/icons/timing.png',
    'subpackages/packageA/icons/timing.png',
    '../../icons/timing.png'
  ],
  noteChange: [
    '/subpackages/packageA/icons/note_change.png',
    'subpackages/packageA/icons/note_change.png',
    '../../icons/note_change.png'
  ],
  crown: [
    '/subpackages/packageA/icons/crown.png',
    'subpackages/packageA/icons/crown.png',
    '../../icons/crown.png'
  ],
  star: [
    '/subpackages/packageA/icons/star.png',
    'subpackages/packageA/icons/star.png',
    '../../icons/star.png'
  ],
  arpeggio: [
    '/assets/icons/keyboard/arpeggio.svg',
    'assets/icons/keyboard/arpeggio.svg',
    '../../assets/icons/keyboard/arpeggio.svg'
  ]
};

function preloadWatermarkImages(canvas) {
  console.log('[preloadWatermarkImages] 开始加载图片资源...');
  console.log('[preloadWatermarkImages] Image对象缓存:', Object.keys(_imageObjCache).length, '个');
  console.log('[preloadWatermarkImages] Base64缓存:', Object.keys(_imageBase64Cache).length, '个');
  
  // 检查是否所有图片都已缓存（Image 对象缓存）
  var allCached = true;
  var cachedImages = {};
  
  for (var key in IMAGE_KEYS) {
    var imageKey = IMAGE_KEYS[key];
    if (_imageObjCache[imageKey] && _imageObjCache[imageKey].width > 0) {
      cachedImages[imageKey] = _imageObjCache[imageKey];
      console.log('[preloadWatermarkImages] ' + imageKey + ': 命中 Image 对象缓存');
    } else {
      allCached = false;
    }
  }
  if (!cachedImages.arpeggio) cachedImages.arpeggio = null;
  
  // 如果所有图片都已缓存，直接返回
  if (allCached) {
    console.log('[preloadWatermarkImages] 所有图片均命中缓存，跳过文件读取');
    return Promise.resolve({
      watermarkImg: cachedImages.watermark,
      bgImg: cachedImages.bg,
      brandingImg: cachedImages.branding,
      timingIcon: cachedImages.timing,
      noteChangeIcon: cachedImages.noteChange,
      crownIcon: cachedImages.crown,
      starIcon: cachedImages.star,
      arpeggioIcon: cachedImages.arpeggio || null
    });
  }
  
  // 否则，加载缺失的图片
  var loadPromises = [];
  var imageKeyOrder = ['watermark', 'bg', 'branding', 'timing', 'noteChange', 'crown', 'star', 'arpeggio'];
  
  imageKeyOrder.forEach(function(imageKey) {
    if (_imageObjCache[imageKey] && _imageObjCache[imageKey].width > 0) {
      // 已缓存，直接返回
      loadPromises.push(Promise.resolve(_imageObjCache[imageKey]));
    } else {
      // 未缓存，需要加载
      var isOptional = (imageKey !== 'watermark' && imageKey !== 'bg');
      var loadPromise = resolveImageFromCandidates(canvas, IMAGE_CANDIDATES[imageKey], imageKey);
      
      if (isOptional) {
        loadPromise = loadPromise.catch(function() { return null; });
      }
      loadPromises.push(loadPromise);
    }
  });
  
  return Promise.all(loadPromises).then(function(results){
    // 检查图片对象是否是真正的 Image 对象（有 width/height 属性）
    var checkImg = function(img, name) {
      if (!img) return name + ': null';
      if (img.width && img.height) return name + ': Image(' + img.width + 'x' + img.height + ')';
      return name + ': 无效对象';
    };
    
    console.log('[preloadWatermarkImages] 图片资源加载完成:');
    console.log('  ' + checkImg(results[0], 'watermark'));
    console.log('  ' + checkImg(results[1], 'bg'));
    console.log('  ' + checkImg(results[2], 'branding'));
    console.log('  ' + checkImg(results[3], 'timing'));
    console.log('  ' + checkImg(results[4], 'noteChange'));
    console.log('  ' + checkImg(results[5], 'crown'));
    console.log('  ' + checkImg(results[6], 'star'));
    console.log('  ' + checkImg(results[7], 'arpeggio'));
    
    return { 
      watermarkImg: results[0], 
      bgImg: results[1], 
      brandingImg: results[2],
      timingIcon: results[3],
      noteChangeIcon: results[4],
      crownIcon: results[5],
      starIcon: results[6],
      arpeggioIcon: results[7] || null
    };
  });
}

// 依次尝试多个路径，加载图片并返回真正的 Image 对象
// 【单例模式】优先使用缓存的 Image 对象，其次使用缓存的 Base64 数据
// @param {Canvas} canvas - Canvas 实例
// @param {Array} candidates - 候选路径数组
// @param {String} imageKey - 图片的唯一标识符，用于缓存
function resolveImageFromCandidates(canvas, candidates, imageKey) {
  var candidatesCopy = candidates.slice(); // 不修改原数组
  var cacheKey = imageKey || candidatesCopy[0] || ''; // 使用 imageKey 或第一个候选路径作为缓存键
  
  return new Promise(function(resolve, reject){
    var i = 0;
    var errors = [];
    var resolved = false;
    
    // 根据文件扩展名获取 MIME 类型
    function getMimeType(path) {
      var ext = (path || '').split('.').pop().toLowerCase();
      var mimeMap = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml'
      };
      return mimeMap[ext] || 'image/png';
    }
    
    // 检查文件系统信息，用于调试
    function checkFileSystem(src) {
      try {
        var fs = wx.getFileSystemManager();
        var iconsFolderPath = '/subpackages/packageA/icons';
        var iconsExists = false;
        try {
          fs.accessSync(iconsFolderPath);
          iconsExists = true;
        } catch (e) {
          iconsExists = false;
        }
        
        var fileExists = false;
        try {
          fs.accessSync(src);
          fileExists = true;
        } catch (e) {
          fileExists = false;
        }
        
        return {
          iconsFolder: iconsExists ? '存在' : '不存在',
          targetFile: fileExists ? '存在' : '不存在',
          path: src
        };
      } catch (e) {
        return { error: e.message, path: src };
      }
    }
    
    function safeResolve(img) {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        // 【缓存 Image 对象】供后续导出使用
        if (imageKey && img) {
          _imageObjCache[imageKey] = img;
          console.log('[resolveImageFromCandidates] 已缓存 Image 对象:', imageKey);
        }
        resolve(img);
      }
    }
    
    // 使用 canvas.createImage() 创建图片对象
    function createCanvasImage() {
      if (canvas && typeof canvas.createImage === 'function') {
        return canvas.createImage();
      }
      return null;
    }
    
    // 从 Base64 Data URL 创建 Image 对象
    function createImageFromDataUrl(dataUrl, callback) {
      var img = createCanvasImage();
      if (!img) {
        callback(new Error('canvas.createImage 不可用'), null);
        return;
      }
      
      var imgLoaded = false;
      var imgTimeoutId = setTimeout(function() {
        if (!imgLoaded) {
          callback(new Error('Image.onload 超时'), null);
        }
      }, 5000);
      
      img.onload = function() {
        if (!imgLoaded) {
          imgLoaded = true;
          clearTimeout(imgTimeoutId);
          console.log('[resolveImageFromCandidates] Image 从 Base64 加载成功, size:', img.width + 'x' + img.height);
          callback(null, img);
        }
      };
      
      img.onerror = function(e) {
        if (!imgLoaded) {
          imgLoaded = true;
          clearTimeout(imgTimeoutId);
          callback(e || new Error('Image.onerror'), null);
        }
      };
      
      img.src = dataUrl;
      
      // 【真机兼容】检查 complete 属性
      setTimeout(function() {
        if (!imgLoaded && img.complete && img.width > 0 && img.height > 0) {
          imgLoaded = true;
          clearTimeout(imgTimeoutId);
          console.log('[resolveImageFromCandidates] 通过 complete 属性检测到图片已加载');
          callback(null, img);
        }
      }, 100);
    }
    
    // 【优先检查 Image 对象缓存】
    if (_imageObjCache[cacheKey] && _imageObjCache[cacheKey].width > 0) {
      console.log('[resolveImageFromCandidates] 命中 Image 对象缓存:', cacheKey);
      resolve(_imageObjCache[cacheKey]);
      return;
    }
    
    // 【其次检查 Base64 数据缓存】
    if (_imageBase64Cache[cacheKey]) {
      console.log('[resolveImageFromCandidates] 命中 Base64 缓存, 创建新 Image 对象:', cacheKey);
      createImageFromDataUrl(_imageBase64Cache[cacheKey], function(err, img) {
        if (err) {
          console.warn('[resolveImageFromCandidates] 从 Base64 缓存创建 Image 失败，清除缓存重试');
          delete _imageBase64Cache[cacheKey];
          delete _imageObjCache[cacheKey];
          // 继续正常流程
          startLoading();
        } else {
          // 缓存新创建的 Image 对象
          if (imageKey) {
            _imageObjCache[imageKey] = img;
          }
          resolve(img);
        }
      });
      return;
    }
    
    // 设置总超时（15秒）
    var timeoutId = setTimeout(function() {
      if (!resolved) {
        resolved = true;
        var fsInfo = checkFileSystem(candidatesCopy[0] || '');
        console.error('[resolveImageFromCandidates] 图片加载超时!');
        console.error('  候选路径:', JSON.stringify(candidatesCopy));
        console.error('  已尝试错误:', errors.join(' | '));
        console.error('  文件系统检查:', JSON.stringify(fsInfo));
        reject(new Error('图片加载超时, 路径: ' + candidatesCopy[0] + ', icons文件夹: ' + fsInfo.iconsFolder + ', 文件存在: ' + fsInfo.targetFile));
      }
    }, 15000);
    
    function startLoading() {
      tryNext();
    }
    
    function tryNext() {
      if (resolved) return;
      if (i >= candidatesCopy.length) { 
        if (!resolved) {
          resolved = true;
          clearTimeout(timeoutId);
          var fsInfo = checkFileSystem(candidatesCopy[0] || '');
          console.error('[resolveImageFromCandidates] 所有候选路径失败!');
          console.error('  文件系统检查:', JSON.stringify(fsInfo));
          reject(new Error('all candidates failed: ' + errors.join(' | ') + ' | icons文件夹: ' + fsInfo.iconsFolder)); 
        }
        return; 
      }
      var src = candidatesCopy[i++];
      console.log('[resolveImageFromCandidates] 尝试路径 ' + i + '/' + candidatesCopy.length + ':', src);
      
      // 使用 getImageInfo 获取图片信息和临时路径
      wx.getImageInfo({
        src: src,
        success: function(res){
          if (resolved) return;
          console.log('[resolveImageFromCandidates] getImageInfo 成功, 临时路径:', res.path, '尺寸:', res.width + 'x' + res.height);
          
          // 【关键修复】使用 getImageInfo 返回的临时路径 res.path 来读取文件
          // 真机上这个临时路径是可以被 FileSystemManager 读取的
          var fs = wx.getFileSystemManager();
          var mimeType = getMimeType(src);
          
          fs.readFile({
            filePath: res.path, // 【重要】使用 res.path 而不是 src
            encoding: 'base64',
            success: function(readRes) {
              if (resolved) return;
              var dataUrl = 'data:' + mimeType + ';base64,' + readRes.data;
              console.log('[resolveImageFromCandidates] 成功读取文件为 Base64, 数据长度:', readRes.data.length);
              
              // 【缓存 Base64 数据】供后续导出使用
              _imageBase64Cache[cacheKey] = dataUrl;
              console.log('[resolveImageFromCandidates] 已缓存 Base64 数据:', cacheKey);
              
              createImageFromDataUrl(dataUrl, function(imgErr, img) {
                if (resolved) return;
                if (imgErr) {
                  errors.push(src + ' -> createImage失败: ' + (imgErr.message || imgErr));
                  tryNext();
                } else {
                  safeResolve(img);
                }
              });
            },
            fail: function(readErr) {
              if (resolved) return;
              console.warn('[resolveImageFromCandidates] readFile 失败 (使用临时路径):', res.path, readErr.errMsg || readErr);
              errors.push(src + ' -> readFile(临时路径)失败: ' + (readErr.errMsg || readErr));
              tryNext();
            }
          });
        },
        fail: function(err){
          if (resolved) return;
          var errMsg = err.errMsg || JSON.stringify(err);
          console.warn('[resolveImageFromCandidates] getImageInfo 失败:', src, errMsg);
          errors.push(src + ' -> getImageInfo: ' + errMsg);
          // SVG 在部分环境下 getImageInfo 不可用，直接读文件转 Base64 再 createImage
          if (src && (src.toLowerCase().indexOf('.svg') !== -1)) {
            var fs = wx.getFileSystemManager();
            var mimeType = 'image/svg+xml';
            fs.readFile({
              filePath: src,
              encoding: 'base64',
              success: function(readRes) {
                if (resolved) return;
                var dataUrl = 'data:' + mimeType + ';base64,' + readRes.data;
                _imageBase64Cache[cacheKey] = dataUrl;
                createImageFromDataUrl(dataUrl, function(imgErr, img) {
                  if (resolved) return;
                  if (imgErr) {
                    errors.push(src + ' -> SVG createImage失败: ' + (imgErr.message || imgErr));
                    tryNext();
                  } else {
                    if (imageKey) _imageObjCache[imageKey] = img;
                    safeResolve(img);
                  }
                });
              },
              fail: function(readErr) {
                if (resolved) return;
                errors.push(src + ' -> readFile(SVG)失败: ' + (readErr.errMsg || readErr));
                tryNext();
              }
            });
            return;
          }
          tryNext();
        }
      });
    }
    
    startLoading();
  });
}

// 使用 canvas.createImage() 加载图片
// 【真机兼容】使用 Base64 Data URL 加载图片，避免 "not node js file system" 错误
function loadImageViaInfo(canvas, src) {
  return new Promise(function(resolve, reject){
    var resolved = false;
    
    // 根据文件扩展名获取 MIME 类型
    function getMimeType(path) {
      var ext = (path || '').split('.').pop().toLowerCase();
      var mimeMap = {
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml'
      };
      return mimeMap[ext] || 'image/png';
    }
    
    wx.getImageInfo({
      src: src,
      success: function(res){
        if (resolved) return;
        if (canvas && typeof canvas.createImage === 'function') {
          // 读取文件为 Base64
          var fs = wx.getFileSystemManager();
          var mimeType = getMimeType(src);
          
          fs.readFile({
            filePath: src,
            encoding: 'base64',
            success: function(readRes) {
              if (resolved) return;
              var dataUrl = 'data:' + mimeType + ';base64,' + readRes.data;
              
              var img = canvas.createImage();
              var imgLoaded = false;
              
              img.onload = function() {
                if (!imgLoaded && !resolved) {
                  imgLoaded = true;
                  resolved = true;
                  resolve(img);
                }
              };
              
              img.onerror = function(e) {
                if (!imgLoaded && !resolved) {
                  imgLoaded = true;
                  resolved = true;
                  reject(e);
                }
              };
              
              img.src = dataUrl;
              
              // 【真机兼容】检查 complete 属性
              setTimeout(function() {
                if (!imgLoaded && !resolved && img.complete && img.width > 0 && img.height > 0) {
                  imgLoaded = true;
                  resolved = true;
                  resolve(img);
                }
              }, 100);
            },
            fail: function(readErr) {
              if (!resolved) {
                resolved = true;
                reject(readErr);
              }
            }
          });
        } else {
          if (!resolved) {
            resolved = true;
            reject(new Error('canvas.createImage 不可用'));
          }
        }
      },
      fail: function(err){
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      }
    });
  });
}

// 使用 canvas.createImage() 加载图片
// 【真机兼容】使用 Base64 Data URL 加载图片，避免 "not node js file system" 错误
function loadImage(canvas, src) {
  return new Promise((resolve, reject) => {
    if (canvas && typeof canvas.createImage === 'function') {
      // 根据文件扩展名获取 MIME 类型
      function getMimeType(path) {
        var ext = (path || '').split('.').pop().toLowerCase();
        var mimeMap = {
          'png': 'image/png',
          'jpg': 'image/jpeg',
          'jpeg': 'image/jpeg',
          'gif': 'image/gif',
          'webp': 'image/webp',
          'svg': 'image/svg+xml'
        };
        return mimeMap[ext] || 'image/png';
      }
      
      // 先尝试直接加载（适用于网络图片或 data URL）
      if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
        var img = canvas.createImage();
        var imgLoaded = false;
        var resolved = false;
        
        img.onload = () => {
          if (!imgLoaded && !resolved) {
            imgLoaded = true;
            resolved = true;
            resolve(img);
          }
        };
        
        img.onerror = (e) => {
          if (!imgLoaded && !resolved) {
            imgLoaded = true;
            resolved = true;
            reject(e);
          }
        };
        
        img.src = src;
        
        setTimeout(() => {
          if (!imgLoaded && !resolved && img.complete && img.width > 0 && img.height > 0) {
            imgLoaded = true;
            resolved = true;
            resolve(img);
          }
        }, 100);
      } else {
        // 本地文件需要转换为 Base64
        var fs = wx.getFileSystemManager();
        var mimeType = getMimeType(src);
        
        fs.readFile({
          filePath: src,
          encoding: 'base64',
          success: function(readRes) {
            var dataUrl = 'data:' + mimeType + ';base64,' + readRes.data;
            
            var img = canvas.createImage();
            var imgLoaded = false;
            var resolved = false;
            
            img.onload = () => {
              if (!imgLoaded && !resolved) {
                imgLoaded = true;
                resolved = true;
                resolve(img);
              }
            };
            
            img.onerror = (e) => {
              if (!imgLoaded && !resolved) {
                imgLoaded = true;
                resolved = true;
                reject(e);
              }
            };
            
            img.src = dataUrl;
            
            setTimeout(() => {
              if (!imgLoaded && !resolved && img.complete && img.width > 0 && img.height > 0) {
                imgLoaded = true;
                resolved = true;
                resolve(img);
              }
            }, 100);
          },
          fail: function(readErr) {
            reject(readErr);
          }
        });
      }
    } else {
      reject(new Error('canvas.createImage 不可用'));
    }
  });
}

/**
 * 图片水印（居中，按页面宽度比例缩放）
 */
// 计算右上角水印与文字的布局参数
// 【修改】logo贴近页面右侧、上侧边缘，不预留间距
function computeTopRightWatermarkMetrics(image, pageWidth, isA4Landscape = false, modeConfig = null) {
  // 获取配置
  const config = modeConfig || exportConfig.LONG_IMAGE_CONFIG;
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  // 【修改】margin设为0，logo贴边
  var margin = 0;
  var baseScale = config.watermarkScaleBase || 0.08;
  // A4横向时水印尺寸可能需要缩小
  var landscapeMultiplier = config.watermarkLandscapeScaleMultiplier !== undefined ? config.watermarkLandscapeScaleMultiplier : (2/3);
  var scale = isA4Landscape ? baseScale * landscapeMultiplier : baseScale;
  var imgWidth = pageWidth * scale;
  var aspect = image.height / image.width;
  var imgHeight = imgWidth * aspect;
  // 【修改】x和y都从0开始，logo贴近右上角边缘
  var x = pageWidth - imgWidth;
  var y = 0;
  var labelGap = config.watermarkLabelGap || 6;
  var labelFontPx = config.watermarkLabelFontSize || 10;
  var labelX = x + imgWidth / 2; // 水平居中于水印
  var labelY = y + imgHeight + labelGap; // 紧贴水印下方
  var bottomY = labelY + labelFontPx; // 估算文字高度为 fontPx
  return {
    margin: margin,
    imgWidth: imgWidth,
    imgHeight: imgHeight,
    x: x,
    y: y,
    labelGap: labelGap,
    labelFontPx: labelFontPx,
    labelX: labelX,
    labelY: labelY,
    bottomY: bottomY
  };
}

// 右上角水印 + 小字说明（不透明，文字居中于水印下方）
function addTopRightWatermarkWithLabel(ctx, image, pageWidth, pageHeight, isA4Landscape = false, modeConfig = null) {
  if (!image) return;
  
  const config = modeConfig || exportConfig.LONG_IMAGE_CONFIG;
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  var m = computeTopRightWatermarkMetrics(image, pageWidth, isA4Landscape, config);
  ctx.save();
  ctx.globalAlpha = 1.0;
  // 直接使用 Image 对象绘制
  ctx.drawImage(image, m.x, m.y, m.imgWidth, m.imgHeight);
  ctx.fillStyle = commonConfig.watermarkLabelColor;
  ctx.font = 'normal ' + m.labelFontPx + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(commonConfig.watermarkLabelText, m.labelX, m.labelY);
  ctx.restore();
}

/**
 * 右下角背景图
 * @param {number} alpha - 透明度 (0-1)
 * @param {number} sizeScale - 大小比例 (0-1), 默认0.67（2/3）
 * @param {Object} modeConfig - 模式配置（可选）
 */
function addCornerBackgroundImage(ctx, image, pageWidth, pageHeight, alpha, sizeScale, modeConfig = null) {
  if (!image) return;
  
  const config = modeConfig || exportConfig.LONG_IMAGE_CONFIG;
  
  if (alpha === undefined) alpha = config.bgOpacity || 0.1;
  if (sizeScale === undefined) sizeScale = config.bgSizeScale || 2/3;
  
  // 当页面为横向（A4 横向）时，使用更小的背景图比例，避免占用过多空间
  const isLandscape = pageWidth > pageHeight;
  // 基于传入的 sizeScale 进行调整
  const landscapeMultiplier = config.bgLandscapeScaleMultiplier !== undefined ? config.bgLandscapeScaleMultiplier : 0.5;
  const scale = isLandscape ? sizeScale * landscapeMultiplier : sizeScale;
  const bgWidth = pageWidth * scale;
  const aspect = image.height / image.width;
  const bgHeight = bgWidth * aspect;
  // 若背景高度超出页面高度的一定比例，则进一步缩小，避免覆盖主要内容
  const maxHeightRatio = config.bgMaxHeightRatio || 0.5;
  const maxHeight = pageHeight * maxHeightRatio;
  let finalBgWidth = bgWidth;
  let finalBgHeight = bgHeight;
  if (bgHeight > maxHeight) {
    const reduceScale = maxHeight / bgHeight;
    finalBgHeight = Math.round(bgHeight * reduceScale);
    finalBgWidth = Math.round(bgWidth * reduceScale);
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  // 直接使用 Image 对象绘制
  ctx.drawImage(image,
    pageWidth - finalBgWidth,
    pageHeight - finalBgHeight,
    finalBgWidth,
    finalBgHeight);
  ctx.restore();
}

/**
 * 添加文字水印（页面中央，10%透明度）
 */
function addTextWatermark(ctx, centerX, centerY) {
  const commonConfig = exportConfig.COMMON_CONFIG;
  ctx.save();
  ctx.globalAlpha = commonConfig.textWatermarkOpacity;
  ctx.fillStyle = commonConfig.textWatermarkColor;
  ctx.font = commonConfig.textWatermarkFont;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(commonConfig.textWatermarkText, centerX, centerY);
  ctx.restore();
}

/**
 * 底部居中添加品牌 Logo 图片
 * 使用 logo3.png 替代文字
 * @param {Object} modeConfig - 模式配置（可选）
 */
function addBottomCenterBranding(ctx, brandingImg, pageWidth, pageHeight, modeConfig = null) {
  const config = modeConfig || exportConfig.LONG_IMAGE_CONFIG;
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  if (!brandingImg) {
    // 如果图片加载失败，回退到文字方式
    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.fillStyle = commonConfig.brandingFallbackColor;
    ctx.font = commonConfig.brandingFallbackFont;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(commonConfig.brandingFallbackText, pageWidth / 2, pageHeight - 20);
    ctx.restore();
    return;
  }
  
  // 绘制品牌 Logo 图片
  ctx.save();
  // 图片高度从配置读取
  var imgHeight = config.brandingHeight || 24;
  var aspect = brandingImg.width / brandingImg.height;
  var imgWidth = imgHeight * aspect;
  // 水平居中，距离底部的距离从配置读取
  var brandingBottomMargin = config.brandingBottomMargin || 15;
  var x = (pageWidth - imgWidth) / 2;
  var y = pageHeight - imgHeight - brandingBottomMargin;
  // 直接使用 Image 对象绘制
  ctx.drawImage(brandingImg, x, y, imgWidth, imgHeight);
  ctx.restore();
}

/**
 * 绘制单个小节
 * 音符位置轨道：
 * @param {Object} config - 当前模式的配置参数（可选）
 */
function drawMeasure(ctx, measure, x, y, width, rightHandColor, leftHandColor, measureHeight, noteFontSizePx, measureIndex, measuresPerRow, exportLayoutMode, config = null, adjustParams = null, arpeggioIcon = null) {
  // 获取配置
  const modeConfig = config || exportConfig.getExportConfig({
    exportMode: 'long',
    a4Orientation: 'portrait',
    exportLayoutMode: exportLayoutMode || 'compact'
  });
  const commonConfig = exportConfig.COMMON_CONFIG;
  
  const beatCount = Array.isArray(measure.beats) ? measure.beats.length : 4;
  const beatWidth = width / (beatCount || 4);
  const lineHeight = measureHeight || 70; // 使用传入的高度或默认值
  
  // 定义固定的音符轨道位置（从配置读取）
  const trackRightHand1 = commonConfig.trackRightHand1;
  const trackRightHand2 = commonConfig.trackRightHand2;
  const trackLeftHand1 = commonConfig.trackLeftHand1;
  const trackLeftHand2 = commonConfig.trackLeftHand2;
  
  // 绘制小节编号（统一在左侧小节线上方，水平居中对齐）
  if (typeof measureIndex === 'number') {
    ctx.fillStyle = commonConfig.measureIndexColor;
    const isMultiMeasure = measuresPerRow && measuresPerRow > 1;
    const fontSize = isMultiMeasure ? modeConfig.measureIndexFontSizeMulti : modeConfig.measureIndexFontSizeSingle;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    // 统一在小节线正上方，水平居中
    ctx.fillText(String(measureIndex), x, y - modeConfig.measureIndexOffsetY);
  }
  
  // 【修复】计算最后一个非占位拍的索引，用于正确绘制右侧小节线和中央横线
  let lastRealBeatIndex = measure.beats.length - 1;
  for (let i = measure.beats.length - 1; i >= 0; i--) {
    if (!measure.beats[i].isPlaceholder) {
      lastRealBeatIndex = i;
      break;
    }
  }
  // 计算实际绘制宽度（到最后一个非占位拍为止）
  const actualWidth = (lastRealBeatIndex + 1) * beatWidth;
  
  // 小节线（左侧）
  ctx.strokeStyle = commonConfig.measureLineColor;
  ctx.lineWidth = modeConfig.measureLineWidth;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + lineHeight);
  ctx.stroke();
  
  // 中央横线 - 【修复】只绘制到最后一个非占位拍的位置
  ctx.strokeStyle = commonConfig.centerLineColor;
  ctx.lineWidth = modeConfig.centerLineWidth;
  ctx.beginPath();
  ctx.moveTo(x, y + lineHeight / 2);
  ctx.lineTo(x + actualWidth, y + lineHeight / 2);
  ctx.stroke();
  
  // 绘制每拍
  measure.beats.forEach((beat, bIdx) => {
    // 【修复】跳过占位拍，不绘制内容
    if (beat.isPlaceholder) {
      return;
    }
    
    const beatX = x + (bIdx * beatWidth);
    
    // 拍子分隔线（跳过第一拍，且不在占位拍前绘制）
    const prevBeat = bIdx > 0 ? measure.beats[bIdx - 1] : null;
    if (bIdx > 0 && !prevBeat?.isPlaceholder) {
      ctx.strokeStyle = commonConfig.beatLineColor;
      ctx.lineWidth = modeConfig.beatLineWidth;
      ctx.beginPath();
      ctx.moveTo(beatX, y);
      ctx.lineTo(beatX, y + lineHeight);
      ctx.stroke();
    }
    
    // 绘制 subdivision，宽度由 subdivision 数量决定（支持自定义拍型）
    const subdivisionCount = Array.isArray(beat.subdivisions) ? beat.subdivisions.length : 4;
    const subdivisionWidth = beatWidth / (subdivisionCount || 1);
    (beat.subdivisions || []).forEach((subdivision, sIdx) => {
      const subX = beatX + (sIdx * subdivisionWidth);
      
      // 16分音符分隔线（跳过第一个）
      if (sIdx > 0) {
        ctx.strokeStyle = commonConfig.subdivisionLineColor;
        ctx.lineWidth = modeConfig.subdivisionLineWidth;
        ctx.beginPath();
        ctx.moveTo(subX, y + lineHeight * modeConfig.subdivisionLineTopRatio);
        ctx.lineTo(subX, y + lineHeight * modeConfig.subdivisionLineBottomRatio);
        ctx.stroke();
      }
      
      // 计算音符绘制的偏移量（用于琶音）
      let noteOffsetX = 0;
      const hasArpeggio = subdivision.hasArpeggio;
      
      // 如果有琶音标记，绘制琶音符号并偏移音符
      if (hasArpeggio) {
        const arpeggioWidth = 6; // 琶音符号宽度（保持不变）
        noteOffsetX = arpeggioWidth;
        const symbolWidth = arpeggioWidth - 1;
        // 高度维持原比例：arpeggio.svg 86×715
        const symbolHeight = symbolWidth * (715 / 86);
        const symbolY = y + (lineHeight - symbolHeight) / 2;
        
        // 优先使用 arpeggio.svg 图片，否则绘制波浪线；与小节线垂直居中
        const img = arpeggioIcon;
        const imgW = img && (img.width || img.naturalWidth);
        const imgH = img && (img.height || img.naturalHeight);
        if (img && imgW > 0 && imgH > 0) {
          ctx.save();
          ctx.drawImage(img, subX + 1, symbolY, symbolWidth, symbolHeight);
          ctx.restore();
        } else {
          drawArpeggioSymbol(ctx, subX + 1, symbolY, symbolWidth, symbolHeight);
        }
      }
      
      // 获取音符连携比例系数（用于整体缩放音符相关参数）
      const noteScaleFactor = modeConfig.noteScaleFactor || 1.0;
      
      // 绘制音符数字（应用连携比例）
      const baseFontSize = noteFontSizePx || 14;
      const fontSize = Math.round(baseFontSize * noteScaleFactor);
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const noteX = subX + noteOffsetX + (subdivisionWidth - noteOffsetX) / 2;
      
      // 判断是否为紧凑模式
      const isCompactMode = exportLayoutMode !== 'loose';
      
      // 音高圆点参数（从配置读取，应用连携比例）
      const dotSizeRatio = isCompactMode 
        ? (modeConfig.compactDotSizeRatio || modeConfig.dotSizeRatio || 0.20)
        : (modeConfig.looseDotSizeRatio || modeConfig.dotSizeRatio || 0.25);
      const dotSize = Math.max(1, Math.round(fontSize * dotSizeRatio));
      
      // 音高圆点间距（应用连携比例）
      const baseDotGap = isCompactMode 
        ? (modeConfig.compactDotGap !== undefined ? modeConfig.compactDotGap : (modeConfig.dotGap || 0.5))
        : Math.round(baseFontSize * (modeConfig.looseDotGapRatio || modeConfig.dotGapRatio || 0.03));
      const dotGap = Math.max(0.5, baseDotGap * noteScaleFactor);
      
      // 上标参数（应用连携比例）
      const supFontSizeRatio = modeConfig.supFontSizeRatio || 0.55;
      const supFontSize = Math.max(6, Math.round(fontSize * supFontSizeRatio));
      
      const supDotSizeRatio = isCompactMode 
        ? (modeConfig.compactSupDotSizeRatio || modeConfig.supDotSizeRatio || 0.13)
        : (modeConfig.looseSupDotSizeRatio || modeConfig.supDotSizeRatio || 0.12);
      const supDotSize = Math.max(1, Math.round(fontSize * supDotSizeRatio));
      const supDotGap = Math.max(0.5, (isCompactMode ? (modeConfig.compactDotGap || 0.5) : dotGap) * noteScaleFactor);
      
      // 下划线参数（应用连携比例）- 支持用户调整
      const underlineThicknessMultiplier = adjustParams && adjustParams.underlineThicknessAdjust !== undefined 
        ? (adjustParams.underlineThicknessAdjust / 50) : 1.0;
      const underlineThicknessRatio = modeConfig.underlineThicknessRatio || 0.11;
      const underlineWidthRatio = modeConfig.underlineWidthRatio || 0.8;
      const underlineThickness = Math.max(1, Math.round(fontSize * underlineThicknessRatio * underlineThicknessMultiplier));
      const underlineWidth = Math.round(fontSize * underlineWidthRatio);
      
      // 计算文字的顶部和底部位置
      const textHalfHeightRatio = modeConfig.octaveUpTextHalfHeightRatio || 0.45;
      const textHalfHeight = fontSize * textHalfHeightRatio;
      
      // 音高圆点偏移（确保至少有足够的偏移量显示圆点）
      const octaveUpMultiplier = modeConfig.octaveUpOffsetMultiplier || 1.1;
      const octaveDownMultiplier = isCompactMode 
        ? (modeConfig.octaveDownOffsetMultiplierCompact || modeConfig.octaveDownOffsetMultiplier || 0.6)
        : (modeConfig.octaveDownOffsetMultiplierLoose || modeConfig.octaveDownOffsetMultiplier || 0.6);
      
      const octaveUpOffset = textHalfHeight * octaveUpMultiplier + dotGap + dotSize / 2;
      const octaveDownOffset = textHalfHeight * octaveDownMultiplier + dotGap + dotSize / 2;
      
      // 下划线偏移 - 支持用户调整
      const underlineOffsetMultiplier = adjustParams && adjustParams.underlineOffsetAdjust !== undefined 
        ? (adjustParams.underlineOffsetAdjust / 50) : 1.0;
      const underlineOffsetRatio = modeConfig.underlineOffsetRatio || 0.9;
      const underlineExtraOffset = (modeConfig.underlineExtraOffset || 2) * noteScaleFactor;
      const underlineOffset = (textHalfHeight * underlineOffsetRatio + underlineExtraOffset) * underlineOffsetMultiplier;
      
      // 下划线与低八度圆点共存时的间距
      const underlineDotGapBase = modeConfig.underlineDotGapBase || 1;
      const underlineDotGapRatio = modeConfig.underlineDotGapRatio || 0.04;
      const underlineDotGap = Math.max(1, Math.min(4, underlineDotGapBase + Math.round(fontSize * underlineDotGapRatio)));
      
      // 上标内的音高圆点偏移
      const supOctaveUpOffsetRatio = modeConfig.supOctaveUpOffsetRatio || 0.65;
      const supOctaveDownOffsetRatio = isCompactMode 
        ? (modeConfig.supOctaveDownOffsetRatioCompact || modeConfig.supOctaveDownOffsetRatio || 0.45)
        : (modeConfig.supOctaveDownOffsetRatioLoose || modeConfig.supOctaveDownOffsetRatio || 0.4);
      const supOctaveUpOffset = supFontSize * supOctaveUpOffsetRatio;
      const supOctaveDownOffset = supFontSize * supOctaveDownOffsetRatio;
      
      // 上标位置偏移
      const supOffsetXRatio = modeConfig.supOffsetXRatio || 0.5;
      const supOffsetYRatio = modeConfig.supOffsetYRatio || 0.4;
      
      // 绘制单个音符的辅助函数
      const drawNoteWithFeatures = (note, noteX, noteY, color) => {
        const parsed = parseSimplifiedNote(note);
        ctx.fillStyle = color;
        
        // 绘制左上标
        if (parsed.leftSup) {
          const supParsed = parseSupContent(parsed.leftSup);
          const supX = noteX - fontSize * supOffsetXRatio;
          const supY = noteY - fontSize * supOffsetYRatio;
          ctx.font = 'bold ' + supFontSize + 'px sans-serif';
          ctx.fillText(supParsed.baseNote, supX, supY);
          // 上标的八度点
          if (supParsed.octaveUp > 0) {
            drawOctaveDots(ctx, supX, supY - supOctaveUpOffset, true, supParsed.octaveUp, supDotSize, supDotGap, color);
          }
          if (supParsed.octaveDown > 0) {
            drawOctaveDots(ctx, supX, supY + supOctaveDownOffset, false, supParsed.octaveDown, supDotSize, supDotGap, color);
          }
        }
        
        // 绘制主音符
        ctx.font = 'bold ' + fontSize + 'px sans-serif';
        ctx.fillText(parsed.baseNote, noteX, noteY);
        
        // 绘制上八度点
        if (parsed.octaveUp > 0) {
          drawOctaveDots(ctx, noteX, noteY - octaveUpOffset, true, parsed.octaveUp, dotSize, dotGap, color);
        }
        
        // 绘制下划线和低八度点
        // 当两者同时存在时，先绘制下划线，低八度点显示在下划线下方
        const hasUnderline = parsed.underline;
        const hasOctaveDown = parsed.octaveDown > 0;
        
        if (hasUnderline) {
          drawUnderline(ctx, noteX, noteY + underlineOffset, underlineWidth, underlineThickness, color);
        }
        
        if (hasOctaveDown) {
          let octaveDownY;
          if (hasUnderline) {
            // 当同时有下划线和低八度点时，低八度点显示在下划线下方
            // 位置 = 下划线Y + 下划线粗细/2 + 间距 + 圆点半径
            octaveDownY = noteY + underlineOffset + underlineThickness / 2 + underlineDotGap + dotSize / 2;
          } else {
            // 仅有低八度点时，使用原有位置
            octaveDownY = noteY + octaveDownOffset;
          }
          drawOctaveDots(ctx, noteX, octaveDownY, false, parsed.octaveDown, dotSize, dotGap, color);
        }
        
        // 绘制右上标
        if (parsed.rightSup) {
          const supParsed = parseSupContent(parsed.rightSup);
          const supX = noteX + fontSize * supOffsetXRatio;
          const supY = noteY - fontSize * supOffsetYRatio;
          ctx.font = 'bold ' + supFontSize + 'px sans-serif';
          ctx.fillText(supParsed.baseNote, supX, supY);
          // 上标的八度点
          if (supParsed.octaveUp > 0) {
            drawOctaveDots(ctx, supX, supY - supOctaveUpOffset, true, supParsed.octaveUp, supDotSize, supDotGap, color);
          }
          if (supParsed.octaveDown > 0) {
            drawOctaveDots(ctx, supX, supY + supOctaveDownOffset, false, supParsed.octaveDown, supDotSize, supDotGap, color);
          }
        }
        
        // 绘制附点（如果有）
        if (parsed.hasDot) {
          const augmentationDotSize = dotSize * 0.8; // 附点大小略小于八度点
          const augmentationDotGap = fontSize * 0.4; // 附点与音符的间距
          ctx.beginPath();
          ctx.arc(
            noteX + augmentationDotGap + augmentationDotSize / 2,
            noteY,
            augmentationDotSize / 2,
            0, Math.PI * 2
          );
          ctx.fill();
        }
      };
      
      // 右手（上方）- 使用指定的颜色
      if (subdivision.rightHand && subdivision.rightHand[0]) {
        const noteY0 = y + lineHeight * trackRightHand1;
        drawNoteWithFeatures(subdivision.rightHand[0], noteX, noteY0, rightHandColor || commonConfig.defaultRightHandColor);
      }
      if (subdivision.rightHand && subdivision.rightHand[1]) {
        const noteY1 = y + lineHeight * trackRightHand2;
        drawNoteWithFeatures(subdivision.rightHand[1], noteX, noteY1, rightHandColor || commonConfig.defaultRightHandColor);
      }
      
      // 左手（下方）- 使用指定的颜色
      if (subdivision.leftHand && subdivision.leftHand[0]) {
        const noteY0 = y + lineHeight * trackLeftHand1;
        drawNoteWithFeatures(subdivision.leftHand[0], noteX, noteY0, leftHandColor || commonConfig.defaultLeftHandColor);
      }
      if (subdivision.leftHand && subdivision.leftHand[1]) {
        const noteY1 = y + lineHeight * trackLeftHand2;
        drawNoteWithFeatures(subdivision.leftHand[1], noteX, noteY1, leftHandColor || commonConfig.defaultLeftHandColor);
      }
      
      // 绘制注记（在小节上方显示）
      if (subdivision.annotation) {
        const annotationFontSizeRatio = modeConfig.annotationFontSizeRatio || 0.65;
        const annotationFontSize = Math.round(fontSize * annotationFontSizeRatio);
        ctx.font = `${annotationFontSize}px sans-serif`;
        ctx.fillStyle = commonConfig.annotationColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        // 注记显示在小节编号下方、小节内容上方
        const annotationY = y - (modeConfig.annotationOffsetY || 8);
        ctx.fillText(subdivision.annotation, noteX, annotationY);
      }
    });
  });
  
  // 小节线（右侧）- 【修复】在最后一个非占位拍后面绘制
  ctx.strokeStyle = commonConfig.measureLineColor;
  ctx.lineWidth = modeConfig.measureLineWidth;
  ctx.beginPath();
  const rightBarX = x + (lastRealBeatIndex + 1) * beatWidth;
  ctx.moveTo(rightBarX, y);
  ctx.lineTo(rightBarX, y + lineHeight);
  ctx.stroke();
}

/**
 * 导出谱面为 PDF
 * 注意：小程序纯前端无法直接生成真实 PDF，此方法生成 PNG 后提示用户
 * 如需真实 PDF，需配置云函数转换服务
 */
function exportNotationToPDF(data) {
  return new Promise((resolve, reject) => {
    // 先生成 PNG
    exportNotationToPNG(data).then(pngPath => {
      // 提示用户当前为图片格式
      wx.showModal({
        title: '提示',
        content: '小程序纯前端暂不支持生成真实PDF，已为您生成PNG图片。如需PDF，请配置云函数转换服务。',
        showCancel: false,
        success() {
          resolve(pngPath);
        }
      });
    }).catch(err => {
      console.error('导出PDF失败', err);
      notifyExportFailure(err);
      reject(err);
    });
  });
}

/**
 * 下载PDF文件（云函数版本）
 * @param {String} fileID - 云文件ID或URL
 */
function downloadPDF(fileID) {
  wx.showLoading({ title: '下载中...' });
  
  wx.cloud.downloadFile({
    fileID: fileID,
    success: res => {
      wx.hideLoading();
      wx.openDocument({
        filePath: res.tempFilePath,
        fileType: 'pdf',
        success: () => {
          console.log('打开文档成功');
        }
      });
    },
    fail: err => {
      wx.hideLoading();
      wx.showToast({
        title: '下载失败',
        icon: 'none'
      });
      console.error('下载失败', err);
    }
  });
}

module.exports = {
  exportNotationToPNG,
  exportNotationToPDF,
  downloadPDF,
  imagesToPDF
};

/**
 * 将多张图片转换为 PDF 文件
 * 使用 pdf-lib 库（需要先在微信开发者工具中执行"构建 npm"）
 * @param {Array<string>} imagePaths - 图片临时路径数组
 * @param {string} fileName - 输出文件名
 * @param {Function} onProgress - 进度回调函数 (percent, stage) => boolean，返回false表示取消
 * @returns {Promise<string>} - PDF文件路径
 */
async function imagesToPDF(imagePaths, fileName, onProgress) {
  if (!imagePaths || imagePaths.length === 0) {
    throw new Error('没有图片可导出');
  }
  
  // 默认进度回调（不做任何事）
  const reportProgress = onProgress || (() => true);
  
  // 检查是否取消
  const checkCancelled = (percent, stage) => {
    const shouldContinue = reportProgress(percent, stage);
    if (shouldContinue === false) {
      throw new Error('USER_CANCELLED');
    }
  };
  
  console.log('开始生成PDF，图片数量:', imagePaths.length);
  console.log('图片路径:', imagePaths);
  
  try {
    checkCancelled(5, '正在加载PDF库...');
    
    // 动态导入 pdf-lib（需要先构建 npm）
    // 使用同步加载并缓存，避免异步问题导致加载失败
    let PDFDocument;
    try {
      // 尝试从缓存获取
      if (global.__pdfLibCache && global.__pdfLibCache.PDFDocument) {
        PDFDocument = global.__pdfLibCache.PDFDocument;
        console.log('pdf-lib 从缓存加载成功');
      } else {
        // 首次加载
        const pdfLib = require('pdf-lib');
        PDFDocument = pdfLib.PDFDocument;
        // 缓存到全局变量
        if (!global.__pdfLibCache) {
          global.__pdfLibCache = {};
        }
        global.__pdfLibCache.PDFDocument = PDFDocument;
        console.log('pdf-lib 首次加载成功');
      }
    } catch (e) {
      console.error('pdf-lib 导入失败:', e);
      // 提供更详细的错误信息
      const errMsg = e.message || String(e);
      if (errMsg.includes('not node js') || errMsg.includes('file system')) {
        throw new Error('PDF库加载失败，请重新进入页面后重试。如问题持续，请在微信开发者工具中重新执行"工具 -> 构建 npm"');
      }
      throw new Error('请先在微信开发者工具中执行"工具 -> 构建 npm"');
    }
    
    checkCancelled(10, '正在创建PDF文档...');
    
    // 创建 PDF 文档
    const pdfDoc = await PDFDocument.create();
    let successCount = 0;
    const totalImages = imagePaths.length;
    
    // 逐个处理图片
    for (let i = 0; i < totalImages; i++) {
      const imagePath = imagePaths[i];
      const basePercent = 10 + Math.floor((i / totalImages) * 70); // 10-80%
      
      checkCancelled(basePercent, `正在处理第 ${i + 1}/${totalImages} 页...`);
      
      console.log(`处理第${i + 1}张图片:`, imagePath);
      
      try {
        // 读取图片文件为 ArrayBuffer
        const imageData = await readFileAsArrayBuffer(imagePath);
        console.log(`图片${i + 1}读取成功，大小:`, imageData.byteLength);
        
        checkCancelled(basePercent + 2, `正在嵌入第 ${i + 1}/${totalImages} 页...`);
        
        // 转换为 Uint8Array（pdf-lib 需要这个格式）
        const uint8Array = new Uint8Array(imageData);
        console.log(`转换为 Uint8Array，长度:`, uint8Array.length);
        
        // 微信小程序 Canvas 导出的临时文件通常是 PNG 格式
        // 但文件路径可能没有扩展名，需要尝试两种格式
        let image;
        try {
          // 先尝试 PNG
          image = await pdfDoc.embedPng(uint8Array);
          console.log(`图片${i + 1}作为PNG嵌入成功`);
        } catch (pngErr) {
          console.log(`PNG嵌入失败，尝试JPG:`, pngErr.message);
          try {
            // PNG 失败则尝试 JPG
            image = await pdfDoc.embedJpg(uint8Array);
            console.log(`图片${i + 1}作为JPG嵌入成功`);
          } catch (jpgErr) {
            console.error(`图片${i + 1}嵌入失败:`, jpgErr.message);
            throw new Error('不支持的图片格式');
          }
        }
        
        // 计算页面尺寸
        // A4 尺寸 (points): 595.28 x 841.89
        // 保持图片比例
        const imgWidth = image.width;
        const imgHeight = image.height;
        const pageWidth = 595.28;
        const pageHeight = (imgHeight / imgWidth) * pageWidth;
        
        console.log(`图片${i + 1}尺寸: ${imgWidth}x${imgHeight}, 页面尺寸: ${pageWidth}x${pageHeight}`);
        
        // 添加页面并绘制图片
        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(image, {
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight
        });
        
        successCount++;
        console.log(`第${i + 1}张图片处理成功`);
      } catch (imgErr) {
        if (imgErr.message === 'USER_CANCELLED') {
          throw imgErr;
        }
        console.error(`处理第${i + 1}张图片失败:`, imgErr);
        // 继续处理其他图片
      }
    }
    
    console.log(`成功处理 ${successCount}/${imagePaths.length} 张图片`);
    
    // 检查是否有成功添加的页面
    if (pdfDoc.getPageCount() === 0) {
      throw new Error('没有成功处理任何图片');
    }
    
    checkCancelled(85, '正在生成PDF文件...');
    
    // 保存 PDF 为 Uint8Array
    console.log('开始保存PDF...');
    const pdfBytes = await pdfDoc.save();
    console.log('PDF生成成功，大小:', pdfBytes.length);
    
    checkCancelled(95, '正在保存文件...');
    
    // 先强制清理所有旧的导出文件，释放空间
    await cleanupAllExportFiles();
    
    // 写入临时文件
    const fs = wx.getFileSystemManager();
    const tempFilePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    try {
      await new Promise((resolve, reject) => {
        fs.writeFile({
          filePath: tempFilePath,
          data: pdfBytes.buffer,
          success: resolve,
          fail: reject
        });
      });
    } catch (writeErr) {
      console.error('写入临时文件失败:', writeErr);
      // 如果仍然失败，尝试让用户直接通过分享保存
      return await saveViaShare(pdfBytes.buffer, fileName, reportProgress);
    }
    
    console.log('临时文件写入成功:', tempFilePath);
    
    // 首先尝试使用 saveFileToPick 让用户选择保存位置（基础库 2.24.4+）
    // 这是最佳方案，会直接调起系统文件管理器
    console.log('准备调用 wx.saveFileToPick，让用户选择保存位置...');
    
    try {
      const savedPath = await saveFileToUserPick(tempFilePath, fileName);
      console.log('用户已选择保存位置，文件已保存到:', savedPath);
      reportProgress(100, '导出完成！');
      
      // 延迟删除临时文件，确保文件系统操作完成
      setTimeout(() => {
        fs.unlink({ 
          filePath: tempFilePath, 
          success: () => console.log('临时文件已清理'),
          fail: (err) => console.log('临时文件清理失败（可能已被移动）:', err)
        });
      }, 1000);
      
      return savedPath;
    } catch (pickErr) {
      console.error('wx.saveFileToPick 调用失败:', pickErr);
      
      // 检查是否是用户取消
      const errMsg = pickErr.errMsg || pickErr.message || '';
      if (errMsg.includes('cancel') || errMsg.includes('取消')) {
        console.log('用户取消了文件保存');
        // 不删除临时文件，让用户可以稍后手动处理
        reportProgress(100, '已取消');
        throw new Error('USER_CANCELLED');
      }
      
      // 如果是 API 不支持的错误，给出明确提示
      if (errMsg.includes('not supported') || errMsg.includes('not implemented') || pickErr.message === 'saveFileToPick API 不可用') {
        console.log('当前环境不支持 wx.saveFileToPick API，文件已保存到临时目录');
        reportProgress(100, '导出完成');
        // 返回临时文件路径，不删除文件，让用户在成功弹窗中选择是否分享
        return tempFilePath;
      }
      
      // 其他未知错误
      console.error('保存文件时发生未知错误:', pickErr);
      reportProgress(100, '保存失败');
      
      // 返回临时文件路径，不删除文件
      return tempFilePath;
    }
    
  } catch (err) {
    console.error('PDF生成失败:', err);
    throw err;
  }
}

/**
 * 让用户选择保存位置（调起系统文件管理器）
 * @param {string} tempFilePath - 临时文件路径
 * @param {string} fileName - 文件名
 * @returns {Promise<string>} - 保存后的文件路径
 */
function saveFileToUserPick(tempFilePath, fileName) {
  return new Promise((resolve, reject) => {
    // 检查 API 是否可用
    if (typeof wx.saveFileToPick !== 'function') {
      console.warn('wx.saveFileToPick API 不存在');
      reject(new Error('saveFileToPick API 不可用'));
      return;
    }
    
    console.log('调用 wx.saveFileToPick API...');
    console.log('临时文件路径:', tempFilePath);
    console.log('文件名:', fileName);
    
    wx.saveFileToPick({
      filePath: tempFilePath,
      fileName: fileName,
      success: (res) => {
        console.log('wx.saveFileToPick 成功:', res);
        resolve(res.savedFilePath || res.filePath || tempFilePath);
      },
      fail: (err) => {
        console.error('wx.saveFileToPick 失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 备用方案：使用分享功能保存文件
 * @param {string} filePath - 文件路径
 * @param {string} fileName - 文件名
 * @param {Object} fs - 文件系统管理器
 * @returns {Promise<void>}
 */
function shareFileFallback(filePath, fileName, fs) {
  return new Promise((resolve, reject) => {
    if (typeof wx.shareFileMessage !== 'function') {
      reject(new Error('wx.shareFileMessage API 不可用'));
      return;
    }
    
    console.log('准备通过分享方式保存文件...');
    
    // 直接调用分享，不再显示额外的提示框（已经在上层显示过了）
    wx.shareFileMessage({
      filePath: filePath,
      fileName: fileName,
      success: () => {
        console.log('文件分享成功');
        // 延迟5秒后删除临时文件，确保传输完成
        setTimeout(() => {
          if (fs) {
            fs.unlink({ 
              filePath: filePath,
              success: () => console.log('临时文件已清理'),
              fail: () => console.log('临时文件清理失败（可能仍在传输中）')
            });
          }
        }, 5000);
        resolve();
      },
      fail: (err) => {
        console.error('文件分享失败:', err);
        reject(err);
      }
    });
  });
}

/**
 * 通过分享方式保存文件（备用方案）
 * @param {ArrayBuffer} data - 文件数据
 * @param {string} fileName - 文件名
 * @param {Function} reportProgress - 进度回调
 * @returns {Promise<string>}
 */
function saveViaShare(data, fileName, reportProgress) {
  return new Promise((resolve, reject) => {
    // 使用 base64 编码保存到较小的临时文件
    const fs = wx.getFileSystemManager();
    const tempPath = `${wx.env.USER_DATA_PATH}/temp_${Date.now()}.pdf`;
    
    // 先尝试强力清理
    cleanupAllExportFiles().then(() => {
      fs.writeFile({
        filePath: tempPath,
        data: data,
        success: () => {
          reportProgress(100, '请选择保存方式');
          
          // 提示用户通过分享保存
          wx.showModal({
            title: '存储空间不足',
            content: 'PDF已生成，请通过"发送给朋友"或"保存到微信收藏"来保存文件',
            confirmText: '分享文件',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                wx.shareFileMessage({
                  filePath: tempPath,
                  success: () => {
                    // 分享成功后删除临时文件
                    fs.unlink({ filePath: tempPath, fail: () => {} });
                    resolve(tempPath);
                  },
                  fail: (err) => {
                    reject(new Error('分享失败: ' + readableError(err)));
                  }
                });
              } else {
                reject(new Error('用户取消保存'));
              }
            }
          });
        },
        fail: (err) => {
          reject(new Error('存储空间严重不足，无法生成PDF文件。请清理微信存储空间后重试。'));
        }
      });
    });
  });
}

/**
 * 强制清理所有导出相关的临时文件
 * @returns {Promise<void>}
 */
function cleanupAllExportFiles() {
  return new Promise((resolve) => {
    const fs = wx.getFileSystemManager();
    const userDataPath = wx.env.USER_DATA_PATH;
    
    fs.readdir({
      dirPath: userDataPath,
      success: (res) => {
        const files = res.files || [];
        const exportFiles = files.filter(name => {
          const n = name.toLowerCase();
          return n.endsWith('.pdf') || 
                 n.endsWith('.png') || 
                 n.endsWith('.jpg') ||
                 n.startsWith('notation_') ||
                 n.startsWith('export_') ||
                 n.startsWith('temp_');
        });
        
        if (exportFiles.length === 0) {
          resolve();
          return;
        }
        
        console.log(`清理 ${exportFiles.length} 个导出临时文件...`);
        let completed = 0;
        
        exportFiles.forEach(fileName => {
          fs.unlink({
            filePath: `${userDataPath}/${fileName}`,
            complete: () => {
              completed++;
              if (completed >= exportFiles.length) {
                console.log('临时文件清理完成');
                resolve();
              }
            }
          });
        });
      },
      fail: () => resolve()
    });
  });
}

/**
 * 读取文件为 ArrayBuffer
 */
function readFileAsArrayBuffer(filePath) {
  return new Promise((resolve, reject) => {
    const fs = wx.getFileSystemManager();
    fs.readFile({
      filePath: filePath,
      encoding: '', // 不指定编码，返回 ArrayBuffer
      success: (res) => {
        // 不打印 res.data 避免真机调试内存溢出
        resolve(res.data);
      },
      fail: (err) => {
        console.error('读取文件失败:', err);
        reject(new Error('读取图片失败: ' + readableError(err)));
      }
    });
  });
}

