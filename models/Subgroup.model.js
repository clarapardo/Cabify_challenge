const { Schema, model } = require("mongoose")

const subgroupSchema = new Schema(
    {
        leader: Object,
        eaters: Object,
        restaurant: Object
    },
    {
        timestamps: true,
    }
)

module.exports = model("subgroup", subgroupSchema)
