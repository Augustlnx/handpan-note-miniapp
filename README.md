# Handpan Note 微信小程序

一个专为手碟演奏爱好者设计的记谱、编谱工具小程序。

## 项目特性

- ✨ **简约界面设计** - 采用专业配色方案，界面清爽美观
- 🎵 **可视化记谱** - 参考 Malte Marten Method 的记谱方式
- 🎼 **实时编辑** - 点击即可编辑谱面信息和音符
- 🥁 **内置节拍器** - 可调节速度和拍号的专业节拍器
- 🎨 **主题自定义** - 支持自定义UI配色，多套预设主题
- 💾 **本地存储** - 谱面数据自动保存到本地

## 配色方案

默认主题采用以下配色：
- 主色调 (Primary): `#314D63` - 深青蓝色
- 辅助色 (Secondary): `#B2E8E8` - 浅青色
- 第三色 (Tertiary): `#8FB9AB` - 灰绿色
- 强调色 (Accent): `#F4D096` - 金黄色

## 项目结构

```
handpan-note-miniapp/
├── pages/                    # 页面文件
│   ├── notation/            # 记谱页面
│   │   ├── notation.wxml    # 页面结构
│   │   ├── notation.wxss    # 页面样式
│   │   ├── notation.js      # 页面逻辑
│   │   └── notation.json    # 页面配置
│   ├── metronome/           # 节拍器页面
│   │   ├── metronome.wxml
│   │   ├── metronome.wxss
│   │   ├── metronome.js
│   │   └── metronome.json
│   └── settings/            # 设置页面
│       ├── settings.wxml
│       ├── settings.wxss
│       ├── settings.js
│       └── settings.json
├── utils/                    # 工具函数
│   └── pdfExport.js         # PDF导出工具
├── assets/                   # 静态资源
│   └── icons/               # 图标文件夹
├── app.js                   # 小程序逻辑
├── app.json                 # 小程序配置
├── app.wxss                 # 全局样式
├── sitemap.json            # 搜索配置
└── project.config.json     # 项目配置

```



## 许可证

MIT License

## 作者

Handpan Note Team

---

**祝您使用愉快！如有问题请提Issue反馈。** 🎵
