const express = require('express'); //Framework for building the web application.
const mysql = require('mysql2');    //Library for interacting with MySQL databases
const bcrypt = require('bcryptjs'); //Library for securely hashing passwords.


const crypto = require('crypto');  //generating random bytes, hashing, and encryption/decryption.
const path = require('path'); //Built-in library for handling file paths.

const bodyParser = require('body-parser');  //Middleware for parsing request bodies
const QRCode = require("qrcode");  //Library for generating QR codes.
const session = require('express-session');  //Middleware for managing user sessions.
const flash = require('connect-flash');  //Middleware for displaying flash messages.
const multer = require("multer");        //Middleware for handling file uploads.
const fs = require("fs");                //Built-in library for file system operations.
require('dotenv').config(); // Ensure dotenv is loaded first

const app = express();

// MySQL connection settings from .env
const db_config = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'Cognifyz_database' // Use 'Cognifyz_database' as fallback
};

// Set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));
app.use(flash());

// Serve static files (HTML, CSS, JS) from the 'public' folder
app.use(express.static('public'));
// Set the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Ensure the path to views is correct

// Create MySQL connection
const db = mysql.createConnection(db_config);

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Could not connect to MySQL:', err);
        process.exit();
    }
    console.log('Connected to MySQL database');
});

// Function to create database if it doesn't exist
const createDatabase = () => {
    const connection = mysql.createConnection({
        host: db_config.host,
        user: db_config.user,
        password: db_config.password
    });

    connection.connect();

    connection.query("CREATE DATABASE IF NOT EXISTS ??", [process.env.DB_NAME || 'Cognifyz_database'], (err, results) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log(`Database '${process.env.DB_NAME || 'Cognifyz_database'}' created or already exists.`);
    });

    connection.end();
};


// function to initiates the creation of multiple tables
// Function to initialize tables
const initDb = () => {
    // Create User table
    db.query(`
        CREATE TABLE IF NOT EXISTS User (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            name VARCHAR(255) NOT NULL,
            surname VARCHAR(255) NOT NULL,
            username VARCHAR(255) NOT NULL,
            password VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            UNIQUE(username)
        );
    `, (err, results) => {
        if (err) throw err;
        console.log("User table initialized successfully.");
    });
};


// Initialize the database and tables
createDatabase();
initDb();


// Route: Home Page
app.get('/', (req, res) => {
    // Render the home page with flash messages (if any)
    res.render('index', { messages: req.flash() });
});



// Route: About Page
app.get('/about', (req, res) => {
    res.render('about', { messages: req.flash() });
});

// Route: Services Page
app.get('/services', (req, res) => {
    res.render('services', { messages: req.flash() });
});

// Route: Contact Page
app.get('/contact', (req, res) => {
    res.render('contact', { messages: req.flash() });
});



// Route: Display Registration Form
app.get('/register', (req, res) => {
    // Render the registration form with flash messages (if any)
    res.render('register', { messages: req.flash() });
});

// Signup POST request
app.post('/register', async (req, res) => {
    const { name, surname, username, password, email } = req.body;

    // Check if user already exists
    db.query('SELECT * FROM User WHERE username = ? OR email = ?', [username, email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error occurred');
        }

        if (result.length > 0) {
            return res.status(400).send('Username or email already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        db.query('INSERT INTO User (name, surname, username, password, email) VALUES (?, ?, ?, ?, ?)', [name, surname, username, hashedPassword, email], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error occurred');
            }
            res.redirect('/login'); // Redirect to the login page
        });
    });
});

// Route: Display Login Form
app.get('/login', (req, res) => {
    // Render the login form with flash messages (if any)
    res.render('login', { messages: req.flash() });
});


// Login POST request
app.post('/login', (req, res) => {
    const { email, password } = req.body;

   
    // Check if user exists (only check for email in the query)
    db.query('SELECT * FROM User WHERE email = ?', [email], async (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Database query error occurred');
        }

        if (result.length === 0) {
            req.flash('error', 'Admin does not exist'); // Store flash message
            return res.status(404).send('Admin does not exist');
        }
        

        // Get the admin data
        const admin = result[0];

        // Check password with bcrypt
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).send('Incorrect password');
        }

        // Set session
        req.session.userId = admin.id; // Assuming `admin.id` is the correct user identifier
        res.redirect('/dashboard');
    });
});



app.get('/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    // Fetch the logged-in user's data
    db.query('SELECT * FROM User WHERE id = ?', [req.session.userId], (err, userResult) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching user data');
        }

        if (userResult.length === 0) {
            return res.status(404).send('User  not found');
        }

        const user = userResult[0];

        // Render the dashboard template with the logged-in user's details
        res.render('DASHBOARD', { messages: req.flash(), user });
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log server start message
});