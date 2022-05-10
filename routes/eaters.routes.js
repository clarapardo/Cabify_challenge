const router = require("express").Router()
const Eater = require('./../models/Eater.model')
const Restaurant = require('./../models/Restaurant.model')


// ----- 1. All eaters
router.get("/", (req, res) => {

    Eater
        .find()
        .then(allEaters => res.json(allEaters))
        .catch(err => res.status(500).json(err))
})


// ----- 2. New eater
router.post("/", (req, res) => {

    const { name, email } = req.body

    if (name.length === 0 || email.length === 0) {
        throw res.status(500).json({ message: 'please fill all the inputs' })
    }

    Eater
        .findOne({ email })
        .then(user => {

            if (!user) {

                Eater
                    .create({ name, email })
                    .then(() => res.status(200).json())
                    .catch(err => res.status(500).json(err))
            } else {
                res.status(500).json({ message: 'email already added' })
            }
        })
        .catch(err => res.status(500).json(err))
})


// ----- 3. Remove all records: eaters + restaurants
router.delete('/', (req, res) => {

    const promises = [
        Eater.remove(),
        Restaurant.remove()
    ]

    Promise
        .all(promises)
        .then(() => res.status(200).json({ message: 'eaters and restaurants removed' }))
        .catch(err => res.status(500).json(err))
})


module.exports = router
