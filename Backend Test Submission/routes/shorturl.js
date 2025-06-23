const express = require('express');
const router = express.Router();
const { createShortUrl, redirect, getStats } = require('../controllers/shortener');

router.post('/shorturls', createShortUrl);         // POST /shorturls
router.get('/shorturls/:shortcode', getStats);     // GET /shorturls/:shortcode
router.get('/:shortcode', redirect);               // GET /:shortcode (redirect)

module.exports = router;
