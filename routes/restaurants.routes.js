const router = require("express").Router()
const Restaurant = require('./../models/Restaurant.model')



// ----- 1. All restaurants
router.get("/", (req, res, next) => {

    Restaurant
        .find()
        .then(allRestaurants => res.json(allRestaurants))
        .catch(err => res.status(500).json(err))
})


// ----- 2. New restaurant
router.get("/add-new", (req, res, next) => {

    res.render('restaurants/new-restaurant')
})

router.post("/", (req, res, next) => {

    const { name, adress } = req.body

    Restaurant
        .create({ name, adress })
        .then(() => res.status(200).json({ message: 'created' }))
        .catch(err => res.status(500).json(err))
})



module.exports = router
