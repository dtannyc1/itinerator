const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lng: {
        type: Number,
        required: true
    },
    streetAddress: {
        type: String,
        required: true
    },
    type: String,
    rating: Number,
    photoURLs: [String],
    price: Number,
    url: String,
    duration: Number // in minutes?
}, {
    timestamps: true
});

const commentSchema = new Schema({
    body: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: true
    },
}, {
    timestamps: true
});

const likeSchema = new Schema({
    likerId: {
        type: Schema.Types.ObjectId,
        required: true
    }
})

const itinerarySchema = new Schema({
    creator: { // creator
        type: String,
        required: true
    },
    creatorId: { // creator id
        type: Schema.Types.ObjectId,
        required: true
    },
    title: String,
    activities: {
        type: [activitySchema],
        default: undefined,
        required: true,
        validate: {
            validator: function() {
                return this.activities.length > 0;
            },
            message: "Activities can't be empty"
        }
    }, // array of activities
    comments: [commentSchema],
    likes: [likeSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
