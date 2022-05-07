const router = require("express").Router()
const { Router } = require("express")
const Eater = require('./../models/Eater.model')
const Restaurant = require('./../models/Restaurant.model')



// ---------> EATERS ROUTES <---------
// ----- 1. All eaters
router.get("/eaters", (req, res, next) => {

    Eater
        .find()
        .then(allEaters => res.render('eaters/all-eaters', { allEaters }))
        .catch(err => next(err))
})


// ----- 2. New eater
router.get("/eaters/add-new", (req, res, next) => {

    res.render('eaters/new-eater')
})

router.post("/eaters", (req, res, next) => {

    const { name, email } = req.body

    Eater
        .create({ name, email })
        .then(() => res.redirect('/eaters'))    //######### METER MENSAJES!
        .catch(err => next(err))
})



// ---------> RESTAURANT ROUTES <---------
// ----- 1. All restaurants
router.get("/restaurants", (req, res, next) => {

    Restaurant
        .find()
        .then(allRestaurants => res.render('restaurants/all-restaurants', { allRestaurants }))
        .catch(err => next(err))
})


// ----- 2. New restaurant
router.get("/restaurants/add-new", (req, res, next) => {

    res.render('restaurants/new-restaurant')
})

router.post("/restaurants", (req, res, next) => {

    const { name, adress } = req.body

    Restaurant
        .create({ name, adress })
        .then(() => res.redirect('/restaurants'))    //######### METER MENSAJES!
        .catch(err => next(err))
})



// ---------> GROUP ROUTES <---------
router.get("/create_groups", (req, res, next) => {

    const promises = [
        Eater.find(),
        Restaurant.find()
    ]

    Promise
        .all(promises)
        .then(([allEaters, allRestaurants]) => {

            let numberOfGroups

            for (i = 7; i >= 0; i--) {

                numberOfGroups = Math.ceil(allEaters.length / i)
                // console.log('el valor de i vale: ', i)
                // console.log('el numberOfGroups vale: ', numberOfGroups)
                // console.log('lo de antes del % ', allEaters.length + (numberOfGroups - 1))
                // console.log('el resultado del módulo % ', ((allEaters.length + (numberOfGroups - 1)) % 6))
                // console.log('--------------------')

                if (allEaters.length % i === 0 || i * numberOfGroups >= allEaters.length && allEaters.length > 1 * i + (numberOfGroups - 1) * (i - 1)) {

                    let allInfo = { numberOfGroups, maxPeoplePerGroup: i, allEaters, allRestaurants }
                    return allInfo
                }
            }
        })
        .then(({ numberOfGroups, maxPeoplePerGroup, allEaters, allRestaurants }) => {

            // Deep copy of allEaters + allResstaurants
            let remainingEaters = JSON.parse(JSON.stringify(allEaters))
            let remainingRestaurants = JSON.parse(JSON.stringify(allRestaurants))

            // // 1. Groups setting
            let groupMembers = []
            let allGroups = []

            while (remainingEaters.length > 0) {

                if (allEaters.length % maxPeoplePerGroup === 0) {                                     // GRUPOS CON EL MISMO NÚMERO DE PERSONA

                    console.log('HAGO UN GRUPO CON = PERSONAS')
                    for (i = 0; i < maxPeoplePerGroup; i++) {
                        let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                        groupMembers.push(remainingEaters[randomNum])
                        remainingEaters.splice(randomNum, 1)
                        console.log(groupMembers.length)
                    }

                    allGroups.push(groupMembers)
                    groupMembers = []

                } else if (remainingEaters.length % (maxPeoplePerGroup - 1) === 0) {                    // GRUPOS DE -1 PERSONA

                    for (i = 0; i < maxPeoplePerGroup - 1; i++) {
                        let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                        groupMembers.push(remainingEaters[randomNum])
                        remainingEaters.splice(randomNum, 1)
                    }

                    // console.log('ENTRE LOS QUE QUEDAN, DIVIDO -- ', remainingEaters.length)
                    allGroups.push(groupMembers)
                    groupMembers = []

                } else {                                                                                // GRUPOS CON EL NUM MÁX DE MIEMBROS POSIBLE

                    for (i = 0; i < maxPeoplePerGroup; i++) {
                        let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
                        groupMembers.push(remainingEaters[randomNum])
                        remainingEaters.splice(randomNum, 1)
                    }

                    // console.log('TENGO QUE QUITAR GENTE DE GRUPO GRANDE --', remainingEaters.length)
                    allGroups.push(groupMembers)
                    groupMembers = []
                    // console.log(allGroups.length)

                }
            }
            console.log('-----la division total es-------', allGroups[0].length, ' + ', allGroups[1].length, ' + ', allGroups[2].length, ' + ', allGroups[3].length, ' + ', allGroups[4].length)


            // // 2. Restaurants setting
            let groupRestaurants = []

            if (allRestaurants.length < numberOfGroups) {
                res.redirect('/restaurants')                                                               // ###### mandar mensaje de que no hay suficientes restaurantes
            }

            for (i = 0; i < numberOfGroups; i++) {
                let randomNum = Math.floor(Math.random() * (remainingRestaurants.length - 1))
                groupRestaurants.push(remainingRestaurants[randomNum])
                remainingRestaurants.splice(randomNum, 1)
            }
            console.log('--------El num total de restaurantes---------', groupRestaurants.length)


            // // 3. Role setting
            let finalGroupes = []

            for (i = 0; i < numberOfGroups; i++) {
                let randomNum = Math.floor(Math.random() * (remainingRestaurants.length - 1))

                //Choose the leader

                let groupSetting = { leader: allGroups[i][randomNum] }
                allGroups[i].splice(randomNum, 1)

                groupSetting = { ...groupSetting, eaters: allGroups[i], restaurant: groupRestaurants[i] }
                finalGroupes.push(groupSetting)
                groupSetting = []
            }

            console.log(finalGroupes)
            return finalGroupes

        })
        .then(finalGroupes => res.render('group-details', { finalGroupes}))
        .catch(err => next(err))










})















// ---------> REMOVE ALL ROUTES <---------






module.exports = router


