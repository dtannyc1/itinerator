const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Itinerary = mongoose.model('Itinerary');
const { requireUser, restoreUser } = require('../../config/passport');
const { isProduction } = require('../../config/keys');
const validateItineraryInput = require('../../validations/itinerary');

const router = express.Router();

// GET /users/:id, index of itineraries for specific user
router.get('/users/:userId', async (req, res, next) => {
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
router.post('/', requireUser, validateItineraryInput, async (req, res, next) => {
    try {
        // does not validate activities?
        // will just stop users on backend
        const newItinerary = new Itinerary({
            creator: req.user.username,
            creatorId: req.user._id,
            activities: req.body.activities
        });

        newItinerary.save()
            .then(itinerary => res.json(itinerary))
            .catch(err => {throw err}); // maybe dont throw error?
                // this should be caught in thunk action creator in frontend store
    } catch (error) {
        next(error)
    }
})

// UPDATE /:id, update
router.patch('/:id', requireUser, validateItineraryInput, async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
        if (!itinerary) {
            const err = new Error("Itinerary Not Found");
            err.statusCode = 404;
            err.errors = {itinerary: "Itinerary not found"}
            return next(err);
        } else if (req.user._id.toString() !== itinerary.creatorId.toString()) {
            const err = new Error("Itinerary Update Error");
            err.statusCode = 422;
            err.errors = {users: "Must be original creator to update an itinerary"}
            return next(err);
        }
        itinerary.activities = req.body.activities;
        let updatedItinerary = await itinerary.save();
        return res.json(updatedItinerary)
    } catch (error) {
        next(error)
    }
})

// DELETE /:id, delete


module.exports = router;
