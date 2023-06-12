const express = require('express');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Itinerary = mongoose.model('Itinerary');
const passport = require('passport');
const { isProduction } = require('../../config/keys');

const router = express.Router();

// GET /itineraries/:id, show
// GET /itineraries, index
// POST /itineraries, create
// UPDATE /itineraries, update
// DELETE /itineraries, delete
