const router = require("express").Router()
const Group = require('./../models/Group.models')
const Eater = require('../models/Eater.model')



// ----- Last created group
router.get("/", (req, res, next) => {

    const promises = [
        Group.find(),
        Eater.find()
    ]
    let GroupCopy = JSON.parse(JSON.stringify(allSubgroups))



    Group
        .find()
        .then(allGroups => allGroups.pop())
        .then(lastGroup => res.json(lastGroup))
        .catch(err => res.status(500).json(err))
})

module.exports = router