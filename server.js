const express = require('express');
const path = require('path');
const app = express();

// Serve static files
app.use(express.static(__dirname));

// Serve the viewer
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web', 'viewer.html'));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`PMD viewer server running at http://localhost:${PORT}`);
    console.log(`View your PMD file at: http://localhost:${PORT}/web/viewer.html?file=/testmarkdown.pmd`);
});
