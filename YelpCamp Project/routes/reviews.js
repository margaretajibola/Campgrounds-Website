const express = require('express');
const router = express.Router({mergeParams: true}); //mergeParams is to get access to all params

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

const { reviewSchema } = require('../schemas.js');

const Campground = require('../models/campground');
const Review = require('../models/review')

const validateReview = (req, res, next) => { // middlware to handle validations using joi 
    const { error } = reviewSchema.validate(req.body);
    if(error){
        const msq = error.details.map(el => el.message).join(',');
        throw new ExpressError(msq, 400)
    }
    else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review');
    res.redirect(`/campgrounds/${campground._id}`);

}))

router.delete('/:reviewId', catchAsync(async(req, res) => {
    const { id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findById(reviewId);
    req.flash('success', 'Successfully deleted review');
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;