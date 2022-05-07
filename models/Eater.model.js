const { Schema, model } = require("mongoose")

const eaterSchema = new Schema(
  {
    name: { type: String, require: [true, 'Name is mandatory'] },
    email: { type: String, unique: [true, 'Email already joined'], require: [true, 'Name is mandatory'] },
    role: { type: String, enum: ['LEADER', 'GROUPIE'], default: 'GROUPIE' }
  },
  {
    timestamps: true,
  }
)

module.exports = model("Eater", eaterSchema)
