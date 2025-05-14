addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
  })
  
  async function handleRequest(request) {
    const url = new URL(request.url)
    
    // 如果是API请求，处理GitHub URL转换
    if (url.pathname.startsWith('/api/convert')) {
      return handleApiRequest(request)
    }
    
    // 否则返回HTML页面
    return new Response(HTML, {
      headers: {
        'content-type': 'text/html;charset=UTF-8',
      },
    })
  }
  
  async function handleApiRequest(request) {
    try {
      const url = new URL(request.url)
      const githubUrl = url.searchParams.get('url')
      
      if (!githubUrl) {
        return new Response(JSON.stringify({ error: '请提供GitHub URL' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      const rawUrl = convertToRawUrl(githubUrl)
      
      return new Response(JSON.stringify({ rawUrl }), {
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
  
  function convertToRawUrl(githubUrl) {
    // 验证URL是否为GitHub URL
    if (!githubUrl.includes('github.com')) {
      throw new Error('无效的GitHub URL')
    }
    
    // 替换域名和移除blob部分
    const rawUrl = githubUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/')
    
    return rawUrl
  }
  
  // HTML前端页面
  const HTML = `<!DOCTYPE html>
  <html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GitHub Raw链接转换器</title>
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
      <div class="container mx-auto">
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
      <p>© 2023 GitHub Raw链接转换器 | <a href="https://github.com" class="underline hover:text-indigo-500">GitHub</a></p>
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