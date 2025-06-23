const ShortUrl = require('../models/ShortUrl');
const { generateCode } = require('../utils/generateCode');
const { Log } = require('../../Logging-Middleware/logger');

exports.createShortUrl = async (req, res) => {
  try {
    const { url, validity = 30, shortcode } = req.body;
    let code = shortcode || generateCode();

    const exists = await ShortUrl.findOne({ shortcode: code });
    if (exists) {
      await Log('backend', 'error', 'handler', 'Shortcode collision');
      return res.status(409).json({ error: 'Shortcode already in use' });
    }

    const expiry = new Date(Date.now() + validity * 60 * 1000);
    const newEntry = await ShortUrl.create({ shortcode: code, originalUrl: url, expiry });

    await Log('backend', 'info', 'handler', `Shortened: ${code}`);
    return res.status(201).json({
      shortLink: `http://localhost:5000/${code}`,
      expiry: expiry.toISOString()
    });
  } catch (err) {
    await Log('backend', 'fatal', 'handler', `Create error: ${err.message}`);
    res.status(500).json({ error: 'Internal error' });
  }
};

exports.redirect = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const entry = await ShortUrl.findOne({ shortcode });

    if (!entry) {
      await Log('backend', 'warn', 'handler', 'Shortcode not found');
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (entry.expiry < new Date()) {
      await Log('backend', 'info', 'handler', 'Shortcode expired');
      return res.status(410).json({ error: 'Link expired' });
    }

    entry.clicks.push({
      timestamp: new Date(),
      referrer: req.get('referer') || '',
      location: 'India' 
    });
    await entry.save();

    res.redirect(entry.originalUrl);
  } catch (err) {
    await Log('backend', 'error', 'handler', `Redirect error: ${err.message}`);
    res.status(500).json({ error: 'Redirection failed' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const { shortcode } = req.params;
    const entry = await ShortUrl.findOne({ shortcode });

    if (!entry) {
      await Log('backend', 'warn', 'handler', 'Stats shortcode not found');
      return res.status(404).json({ error: 'Shortcode not found' });
    }

    return res.json({
      originalUrl: entry.originalUrl,
      createdAt: entry.createdAt,
      expiry: entry.expiry,
      clickCount: entry.clicks.length,
      clicks: entry.clicks
    });
  } catch (err) {
    await Log('backend', 'error', 'handler', `Stats error: ${err.message}`);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};
