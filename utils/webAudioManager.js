/**
 * 音频池管理器
 * 解决节拍器同时播放多个音频时的削波失真问题
 * 
 * 核心方案：使用 InnerAudioContext 音频池 + 音量控制
 * 
 * 为什么不用 WebAudio decodeAudioData：
 * - wx.getFileSystemManager().readFile() 无法在真机上读取小程序包内的静态资源
 * - 模拟器可以工作是因为它直接访问本地文件系统
 * 
 * 本方案优势：
 * 1. 使用音频池避免频繁创建销毁音频实例
 * 2. 预加载并复用 InnerAudioContext 实例
 * 3. 通过音量控制防止多声音叠加削波
 * 4. 兼容模拟器和真机
 */

class AudioPoolManager {
  constructor() {
    // 每种声音的音频池（多个实例支持快速连续播放）
    this.audioPools = {
      click1: [],
      click2: [],
      click3: []
    };
    
    // 每种声音的池大小
    this.poolSize = 3;
    
    // 当前播放索引（轮询使用池中的实例）
    this.currentIndex = {
      click1: 0,
      click2: 0,
      click3: 0
    };
    
    // 音频文件路径配置
    this.audioFiles = {
      click1: '/subpackages/resources/audio/click1_主音.wav',
      click2: '/subpackages/resources/audio/click2_辅助音.wav',
      click3: '/subpackages/resources/audio/click3_背景节拍.wav'
    };
    
    // 音量配置 - 降低单个声音音量防止叠加削波
    this.volumeConfig = {
      click1: 0.5,      // 主音
      click2: 0.3,      // 辅助音  
      click3: 0.5,      // 背景节拍
      master: 0.8       // 总音量系数
    };
    
    this.isInitialized = false;
    this.isPreloaded = false;
  }

