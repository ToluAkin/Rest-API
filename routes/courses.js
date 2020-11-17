'use strict';

const express = require('express');
// Construct a router instance.
const router = express.Router();
// Handler function to wrap each route.
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { Course } = require('../models/course');

const courses = [];

// Returns a list of courses (including the user that owns each course)
router.get('/courses', asyncHandler(async (req, res) => {
    await res.json(courses);
    res.status(200).end();
}));

// Returns the course (including the user that owns the course) for the provided course ID
router.get('/courses/:id', asyncHandler(async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        res.json(course);
        res.status(200).end();
    } catch (error) {
        if (error === 'SequelizeValidationError' || error === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }
}));

// Creates a course, sets the Location header to the URI for the course, and returns no content
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
    try {
        // Get the course from the request body.
        const course = await Course.create(req.body);
        // Get New course
        const courseData = course.get({ plain:true });
        res.status(201).location(`/course/${ courseData.id }`).end();
    } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });
        } else {
            throw error;
        }
    }

}));

// Updates a course and returns no content
router.put('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.update(req.body);
    res.status(204).end();
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    await course.destroy();
    res.status(204).end();
}));

module.exports = router;