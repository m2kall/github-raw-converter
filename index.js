addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    // 添加基本的CORS头，如果需要的话
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
    
    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }
    
    const url = new URL(request.url)
    
    // 如果是API请求，处理GitHub URL转换
    if (url.pathname.startsWith('/api/convert')) {
      return handleApiRequest(request, corsHeaders)
    }
    
    // 否则返回HTML页面
    return new Response(HTML, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    })
  }
  
  async function handleApiRequest(request, corsHeaders = {}) {
    try {
      const url = new URL(request.url)
      const githubUrl = url.searchParams.get('url')
      
      if (!githubUrl) {
        return new Response(JSON.stringify({ error: '请提供GitHub URL' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
      
      const rawUrl = convertToRawUrl(githubUrl)
      
      // 可选：验证生成的raw链接是否可访问
      // 这会增加延迟，但可以确保链接有效
      // const checkResponse = await fetch(rawUrl, { method: 'HEAD' })
      // if (!checkResponse.ok) {
      //   throw new Error('无法访问该文件，请确保文件存在且可公开访问')
      // }
      
      return new Response(JSON.stringify({ rawUrl }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
  }
  
    
  function convertToRawUrl(githubUrl) {
    // 验证URL是否为GitHub URL
    if (!githubUrl.includes('github.com')) {
      throw new Error('无效的GitHub URL')
    }
    
    try {
      // 尝试解析URL以确保它是有效的
      const url = new URL(githubUrl)
      
      // 确保是github.com域名
      if (!url.hostname.endsWith('github.com')) {
        throw new Error('无效的GitHub URL')
      }
      
      // 检查URL路径格式是否符合GitHub仓库文件路径
      const pathParts = url.pathname.split('/')
      if (pathParts.length < 5 || !pathParts.includes('blob')) {
        throw new Error('无效的GitHub文件URL，请确保链接指向仓库中的文件')
      }
      
      // 替换域名和移除blob部分
      const rawUrl = githubUrl
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/')
      
      return rawUrl
    } catch (error) {
      if (error.message.includes('无效的GitHub')) {
        throw error
      }
      throw new Error('无效的URL格式')
    }
  }
  
  // HTML前端页面
  const HTML = `<!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Raw链接转换器</title>
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+CiAgPCEtLSDlnIblvaLog4zmma8gLS0+CiAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiIGZpbGw9IiMyNDI5MmUiIC8+CiAgCiAgPCEtLSBHaXRIdWIg5a6Y5pa55a2Q5Zu+5qCH566A5YyW54mIIC0tPgogIDxwYXRoIGQ9Ik01MCAyNUMzNi4yIDI1IDI1IDM2LjIgMjUgNTBjMCAxMSA3LjIgMjAuNCAxNy4xIDIzLjdjMS4zIDAuMiAxLjctMC41IDEuNy0xLjJjMC0wLjYgMC0yLjEgMC00LjFjLTcgMS41LTguNC0zLjQtOC40LTMuNGMtMS4xLTIuOS0yLjgtMy43LTIuOC0zLjdjLTIuMy0xLjYgMC4yLTEuNSAwLjItMS41YzIuNSAwLjIgMy44IDIuNiAzLjggMi42YzIuMiAzLjggNS45IDIuNyA3LjMgMi4xYzAuMi0xLjYgMC45LTIuNyAxLjYtMy4zYy01LjYtMC42LTExLjQtMi44LTExLjQtMTIuNGMwLTIuNyAxLTUgMi42LTYuN2MtMC4zLTAuNi0xLjEtMy4xIDAuMi02LjVjMCAwIDIuMS0wLjcgNi45IDIuNmMyLTAuNiA0LjEtMC44IDYuMy0wLjhjMi4xIDAgNC4zIDAuMyA2LjMgMC44YzQuOC0zLjIgNi45LTIuNiA2LjktMi42YzEuNCAzLjQgMC41IDUuOSAwLjIgNi41YzEuNiAxLjcgMi42IDQgMi42IDYuN2MwIDkuNi01LjkgMTEuOC0xMS41IDEyLjRjMC45IDAuOCAxLjcgMi4zIDEuNyA0LjZjMCAzLjMgMCA2IDAgNi44YzAgMC43IDAuNSAxLjQgMS43IDEuMkM2Ny44IDcwLjQgNzUgNjEgNzUgNTBDNzUgMzYuMiA2My44IDI1IDUwIDI1eiIgZmlsbD0id2hpdGUiLz4KICAKICA8IS0tIFJBVyDmlofmnKwgLS0+CiAgPHJlY3QgeD0iMzUiIHk9IjY1IiB3aWR0aD0iMzAiIGhlaWdodD0iMTUiIHJ4PSI0IiBmaWxsPSIjMmVhNDRmIiAvPgogIDx0ZXh0IHg9IjM4IiB5PSI3NyIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiPlJBVzwvdGV4dD4KPC9zdmc+">  
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css">
    <style>
      .animate-gradient {
        background: linear-gradient(90deg, #4f46e5, #8b5cf6, #ec4899);
        background-size: 200% 200%;
        animation: gradient 5s ease infinite;
      }
      
      @keyframes gradient {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
  
      .glassmorphism {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
      }
      
      .theme-switch {
        position: fixed;
        top: 1rem;
        right: 1rem;
      }
    </style>
  </head>
  <body class="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
    <button id="theme-toggle" class="theme-switch p-2 rounded-full bg-gray-200 dark:bg-gray-700 focus:outline-none">
      <svg id="moon-icon" class="w-6 h-6 text-gray-800 hidden dark:block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
      </svg>
      <svg id="sun-icon" class="w-6 h-6 text-yellow-500 block dark:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
      </svg>
    </button>
  
    <header class="animate-gradient p-4 text-white shadow-lg">
      <div class="container mx-auto flex items-center">
        <svg class="w-10 h-10 mr-3" viewBox="0 0 100 100">
        <!-- 圆形背景 -->
        <circle cx="50" cy="50" r="50" fill="#24292e" />
        
        <!-- GitHub 官方猫图标 -->
        <path d="M50 25C36.2 25 25 36.2 25 50c0 11 7.2 20.4 17.1 23.7c1.3 0.2 1.7-0.5 1.7-1.2c0-0.6 0-2.1 0-4.1c-7 1.5-8.4-3.4-8.4-3.4c-1.1-2.9-2.8-3.7-2.8-3.7c-2.3-1.6 0.2-1.5 0.2-1.5c2.5 0.2 3.8 2.6 3.8 2.6c2.2 3.8 5.9 2.7 7.3 2.1c0.2-1.6 0.9-2.7 1.6-3.3c-5.6-0.6-11.4-2.8-11.4-12.4c0-2.7 1-5 2.6-6.7c-0.3-0.6-1.1-3.1 0.2-6.5c0 0 2.1-0.7 6.9 2.6c2-0.6 4.1-0.8 6.3-0.8c2.1 0 4.3 0.3 6.3 0.8c4.8-3.2 6.9-2.6 6.9-2.6c1.4 3.4 0.5 5.9 0.2 6.5c1.6 1.7 2.6 4 2.6 6.7c0 9.6-5.9 11.8-11.5 12.4c0.9 0.8 1.7 2.3 1.7 4.6c0 3.3 0 6 0 6.8c0 0.7 0.5 1.4 1.7 1.2C67.8 70.4 75 61 75 50C75 36.2 63.8 25 50 25z" fill="white"/>
        
        <!-- RAW 图标 -->
        <rect x="35" y="65" width="30" height="15" rx="4" fill="#2ea44f" />
        <text x="38" y="77" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white">RAW</text>
      </svg>
      <div>
        <h1 class="text-2xl md:text-3xl font-bold">GitHub Raw链接转换器</h1>
        <p class="text-sm md:text-base opacity-90">将 GitHub 仓库文件链接转换为 raw.githubusercontent.com 原始内容链接</p>
      </div>
    </header>
  
    <main class="flex-grow container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto glassmorphism rounded-xl p-6 shadow-lg dark:text-white">
        <div class="mb-6">
          <label for="github-url" class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">输入 GitHub 文件链接</label>
          <div class="flex">
            <input 
              type="text" 
              id="github-url" 
              placeholder="例如: https://github.com/username/repo/blob/main/file.txt" 
              class="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <button 
              id="convert-btn"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-r-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              转换
            </button>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">支持 GitHub 仓库中的文件链接</p>
        </div>
  
        <div id="result-container" class="hidden">
          <div class="mb-4">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">Raw 链接：</h3>
            <div class="flex">
              <input 
                type="text" 
                id="raw-url" 
                readonly 
                class="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-gray-50 dark:bg-gray-700"
              >
              <button 
                id="copy-btn"
                class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-r-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                复制
              </button>
            </div>
          </div>
          
          <div class="mt-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <h3 class="font-medium text-gray-800 dark:text-gray-200 mb-2">预览链接：</h3>
            <div class="flex flex-wrap gap-2">
              <a 
                id="preview-link" 
                href="#" 
                target="_blank" 
                class="inline-flex items-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                在新标签页中打开
              </a>
              <button 
                id="download-btn" 
                class="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                下载文件
              </button>
            </div>
          </div>
        </div>
  
        <div id="error-container" class="hidden mt-4 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
          <p id="error-message"></p>
        </div>
      </div>
  
      <div class="max-w-3xl mx-auto mt-8 glassmorphism rounded-xl p-6 shadow-lg dark:text-white">
        <h2 class="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">使用说明</h2>
        <div class="space-y-3 text-gray-600 dark:text-gray-300 text-sm">
          <p>1. 复制 GitHub 仓库中任何文件的 URL 链接</p>
          <p>2. 粘贴到上方输入框中</p>
          <p>3. 点击"转换"按钮生成 raw.githubusercontent.com 链接</p>
          <p>4. 复制生成的链接或直接使用预览/下载功能</p>
        </div>
        
        <div class="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <p class="text-yellow-700 dark:text-yellow-400 text-sm">
            <span class="font-medium">提示：</span> 
            Raw 链接可以直接获取文件原始内容，适用于下载文件、引用代码、获取文本数据或在其他项目中引用资源。
          </p>
        </div>
      </div>
    </main>
  
    <footer class="py-6 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>© 2025 GitHub Raw链接转换器 | <a href="https://github.com/m2kall/github-raw-converter" class="underline hover:text-indigo-500">GitHub</a></p>
    </footer>
  
    <script>
      document.addEventListener('DOMContentLoaded', () => {
        // 元素获取
        const githubUrlInput = document.getElementById('github-url');
        const convertBtn = document.getElementById('convert-btn');
        const resultContainer = document.getElementById('result-container');
        const rawUrlInput = document.getElementById('raw-url');
        const copyBtn = document.getElementById('copy-btn');
        const previewLink = document.getElementById('preview-link');
        const downloadBtn = document.getElementById('download-btn');
        const errorContainer = document.getElementById('error-container');
        const errorMessage = document.getElementById('error-message');
        const themeToggle = document.getElementById('theme-toggle');
        
        // 主题切换
        themeToggle.addEventListener('click', () => {
          document.documentElement.classList.toggle('dark');
          localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
        });
        
        // 检查和应用保存的主题
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
  
        // 转换按钮点击事件
        convertBtn.addEventListener('click', async () => {
          const githubUrl = githubUrlInput.value.trim();
          
          if (!githubUrl) {
            showError('请输入GitHub文件链接');
            return;
          }
          
          try {
            errorContainer.classList.add('hidden');
            
            // 调用API转换URL
            const response = await fetch(\`/api/convert?url=\${encodeURIComponent(githubUrl)}\`);
            const data = await response.json();
            
            if (data.error) {
              showError(data.error);
              return;
            }
            
            // 显示结果
            rawUrlInput.value = data.rawUrl;
            previewLink.href = data.rawUrl;
            resultContainer.classList.remove('hidden');
            
            // 设置下载按钮
            downloadBtn.onclick = () => {
              window.location.href = data.rawUrl;
            };
          } catch (error) {
            showError('转换过程中发生错误');
            console.error(error);
          }
        });
        
        // 复制按钮点击事件
        copyBtn.addEventListener('click', () => {
          rawUrlInput.select();
          document.execCommand('copy');
          
          const originalText = copyBtn.textContent;
          copyBtn.textContent = '已复制!';
          copyBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
          copyBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
          
          setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.add('bg-green-600', 'hover:bg-green-700');
            copyBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
          }, 2000);
        });
        
        // 显示错误信息
        function showError(message) {
          errorMessage.textContent = message;
          errorContainer.classList.remove('hidden');
          resultContainer.classList.add('hidden');
        }
        
        // 回车键触发转换
        githubUrlInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            convertBtn.click();
          }
        });
      });
    </script>
  </body>
  </html>`;