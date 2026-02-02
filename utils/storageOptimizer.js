/**
 * Storage 优化工具类
 * 实现以下优化方案：
 * 1. 异步化 Storage 操作
 * 2. 布局缓存持久化
 * 3. 增量存储 + 分片保存
 * 4. Web Worker 后台处理
 */

// 缓存配置
const CACHE_CONFIG = {
  // 布局缓存有效期（毫秒）
  LAYOUT_CACHE_TTL: 7 * 24 * 60 * 60 * 1000, // 7天
  // 分片存储前缀
  SHARD_PREFIX: 'notation_shard_',
  // 索引键名
  INDEX_KEY: 'notation_shard_index',
  // 布局缓存键名前缀
  LAYOUT_CACHE_PREFIX: 'layout_cache_',
  // 最大缓存布局数量
  MAX_LAYOUT_CACHES: 20,
  // Worker 消息超时时间
  WORKER_TIMEOUT: 10000
};

/**
 * 异步 Storage 操作封装
 */
class AsyncStorage {
  /**
   * 异步获取存储数据
   * @param {string} key - 存储键名
   * @returns {Promise<any>} 存储的数据
   */
  static get(key) {
    return new Promise((resolve, reject) => {
      wx.getStorage({
        key,
        success: (res) => resolve(res.data),
        fail: (err) => {
          // key 不存在时返回 undefined 而非报错
          if (err.errMsg && err.errMsg.includes('data not found')) {
            resolve(undefined);
          } else {
            resolve(undefined); // 统一返回 undefined，避免因存储问题导致崩溃
          }
        }
      });
    });
  }

  /**
   * 异步设置存储数据
   * @param {string} key - 存储键名
   * @param {any} data - 要存储的数据
   * @returns {Promise<void>}
   */
  static set(key, data) {
    return new Promise((resolve, reject) => {
      wx.setStorage({
        key,
        data,
        success: () => resolve(),
        fail: (err) => {
          console.error(`[AsyncStorage] 存储失败 key=${key}:`, err);
          reject(err);
        }
      });
    });
  }

  /**
   * 异步删除存储数据
   * @param {string} key - 存储键名
   * @returns {Promise<void>}
   */
  static remove(key) {
    return new Promise((resolve, reject) => {
      wx.removeStorage({
        key,
        success: () => resolve(),
        fail: (err) => {
          // 即使删除失败也继续
          resolve();
        }
      });
    });
  }

  /**
   * 批量异步获取存储数据
   * @param {string[]} keys - 存储键名数组
   * @returns {Promise<Object>} 键值对对象
   */
  static async getMultiple(keys) {
    const results = {};
    const promises = keys.map(async (key) => {
      const value = await AsyncStorage.get(key);
      results[key] = value;
    });
    await Promise.all(promises);
    return results;
  }

  /**
   * 批量异步设置存储数据
   * @param {Object} data - 键值对对象
   * @returns {Promise<void>}
   */
  static async setMultiple(data) {
    const promises = Object.entries(data).map(([key, value]) => 
      AsyncStorage.set(key, value)
    );
    await Promise.all(promises);
  }
}

/**
 * 分片存储管理器
 * 将大型数据分割成小块存储，支持增量更新
 */
class ShardedStorage {
  /**
   * 构造函数
   * @param {string} baseKey - 基础存储键名（如 'notations_4_4'）
   */
  constructor(baseKey) {
    this.baseKey = baseKey;
    this.indexKey = `${CACHE_CONFIG.SHARD_PREFIX}${baseKey}_index`;
    this.shardPrefix = `${CACHE_CONFIG.SHARD_PREFIX}${baseKey}_`;
  }

  /**
   * 获取分片索引
   * @returns {Promise<Object>} 索引对象 { moduleIds: [], version: number, metadata: {} }
   */
  async getIndex() {
    const index = await AsyncStorage.get(this.indexKey);
    return index || { moduleIds: [], version: 0, metadata: {} };
  }

  /**
   * 保存分片索引
   * @param {Object} index - 索引对象
   */
  async saveIndex(index) {
    await AsyncStorage.set(this.indexKey, index);
  }

  /**
   * 获取单个模块的分片键名
   * @param {string} moduleId - 模块ID
   * @returns {string} 分片键名
   */
  getShardKey(moduleId) {
    return `${this.shardPrefix}${moduleId}`;
  }

