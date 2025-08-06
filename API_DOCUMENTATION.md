# Electronic Certificate Management System - API Documentation

## 📋 Project Overview

The Electronic Certificate Management System is a modern certificate creation and management platform. It now includes a full-featured backend API that allows for programmatic integration with external systems like Learning Management Systems (LMS).

## ✨ Key Features

- **API-First Design**: A complete RESTful API for all core functionalities.
- **Dynamic Certificate Generation**: Server-side generation of certificate images (PNG) using Node.js.
- **Database Integration**: Uses SQLite for persistent storage of all certificate data.
- **Decoupled User Management**: Flexible integration with any external user system via external IDs.
- **Legacy Frontend Support**: The original static frontend pages are still available.

## 🚀 Quick Start

### System Requirements
- Node.js >= 14.0.0
- npm

### Installation Steps

1.  **Clone Repository**: `git clone <repository-url>`
2.  **Navigate to Directory**: `cd <repository-directory>`
3.  **Install Dependencies**: `npm install`
4.  **Start Service**: `npm start`
5.  **Access System**: The API will be running at `http://localhost:3000`. The original frontend is at `http://localhost:3000/certificate.html`.

## 🏛️ System Architecture & Design

### User Management Philosophy

This system **does not have an internal user management module** (e.g., user registration, login, etc.). The concept of a "user" or "recipient" is decoupled. The system identifies certificate recipients by a `recipient_external_id`, which should correspond to a user ID in an external system (like an LMS or HR system).

This design choice offers:
- **Flexibility**: Easily integrate with one or more existing user systems without data duplication.
- **Focus**: Allows the certificate system to excel at its core task: managing certificates.

---

## 📖 API Documentation (v1)

All API endpoints are prefixed with `/api/v1`.

### Management API

These endpoints are for internal system administration, like setting up templates and activities.

#### `POST /templates`
Creates a new certificate template.

- **Body**:
  ```json
  {
    "name": "Official Certificate Template",
    "description": "A standard template for all courses.",
    "background_image_url": "https://example.com/bg.png"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Template created successfully.",
    "template_id": "tpl_..."
  }
  ```

#### `POST /activities`
Creates a new activity (e.g., a course or exam) that can issue certificates.

- **Body**:
  ```json
  {
    "external_id": "COURSE_CS101_2024",
    "name": "Introduction to Computer Science",
    "template_id": "tpl_...",
    "issuer": "University Dept."
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Activity created successfully.",
    "activity_id": "act_..."
  }
  ```

### Core API

These endpoints are designed to be called by external systems (e.g., a learning system).

#### `POST /certificates/issue`
Issues a new certificate to a recipient for a specific activity. This is the primary endpoint for automation.

- **Body**:
  ```json
  {
    "activity_external_id": "COURSE_CS101_2024",
    "recipient": {
      "external_id": "USER_12345",
      "name": "Jane Doe",
      "email": "jane.doe@example.com"
    }
  }
  ```
- **Response (201 Created)**: Returns the full certificate object.
  ```json
  {
    "certificate_id": "cert_...",
    "activity_id": "act_...",
    "recipient_external_id": "USER_12345",
    "recipient_name": "Jane Doe",
    "issue_date": "2023-10-28",
    "verification_code": "SN-ABC12345",
    "download_url": "/images/Storage/cert_....png",
    // ... and other fields
  }
  ```

#### `GET /certificates/:id`
Retrieves the details of a single certificate by its unique ID.

- **Response (200 OK)**: Returns the full certificate object.

#### `GET /recipients/:external_id/certificates`
Retrieves a list of all certificates awarded to a specific recipient.

- **Response (200 OK)**:
  ```json
  {
    "data": [
      // ... array of certificate objects
    ]
  }
  ```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Certificate Generation**: `node-canvas`
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## 🗂️ Project Structure

```
CertificateSystem/
├── api/
│   ├── core.js               # Core API routes (issue, query)
│   └── management.js         # Management API routes (templates, activities)
├── public/                 # Static frontend assets
├── certificate-generator.js  # Server-side image generation logic
├── database.js               # SQLite database initialization
├── server.js                 # Express server setup
├── package.json
└── README.md
```

## 📋 Upcoming Features

- [ ] Frontend management dashboard to consume the new APIs
- [ ] More sophisticated certificate template customization
- [ ] Digital certificate signatures
- [ ] Unit and integration test coverage

---

<div align="center">
  <p>💝 If this project helps you, please consider giving it a Star ⭐</p>
</div>
