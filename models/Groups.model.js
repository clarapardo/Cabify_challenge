const { Schema, model } = require("mongoose")

const groupSchema = new Schema(
    {
        leader: String,
        eaters: [String],
        restaurant: String
    },
    {
        timestamps: true,
    }
)

module.exports = model("Group", groupSchema)
