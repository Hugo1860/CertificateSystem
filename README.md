# Electronic Certificate Management System

<div align="center">
  <img src="images/logo.png" alt="System Logo" width="120" height="120">
  
  [![License](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
  [![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen.svg)](https://nodejs.org/)
  [![Express](https://img.shields.io/badge/express-4.21.1-orange.svg)](https://expressjs.com/)
</div>

## 📋 Project Overview

The Electronic Certificate Management System is a modern certificate creation and management platform that provides professional electronic certificate solutions for educational institutions, training centers, and other organizations. The system supports multiple certificate template styles with fully customizable elements, greatly expanding its applicability.

## ✨ Key Features

### 🎨 Certificate Design
- **Multiple Template Styles**: Various professional certificate templates to choose from
- **Visual Editing**: WYSIWYG certificate preview functionality
- **Customizable Elements**: Support for customizing certificate titles, course content, institution information, etc.
- **Flexible Layout**: Font size adjustment and border color customization
- **High-Quality Export**: Generate high-quality certificate images using HTML5 Canvas technology

### 📊 Batch Management
- **Batch Generation**: Generate certificates for multiple students at once
- **Smart Numbering**: Automatically generate unique certificate numbers
- **Batch Download**: Support for packaging and downloading all generated certificates

### 🔍 Record Management
- **Generation Records**: Complete tracking of all certificate generation history
- **Smart Search**: Multi-dimensional search by name, certificate number, course content, etc.
- **Data Export**: Batch download support for search results

### 📱 Mobile Support
- **Mobile Query**: Dedicated mobile interface for certificate queries
- **Responsive Design**: Perfect adaptation to various screen sizes
- **Convenient Access**: Query certificate information anytime, anywhere

## 🚀 Quick Start

### System Requirements
- Node.js >= 14.0.0
- npm or yarn package manager
- Modern browser (ES6+ support)

### Installation Steps

1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd CertificateSystem
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Service**
   ```bash
   npm start
   ```

4. **Access System**
   Open `http://localhost:3000` in your browser

## 📚 User Guide

### Certificate Creation Process

1. **Information Input**
   - Fill in certificate information in the left form area
   - Support batch input of student names (one per line)
   - Enter basic information such as certificate title, course name, etc.

2. **Preview & Adjustment**
   - Real-time certificate preview
   - Adjust font size and border colors
   - Confirm certificate content accuracy

3. **Batch Generation**
   - Click the "Generate Certificate" button
   - System automatically generates individual certificates for each student
   - Certificates are saved to `images/Storage/` directory

4. **Download Management**
   - Support individual certificate downloads
   - Support batch package downloads
   - Unified management through record management interface

### Page Functions

| Page | Function Description | Access Path |
|------|---------------------|-------------|
| Main Page | Certificate creation and editing | `/certificate.html` |
| Record Management | View and manage generation records | `/record.html` |
| Mobile Query | Mobile certificate query | `/mobile-query.html` |

## 🗂️ Project Structure

```
CertificateSystem/
├── certificate.html          # Main certificate editing page
├── record.html              # Record management page
├── mobile-query.html        # Mobile query page
├── script.js               # Main business logic
├── record.js               # Record management scripts
├── mobile-query.js         # Mobile query scripts
├── server.js               # Express server
├── styles.css              # Main stylesheet
├── record.css              # Record page styles
├── package.json            # Project configuration
├── images/                 # Image resources directory
│   ├── logo.png           # System logo
│   └── Storage/           # Certificate storage directory
└── README.md              # Project documentation
```

## 🔧 Configuration

### Server Configuration
The system uses Express framework for web services, with default port 3000. Configuration can be adjusted by modifying the `server.js` file:

```javascript
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
```

### Certificate Template Customization
Certificate styles are customized through CSS, with the main stylesheet being `styles.css`. You can modify the following classes to customize certificate appearance:

- `.certificate`: Main certificate container
- `.student-name`: Student name styling
- `.cn-title`: Certificate title styling
- `.course-name`: Course name styling

## 🛠️ Technology Stack

- **Frontend Technologies**
  - HTML5 / CSS3
  - Vanilla JavaScript (ES6+)
  - Material Icons
  - HTML2Canvas (Certificate Generation)

- **Backend Technologies**
  - Node.js
  - Express.js

- **Storage Solutions**
  - Local File System
  - LocalStorage (User Settings)

## 📋 Upcoming Features

- [ ] Database Integration (MySQL/MongoDB)
- [ ] User Permission Management
- [ ] More Certificate Templates
- [ ] Digital Certificate Signatures
- [ ] API Development
- [ ] Unit Test Coverage

## 🤝 Contributing

Welcome to submit Issues and Pull Requests to improve the project!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 Changelog

### v1.0.0 (2025-01-xx)
- 🎉 Initial project release
- ✅ Basic certificate creation functionality
- ✅ Batch generation and download
- ✅ Record management system
- ✅ Mobile support

## 📞 Contact

For questions or suggestions, please contact us through:

- Project Issues: [GitHub Issues](https://github.com/your-repo/issues)
- Email: your-email@example.com

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <p>💝 If this project helps you, please consider giving it a Star ⭐</p>
  <p>Made with ❤️ by Certificate System Team</p>
</div>