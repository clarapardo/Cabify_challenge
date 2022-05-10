const router = require("express").Router()


// ---------> HOME PAGE >---------
router.get("/", (req, res, next) => {
  res.render("index")
})


// ---------> EATERS ROUTES + delete all <---------
router.use("/eaters", require ('./eaters.routes'))


// ---------> RESTAURANT ROUTES <---------
router.use("/restaurants", require('./restaurants.routes'))


// ---------> SUBGROUP ROUTES <---------
router.use("/", require('./subgroups.routes'))

// ---------> GROUP ROUTES <---------
// router.use("/", require('./groups.routes'))


module.exports = router
