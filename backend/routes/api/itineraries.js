const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Itinerary = mongoose.model('Itinerary');
const { isProduction } = require('../../config/keys');

const router = express.Router();

// GET /users/:id, index of itineraries for specific user
router.get('/user/:userId', async (req, res, next) => {
    let user;
    try {
        user = await User.findById(req.params.userId);
    } catch(err) {
        const error = new Error('User not found');
        error.statusCode = 404;
        error.errors = { message: "No user found with that id" };
        return next(error);
    }
    try {
        const itineraries = await Itinerary.find({ creatorId: user._id })
                                        .sort({ createdAt: -1 });
        return res.json(itineraries);
    }
    catch(err) {
        return res.json([]);
    }
})

// GET /, index of most recent itineraries
router.get('/', async (req, res) => {
    try {
        const itineraries = await Itinerary.find()
                                        .sort({createdAt: -1});
        return res.json(itineraries);
    } catch (err) {
        return res.json([])
    }
})


// GET /:id, show
router.get('/:id', async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
        return res.json(itinerary);
    } catch (err) {
        const error = new Error('Itinerary not found');
        error.statusCode = 404;
        error.errors = { message: "No itinerary found with that id" };
        return next(error);
    }
})

// POST /, create
// UPDATE /:id, update
// DELETE /:id, delete
