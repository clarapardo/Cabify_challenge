const router = require("express").Router()
const Eater = require('../models/Eater.model')
const Restaurant = require('../models/Restaurant.model')
const Group = require('../models/Group.model')
// const Group = require('./../models/Group.models')


router.post("/create_groups", (req, res, next) => {

    var aux
    const promises = [
        Eater.find(),
        Restaurant.find(),
        Group.find()
    ]

    Promise
        .all(promises)
        .then(([allEaters, allRestaurants, allSubgroups]) => {

            let numberOfSubgroups
            numberOfSubgroups = Math.ceil(allEaters.length / 7)

            let allInfo = { numberOfSubgroups, allEaters, allRestaurants }
            return allInfo
        })
        .then(({ numberOfSubgroups, allEaters, allRestaurants }) => {

            // Deep copy of allEaters + allResstaurants
            let remainingEaters = JSON.parse(JSON.stringify(allEaters))
            let remainingRestaurants = JSON.parse(JSON.stringify(allRestaurants))


            // // 1. Subgroups setting
            let groupMembers = []
            let allSubgroups = []

            groupMembers[0] = ['hola']
            groupMembers[1] = ['hola']

            console.log(groupMembers)


            var jump = 0
            while (remainingEaters.length !== 0) {

                for (i = 0; i < numberOfSubgroups; i++) {
                    let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                    console.log(jump)
                    groupMembers[i][jump] = remainingEaters[randomNum]
                    remainingEaters.splice(randomNum, 1)
                }
                jump += (numberOfSubgroups - 1)

            }
            // console.log(groupMembers)

            // console.log(allEaters.length)

            // console.log(groupMembers.length)

        })
        // .then(finalSubgroups => {

        //     Subgroups.create(finalSubgroups)
        //     Group.create({ subgroups: finalSubgroups })

        //     res.status(200).json(finalSubgroups)
        // })
        .catch(err => console.log(err))


})

module.exports = router