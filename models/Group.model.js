const { Schema, model } = require("mongoose")

const groupSchema = new Schema(
    {
        subgroups: [{
            leader: Object,
            eaters: Object,
            restaurant: Object
        }]
    },
    {
        timestamps: true,
    }
)

module.exports = model("group", groupSchema)
