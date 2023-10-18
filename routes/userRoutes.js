const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

// je crée une route secondaire qui va contenir toutes les routes de mon API qui ont besoin d'un user
router
    .route('/')
    // je protège ma route avec le middleware protect
    // le userController.findAllUsers, sert à afficher tous les users
    .get(authController.protect,userController.findAllUsers)

router
    .route('/login')
    // le authController.login, sert à se connecter
    .post(authController.login)

router
    .route('/signup')
    // le authController.signup, sert à s'inscrire
    .post(authController.signup)

module.exports = router;