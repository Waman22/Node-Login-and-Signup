// simple user login and signup code which uses temporary storage

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true })); // Parse incoming request bodies
app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: true })); // Enable session management
app.use(flash()); // Enable flash messages for status/error notifications

// Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Set the directory for EJS templates
app.set('view engine', 'ejs'); // Use EJS for rendering views

// Serve static files (CSS, JS)
app.use(express.static('public')); // Serve static files from the 'public' directory

// Temporary Storage (Array to store user submissions)
let formDataStore = []; // Array to store user registration data temporarily

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

// Route: Handle Form Submission (POST) - Registration
app.post('/register', (req, res) => {
    const { name, surname,email, username, password } = req.body;

    // Server-side Validation
    if (!name ||!surname|| !email || !username || !password) {
        req.flash('error', 'All fields are required.'); // Flash error message
        return res.redirect('/register'); // Redirect back to the registration form
    }

    // Store in temporary storage
    formDataStore.push({ name,surname, email, username, password }); // Add user data to the array

    req.flash('success', 'Form submitted successfully!'); // Flash success message
    res.redirect('/login'); // Redirect to the login page
});

// Route: Display Login Form
app.get('/login', (req, res) => {
    // Render the login form with flash messages (if any)
    res.render('login', { messages: req.flash() });
});

// Route: Handle Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Server-side validation
    if (!email || !password) {
        req.flash('error', 'Email and password are required.'); // Flash error message
        return res.redirect('/login'); // Redirect back to the login form
    }

    // Check user credentials from formDataStore
    const user = formDataStore.find(user => user.email === email && user.password === password);

    if (!user) {
        req.flash('error', 'Invalid email or password.'); // Flash error message
        return res.redirect('/login'); // Redirect back to the login form
    }

    // Store user session
    req.session.user = email; // Store the user's email in the session
    req.flash('success', 'Login successful!'); // Flash success message
    res.redirect('/dashboard'); // Redirect to the dashboard
});

// Route: Dashboard (Success Page)
app.get('/dashboard', (req, res) => {
    // Render the dashboard with flash messages and user data
    res.render('DASHBOARD', { messages: req.flash(), data: formDataStore });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`); // Log server start message
});