# alx-files_manager

## Project Overview

The **alx-files_manager** project is a comprehensive back-end application designed to facilitate file management. This project serves as a culmination of the back-end trimester, incorporating essential technologies and concepts such as authentication, Node.js, MongoDB, Redis, pagination, and background processing.

The primary objective of this project is to create a simple platform that allows users to upload and view files with various functionalities.

## Features

- **User Authentication**: Secure user authentication via token-based authentication.
- **File Management**:
  - List all uploaded files.
  - Upload new files to the platform.
  - Change permissions for individual files.
  - View files directly from the platform.
  - Generate thumbnails for image files to enhance user experience.

## Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **MongoDB**: NoSQL database for storing file metadata and user information.
- **Redis**: In-memory data structure store used for caching and session management.
- **Express.js**: Web framework for Node.js to handle routing and middleware.
- **Multer**: Middleware for handling file uploads.
- **JWT (JSON Web Tokens)**: For secure user authentication.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version X.X.X)
- [MongoDB](https://www.mongodb.com/) (version X.X.X)
- [Redis](https://redis.io/) (version X.X.X)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/alx-files_manager.git
   ```

2. Navigate to the Project

    ```bash
    cd alx-files_manager
    ```

3. Install all the requirements `make sure that you have *package.json* before call this`

    ```bash
    npm install
    ```


### API endpoints

- **POST /auth/login**: Authenticate user and receive a token.
- **GET /files**: Retrieve a list of all files.
- **POST /files**: Upload a new file.
- **PATCH /files/:id/permissions**: Change permissions of a specific file.
- **GET /files/:id**: View a specific file.
- **GET /files/:id/thumbnail**: Generate and retrieve a thumbnail for an image file- 
