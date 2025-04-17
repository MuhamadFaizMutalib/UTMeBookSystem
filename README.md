# Authentication System Project

A simple authentication system built with AngularJS, Node.js, and MySQL.

## Features

- User registration
- User login
- Protected dashboard page
- JWT-based authentication

## Prerequisites

- Node.js (v14+ recommended)
- MySQL
- Bower (for frontend dependencies)

## Setup Instructions

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the schema SQL script
source database/schema.sql
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Start the server
npm start
```

The server will run on http://localhost:3000

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install frontend dependencies (if using Bower)
bower install
```

### 4. Access the Application

Open a browser and go to http://localhost:3000

## Project Structure

The project is organized into client and server directories:

- `client/`: Contains AngularJS frontend code
- `server/`: Contains Node.js backend code
- `database/`: Contains MySQL schema

## API Endpoints

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/signin`: Login a user

## Technology Stack

- **Frontend**: AngularJS, Bootstrap
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)