  /**
   * 保存单个模块
   * @param {string} moduleId - 模块ID
   * @param {Object} moduleData - 模块数据
   */
  async saveModule(moduleId, moduleData) {
    const shardKey = this.getShardKey(moduleId);
    await AsyncStorage.set(shardKey, {
      data: moduleData,
      timestamp: Date.now()
    });
    
    // 更新索引
    const index = await this.getIndex();
    if (!index.moduleIds.includes(moduleId)) {
      index.moduleIds.push(moduleId);
    }
    index.version++;
    index.metadata[moduleId] = { timestamp: Date.now() };
    await this.saveIndex(index);
  }

  /**
   * 批量保存模块（增量更新）
   * @param {Object[]} modules - 模块数组
   * @param {Object} options - 选项 { forceFullSave: boolean }
   */
  async saveModules(modules, options = {}) {
    const { forceFullSave = false } = options;
    
    // 获取当前索引
    const index = await this.getIndex();
    const existingModuleIds = new Set(index.moduleIds);
    const newModuleIds = [];
    
    // 确定需要保存的模块
    const modulesToSave = [];
    for (const module of modules) {
      const moduleId = module.id || module.label || `module_${modules.indexOf(module)}`;
      newModuleIds.push(moduleId);
      
      if (forceFullSave || !existingModuleIds.has(moduleId)) {
        modulesToSave.push({ moduleId, data: module });
      } else {
        // 检查是否有变化（简单比较时间戳或hash）
        const existing = await this.getModule(moduleId);
        if (this.hasModuleChanged(existing, module)) {
          modulesToSave.push({ moduleId, data: module });
        }
      }
    }
    
    // 并发保存变更的模块
    if (modulesToSave.length > 0) {
      const savePromises = modulesToSave.map(({ moduleId, data }) => 
        AsyncStorage.set(this.getShardKey(moduleId), {
          data,
          timestamp: Date.now()
        })
      );
      await Promise.all(savePromises);
    }
    
    // 删除不再存在的模块分片
    const deletedModuleIds = Array.from(existingModuleIds).filter(id => !newModuleIds.includes(id));
    if (deletedModuleIds.length > 0) {
      const deletePromises = deletedModuleIds.map(moduleId => 
        AsyncStorage.remove(this.getShardKey(moduleId))
      );
      await Promise.all(deletePromises);
    }
    
    // 更新索引
    const newIndex = {
      moduleIds: newModuleIds,
      version: index.version + 1,
      metadata: {},
      baseKey: this.baseKey,
      timestamp: Date.now()
    };
    
    for (const moduleId of newModuleIds) {
      newIndex.metadata[moduleId] = { 
        timestamp: modulesToSave.find(m => m.moduleId === moduleId) 
          ? Date.now() 
          : (index.metadata[moduleId]?.timestamp || Date.now())
      };
    }
    
    await this.saveIndex(newIndex);
    
    console.log(`[ShardedStorage] 保存完成: ${modulesToSave.length} 个模块更新, ${deletedModuleIds.length} 个模块删除`);
  }

  /**
   * 检查模块是否有变化
   * @param {Object} existing - 现有模块数据
   * @param {Object} newModule - 新模块数据
   * @returns {boolean} 是否有变化
   */
  hasModuleChanged(existing, newModule) {
    if (!existing || !existing.data) return true;
    
    // 简单比较：序列化后比较
    try {
      const existingStr = JSON.stringify(existing.data);
      const newStr = JSON.stringify(newModule);
      return existingStr !== newStr;
    } catch (e) {
      return true; // 出错时认为有变化，强制保存
    }
  }

  /**
   * 获取单个模块
   * @param {string} moduleId - 模块ID
   * @returns {Promise<Object|null>} 模块数据
   */
  async getModule(moduleId) {
    const shardKey = this.getShardKey(moduleId);
    const shard = await AsyncStorage.get(shardKey);
    return shard ? shard : null;
  }

  /**
   * 加载所有模块
   * @returns {Promise<Object[]>} 模块数组
   */
  async loadAllModules() {
    const index = await this.getIndex();
    if (!index.moduleIds || index.moduleIds.length === 0) {
      return [];
    }

    // 并发加载所有分片
    const shardKeys = index.moduleIds.map(id => this.getShardKey(id));
    const shards = await AsyncStorage.getMultiple(shardKeys);
    
    // 按顺序组装模块数组
    const modules = index.moduleIds
      .map(moduleId => {
        const shardKey = this.getShardKey(moduleId);
        const shard = shards[shardKey];
        return shard ? shard.data : null;
      })
      .filter(m => m !== null);
    
    return modules;
  }

