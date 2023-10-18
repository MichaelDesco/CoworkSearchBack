const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel, ReviewModel } = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError } = require('sequelize');
const privateKey = require('../auth/private_Key.js');



exports.login = (req, res) => {
    if(!req.body.username || !req.body.password){
        const msg = "Username and password are required"
        return res.status(400).json({message: msg})
    }
    UserModel.findOne({ where: { username: req.body.username } })
    .then((user) => {
        if (!user) {
            const msg = 'User not found'
            return res.status(404).json({ message: msg })
        }
        bcrypt.compare(req.body.password, user.password)
        .then(isValid => {
            if (!isValid) {
                const msg = 'Password is not valid'
                return res.status(404).json({ message: msg })
            }
            // json web token
            const token = jwt.sign({
                data: user.id
            }, privateKey, { expiresIn: '1h' });

            const msg = 'You are now logged in'
            user.password = "hidden"
            return res.json({ message: msg, user, token })
        }).catch(err => console.log(err))
    })
    .catch((error) => {
        const msg = 'An error occured'
        res.status(500).json({ message: msg, error})
    })
}

exports.signup = (req, res) => {
    // on récupère le password est on le hash
    bcrypt.hash(req.body.password, 10)
    .then((hash) => {
        // on crée un nouvel utilisateur
        return UserModel.create({
            roles: req.body.roles,
            username: req.body.username,
            password: hash,
            mail: req.body.mail
        })
        .then((userCreated) => {
            const message = `user ${userCreated.username} created`
            return res.status(201).json({ message, data: userCreated })
        })
    })
    .catch (error => {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error })
        }
        const message = 'An error occured'
        return res.status(500).json({ message, data: error })
    })
}


exports.protect = (req, res, next) => {
    const authorizationHeader = req.headers.authorization
    if (!authorizationHeader) {
        const msg = 'Token is necessary to access this route'
        return res.status(401).json({ message: msg })
    }
    try {
    const token = authorizationHeader.split(' ')[1];
    const decoded = jwt.verify(token, privateKey);
    req.userId = decoded.data
    } catch (error) {
        const message = 'Token is not valid'
        return res.status(403).json({ message, data: error })
    }

    return next();
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        UserModel.findByPk(req.userId)
        .then(user => {
            if (!user || !roles.every(role => user.roles.includes(role))) {
                const message = 'Do not have the rights'
                return res.status(403).json({ message, data: error })
            }
            return next();
        })
        .catch(error => {
            const message = 'Not authorized'
            return res.status(500).json({ message, data: error })
        })
    }
}
exports.restrictToOwnUser = () => {
    ReviewModel.findByPk(req.params.id)
    .then(review => {
        if(!review){
            const message = `Review with id ${req.params.id} not found`
            return res.status(404).json({ message, data: error })
        }
        if(review.UserId !== req.userId){
            const message = 'Do not have the rights'
            return res.status(403).json({ message, data: error })
        }
        return next();
    })
    .catch(error => {
        const message = 'Not authorized'
        return res.status(500).json({ message, data: error })
    })
}

