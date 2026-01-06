// 谱面导出工具 - 纯前端实现（Canvas 绘制）

// A4 尺寸常量（像素，300 DPI）
const A4_WIDTH = 2480; // 约 210mm
const A4_HEIGHT = 3508; // 约 297mm
const CONTENT_PADDING = 120; // 内容边距
const CONTENT_WIDTH = A4_WIDTH - CONTENT_PADDING * 2;

// 将错误对象转换为可读提示
function readableError(err, fallback) {
  if (!err) return fallback || '未知错误';
  if (typeof err === 'string') return err;
  if (err.errMsg) return err.errMsg;
  if (err.message) return err.message;
  return fallback || '未知错误';
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
    const canvas = wx.createOffscreenCanvas({ type: '2d' });
    drawNotationOnCanvas(canvas, data, resolve, reject, false);
  });
}

/**
 * 导出为分页图片
 */
function exportAsPages(data) {
  return new Promise((resolve, reject) => {
    const canvas = wx.createOffscreenCanvas({ type: '2d' });
    drawNotationOnCanvas(canvas, data, resolve, reject, true);
  });
}

/**
 * 在 Canvas 上绘制谱面
 */
function drawNotationOnCanvas(canvas, data, resolve, reject, isPaged) {
  var notations = data.notations;
  var mainTitle = data.mainTitle;
  var subTitle = data.subTitle;
  var globalTempo = data.globalTempo;
  var mainTitleColor = data.mainTitleColor;
  var subTitleColor = data.subTitleColor;
  var rightHandColor = data.rightHandColor;
  var leftHandColor = data.leftHandColor;
  var orientation = data.orientation;
  
  const ctx = canvas.getContext('2d');
  const dpr = 3; // 设备像素比，提高清晰度
  
  // 根据分页模式选择宽度
  const width = isPaged ? A4_WIDTH / dpr : (orientation === 'landscape' ? 600 : 400);
  const contentWidth = isPaged ? CONTENT_WIDTH / dpr : width - 20;
  const leftMargin = isPaged ? CONTENT_PADDING / dpr : 10;
  
  // 计算各个部分的高度
  const titleBlockHeight = 80;
  const measureLineHeight = 70; // 每行小节的高度
  const rowGap = 12; // 行间距，避免上下行的竖线视觉连贯
  const notationLabelHeight = 25; // 模块编号的高度
  const sectionGap = 15; // 模块间距
  
  // 计算每个模块需要的行数（模块优先，其次全局，再回退默认）
  const isLandscape = orientation === 'landscape';
  const resolveMeasuresPerRow = (notation) => {
    if (notation && typeof notation.measuresPerRow === 'number' && notation.measuresPerRow > 0) {
      return notation.measuresPerRow;
    }
    if (typeof data.measuresPerRow === 'number' && data.measuresPerRow > 0) {
      return data.measuresPerRow;
    }
    return isPaged ? Math.floor(contentWidth / 250) : (isLandscape ? 2 : 1);
  };
  
  const notationHeights = notations.map(notation => {
    const measuresPerRow = resolveMeasuresPerRow(notation);
    const measureCount = notation.measures ? notation.measures.length : 4;
    const rowCount = Math.ceil(measureCount / measuresPerRow);
    const totalRowsHeight = (rowCount * measureLineHeight) + Math.max(0, rowCount - 1) * rowGap;
    return notationLabelHeight + totalRowsHeight + sectionGap;
  });
  
  if (!isPaged) {
    // 长图模式：一次绘制所有内容
    const totalHeight = titleBlockHeight + notationHeights.reduce((sum, h) => sum + h, 0);
    
    canvas.width = width * dpr;
    canvas.height = totalHeight * dpr;
    ctx.scale(dpr, dpr);
    
    // 绘制背景
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(0, 0, width, totalHeight);
    
    let currentY = 10;
    
    // 绘制标题区
    currentY = drawTitleBlock(ctx, mainTitle, subTitle, globalTempo, 
                               mainTitleColor, subTitleColor, 0, currentY, width);
    
    // 绘制所有谱面模块
    notations.forEach((notation, idx) => {
      const measuresPerRow = resolveMeasuresPerRow(notation);
      currentY = drawNotationSection(ctx, notation, leftMargin, currentY, contentWidth, 
                                     rightHandColor, leftHandColor, measuresPerRow);
    });
    
    // 预加载图片水印与背景，然后叠加绘制后导出
    preloadWatermarkImages(canvas).then(function(images) {
      var watermarkImg = images.watermarkImg;
      var bgImg = images.bgImg;
      addTopRightWatermarkWithLabel(ctx, watermarkImg, width, totalHeight);
      addCornerBackgroundImage(ctx, bgImg, width, totalHeight, 0.1);
      wx.canvasToTempFilePath({
        canvas,
        success: (res) => resolve(res.tempFilePath),
        fail: (err) => reject(new Error('canvasToTempFilePath failed (long image): ' + readableError(err)))
      });
    }).catch((err) => {
      console.warn('水印/背景图片加载失败，使用文字水印', readableError(err));
      // 回退为文字水印
      addTextWatermark(ctx, width / 2, totalHeight / 2);
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
      generatePagedImages(canvas, ctx, dpr, data, notations, notationHeights, 
        mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor,
        rightHandColor, leftHandColor, resolve, reject, watermarkImg, bgImg);
    }).catch((err) => {
      console.warn('水印/背景图片加载失败，分页模式使用文字水印', readableError(err));
      // 图片加载失败则使用文字水印回退
      generatePagedImages(canvas, ctx, dpr, data, notations, notationHeights, 
        mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor,
        rightHandColor, leftHandColor, resolve, reject, null, null);
    });
  }
}

