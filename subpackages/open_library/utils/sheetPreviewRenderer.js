/**
 * 谱面预览渲染器（专属预览模块）
 * 
 * 基于 pdfExport.js 简化，只保留：
 * - A4竖向、紧凑模式绘制
 * - 纯谱面数据绘制（无标题区、水印、背景logo）
 * - 支持完整的音符渲染（上下标、下划线、八度点等）
 */

// ==================== 紧凑模式配置 ====================
const COMPACT_CONFIG = {
  // 音符相关参数
  defaultMeasureHeightRpx: 130,
  defaultLineSpacingRpx: 55,
  defaultNoteFontSizeRpx: 28,
  rpxToPxRatio: 0.5,
  
  // 颜色配置
  defaultRightHandColor: '#F4D096',
  defaultLeftHandColor: '#314D63',
  defaultSingleColor: '#314D63',
  centerLineColor: '#E0E0E0',
  measureLineColor: '#000000',
  beatLineColor: '#CCCCCC',
  subdivisionLineColor: '#E8E8E8',
  measureIndexColor: '#9AA0A6',
  moduleLabelColor: '#314D63',
  moduleRemarkColor: '#999999',
  annotationColor: '#666666',
  
  // 音符轨道位置（从上到下）
  trackRightHand1: 0.12,
  trackRightHand2: 0.38,
  trackLeftHand1: 0.65,
  trackLeftHand2: 0.91,
  
  // 模块标签
  moduleLabelFontSize: 12,
  moduleRemarkFontSize: 10,
  moduleLabelRemarkGap: 8,
  moduleLabelOffsetY: 20,
  moduleContentOffsetY: 50,
  
  // 线条宽度
  measureLineWidth: 2,
  beatLineWidth: 1,
  subdivisionLineWidth: 0.5,
  centerLineWidth: 0.5,
  
  // 分割线位置比例
  subdivisionLineTopRatio: 0.25,
  subdivisionLineBottomRatio: 0.75,
  
  // 音符缩放比例
  noteScaleFactor: 0.7,
  
  // 音符绘制参数
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
  
  // 小节编号
  measureIndexFontSizeSingle: 11,
  measureIndexFontSizeMulti: 10,
  measureIndexOffsetY: 5,
  
  // 布局参数
  measuresPerRow: 2,  // A4竖向紧凑模式默认每行2小节
  leftMargin: 15,
  contentPadding: 30,
  sectionGap: 15,
  sectionBottomPadding: 15
};

// ==================== 音符解析函数 ====================

/**
 * 解析简谱音符，提取基础音符、八度标记、下划线和上标
 * 支持格式: 1' (高八度), 1,, (低两个八度), 1_ (带下划线), ^{H}1, 1^{H}
 * @param {string} note - 音符字符串
 * @returns {Object} {baseNote, octaveUp, octaveDown, underline, leftSup, rightSup}
 */
function parseSimplifiedNote(note) {
  if (!note || typeof note !== 'string') {
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
    hasOctaveUp: octaveUp > 0,
    hasOctaveDown: octaveDown > 0
  };
}

/**
 * 解析上标内容的音高信息
 */
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

// ==================== 绘制辅助函数 ====================

/**
 * 绘制多个八度点（上加点或下加点）
 */
function drawOctaveDots(ctx, x, y, isUp, dotCount, dotSize, dotGap, color) {
  if (!dotCount || dotCount <= 0) return;
  
  const direction = isUp ? -1 : 1;
  
  ctx.fillStyle = color || '#000000';
  for (let i = 0; i < dotCount; i++) {
    const dotY = y + (i * (dotSize + dotGap) * direction);
    ctx.beginPath();
    ctx.arc(x, dotY, dotSize / 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * 绘制下划线
 */
function drawUnderline(ctx, x, y, width, thickness, color) {
  ctx.strokeStyle = color || '#000000';
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(x - width / 2, y);
  ctx.lineTo(x + width / 2, y);
  ctx.stroke();
}

// ==================== 谱面代码解析函数 ====================

/**
 * 解析谱面代码（LaTeX格式）为notations数据结构
 */
function parseNotationCode(code) {
  const modules = [];
  
  // 移除注释
  code = code.replace(/%[^\n]*/g, '');
  
  // 提取所有module块
  const moduleRegex = /\\begin\{module\}\{([^}]+)\}(?:\{([^}]*)\})?(?:\{([^}]*)\})?([\s\S]*?)\\end\{module\}/g;
  let match;
  
  while ((match = moduleRegex.exec(code)) !== null) {
    const moduleName = match[1].trim();
    const param2 = match[2] ? match[2].trim() : '';
    const moduleContent = match[4].trim();
    
    try {
      const parsedModule = parseModuleContent(moduleName, moduleContent);
      if (param2 && !isStyleParam(param2)) {
        parsedModule.remark = param2;
      }
      modules.push(parsedModule);
    } catch (e) {
      console.warn(`模块 ${moduleName} 解析失败:`, e);
    }
  }
  
  return modules;
}

