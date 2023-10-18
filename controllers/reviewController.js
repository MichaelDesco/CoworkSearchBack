const { ReviewModel, UserModel, CoworkingModel } = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError } = require('sequelize');

exports.findAllReviews = (req, res) => {
    ReviewModel.findAll({
        include: [UserModel.scope(`withoutpassword`), CoworkingModel]
    }
        
    )
    .then((elements)=>{
        const message = 'Reviews list has been retrieved.'
        res.json({message, data: elements})
    })
    .catch((error) => {
        const message = 'An error occured.'
        res.status(500).json({message, data: error})
    }) 
}

exports.createReview = (req, res) => {
    ReviewModel.create({
        content: req.body.content,
        rating: req.body.rating,
        UserId: req.body.UserId,
        CoworkingId: req.body.CoworkingId
    })
    .then ((result)=> {
        const message = `The review has been created`;
        res.json({message, data: result})
    })
    .catch((error) => {
        const message = 'An error occured.'
        res.status(500).json({message, data: error})
    })
}

exports.updateReview = (req, res) => {
    ReviewModel.update(req.body,{ 
        where: {
             id: req.params.id 
        } })
    .then((result) => {
        if(result === null){
            const message = 'No review found with this id.'
            res.status(404).json({message})
        } else {
            const message = 'The review has been updated.'
            res.json({message, data: result})
        }})
    
    .catch((error) => {
        if(error instanceof UniqueConstraintError || error instanceof ValidationError){
            return res.status(400).json({message: error.message, data: error.errors})
    }
        const message = 'An error occured.'
        res.status(500).json({message, data: error})
    })
}