/**
 * Web Audio 音频管理器
 * 解决节拍器同时播放多个音频时的"卡顿"和"削波失真"问题
 * 
 * 核心方案：使用 wx.createWebAudioContext (Web Audio API)
 * 
 * 技术优势：
 * 1. 预加载 + 预解码：音频数据提前解码为 AudioBuffer，播放时零延迟
 * 2. 低延迟播放：使用 AudioBufferSourceNode 直接播放内存中的音频数据
 * 3. 精确混音控制：通过 GainNode 控制音量，防止多声音叠加时振幅溢出
 * 4. 无限复音：每次播放创建新的 SourceNode，支持同一音频快速连续触发
 * 
 * 使用方式：
 * 1. await webAudioManager.init()
 * 2. await webAudioManager.loadSounds({ click1: '/path/to/audio.wav', ... })
 * 3. webAudioManager.play('click1')
 */

class WebAudioManager {
  constructor() {
    // Web Audio 上下文
    this.audioContext = null;
    
    // 主增益节点（控制总音量）
    this.masterGain = null;
    
    // 已解码的音频缓冲区 Map: { soundId: AudioBuffer }
    this.audioBuffers = new Map();
    
    // 各音频的独立增益节点 Map: { soundId: GainNode }
    this.gainNodes = new Map();
    
    // 默认音频文件路径配置
    this.defaultSoundUrls = {
      click1: '/subpackages/resources/audio/click1_主音.wav',
      click2: '/subpackages/resources/audio/click2_辅助音.wav',
      click3: '/subpackages/resources/audio/click3_背景节拍.wav'
    };
    
    // 音量配置 - 降低单个声音音量防止叠加削波
    this.volumeConfig = {
      click1: 0.6,      // 主音
      click2: 0.6,      // 辅助音  
      click3: 0.6,      // 背景节拍
      master: 0.75      // 总音量系数 (0.6~0.8 防止削波)
    };
    
    this.isInitialized = false;
    this.isPreloaded = false;
    
    // 重试配置
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 5000; // 失败后5秒重试
  }

  /**
   * 初始化 Web Audio 上下文
   * @returns {Promise<boolean>} 是否初始化成功
   */
  async init() {
    if (this.isInitialized) {
      return true;
    }

    try {
      // 创建 Web Audio 上下文
      this.audioContext = wx.createWebAudioContext();
      
      // 创建主增益节点并连接到输出
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.volumeConfig.master;
      this.masterGain.connect(this.audioContext.destination);
      
      this.isInitialized = true;
      console.log('[WebAudioManager] Web Audio 上下文初始化成功');
      return true;
    } catch (e) {
      console.error('[WebAudioManager] 初始化失败: ' + (e.message || e));
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * 加载并解码音频文件
   * @param {Object} urlMap - 音频URL映射 { soundId: url, ... }
   * @returns {Promise<boolean>} 是否全部加载成功
   */
  async loadSounds(urlMap = null) {
    if (!this.isInitialized) {
      const initSuccess = await this.init();
      if (!initSuccess) {
        return false;
      }
    }

    const soundUrls = urlMap || this.defaultSoundUrls;
    const loadPromises = [];
    
    // 使用 Object.keys 替代 Object.entries，兼容小程序环境
    const soundIds = Object.keys(soundUrls);
    for (let i = 0; i < soundIds.length; i++) {
      const soundId = soundIds[i];
      const url = soundUrls[soundId];
      loadPromises.push(this._loadAndDecodeAudio(soundId, url));
    }

    try {
      const results = await Promise.all(loadPromises);
      const allSuccess = results.every(r => r === true);
      this.isPreloaded = allSuccess;
      console.log(`[WebAudioManager] 音频加载完成，成功: ${allSuccess}`);
      return allSuccess;
    } catch (e) {
      console.error('[WebAudioManager] 音频加载异常: ' + (e.message || e));
      this.isPreloaded = false;
      return false;
    }
  }

  /**
   * 加载并解码单个音频文件
   * @private
   * @param {string} soundId - 音频标识
   * @param {string} url - 音频文件路径
   * @returns {Promise<boolean>}
   */
  async _loadAndDecodeAudio(soundId, url) {
    return new Promise((resolve) => {
      // 使用 wx.request 获取音频的 ArrayBuffer
      wx.request({
        url: url,
        responseType: 'arraybuffer',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            // 解码音频数据
            this.audioContext.decodeAudioData(
              res.data,
              (audioBuffer) => {
                // 存储解码后的 AudioBuffer
                this.audioBuffers.set(soundId, audioBuffer);
                
                // 为该音频创建独立的增益节点
                const gainNode = this.audioContext.createGain();
                gainNode.gain.value = this.volumeConfig[soundId] || 0.5;
                gainNode.connect(this.masterGain);
                this.gainNodes.set(soundId, gainNode);
                
                console.log(`[WebAudioManager] ${soundId} 解码成功，时长: ${audioBuffer.duration.toFixed(2)}s`);
                resolve(true);
              },
              (err) => {
                console.error(`[WebAudioManager] ${soundId} 解码失败: ${err}`);
                resolve(false);
              }
            );
          } else {
            console.error(`[WebAudioManager] ${soundId} 请求失败: ${res.statusCode}`);
            resolve(false);
          }
        },
        fail: (err) => {
          // wx.request 无法直接读取本地包内资源，尝试使用 FileSystemManager
          this._loadLocalAudio(soundId, url).then(resolve);
        }
      });
    });
  }

