const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Itinerary = mongoose.model('Itinerary');
const { isProduction } = require('../../config/keys');

const router = express.Router();

// GET /:id, show
// GET /, index of most recent itineraries

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
        const itineraries = await Itinerary.find({ author: user._id })
                                        .sort({ createdAt: -1 })
                                        .populate("author", "_id username");
        return res.json(itineraries);
    }
    catch(err) {
      return res.json([]);
    }
})

// POST /, create
// UPDATE /:id, update
// DELETE /:id, delete