/**
 * 判断是否为排版样式参数
 */
function isStyleParam(param) {
  return /^[hfs]:\d+/.test(param) || /^(measureHeight|noteFontSize|lineSpacing):/.test(param);
}

/**
 * 解析单个模块内容
 */
function parseModuleContent(moduleName, content) {
  // 按 \\ 分割行
  const lines = content.split('\\\\').map(line => line.trim()).filter(line => line.length > 0);
  
  const allMeasures = [];
  
  for (const line of lines) {
    // 提取小节 [...]
    const measureRegex = /\[([^\]]*)\]/g;
    let measureMatch;
    
    while ((measureMatch = measureRegex.exec(line)) !== null) {
      const measureContent = measureMatch[1];
      const parsedMeasure = parseMeasure(measureContent);
      if (parsedMeasure) {
        allMeasures.push(parsedMeasure);
      }
    }
  }
  
  return {
    label: moduleName,
    measures: allMeasures,
    collapsed: false,
    style: {
      measureHeight: COMPACT_CONFIG.defaultMeasureHeightRpx,
      noteFontSize: COMPACT_CONFIG.defaultNoteFontSizeRpx,
      lineSpacing: COMPACT_CONFIG.defaultLineSpacingRpx
    }
  };
}

/**
 * 解析单个小节
 */
function parseMeasure(content) {
  // 按 | 分割拍
  const beatContents = content.split('|');
  const beats = [];
  
  for (const beatContent of beatContents) {
    const parsedBeat = parseBeat(beatContent.trim());
    if (parsedBeat) {
      beats.push(parsedBeat);
    }
  }
  
  return { beats };
}

/**
 * 解析单拍
 */
function parseBeat(content) {
  if (!content) return { subdivisions: [{ rightHand: ['', ''], leftHand: ['', ''] }] };
  
  // 按 + 分割subdivision
  const subdivisionContents = content.split('+');
  const subdivisions = [];
  
  for (const subContent of subdivisionContents) {
    const parsedSub = parseSubdivision(subContent.trim());
    subdivisions.push(parsedSub);
  }
  
  return { subdivisions };
}

/**
 * 查找分隔符位置（跳过括号内的内容）
 * 支持 (), <>, {} 三种括号
 */
function findSeparatorIndex(content, separator) {
  let parenDepth = 0;
  let angleDepth = 0;
  let braceDepth = 0;
  
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (ch === '(') parenDepth++;
    else if (ch === ')') parenDepth--;
    else if (ch === '<') angleDepth++;
    else if (ch === '>') angleDepth--;
    else if (ch === '{') braceDepth++;
    else if (ch === '}') braceDepth--;
    else if (ch === separator && parenDepth === 0 && angleDepth === 0 && braceDepth === 0) {
      return i;
    }
  }
  return -1;
}

/**
 * 移除音符外层的 <> 或 {} 包裹
 */
function stripBrackets(note) {
  if (!note) return '';
  let result = note.trim();
  // 循环移除外层包裹，支持嵌套情况
  while (
    (result.startsWith('<') && result.endsWith('>')) ||
    (result.startsWith('{') && result.endsWith('}'))
  ) {
    result = result.slice(1, -1).trim();
  }
  return result;
}

/**
 * 解析subdivision
 * 支持格式: (右手)/(左手), <复杂音符>/..., 简写格式等
 */
