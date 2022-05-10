const router = require("express").Router()
const Eater = require('../models/Eater.model')
const Restaurant = require('../models/Restaurant.model')
const Subgroups = require('../models/Subgroup.model')
const Group = require('./../models/Group.models')


router.post("/create_groups", (req, res, next) => {

    var aux
    const promises = [
        Eater.find(),
        Restaurant.find(),
        Subgroups.find()
    ]

    Promise
        .all(promises)
        .then(([allEaters, allRestaurants, allSubgroups]) => {

            // // 0. Check if the subgroups has been set before
            if (allSubgroups.length !== 0) {
                let allSubgroupsCopy = JSON.parse(JSON.stringify(allSubgroups))
                let lastSubgroup = allSubgroupsCopy.pop()

                let matchingInput = allEaters.filter(eater => eater._id.toString() === lastSubgroup.leader._id)

                if (matchingInput.length === 1) {
                    throw ({ message: 'groups already created' })
                }
            }

            let numberOfSubgroups

            for (i = 7; i >= 0; i--) {

                numberOfSubgroups = Math.ceil(allEaters.length / i)

                if (allEaters.length % i === 0 || i * numberOfSubgroups >= allEaters.length && allEaters.length > 1 * i + (numberOfSubgroups - 1) * (i - 1)) {

                    let allInfo = { numberOfSubgroups, maxPeoplePerGroup: i, allEaters, allRestaurants }
                    return allInfo
                }
            }
        })
        .then(({ numberOfSubgroups, maxPeoplePerGroup, allEaters, allRestaurants }) => {

            // Deep copy of allEaters + allResstaurants
            let remainingEaters = JSON.parse(JSON.stringify(allEaters))
            let remainingRestaurants = JSON.parse(JSON.stringify(allRestaurants))


            // // 1. Subgroups setting
            let groupMembers = []
            let allSubgroups = []

            while (remainingEaters.length > 0) {

                if (allEaters.length % maxPeoplePerGroup === 0) {                                     // GRUPOS CON EL MISMO NÚMERO DE PERSONA

                    for (i = 0; i < maxPeoplePerGroup; i++) {
                        let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                        groupMembers.push(remainingEaters[randomNum])
                        remainingEaters.splice(randomNum, 1)
                    }

                    allSubgroups.push(groupMembers)
                    groupMembers = []

                } else if (remainingEaters.length % (maxPeoplePerGroup - 1) === 0) {                    // GRUPOS DE -1 PERSONA

                    for (i = 0; i < maxPeoplePerGroup - 1; i++) {
                        let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                        groupMembers.push(remainingEaters[randomNum])
                        remainingEaters.splice(randomNum, 1)
                    }

                    allSubgroups.push(groupMembers)
                    groupMembers = []

                } else {                                                                                // GRUPOS CON EL NUM MÁX DE MIEMBROS POSIBLE

                    for (i = 0; i < maxPeoplePerGroup; i++) {
                        let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                        groupMembers.push(remainingEaters[randomNum])
                        remainingEaters.splice(randomNum, 1)
                    }

                    allSubgroups.push(groupMembers)
                    groupMembers = []
                }
            }


            // // 2. Restaurants setting
            let groupRestaurants = []

            if (allRestaurants.length < numberOfSubgroups) {
                res.json({
                    message: `Not enough restaurants for creating all the groups. Please add ${numberOfSubgroups - allRestaurants.length} more restaurant`
                })
            }

            for (i = 0; i < numberOfSubgroups; i++) {
                let randomNum = Math.floor(Math.random() * (remainingRestaurants.length - 1))
                groupRestaurants.push(remainingRestaurants[randomNum])
                remainingRestaurants.splice(randomNum, 1)
            }


            // // 3. Role setting
            let finalSubgroups = []

            for (i = 0; i < numberOfSubgroups; i++) {
                let randomNum = Math.floor(Math.random() * (remainingRestaurants.length))

                //Choose the leader

                let subgroupSetting = { leader: allSubgroups[i][randomNum] }
                allSubgroups[i].splice(randomNum, 1)

                subgroupSetting = { ...subgroupSetting, eaters: allSubgroups[i], restaurant: groupRestaurants[i] }
                finalSubgroups.push(subgroupSetting)
                subgroupSetting = []
            }

            return finalSubgroups

        })
        .then(finalSubgroups => {

            Subgroups.create(finalSubgroups)
            Group.create({ subgroups: finalSubgroups })

            res.status(200).json(finalSubgroups)
        })
        .catch(err => res.status(500).json(err))
})



module.exports = router