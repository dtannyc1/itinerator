const { check } = require("express-validator");
const handleValidationErrors = require('./handleValidationErrors');

const validateRegisterInput = [
    check('email')
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage('Email is invalid'),
    check('username')
        .exists({ checkFalsy: true })
        .isLength({ min: 2 })
        .withMessage('Username must be at least 2 characters')
        .isLength({ max: 30 })
        .withMessage("Username must be less than 30 characters"),
    check('password')
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .isLength({ max: 30 })
        .withMessage('Password must be less than 30 characters'),
    handleValidationErrors
];

module.exports = validateRegisterInput;