  /**
   * 懒加载模块（只加载指定范围）
   * @param {number} startIndex - 起始索引
   * @param {number} count - 加载数量
   * @returns {Promise<Object[]>} 模块数组
   */
  async loadModulesRange(startIndex, count) {
    const index = await this.getIndex();
    if (!index.moduleIds || index.moduleIds.length === 0) {
      return [];
    }

    const endIndex = Math.min(startIndex + count, index.moduleIds.length);
    const moduleIdsToLoad = index.moduleIds.slice(startIndex, endIndex);
    
    const shardKeys = moduleIdsToLoad.map(id => this.getShardKey(id));
    const shards = await AsyncStorage.getMultiple(shardKeys);
    
    const modules = moduleIdsToLoad
      .map(moduleId => {
        const shardKey = this.getShardKey(moduleId);
        const shard = shards[shardKey];
        return shard ? shard.data : null;
      })
      .filter(m => m !== null);
    
    return modules;
  }

  /**
   * 清除所有分片数据
   */
  async clearAll() {
    const index = await this.getIndex();
    
    // 删除所有分片
    const deletePromises = (index.moduleIds || []).map(moduleId => 
      AsyncStorage.remove(this.getShardKey(moduleId))
    );
    await Promise.all(deletePromises);
    
    // 删除索引
    await AsyncStorage.remove(this.indexKey);
  }

  /**
   * 检查是否存在分片数据
   * @returns {Promise<boolean>}
   */
  async hasShardedData() {
    const index = await this.getIndex();
    return index.moduleIds && index.moduleIds.length > 0;
  }

  /**
   * 从传统存储迁移到分片存储
   * @param {string} legacyKey - 传统存储键名
   * @returns {Promise<Object[]>} 迁移后的模块数组
   */
  async migrateFromLegacy(legacyKey) {
    const legacyData = await AsyncStorage.get(legacyKey);
    if (!legacyData || !Array.isArray(legacyData) || legacyData.length === 0) {
      return [];
    }

    // 保存到分片存储
    await this.saveModules(legacyData, { forceFullSave: true });
    
    // 可选：删除旧数据（暂时保留作为备份）
    // await AsyncStorage.remove(legacyKey);
    
    console.log(`[ShardedStorage] 从 ${legacyKey} 迁移了 ${legacyData.length} 个模块`);
    return legacyData;
  }
}

/**
 * 布局缓存管理器
 * 持久化 Canvas 渲染器的布局计算结果
 */
class LayoutCacheManager {
  /**
   * 生成布局缓存键名
   * @param {Object} notation - 谱面数据
   * @param {string} orientation - 屏幕方向
   * @param {number} measuresPerRow - 每行小节数
   * @returns {string} 缓存键名
   */
  static generateCacheKey(notation, orientation, measuresPerRow) {
    // 使用简化的哈希：基于关键参数
    const keyParts = [
      notation.id || notation.label || 'unknown',
      orientation,
      measuresPerRow,
      notation.measures?.length || 0,
      notation.style?.measureHeight || 160,
      notation.style?.noteFontSize || 28,
      notation.style?.lineSpacing || 65
    ];
    return `${CACHE_CONFIG.LAYOUT_CACHE_PREFIX}${keyParts.join('_')}`;
  }

  /**
   * 获取缓存的布局
   * @param {string} cacheKey - 缓存键名
   * @returns {Promise<Object|null>} 缓存的布局数据
   */
  static async getCache(cacheKey) {
    try {
      const cached = await AsyncStorage.get(cacheKey);
      if (!cached) return null;
      
      // 检查是否过期
      if (Date.now() - cached.timestamp > CACHE_CONFIG.LAYOUT_CACHE_TTL) {
        await AsyncStorage.remove(cacheKey);
        return null;
      }
      
      return cached.layout;
    } catch (e) {
      console.warn('[LayoutCacheManager] 获取缓存失败:', e);
      return null;
    }
  }