  /**
   * 使用 FileSystemManager 加载本地音频文件
   * @private
   * @param {string} soundId - 音频标识
   * @param {string} url - 音频文件路径
   * @returns {Promise<boolean>}
   */
  async _loadLocalAudio(soundId, url) {
    return new Promise((resolve) => {
      const fs = wx.getFileSystemManager();
      
      fs.readFile({
        filePath: url,
        success: (res) => {
          // 解码音频数据
          this.audioContext.decodeAudioData(
            res.data,
            (audioBuffer) => {
              this.audioBuffers.set(soundId, audioBuffer);
              
              const gainNode = this.audioContext.createGain();
              gainNode.gain.value = this.volumeConfig[soundId] || 0.5;
              gainNode.connect(this.masterGain);
              this.gainNodes.set(soundId, gainNode);
              
              console.log(`[WebAudioManager] ${soundId} 本地加载解码成功`);
              resolve(true);
            },
            (err) => {
              console.error(`[WebAudioManager] ${soundId} 本地解码失败: ${err}`);
              resolve(false);
            }
          );
        },
        fail: (err) => {
          console.error(`[WebAudioManager] ${soundId} 本地读取失败: ${err.errMsg || err}`);
          resolve(false);
        }
      });
    });
  }

  /**
   * 预加载所有默认音频（兼容旧接口）
   * @param {boolean} enableRetry - 是否启用失败重试，默认true
   * @returns {Promise<boolean>}
   */
  async preloadAllAudio(enableRetry = true) {
    const success = await this.loadSounds();
    
    // 如果加载失败且启用重试，则安排重试
    if (!success && enableRetry && this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`[WebAudioManager] 将在 ${this.retryDelay/1000}s 后进行第 ${this.retryCount} 次重试...`);
      
      return new Promise((resolve) => {
        setTimeout(async () => {
          const retrySuccess = await this.loadSounds();
          if (retrySuccess) {
            console.log(`[WebAudioManager] 第 ${this.retryCount} 次重试成功`);
            this.retryCount = 0; // 重置计数
          } else if (this.retryCount < this.maxRetries) {
            // 继续重试
            resolve(this.preloadAllAudio(enableRetry));
            return;
          }
          resolve(retrySuccess);
        }, this.retryDelay);
      });
    }
    
    if (success) {
      this.retryCount = 0; // 成功后重置计数
    }
    
