# GitHub Raw 链接转换器

这是一个简单而强大的工具，可以将 GitHub 仓库中的文件链接转换为 raw.githubusercontent.com 的直接下载链接。该工具支持在 Cloudflare Workers 或 Vercel 平台上部署。

## 功能特点

- 将 GitHub 仓库文件链接转换为 raw.githubusercontent.com 链接
- 响应式设计，支持桌面和移动端
- 暗色/亮色主题切换
- 一键复制生成的 Raw 链接
- 直接在新标签页中预览内容
- 直接下载文件功能
- 简洁现代的用户界面

## 代码结构

### Cloudflare Workers 版本

```
github-raw-converter/
├── index.js          # 主要Worker代码（包含后端逻辑和嵌入式前端HTML）
└── wrangler.toml     # Cloudflare Workers 配置文件
```

**index.js**: 这个文件包含了整个应用的逻辑，包括：
- 处理 HTTP 请求的事件监听器
- API 端点处理 URL 转换
- 静态 HTML/CSS/JavaScript 前端代码

**wrangler.toml**: 这是 Cloudflare Workers 的配置文件，定义了项目设置和路由规则。

### Vercel 版本

```
github-raw-converter/
├── api/
│   └── convert.js    # API 端点，处理 URL 转换逻辑
├── public/
│   └── index.html    # 前端 HTML 页面
└── vercel.json       # Vercel 配置文件
```

**api/convert.js**: 单独的 API 端点，处理 GitHub URL 到 Raw URL 的转换。

**public/index.html**: 包含前端界面的 HTML、CSS 和 JavaScript 代码。

**vercel.json**: Vercel 的配置文件，定义路由和部署规则。

## 部署指南

### 在 Cloudflare Workers 上部署

1. **安装 Wrangler CLI**

```bash
npm install -g wrangler
```

2. **登录到 Cloudflare**

```bash
wrangler login
```

3. **创建项目目录**

```bash
mkdir github-raw-converter
cd github-raw-converter
```

4. **创建项目文件**

创建 `index.js` 和 `wrangler.toml` 文件，并粘贴相应的代码。

5. **自定义 wrangler.toml 配置**

打开 `wrangler.toml` 文件，根据需要更新 `name` 和 `routes` 设置。

6. **发布项目**

```bash
wrangler publish
```

7. **访问你的应用**

部署完成后，你可以通过 `https://<你的项目名>.workers.dev` 访问你的应用。

### 在 Vercel 上部署

1. **安装 Vercel CLI** (可选)

```bash
npm install -g vercel
```

2. **创建项目目录**

```bash
mkdir github-raw-converter
cd github-raw-converter
```

3. **创建项目文件结构**

按照上面的目录结构创建相应的文件夹和文件：
- 创建 `api` 文件夹并添加 `convert.js` 文件
- 创建 `public` 文件夹并添加 `index.html` 文件
- 创建 `vercel.json` 配置文件

4. **部署到 Vercel**

使用 Vercel CLI：

```bash
vercel
```

或者，你可以将代码推送到 GitHub 仓库，然后在 Vercel 控制台导入该仓库进行部署。

5. **通过 GitHub 部署**

- 将代码推送到 GitHub 仓库
- 登录到 [Vercel](https://vercel.com)
- 点击 "New Project"
- 选择你的 GitHub 仓库
- 点击 "Deploy"

## 使用方法

1. 复制 GitHub 仓库中任何文件的 URL 链接
2. 粘贴到应用的输入框中
3. 点击"转换"按钮生成 raw.githubusercontent.com 链接
4. 使用"复制"按钮复制生成的链接
5. 或使用"在新标签页中打开"按钮预览内容
6. 或使用"下载文件"按钮直接下载文件

## 自定义

### 更改主题颜色

要更改界面的主题颜色，可以修改 HTML 文件中的 `.animate-gradient` 类：

```css
.animate-gradient {
  background: linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899);
  background-size: 200% 200%;
  animation: gradient 5s ease infinite;
}
```

### 添加自定义域名

#### Cloudflare Workers

1. 在 Cloudflare 控制台添加你的域名
2. 更新 `wrangler.toml` 中的域名设置
3. 重新部署应用

#### Vercel

1. 在 Vercel 项目设置中添加自定义域名
2. 按照 Vercel 的说明设置 DNS 记录
3. 等待 DNS 更改生效

## 技术栈

- **前端**: HTML, CSS (Tailwind CSS), JavaScript
- **后端**: 
  - Cloudflare Workers (JavaScript)
  - 或 Vercel Serverless Functions (Node.js)

## 许可证

MIT

## 作者

m2kall

## 贡献

欢迎提交 Issues 和 Pull Requests！

## 常见问题

**Q: 为什么需要转换 GitHub 链接？**  
A: GitHub 网页链接指向的是带有 UI 的网页视图，而 raw.githubusercontent.com 链接指向的是文件的原始内容，适合用于下载、引用或嵌入到其他项目中。

**Q: 这个工具能处理私有仓库吗？**  
A: 不能。此工具只能处理公开的 GitHub 仓库文件。转换后的 raw 链接仍然需要相应的访问权限。

**Q: 我可以转换整个目录吗？**  
A: 不可以。此工具只能转换单个文件的链接，不支持目录链接转换。