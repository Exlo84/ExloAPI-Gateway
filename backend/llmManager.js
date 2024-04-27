const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const logger = require('../config/logger');

// Define the path to the database file
const dbPath = path.resolve(__dirname, '../database/exloapi.db');

// Open the SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        logger.error('Error opening database: %s', err.message);
        logger.error('Error trace: %s', err.stack);
    } else {
        logger.info('Connected to the SQLite database.');
    }
});

const addLLMEntry = (entry, callback) => {
    const { base_url: baseURL, api_key: apiKey, model, label, isActive = false } = entry; // Ensure isActive defaults to false if not provided
    const sql = `INSERT INTO llm_entries (base_url, api_key, model, label, isActive) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [baseURL, apiKey, model, label, isActive], function(err) {
        if (err) {
            logger.error('Failed to add LLM entry: %s', err.message);
            logger.error('Error trace: %s', err.stack);
            callback(err);
        } else {
            logger.info('LLM entry added with ID: %d', this.lastID);
            callback(null, { id: this.lastID });
        }
    });
};

const editLLMEntry = (id, entry, callback) => {
    const { base_url: baseURL, api_key: apiKey, model, label, isActive } = entry;
    // Only update isActive if it's explicitly provided
    const sql = isActive !== undefined
        ? `UPDATE llm_entries SET base_url = ?, api_key = ?, model = ?, label = ?, isActive = ? WHERE id = ?`
        : `UPDATE llm_entries SET base_url = ?, api_key = ?, model = ?, label = ? WHERE id = ?`;
    const params = isActive !== undefined
        ? [baseURL, apiKey, model, label, isActive, id]
        : [baseURL, apiKey, model, label, id];
    db.run(sql, params, function(err) {
        if (err) {
            logger.error('Failed to edit LLM entry: %s', err.message);
            logger.error('Error trace: %s', err.stack);
            callback(err);
        } else {
            logger.info('LLM entry edited with ID: %d', id);
            callback(null, { changes: this.changes });
        }
    });
};

const deleteLLMEntry = (id, callback) => {
    const sql = `DELETE FROM llm_entries WHERE id = ?`;
    db.run(sql, [id], function(err) {
        if (err) {
            logger.error('Failed to delete LLM entry: %s', err.message);
            logger.error('Error trace: %s', err.stack);
            callback(err);
        } else {
            logger.info('LLM entry deleted with ID: %d', id);
            callback(null, { changes: this.changes });
        }
    });
};

const listLLMEntries = (callback) => {
    const sql = `SELECT id, base_url, api_key, model, label, isActive FROM llm_entries`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            logger.error('Failed to retrieve LLM entries: %s', err.message);
            logger.error('Error trace: %s', err.stack);
            callback(err);
        } else {
            logger.info('LLM entries retrieved successfully');
            callback(null, rows);
        }
    });
};

const toggleActiveLLMEntry = (id, callback) => {
    db.serialize(() => {
        db.run(`UPDATE llm_entries SET isActive = false WHERE isActive = true`, function(err) {
            if (err) {
                logger.error('Failed to reset active LLM entries: %s', err.message);
                logger.error('Error trace: %s', err.stack);
                callback(err);
                return;
            }
            db.run(`UPDATE llm_entries SET isActive = true WHERE id = ?`, [id], function(err) {
                if (err) {
                    logger.error('Failed to set LLM entry as active: %s', err.message);
                    logger.error('Error trace: %s', err.stack);
                    callback(err);
                } else {
                    logger.info('LLM entry set as active with ID: %d', id);
                    callback(null, { id: id, isActive: true });
                }
            });
        });
    });
};

const listActiveLLMEntry = (callback) => {
    const sql = `SELECT * FROM llm_entries WHERE isActive = true LIMIT 1`;
    db.get(sql, (err, row) => {
        if (err) {
            logger.error('Failed to retrieve active LLM entry: %s', err.message);
            logger.error('Error trace: %s', err.stack);
            callback(err);
        } else {
            logger.info('Active LLM entry retrieved successfully');
            callback(null, row);
        }
    });
};

module.exports = { addLLMEntry, editLLMEntry, deleteLLMEntry, listLLMEntries, toggleActiveLLMEntry, listActiveLLMEntry };