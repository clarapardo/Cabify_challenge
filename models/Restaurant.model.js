const { Schema, model } = require("mongoose")

const restaurantSchema = new Schema(
    {
        name: { type: String, required: [true, 'Name is mandatory'] },
        adress: { type: String, required: [true, 'Adress is mandatory']},
    },
    {
        timestamps: true,
    }
)

module.exports = model("Restaurant", restaurantSchema)
