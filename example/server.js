/// Native Modules
const path = require('path');

/// Node Modules
const express = require('express');

// CONSTANTS
const app = express();
const PORT = 3030;

// static resources
app.use('/', express.static(path.join(__dirname, 'root')));
app.use('/dist', express.static(path.join(__dirname, '../dist')));

// entry point
app.get('/', (req, res) => res.sendFile(path.join(__dirname, './root/index.html')));

// docs retrieval
app.get('/docs/:name', (req, res) => res.sendFile(path.join(__dirname, `../docs/${req.params.name}.html`)));

// server runner
app.listen(PORT, () => console.log(`\x1b[36milluminate\x1b[0m -> \x1b[3;34mhttp://127.0.0.1:${PORT}\x1b[0m`));