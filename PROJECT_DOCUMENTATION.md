# Handpan Note 项目文档

## 项目概述

Handpan Note 是一款专为手碟演奏爱好者设计的微信小程序，提供记谱、节拍器和主题自定义功能。

## 技术架构

### 前端技术栈
- **框架**: 微信小程序原生框架
- **语言**: JavaScript (ES6+)
- **样式**: WXSS (微信样式表)
- **结构**: WXML (微信标记语言)

### 数据存储
- **本地存储**: wx.Storage API
- **数据结构**:
  ```javascript
  {
    notations: [
      {
        id: Number,           // 谱面唯一标识
        label: String,        // 谱面标签（如 A-1）
        tempo: Number,        // 速度（BPM）
        measures: [           // 小节数组
          {
            beats: [          // 拍子数组
              {
                rightHand: String,  // 右手音符
                leftHand: String    // 左手音符
              }
            ]
          }
        ]
      }
    ],
    theme: {
      primary: String,      // 主色调
      secondary: String,    // 辅助色
      tertiary: String,     // 第三色
      accent: String        // 强调色
    }
  }
  ```

## 页面结构

### 1. 记谱页面 (pages/notation/)

**功能**:
- 显示多个谱面
- 编辑谱面信息（标识、速度）
- 编辑音符（左手/右手）
- 添加新谱面
- 导出PDF（待实现）

**核心组件**:
- 谱面列表（scroll-view）
- 小节容器（measure）
- 音符格子（note-box）
- 编辑弹窗（modal）

**交互逻辑**:
1. 点击标识/速度 → 弹出编辑框
2. 点击音符格 → 输入/修改音符
3. 数据变更 → 自动保存到 Storage

### 2. 节拍器页面 (pages/metronome/)

**功能**:
- 调节速度（20-300 BPM）
- 设置拍号（x/y 格式）
- 开始/停止节拍器
- 视觉节拍指示
- 音量控制

**核心技术**:
- `setInterval` 控制节拍间隔
- `wx.vibrateShort` 震动反馈
- 动态计算节拍周期：`interval = 60000 / BPM`

**节拍器实现原理**:
```javascript
// 计算每拍间隔（毫秒）
const interval = 60000 / tempo;

// 定时器触发节拍
setInterval(() => {
  // 更新当前拍
  // 播放节拍音/震动
  // 更新视觉指示器
}, interval);
```

### 3. 设置页面 (pages/settings/)

**功能**:
- 自定义4种主题颜色
- 5套预设主题
- 保存主题配置
- 恢复默认主题

**颜色管理**:
- 实时预览颜色变化
- 颜色格式验证（HEX）
- 全局主题应用

## 核心功能实现

### 数据持久化

**保存数据**:
```javascript
// 在 app.js 中
saveNotations(notations) {
  this.globalData.notations = notations;
  wx.setStorageSync('notations', notations);
}

saveTheme(theme) {
  this.globalData.theme = theme;
  wx.setStorageSync('theme', theme);
}
```

**读取数据**:
```javascript
// 在页面 onLoad 中
const notations = getApp().globalData.notations;
const theme = getApp().globalData.theme;
```

### 谱面编辑

**编辑流程**:
1. 用户点击可编辑元素
2. 保存当前编辑上下文（`currentEdit`）
3. 显示编辑弹窗
4. 用户输入新值
5. 确认后更新数据结构
6. 保存到 Storage
7. 更新界面显示

**关键代码**:
```javascript
// 编辑音符
editNote(e) {
  const { sheet, measure, beat, hand } = e.currentTarget.dataset;
  // 保存编辑上下文
  this.setData({
    currentEdit: { type: 'note', sheet, measure, beat, hand }
  });
  // 显示弹窗
}

// 确认编辑
confirmEdit() {
  const { currentEdit, editValue } = this.data;
  // 根据 currentEdit 更新对应数据
  // 保存到 Storage
}
```

### 节拍器计时精度

**挑战**: JavaScript `setInterval` 不够精确

**解决方案**:
1. 使用 `setInterval` 作为基础定时器
2. 短间隔（大约 100ms）检查
3. 计算实际应该触发的时间
4. 动态调整下一次触发

**改进版实现**（可选）:
```javascript
let startTime = Date.now();
let beatCount = 0;
const interval = 60000 / tempo;

function checkBeat() {
  const now = Date.now();
  const shouldBe = startTime + beatCount * interval;
  
  if (now >= shouldBe) {
    // 触发节拍
    beatCount++;
  }
  
  setTimeout(checkBeat, 10); // 10ms 检查一次
}
```

### 主题系统

