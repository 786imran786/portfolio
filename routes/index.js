const express = require('express');
const router = express.Router();

// Serve main page
router.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

module.exports = router;