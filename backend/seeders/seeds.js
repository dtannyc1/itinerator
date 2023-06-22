const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const Itinerary = require("../models/Itinerary.js");
const activities = require("./activitiesList.js")

const NUM_SEED_USERS = 10;
const NUM_SEED_ITINERARIES = 9;
const NUM_SEED_ACTIVITIES = 3;
const NUM_SEED_COMMENTS = 2;

// Create users
const users = [];

users.push(
    new User ({
        username: 'DemoUser',
        email: 'demo@app.io',
        hashedPassword: bcrypt.hashSync('password', 10)
    })
)

for (let i = 1; i < NUM_SEED_USERS; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    users.push(
        new User ({
            username: faker.internet.userName({firstName, lastName}),
            email: faker.internet.email({firstName, lastName}),
            hashedPassword: bcrypt.hashSync(faker.internet.password(), 10)
        })
    )
}

// Create Itineraries
const itineraries = [];
for (let i = 0; i < NUM_SEED_ITINERARIES; i++) {
    // Create Activities
    let activitiesIndices = [];
    while (activitiesIndices.length < NUM_SEED_ACTIVITIES) {
        activitiesIndices.push(Math.floor(Math.random()*activities.length));
        activitiesIndices = [...new Set(activitiesIndices)]
    }

    let newActivitiesSet = [];
    activitiesIndices.forEach(ii => {
        newActivitiesSet.push(activities[ii])
    })

    // Create Comments:
    // check database constraints
    const comments = [];
    let commentAuthors = [];

    while (commentAuthors.length < NUM_SEED_COMMENTS) {
        commentAuthors.push(Math.floor(Math.random() * NUM_SEED_USERS));
        commentAuthors = [...new Set(commentAuthors)];
    }

    for (let j = 0; j < NUM_SEED_COMMENTS; j++) {
        const author = users[commentAuthors[j]];

        const comment = {
            body: faker.lorem.sentences(),
            author: author.username,
            authorId: author._id
        }

        comments.push(comment)
    }

    // Create Likes:
    let likes = [];
    let numLikes = Math.floor(Math.random() * NUM_SEED_USERS);
    while (likes.length < numLikes) {
        likes.push(Math.floor(Math.random() * NUM_SEED_USERS));
        likes = [...new Set(likes)];
    }
    likes = likes.map(likerId => {
        return {
            likerId: users[likerId]._id
        }
    })

    const creator = users[Math.floor(Math.random() * NUM_SEED_USERS)];

    itineraries.push(
        new Itinerary ({
            creator: creator.username,
            creatorId: creator._id,
            activities: newActivitiesSet,
            comments,
            likes,
            title: faker.word.adjective()
        })
    )
}

const insertSeeds = () => {
    console.log("Resetting db and seeding users and itineraries...");

    User.collection.drop()
                   .then(() => Itinerary.collection.drop())
                   .then(() => User.insertMany(users))
                   .then(() => Itinerary.insertMany(itineraries))
                   .then(() => {
                        console.log("Done!");
                        mongoose.disconnect();
                   })
                   .catch(err => {
                        console.error(err.stack);
                        process.exit(1);
                   });
}

mongoose
    .connect(db, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected to MongoDB successfully');
        insertSeeds();
    })
    .catch(err => {
        console.error(err.stack);
        process.exit(1);
});
