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
        photoURLs: [String],
        price: Number,
        rating: Number,
        url: String,
        duration: Number // in minutes?
    }, {
        timestamps: true
});

const itinerarySchema = new Schema({
        creator: { // creator
            type: String,
            required: true
        },
        creatorId: { // creator id
            type: Schema.Types.ObjectId,
            required: true
        },
        activities: [activitySchema] // array of activities
    }, {
        timestamps: true
});

module.exports = mongoose.model('Itinerary', itinerarySchema);