function parseSubdivision(content) {
  if (!content || content === '-') {
    return { rightHand: ['', ''], leftHand: ['', ''] };
  }
  
  let rightHand = ['', ''];
  let leftHand = ['', ''];
  
  // 找到正确的 / 分隔符位置（需要跳过括号内的内容）
  const slashIndex = findSeparatorIndex(content, '/');
  
  if (slashIndex > 0 && slashIndex < content.length - 1) {
    // 有 / 分隔符，分别解析左右手
    const rightPart = content.substring(0, slashIndex);
    const leftPart = content.substring(slashIndex + 1);
    rightHand = parseHandNotes(rightPart);
    leftHand = parseHandNotes(leftPart);
  } else if (slashIndex === 0) {
    // / 开头，只有左手
    leftHand = parseHandNotes(content.substring(1));
  } else if (slashIndex === content.length - 1) {
    // / 结尾，只有右手
    rightHand = parseHandNotes(content.substring(0, slashIndex));
  } else {
    // 没有 /，全部是右手
    rightHand = parseHandNotes(content);
  }
  
  return { rightHand, leftHand };
}

/**
 * 解析手部音符
 * 支持格式: (音符1,音符2), <复杂音符>, 单个音符等
 */
function parseHandNotes(content) {
  if (!content || content === '-' || content === '' || content === '()') {
    return ['', ''];
  }
  
  // 移除外层括号 () 或尖括号 <> 或花括号 {}
  let inner = content.trim();
  if ((inner.startsWith('(') && inner.endsWith(')')) ||
      (inner.startsWith('<') && inner.endsWith('>')) ||
      (inner.startsWith('{') && inner.endsWith('}'))) {
    inner = inner.slice(1, -1);
  }
  
  if (!inner || inner === '-') {
    return ['', ''];
  }
  
  // 检查是否有逗号分隔的多音符（需要跳过括号内的逗号）
  const commaIndex = findSeparatorIndex(inner, ',');
  if (commaIndex > 0) {
    const note1 = inner.substring(0, commaIndex).trim();
    const note2 = inner.substring(commaIndex + 1).trim();
    // 继续处理每个音符，移除可能的 <> 包裹
    return [stripBrackets(note1), stripBrackets(note2)];
  }
  
  // 单个音符，移除可能的 <> 包裹
  return [stripBrackets(inner), ''];
}

// ==================== 核心绘制函数 ====================

/**
 * 绘制单个小节（完整版，支持所有音符特性）
 */
