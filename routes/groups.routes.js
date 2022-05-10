const router = require("express").Router()
const Group = require('./../models/Group.models')
const Eater = require('../models/Eater.model')


// ----- 1. Last created group
router.get("/groups", (req, res) => {

    const promises = [
        Group.find(),
        Eater.find()
    ]

    Promise
        .all(promises)
        .then(([allGroups, allEaters]) => {

            // ----- 1.1. Check if the group has been set before
            let allGroupsCopy = JSON.parse(JSON.stringify(allGroups))
            let lastGroup = allGroupsCopy.pop()

            if (allGroups.length !== 0) {

                let matchingInput = !allEaters.filter(eater => eater._id.toString() === lastGroup.subgroups[0].leader._id)

                if (matchingInput.length === 0) {
                    throw ({ message: 'group not created yet' })
                }

            } else {
                throw ({ message: 'group not created yet' })
            }

            // ----- 1.2. Render the correct structure/info
            var group = []

            lastGroup.subgroups.forEach(elm => {
                let eatersName = []
                elm.eaters.map(elm => eatersName.push(elm.name))
                group.push({ leader: elm.leader.name, eaters: eatersName, restaurant: elm.restaurant.name })
            })

            return group
        })
        .then(lastGroup => res.json(lastGroup))
        .catch(err => res.status(500).json(err))
})


module.exports = router