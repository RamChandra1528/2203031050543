const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  shortcode: { type: String, unique: true, required: true },
  originalUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  expiry: { type: Date },
  clicks: [
    {
      timestamp: Date,
      referrer: String,
      location: String
    }
  ]
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
