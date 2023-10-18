let coworkings = require('../mock-coworkings');
const { CoworkingModel, ReviewModel, sequelize } = require('../db/sequelize');
const { Op, UniqueConstraintError, ValidationError, QueryTypes } = require('sequelize');
// =====================================================================================================


// api/coworkings

// ==========
// GET
exports.findAllCoworkings = (req, res) => {
    if(req.query.search){
        // notre recherche avec paramètres
        CoworkingModel.findAll({ where: { name: {[Op.like] : `%${req.query.search}%`} } })
        .then((elements)=>{
            if(!elements.length){
                return res.json({message: "No coworking found with this name"})    
            }
            const msg = 'Coworkings list has been retrieved from database.'
            res.json({message: msg, data: elements})
        })
        .catch((error) => {
            const msg = 'One error occured'
            res.status(500).json({message: msg})
        })
    } else {
        CoworkingModel.findAll({ 
            include: ReviewModel 
        })
        .then((elements)=>{
            const msg = 'Coworkings list has been retrieved from database.'
            res.json({message: msg, data: elements})
        })
        .catch((error) => {
            const msg = 'an error occured'
            res.status(500).json({message: msg})
        })
    }
}

exports.findAllCoworkingsByReview = (req, res) => {
    const minRate = req.query.minRate || 4
    CoworkingModel.findAll({
        include: ReviewModel,
        where:{
            rating: {[Op.gte]: 4}
        }
    })
    .then((elements)=>{
        const msg = 'Coworkings list has been retrieved from database.'
        res.json({message: msg, data: elements})
    })
    .catch((error) => {
        const msg = 'an error occured'
        res.status(500).json({message: msg})
    })
}

exports.findAllCoworkingsByReviewSQL = (req, res) => {
    return sequelize.query('SELECT name, rating FROM `coworkings` LEFT JOIN `reviews` ON `coworkings`.`id` = `reviews`.`coworkingId`',
        {
            type: QueryTypes.SELECT
        }
    )
        .then(coworkings => {
            const message = `Il y a ${coworkings.length} coworkings comme résultat de la requête en SQL pur.`
            res.json({ message, data: coworkings })
        })
        .catch(error => {
            const message = `La liste des coworkings n'a pas pu se charger. Reessayez ulterieurement.`
            res.status(500).json({ message, data: error })
        })
}

// ==========
// POST
exports.createCoworking = (req, res) => {
    console.log(req.body);
    let newCoworking = req.body;
    // Synchronisation du modèle avec la base de données
    CoworkingModel.create({
        name: req.body.name,
        price: req.body.price,
        address: req.body.address,
        picture: req.body.picture,
        superficy: req.body.superficy,
        capacity: req.body.capacity,
    })
    .then (()=> {
        const msg = `The coworking ${newCoworking.name} have been created`;
        res.json({ message: msg, data: newCoworking })
    })
    .catch((error) => {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error }) 
        }
        res.status(500).json(error)
    })
}
// =====================================================================================================



// api/coworkings/id

// ==========
// GET 
exports.findCoworkingByPk = (req, res) => {
    // Afficher le nom du coworking qui correspond à l'id en paramètre
    CoworkingModel.findByPk(req.params.id, { 
        include: ReviewModel 
    })
    .then((coworking) => {
        if (coworking === null) {
            const message = `Coworking not found.`
            res.status(404).json({ message })
        } else {
            const msg = `Coworking ${coworking.name} has been retrieved from database.`
            res.json({ msg, data: coworking })
        }
    })
    .catch(error => {
        if (error instanceof ValidationError || error instanceof UniqueConstraintError) {
            return res.status(400).json({ message: error.message, data: error })
        }
        const message = `Impossible to retrieve coworking.`
        res.status(500).json({ message, data: error })
    })
}

// ==========
// PUT
exports.updateCoworking = (req, res) => {
    CoworkingModel.update(req.body, {
        where: {
            id: req.params.id
        }
    })

    .then((coworking) => {
        // retourner la valeur d'une promesse permet de transmettre une erreur le cas échéant, rappel nécessaire
        return CoworkingModel.findByPk(req.params.id)
            .then(coworking => {
                if (coworking === null) {
                    const message = `Coworking not found.`
                    res.status(404).json({ message })
                } else {
                    const message = `Coworking ${coworking.name} has been updated.`
                    res.json({ message, data: coworking });
                }
            })
    })
    
    .catch((error) => {
        if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
            return res.status(400).json({ message: error.message, data: error })
        }

        const message = `Impossible to update coworking.`
        res.status(500).json({ message, data: error })
    })
}

// ==========
// DELETE
exports.deleteCoworking = (req, res) => {
    CoworkingModel.findByPk(req.params.id)
    .then(coworking => {

        if (coworking === null) {
            const message = `Coworking not found.`
            return res.status(404).json({ message })

        } else {
            coworking.destroy({
                where: {id: req.params.id}
            })

            .then (()=> {
                const message = `The coworking ${coworking.name} have been deleted.`
                res.json({ message, data: coworking })
            })

            .catch(error => {
                const message = `Impossible to delete coworking.`
                res.status(500).json({ message, data: error })
            })
        }

    })

    .catch(error => {
        res.status(400).json({ message: error.message, data: error })   
    })      
}
// =====================================================================================================