  /**
   * 保存布局缓存
   * @param {string} cacheKey - 缓存键名
   * @param {Object} layout - 布局数据
   */
  static async saveCache(cacheKey, layout) {
    try {
      await AsyncStorage.set(cacheKey, {
        layout,
        timestamp: Date.now()
      });
      
      // 清理过期缓存
      await LayoutCacheManager.cleanupOldCaches();
    } catch (e) {
      console.warn('[LayoutCacheManager] 保存缓存失败:', e);
    }
  }

  /**
   * 清理过期的布局缓存
   */
  static async cleanupOldCaches() {
    try {
      const info = wx.getStorageInfoSync();
      const keys = info.keys || [];
      
      // 找出所有布局缓存键
      const layoutKeys = keys.filter(key => key.startsWith(CACHE_CONFIG.LAYOUT_CACHE_PREFIX));
      
      if (layoutKeys.length <= CACHE_CONFIG.MAX_LAYOUT_CACHES) {
        return; // 数量在限制内，不需要清理
      }
      
      // 获取所有缓存的时间戳
      const cacheInfos = [];
      for (const key of layoutKeys) {
        try {
          const cached = wx.getStorageSync(key);
          if (cached && cached.timestamp) {
            cacheInfos.push({ key, timestamp: cached.timestamp });
          }
        } catch (e) {
          // 忽略读取失败的缓存
        }
      }
      
      // 按时间排序，删除最旧的
      cacheInfos.sort((a, b) => a.timestamp - b.timestamp);
      const toDelete = cacheInfos.slice(0, layoutKeys.length - CACHE_CONFIG.MAX_LAYOUT_CACHES);
      
      for (const { key } of toDelete) {
        await AsyncStorage.remove(key);
      }
      
      console.log(`[LayoutCacheManager] 清理了 ${toDelete.length} 个过期缓存`);
    } catch (e) {
      console.warn('[LayoutCacheManager] 清理缓存失败:', e);
    }
  }

  /**
   * 清除所有布局缓存
   */
  static async clearAllCaches() {
    try {
      const info = wx.getStorageInfoSync();
      const keys = info.keys || [];
      const layoutKeys = keys.filter(key => key.startsWith(CACHE_CONFIG.LAYOUT_CACHE_PREFIX));
      
      const deletePromises = layoutKeys.map(key => AsyncStorage.remove(key));
      await Promise.all(deletePromises);
      
      console.log(`[LayoutCacheManager] 清除了 ${layoutKeys.length} 个布局缓存`);
    } catch (e) {
      console.warn('[LayoutCacheManager] 清除缓存失败:', e);
    }
  }
}

/**
 * Worker 管理器
 * 用于在后台线程执行 CPU 密集型任务
 */
class WorkerManager {
  constructor() {
    this.worker = null;
    this.taskQueue = [];
    this.taskId = 0;
    this.pendingTasks = new Map();
    this.isInitialized = false;
  }

  /**
   * 初始化 Worker
   * @returns {Promise<boolean>} 是否成功初始化
   */
  async init() {
    if (this.isInitialized) return true;
    
    try {
      // 微信小程序 Worker 创建
      this.worker = wx.createWorker('workers/notation/index.js', {
        useExperimentalWorker: true
      });
      
      if (!this.worker) {
        console.warn('[WorkerManager] Worker 创建失败，将使用主线程处理');
        return false;
      }
      
      // 监听 Worker 消息
      this.worker.onMessage((res) => {
        const { taskId, result, error } = res;
        const pending = this.pendingTasks.get(taskId);
        
        if (pending) {
          if (error) {
            pending.reject(new Error(error));
          } else {
            pending.resolve(result);
          }
          this.pendingTasks.delete(taskId);
        }
      });
      
      this.isInitialized = true;
      console.log('[WorkerManager] Worker 初始化成功');
      return true;
    } catch (e) {
      console.warn('[WorkerManager] Worker 初始化失败:', e);
      return false;
    }
  }

