const express = require('express');
const router = express.Router();
const coworkingController = require('../controllers/coworkingController')
const authController = require('../controllers/authController')

// je crée une route principale qui va contenir toutes les routes de mon API
router
    .route('/')
    .get(coworkingController.findAllCoworkings)
    .post(coworkingController.createCoworking)

    router
    // .route('/withReview')
    // .get(coworkingController.findAllCoworkingsByReview)

// je crée une route secondaire qui va contenir toutes les routes secondaires de mon API qui ont besoin d'un id
router
    .route('/:id')
    .get(coworkingController.findCoworkingByPk)
    // .put(authController.protect, coworkingController.updateCoworking)
    // .delete(coworkingController.deleteCoworking)
    // .delete(authController.protect, authController.restrictTo('admin'), coworkingController.deleteCoworking)


module.exports = router;