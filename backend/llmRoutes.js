const express = require('express');
const axios = require('axios');
const { addLLMEntry, editLLMEntry, deleteLLMEntry, listLLMEntries, toggleActiveLLMEntry, listActiveLLMEntry } = require('./llmManager');
const { proxyRequest } = require('./proxyHandler');
const { body, validationResult } = require('express-validator');
const logger = require('../config/logger');
const router = express.Router();

/**
 * @swagger
 * /api/llm/add:
 *   post:
 *     summary: Add a new LLM entry
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 description: Model identifier
 *               base_url:
 *                 type: string
 *                 description: Base URL of the LLM
 *               api_key:
 *                 type: string
 *                 description: API Key for the LLM
 *     responses:
 *       201:
 *         description: LLM entry added
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/add', [
  body('model').notEmpty().withMessage('Model identifier is required'),
  body('base_url').isURL().withMessage('Base URL must be a valid URL'),
  body('api_key').notEmpty().withMessage('API Key is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation errors: %s', JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }
  addLLMEntry(req.body, (err, result) => {
    if (err) {
      logger.error('Failed to add LLM entry: %s', err.message);
      logger.error('Error trace: %s', err.stack);
      res.status(500).json({ message: 'Failed to add LLM entry', error: err.message });
    } else {
      logger.info('LLM entry added with ID: %d', result.id);
      res.status(201).json(result);
    }
  });
});

/**
 * @swagger
 * /api/llm/edit/{id}:
 *   put:
 *     summary: Edit an LLM entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The LLM entry ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model:
 *                 type: string
 *                 description: Model identifier
 *               base_url:
 *                 type: string
 *                 description: Base URL of the LLM
 *               api_key:
 *                 type: string
 *                 description: API Key for the LLM
 *     responses:
 *       200:
 *         description: LLM entry edited
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.put('/edit/:id', [
  body('model').notEmpty().withMessage('Model identifier is required'),
  body('base_url').custom(value => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      throw new Error('Base URL must be a valid URL');
    }
  }),
  body('api_key').notEmpty().withMessage('API Key is required'),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.error('Validation errors: %s', JSON.stringify(errors.array()));
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.params;
  editLLMEntry(id, req.body, (err, result) => {
    if (err) {
      logger.error('Failed to edit LLM entry with ID %d: %s', id, err.message);
      logger.error('Error trace: %s', err.stack);
      res.status(500).json({ message: 'Failed to edit LLM entry', error: err.message });
    } else {
      logger.info('LLM entry edited with ID: %d, Changes: %d', id, result.changes);
      res.status(200).json(result);
    }
  });
});

/**
 * @swagger
 * /api/llm/delete/{id}:
 *   delete:
 *     summary: Delete an LLM entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The LLM entry ID
 *     responses:
 *       200:
 *         description: LLM entry deleted
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  deleteLLMEntry(id, (err, result) => {
    if (err) {
      logger.error('Failed to delete LLM entry with ID %d: %s', id, err.message);
      logger.error('Error trace: %s', err.stack);
      res.status(500).json({ message: 'Failed to delete LLM entry', error: err.message });
    } else {
      logger.info('LLM entry deleted with ID: %d, Changes: %d', id, result.changes);
      res.status(200).json(result);
    }
  });
});

/**
 * @swagger
 * /api/llm/list:
 *   get:
 *     summary: List all LLM entries
 *     responses:
 *       200:
 *         description: LLM entries retrieved successfully
 *       500:
 *         description: Internal server error
 */
router.get('/list', (req, res) => {
  listLLMEntries((err, entries) => {
    if (err) {
      logger.error('Failed to list LLM entries: %s', err.message);
      logger.error('Error trace: %s', err.stack);
      res.status(500).json({ message: 'Failed to list LLM entries', error: err.message });
    } else {
      logger.info('LLM entries retrieved successfully');
      res.status(200).json(entries);
    }
  });
});

/**
 * @swagger
 * /api/llm/active/{id}:
 *   put:
 *     summary: Toggle the active state of an LLM entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The LLM entry ID
 *     responses:
 *       200:
 *         description: Active state toggled successfully
 *       500:
 *         description: Internal server error
 */
router.put('/active/:id', (req, res) => {
  const { id } = req.params;
  toggleActiveLLMEntry(id, (err, result) => {
    if (err) {
      logger.error('Failed to toggle active state for LLM entry with ID %d: %s', id, err.message);
      logger.error('Error trace: %s', err.stack);
      res.status(500).json({ message: 'Failed to toggle active state for LLM entry', error: err.message });
    } else {
      logger.info('Active state toggled for LLM entry with ID: %d', id);
      res.status(200).json({ message: 'Active state toggled successfully', id: id, isActive: result.isActive });
    }
  });
});

/**
 * @swagger
 * /api/llm/active-model:
 *   get:
 *     summary: Get active LLM model details
 *     responses:
 *       200:
 *         description: Active LLM model details retrieved successfully
 *       404:
 *         description: No active LLM model found
 *       500:
 *         description: Internal server error
 */
router.get('/active-model', (req, res) => {
    listActiveLLMEntry((err, entry) => {
        if (err) {
            logger.error('Failed to list active LLM entry: %s', err.message);
            logger.error('Error trace: %s', err.stack);
            res.status(500).json({ message: 'Failed to list active LLM entry', error: err.message });
        } else if (entry) {
            logger.info('Active LLM entry listed successfully');
            res.status(200).json(entry);
        } else {
            res.status(404).json({ message: 'No active LLM entry found' });
        }
    });
});

router.post('/log/error', (req, res) => {
  const { error } = req.body;
  logger.error('Frontend Error: %s', JSON.stringify(error));
  res.status(200).send({ message: 'Error logged' });
});

router.post('/log/action', (req, res) => {
  const { action } = req.body;
  logger.info('User Action: %s', JSON.stringify(action));
  res.status(200).send({ message: 'Action logged' });
});

const validateChatCompletion = [
  body('message').notEmpty().withMessage('Message is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

router.post('/v1/chat/completions', validateChatCompletion, async (req, res) => {
  try {
    const { message } = req.body; // Extract message from request body

    // Identify the active LLM model from the database
    const activeLLM = await new Promise((resolve, reject) => {
      listActiveLLMEntry((err, entry) => {
        if (err) {
          reject(err);
        } else {
          resolve(entry);
        }
      });
    });

    if (!activeLLM) {
      return res.status(404).json({ message: 'No active LLM model found' });
    }

    // Construct request payload to forward to the actual LLM API
    const response = await axios.post(activeLLM.base_url, {
      prompt: message, // Adjusted to match the expected payload key
      max_tokens: 50 // {Specify the max tokens or adjust as per LLM API requirements}
    }, {
      headers: {
        'Authorization': `Bearer ${activeLLM.api_key}` // Use API key stored in the database
      }
    });

    // Return the response received from LLM API to the client
    res.json(response.data);
  } catch (error) {
    logger.error('Error processing chat completion: %s', error.message);
    logger.error('Error trace: %s', error.stack);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      res.status(error.response.status).json({ message: 'LLM API error', error: error.response.data });
    } else if (error.request) {
      // The request was made but no response was received
      res.status(500).json({ message: 'No response from LLM API', error: error.message });
    } else {
      // Something happened in setting up the request that triggered an Error
      res.status(500).json({ message: 'Failed to process chat completion', error: error.message });
    }
  }
});

module.exports = router;