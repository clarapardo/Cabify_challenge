const router = require("express").Router()
const Restaurant = require('./../models/Restaurant.model')


// ----- 1. All restaurants
router.get("/", (req, res) => {

    Restaurant
        .find()
        .then(allRestaurants => res.json(allRestaurants))
        .catch(err => res.status(500).json(err))
})


// ----- 2. New restaurant
router.post("/", (req, res) => {

    const { name, adress } = req.body

    if (name.length === 0 || adress.length === 0) {
        throw res.status(500).json({ message: 'please fill all the inputs' })
    }

    Restaurant
        .findOne({ name })
        .then(restaurant => {

            if (!restaurant) {

                Restaurant
                    .create({ name, adress })
                    .then(() => res.status(200).json({ message: 'created' }))
                    .catch(err => res.status(500).json(err))
            } else {
                res.status(500).json({ message: 'restaurant already added' })
            }
        })
        .catch(err => res.status(500).json(err))
})


//  ----- 3. Remove all restaurant records - (just needed for testing)
router.delete('/', (req, res) => {

    Restaurant
        .remove()
        .then(() => res.status(200).json({ message: 'restaurants deleted correctly' }))
        .catch(err => res.status(500).json(err))
})


module.exports = router
