const mongoose = require("mongoose");
const { mongoURI: db } = require('../config/keys.js');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { faker } = require('@faker-js/faker');
const Itinerary = require("../models/Itinerary.js");

const NUM_SEED_USERS = 10;
const NUM_SEED_ITINERARIES = 5;
const NUM_SEED_ACTIVITIES = 3;

// Create users
const users = [];

users.push(
    new User ({
        username: 'admin',
        email: 'admin@app.io',
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
    const activities = [];
    for (let i = 0; i < NUM_SEED_ACTIVITIES; i++) {
        activities.push(
            {
                name: faker.word.verb(),
                lat: faker.location.latitude(),
                lng: faker.location.longitude(),
                streetAddress: faker.location.streetAddress(),
                type: "activity",
                duration: faker.number.int({min: 10, max: 60})
            }
        )
    }

    const creator = users[Math.floor(Math.random() * NUM_SEED_USERS)];

    itineraries.push(
        new Itinerary ({
            creator: creator.username,
            creatorId: creator._id,
            activities: activities
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
