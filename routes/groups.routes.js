const router = require("express").Router()
const Group = require('./../models/Group.models')



// ----- Last created group
router.get("/", (req, res, next) => {

    Group
        .find()
        .then(allGroups => allGroups.pop())
        .then(lastGroup => res.json(lastGroup))
        .catch(err => res.status(500).json(err))
})

module.exports = router