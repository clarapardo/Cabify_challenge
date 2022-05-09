const { json } = require("express/lib/response")
const { Schema, model } = require("mongoose")

const eaterSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is mandatory']
    },
    email: {
      type: String,
      required: [true, 'Email is mandatory']
    },
  },
  {
    timestamps: true,
  }
)

module.exports = model("Eater", eaterSchema)
