'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
// Handler function to wrap each route.
const { asyncHandler } = require('/middleware/async-handler');
const { User } = require('/models/user');

// Construct a router instance.
const router = express.Router();

// This array is used to keep track of user records as they are created.
const users = [];

// Returns the currently authenticated user.
router.get('/users', asyncHandler(async (req, res) => {
    await res.json(users);
    res.status(200).end();
}));

// Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res) => {
    try {
        // Get the user from the request body.
        // await User.create(req.body);
        const user = req.body;
        req.body.password = bcrypt.hashSync(req.body.password, salt)
        await users.push(user);
        res.redirect('/');
        res.status(201).end()
    } catch (error) {
        if (error === 'SequelizeValidationError' || error === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;