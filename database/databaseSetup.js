const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path to the database file
const dbPath = path.resolve(__dirname, 'exloapi.db');

// Open the SQLite database
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

// SQL statement to create the llm_entries table
const createTableSql = `
CREATE TABLE IF NOT EXISTS llm_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    base_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    model TEXT NOT NULL,
    label TEXT
);`;

// Execute the SQL statement to create the table
db.run(createTableSql, (err) => {
    if (err) {
        console.error('Error creating table:', err.message);
        return;
    }
    console.log('Table llm_entries created or already exists.');
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
        return;
    }
    console.log('Database connection closed.');
});