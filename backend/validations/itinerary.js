const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateItineraryInput = [
    check('creator')
        .exists({ checkFalsy: true }),
    check('creatorId')
        .exists({ checkFalsy: true }),
    handleValidationErrors
];

module.exports = validateItineraryInput;
