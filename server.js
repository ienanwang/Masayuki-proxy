<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google</title>
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: "Helvetica Neue", Arial, sans-serif;
            margin: 0; padding: 0;
            display: flex; flex-direction: column;
            height: 100vh; background-color: #ffffff;
            overflow: hidden;
        }
        /* 顶部右侧伪装导航 */
        .header { display: flex; justify-content: flex-end; padding: 15px 30px; font-size: 13px; }
        .header a { color: rgba(0,0,0,0.87); text-decoration: none; margin-left: 15px; user-select: none; }
        
        /* 主体搜索区域 */
        .main-container {
            flex: 1; display: flex; flex-direction: column;
            align-items: center; justify-content: center; margin-top: -80px;
        }
        /* Google 经典彩色 Logo */
        .logo { font-size: 90px; font-weight: 500; letter-spacing: -2px; margin-bottom: 30px; user-select: none; }
        .logo span:nth-child(1) { color: #4285F4; } .logo span:nth-child(2) { color: #EA4335; }
        .logo span:nth-child(3) { color: #FBBC05; } .logo span:nth-child(4) { color: #4285F4; }
        .logo span:nth-child(5) { color: #34A853; } .logo span:nth-child(6) { color: #EA4335; }

        /* 搜索框 */
        .search-box {
            display: flex; align-items: center;
            width: 100%; max-width: 584px; height: 46px;
            border: 1px solid #dfe1e5; border-radius: 24px; padding: 0 15px; margin-bottom: 30px;
            transition: box-shadow 0.2s;
        }
        .search-box:hover, .search-box:focus-within {
            box-shadow: 0 1px 6px rgba(32,33,36,0.28);
            border-color: rgba(223,225,229,0);
        }
        .search-input { flex: 1; height: 100%; border: none; outline: none; font-size: 16px; }
        .buttons { display: flex; gap: 12px; }
        .btn { background-color: #f8f9fa; border: 1px solid #f8f9fa; border-radius: 4px; color: #3c4043; font-size: 14px; padding: 0 16px; height: 36px; cursor: pointer; user-select: none; }
        .btn:hover { border: 1px solid #dadce0; color: #202124; background-color: #f8f9fa; }

        /* 100% 全屏无痕显示层 */
        #content-overlay {
            display: none; position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: #ffffff; z-index: 9999;
        }
        #content-overlay iframe { width: 100%; height: 100%; border: none; }
        .close-btn {
            position: absolute; top: 15px; right: 20px;
            background: rgba(0, 0, 0, 0.6); color: #fff;
            border: none; padding: 8px 16px; border-radius: 20px;
            cursor: pointer; font-size: 14px; z-index: 10000;
            transition: background 0.2s;
        }
        .close-btn:hover { background: rgba(0, 0, 0, 0.8); }
    </style>
</head>
<body>

    <!-- 伪装的 Google 首页 -->
    <div class="header">
        <a href="#" onclick="return false;">Gmail</a>
        <a href="#" onclick="return false;">画像</a>
    </div>
    <div class="main-container">
        <div class="logo"><span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span></div>
        <div class="search-box">
            <input type="text" id="search-query" class="search-input" autofocus placeholder="キーワードまたは URL を入力してください">
        </div>
        <div class="buttons">
            <button class="btn" onclick="handleSearch()">Google 検索</button>
        </div>
    </div>

    <!-- 核心无痕加载沙箱层 -->
    <div id="content-overlay">
        <button class="close-btn" onclick="closeOverlay()">✕ 戻る</button>
        <div id="media-player" style="width:100%; height:100%;"></div>
    </div>

    <script>
        // 【白名单配置】只有在这个名单里的 URL 才能被成功打开，否则提示 "URL違う"
        // 可以根据需要在此处增删域名（全部使用小写）
        const ALLOWED_URLS = [
            'youtube.com',
            '://youtube.com',
            'poki.com',
            '://poki.com',
            'i-finiter.com',
            '://i-finiter.com'
        ];

        // 监听键盘回车键
        document.getElementById('search-query').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') handleSearch();
        });

        // 严格的 URL 白名单清洗与校验函数
        function cleanAndValidateURL(str) {
            let cleanStr = str.toLowerCase().trim();
            // 去除协议头与 www 标记
            cleanStr = cleanStr.replace(/^(https?:\/\/)?(www\.)?/, '');
            // 分割提取出核心主域名
            const domain = cleanStr.split('/')[0];
            
            // 比对域名是否在合法的白名单列表中
            return ALLOWED_URLS.includes(domain) || ALLOWED_URLS.includes('www.' + domain);
        }

        // 核心执行搜索与穿透逻辑
        function handleSearch() {
            let originalQuery = document.getElementById('search-query').value.trim();
            const lowerQuery = originalQuery.toLowerCase();
            const overlay = document.getElementById('content-overlay');
            const playerContainer = document.getElementById('media-player');
            
            if (!originalQuery) return;

            // 模式 A：触发暗号关键字（进行 100% 稳定的专用流优化加载）
            if (lowerQuery === 'youtube') {
                originalQuery = 'https://://youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
            } else if (lowerQuery === 'poki') {
                originalQuery = 'https://gamepix.com';
            }

            // 模式 B：触发合法 URL 校验
            const isDirectCommand = (lowerQuery === 'youtube' || lowerQuery === 'poki');
            if (isDirectCommand || cleanAndValidateURL(originalQuery)) {
                
                // 自动补齐缺少的 http/https 协议头
                if (!originalQuery.startsWith('http') && !isDirectCommand) {
                    originalQuery = 'https://' + originalQuery;
                }
                
                wipeHistoryTrace(); // 在页面显示前，强制对浏览器历史记录节点进行脱敏擦除
                overlay.style.display = 'block';

                // 判断是否为专用的 embed 媒体流，非 embed 网址一律送入 Render 后端清洗中转站防止白屏
                if (originalQuery.includes('embed')) {
                    playerContainer.innerHTML = `<iframe src="${originalQuery}" allowfullscreen></iframe>`;
                } else {
                    const cleanProxyUrl = window.location.origin + '/_proxy_stream?url=' + encodeURIComponent(originalQuery);
                    playerContainer.innerHTML = `<iframe src="${cleanProxyUrl}" allowfullscreen sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>`;
                }
            } 
            // 模式 C：不匹配暗号且不符合白名单网址，一律无情拦截
            else {
                alert('URL違う');
                document.getElementById('search-query').value = '';
            }
        }

        // 核心保密技术：强制重写当前的浏览器历史记录堆栈，确保历史记录里永远只有 Render 首页地址
        function wipeHistoryTrace() {
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        }

        // 关闭全屏重置界面
        function closeOverlay() {
            document.getElementById('content-overlay').style.display = 'none';
            document.getElementById('media-player').innerHTML = ''; // 强行卸载框架，彻底释放内存、清除视频声音与缓存痕迹
            wipeHistoryTrace();
        }
    </script>
</body>
</html>
