const express = require('express');
const router = express.Router({mergeParams: true}); //mergeParams is to get access to all params
const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');
const { validateReview , isLoggedIn, isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;