  /**
   * 执行后台任务
   * @param {string} type - 任务类型
   * @param {any} data - 任务数据
   * @returns {Promise<any>} 任务结果
   */
  async execute(type, data) {
    // 如果 Worker 不可用，在主线程执行
    if (!this.isInitialized || !this.worker) {
      return this.executeInMainThread(type, data);
    }
    
    const taskId = ++this.taskId;
    
    return new Promise((resolve, reject) => {
      // 设置超时
      const timeout = setTimeout(() => {
        this.pendingTasks.delete(taskId);
        console.warn(`[WorkerManager] 任务 ${taskId} 超时，回退到主线程`);
        this.executeInMainThread(type, data).then(resolve).catch(reject);
      }, CACHE_CONFIG.WORKER_TIMEOUT);
      
      this.pendingTasks.set(taskId, { 
        resolve: (result) => {
          clearTimeout(timeout);
          resolve(result);
        }, 
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        }
      });
      
      // 发送消息给 Worker
      this.worker.postMessage({
        taskId,
        type,
        data
      });
    });
  }

  /**
   * 在主线程执行任务（Worker 不可用时的降级方案）
   * @param {string} type - 任务类型
   * @param {any} data - 任务数据
   * @returns {Promise<any>} 任务结果
   */
  async executeInMainThread(type, data) {
    switch (type) {
      case 'migrateNotations':
        return this.migrateNotationsSync(data);
      case 'calculateLayout':
        return this.calculateLayoutSync(data);
      case 'serializeNotations':
        return JSON.stringify(data);
      case 'parseNotations':
        return JSON.parse(data);
      default:
        throw new Error(`Unknown task type: ${type}`);
    }
  }

  /**
   * 同步迁移谱面数据（主线程降级方案）
   */
  migrateNotationsSync(notations) {
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
          const subs = (beat.subdivisions || []).map(sub => {
            const normalized = {
              rightHand: ensureArray2(sub.rightHand),
              leftHand: ensureArray2(sub.leftHand)
            };
            if (sub.hasArpeggio === true) normalized.hasArpeggio = true;
            return normalized;
          });
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
   * 同步计算布局（主线程降级方案）
   */
  calculateLayoutSync(params) {
    // 这里只是一个占位，实际的布局计算在 canvasRenderer.js 中
    return params;
  }

  /**
   * 销毁 Worker
   */
  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isInitialized = false;
      this.pendingTasks.clear();
    }
  }
}

// 创建单例
const workerManager = new WorkerManager();

/**
 * 优化后的谱面存储管理器
 * 整合所有优化功能
 */
class OptimizedNotationStorage {
  constructor() {
    this.shardedStorages = new Map(); // 缓存 ShardedStorage 实例
    this.useSharding = true; // 是否使用分片存储
    this.pendingSaves = new Map(); // 待保存的数据（用于合并写入）
    this.saveDebounceTimers = new Map(); // 保存防抖定时器
  }

  /**
   * 获取或创建分片存储实例
   * @param {string} baseKey - 基础存储键名
   * @returns {ShardedStorage}
   */
  getShardedStorage(baseKey) {
    if (!this.shardedStorages.has(baseKey)) {
      this.shardedStorages.set(baseKey, new ShardedStorage(baseKey));
    }
    return this.shardedStorages.get(baseKey);
  }

  /**
   * 异步加载谱面数据
   * @param {string} storageKey - 存储键名
   * @param {Object} options - 选项
   * @returns {Promise<Object[]>} 谱面数据数组
   */
  async loadNotations(storageKey, options = {}) {
    const { useLegacyFallback = true } = options;
    
    // 尝试从分片存储加载
    if (this.useSharding) {
      const sharded = this.getShardedStorage(storageKey);
      const hasSharded = await sharded.hasShardedData();
      
      if (hasSharded) {
        console.log(`[OptimizedNotationStorage] 从分片存储加载: ${storageKey}`);
        return await sharded.loadAllModules();
      }
    }
    
    // 从传统存储加载
    if (useLegacyFallback) {
      const legacyData = await AsyncStorage.get(storageKey);
      if (legacyData && Array.isArray(legacyData) && legacyData.length > 0) {
        console.log(`[OptimizedNotationStorage] 从传统存储加载: ${storageKey}`);
        
        // 自动迁移到分片存储
        if (this.useSharding) {
          const sharded = this.getShardedStorage(storageKey);
          await sharded.saveModules(legacyData, { forceFullSave: true });
        }
        
        return legacyData;
      }
    }
    
    return [];
  }

