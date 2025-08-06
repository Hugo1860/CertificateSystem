const axios = require('axios');
const fs = require('fs');
const { app } = require('./server'); // Import the express app

const API_URL = 'http://localhost:3000/api/v1';
let server;

async function runCoreApiTests() {
    let certificateId;
    const activityExternalId = 'COURSE_ADV_NODE_2024';
    const recipientExternalId = 'USER_JANE_DOE';

    try {
        // --- SETUP ---
        console.log('SETUP: Creating template and activity...');
        const templateResponse = await axios.post(`${API_URL}/templates`, { name: 'Advanced Course Template' });
        const templateId = templateResponse.data.template_id;
        await axios.post(`${API_URL}/activities`, {
            external_id: activityExternalId,
            name: 'Advanced Node.js',
            template_id: templateId,
            issuer: 'Tech Academy'
        });
        console.log('SETUP: Complete.');

        // --- TEST 1: Issue a certificate and check for file creation ---
        console.log('\nTEST: Issuing a new certificate...');
        const issueResponse = await axios.post(`${API_URL}/certificates/issue`, {
            activity_external_id: activityExternalId,
            recipient: {
                external_id: recipientExternalId,
                name: 'Jane Doe',
                email: 'jane.doe@example.com'
            }
        });
        certificateId = issueResponse.data.certificate_id;
        console.log(`SUCCESS: Certificate issued with ID: ${certificateId}`);

        // Allow a moment for the file to be written
        await new Promise(resolve => setTimeout(resolve, 500));

        const imagePath = `./public/images/Storage/${certificateId}.png`;
        if (!fs.existsSync(imagePath)) {
            throw new Error(`TEST FAILED: Certificate image file was not created at ${imagePath}`);
        }
        console.log(`SUCCESS: Certificate image file found at ${imagePath}`);
        // Clean up the created file
        fs.unlinkSync(imagePath);
        console.log('INFO: Cleaned up generated image file.');


    } catch (error) {
        console.error('\n--- A CORE API TEST FAILED ---');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
        throw error;
    }
}

async function main() {
    // Ensure the storage directory exists
    if (!fs.existsSync('./public/images/Storage')){
        fs.mkdirSync('./public/images/Storage', { recursive: true });
    }

    server = app.listen(3000, async () => {
        console.log('Core API test server running on port 3000');
        try {
            await runCoreApiTests();
            console.log('\n✅ All certificate generation tests passed!');
            process.exit(0);
        } catch (e) {
            console.error('\n❌ Certificate generation tests failed!');
            process.exit(1);
        } finally {
            server.close(() => {
                console.log('Core API test server shut down.');
            });
        }
    });
}

main();
