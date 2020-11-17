'use strict';

const express = require('express');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
// Handler function to wrap each route.
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { User } = require('../models/user');

// Construct a router instance.
const router = express.Router();

// Returns the currently authenticated user.
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
    const user = await User.findOne({
        where: {
            emailAddress: req.currentUser.emailAddress
        }
    });
    res.json(user);
}));

// Creates a user, sets the Location header to "/", and returns no content
router.post('/users', asyncHandler(async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, salt)
        }

        // Get the user from the request body.
        await User.create(req.body);
        res.status(201).location('/').end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

module.exports = router;