  /**
   * 初始化音频池
   * @returns {Promise<boolean>} 是否初始化成功
   */
  async init() {
    if (this.isInitialized) {
      return true;
    }

    try {
      // 为每种声音创建音频池
      for (const name of Object.keys(this.audioFiles)) {
        this.audioPools[name] = [];
        
        for (let i = 0; i < this.poolSize; i++) {
          const audio = wx.createInnerAudioContext();
          audio.src = this.audioFiles[name];
          audio.volume = this.volumeConfig[name] * this.volumeConfig.master;
          
          // 错误处理
          audio.onError((err) => {
            console.warn(`[AudioPoolManager] ${name}[${i}] 错误: ${err.errMsg || 'unknown'}`);
          });
          
          this.audioPools[name].push(audio);
        }
      }
      
      this.isInitialized = true;
      console.log('[AudioPoolManager] 初始化成功');
      return true;
    } catch (e) {
      console.error('[AudioPoolManager] 初始化失败: ' + (e.message || e));
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * 预加载所有音频（让音频准备好播放）
   * @returns {Promise<boolean>} 是否预加载成功
   */
  async preloadAllAudio() {
    if (!this.isInitialized) {
      await this.init();
    }

    return new Promise((resolve) => {
      let loadedCount = 0;
      let totalCount = 0;
      let hasError = false;
      
      // 计算总数
      for (const name of Object.keys(this.audioPools)) {
        totalCount += this.audioPools[name].length;
      }
      
      const checkComplete = () => {
        loadedCount++;
        if (loadedCount >= totalCount) {
          this.isPreloaded = !hasError;
          console.log(`[AudioPoolManager] 预加载完成，成功: ${this.isPreloaded}`);
          resolve(this.isPreloaded);
        }
      };
      
      // 为每个音频实例添加加载监听
      for (const name of Object.keys(this.audioPools)) {
        this.audioPools[name].forEach((audio, index) => {
          // onCanplay 表示音频已加载足够数据可以播放
          const onCanplay = () => {
            audio.offCanplay(onCanplay);
            audio.offError(onError);
            checkComplete();
          };
          
          const onError = (err) => {
            audio.offCanplay(onCanplay);
            audio.offError(onError);
            console.warn(`[AudioPoolManager] ${name}[${index}] 加载失败: ${err.errMsg || 'unknown'}`);
            hasError = true;
            checkComplete();
          };
          
          audio.onCanplay(onCanplay);
          audio.onError(onError);
        });
      }
      
      // 设置超时，防止永久等待
      setTimeout(() => {
        if (loadedCount < totalCount) {
          console.warn('[AudioPoolManager] 预加载超时，继续执行');
          this.isPreloaded = true; // 即使超时也标记为已预加载，允许播放尝试
          resolve(true);
        }
      }, 3000);
    });
  }

  /**
   * 播放指定音频
   * @param {string} name - 音频名称标识 (click1/click2/click3)
   * @param {number} volume - 可选，覆盖默认音量 (0-1)
   * @returns {boolean} 是否成功触发播放
   */
  play(name, volume = null) {
    if (!this.isInitialized) {
      console.warn('[AudioPoolManager] 未初始化，无法播放');
      return false;
    }

    const pool = this.audioPools[name];
    if (!pool || pool.length === 0) {
      console.warn(`[AudioPoolManager] 音频池不存在: ${name}`);
      return false;
    }

    try {
      // 获取当前索引的音频实例
      const index = this.currentIndex[name];
      const audio = pool[index];
      
      // 更新索引，轮询使用池中的实例
      this.currentIndex[name] = (index + 1) % pool.length;
      
      // 设置音量
      const targetVolume = volume !== null ? volume : this.volumeConfig[name];
      audio.volume = targetVolume * this.volumeConfig.master;
      
      // 重置播放位置并播放
      audio.seek(0);
      audio.play();

      return true;
    } catch (e) {
      console.error(`[AudioPoolManager] 播放失败 ${name}: ${e.message || e}`);
      return false;
    }
  }

  /**
   * 同时播放多个音频（混音）
   * 通过音量控制防止削波
   * @param {Array<{name: string, volume?: number}>} sounds - 要播放的音频列表
   */
  playMultiple(sounds) {
    if (!Array.isArray(sounds) || sounds.length === 0) {
      return;
    }

    // 根据同时播放的声音数量动态调整音量
    // 防止多声音叠加导致削波
    const soundCount = sounds.length;
    const volumeMultiplier = soundCount > 1 ? 0.7 / Math.sqrt(soundCount) : 1;

    sounds.forEach(sound => {
      const baseVolume = sound.volume !== undefined ? sound.volume : (this.volumeConfig[sound.name] || 0.5);
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
    
    // 更新所有音频实例的音量
    for (const name of Object.keys(this.audioPools)) {
      this.audioPools[name].forEach(audio => {
        audio.volume = this.volumeConfig[name] * this.volumeConfig.master;
      });
    }
  }

  /**
   * 设置单个音频的默认音量
   * @param {string} name - 音频名称
   * @param {number} volume - 音量值 (0-1)
   */
  setVolume(name, volume) {
    this.volumeConfig[name] = Math.max(0, Math.min(1, volume));
    
    // 更新对应音频池的音量
    if (this.audioPools[name]) {
      this.audioPools[name].forEach(audio => {
        audio.volume = this.volumeConfig[name] * this.volumeConfig.master;
      });
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
   * 销毁所有音频实例，释放资源
   */
  destroy() {
    try {
      for (const name of Object.keys(this.audioPools)) {
        this.audioPools[name].forEach(audio => {
          try {
            audio.stop();
            audio.destroy();
          } catch (e) {
            // 忽略销毁错误
          }
        });
        this.audioPools[name] = [];
      }
    } catch (e) {
      console.warn('[AudioPoolManager] 销毁失败: ' + (e.message || e));
    }
    
    this.isInitialized = false;
    this.isPreloaded = false;
    this.currentIndex = {
      click1: 0,
      click2: 0,
      click3: 0
    };
  }
}

// 导出单例（保持与原接口兼容）
const webAudioManager = new AudioPoolManager();

module.exports = {
  webAudioManager,
  WebAudioManager: AudioPoolManager
};
