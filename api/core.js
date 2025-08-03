const express = require('express');
const router = express.Router();
const db = require('../database');
const { v4: uuidv4 } = require('uuid');

// Endpoint to issue a new certificate
router.post('/certificates/issue', (req, res) => {
    const { activity_external_id, recipient, issue_date } = req.body;
    const { external_id: recipient_external_id, name: recipient_name, email: recipient_email } = recipient;

    if (!activity_external_id || !recipient || !recipient_external_id || !recipient_name) {
        return res.status(400).json({ error: 'Missing required fields: activity_external_id, recipient.external_id, and recipient.name are required.' });
    }

    // Find the activity and its details by its external_id
    const findActivitySql = `SELECT activity_id, name, issuer, template_id FROM Activities WHERE external_id = ?`;
    db.get(findActivitySql, [activity_external_id], (err, activity) => {
        if (err) {
            return res.status(500).json({ error: 'Database error while finding activity.' });
        }
        if (!activity) {
            return res.status(404).json({ error: `Activity with external_id '${activity_external_id}' not found.` });
        }

        const certificate_id = `cert_${uuidv4()}`;
        const verification_code = `SN-${uuidv4().toUpperCase().slice(0, 8)}`;
        const final_issue_date = issue_date || new Date().toISOString().split('T')[0];
        const download_url = `/images/Storage/${certificate_id}.png`; // Placeholder
        const view_url = `/verify/${verification_code}`; // Placeholder

        const insertCertSql = `
            INSERT INTO Certificates
            (certificate_id, activity_id, recipient_external_id, recipient_name, recipient_email, issue_date, verification_code, download_url, view_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        db.run(insertCertSql, [certificate_id, activity.activity_id, recipient_external_id, recipient_name, recipient_email, final_issue_date, verification_code, download_url, view_url], async function(err) {
            if (err) {
                return res.status(500).json({ error: 'Failed to issue certificate.' });
            }
            try {
                // Prepare data for the generator
                const certificateDataForGen = {
                    certificate_id,
                    recipient_name,
                    issue_date: final_issue_date,
                    activity_name: activity.name, // We need to fetch this
                    issuer: activity.issuer // and this
                };

                // Generate the certificate image
                const { generateCertificate } = require('../certificate-generator');
                await generateCertificate(certificateDataForGen, {}); // Passing empty template data for now

            } catch (genError) {
                console.error("Error generating certificate image:", genError);
                // Don't fail the API response, just log the error. The cert is still issued.
            }

            // Fetch the created certificate to return it
            db.get(`SELECT * FROM Certificates WHERE certificate_id = ?`, [certificate_id], (err, newCert) => {
                if(err) {
                    return res.status(500).json({ error: 'Failed to retrieve newly created certificate.' });
                }
                res.status(201).json(newCert);
            });
        });
    });
});

// Endpoint to get a certificate by its ID
router.get('/certificates/:id', (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Certificates WHERE certificate_id = ?`;
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }
        if (row) {
            res.json(row);
        } else {
            res.status(404).json({ error: 'Certificate not found.' });
        }
    });
});

// Endpoint to list all certificates for a recipient
router.get('/recipients/:external_id/certificates', (req, res) => {
    const { external_id } = req.params;
    const sql = `SELECT * FROM Certificates WHERE recipient_external_id = ? ORDER BY issue_date DESC`;
    db.all(sql, [external_id], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: 'Database error.' });
        }
        res.json({ data: rows });
    });
});

module.exports = router;
