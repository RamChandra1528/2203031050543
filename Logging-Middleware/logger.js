// logger.js
const axios = require('axios');

const LOGGING_API_URL = 'http://20.244.56.144/eva1uation-service/logs';

const allowedStacks = ['backend', 'frontend'];
const allowedLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
const allowedPackages = [
  'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
  'auth', 'config', 'middleware', 'utils'
];

async function Log(stack, level, pkg, message) {
  try {
    if (!allowedStacks.includes(stack) || !allowedLevels.includes(level) || !allowedPackages.includes(pkg)) {
      throw new Error('Invalid log parameters');
    }

    const payload = { stack, level, package: pkg, message };
    const res = await axios.post(LOGGING_API_URL, payload);
    console.log(`[Log] ${res.data.message} (ID: ${res.data.logID})`);
  } catch (err) {
    console.error('[Logger Error]:', err.message);
  }
}

module.exports = { Log };
