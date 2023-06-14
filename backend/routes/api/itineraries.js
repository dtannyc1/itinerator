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

// -------------------- COMMENT CREATE --------------------------------
// POST /itineraries/:id/comments/, create
router.post('/:id/comments', requireUser, async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)

        if (!itinerary) {
            const err = new Error("Itinerary Not Found");
            err.statusCode = 404;
            err.errors = {itinerary: "Itinerary not found"}
            return next(err);
        } else {
            // users can post as many comments as they want
            itinerary.comments.push({
                author: req.user.username,
                authorId: req.user._id,
                body: req.body.body
            })

            itinerary.save()
                .then(itinerary => res.json(itinerary))
                .catch(err => {throw err});
        }
    } catch (error) {
        next(error)
    }
})

// -------------------- LIKE CREATE --------------------------------
// POST /itineraries/:id/likes/, create
router.post('/:id/likes', requireUser, async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)

        if (!itinerary) {
            const err = new Error("Itinerary Not Found");
            err.statusCode = 404;
            err.errors = {itinerary: "Itinerary not found"}
            return next(err);
        } else {
            // users can only have one like
            if (itinerary.likes.some(liker => liker.likerId.toString() === req.user._id.toString())) {
                const err = new Error("Itinerary already liked by user");
                err.statusCode = 422;
                err.errors = {itinerary: "Itinerary already liked by user"}
                return next(err)
            } else {
                itinerary.likes.push({
                    likerId: req.user._id
                })

                itinerary.save()
                    .then(itinerary => res.json(itinerary))
                    .catch(err => {throw err});
            }
        }
    } catch (error) {
        next(error)
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
            activities: req.body.activities,
            comments: [],
            likes: []
        });

        newItinerary.save()
            .then(itinerary => res.json(itinerary))
            .catch(err => {throw err}); // maybe dont throw error?
                // this should be caught in thunk action creator in frontend store
    } catch (error) {
        next(error)
    }
})

// -------------------- COMMENT UPDATE --------------------------------
// UPDATE /itineraries/:id/comments/:commentId, update
router.patch('/:id/comments/:commentId', requireUser, async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
        if (!itinerary) {
            const err = new Error("Itinerary Not Found");
            err.statusCode = 404;
            err.errors = {itinerary: "Itinerary not found"}
            return next(err);
        } else {
            let commentIdx = itinerary.comments.findIndex(comment => comment._id.toString() === req.params.commentId)

            if (commentIdx !== -1){
                let comment = itinerary.comments[commentIdx]

                if (comment.authorId.toString() === req.user._id.toString()) {
                    comment.body = req.body.body;
                    itinerary.comments[commentIdx] = comment;

                    itinerary.save()
                        .then(updatedItinerary => res.json(updatedItinerary))
                        .catch(err => {throw err})
                } else {
                    const err = new Error("Comment Update Error");
                    err.statusCode = 422;
                    err.errors = {comment: "Must be original author to update a comment"}
                    return next(err);
                }
            } else {
                const err = new Error("Comment Not Found");
                err.statusCode = 404;
                err.errors = {comment: "Comment not found"}
                return next(err);
            }
        }
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

// DELETE /itineraries/:id/comments/:id, delete -----------------------------------------
router.delete('/:id/comments/:commentId', requireUser, async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)
        if (!itinerary) {
            const err = new Error("Itinerary Not Found");
            err.statusCode = 404;
            err.errors = {itinerary: "Itinerary not found"}
            return next(err);
        } else {
            let commentIdx = itinerary.comments.findIndex(comment => comment._id.toString() === req.params.commentId)

            if (commentIdx !== -1){
                let comment = itinerary.comments[commentIdx]

                if (comment.authorId.toString() === req.user._id.toString()) {
                    itinerary.comments.splice(commentIdx,1)

                    itinerary.save()
                        .then(updatedItinerary => res.json(updatedItinerary))
                        .catch(err => {throw err})
                } else {
                    const err = new Error("Comment Update Error");
                    err.statusCode = 422;
                    err.errors = {comment: "Must be original author to update a comment"}
                    return next(err);
                }
            } else {
                const err = new Error("Comment Not Found");
                err.statusCode = 404;
                err.errors = {comment: "Comment not found"}
                return next(err);
            }
        }
    } catch (error) {
        next(error)
    }
})

// DELETE /itineraries/:id/likes/:id, delete --------------------------------------------

// DELETE /:id, delete
router.delete('/:id', requireUser, async (req, res, next) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id)

        if (itinerary && req.user._id.toString() === itinerary.creatorId.toString()) {
            itinerary.deleteOne();
            return res.json({msg: "Deleted Itinerary"})
        } else {
            return res.json({msg: "Failed to Delete Itinerary"})
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;
