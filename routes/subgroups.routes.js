const router = require("express").Router()
const Eater = require('../models/Eater.model')
const Restaurant = require('../models/Restaurant.model')
const Subgroups = require('../models/Subgroup.model')
const Group = require('./../models/Group.models')

const generateRandom = require('./../utils/generateRandom')
const notLeaderAgain = require('./../utils/notLeaderAgain')


// ----- 1. Create all the subgroups
router.post("/create_groups", (req, res) => {

    const promises = [
        Eater.find(),
        Restaurant.find(),
        Subgroups.find()
    ]

    Promise
        .all(promises)
        .then(([allEaters, allRestaurants, allSubgroups]) => {

            // ----- 1.1. Check if the subgroups had been set before
            if (allSubgroups.length !== 0) {
                let allSubgroupsCopy = JSON.parse(JSON.stringify(allSubgroups))
                let lastSubgroup = allSubgroupsCopy.pop()

                let matchingInput = allEaters.filter(eater => eater._id.toString() === lastSubgroup.leader._id)

                if (matchingInput.length === 1) {
                    throw res.status(500).json({ message: 'groups already created' })
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


            // ----- 1.2. Subgroups setting
            let groupMembers = []
            let allSubgroups = []

            while (remainingEaters.length > 0) {

                if (allEaters.length % maxPeoplePerGroup === 0) {     // Grupos con el mismo número de personas
                    for (i = 0; i < maxPeoplePerGroup; i++) {
                        generateRandom(remainingEaters, groupMembers)
                    }

                    allSubgroups.push(groupMembers)
                    groupMembers = []

                } else if (remainingEaters.length % (maxPeoplePerGroup - 1) === 0) {     // Grupos de -1 miembro

                    for (i = 0; i < maxPeoplePerGroup - 1; i++) {
                        generateRandom(remainingEaters, groupMembers)
                    }

                    allSubgroups.push(groupMembers)
                    groupMembers = []

                } else {     //Grupos con el núm máx de miembros posibles

                    for (i = 0; i < maxPeoplePerGroup; i++) {
                        generateRandom(remainingEaters, groupMembers)
                    }

                    allSubgroups.push(groupMembers)
                    groupMembers = []
                }
            }


            // ----- 1.3. Restaurants setting
            let groupRestaurants = []

            if (allRestaurants.length < numberOfSubgroups) {
                throw res.status(500).json({ message: 'Not enough restaurants for creating all the groups.' })
            }

            for (i = 0; i < numberOfSubgroups; i++) {
                generateRandom(remainingRestaurants, groupRestaurants)
            }


            // ----- 1.4. Role setting
            let finalSubgroups = []

            for (i = 0; i < numberOfSubgroups; i++) {
                let randomNum = Math.floor(Math.random() * (groupRestaurants.length))

                // ----- 1.4.1. Choose the leader

                // let chooseLeader = notLeaderAgain(remainingRestaurants, i, allSubgroups)
                // let subgroupSetting = { leader: chooseLeader }

                let subgroupSetting = { leader: allSubgroups[i][randomNum] }
                allSubgroups[i].splice(randomNum, 1)

                // ----- 1.4.2. Create the structure of the group

                subgroupSetting = { ...subgroupSetting, eaters: allSubgroups[i], restaurant: groupRestaurants[i] }
                finalSubgroups.push(subgroupSetting)

                subgroupSetting = []
            }

            return finalSubgroups
        })
        .then(finalSubgroups => {

            Subgroups.create(finalSubgroups)
            Group.create({ subgroups: finalSubgroups })

            return res.status(200).json(finalSubgroups)
        })
        .catch(err => res.status(500))
})


//  ----- 3. Remove all subgroups records - (just needed for testing)
router.delete('/delete_groups', (req, res) => {

    Subgroups
        .remove()
        .then(() => res.status(200).json({ message: 'subgroups deleted successfully' }))
        .catch(err => res.status(500))
})


module.exports = router