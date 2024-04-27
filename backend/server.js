const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const llmRoutes = require('./llmRoutes');
const logRoutes = require('./logRoutes');
const proxyHandler = require('./proxyHandler');
const logger = require('./config/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swaggerConfig');
const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/llm', llmRoutes);
app.use('/api/log', logRoutes);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Serve Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware for async/await functions
const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch((err) => next(err));
  };

// Adjusted to handle requests to external LLMs through the specified API endpoint with asyncMiddleware
app.use('/api/v1/chat/completions', asyncMiddleware(proxyHandler.proxyRequest));

// Error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { error: err, path: req.path });
  logger.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'An unexpected error occurred',
    },
  });
});

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`LLM Management API and frontend running on port ${port}`);
    logger.info(`Swagger UI is available at http://192.168.1.208:${port}/api-docs`);
  });
}