  /**
   * 异步保存谱面数据（带防抖）
   * @param {string} storageKey - 存储键名
   * @param {Object[]} notations - 谱面数据数组
   * @param {Object} options - 选项
   */
  async saveNotations(storageKey, notations, options = {}) {
    const { 
      debounce = 500, 
      immediate = false,
      useSharding = this.useSharding 
    } = options;
    
    // 立即保存模式
    if (immediate) {
      await this._doSave(storageKey, notations, useSharding);
      return;
    }
    
    // 防抖保存模式
    this.pendingSaves.set(storageKey, notations);
    
    // 清除之前的定时器
    if (this.saveDebounceTimers.has(storageKey)) {
      clearTimeout(this.saveDebounceTimers.get(storageKey));
    }
    
    // 设置新的防抖定时器
    const timer = setTimeout(async () => {
      const data = this.pendingSaves.get(storageKey);
      if (data) {
        await this._doSave(storageKey, data, useSharding);
        this.pendingSaves.delete(storageKey);
      }
      this.saveDebounceTimers.delete(storageKey);
    }, debounce);
    
    this.saveDebounceTimers.set(storageKey, timer);
  }

  /**
   * 执行实际保存
   * @private
   */
  async _doSave(storageKey, notations, useSharding) {
    try {
      if (useSharding) {
        // 使用分片存储
        const sharded = this.getShardedStorage(storageKey);
        await sharded.saveModules(notations);
        
        // 同时保存到传统存储（兼容性）
        await AsyncStorage.set(storageKey, notations);
      } else {
        // 仅使用传统存储
        await AsyncStorage.set(storageKey, notations);
      }
      
      console.log(`[OptimizedNotationStorage] 保存完成: ${storageKey}, ${notations.length} 个模块`);
    } catch (e) {
      console.error(`[OptimizedNotationStorage] 保存失败:`, e);
      throw e;
    }
  }

  /**
   * 保存单个模块（增量更新）
   * @param {string} storageKey - 存储键名
   * @param {string} moduleId - 模块ID
   * @param {Object} moduleData - 模块数据
   */
  async saveModule(storageKey, moduleId, moduleData) {
    if (this.useSharding) {
      const sharded = this.getShardedStorage(storageKey);
      await sharded.saveModule(moduleId, moduleData);
    }
  }

  /**
   * 强制刷新所有待保存数据
   */
  async flushAll() {
    const promises = [];
    
    for (const [storageKey, notations] of this.pendingSaves) {
      promises.push(this._doSave(storageKey, notations, this.useSharding));
    }
    
    // 清除所有定时器
    for (const timer of this.saveDebounceTimers.values()) {
      clearTimeout(timer);
    }
    
    this.pendingSaves.clear();
    this.saveDebounceTimers.clear();
    
    await Promise.all(promises);
  }

  /**
   * 清除指定键的所有数据（包括分片）
   * @param {string} storageKey - 存储键名
   */
  async clearNotations(storageKey) {
    // 清除分片数据
    if (this.useSharding && this.shardedStorages.has(storageKey)) {
      const sharded = this.shardedStorages.get(storageKey);
      await sharded.clearAll();
    }
    
    // 清除传统存储
    await AsyncStorage.remove(storageKey);
  }
}

/**
 * 播放模式 Canvas 缓存管理器
 * 缓存播放模式下每个 module 的 Canvas 渲染结果和源代码哈希
 * 支持增量更新：只重绘内容变化的 module
 */
class PlaybackCanvasCacheManager {
  // 内存缓存（当前文件的渲染结果）
  static currentFileId = null;
  static moduleCache = new Map(); // moduleId -> { hash, imagePath, timestamp }
  
  // 缓存配置
  static MAX_CACHED_MODULES = 50;
  static CACHE_PREFIX = 'playback_canvas_';
  
  /**
   * 生成 module 内容的哈希值
   * 基于 measures 数据、样式配置等生成唯一标识
   * @param {Object} notation - module 数据
   * @param {string} orientation - 屏幕方向
   * @param {number} measuresPerRow - 每行小节数
   * @returns {string} 哈希值
   */
  static generateModuleHash(notation, orientation, measuresPerRow) {
    if (!notation) return '';
    
    try {
      // 提取影响渲染结果的关键数据
      const hashSource = {
        id: notation.id,
        label: notation.label,
        measures: notation.measures ? JSON.stringify(notation.measures) : '',
        style: notation.style || {},
        orientation,
        measuresPerRow: notation.measuresPerRow || measuresPerRow
      };
      
      // 简单哈希算法（适用于小程序环境）
      const str = JSON.stringify(hashSource);
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash.toString(16);
    } catch (e) {
      console.warn('[PlaybackCanvasCacheManager] 生成哈希失败:', e);
      return Date.now().toString(16); // 失败时返回时间戳作为唯一标识
    }
  }
  
