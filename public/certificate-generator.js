// A centralized module for generating certificate images.

// This function creates a certificate's HTML structure, populates it with data,
// and uses html2canvas to generate an image blob.
async function generateCertificateImage(record) {
    if (!record) {
        throw new Error('Certificate record data is required.');
    }

    // Create a temporary container for rendering the certificate off-screen
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px'; // Position off-screen
    hiddenContainer.style.width = '950px'; // Standard width for consistent rendering
    document.body.appendChild(hiddenContainer);

    // Create a wrapper element to handle borders correctly
    const wrapperElement = document.createElement('div');
    wrapperElement.className = 'certificate-wrapper';
    wrapperElement.style.position = 'relative';
    wrapperElement.style.padding = '18px';
    wrapperElement.style.border = '10px solid #FF6634'; // Default border color
    wrapperElement.style.backgroundColor = 'white';

    // Create the main certificate element
    const certificateDiv = document.createElement('div');
    certificateDiv.className = 'certificate';
    // Basic styles are applied here. More complex styles should be in a shared CSS file if possible.
    certificateDiv.style.cssText = `
        background-color: white;
        border: 2px solid #FF6634;
        padding: 20px;
        width: 100%;
        position: relative;
        box-shadow: 0 0 20px rgba(0,0,0,0.1);
        box-sizing: border-box;
    `;

    // Certificate HTML structure (extracted and adapted from mobile-query.js)
    certificateDiv.innerHTML = `
        <div class="certificate-header" style="text-align: center; margin-bottom: 40px;">
            <div class="logo" style="text-align: left; margin-bottom: 20px; padding-left: 20px;">
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgLTk2MCA5NjAgOTYwIiB3aWR0aD0iMjQiIGZpbGw9IiM1RjYzNjgiPjxwYXRoIGQ9Ik00NzkuNzgyLTI0MHEtMTQuNzgzIDAtMjkuNTY1LTUuNXQtMjcuMjE3LTE4LjVMMjA3LTQ4MHEtMTQtMTQtMTkuNS0yOXQtNS41LTMxcTAtMTYgNS41LTMxdDE5LjUtMjlsMjE2LTIxNnExMi0xMiAyNy4yMTctMTcuNXQyOS41NjUtNS41cTE0Ljc4MyAwIDI5LjU2NSA1LjV0MjcuMjE3IDE3LjVsMjE2IDIxNnExNSAxNCAyMC41IDI5dDUuNSAzMXEwIDE2LTUuNSAzMXQtMjAuNSAyOUw1MzYuNTY1LTI2NHEtMTIuNDM1IDEzLTI3LjIxNyAxOC41dC0yOS41NjUgNS41Wm0wLTYwbDIxNi0yMTZxMy0zIDMtN3QtMy03TDQ3OS43ODItNzQ2cS0zLTMtNy0zdC03IDNMMjQ5LTUzMHEtMyAzLTMgN3QzIDdsMjE2Ljc4MiAyMTZxMyAzIDcgM3Q3LTNabTAtMjIwWiIvPjwvc3ZnPg==" alt="Logo" style="height: 40px; width: auto; display: block; filter: brightness(0.4);">
            </div>
            <h1 class="en-title" style="color: #FF6634; font-size: 24px; margin-bottom: 10px;">CERTIFICATE OF COURSE COMPLETION</h1>
            <h1 class="cn-title" style="color: #FF6634; font-size: 36px; font-weight: bold; margin-bottom: 40px;">课程毕业证书</h1>
        </div>
        <div class="certificate-content" style="text-align: center; margin: 65px 0;">
            <div class="student-name" style="font-size: 24px; margin-bottom: 30px; position: relative; display: inline-block; color: #202124;">
                <div style="position: absolute; bottom: -10px; left: 0; width: 100%; height: 1px; background-color: #000;"></div>
            </div>
            <div class="completion-text" style="font-size: 18px; color: #DAA520; margin-bottom: 20px;"></div>
            <div class="course-name" style="font-size: 24px; font-weight: bold; margin-bottom: 30px; color: #202124;"></div>
            <div class="award-text" style="font-size: 18px; color: #DAA520; margin-top: 40px;">特授此证书</div>
        </div>
        <div class="certificate-footer" style="display: flex; justify-content: space-between; margin-top: 60px; padding: 0 20px;">
            <div class="issue-date" style="font-size: 14px; color: #202124;">
                <span>签发日期：</span>
                <span class="date"></span>
            </div>
            <div class="certificate-number" style="font-size: 14px; color: #202124;">
                <span>证书编号：</span>
                <span class="number"></span>
            </div>
            <div class="institution" style="text-align: right; color: #202124;">
                <span>Institution</span>
                <span class="cn-text"></span>
            </div>
        </div>
    `;

    // Populate the template with data from the record
    certificateDiv.querySelector('.student-name').prepend(document.createTextNode(record.name || ''));
    certificateDiv.querySelector('.completion-text').textContent = record.certificateType || '';
    certificateDiv.querySelector('.course-name').textContent = record.courseName || '';
    certificateDiv.querySelector('.issue-date .date').textContent = record.issueDate || '';
    certificateDiv.querySelector('.certificate-number .number').textContent = record.id || '';
    certificateDiv.querySelector('.institution .cn-text').textContent = record.institution || '';

    // Assemble the final structure
    wrapperElement.appendChild(certificateDiv);
    hiddenContainer.appendChild(wrapperElement);

    try {
        // Use html2canvas to render the element
        const canvas = await html2canvas(wrapperElement, {
            scale: 2, // Higher scale for better quality
            backgroundColor: '#ffffff',
            logging: false,
            useCORS: true,
        });

        // Convert canvas to blob
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, 'image/png');
        });

    } finally {
        // Clean up the temporary element from the DOM
        document.body.removeChild(hiddenContainer);
    }
}
