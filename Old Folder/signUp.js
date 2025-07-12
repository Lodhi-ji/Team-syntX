const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// PostgreSQL configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'CodeSprint_DB',
  password: 'Suyash@15',
  port: 1504,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully!');
  }
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Serve signup page
app.get(['/signup', '/signUp'], (req, res) => {
  res.sendFile(path.join(__dirname, 'sign_up.html'));
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Handle login POST (dummy logic, just redirect to home for now)
app.post('/login', async (req, res) => {
  // You can add real authentication here
  res.redirect('/');
});

// Handle signup POST
app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;
    if (password !== confirm_password) {
      return res.redirect('/signup');
    }
    // Check if user exists
    const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (checkUser.rows.length > 0) {
      return res.redirect('/signup');
    }
    // Insert new user
    await pool.query(
      'INSERT INTO users (full_name, email, password) VALUES ($1, $2, $3)',
      [name, email, password]
    );
    // Redirect to home after successful signup
    res.redirect('/');
  } catch (error) {
    console.error('Database error:', error);
    res.redirect('/signup');
  }
});

// Serve homepage (for Back to Home)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'homepage.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


