// 开屏等待页面
const app = getApp();

Page({
  data: {
    countdown: 2,
    showButton: false,
    imageLoaded: false,
    countdownFinished: false,
    posterSrc: '',
    preloadProgress: 0, // 预加载进度 (0-100)
    preloadStatus: '', // 预加载状态文字
    subpackageProgress: { audio: 0, resources: 0 } // 分包下载进度
  },

  countdownTimer: null,
  loadRetryCount: 0,
  maxRetries: 3,
  loadTimer: null,
  hasStartedCountdown: false,
  imageFormats: ['webp', 'jpeg', 'png'],
  preloadComplete: false, // 预加载是否完成
  subpackagesLoaded: { audio: false, resources: false }, // 分包加载状态

  onLoad() {
    console.log('[Splash] 页面加载开始');
    
    // 1. 立即开始代码式预加载分包（核心：绕过配置式 2MB 限制）
    this.preloadSubpackages();
    
    // 2. 并行预加载 notation 页面所需的数据
    this.preloadNotationData();
    
    // 3. 预热 notation 页面核心资源
    this.preloadCriticalImages();
    
    // 4. 立即加载海报图片，从 webp 开始
    this.loadPosterImage();
    
    // 5. 预渲染 notation 页面关键数据到全局缓存
    this.prepareNotationPageData();
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

  // ========== 代码式预加载分包（核心：绕过配置式 2MB 限制） ==========
  preloadSubpackages() {
    console.log('[Splash] 开始代码式预加载分包...');
    
    if (!wx.loadSubpackage) {
      console.warn('[Splash] wx.loadSubpackage 不可用');
      return;
    }
    
    // 并发加载 audio 和 resources 分包
    // 注意：不需要显式加载 __APP__（主包），从独立分包跳转到主包页面时系统会自动处理
    
    // 1. 预下载 audio 分包（音频资源，约 1.9MB）
    const audioTask = wx.loadSubpackage({
      name: 'audio',
      success: () => {
        console.log('[Splash] audio 分包加载成功');
        this.subpackagesLoaded.audio = true;
        this.updateSubpackageStatus();
      },
      fail: (err) => {
        console.error('[Splash] audio 分包加载失败:', err);
        // 记录失败状态，让 notation 页面知道需要重试
        wx.setStorageSync('subpackage_audio_loaded', false);
      }
    });
    
    // 监听 audio 分包下载进度
    if (audioTask && audioTask.onProgressUpdate) {
      audioTask.onProgressUpdate((res) => {
        console.log(`[Splash] audio 分包下载进度: ${res.progress}%`);
        this.setData({
          ['subpackageProgress.audio']: res.progress
        });
      });
    }
    
    // 2. 预下载 resources 分包（图标和静态资源）
    const resourcesTask = wx.loadSubpackage({
      name: 'resources',
      success: () => {
        console.log('[Splash] resources 分包加载成功');
        this.subpackagesLoaded.resources = true;
        this.updateSubpackageStatus();
      },
      fail: (err) => {
        console.error('[Splash] resources 分包加载失败:', err);
        wx.setStorageSync('subpackage_resources_loaded', false);
      }
    });
    
    // 监听 resources 分包下载进度
    if (resourcesTask && resourcesTask.onProgressUpdate) {
      resourcesTask.onProgressUpdate((res) => {
        console.log(`[Splash] resources 分包下载进度: ${res.progress}%`);
        this.setData({
          ['subpackageProgress.resources']: res.progress
        });
      });
    }
    
    // 3. 预下载 packageB 分包（引导页等，低优先级）
    wx.loadSubpackage({
      name: 'packageB',
      success: () => console.log('[Splash] packageB 分包加载成功'),
      fail: (err) => console.log('[Splash] packageB 分包加载失败:', err)
    });
  },
  
  // 更新分包加载状态
  updateSubpackageStatus() {
    const { audio, resources } = this.subpackagesLoaded;
    
    if (audio && resources) {
      console.log('[Splash] 所有核心分包加载完成');
      // 标记分包已加载，notation 页面可以检查此状态
      wx.setStorageSync('subpackage_audio_loaded', true);
      wx.setStorageSync('subpackage_resources_loaded', true);
      wx.setStorageSync('subpackages_preloaded_time', Date.now());
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

  // 预热核心图片资源（在等待期间完成，不会被销毁）
  preloadCriticalImages() {
    console.log('[Splash] 开始预热核心图片资源...');
    
    const criticalAssets = [
      // TabBar 图标（首屏必需）
      '/assets/icons/notation-active.png',
      '/assets/icons/library.png',
      '/assets/icons/metronome.png',
      '/assets/icons/settings.png',
      // 常用功能图标
      '/assets/icons/tool.png',
      '/assets/icons/upload.png',
      '/assets/icons/output.png',
      '/assets/icons/timing.png',
      '/assets/icons/refresh.png',
      '/assets/icons/more.png',
      '/assets/icons/share.png',
      '/assets/icons/play.png',
      '/assets/icons/pause.png',
      // 背景图
      '/assets/img/note_background.png'
    ];
    
    let loadedCount = 0;
    const totalCount = criticalAssets.length;
    
    // 并行预加载所有图片（wx.getImageInfo 会触发图片解码和缓存）
    criticalAssets.forEach(src => {
      wx.getImageInfo({
        src,
        success: () => {
          loadedCount++;
          if (loadedCount === totalCount) {
            console.log(`[Splash] 所有核心图片预热完成 (${loadedCount}/${totalCount})`);
            // 标记图片预热完成
            wx.setStorageSync('splash_images_preloaded', true);
          }
        },
        fail: () => {
          loadedCount++;
          // 静默失败，不影响主流程
        }
      });
    });
    
    // 预热 resources 分包中的资源图片路径（如果有的话）
    const resourceImages = [
      '/subpackages/resources/img/logo5.png'
    ];
    
    resourceImages.forEach(src => {
      wx.getImageInfo({
        src,
        success: () => console.log(`[Splash] Resource image preloaded: ${src}`),
        fail: () => {} // 静默失败
      });
    });
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
  enterApp() {
    if (this._isEntering) return;
    this._isEntering = true;

    wx.reLaunch({
      url: '/pages/notation/notation',
      fail: (err) => {
        this._isEntering = false;
        console.error('Failed to enter app:', err);
        // 备用方案：使用 switchTab
        wx.switchTab({
          url: '/pages/notation/notation',
          fail: (err2) => {
            console.error('SwitchTab also failed:', err2);
            wx.showToast({
              title: '加载失败，请重试',
              icon: 'none'
            });
          }
        });
      }
    });
  }
});
