// 导出页面
const app = getApp();

// 预加载 pdf-lib 模块，避免异步加载问题
let pdfLibLoaded = false;
try {
  const pdfLib = require('../../utils/pdfExport.js');
  // 预热 pdf-lib 模块
  if (!global.__pdfLibCache) {
    try {
      const pdfLibModule = require('pdf-lib');
      global.__pdfLibCache = {
        PDFDocument: pdfLibModule.PDFDocument
      };
      pdfLibLoaded = true;
      console.log('pdf-lib 预加载成功');
    } catch (e) {
      console.warn('pdf-lib 预加载失败，将在使用时加载:', e.message);
    }
  } else {
    pdfLibLoaded = true;
  }
} catch (e) {
  console.warn('导出模块预加载失败:', e.message);
}

Page({
  data: {
    // 当前步骤: 'mode' | 'specs' | 'preview' | 'format' | 'code'
    currentStep: 'mode',
    
    // 从notation页面传递过来的数据
    notations: [],
    mainTitle: '',
    subTitle: '',
    globalTempo: 60,
    mainTitleColor: '#314D63',
    subTitleColor: '#8FB9AB',
    rightHandColor: '#F4D096',
    leftHandColor: '#314D63',
    orientation: 'portrait',
    measuresPerRow: 1,
    // 元信息
    composer: '',
    rootNote: '',
    scaleType: '',
    noteCount: 0,
    introduction: '',
    notationType: 'digital',
    difficulty: 0,
    
    // 导出选项
    exportMode: 'long', // 'long' 长图模式, 'paged' 分页模式, 'code' 代码模式
    exportLayoutMode: 'compact', // 'compact' 紧凑模式, 'loose' 宽松模式
    exportA4Orientation: 'portrait', // A4纸张方向
    
    // 背景图配置
    exportBgOpacity: 0.10,
    exportBgSize: 0.67,
    
    // 颜色配置
    exportColorMode: 'dual', // 'dual' 双色模式, 'single' 单色模式
    exportSingleColor: '#314D63',
    exportRightHandColor: '#F4D096',
    exportLeftHandColor: '#314D63',
    
    // 用户调整参数（0-100，默认50表示1.0倍）
    lineSpacingAdjust: 50,      // 行间距调整
    measureHeightAdjust: 50,    // 单行高度调整
    titleScaleAdjust: 50,       // 标题区大小调整
    fontSizeAdjust: 50,         // 新增：字号调整

    // 展开更多设置
    showMoreSpecs: false,

    // 更多参数（0-100，默认50表示1.0倍）
    dotSizeAdjust: 50,          // 音高圆点大小
    dotUpOffsetAdjust: 50,      // 音高圆点上偏移
    dotDownOffsetAdjust: 50,    // 音高圆点下偏移
    underlineThicknessAdjust: 50, // 下划线厚度
    underlineOffsetAdjust: 50,    // 下划线偏移
    supFontSizeAdjust: 50,        // 上标大小
    
    // 预览相关
    exportPreviewImages: [],
    currentPreviewPage: 0,
    selectedSaveFormat: 'image', // 'image' 或 'pdf'
    
    // 代码导出
    exportedCode: '',
    
    // PDF相关
    showPdfProgressModal: false,
    pdfProgressPercent: 0,
    pdfProgressStage: '',
    pdfExportCancelled: false,
    showPdfSuccessModal: false,
    exportedPdfPath: '',
    exportedPdfFileName: '',
    
    // 加载状态
    isLoading: false,
    loadingText: '加载中...',
    
    // PDF库加载状态
    pdfLibReady: pdfLibLoaded
  },

  // 展开/收起更多规格设置
  toggleMoreSpecs() {
    this.setData({ showMoreSpecs: !this.data.showMoreSpecs });
  },

  // 字号调整
  onFontSizeAdjustChange(e) {
    this.setData({ fontSizeAdjust: e.detail.value });
  },

  // 音高圆点相关
  onDotSizeAdjustChange(e) {
    this.setData({ dotSizeAdjust: e.detail.value });
  },
  onDotUpOffsetAdjustChange(e) {
    this.setData({ dotUpOffsetAdjust: e.detail.value });
  },
  onDotDownOffsetAdjustChange(e) {
    this.setData({ dotDownOffsetAdjust: e.detail.value });
  },

  // 下划线相关
  onUnderlineThicknessAdjustChange(e) {
    this.setData({ underlineThicknessAdjust: e.detail.value });
  },
  onUnderlineOffsetAdjustChange(e) {
    this.setData({ underlineOffsetAdjust: e.detail.value });
  },

  // 上标相关
  onSupFontSizeAdjustChange(e) {
    this.setData({ supFontSizeAdjust: e.detail.value });
  },

  onLoad(options) {
    // 从页面参数或全局数据获取谱面数据
    this.loadNotationData();
    
    // 异步预加载 pdf-lib（如果尚未加载）
    this.preloadPdfLib();
  },
  
  onUnload() {
    // 清理超时定时器
    if (this._exportTimeoutId) {
      clearTimeout(this._exportTimeoutId);
      this._exportTimeoutId = null;
    }
  },
  
  // 预加载 pdf-lib 模块
  preloadPdfLib() {
    if (this.data.pdfLibReady) {
      return;
    }
    
    // 延迟加载，避免阻塞页面渲染
    setTimeout(() => {
      try {
        if (!global.__pdfLibCache) {
          const pdfLibModule = require('pdf-lib');
          global.__pdfLibCache = {
            PDFDocument: pdfLibModule.PDFDocument
          };
          this.setData({ pdfLibReady: true });
          console.log('pdf-lib 异步预加载成功');
        } else {
          this.setData({ pdfLibReady: true });
        }
      } catch (e) {
        console.warn('pdf-lib 异步预加载失败:', e.message);
      }
    }, 500);
  },

  // 加载谱面数据
  loadNotationData() {
    // 优先从全局应用实例获取数据
    const exportData = app.globalData && app.globalData.exportData;
    
    if (exportData) {
      this.setData({
        notations: exportData.notations || [],
        mainTitle: exportData.mainTitle || '',
        subTitle: exportData.subTitle || '',
        globalTempo: exportData.globalTempo || 60,
        mainTitleColor: exportData.mainTitleColor || '#314D63',
        subTitleColor: exportData.subTitleColor || '#8FB9AB',
        rightHandColor: exportData.rightHandColor || '#F4D096',
        leftHandColor: exportData.leftHandColor || '#314D63',
        orientation: exportData.orientation || 'portrait',
        measuresPerRow: exportData.measuresPerRow || 1,
        composer: exportData.composer || '',
        rootNote: exportData.rootNote || '',
        scaleType: exportData.scaleType || '',
        noteCount: exportData.noteCount || 0,
        introduction: exportData.introduction || '',
        notationType: exportData.notationType || 'digital',
        difficulty: exportData.difficulty || 0,
        // 使用谱面的颜色作为默认导出颜色
        exportRightHandColor: exportData.rightHandColor || '#F4D096',
        exportLeftHandColor: exportData.leftHandColor || '#314D63'
      });
      
      // 清除全局数据
      app.globalData.exportData = null;
    } else {
      wx.showToast({
        title: '未获取到谱面数据',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 选择导出模式
  selectExportMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ exportMode: mode });
  },

  // 确认导出模式
  confirmExportMode() {
    const { exportMode } = this.data;
    
    if (exportMode === 'code') {
      // 导出为代码
      this.exportAsCode();
    } else {
      // 长图模式和分页模式都进入规格设置
      this.setData({ currentStep: 'specs' });
    }
  },

  // 返回上一步（通用）
  goBackStep() {
    const step = this.data.currentStep;
    if (step === 'specs') {
      this.setData({ currentStep: 'mode' });
    } else if (step === 'preview') {
      // 预览界面返回到规格设置（无论长图还是分页模式）
      this.setData({ currentStep: 'specs' });
    } else if (step === 'code') {
      this.setData({ currentStep: 'mode' });
    }
  },

  // 关闭导出预览（返回到规格设置）
  closeExportPreview() {
    this.setData({ currentStep: 'specs' });
  },

  // 返回模式选择
  backToModeSelect() {
    this.setData({ currentStep: 'mode' });
  },

  // 选择保存格式
  selectSaveFormat(e) {
    const format = e.currentTarget.dataset.format;
    this.setData({ selectedSaveFormat: format });
  },

  // 确认保存
  confirmSave() {
    if (this.data.selectedSaveFormat === 'image') {
      this.saveAsImages();
    } else {
      this.saveAsPDF();
    }
  },

  // 选择A4方向
  selectA4Orientation(e) {
    const orientation = e.currentTarget.dataset.orientation;
    this.setData({ exportA4Orientation: orientation });
  },

  // 选择导出排版模式
  selectExportLayoutMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ exportLayoutMode: mode });
  },

  // 背景图片大小变化
  onExportBgSizeChange(e) {
    this.setData({ exportBgSize: e.detail.value / 100 });
  },

  // 背景图片透明度变化
  onExportBgOpacityChange(e) {
    this.setData({ exportBgOpacity: e.detail.value / 100 });
  },

  // 行间距调整
  onLineSpacingAdjustChange(e) {
    this.setData({ lineSpacingAdjust: e.detail.value });
  },

  // 单行高度调整
  onMeasureHeightAdjustChange(e) {
    this.setData({ measureHeightAdjust: e.detail.value });
  },

  // 标题区大小调整
  onTitleScaleAdjustChange(e) {
    this.setData({ titleScaleAdjust: e.detail.value });
  },

  // 选择颜色模式
  selectExportColorMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ exportColorMode: mode });
  },

  // 颜色输入变化
  onExportColorInput(e) {
    const type = e.currentTarget.dataset.type;
    let value = e.detail.value.trim();
    
    if (value && !value.startsWith('#')) {
      value = '#' + value;
    }
    
    const isValidColor = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(value);
    if (!isValidColor && value.length > 0) {
      return;
    }
    
    let colorKey;
    if (type === 'rightHand') {
      colorKey = 'exportRightHandColor';
    } else if (type === 'leftHand') {
      colorKey = 'exportLeftHandColor';
    } else {
      colorKey = 'exportSingleColor';
    }
    
    if (value) {
      this.setData({ [colorKey]: value });
    }
  },

  // 打开颜色选择器
  openExportColorPicker(e) {
    const type = e.currentTarget.dataset.type;
    let colorKey;
    
    if (type === 'rightHand') {
      colorKey = 'exportRightHandColor';
    } else if (type === 'leftHand') {
      colorKey = 'exportLeftHandColor';
    } else {
      colorKey = 'exportSingleColor';
    }

    const presetColors = [
      '#314D63', '#F4D096', '#8FB9AB', '#E57373', '#64B5F6', '#81C784', 
      '#FFD54F', '#BA68C8', '#FF8A65', '#4DB6AC', '#A1887F', '#90A4AE', 
      '#000000', '#FFFFFF'
    ];

    wx.showActionSheet({
      itemList: ['深蓝灰', '金色', '青绿', '红色', '蓝色', '绿色', '黄色', '紫色', '橙色', '青色', '棕色', '灰色', '黑色', '白色'],
      success: (res) => {
        if (res.tapIndex >= 0 && res.tapIndex < presetColors.length) {
          this.setData({ [colorKey]: presetColors[res.tapIndex] });
        }
      }
    });
  },

  // 确认导出规格并开始导出
  confirmExportSpecs() {
    // 根据导出模式调用不同的导出方法
    const { exportMode } = this.data;
    this.exportWithTimeout(exportMode === 'long' ? 'long' : 'paged');
  },

  // 导出长图
  exportLongImage() {
    this.exportWithTimeout('long');
  },
  
  // 带超时检测的导出方法
  exportWithTimeout(mode, retryCount = 0) {
    const MAX_RETRIES = 2; // 最多重试2次
    const TIMEOUT_MS = 20000; // 20秒超时
    
    this.setData({
      isLoading: true,
      loadingText: retryCount > 0 ? `正在重试生成图片 (${retryCount}/${MAX_RETRIES})...` : '生成图片中...'
    });
    
    // 清除之前的超时定时器
    if (this._exportTimeoutId) {
      clearTimeout(this._exportTimeoutId);
      this._exportTimeoutId = null;
    }
    
    // 标记导出是否已完成
    let exportCompleted = false;
    
    // 设置超时检测
    this._exportTimeoutId = setTimeout(() => {
      if (this.data.isLoading && !exportCompleted) {
        console.warn('导出超时，retryCount:', retryCount);
        exportCompleted = true;
        
        if (retryCount < MAX_RETRIES) {
          // 尝试重新加载并重试
          this.setData({ loadingText: '加载超时，正在重试...' });
          
          // 清除全局缓存，强制重新加载
          if (global.__pdfLibCache) {
            delete global.__pdfLibCache;
          }
          
          // 延迟后重试
          setTimeout(() => {
            this.exportWithTimeout(mode, retryCount + 1);
          }, 1000);
        } else {
          // 重试次数用尽，提示用户重启小程序
          this.setData({ isLoading: false });
          wx.showModal({
            title: '导出失败',
            content: '图片生成超时，建议：\n1. 返回重新进入导出页面\n2. 如仍失败，请关闭小程序后重新打开',
            confirmText: '返回重试',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                // 返回上一页
                wx.navigateBack();
              }
            }
          });
        }
      }
    }, TIMEOUT_MS);
    
    // 根据模式准备导出参数
    let exportOptions;
    if (mode === 'paged') {
      const orientationOverride = (this.data.exportLayoutMode === 'compact') ? 'landscape' : 'portrait';
      const isExportLandscape = (orientationOverride === 'landscape');
      
      // 根据排版模式重新计算每个模块的 measuresPerRow
      const exportNotations = this.data.notations.map(notation => {
        const portraitBase = notation.measuresPerRowPortrait || 
                             (this.data.orientation === 'landscape' ? Math.floor(notation.measuresPerRow / 2) : notation.measuresPerRow) || 
                             1;
        const exportMeasuresPerRow = isExportLandscape ? portraitBase * 2 : portraitBase;
        return {
          ...notation,
          measuresPerRow: exportMeasuresPerRow,
          measuresPerRowPortrait: portraitBase
        };
      });
      
      exportOptions = {
        notations: exportNotations,
        mainTitle: this.data.mainTitle,
        subTitle: this.data.subTitle,
        globalTempo: this.data.globalTempo,
        mainTitleColor: this.data.mainTitleColor,
        subTitleColor: this.data.subTitleColor,
        rightHandColor: this.data.rightHandColor,
        leftHandColor: this.data.leftHandColor,
        composer: this.data.composer,
        rootNote: this.data.rootNote,
        scaleType: this.data.scaleType,
        noteCount: this.data.noteCount,
        introduction: this.data.introduction,
        notationType: this.data.notationType,
        difficulty: this.data.difficulty,
        orientation: orientationOverride,
        exportMode: 'paged',
        a4Orientation: this.data.exportA4Orientation || 'portrait',
        exportLayoutMode: this.data.exportLayoutMode || 'compact',
        exportBgOpacity: this.data.exportBgOpacity,
        exportBgSize: this.data.exportBgSize,
        exportColorMode: this.data.exportColorMode,
        exportSingleColor: this.data.exportSingleColor,
        exportRightHandColor: this.data.exportRightHandColor,
        exportLeftHandColor: this.data.exportLeftHandColor,
        // 用户调整参数
        lineSpacingAdjust: this.data.lineSpacingAdjust,
        measureHeightAdjust: this.data.measureHeightAdjust,
        titleScaleAdjust: this.data.titleScaleAdjust
      };
    } else {
      // long 模式
      exportOptions = {
        notations: this.data.notations,
        mainTitle: this.data.mainTitle,
        subTitle: this.data.subTitle,
        globalTempo: this.data.globalTempo,
        mainTitleColor: this.data.mainTitleColor,
        subTitleColor: this.data.subTitleColor,
        rightHandColor: this.data.rightHandColor,
        leftHandColor: this.data.leftHandColor,
        composer: this.data.composer,
        rootNote: this.data.rootNote,
        scaleType: this.data.scaleType,
        noteCount: this.data.noteCount,
        introduction: this.data.introduction,
        notationType: this.data.notationType,
        difficulty: this.data.difficulty,
        orientation: this.data.orientation,
        measuresPerRow: this.data.measuresPerRow,
        exportMode: 'long',
        exportLayoutMode: this.data.exportLayoutMode || 'compact',
        exportBgOpacity: this.data.exportBgOpacity,
        exportBgSize: this.data.exportBgSize,
        exportColorMode: this.data.exportColorMode,
        exportSingleColor: this.data.exportSingleColor,
        exportRightHandColor: this.data.exportRightHandColor,
        exportLeftHandColor: this.data.exportLeftHandColor,
        // 用户调整参数
        lineSpacingAdjust: this.data.lineSpacingAdjust,
        measureHeightAdjust: this.data.measureHeightAdjust,
        titleScaleAdjust: this.data.titleScaleAdjust
      };
    }
    
    // 执行导出
    try {
      const exportUtil = require('../../utils/pdfExport.js');
      exportUtil.exportNotationToPNG(exportOptions).then(result => {
        if (exportCompleted) return; // 已经超时处理过了
        exportCompleted = true;
        
        // 清除超时定时器
        if (this._exportTimeoutId) {
          clearTimeout(this._exportTimeoutId);
          this._exportTimeoutId = null;
        }
        
        this.setData({ isLoading: false });
        
        if (mode === 'paged') {
          if (Array.isArray(result)) {
            this.setData({
              currentStep: 'preview',
              exportPreviewImages: result,
              currentPreviewPage: 0
            });
          } else {
            wx.showToast({ title: '导出失败：未能生成分页图片', icon: 'none' });
          }
        } else {
          // long 模式 - 也进入预览界面
          this.setData({
            currentStep: 'preview',
            exportPreviewImages: [result],  // 长图模式只有一张图片
            currentPreviewPage: 0
          });
        }
      }).catch(err => {
        if (exportCompleted) return; // 已经超时处理过了
        exportCompleted = true;
        
        // 清除超时定时器
        if (this._exportTimeoutId) {
          clearTimeout(this._exportTimeoutId);
          this._exportTimeoutId = null;
        }
        
        console.error('导出失败:', err);
        
        // 检查是否是可重试的错误
        const errMsg = err.message || String(err);
        const isRetryableError = errMsg.includes('not node js') || 
                                  errMsg.includes('file system') || 
                                  errMsg.includes('saaa_config') ||
                                  errMsg.includes('创建画布失败') ||
                                  errMsg.includes('图片加载超时');
        
        if (isRetryableError && retryCount < MAX_RETRIES) {
          // 清除全局缓存
          if (global.__pdfLibCache) {
            delete global.__pdfLibCache;
          }
          
          this.setData({ loadingText: '遇到错误，正在重试...' });
          setTimeout(() => {
            this.exportWithTimeout(mode, retryCount + 1);
          }, 1000);
          return;
        }
        
        this.setData({ isLoading: false });
        
        // 根据错误类型给出不同提示
        if (isRetryableError) {
          wx.showModal({
            title: '导出失败',
            content: '多次重试仍然失败，建议返回后重新进入导出页面，或重启小程序后再试。',
            confirmText: '返回重试',
            cancelText: '取消',
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack();
              }
            }
          });
        } else {
          wx.showToast({ title: '导出失败: ' + (err.message || err), icon: 'none', duration: 3000 });
        }
      });
    } catch (syncErr) {
      // 同步错误（如 require 失败）
      exportCompleted = true;
      if (this._exportTimeoutId) {
        clearTimeout(this._exportTimeoutId);
        this._exportTimeoutId = null;
      }
      
      console.error('导出模块加载失败:', syncErr);
      this.setData({ isLoading: false });
      
      wx.showModal({
        title: '导出失败',
        content: '导出模块加载异常，请重启小程序后再试。',
        confirmText: '我知道了',
        showCancel: false
      });
    }
  },

  // 提示保存图片
  promptSaveImage(tempFilePath) {
    wx.showModal({
      title: '导出成功',
      content: '图片已生成，是否保存到相册？',
      success: (res) => {
        if (res.confirm) {
          this.saveImageToAlbum(tempFilePath);
        } else {
          wx.showToast({ title: '可重新导出图片', icon: 'none' });
        }
      }
    });
  },

  // 检查相册权限
  checkAlbumPermission() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.writePhotosAlbum'] === false) {
            wx.showModal({
              title: '权限提示',
              content: '保存图片需要您的授权，是否去设置页面开启权限？',
              confirmText: '去设置',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.openSetting({
                    success: (settingRes) => {
                      if (settingRes.authSetting['scope.writePhotosAlbum']) {
                        resolve();
                      } else {
                        reject(new Error('AUTH_DENIED'));
                      }
                    },
                    fail: () => reject(new Error('OPEN_SETTING_FAILED'))
                  });
                } else {
                  reject(new Error('USER_CANCELLED'));
                }
              }
            });
          } else {
            resolve();
          }
        },
        fail: (err) => reject(err)
      });
    });
  },

  // 保存图片到相册
  saveImageToAlbum(filePath) {
    this.checkAlbumPermission().then(() => {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: () => {
          wx.showToast({ title: '已保存到相册', icon: 'success' });
        },
        fail: (err) => {
          if (err.errMsg.includes('auth') || err.errMsg.includes('authorize')) {
            wx.showToast({ title: '保存失败，请授权', icon: 'none' });
          } else {
            wx.showToast({ title: '保存失败', icon: 'none' });
          }
        }
      });
    }).catch(err => {
      if (err.message === 'AUTH_DENIED') {
        wx.showToast({ title: '未获得授权', icon: 'none' });
      }
    });
  },

  // 导出为代码
  exportAsCode() {
    try {
      const code = this.generateNotationCode();
      this.setData({
        exportedCode: code,
        currentStep: 'code'
      });
    } catch (err) {
      wx.showToast({
        title: '导出失败: ' + err.message,
        icon: 'none'
      });
    }
  },

  // 生成代码
  generateNotationCode() {
    const { notations } = this.data;
    return this.generateCodeForNotations(notations);
  },

  // 生成谱面代码（支持单个或多个module）
  generateCodeForNotations(notations) {
    if (!notations || notations.length === 0) {
      throw new Error('当前谱面为空');
    }

    let code = '';
    
    for (const notation of notations) {
      // 支持备注格式: \begin{module}{名称}{备注}{样式}
      const remarkPart = notation.remark ? `{${notation.remark}}` : '';
      const stylePart = this.generateStyleParam(notation);
      code += `\\begin{module}{${notation.label}}${remarkPart}${stylePart}\n`;
      
      // 根据模块确定每行小节数
      const measuresPerRow = this.getMeasuresPerRowForNotation(notation);
      const totalMeasures = notation.measures.length;
      
      for (let i = 0; i < totalMeasures; i += measuresPerRow) {
        const rowMeasures = notation.measures.slice(i, Math.min(i + measuresPerRow, totalMeasures));
        const lineCode = this.generateLineCode(rowMeasures);
        
        // 生成行内注记代码
        const annotationCode = this.generateLineAnnotationCode(rowMeasures);
        
        code += lineCode;
        if (annotationCode) {
          code += annotationCode;
        }
        
        // 如果不是最后一行，添加换行符
        if (i + measuresPerRow < totalMeasures) {
          code += '\\\\\n';
        } else {
          code += '\n';
        }
      }
      
      code += `\\end{module}\n\n`;
    }
    
    return code.trim();
  },

  // 生成样式参数字符串 {h:160,f:28,s:65}
  generateStyleParam(notation) {
    const style = notation.style || {};
    const defaultStyle = {
      measureHeight: 160,
      noteFontSize: 28,
      lineSpacing: 65
    };
    
    // 检查是否与默认值不同
    const hasCustomStyle = 
      (style.measureHeight && style.measureHeight !== defaultStyle.measureHeight) ||
      (style.noteFontSize && style.noteFontSize !== defaultStyle.noteFontSize) ||
      (style.lineSpacing && style.lineSpacing !== defaultStyle.lineSpacing);
    
    if (!hasCustomStyle) {
      return '';
    }
    
    const parts = [];
    if (style.measureHeight && style.measureHeight !== defaultStyle.measureHeight) {
      parts.push(`h:${style.measureHeight}`);
    }
    if (style.noteFontSize && style.noteFontSize !== defaultStyle.noteFontSize) {
      parts.push(`f:${style.noteFontSize}`);
    }
    if (style.lineSpacing && style.lineSpacing !== defaultStyle.lineSpacing) {
      parts.push(`s:${style.lineSpacing}`);
    }
    
    return parts.length > 0 ? `{${parts.join(',')}}` : '';
  },

  // 生成行内注记代码 /*"1:注记文字","5:另一个注记"*/
  generateLineAnnotationCode(measures) {
    const annotations = [];
    let globalIndex = 1;
    
    for (const measure of measures) {
      for (const beat of measure.beats) {
        for (const subdivision of beat.subdivisions) {
          if (subdivision.annotation) {
            annotations.push(`"${globalIndex}:${subdivision.annotation}"`);
          }
          globalIndex++;
        }
      }
    }
    
    return annotations.length > 0 ? `/*${annotations.join(',')}*/` : '';
  },

  // 获取每行小节数
  getMeasuresPerRowForNotation(notation) {
    return notation.measuresPerRowPortrait || notation.measuresPerRow || 1;
  },

  // 生成一行的代码（包含一个或多个小节）
  generateLineCode(measures) {
    let lineCode = '';
    
    for (let i = 0; i < measures.length; i++) {
      const measure = measures[i];
      lineCode += this.generateMeasureCode(measure);
      
      // 如果不是最后一个小节，添加小节间连接
      if (i < measures.length - 1) {
        lineCode += ' ';
      }
    }
    
    return lineCode;
  },

  // 生成单个小节的代码
  generateMeasureCode(measure) {
    let code = '[';
    
    for (let i = 0; i < measure.beats.length; i++) {
      const beat = measure.beats[i];
      code += this.generateBeatCode(beat);
      
      // 如果不是最后一拍，添加拍号线
      if (i < measure.beats.length - 1) {
        // 检查是否有小节线（自定义拍号中的分组）
        if (beat.barLineAfter) {
          code += '][';
        } else {
          code += '|';
        }
      }
    }
    
    code += ']';
    return code;
  },

  // 生成单拍的代码
  generateBeatCode(beat) {
    let code = '';
    
    for (let i = 0; i < beat.subdivisions.length; i++) {
      const subdivision = beat.subdivisions[i];
      code += this.generateSubdivisionCode(subdivision);
      
      // 如果不是最后一个细分，添加分隔符
      if (i < beat.subdivisions.length - 1) {
        code += '+';
      }
    }
    
    return code;
  },

  // 生成单个subdivision的代码
  generateSubdivisionCode(subdivision) {
    const rightHand = subdivision.rightHand || ['', ''];
    const leftHand = subdivision.leftHand || ['', ''];
    
    // 检查是否为空音符
    const hasAnyNote = rightHand[0] || rightHand[1] || leftHand[0] || leftHand[1];
    if (!hasAnyNote) {
      return '-';
    }
    
    // 生成右手和左手字符串（自动为特殊音符添加包裹）
    const rightStr = this.generateHandCode(rightHand, 'right');
    const leftStr = this.generateHandCode(leftHand, 'left');
    
    return `(${rightStr})/(${leftStr})`;
  },

  // 检查音符是否需要用<>包裹（包含特殊修饰符 ' , ^ _）
  needsNoteBracket(note) {
    if (!note || note.length === 0) return false;
    // 检查是否包含特殊修饰符
    return /['',^_]/.test(note) || note.length > 1;
  },

  // 为需要的音符添加<>包裹
  wrapNoteIfNeeded(note) {
    if (!note || note.length === 0) return note;
    if (this.needsNoteBracket(note)) {
      // 如果已经被包裹，则不重复包裹
      if ((note.startsWith('<') && note.endsWith('>')) || 
          (note.startsWith('{') && note.endsWith('}'))) {
        return note;
      }
      return `<${note}>`;
    }
    return note;
  },

  // 生成单手的代码
  generateHandCode(hand, handType) {
    const note0 = hand[0] || '';
    const note1 = hand[1] || '';
    
    if (!note0 && !note1) {
      return '';
    }
    
    // 为包含特殊修饰符的音符添加<>包裹
    const wrappedNote0 = this.wrapNoteIfNeeded(note0);
    const wrappedNote1 = this.wrapNoteIfNeeded(note1);
    
    if (wrappedNote0 && wrappedNote1) {
      // 两个音符都存在
      return `${wrappedNote0},${wrappedNote1}`;
    }
    
    // 只有一个音符
    if (handType === 'right') {
      // 右手：如果只有note1（靠近中轴），直接返回
      // 如果只有note0（远离中轴），返回
      if (wrappedNote1) {
        return wrappedNote1;
      } else {
        return wrappedNote0;
      }
    } else {
      // 左手：如果只有note0（靠近中轴），直接返回
      // 如果只有note1（远离中轴），返回
      if (wrappedNote0) {
        return wrappedNote0;
      } else {
        return wrappedNote1;
      }
    }
  },

  // 复制代码
  copyExportedCode() {
    wx.setClipboardData({
      data: this.data.exportedCode,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // 预览页面切换
  onPreviewPageChange(e) {
    this.setData({ currentPreviewPage: e.detail.current });
  },

  // 点击页码指示器跳转
  goToPreviewPage(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentPreviewPage: index });
  },

  // 关闭预览
  closeExportPreview() {
    this.setData({
      currentStep: 'specs',
      exportPreviewImages: [],
      currentPreviewPage: 0
    });
  },

  // 保存为图片
  saveAsImages() {
    const images = this.data.exportPreviewImages;
    let savedCount = 0;
    
    this.checkAlbumPermission().then(() => {
      wx.showLoading({ title: `保存中 0/${images.length}` });
      
      const saveNext = (index) => {
        if (index >= images.length) {
          wx.hideLoading();
          wx.showToast({ 
            title: `已保存${savedCount}张图片`, 
            icon: 'success',
            duration: 2000
          });
          return;
        }
        
        wx.saveImageToPhotosAlbum({
          filePath: images[index],
          success: () => {
            savedCount++;
            wx.showLoading({ title: `保存中 ${savedCount}/${images.length}` });
            saveNext(index + 1);
          },
          fail: (err) => {
            wx.hideLoading();
            if (err.errMsg.includes('auth') || err.errMsg.includes('authorize')) {
              wx.showModal({
                title: '保存失败',
                content: '需要保存相册权限才能导出图片',
                showCancel: false
              });
            } else {
              wx.showModal({
                title: '保存失败',
                content: `已保存${savedCount}/${images.length}张图片`,
                showCancel: false
              });
            }
          }
        });
      };
      
      saveNext(0);
    }).catch((err) => {
      if (err.message !== 'USER_CANCELLED' && err.message !== 'AUTH_DENIED') {
        wx.showToast({ title: '保存遇到错误', icon: 'none' });
      } else if (err.message === 'AUTH_DENIED') {
        wx.showToast({ title: '未获得授权，无法保存', icon: 'none' });
      }
    });
  },

  // 保存为PDF
  saveAsPDF() {
    const images = this.data.exportPreviewImages;
    if (!images || images.length === 0) {
      wx.showToast({ title: '没有可导出的图片', icon: 'none' });
      return;
    }
    
    this.setData({
      showPdfProgressModal: true,
      pdfProgressPercent: 0,
      pdfProgressStage: '准备导出...',
      pdfExportCancelled: false
    });
    
    const exportUtil = require('../../utils/pdfExport.js');
    const fileName = `${this.data.mainTitle || 'notation'}_${Date.now()}.pdf`;
    const that = this;
    
    const onProgress = (percent, stage) => {
      if (that.data.pdfExportCancelled) {
        return false;
      }
      that.setData({
        pdfProgressPercent: percent,
        pdfProgressStage: stage
      });
      return true;
    };
    
    exportUtil.imagesToPDF(images, fileName, onProgress)
      .then((pdfPath) => {
        that.setData({
          showPdfProgressModal: false,
          exportedPdfPath: pdfPath,
          exportedPdfFileName: fileName,
          showPdfSuccessModal: true
        });
      })
      .catch((err) => {
        that.setData({ showPdfProgressModal: false });
        if (err.message === 'USER_CANCELLED') {
          wx.showToast({ title: '已取消导出', icon: 'none' });
        } else {
          console.error('PDF导出失败:', err);
          wx.showToast({ 
            title: 'PDF导出失败: ' + (err.message || '未知错误'), 
            icon: 'none',
            duration: 3000
          });
        }
      });
  },

  // 取消PDF导出
  cancelPdfExport() {
    this.setData({
      pdfExportCancelled: true,
      pdfProgressStage: '正在取消...'
    });
  },

  // 关闭PDF成功弹窗
  closePdfSuccessModal() {
    this.setData({ showPdfSuccessModal: false });
  },

  // 打开导出的PDF
  openExportedPdf() {
    const path = this.data.exportedPdfPath;
    if (!path) {
      wx.showToast({ title: '文件路径无效', icon: 'none' });
      return;
    }
    
    wx.openDocument({
      filePath: path,
      showMenu: true,
      success: () => {
        console.log('PDF打开成功');
      },
      fail: (err) => {
        console.error('打开PDF失败:', err);
        wx.showToast({ title: '打开失败', icon: 'none' });
      }
    });
  },

  // 分享PDF并删除
  shareAndDeletePdf() {
    const filePath = this.data.exportedPdfPath;
    const fileName = this.data.exportedPdfFileName;
    
    if (!filePath) {
      wx.showToast({ title: '文件路径无效', icon: 'none' });
      return;
    }
    
    if (typeof wx.shareFileMessage !== 'function') {
      wx.showToast({ 
        title: '当前环境不支持文件分享功能', 
        icon: 'none',
        duration: 2000
      });
      return;
    }
    
    wx.shareFileMessage({
      filePath: filePath,
      fileName: fileName,
      success: () => {
        wx.showToast({ 
          title: '请在聊天中完成发送', 
          icon: 'none',
          duration: 3000
        });
      },
      fail: (err) => {
        const errMsg = err.errMsg || '';
        if (errMsg.includes('cancel') || errMsg.includes('取消')) {
          wx.showToast({ 
            title: '已取消分享', 
            icon: 'none',
            duration: 1500
          });
        } else {
          wx.showToast({ 
            title: '分享失败: ' + (errMsg || '未知错误'), 
            icon: 'none',
            duration: 2000
          });
        }
      }
    });
  },

  // 完成并返回
  closePdfSuccessAndFinish() {
    // 删除临时PDF文件
    const pdfPath = this.data.exportedPdfPath;
    if (pdfPath) {
      const fs = wx.getFileSystemManager();
      fs.unlink({
        filePath: pdfPath,
        success: () => {
          console.log('临时PDF文件已删除:', pdfPath);
        },
        fail: (err) => {
          console.log('临时PDF文件删除失败（可能已被移动或不存在）:', err);
        }
      });
    }
    
    // 同时清理预览图片临时文件
    const previewImages = this.data.exportPreviewImages;
    if (previewImages && previewImages.length > 0) {
      const fs = wx.getFileSystemManager();
      previewImages.forEach(imgPath => {
        if (imgPath && imgPath.startsWith(wx.env.USER_DATA_PATH)) {
          fs.unlink({
            filePath: imgPath,
            success: () => console.log('预览图片已删除:', imgPath),
            fail: () => {} // 忽略删除失败
          });
        }
      });
    }
    
    this.setData({ 
      showPdfSuccessModal: false,
      exportPreviewImages: [],
      currentPreviewPage: 0,
      exportedPdfPath: '',
      exportedPdfFileName: ''
    });
    wx.navigateBack();
  },

  // 阻止事件冒泡
  stopPropagation() {}
});