/**
 * 绘制标题区块
 */
function drawTitleBlock(ctx, mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor, x, y, width) {
  const blockHeight = 70;
  
  // 不绘制白色背景框，直接绘制文字
  ctx.fillStyle = mainTitleColor || '#314D63';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(mainTitle || 'Handpan Note', width / 2, y + 25);
  
  ctx.fillStyle = subTitleColor || '#8FB9AB';
  ctx.font = '16px sans-serif';
  ctx.fillText(subTitle || '', width / 2, y + 50);
  
  ctx.fillStyle = '#314D63';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  // 将速度标识更靠近左侧页面边缘一点（缩小内边距偏移）
  ctx.fillText(`♫ = ${globalTempo}`, x , y + 68);
  
  return y + blockHeight + 10;
}

/**
 * 绘制单个谱面模块（不包含白色卡片框）
 */
function drawNotationSection(ctx, notation, x, y, width, rightHandColor, leftHandColor, measuresPerRow) {
  const measureHeight = 70;
  const rowGap = 12; // 行与行之间增加间距，避免竖线连起来
  const measureCount = notation.measures ? notation.measures.length : 4;
  const rowCount = Math.ceil(measureCount / measuresPerRow);
  
  // 绘制模块编号（例如 A-1）
  ctx.fillStyle = '#314D63';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(notation.label || '', x, y + 15);
  
  let currentY = y + 25;
  const measureWidth = width / measuresPerRow;
  
  // 绘制谱面小节
  notation.measures.forEach((measure, mIdx) => {
    const rowIdx = Math.floor(mIdx / measuresPerRow);
    const colIdx = mIdx % measuresPerRow;
    const measureX = x + (colIdx * measureWidth);
    const measureY = currentY + (rowIdx * (measureHeight + rowGap));
    drawMeasure(ctx, measure, measureX, measureY, measureWidth, rightHandColor, leftHandColor);
  });
  
  const sectionHeight = 25 + (rowCount * measureHeight) + Math.max(0, rowCount - 1) * rowGap + 15;
  return y + sectionHeight;
}

/**
 * 绘制模块的部分行（用于分页拆分）
 * @param {number} rowStart - 从第几行开始绘制（0-based）
 * @param {number} rows - 绘制多少行
 * @param {boolean} showLabel - 是否绘制模块标签
 */
function drawNotationSectionPartial(ctx, notation, x, y, width, rightHandColor, leftHandColor, measuresPerRow, rowStart, rows, showLabel) {
  const measureHeight = 70;
  const rowGap = 12;
  const measureCount = notation.measures ? notation.measures.length : 4;
  const totalRows = Math.ceil(measureCount / measuresPerRow);
  const drawRows = Math.min(rows, Math.max(0, totalRows - rowStart));

  // 标题（可选）
  if (showLabel) {
    ctx.fillStyle = '#314D63';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(notation.label || '', x, y + 15);
    y += 25;
  }

  const measureWidth = width / measuresPerRow;
  const startMeasureIndex = rowStart * measuresPerRow;
  const endMeasureIndex = Math.min(measureCount, startMeasureIndex + drawRows * measuresPerRow);

  for (let mIdx = startMeasureIndex; mIdx < endMeasureIndex; mIdx++) {
    const localIndex = mIdx - startMeasureIndex;
    const rowIdx = Math.floor(localIndex / measuresPerRow);
    const colIdx = localIndex % measuresPerRow;
    const measureX = x + (colIdx * measureWidth);
    const measureY = y + (rowIdx * (measureHeight + rowGap));
    drawMeasure(ctx, notation.measures[mIdx], measureX, measureY, measureWidth, rightHandColor, leftHandColor);
  }

  const sectionHeight = (drawRows * measureHeight) + Math.max(0, drawRows - 1) * rowGap + 15;
  return y + sectionHeight;
}

