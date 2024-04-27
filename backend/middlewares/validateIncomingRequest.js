const { validationResult } = require('express-validator');
const logger = require('../config/logger');

const validateIncomingRequest = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error('Validation errors: %s', JSON.stringify(errors.array()));
      return res.status(400).json({ errors: errors.array() });
    }

    // Log the successful validation
    logger.info('Successfully validated incoming request.');

    next();
  };
};

module.exports = { validateIncomingRequest };