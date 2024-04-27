const express = require('express');
const router = express.Router();
const logger = require('../config/logger');

router.post('/error', (req, res) => {
  const { error } = req.body;
  logger.error('Frontend Error: %s', JSON.stringify(error));
  res.status(200).send({ message: 'Error logged successfully' });
});

router.post('/action', (req, res) => {
  const { action } = req.body;
  logger.info('User Action: %s', JSON.stringify(action));
  res.status(200).send({ message: 'Action logged successfully' });
});

module.exports = router;