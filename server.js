const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 彻底保持安静，不对任何路由进行 console.log 记录，保护隐私
app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    // 仅在启动时提示一次
    console.log("Portal server is ready.");
});
