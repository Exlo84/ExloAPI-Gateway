const { validationResult, body } = require('express-validator');

// Middleware to validate the request body for /api/v1/chat/completions endpoint
exports.validateChatCompletion = [
  body('message').notEmpty().withMessage('Message is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors: ', JSON.stringify(errors.array()));
      return res.status(400).json({ errors: errors.array() });
    }
    console.log('Chat completion request validated successfully.');
    next();
  },
];