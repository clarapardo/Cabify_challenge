const mongoose = require("mongoose")


const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost/ClaraP_Cabify_challenge"

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    )
  })
  .catch((err) => {
    console.error("Error connecting to mongo: ", err)
  })
