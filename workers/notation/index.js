/**
 * Notation Worker
 * 用于在后台线程执行 CPU 密集型任务
 * 
 * 支持的任务类型：
 * - migrateNotations: 迁移旧版谱面结构
 * - calculateLayout: 计算布局（预留）
 * - serializeNotations: 序列化谱面数据
 * - parseNotations: 解析谱面数据
 * - hashNotations: 计算谱面哈希值
 */

// Worker 入口
worker.onMessage(function (res) {
  const { taskId, type, data } = res;
  
  try {
    let result;
    
    switch (type) {
      case 'migrateNotations':
        result = migrateNotations(data);
        break;
      case 'serializeNotations':
        result = JSON.stringify(data);
        break;
      case 'parseNotations':
        result = JSON.parse(data);
        break;
      case 'hashNotations':
        result = hashNotations(data);
        break;
      case 'normalizeBarLines':
        result = normalizeBarLines(data);
        break;
      case 'updateMeasureOffsets':
        result = updateMeasureOffsets(data);
        break;
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
    
    worker.postMessage({
      taskId,
      result
    });
  } catch (error) {
    worker.postMessage({
      taskId,
      error: error.message || 'Worker execution error'
    });
  }
});

/**
 * 迁移旧版谱面结构到新版
 * @param {Object[]} notations - 谱面数组
 * @returns {Object[]} 迁移后的谱面数组
 */
function migrateNotations(notations) {
  const ensureArray2 = (val) => {
    if (Array.isArray(val)) {
      if (val.length < 2) return [val[0] || '', ''];
      return [val[0] || '', val[1] || ''];
    }
    if (typeof val === 'string') {
      return [val || '', ''];
    }
    return ['', ''];
  };

  return (notations || []).map(notation => {
    const newNotation = { ...notation };
    newNotation.measures = (notation.measures || []).map(measure => {
      const beats = (measure.beats || []).map(beat => {
        if (!beat.subdivisions) {
          const rh = ensureArray2(beat.rightHand);
          const lh = ensureArray2(beat.leftHand);
          return {
            subdivisions: [{ rightHand: rh, leftHand: lh }]
          };
        }
        const subs = (beat.subdivisions || []).map(sub => ({
          rightHand: ensureArray2(sub.rightHand),
          leftHand: ensureArray2(sub.leftHand)
        }));
        return { subdivisions: subs };
      });
      return { beats };
    });
    
    if (newNotation.collapsed === undefined) {
      newNotation.collapsed = false;
    }
    if (!newNotation.style) {
      newNotation.style = {
        measureHeight: 160,
        noteFontSize: 28,
        lineSpacing: 65
      };
    }
    return newNotation;
  });
}

/**
 * 计算谱面数据的哈希值（用于缓存键）
 * @param {Object} notation - 单个谱面数据
 * @returns {string} 哈希值
 */
function hashNotations(notation) {
  const keyParts = [
    notation.id || notation.label || 'unknown',
    notation.measures?.length || 0,
    notation.style?.measureHeight || 160,
    notation.style?.noteFontSize || 28,
    notation.style?.lineSpacing || 65
  ];
  
  // 简单的字符串哈希
  const str = keyParts.join('_');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * 规范化小节线
 * @param {Object[]} notations - 谱面数组
 * @returns {Object[]} 规范化后的谱面数组
 */
function normalizeBarLines(notations) {
  return (notations || []).map(notation => {
    const newNotation = { ...notation };
    newNotation.measures = (notation.measures || []).map(measure => {
      const beats = (measure.beats || []).map((beat, beatIndex, allBeats) => {
        const newBeat = { ...beat };
        // 最后一拍不能有barLineAfter
        if (beatIndex === allBeats.length - 1) {
          delete newBeat.barLineAfter;
        }
        return newBeat;
      });
      return { ...measure, beats };
    });
    return newNotation;
  });
}

/**
 * 更新小节偏移量
 * @param {Object[]} notations - 谱面数组
 * @returns {Object[]} 更新后的谱面数组
 */
function updateMeasureOffsets(notations) {
  let totalOffset = 0;
  return (notations || []).map(notation => {
    const newNotation = { ...notation };
    newNotation.measureOffset = totalOffset;
    totalOffset += (notation.measures || []).length;
    return newNotation;
  });
}
