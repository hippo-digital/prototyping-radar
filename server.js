const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8083;

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Serve data files
app.use('/data', express.static(path.join(__dirname, 'data')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