function drawMeasure(ctx, measure, x, y, width, rightHandColor, leftHandColor, measureHeight, noteFontSizePx, measureIndex, measuresPerRow) {
  const config = COMPACT_CONFIG;
  
  const beatCount = Array.isArray(measure.beats) ? measure.beats.length : 4;
  const beatWidth = width / (beatCount || 4);
  const lineHeight = measureHeight || 70;
  
  // 定义固定的音符轨道位置
  const trackRightHand1 = config.trackRightHand1;
  const trackRightHand2 = config.trackRightHand2;
  const trackLeftHand1 = config.trackLeftHand1;
  const trackLeftHand2 = config.trackLeftHand2;
  
  // 绘制小节编号
  if (typeof measureIndex === 'number') {
    ctx.fillStyle = config.measureIndexColor;
    const isMultiMeasure = measuresPerRow && measuresPerRow > 1;
    const fontSize = isMultiMeasure ? config.measureIndexFontSizeMulti : config.measureIndexFontSizeSingle;
    ctx.font = `${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(String(measureIndex), x, y - config.measureIndexOffsetY);
  }
  
  // 计算最后一个非占位拍的索引
  let lastRealBeatIndex = measure.beats.length - 1;
  for (let i = measure.beats.length - 1; i >= 0; i--) {
    if (!measure.beats[i].isPlaceholder) {
      lastRealBeatIndex = i;
      break;
    }
  }
  const actualWidth = (lastRealBeatIndex + 1) * beatWidth;
  
  // 左侧小节线
  ctx.strokeStyle = config.measureLineColor;
  ctx.lineWidth = config.measureLineWidth;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + lineHeight);
  ctx.stroke();
  
  // 中央横线
  ctx.strokeStyle = config.centerLineColor;
  ctx.lineWidth = config.centerLineWidth;
  ctx.beginPath();
  ctx.moveTo(x, y + lineHeight / 2);
  ctx.lineTo(x + actualWidth, y + lineHeight / 2);
  ctx.stroke();
  
  // 绘制每拍
  measure.beats.forEach((beat, bIdx) => {
    if (beat.isPlaceholder) return;
    
    const beatX = x + (bIdx * beatWidth);
    
    // 拍子分隔线
    const prevBeat = bIdx > 0 ? measure.beats[bIdx - 1] : null;
    if (bIdx > 0 && !prevBeat?.isPlaceholder) {
      ctx.strokeStyle = config.beatLineColor;
      ctx.lineWidth = config.beatLineWidth;
      ctx.beginPath();
      ctx.moveTo(beatX, y);
      ctx.lineTo(beatX, y + lineHeight);
      ctx.stroke();
    }
    
    // 绘制 subdivision
    const subdivisionCount = Array.isArray(beat.subdivisions) ? beat.subdivisions.length : 4;
    const subdivisionWidth = beatWidth / (subdivisionCount || 1);
    
    (beat.subdivisions || []).forEach((subdivision, sIdx) => {
      const subX = beatX + (sIdx * subdivisionWidth);
      
      // 16分音符分隔线
      if (sIdx > 0) {
        ctx.strokeStyle = config.subdivisionLineColor;
        ctx.lineWidth = config.subdivisionLineWidth;
        ctx.beginPath();
        ctx.moveTo(subX, y + lineHeight * config.subdivisionLineTopRatio);
        ctx.lineTo(subX, y + lineHeight * config.subdivisionLineBottomRatio);
        ctx.stroke();
      }
      
      // 音符缩放
      const noteScaleFactor = config.noteScaleFactor || 1.0;
      const baseFontSize = noteFontSizePx || 14;
      const fontSize = Math.round(baseFontSize * noteScaleFactor);
      ctx.font = 'bold ' + fontSize + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const noteX = subX + subdivisionWidth / 2;
      
      // 音高圆点参数
      const dotSizeRatio = config.dotSizeRatio || 0.19;
      const dotSize = Math.max(1, Math.round(fontSize * dotSizeRatio));
      const baseDotGap = config.dotGap !== undefined ? config.dotGap : 0.5;
      const dotGap = Math.max(0.5, baseDotGap * noteScaleFactor);
      
      // 上标参数
      const supFontSizeRatio = config.supFontSizeRatio || 0.55;
      const supFontSize = Math.max(6, Math.round(fontSize * supFontSizeRatio));
      const supDotSizeRatio = config.supDotSizeRatio || 0.13;
      const supDotSize = Math.max(1, Math.round(fontSize * supDotSizeRatio));
      const supDotGap = Math.max(0.5, (config.dotGap || 0.5) * noteScaleFactor);
      
      // 下划线参数
      const underlineThicknessRatio = config.underlineThicknessRatio || 0.08;
      const underlineWidthRatio = config.underlineWidthRatio || 0.8;
      const underlineThickness = Math.max(1, Math.round(fontSize * underlineThicknessRatio));
      const underlineWidth = Math.round(fontSize * underlineWidthRatio);
      
      // 文字位置计算
      const textHalfHeightRatio = config.octaveUpTextHalfHeightRatio || 0.45;
      const textHalfHeight = fontSize * textHalfHeightRatio;
      
      const octaveUpMultiplier = config.octaveUpOffsetMultiplier || 1.1;
      const octaveDownMultiplier = config.octaveDownOffsetMultiplier || 0.85;
      
      const octaveUpOffset = textHalfHeight * octaveUpMultiplier + dotGap + dotSize / 2;
      const octaveDownOffset = textHalfHeight * octaveDownMultiplier + dotGap + dotSize / 2;
      
      // 下划线偏移
      const underlineOffsetRatio = config.underlineOffsetRatio || 0.5;
      const underlineExtraOffset = config.underlineExtraOffset || 2;
      const underlineOffset = textHalfHeight * underlineOffsetRatio + underlineExtraOffset;
      
      // 下划线与低八度圆点间距
      const underlineDotGap = Math.max(1, Math.min(4, 1 + Math.round(fontSize * 0.04)));
      
      // 上标位置偏移
      const supOffsetXRatio = config.supOffsetXRatio || 0.5;
      const supOffsetYRatio = config.supOffsetYRatio || 0.4;
      const supOctaveUpOffsetRatio = config.supOctaveUpOffsetRatio || 0.65;
      const supOctaveDownOffsetRatio = config.supOctaveDownOffsetRatio || 0.45;
      const supOctaveUpOffset = supFontSize * supOctaveUpOffsetRatio;
      const supOctaveDownOffset = supFontSize * supOctaveDownOffsetRatio;
      
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
        const hasUnderline = parsed.underline;
        const hasOctaveDown = parsed.octaveDown > 0;
        
        if (hasUnderline) {
          drawUnderline(ctx, noteX, noteY + underlineOffset, underlineWidth, underlineThickness, color);
        }
        
        if (hasOctaveDown) {
          let octaveDownY;
          if (hasUnderline) {
            octaveDownY = noteY + underlineOffset + underlineThickness / 2 + underlineDotGap + dotSize / 2;
          } else {
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
          if (supParsed.octaveUp > 0) {
            drawOctaveDots(ctx, supX, supY - supOctaveUpOffset, true, supParsed.octaveUp, supDotSize, supDotGap, color);
          }
          if (supParsed.octaveDown > 0) {
            drawOctaveDots(ctx, supX, supY + supOctaveDownOffset, false, supParsed.octaveDown, supDotSize, supDotGap, color);
          }
        }
      };
      
      // 右手（上方）
      if (subdivision.rightHand && subdivision.rightHand[0]) {
        const noteY0 = y + lineHeight * trackRightHand1;
        drawNoteWithFeatures(subdivision.rightHand[0], noteX, noteY0, rightHandColor || config.defaultRightHandColor);
      }
      if (subdivision.rightHand && subdivision.rightHand[1]) {
        const noteY1 = y + lineHeight * trackRightHand2;
        drawNoteWithFeatures(subdivision.rightHand[1], noteX, noteY1, rightHandColor || config.defaultRightHandColor);
      }
      
      // 左手（下方）
      if (subdivision.leftHand && subdivision.leftHand[0]) {
        const noteY0 = y + lineHeight * trackLeftHand1;
        drawNoteWithFeatures(subdivision.leftHand[0], noteX, noteY0, leftHandColor || config.defaultLeftHandColor);
      }
      if (subdivision.leftHand && subdivision.leftHand[1]) {
        const noteY1 = y + lineHeight * trackLeftHand2;
        drawNoteWithFeatures(subdivision.leftHand[1], noteX, noteY1, leftHandColor || config.defaultLeftHandColor);
      }
      
      // 绘制注记
      if (subdivision.annotation) {
        const annotationFontSizeRatio = config.annotationFontSizeRatio || 0.65;
        const annotationFontSize = Math.round(fontSize * annotationFontSizeRatio);
        ctx.font = `${annotationFontSize}px sans-serif`;
        ctx.fillStyle = config.annotationColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        const annotationY = y - (config.annotationOffsetY || 8);
        ctx.fillText(subdivision.annotation, noteX, annotationY);
      }
    });
  });
  
  // 右侧小节线
  ctx.strokeStyle = config.measureLineColor;
  ctx.lineWidth = config.measureLineWidth;
  ctx.beginPath();
  const rightBarX = x + (lastRealBeatIndex + 1) * beatWidth;
  ctx.moveTo(rightBarX, y);
  ctx.lineTo(rightBarX, y + lineHeight);
  ctx.stroke();
}

/**
 * 绘制谱面预览
 * @param {CanvasRenderingContext2D} ctx - Canvas 上下文
 * @param {Array} notations - 解析后的谱面数据
 * @param {number} width - 画布宽度
 * @param {number} height - 画布高度
 * @param {Object} options - 可选配置 {rightHandColor, leftHandColor, measuresPerRow}
 * @returns {number} 实际绘制的高度
 */
function drawSheetPreview(ctx, notations, width, height, options = {}) {
  const config = COMPACT_CONFIG;
  
  const rightHandColor = options.rightHandColor || config.defaultRightHandColor;
  const leftHandColor = options.leftHandColor || config.defaultLeftHandColor;
  const measuresPerRow = options.measuresPerRow || config.measuresPerRow;
  
  const leftMargin = config.leftMargin;
  const contentWidth = width - config.contentPadding;
  
  // 计算尺寸
  const measureWidth = contentWidth / measuresPerRow;
  const measureHeight = Math.round(config.defaultMeasureHeightRpx * config.rpxToPxRatio);
  const lineSpacing = Math.round(config.defaultLineSpacingRpx * config.rpxToPxRatio);
  const noteFontSize = Math.round(config.defaultNoteFontSizeRpx * config.rpxToPxRatio);
  
  let currentY = 15; // 起始Y位置
  let totalMeasuresDrawn = 0;
  let globalMeasureIndex = 0;
  
  for (const notation of notations) {
    // 检查是否超出画布
    if (currentY + 40 > height) break;
    
    // 绘制模块标签
    ctx.fillStyle = config.moduleLabelColor;
    ctx.font = `bold ${config.moduleLabelFontSize}px sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(notation.label || '', leftMargin, currentY + 12);
    
    // 绘制模块备注
    if (notation.remark) {
      ctx.fillStyle = config.moduleRemarkColor;
      ctx.font = `${config.moduleRemarkFontSize}px sans-serif`;
      const labelWidth = ctx.measureText(notation.label || '').width;
      ctx.fillText(notation.remark, leftMargin + labelWidth + config.moduleLabelRemarkGap, currentY + 12);
    }
    
    currentY += 25;
    
    // 绘制小节
    const measures = notation.measures || [];
    let rowsInModule = 0;
    
    for (let mIdx = 0; mIdx < measures.length; mIdx++) {
      const rowIdx = Math.floor(mIdx / measuresPerRow);
      const colIdx = mIdx % measuresPerRow;
      const measureX = leftMargin + colIdx * measureWidth;
      const measureY = currentY + rowIdx * (measureHeight + lineSpacing);
      
      // 检查是否超出画布高度
      if (measureY + measureHeight > height - 10) {
        break;
      }
      
      globalMeasureIndex++;
      drawMeasure(
        ctx, 
        measures[mIdx], 
        measureX, 
        measureY, 
        measureWidth, 
        rightHandColor, 
        leftHandColor, 
        measureHeight, 
        noteFontSize, 
        globalMeasureIndex, 
        measuresPerRow
      );
      
      totalMeasuresDrawn++;
      rowsInModule = rowIdx + 1;
    }
    
    // 更新Y位置
    currentY += rowsInModule * (measureHeight + lineSpacing) + config.sectionGap;
  }
  
  // 返回实际绘制的高度
  return currentY + config.sectionBottomPadding;
}

