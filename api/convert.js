export default function handler(req, res) {
    try {
      const { url } = req.query;
      
      if (!url) {
        return res.status(400).json({ error: '请提供GitHub URL' });
      }
      
      const rawUrl = convertToRawUrl(url);
      
      return res.status(200).json({ rawUrl });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
  
  function convertToRawUrl(githubUrl) {
    // 验证URL是否为GitHub URL
    if (!githubUrl.includes('github.com')) {
      throw new Error('无效的GitHub URL');
    }
    
    // 替换域名和移除blob部分
    const rawUrl = githubUrl
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/');
    
    return rawUrl;
  }