const { body } = require('express-validator');


module.exports.campgroundSchema = [
    body('campground.price')
        .notEmpty().withMessage('Price is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('campground.location')
        .notEmpty().withMessage('Location is required').escape(),
    body('campground.title')
        .notEmpty().withMessage('Title is required').escape(),
    body('campground.description')
        .notEmpty().withMessage('Description is required').escape()
];

module.exports.reviewSchema = [
    body('review.rating')
        .notEmpty().withMessage('Rating is required')
        .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('review.body')
        .notEmpty().withMessage('Review body is required').escape()
];


