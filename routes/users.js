'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

// Construct a router instance.
const router = express.Router();

// Handler function to wrap each route.
function asyncHandler(cb) {
    return async (req, res, next) => {
        try {
            await cb(req, res, next);
        } catch (error) {
            // Forward error to the global error handler
            next(error);
        }
    }
}

// This array is used to keep track of user records as they are created.
const users = [];

// Returns the currently authenticated user.
router.get('/users', asyncHandler(async (req, res) => {
    await res.json(users);
    res.status(200).end();
}));

// Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res) => {
    // Get the user from the request body.
    const user = req.body;
    await users.push(user);
    res.redirect('/');
    res.status(201).end()
}));

module.exports = router;