const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. 静态首页分发
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. 智能无痕清洗中转站（攻克白屏的关键）
// 当接收到 /_proxy_stream?url=https://xxx 的请求时，进行深度流量清洗
app.use('/_proxy_stream', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URL missing');

    let parsedUrl;
    try {
        parsedUrl = new URL(targetUrl);
    } catch (e) {
        return res.status(400).send('Invalid URL');
    }

    // 动态配置反向代理
    createProxyMiddleware({
        target: parsedUrl.origin,
        changeOrigin: true,
        ws: true, // 支持游戏所需的 WebSocket
        pathRewrite: { '.*': parsedUrl.pathname + parsedUrl.search },
        logLevel: 'error',
        onProxyReq: (proxyReq) => {
            // 伪装成标准的桌面浏览器请求，绕过目标网站对服务器的限制
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        },
        onProxyRes: (proxyRes) => {
            // 【最核心】强行抹除所有会导致 iframe 触发白屏的安全响应头
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['content-security-policy-report-only'];
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log("Portal server with active bypass is running.");
});