  /**
   * 设置当前文件ID，切换文件时清除旧缓存
   * @param {string} fileId - 文件标识
   */
  static setCurrentFile(fileId) {
    if (this.currentFileId !== fileId) {
      console.log(`[PlaybackCanvasCacheManager] 切换文件: ${this.currentFileId} -> ${fileId}`);
      this.clearMemoryCache();
      this.currentFileId = fileId;
    }
  }
  
  /**
   * 检查 module 是否有可用的缓存
   * @param {string} moduleId - module ID
   * @param {string} currentHash - 当前内容哈希
   * @returns {Object|null} 缓存信息 { imagePath } 或 null
   */
  static getCachedModule(moduleId, currentHash) {
    const cached = this.moduleCache.get(moduleId);
    if (cached && cached.hash === currentHash && cached.imagePath) {
      console.log(`[PlaybackCanvasCacheManager] 命中缓存: ${moduleId}`);
      return { imagePath: cached.imagePath };
    }
    return null;
  }
  
  /**
   * 缓存 module 的渲染结果
   * @param {string} moduleId - module ID
   * @param {string} hash - 内容哈希
   * @param {string} imagePath - 渲染后的图片路径
   */
  static cacheModule(moduleId, hash, imagePath) {
    // 检查缓存数量限制
    if (this.moduleCache.size >= this.MAX_CACHED_MODULES) {
      // 删除最旧的缓存
      const oldestKey = this.moduleCache.keys().next().value;
      if (oldestKey) {
        this.moduleCache.delete(oldestKey);
      }
    }
    
    this.moduleCache.set(moduleId, {
      hash,
      imagePath,
      timestamp: Date.now()
    });
    
    console.log(`[PlaybackCanvasCacheManager] 缓存 module: ${moduleId}, hash: ${hash.substring(0, 8)}...`);
  }
  
  /**
   * 批量检查哪些 module 需要重新渲染
   * @param {Array} notations - module 数组
   * @param {string} orientation - 屏幕方向
   * @param {number} measuresPerRow - 每行小节数
   * @returns {Object} { toRender: [], fromCache: [] } 需要渲染的和可以复用缓存的 module
   */
  static analyzeModules(notations, orientation, measuresPerRow) {
    const toRender = [];
    const fromCache = [];
    
    notations.forEach((notation, index) => {
      const hash = this.generateModuleHash(notation, orientation, measuresPerRow);
      const cached = this.getCachedModule(notation.id, hash);
      
      if (cached) {
        fromCache.push({
          index,
          moduleId: notation.id,
          imagePath: cached.imagePath,
          hash
        });
      } else {
        toRender.push({
          index,
          moduleId: notation.id,
          hash
        });
      }
    });
    
    console.log(`[PlaybackCanvasCacheManager] 分析结果: ${fromCache.length} 个可复用缓存, ${toRender.length} 个需要渲染`);
    
    return { toRender, fromCache };
  }
  
  /**
   * 清除内存缓存
   */
  static clearMemoryCache() {
    console.log(`[PlaybackCanvasCacheManager] 清除内存缓存: ${this.moduleCache.size} 个 module`);
    this.moduleCache.clear();
  }
  
  /**
   * 清除指定 module 的缓存
   * @param {string} moduleId - module ID
   */
  static invalidateModule(moduleId) {
    if (this.moduleCache.has(moduleId)) {
      this.moduleCache.delete(moduleId);
      console.log(`[PlaybackCanvasCacheManager] 失效缓存: ${moduleId}`);
    }
  }
  
  /**
   * 获取缓存统计信息
   * @returns {Object} 统计信息
   */
  static getStats() {
    return {
      currentFileId: this.currentFileId,
      cachedModules: this.moduleCache.size,
      maxModules: this.MAX_CACHED_MODULES
    };
  }
}

// 创建单例
const optimizedStorage = new OptimizedNotationStorage();

module.exports = {
  CACHE_CONFIG,
  AsyncStorage,
  ShardedStorage,
  LayoutCacheManager,
  PlaybackCanvasCacheManager,
  WorkerManager,
  workerManager,
  OptimizedNotationStorage,
  optimizedStorage
};
