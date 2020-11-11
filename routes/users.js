'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();

// This array is used to keep track of user records as they are created.
const users = [];

// Returns the currently authenticated user.
router.get('/users', (req, res) => {
    res.json(users);
    res.status(200).end();
});

router.post('/users', (req, res) => {
    // Get the user from the request body.
    const user = req.body;
    users.push(user);
    res.status(201).end();
});

module.exports = router;