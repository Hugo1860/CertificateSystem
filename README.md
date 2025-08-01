# 电子证书管理系统

<div align="center">
  <img src="images/logo.png" alt="系统LOGO" width="120" height="120">
  
  [![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/express-4.21.1-orange.svg)](https://expressjs.com/)
</div>

## 📋 项目简介

电子证书管理系统是一个现代化的证书制作和管理平台，为教育机构、培训中心等提供专业的电子证书解决方案。系统支持多种证书模板样式，证书上的所有元素都可以自定义编辑，极大地扩展了适用范围。

## ✨ 主要特性

### 🎨 证书设计
- **多种模板样式**：提供多种专业证书模板供选择
- **可视化编辑**：所见即所得的证书预览效果
- **自定义元素**：支持自定义证书名称、课程内容、机构信息等
- **灵活排版**：支持字体大小调整和边框颜色自定义
- **高清导出**：基于HTML5 Canvas技术生成高质量证书图片

### 📊 批量管理
- **批量生成**：支持一次性为多个学员生成证书
- **智能编号**：自动生成唯一证书编号
- **批量下载**：支持打包下载所有生成的证书

### 🔍 记录管理
- **生成记录**：完整记录所有证书生成历史
- **智能搜索**：支持按姓名、证书编号、课程内容等多维度搜索
- **数据导出**：支持搜索结果的批量下载

### 📱 移动端支持
- **移动查询**：专门的移动端证书查询界面
- **响应式设计**：完美适配各种屏幕尺寸
- **便捷访问**：随时随地查询证书信息

## 🚀 快速开始

### 环境要求
- Node.js >= 14.0.0
- npm 或 yarn 包管理器
- 现代浏览器（支持ES6+）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd CertificateSystem
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动服务**
   ```bash
   npm start
   ```

4. **访问系统**
   在浏览器中打开 `http://localhost:3000`

## 📚 使用指南

### 证书制作流程

1. **信息录入**
   - 在左侧表单区域填写证书信息
   - 支持批量输入学员姓名（每行一个）
   - 填写证书名称、课程名称等基本信息

2. **预览调整**
   - 实时预览证书效果
   - 调整字体大小和边框颜色
   - 确认证书内容无误

3. **批量生成**
   - 点击"生成证书"按钮
   - 系统自动为每个学员生成独立证书
   - 证书将保存到 `images/Storage/` 目录

4. **下载管理**
   - 支持单个证书下载
   - 支持批量打包下载
   - 可通过记录管理界面统一管理

### 页面功能

| 页面 | 功能描述 | 访问路径 |
|------|----------|----------|
| 主页面 | 证书制作和编辑 | `/certificate.html` |
| 记录管理 | 查看和管理生成记录 | `/record.html` |
| 移动查询 | 移动端证书查询 | `/mobile-query.html` |

## 🗂️ 项目结构

```
CertificateSystem/
├── certificate.html          # 主要证书编辑页面
├── record.html              # 记录管理页面
├── mobile-query.html        # 移动端查询页面
├── script.js               # 主要业务逻辑
├── record.js               # 记录管理脚本
├── mobile-query.js         # 移动端查询脚本
├── server.js               # Express服务器
├── styles.css              # 主要样式表
├── record.css              # 记录页面样式
├── package.json            # 项目配置
├── images/                 # 图片资源目录
│   ├── logo.png           # 系统LOGO
│   └── Storage/           # 证书存储目录
└── README.md              # 项目文档
```

## 🔧 配置说明

### 服务器配置
系统使用Express框架提供Web服务，默认端口为3000。可以通过修改 `server.js` 文件调整配置：

```javascript
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`服务器运行在端口 ${port}`);
});
```

### 证书模板自定义
证书样式通过CSS定制，主要样式文件为 `styles.css`。可以修改以下类来自定义证书外观：

- `.certificate`: 证书主容器
- `.student-name`: 学员姓名样式
- `.cn-title`: 证书标题样式
- `.course-name`: 课程名称样式

## 🛠️ 技术栈

- **前端技术**
  - HTML5 / CSS3
  - Vanilla JavaScript (ES6+)
  - Material Icons
  - HTML2Canvas (证书生成)

- **后端技术**
  - Node.js
  - Express.js

- **存储方案**
  - 本地文件系统
  - LocalStorage (用户设置)

## 📋 待开发功能

- [ ] 数据库集成（MySQL/MongoDB）
- [ ] 用户权限管理
- [ ] 更多证书模板
- [ ] 证书数字签名
- [ ] API接口开发
- [ ] 单元测试覆盖

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 更新日志

### v1.0.0 (2025-01-xx)
- 🎉 项目初始版本发布
- ✅ 基础证书制作功能
- ✅ 批量生成和下载
- ✅ 记录管理系统
- ✅ 移动端支持

## 📞 联系方式

如有问题或建议，请通过以下方式联系：

- 项目Issues: [GitHub Issues](https://github.com/your-repo/issues)
- 邮箱: your-email@example.com

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

<div align="center">
  <p>💝 如果这个项目对您有帮助，请考虑给个 Star ⭐</p>
  <p>Made with ❤️ by Certificate System Team</p>
</div>