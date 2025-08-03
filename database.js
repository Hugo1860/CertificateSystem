const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./certs.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Enable foreign key enforcement
        db.exec('PRAGMA foreign_keys = ON;', (err) => {
            if (err) {
                console.error("Failed to enable foreign key enforcement:", err.message);
            } else {
                console.log("Foreign key enforcement is on.");
            }
        });

        db.serialize(() => {
            // Create Templates Table
            db.run(`CREATE TABLE IF NOT EXISTS Templates (
                template_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                background_image_url TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )`);

            // Create Activities Table
            db.run(`CREATE TABLE IF NOT EXISTS Activities (
                activity_id TEXT PRIMARY KEY,
                external_id TEXT UNIQUE,
                name TEXT NOT NULL,
                description TEXT,
                template_id TEXT NOT NULL,
                issuer TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (template_id) REFERENCES Templates (template_id)
            )`);

            // Create Certificates Table
            db.run(`CREATE TABLE IF NOT EXISTS Certificates (
                certificate_id TEXT PRIMARY KEY,
                activity_id TEXT NOT NULL,
                recipient_external_id TEXT NOT NULL,
                recipient_name TEXT NOT NULL,
                recipient_email TEXT,
                status TEXT NOT NULL DEFAULT 'issued',
                issue_date TEXT NOT NULL,
                expiry_date TEXT,
                verification_code TEXT UNIQUE NOT NULL,
                download_url TEXT,
                view_url TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (activity_id) REFERENCES Activities (activity_id)
            )`);

            console.log('Database tables created or already exist.');
        });
    }
});

module.exports = db;