/**
 * 单个小节
 */
function drawNotationSheet(ctx, notation, x, y, width, rightHandColor, leftHandColor, isLandscape = false) {
  // 此函数已被 drawNotationSection 替代，保留以兼容旧代码
  return drawNotationSection(ctx, notation, x, y, width, rightHandColor, leftHandColor, isLandscape ? 2 : 1);
}

/**
 * 生成分页图片
 */
function generatePagedImages(canvas, ctx, dpr, data, notations, notationHeights, 
                             mainTitle, subTitle, globalTempo, mainTitleColor, subTitleColor,
                             rightHandColor, leftHandColor, resolve, reject,
                             watermarkImg, bgImg) {
  const pageWidth = A4_WIDTH / dpr;
  const pageHeight = A4_HEIGHT / dpr;
  const leftMargin = CONTENT_PADDING / dpr;
  const contentWidth = CONTENT_WIDTH / dpr;
  const topMargin = CONTENT_PADDING / dpr;
  const bottomMargin = CONTENT_PADDING / dpr;
  const contentHeight = pageHeight - topMargin - bottomMargin;
  // 第二页起需预留右上水印高度，避免排版被遮挡
  let watermarkReserveTop = 0;
  if (watermarkImg) {
    const wm = computeTopRightWatermarkMetrics(watermarkImg, pageWidth);
    watermarkReserveTop = Math.max(0, wm.bottomY + 10 - topMargin); // +10 额外留白
  }
  
  const titleBlockHeight = 80;
  const measureLineHeight = 70;
  const rowGap = 12;
  const notationLabelHeight = 25;
  const sectionGap = 15;

  const resolveMeasuresPerRow = (notation) => {
    if (notation && typeof notation.measuresPerRow === 'number' && notation.measuresPerRow > 0) {
      return notation.measuresPerRow;
    }
    if (typeof data.measuresPerRow === 'number' && data.measuresPerRow > 0) {
      return data.measuresPerRow;
    }
    return Math.floor(contentWidth / 250);
  };

  // 分页算法（逐行判断并可拆分模块）
  const pages = [];
  let currentPage = { includeTitle: true, segments: [] };
  let usedHeight = titleBlockHeight; // 第一页预留标题

  const flushPage = () => {
    if (currentPage.segments.length > 0) {
      pages.push(currentPage);
      currentPage = { includeTitle: false, segments: [] };
      // 非首页：从水印下方开始，预占高度
      usedHeight = watermarkReserveTop;
    }
  };

  notations.forEach((notation) => {
    const measuresPerRow = resolveMeasuresPerRow(notation);
    const measureCount = notation.measures ? notation.measures.length : 4;
    const totalRows = Math.ceil(measureCount / measuresPerRow);
    let rowStart = 0;
    let firstSlice = true;

    while (rowStart < totalRows) {
      const available = contentHeight - usedHeight;
      const labelH = firstSlice ? notationLabelHeight : 0;
      // 估算最多可放行数（保留 sectionGap 间距）
      const perRowApprox = measureLineHeight + rowGap;
      let rowsFit = Math.floor((available - labelH - sectionGap + rowGap) / perRowApprox);
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

      const rowsHeight = rowsFit * measureLineHeight + Math.max(0, rowsFit - 1) * rowGap;
      usedHeight += labelH + rowsHeight + sectionGap;

      rowStart += rowsFit;
      firstSlice = false;

      if (rowStart < totalRows && usedHeight + measureLineHeight > contentHeight) {
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
    canvas.width = pageWidth * dpr;
    canvas.height = pageHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    
    // 绘制背景
    ctx.fillStyle = '#ffffffff';
    ctx.fillRect(0, 0, pageWidth, pageHeight);
    
    let currentY = topMargin;
    
    // 第一页绘制标题
    if (page.includeTitle) {
      currentY = drawTitleBlock(ctx, mainTitle, subTitle, globalTempo, 
                               mainTitleColor, subTitleColor, leftMargin, currentY, pageWidth);
    } else {
      currentY += 10;
    }
    
    // 若非首页，在右上角水印下方开始排版，避免遮挡
    if (!page.includeTitle && watermarkImg) {
      var wm = computeTopRightWatermarkMetrics(watermarkImg, pageWidth);
      var belowWatermarkY = wm.bottomY + 10; // 额外留白 10px
      if (currentY < belowWatermarkY) currentY = belowWatermarkY;
    }

    // 绘制该页的谱面片段（可跨页拆分模块）
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
        seg.showLabel
      );
    });
    
    // 添加水印与右下角背景
    if (watermarkImg) {
      addTopRightWatermarkWithLabel(ctx, watermarkImg, pageWidth, pageHeight);
    }
    if (bgImg) {
      addCornerBackgroundImage(ctx, bgImg, pageWidth, pageHeight, 0.1);
    }
    if (!watermarkImg && !bgImg) {
      // 图片都不可用时回退文字
      addTextWatermark(ctx, pageWidth / 2, pageHeight / 2);
    }
    
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
 * 预加载水印与背景图片
 */
function preloadWatermarkImages(canvas) {
  var wmCandidates = [
    '/assets/img/mini_program_code.jpg',
    'assets/img/mini_program_code.jpg',
    '../../assets/img/mini_program_code.jpg',
    '../assets/img/mini_program_code.jpg'
  ];
  var bgCandidates = [
    '/assets/img/bg2.png',
    'assets/img/bg2.png',
    '../../assets/img/bg2.png',
    '../assets/img/bg2.png'
  ];
  return Promise.all([
    resolveImageFromCandidates(canvas, wmCandidates),
    resolveImageFromCandidates(canvas, bgCandidates)
  ]).then(function(results){
    return { watermarkImg: results[0], bgImg: results[1] };
  });
}

// 依次尝试多个路径，优先 getImageInfo -> res.path，再回退 createImage 直接路径
function resolveImageFromCandidates(canvas, candidates) {
  return new Promise(function(resolve, reject){
    var i = 0;
    var errors = [];
    function tryNext() {
      if (i >= candidates.length) { reject(new Error('all candidates failed: ' + errors.join(' | '))); return; }
      var src = candidates[i++];
      wx.getImageInfo({
        src: src,
        success: function(res){
          try {
            var img = (typeof canvas.createImage === 'function') ? canvas.createImage() : wx.createImage();
            img.onload = function(){ resolve(img); };
            img.onerror = function(){ // 尝试直接路径
              errors.push(src + ' -> onload fail');
              try {
                var img2 = (typeof canvas.createImage === 'function') ? canvas.createImage() : wx.createImage();
                img2.onload = function(){ resolve(img2); };
                img2.onerror = function(){ tryNext(); };
                img2.src = src;
              } catch(e){ tryNext(); }
            };
            img.src = res.path;
          } catch (e) {
            errors.push(src + ' -> createImage error');
            tryNext();
          }
        },
        fail: function(){
          errors.push(src + ' -> getImageInfo fail');
          try {
            var img3 = (typeof canvas.createImage === 'function') ? canvas.createImage() : wx.createImage();
            img3.onload = function(){ resolve(img3); };
            img3.onerror = function(){ tryNext(); };
            img3.src = src;
          } catch (e) {
            errors.push(src + ' -> createImage direct fail');
            tryNext();
          }
        }
      });
    }
    tryNext();
  });
}

// 优先使用 wx.getImageInfo 拿到可用的本地路径再创建图片
function loadImageViaInfo(canvas, src) {
  return new Promise(function(resolve, reject){
    wx.getImageInfo({
      src: src,
      success: function(res){
        try {
          const img = (typeof canvas.createImage === 'function') ? canvas.createImage() : wx.createImage();
          img.onload = function(){ resolve(img); };
          img.onerror = function(e){ reject(e); };
          img.src = res.path; // 使用本地可用路径
        } catch (e) {
          reject(e);
        }
      },
      fail: function(err){
        reject(err);
      }
    });
  });
}

function loadImage(canvas, src) {
  return new Promise((resolve, reject) => {
    try {
      const img = (typeof canvas.createImage === 'function') ? canvas.createImage() : wx.createImage();
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = src;
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 图片水印（居中，按页面宽度20%尺寸）
 */
// 计算右上角水印与文字的布局参数
function computeTopRightWatermarkMetrics(image, pageWidth) {
  var margin = 20;
  var imgWidth = pageWidth * 0.12; // 相对页面宽度的12%
  var aspect = image.height / image.width;
  var imgHeight = imgWidth * aspect;
  var x = pageWidth - margin - imgWidth;
  var y = margin;
  var labelGap = 6;
  var labelFontPx = 10;
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
function addTopRightWatermarkWithLabel(ctx, image, pageWidth, pageHeight) {
  var m = computeTopRightWatermarkMetrics(image, pageWidth);
  ctx.save();
  ctx.globalAlpha = 1.0;
  ctx.drawImage(image, m.x, m.y, m.imgWidth, m.imgHeight);
  ctx.fillStyle = '#314D63';
  ctx.font = 'normal ' + m.labelFontPx + 'px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('制谱微信小程序', m.labelX, m.labelY);
  ctx.restore();
}

/**
 * 右下角背景图（宽度为页面的 2/3，保持比例）
 */
function addCornerBackgroundImage(ctx, image, pageWidth, pageHeight, alpha) {
  if (alpha === undefined) alpha = 0.1;
  const bgWidth = pageWidth * 2 / 3;
  const aspect = image.height / image.width;
  const bgHeight = bgWidth * aspect;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.drawImage(image,
    pageWidth - bgWidth,
    pageHeight - bgHeight,
    bgWidth,
    bgHeight);
  ctx.restore();
}

/**
 * 添加文字水印（页面中央，10%透明度）
 */
function addTextWatermark(ctx, centerX, centerY) {
  ctx.save();
  ctx.globalAlpha = 0.1;
  ctx.fillStyle = '#314D63';
  ctx.font = 'bold 48px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Handpan Note', centerX, centerY);
  ctx.restore();
}

/**
 * 绘制单个小节
 * 音符位置轨道：
 * - 右手第一个轨道：23%
 * - 右手第二个轨道：43%
 * - 左手第一个轨道：70%
 * - 左手第二个轨道：90%
 */
function drawMeasure(ctx, measure, x, y, width, rightHandColor, leftHandColor) {
  const beatCount = Array.isArray(measure.beats) ? measure.beats.length : 4;
  const beatWidth = width / (beatCount || 4);
  const lineHeight = 70;
  
  // 定义固定的音符轨道位置（百分比）
  const trackRightHand1 = 0.23;   // 23%
  const trackRightHand2 = 0.43;   // 43%
  const trackLeftHand1 = 0.7;     // 70%
  const trackLeftHand2 = 0.9;     // 90%
  
  // 小节线（左侧）
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + lineHeight);
  ctx.stroke();
  
  // 中央横线
  ctx.strokeStyle = '#E0E0E0';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(x, y + lineHeight / 2);
  ctx.lineTo(x + width, y + lineHeight / 2);
  ctx.stroke();
  
  // 绘制每拍
  measure.beats.forEach((beat, bIdx) => {
    const beatX = x + (bIdx * beatWidth);
    
    // 拍子分隔线（跳过第一拍）
    if (bIdx > 0) {
      ctx.strokeStyle = '#CCCCCC';
      ctx.lineWidth = 1;
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
        ctx.strokeStyle = '#E8E8E8';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(subX, y + lineHeight * 0.25);
        ctx.lineTo(subX, y + lineHeight * 0.75);
        ctx.stroke();
      }
      
      // 绘制音符数字
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.baseline = 'middle';
      
      const noteX = subX + subdivisionWidth / 2;
      
      // 右手（上方）- 使用指定的颜色
      // 使用固定轨道位置，无论是否有两个音符
      if (subdivision.rightHand && subdivision.rightHand[0]) {
        ctx.fillStyle = rightHandColor || '#F4D096';
        ctx.fillText(subdivision.rightHand[0], noteX, y + lineHeight * trackRightHand1);
      }
      if (subdivision.rightHand && subdivision.rightHand[1]) {
        ctx.fillStyle = rightHandColor || '#F4D096';
        ctx.fillText(subdivision.rightHand[1], noteX, y + lineHeight * trackRightHand2);
      }
      
      // 左手（下方）- 使用指定的颜色
      // 使用固定轨道位置，无论是否有两个音符
      if (subdivision.leftHand && subdivision.leftHand[0]) {
        ctx.fillStyle = leftHandColor || '#314D63';
        ctx.fillText(subdivision.leftHand[0], noteX, y + lineHeight * trackLeftHand1);
      }
      if (subdivision.leftHand && subdivision.leftHand[1]) {
        ctx.fillStyle = leftHandColor || '#314D63';
        ctx.fillText(subdivision.leftHand[1], noteX, y + lineHeight * trackLeftHand2);
      }
    });
  });
  
  // 小节线（右侧）
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width, y + lineHeight);
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
  downloadPDF
};

