const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db'); // Corrected the import to match the folder structure
require('dotenv').config();

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Registration Route
router.post('/register', async (req, res) => {
    const { email, phone, password } = req.body;

    // Validate input
    if (!email || !phone || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Check if email already exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, existingUser) => {
            if (err) {
                console.error('Database error during email check:', err.message);
                return res.status(500).json({ message: 'Server error. Please try again later.' });
            }

            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered.' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            db.run(
                'INSERT INTO users (email, phone, password) VALUES (?, ?, ?)',
                [email, phone, hashedPassword],
                function (err) {
                    if (err) {
                        console.error('Error inserting user:', err.message);
                        return res.status(500).json({ message: 'Server error. Please try again later.' });
                    }

                    res.status(201).json({ message: 'Registration successful' });
                }
            );
        });
    } catch (error) {
        console.error('Unexpected error during registration:', error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        // Check if user exists
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                console.error('Database error during login:', err.message);
                return res.status(500).json({ message: 'Server error. Please try again later.' });
            }

            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Compare password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create JWT token with 15 days expiration
            const token = jwt.sign(
                { id: user.id },
                JWT_SECRET,
                { expiresIn: '15d' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                    is_admin: user.is_admin || false
                }
            });
        });
    } catch (error) {
        console.error('Unexpected error during login:', error.message);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

module.exports = router;
