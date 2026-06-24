const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 1. 托管静态首页
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. 智能无痕清洗中转站（防止 iframe 白屏）
app.use('/_proxy_stream', (req, res, next) => {
    const targetUrl = req.query.url;
    if (!targetUrl) return res.status(400).send('URL missing');

    let parsedUrl;
    try {
        parsedUrl = new URL(targetUrl);
    } catch (e) {
        return res.status(400).send('Invalid URL');
    }

    createProxyMiddleware({
        target: parsedUrl.origin,
        changeOrigin: true,
        ws: true, // 支持 WebSocket（游戏和直播需要）
        pathRewrite: { '.*': parsedUrl.pathname + parsedUrl.search },
        logLevel: 'error',
        onProxyReq: (proxyReq) => {
            // 伪装浏览器头部，防止源站拒绝服务器请求
            proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        },
        onProxyRes: (proxyRes) => {
            // 强行抹除所有防嵌套、导致白屏的安全响应头
            delete proxyRes.headers['x-frame-options'];
            delete proxyRes.headers['content-security-policy'];
            delete proxyRes.headers['content-security-policy-report-only'];
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log("Portal server with active bypass is running.");
});