/**
 * 计算预览所需的画布高度
 * @param {Array} notations - 解析后的谱面数据
 * @param {number} width - 画布宽度
 * @param {Object} options - 可选配置
 * @returns {number} 所需高度
 */
function calculatePreviewHeight(notations, width, options = {}) {
  const config = COMPACT_CONFIG;
  const measuresPerRow = options.measuresPerRow || config.measuresPerRow;
  
  const measureHeight = Math.round(config.defaultMeasureHeightRpx * config.rpxToPxRatio);
  const lineSpacing = Math.round(config.defaultLineSpacingRpx * config.rpxToPxRatio);
  
  let totalHeight = 15; // 起始padding
  
  for (const notation of notations) {
    // 模块标签高度
    totalHeight += 25;
    
    // 计算该模块的行数
    const measures = notation.measures || [];
    const rows = Math.ceil(measures.length / measuresPerRow);
    totalHeight += rows * (measureHeight + lineSpacing);
    
    // 模块间距
    totalHeight += config.sectionGap;
  }
  
  totalHeight += config.sectionBottomPadding;
  
  return totalHeight;
}

/**
 * 绘制占位提示
 */
function drawPlaceholder(ctx, width, height, message) {
  ctx.fillStyle = '#999999';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message || '暂无谱面预览', width / 2, height / 2 - 20);
  
  ctx.fillStyle = '#CCCCCC';
  ctx.font = '12px sans-serif';
  ctx.fillText('点击下方按钮打开完整曲谱', width / 2, height / 2 + 10);
}

// ==================== 导出模块 ====================

module.exports = {
  COMPACT_CONFIG,
  parseNotationCode,
  parseSimplifiedNote,
  parseSupContent,
  drawMeasure,
  drawSheetPreview,
  calculatePreviewHeight,
  drawPlaceholder,
  drawOctaveDots,
  drawUnderline
};
