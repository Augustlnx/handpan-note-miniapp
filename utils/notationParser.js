/**
 * 谱面代码解析器
 * 将LaTeX格式的谱面代码解析为notations数据结构
 * 
 * 从 subpackages/open_library/utils/sheetPreviewRenderer.js 提取
 * 用于在主包中解析谱面代码
 */

// 默认配置
const DEFAULT_CONFIG = {
  defaultMeasureHeightRpx: 120,
  defaultNoteFontSizeRpx: 28,
  defaultLineSpacingRpx: 20
};

/**
 * 解析谱面代码（LaTeX格式）为notations数据结构
 * @param {string} code - LaTeX格式的谱面代码
 * @returns {Array} notations数组
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
      measureHeight: DEFAULT_CONFIG.defaultMeasureHeightRpx,
      noteFontSize: DEFAULT_CONFIG.defaultNoteFontSizeRpx,
      lineSpacing: DEFAULT_CONFIG.defaultLineSpacingRpx
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
 * 移除音符外层的 <> 或 {} 包裹（只移除最外层）
 */
function unwrapBracket(token) {
  if (!token) return '';
  let result = token.trim();
  if (result.startsWith('<') && result.endsWith('>')) {
    return result.slice(1, -1);
  }
  if (result.startsWith('{') && result.endsWith('}')) {
    return result.slice(1, -1);
  }
  return result;
}

/**
 * 智能分割音符字符串，正确处理 <> 和 {} 包裹（支持嵌套）
 * 例如：<1,^{5,}>,<1'^{H}> -> ['<1,^{5,}>', '<1'^{H}>']
 */
function smartSplitNotes(str) {
  if (!str) return [];
  const notes = [];
  let current = '';
  let angleDepth = 0;  // <> 深度
  let braceDepth = 0;  // {} 深度
  
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    
    // 只有当所有括号都关闭时，逗号才是分隔符
    if (angleDepth === 0 && braceDepth === 0 && char === ',') {
      // 顶层逗号，分割
      if (current.trim()) {
        notes.push(current.trim());
      }
      current = '';
      continue;
    }
    
    // 跟踪括号深度
    if (char === '<') {
      angleDepth++;
    } else if (char === '>') {
      angleDepth = Math.max(0, angleDepth - 1);
    } else if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      braceDepth = Math.max(0, braceDepth - 1);
    }
    
    current += char;
  }
  
  // 添加最后一个token
  if (current.trim()) {
    notes.push(current.trim());
  }
  
  return notes;
}

/**
 * 解析subdivision
 * 支持格式: (右手)/(左手), <复杂音符>/..., 简写格式等
 * 支持琶音标记: ~(右手)/(左手)
 */
function parseSubdivision(content) {
  if (!content || content === '-') {
    return { rightHand: ['', ''], leftHand: ['', ''] };
  }
  
  // 检测并处理琶音标记 '~' - 在音符列前面
  let hasArpeggio = false;
  if (content.startsWith('~')) {
    hasArpeggio = true;
    content = content.slice(1); // 移除'~'前缀
  }
  
  let rightHand = ['', ''];
  let leftHand = ['', ''];
  
  // 找到正确的 / 分隔符位置（需要跳过括号内的内容）
  const slashIndex = findSeparatorIndex(content, '/');
  
  if (slashIndex > 0 && slashIndex < content.length - 1) {
    // 有 / 分隔符，分别解析左右手
    const rightPart = content.substring(0, slashIndex);
    const leftPart = content.substring(slashIndex + 1);
    rightHand = parseHandNotes(unwrapBracket(rightPart), 'right');
    leftHand = parseHandNotes(unwrapBracket(leftPart), 'left');
  } else if (slashIndex === 0) {
    // / 开头，只有左手
    leftHand = parseHandNotes(unwrapBracket(content.substring(1)), 'left');
  } else if (slashIndex === content.length - 1) {
    // / 结尾，只有右手
    rightHand = parseHandNotes(unwrapBracket(content.substring(0, slashIndex)), 'right');
  } else {
    // 没有 /，全部是右手
    rightHand = parseHandNotes(unwrapBracket(content), 'right');
  }
  
  const result = { rightHand, leftHand };
  if (hasArpeggio) result.hasArpeggio = true;
  return result;
}

/**
 * 解析手部音符（返回数组 [slot0, slot1]）
 * 
 * 【重要】单音符贴中轴规则：
 * - 右手单音符：放在 index=1（内侧，靠近中轴）
 * - 左手单音符：放在 index=0（内侧，靠近中轴）
 * 
 * @param {string} content - 手部音符内容
 * @param {string} hand - 'right' 或 'left'
 * @returns {Array} [slot0, slot1]
 */
function parseHandNotes(content, hand) {
  if (!content || content === '-' || content === '' || content === '()') {
    return ['', ''];
  }
  
  // 移除外层括号 ()
  let inner = content.trim();
  if (inner.startsWith('(') && inner.endsWith(')')) {
    inner = inner.slice(1, -1);
  }
  
  if (!inner || inner === '-') {
    return ['', ''];
  }
  
  // 使用智能分割处理逗号（跳过 <> 和 {} 内的逗号）
  const notes = smartSplitNotes(inner);
  
  if (notes.length === 1) {
    // 【重要】单个音符：默认放在靠近中轴线的位置
    // 右手：放在 slot1（index 1）
    // 左手：放在 slot0（index 0，因为左手的 slot0 更靠近中轴线）
    const parsedNote = unwrapBracket(notes[0]);
    if (hand === 'right') {
      return ['', parsedNote];
    } else {
      return [parsedNote, ''];
    }
  } else if (notes.length >= 2) {
    // 两个音符：外侧和内侧
    const note0 = unwrapBracket(notes[0]);
    const note1 = unwrapBracket(notes[1]);
    return [note0, note1];
  }
  
  return ['', ''];
}

module.exports = {
  parseNotationCode,
  parseModuleContent,
  parseMeasure,
  parseBeat,
  parseSubdivision,
  parseHandNotes
};
