const axios = require('axios');
const { listActiveLLMEntry } = require('./llmManager');
const logger = require('../config/logger');

const transformRequestForTargetAPI = (originalRequestBody) => {
    // Initial transformation setup, assuming a common structure
    let transformedData = { prompt: originalRequestBody.message || originalRequestBody.query || '', model: originalRequestBody.model || '' };

    // Specific transformations for known external apps
    if (originalRequestBody.application === 'AnythingLLM') {
        transformedData.prompt = originalRequestBody.messages.map(m => m.content).join('\n');
    } else if (originalRequestBody.application === 'Pythagora') {
        // For Pythagora, use the active model's details instead of the provided static model
        transformedData.prompt = originalRequestBody.messages[0].content;
        // The model field is now handled dynamically later in the code, so it's not set here
        delete transformedData.model;
    }

    // Log the transformed request body for debugging
    logger.debug('Transformed request body: %s', JSON.stringify(transformedData));

    return transformedData;
};

const validateRequestBody = (req) => {
    // Check for essential fields in the request body
    if (!req.body || (!req.body.message && !req.body.query && (!req.body.messages || req.body.messages.length === 0))) {
        logger.error('Invalid request body: %s', JSON.stringify(req.body));
        return false;
    }
    return true;
};

const proxyRequest = async (req, res) => {
    try {
        // Validate the incoming request body
        if (!validateRequestBody(req)) {
            return res.status(400).send('Invalid request structure');
        }

        const activeEntry = await new Promise((resolve, reject) => {
            listActiveLLMEntry((err, entry) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(entry);
                }
            });
        });

        if (!activeEntry) {
            logger.warn('No active LLM entry found');
            return res.status(404).send('No active LLM entry found');
        }

        const targetUrl = activeEntry.base_url;
        logger.info(`Proxying request to: ${targetUrl}`);

        // Transform the incoming request body based on its originating app
        const transformedData = transformRequestForTargetAPI(req.body);

        // Ensure headers and body content meet the target LLM API's requirements
        const requestOptions = {
            method: req.method,
            url: targetUrl,
            headers: {
                'Authorization': `Bearer ${activeEntry.api_key}`,
                ...req.headers,
                'host': new URL(targetUrl).hostname
            },
            data: transformedData,
            timeout: 5000
        };

        // Remove headers that should not be forwarded
        delete requestOptions.headers['host'];
        delete requestOptions.headers['content-length'];

        // Log final request headers for debugging
        logger.debug('Final request headers: %s', JSON.stringify(requestOptions.headers));

        const response = await axios(requestOptions);

        logger.info(`Response from LLM API: ${JSON.stringify(response.data)}`);
        res.json(response.data);
    } catch (error) {
        logger.error('Proxy request failed: ' + error.message);
        logger.error('Proxy request error trace: ' + error.stack);
        if (error.response) {
            logger.error(`Proxy request failed with status: ${error.response.status}`);
            logger.error(`Proxy request failed response: ${JSON.stringify(error.response.data)}`);
            res.status(error.response.status).send(error.response.data);
        } else {
            res.status(502).send('Failed to forward request to the target LLM');
        }
    }
};

module.exports = { proxyRequest };