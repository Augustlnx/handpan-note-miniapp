// 开屏等待页面
// 注意：此页面是独立分包，运行在隔离环境中
// 
// ========== 独立分包的限制 ==========
// 1. getApp() 返回的是简化版 app 对象，需要 allowDefault: true
// 2. 无法直接 require 主包或其他分包的模块
// 3. wx.loadSubPackage 在独立分包中调用其他分包是无效的（微信官方限制）
// 4. preloadRule 每个页面的预加载分包总大小不能超过 2MB
//
// ========== 预加载策略 ==========
// 由于上述限制，本页面采用以下优化策略：
// 1. Storage 数据预读取和预处理（独立分包中可用）
// 2. 数据格式迁移前置（减少主包页面首屏渲染时间）
// 3. 通过 preloadRule 配置预加载 resources 分包（<2MB）
// 4. 主包和 audio 分包的预加载由系统自动处理或在 notation 页面处理
//
// ========== 分包加载时机 ==========
// - __APP__（主包）：从独立分包跳转时自动加载
// - resources：通过 preloadRule 预加载
// - audio：在 notation 页面 onLoad 时通过代码式预加载

const app = getApp({ allowDefault: true }); // 独立分包需要 allowDefault

Page({
  data: {
    countdown: 2,
    showButton: false,
    imageLoaded: false,
    countdownFinished: false,
    posterSrc: '',
    preloadProgress: 0, // 预加载进度 (0-100)
    preloadStatus: '' // 预加载状态文字
  },

  countdownTimer: null,
  loadRetryCount: 0,
  maxRetries: 3,
  loadTimer: null,
  hasStartedCountdown: false,
  imageFormats: ['webp', 'jpeg', 'png'],
  preloadComplete: false, // 预加载是否完成

  onLoad() {
    console.log('[Splash] 页面加载开始');
    
    // 记录开始时间，用于计算预加载耗时
    this._loadStartTime = Date.now();
    
    // 1. 并行预加载 notation 页面所需的数据（Storage 操作在独立分包中可用）
    //    这是最重要的优化：利用开屏等待时间预读取和预处理数据
    this.preloadNotationData();
    
    // 2. 立即加载海报图片，从 webp 开始
    this.loadPosterImage();
    
    // 3. 预渲染 notation 页面关键数据到全局缓存
    this.prepareNotationPageData();
    
    // 4. 标记 splash 已完成预加载，供主包页面检查
    this.markSplashPreloadStatus();
  },

  onUnload() {
    // 清理所有定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
  },

  // 加载海报图片
  loadPosterImage() {
    // 按照 webp -> jpeg -> png 的顺序尝试
    const formatIndex = this.loadRetryCount % this.imageFormats.length;
    const format = this.imageFormats[formatIndex];
    const newSrc = `/subpackages/openpage/img/open.${format}`;
    
    console.log(`Trying to load image: ${newSrc} (Attempt ${this.loadRetryCount + 1})`);
    
    this.setData({
      posterSrc: newSrc
    });
  },

  // 图片加载完成回调
  onImageLoad() {
    console.log('Image loaded successfully');
    
    // 清理可能存在的重试定时器
    if (this.loadTimer) {
      clearTimeout(this.loadTimer);
      this.loadTimer = null;
    }
    
    this.setData({ 
      imageLoaded: true,
      showButton: true 
    });
    
    // 开始倒计时（确保只启动一次）
    if (!this.hasStartedCountdown) {
      this.hasStartedCountdown = true;
      this.startCountdown();
    }
  },

  // 图片加载失败
  onImageError(e) {
    console.error('Image load error:', e.detail, 'Format:', this.data.posterSrc);
    
    this.loadRetryCount++;
    
    if (this.loadRetryCount < this.maxRetries) {
      // 快速重试，几乎无延迟
      this.loadTimer = setTimeout(() => {
        this.loadPosterImage();
      }, 50);
    } else {
      // 重试次数用完，直接显示按钮让用户可以进入
      console.log('All image formats failed, showing button anyway');
      this.setData({ 
        imageLoaded: true,
        showButton: true
      });
      
      if (!this.hasStartedCountdown) {
        this.hasStartedCountdown = true;
        this.startCountdown();
      }
    }
  },

  // ========== 标记预加载状态 ==========
  // 告知主包页面 splash 已完成的预处理工作
  markSplashPreloadStatus() {
    try {
      wx.setStorageSync('splash_preload_status', {
        completed: true,
        timestamp: Date.now(),
        // 记录完成的预处理项目
        tasks: {
          dataPreload: true,      // Storage 数据预读取
          dataMigration: wx.getStorageSync('splash_premigrated') || false, // 数据格式迁移
          precalcData: true       // 首屏数据预计算
        }
      });
      console.log('[Splash] 预加载状态已标记');
    } catch (e) {
      console.error('[Splash] 标记预加载状态失败:', e);
    }
  },
  
  // ========== 预渲染数据准备（在等待期间预处理） ==========
  prepareNotationPageData() {
    console.log('[Splash] 开始准备 notation 页面预渲染数据...');
    
    try {
      // 1. 预计算首屏需要的数据结构
      const timeSignatureBeats = wx.getStorageSync('timeSignatureBeats') || 4;
      const customTimeSignature = wx.getStorageSync('customTimeSignature');
      
      let notationsKey = `notations_${timeSignatureBeats}_4`;
      if (customTimeSignature && customTimeSignature.type === 'custom') {
        notationsKey = `notations_custom_${customTimeSignature.noteCount}`;
      }
      
      const notations = wx.getStorageSync(notationsKey);
      
      if (notations && Array.isArray(notations) && notations.length > 0) {
        // 2. 预计算首屏渲染参数
        const firstModule = notations[0];
        const measuresCount = firstModule.measures ? firstModule.measures.length : 0;
        
        // 缓存首屏相关计算结果
        wx.setStorageSync('splash_precalc_data', {
          totalModules: notations.length,
          firstModuleMeasures: measuresCount,
          hasData: true,
          timestamp: Date.now()
        });
        
        console.log(`[Splash] 预计算完成: ${notations.length} 个模块, 首模块 ${measuresCount} 个小节`);
      } else {
        wx.setStorageSync('splash_precalc_data', {
          hasData: false,
          timestamp: Date.now()
        });
      }
      
      // 3. 预热转换表数据
      const conversionTableLibrary = wx.getStorageSync('conversionTableLibrary') || [];
      if (conversionTableLibrary.length > 0) {
        console.log(`[Splash] 转换表库已缓存: ${conversionTableLibrary.length} 个`);
      }
      
    } catch (e) {
      console.error('[Splash] 预渲染数据准备失败:', e);
    }
  },

  // 预加载 notation 页面所需的数据
  preloadNotationData() {
    this.setData({ preloadStatus: '正在加载数据...' });
    
    let completedTasks = 0;
    const totalTasks = 7; // 增加一个数据预处理任务
    
    const updateProgress = (taskName) => {
      completedTasks++;
      const progress = Math.round((completedTasks / totalTasks) * 100);
      this.setData({ 
        preloadProgress: progress,
        preloadStatus: taskName 
      });
      
      if (completedTasks >= totalTasks) {
        this.preloadComplete = true;
        this.setData({ preloadStatus: '准备就绪' });
        console.log('All notation data preloaded');
      }
    };

    // 1. 预加载标题信息
    try {
      const mainTitle = wx.getStorageSync('mainTitle') || 'Note Title';
      const subTitle = wx.getStorageSync('subTitle') || 'Author: Unknown';
      const metaInfo = wx.getStorageSync('notationMetaInfo') || {};
      updateProgress('加载标题');
    } catch (e) {
      console.log('Preload titles failed:', e);
      updateProgress('加载标题');
    }

    // 2. 预加载颜色设置
    try {
      const colorSettings = wx.getStorageSync('colorSettings') || {};
      updateProgress('加载配色');
    } catch (e) {
      console.log('Preload colors failed:', e);
      updateProgress('加载配色');
    }

    // 3. 预加载谱面数据并进行数据预处理
    try {
      const timeSignatureBeats = wx.getStorageSync('timeSignatureBeats') || 4;
      const customTimeSignature = wx.getStorageSync('customTimeSignature');
      
      let notationsKey = `notations_${timeSignatureBeats}_4`;
      if (customTimeSignature && customTimeSignature.type === 'custom') {
        notationsKey = `notations_custom_${customTimeSignature.noteCount}`;
      }
      
      const notations = wx.getStorageSync(notationsKey);
      
      // 数据预处理：检查并迁移旧版数据格式（将耗时操作前置）
      if (notations && Array.isArray(notations) && notations.length > 0) {
        const needsMigration = this.checkNeedsMigration(notations);
        if (needsMigration) {
          console.log('Splash: 检测到旧版数据，执行预迁移...');
          const migratedData = this.preMigrateNotations(notations);
          wx.setStorageSync(notationsKey, migratedData);
          wx.setStorageSync('splash_premigrated', true); // 标记已预处理
          console.log('Splash: 数据预迁移完成');
        }
      }
      updateProgress('加载谱面');
    } catch (e) {
      console.log('Preload notations failed:', e);
      updateProgress('加载谱面');
    }

    // 4. 数据预处理标记
    try {
      wx.setStorageSync('splash_preload_timestamp', Date.now());
      updateProgress('优化数据');
    } catch (e) {
      updateProgress('优化数据');
    }

    // 5. 预加载全局速度和节拍器设置
    try {
      const globalTempo = wx.getStorageSync('globalTempo') || 60;
      const metronomeSoundType = wx.getStorageSync('metronomeSoundType') || 'click';
      updateProgress('加载速度');
    } catch (e) {
      console.log('Preload tempo failed:', e);
      updateProgress('加载速度');
    }

    // 6. 预加载库文件关联信息
    try {
      const libraryInfo = wx.getStorageSync('libraryFileInfo');
      updateProgress('加载关联');
    } catch (e) {
      console.log('Preload library info failed:', e);
      updateProgress('加载关联');
    }

    // 7. 预加载谱式类型和背景透明度
    try {
      const notationType = wx.getStorageSync('notationType') || 'digital';
      const backgroundOpacity = wx.getStorageSync('backgroundOpacity');
      updateProgress('加载完成');
    } catch (e) {
      console.log('Preload settings failed:', e);
      updateProgress('加载完成');
    }
  },

  // 检查数据是否需要迁移（旧版格式检测）
  checkNeedsMigration(notations) {
    if (!notations || !notations.length) return false;
    
    // 检查第一个 notation 的第一个 measure 的第一个 beat
    const firstNotation = notations[0];
    if (!firstNotation.measures || !firstNotation.measures.length) return false;
    
    const firstMeasure = firstNotation.measures[0];
    if (!firstMeasure.beats || !firstMeasure.beats.length) return false;
    
    const firstBeat = firstMeasure.beats[0];
    
    // 旧版格式：beat 直接有 rightHand/leftHand 而非 subdivisions
    if (!firstBeat.subdivisions && (firstBeat.rightHand !== undefined || firstBeat.leftHand !== undefined)) {
      return true;
    }
    
    // 检查 subdivisions 内的数据格式
    if (firstBeat.subdivisions && firstBeat.subdivisions.length > 0) {
      const firstSub = firstBeat.subdivisions[0];
      // 旧版：rightHand/leftHand 是字符串而非数组
      if (typeof firstSub.rightHand === 'string' || typeof firstSub.leftHand === 'string') {
        return true;
      }
    }
    
    return false;
  },

  // 预迁移数据格式（简化版，与 notation.js 的 migrateNotations 逻辑一致）
  preMigrateNotations(notations) {
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
          return {
            subdivisions: (beat.subdivisions || []).map(sub => ({
              rightHand: ensureArray2(sub.rightHand),
              leftHand: ensureArray2(sub.leftHand)
            }))
          };
        });
        return { ...measure, beats };
      });
      return newNotation;
    });
  },

  // 开始倒计时
  startCountdown() {
    let count = 2;
    
    this.countdownTimer = setInterval(() => {
      count--;
      
      if (count <= 0) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
        // 倒计时结束，不自动进入，等待用户点击
        this.setData({ 
          countdown: 0,
          countdownFinished: true 
        });
      } else {
        this.setData({ countdown: count });
      }
    }, 1000);
  },

  // 点击立即开始按钮
  onStartTap() {
    // 清理定时器
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
    
    this.enterApp();
  },

  // 进入主程序
  // 从独立分包跳转到主包的 tabBar 页面
  enterApp() {
    if (this._isEntering) return;
    this._isEntering = true;
    
    // 记录预加载耗时
    if (this._loadStartTime) {
      const elapsed = Date.now() - this._loadStartTime;
      console.log(`[Splash] 预加载阶段耗时: ${elapsed}ms`);
      wx.setStorageSync('splash_preload_duration', elapsed);
    }

    // 优先使用 switchTab，因为 notation 是 tabBar 页面
    // switchTab 比 reLaunch 更适合跳转到 tabBar 页面：
    // 1. 语义正确：专门用于 tabBar 页面切换
    // 2. 性能更好：系统会做专门优化
    // 3. 不会销毁 tabBar 实例
    wx.switchTab({
      url: '/pages/notation/notation',
      success: () => {
        console.log('[Splash] 成功跳转到 notation 页面');
      },
      fail: (err) => {
        console.error('[Splash] switchTab 失败:', err);
        this._isEntering = false;
        
        // 备用方案 1：使用 reLaunch（会重建整个页面栈）
        wx.reLaunch({
          url: '/pages/notation/notation',
          fail: (err2) => {
            console.error('[Splash] reLaunch 也失败:', err2);
            
            // 备用方案 2：延迟重试
            setTimeout(() => {
              this._isEntering = false;
              wx.switchTab({
                url: '/pages/notation/notation',
                fail: (err3) => {
                  console.error('[Splash] 重试 switchTab 失败:', err3);
                  wx.showToast({
                    title: '加载失败，请重试',
                    icon: 'none'
                  });
                  this._isEntering = false;
                }
              });
            }, 500);
          }
        });
      }
    });
  }
});
