CREATE TABLE IF NOT EXISTS llm_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    base_url TEXT NOT NULL,
    api_key TEXT NOT NULL,
    model TEXT NOT NULL,
    label TEXT,
    isActive BOOLEAN NOT NULL DEFAULT false
);