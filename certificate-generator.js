const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateCertificate(certificateData, templateData) {
    const width = 1000;
    const height = 700;
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');

    // Use a default background or a template image
    if (templateData && templateData.background_image_url) {
        try {
            // This is a simplified version. A real implementation would fetch the URL.
            // For now, we assume a local file path for simplicity.
            const background = await loadImage(templateData.background_image_url);
            context.drawImage(background, 0, 0, width, height);
        } catch (e) {
            console.error("Could not load background image. Using default.", e.message);
            context.fillStyle = '#f0f0f0';
            context.fillRect(0, 0, width, height);
        }
    } else {
        context.fillStyle = '#f0f0f0';
        context.fillRect(0, 0, width, height);
    }

    // Certificate Title (from activity)
    context.font = 'bold 40px "Helvetica"';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.fillText('Certificate of Completion', width / 2, 150);

    // Presented to
    context.font = '20px "Helvetica"';
    context.fillText('This certificate is proudly presented to', width / 2, 250);

    // Recipient Name
    context.font = 'bold 50px "Times New Roman"';
    context.fillStyle = '#333333';
    context.fillText(certificateData.recipient_name, width / 2, 320);

    // For completing
    context.font = '20px "Helvetica"';
    context.fillStyle = '#000000';
    context.fillText('for successfully completing the course', width / 2, 400);

    // Activity Name (Course Name)
    context.font = 'italic 30px "Helvetica"';
    context.fillText(certificateData.activity_name, width / 2, 450);

    // Issue Date
    context.font = '16px "Helvetica"';
    context.fillText(`Issued on: ${certificateData.issue_date}`, width / 2, 550);

    // Issuer
    context.font = 'bold 18px "Helvetica"';
    context.fillText(certificateData.issuer, width / 2, 600);


    // Save the file
    const outputPath = `./public/images/Storage/${certificateData.certificate_id}.png`;
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(outputPath, buffer);
    console.log(`Certificate saved to ${outputPath}`);

    return outputPath;
}

module.exports = { generateCertificate };
