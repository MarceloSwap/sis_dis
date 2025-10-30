const express = require('express');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

// Servir arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, 'build')));

// Fallback para SPA - sempre retornar index.html
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`🚀 SisDis React App iniciado na porta ${port}`);
    console.log(`📱 Acesse: http://localhost:${port}`);
});