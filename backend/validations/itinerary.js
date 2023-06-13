const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateItineraryInput = [
    // always going to use the logged in user anyway
    // check('creator')
    //     .exists({ checkFalsy: true }),
    // check('creatorId')
    //     .exists({ checkFalsy: true }),
    handleValidationErrors
];

module.exports = validateItineraryInput;
