const router = require("express").Router()

// ---------> HOME PAGE >---------
router.get("/", (req, res, next) => {
  res.render("index")
})

// ---------> ROUTES <---------
router.use("/", require ('./eatApp.routes'))


module.exports = router
