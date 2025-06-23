const express = require('express');
const mongoose = require('mongoose');
const shortUrlRoutes = require('./routes/shorturl');
const { requestLogger } = require('./middleware/requestLogger');

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use('/', shortUrlRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/urlshortener')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB Error:', err.message));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
