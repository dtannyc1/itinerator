const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateLoginInput = [
    check('email')
        .exists({ checkFalsy: true }),
    check('password')
        .exists({ checkFalsy: true }),
    handleValidationErrors
];

module.exports = validateLoginInput;
