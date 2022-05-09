const router = require("express").Router()
const Eater = require('./../models/Eater.model')
const Restaurant = require('./../models/Restaurant.model')



// ----- 1. All eaters
router.get("/", (req, res, next) => {

    Eater
        .find()
        .then(allEaters => res.json(allEaters))
        .catch(err => res.status(500).json(err))
})


// ----- 2. New eater
router.get("/add-new", (req, res, next) => {

    res.render('eaters/new-eater')
})

router.post("/", (req, res, next) => {

    const { name, email } = req.body

    Eater
        .findOne({ email })
        .then(user => {

            if (!user) {

                Eater
                    .create({ name, email })
                    .then(() => res.status(200).json())
                    .catch(err => res.status(500).json(err))
            } else {
                res.json({ message: 'email already registered' })
            }
        })
        .catch(err => res.status(500).json(err))
})




// ---------> REMOVE ALL RECORDS <---------
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
