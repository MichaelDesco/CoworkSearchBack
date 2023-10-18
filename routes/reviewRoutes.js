const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(authController.protect, reviewController.findAllReviews)
    .post(authController.protect, reviewController.createReview)

router
    .route('/:id')
    // .put(authController.protect, authController.restrictToOwnUser, reviewController.updateReview)

module.exports = router;