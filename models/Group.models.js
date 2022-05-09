const { Schema, model } = require("mongoose")

const groupSchema = new Schema(
    {
        subgroups: [Array]
    },
    {
        timestamps: true,
    }
)

module.exports = model("group", groupSchema)