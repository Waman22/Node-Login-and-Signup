# Login-and-Signup-Nodejs

User Management System

Introduction

This is a user management system built using Node.js with Express.js, MySQL, and EJS for rendering dynamic web pages. The system allows users to register, log in, and access a dashboard securely. It uses bcrypt.js for password hashing and express-session for session management.

Features

User Registration

User Login with Password Hashing

Session-Based Authentication

Dashboard for Logged-in Users

Flash Messages for Notifications

Secure Password Storage using bcrypt.js

MySQL Database Connection with Auto Table Creation

Static File Serving

Technologies Used

Backend: Node.js, Express.js

Database: MySQL

Frontend: HTML, CSS, EJS

Security: bcrypt.js (for password hashing), express-session (for session management)

Utilities: dotenv (for environment variables), multer (for file uploads), QRCode (for generating QR codes)

Installation & Setup

Prerequisites

Node.js installed

MySQL server installed

Steps to Install

Install dependencies:

npm install

Create a .env file in the root directory and configure the following:

DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=Cognifyz_database
SESSION_SECRET=your-secret-key
NODE_ENV=development

Start the MySQL server and create a database manually if needed.

Start the server:

node server.js // is the system which doesnt use mysql it // Temporary Storage (Array to store user submissions)


node serverSql.js //runs the system with mysql databse 

The application will run on http://localhost:3000

Database Structure

The system uses a MySQL database with a User table structured as follows:

User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL
);


Security Measures

Passwords are hashed using bcrypt before storing in the database.

Sessions are managed securely with express-session.

Flash messages provide user-friendly feedback on login/registration attempts.

Sensitive data such as database credentials and session secrets are stored in .env.