**全局主题管理**:
- 主题数据存储在 `app.globalData.theme`
- 页面通过 `getApp().globalData.theme` 访问
- 修改主题后需要 `wx.reLaunch` 重新加载应用

**动态样式应用**（未实现，可扩展）:
```javascript
// 在 .wxml 中使用动态样式
<view style="color: {{theme.primary}}">文本</view>
<view style="background-color: {{theme.secondary}}">背景</view>
```

## 性能优化建议

### 1. 避免频繁 setData

**问题**: setData 是异步的，频繁调用会影响性能

**解决**:
```javascript
// ❌ 不好的做法
for (let i = 0; i < 100; i++) {
  this.setData({ [`items[${i}]`]: data });
}

// ✅ 好的做法
const updates = {};
for (let i = 0; i < 100; i++) {
  updates[`items[${i}]`] = data;
}
this.setData(updates);
```

### 2. 减少 setData 数据量

**问题**: 传输大量数据会造成延迟

**解决**:
```javascript
// ❌ 不好的做法
this.setData({
  notations: this.data.notations  // 整个数组
});

// ✅ 好的做法
this.setData({
  [`notations[${index}].tempo`]: newTempo  // 只更新变化的部分
});
```

### 3. 图片资源优化

- 使用合适尺寸的图片
- 图标建议使用 PNG 格式
- 压缩图片大小（<40KB）

### 4. 列表渲染优化

```xml
<!-- 使用 wx:key 提升性能 -->
<view wx:for="{{items}}" wx:key="id">
  {{item.name}}
</view>
```

## 待优化项

### 功能增强
1. **PDF 导出**: 需要云函数或后端 API
2. **音频播放**: 播放谱面音符
3. **谱面分享**: 生成分享图片或链接
4. **云端存储**: 防止数据丢失
5. **更多音符符号**: 支持滑音、装饰音等

### 用户体验
1. 添加加载动画
2. 错误提示优化
3. 手势操作支持（长按删除等）
4. 谱面预览模式
5. 深色模式支持

### 技术优化
1. 组件化拆分
2. 使用 WXS 提升性能
3. 分包加载
4. 骨架屏优化
5. 错误日志上报

## API 文档

### app.js 全局方法

#### saveNotations(notations)
保存谱面数据到本地存储

**参数**:
- `notations` (Array): 谱面数据数组

**返回**: void

#### saveTheme(theme)
保存主题配置到本地存储

**参数**:
- `theme` (Object): 主题配置对象
  - `primary` (String): 主色调
  - `secondary` (String): 辅助色
  - `tertiary` (String): 第三色
  - `accent` (String): 强调色

**返回**: void

### utils/pdfExport.js

#### exportNotationToPDF(notations)
导出谱面为 PDF（需要服务端支持）

**参数**:
- `notations` (Array): 谱面数据数组

**返回**: Promise

## 测试用例

### 记谱功能测试
1. ✅ 添加新谱面
2. ✅ 编辑谱面标识
3. ✅ 编辑速度
4. ✅ 编辑音符（左手/右手）
5. ✅ 数据持久化
6. ⏳ 删除谱面（待实现）
7. ⏳ 谱面排序（待实现）

### 节拍器测试
1. ✅ 速度调节（+/-/输入）
2. ✅ 拍号设置
3. ✅ 开始/停止
4. ✅ 视觉指示
5. ✅ 震动反馈
6. ✅ 音量控制

### 设置测试
1. ✅ 颜色自定义
2. ✅ 预设主题
3. ✅ 保存主题
4. ✅ 恢复默认
5. ✅ 主题持久化

## 故障排查

### 问题诊断流程
1. 查看控制台错误信息
2. 检查 Storage 中的数据
3. 验证数据结构是否正确
4. 清除缓存重新测试
5. 检查代码逻辑

### 常见错误码

| 错误 | 原因 | 解决方法 |
|------|------|---------|
| `thirdScriptError` | JS 运行时错误 | 检查代码语法 |
| `setData error` | 数据格式错误 | 检查 setData 参数 |
| `request:fail` | 网络请求失败 | 检查网络权限 |

## 版本历史

### v1.0.0 (当前版本)
- ✅ 记谱功能
- ✅ 节拍器功能
- ✅ 主题自定义
- ✅ 本地存储
- ⏳ PDF 导出（待实现）

### 未来计划 (v1.1.0)
- 音频播放
- 谱面分享
- 云端同步
- 更多音符符号

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程
1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 发起 Pull Request

### 代码规范
- 使用 2 空格缩进
- 变量使用驼峰命名
- 函数添加注释
- 保持代码简洁

## 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 GitHub Issue
- 邮件联系开发团队

---

**感谢使用 Handpan Note！** 🎵
