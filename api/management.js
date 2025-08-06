const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// Endpoint to create a new certificate template
router.post('/templates', (req, res) => {
    const { name, description, background_image_url } = req.body;
    const template_id = `tpl_${uuidv4()}`;

    if (!name) {
        return res.status(400).json({ error: 'Template name is required.' });
    }

    const sql = `INSERT INTO Templates (template_id, name, description, background_image_url) VALUES (?, ?, ?, ?)`;
    db.run(sql, [template_id, name, description, background_image_url], function(err) {
        if (err) {
            console.error('Error creating template:', err.message);
            return res.status(500).json({ error: 'Failed to create template.' });
        }
        res.status(201).json({
            message: 'Template created successfully.',
            template_id: template_id,
            name: name
        });
    });
});

// Endpoint to create a new activity
router.post('/activities', (req, res) => {
    const { external_id, name, description, template_id, issuer } = req.body;
    const activity_id = `act_${uuidv4()}`;

    if (!name || !template_id) {
        return res.status(400).json({ error: 'Activity name and template_id are required.' });
    }

    const sql = `INSERT INTO Activities (activity_id, external_id, name, description, template_id, issuer) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [activity_id, external_id, name, description, template_id, issuer], function(err) {
        if (err) {
            console.error('Error creating activity:', err.message);
            // Check for foreign key constraint error
            if (err.message.includes('FOREIGN KEY constraint failed')) {
                return res.status(400).json({ error: 'Invalid template_id. Template does not exist.' });
            }
            return res.status(500).json({ error: 'Failed to create activity.' });
        }
        res.status(201).json({
            message: 'Activity created successfully.',
            activity_id: activity_id,
            name: name
        });
    });
});

module.exports = router;
