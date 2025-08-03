const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database'); // Import the database connection

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// API Routes
const managementRoutes = require('./api/management');
const coreRoutes = require('./api/core');
app.use('/api/v1', managementRoutes);
app.use('/api/v1', coreRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/certificate.html');
});

let server;

// Only start listening if the file is run directly
if (require.main === module) {
    server = app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

module.exports = { app, closeServer: () => server.close() }; // Export app and a way to close the server