    return success;
  }

  /**
   * 重置重试计数器
   */
  resetRetryCount() {
    this.retryCount = 0;
  }

  /**
   * 播放指定音频
   * @param {string} soundId - 音频标识 (click1/click2/click3)
   * @param {number} volume - 可选，覆盖默认音量 (0-1)
   * @returns {boolean} 是否成功触发播放
   */
  play(soundId, volume = null) {
    if (!this.isInitialized || !this.audioContext) {
      console.warn('[WebAudioManager] 未初始化，无法播放');
      return false;
    }

    const audioBuffer = this.audioBuffers.get(soundId);
    if (!audioBuffer) {
      console.warn(`[WebAudioManager] 音频未加载: ${soundId}`);
      return false;
    }

    try {
      // 创建音频源节点
      const sourceNode = this.audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      
      // 获取或创建增益节点
      let gainNode = this.gainNodes.get(soundId);
      if (!gainNode) {
        gainNode = this.audioContext.createGain();
        gainNode.connect(this.masterGain);
        this.gainNodes.set(soundId, gainNode);
      }
      
      // 设置音量
      const targetVolume = volume !== null ? volume : (this.volumeConfig[soundId] || 0.5);
      gainNode.gain.value = targetVolume;
      
      // 连接节点链: sourceNode -> gainNode -> masterGain -> destination
      sourceNode.connect(gainNode);
      
      // 立即播放
      sourceNode.start(0);
      
      // 播放结束后自动清理（SourceNode 只能使用一次）
      sourceNode.onended = () => {
        try {
          sourceNode.disconnect();
        } catch (e) {
          // 忽略断开连接错误
        }
      };

      return true;
    } catch (e) {
      console.error(`[WebAudioManager] 播放失败 ${soundId}: ${e.message || e}`);
      return false;
    }
  }

  /**
   * 同时播放多个音频（混音）
   * 通过 GainNode 控制音量防止削波
   * @param {Array<{name: string, volume?: number}>} sounds - 要播放的音频列表
   */
  playMultiple(sounds) {
    if (!Array.isArray(sounds) || sounds.length === 0) {
      return;
    }

    // 根据同时播放的声音数量动态调整音量
    // 使用平方根法则防止多声音叠加导致削波
    const soundCount = sounds.length;
    const volumeMultiplier = soundCount > 1 ? 0.8 / Math.sqrt(soundCount) : 1;

    sounds.forEach(sound => {
      const baseVolume = sound.volume !== undefined 
        ? sound.volume 
        : (this.volumeConfig[sound.name] || 0.5);
      const adjustedVolume = baseVolume * volumeMultiplier;
      this.play(sound.name, adjustedVolume);
    });
  }

  /**
   * 设置主音量
   * @param {number} volume - 音量值 (0-1)
   */
  setMasterVolume(volume) {
    this.volumeConfig.master = Math.max(0, Math.min(1, volume));
    
    if (this.masterGain) {
      this.masterGain.gain.value = this.volumeConfig.master;
    }
  }

  /**
   * 设置单个音频的默认音量
   * @param {string} soundId - 音频标识
   * @param {number} volume - 音量值 (0-1)
   */
  setVolume(soundId, volume) {
    this.volumeConfig[soundId] = Math.max(0, Math.min(1, volume));
    
    const gainNode = this.gainNodes.get(soundId);
    if (gainNode) {
      gainNode.gain.value = this.volumeConfig[soundId];
    }
  }

  /**
   * 检查是否已初始化并预加载
   * @returns {boolean}
   */
  isReady() {
    return this.isInitialized && this.isPreloaded;
  }

  /**
   * 获取音频上下文当前状态
   * @returns {string} running/suspended/closed
   */
  getState() {
    return this.audioContext ? this.audioContext.state : 'closed';
  }

  /**
   * 恢复音频上下文（如果被暂停）
   * @returns {Promise<void>}
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        console.log('[WebAudioManager] 音频上下文已恢复');
      } catch (e) {
        console.warn('[WebAudioManager] 恢复失败: ' + (e.message || e));
      }
    }
  }

  /**
   * 销毁音频管理器，释放资源
   */
  destroy() {
    try {
      // 清理增益节点
      this.gainNodes.forEach((gainNode) => {
        try {
          gainNode.disconnect();
        } catch (e) {
          // 忽略断开连接错误
        }
      });
      this.gainNodes.clear();
      
      // 清理音频缓冲区
      this.audioBuffers.clear();
      
      // 断开主增益节点
      if (this.masterGain) {
        try {
          this.masterGain.disconnect();
        } catch (e) {
          // 忽略断开连接错误
        }
        this.masterGain = null;
      }
      
      // 关闭音频上下文
      if (this.audioContext) {
        try {
          this.audioContext.close();
        } catch (e) {
          // 忽略关闭错误
        }
        this.audioContext = null;
      }
      
      console.log('[WebAudioManager] 资源已释放');
    } catch (e) {
      console.warn('[WebAudioManager] 销毁失败: ' + (e.message || e));
    }
    
    this.isInitialized = false;
    this.isPreloaded = false;
  }
}

// 导出单例（保持与原接口兼容）
const webAudioManager = new WebAudioManager();

module.exports = {
  webAudioManager,
  WebAudioManager
};
