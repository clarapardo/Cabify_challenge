const mongoose = require("mongoose")
const app = require("../app")
const request = require("supertest")

const auxVariable = makeid(7)
const restaurantPayload = {
    name: auxVariable,
    adress: "restaurant adress"
}

describe('/restaurants', () => {

    test("Object asignation", async () => {

        const response = await request(app).post('/restaurants').send(restaurantPayload)
        expect(response.request._data.adress).toEqual("restaurant adress")
    })

    test("Empty key values should throw an error", async () => {

        const incompleteRestPayload = {
            name: '',
            adress: ''
        }

        const response = await request(app).post('/restaurants').send(incompleteRestPayload)
        expect(response.statusCode).toBe(500)
    })

    test("Duplicate 'name' key should throw an error", async () => {

        await request(app).post("/restaurants").send(restaurantPayload)
        const response = await request(app).post('/restaurants').send(restaurantPayload)
        expect(response.statusCode).toBe(500)
    })

    test(" GET - it should respond a 200 ", async () => {

        const response = await request(app).get("/restaurants").send()
        expect(response.statusCode).toBe(200)
    })

    test("POST - it should create a restaurant", async () => {

        const response = await request(app).post("/restaurants").send(restaurantPayload)
        expect(response.body).toBeDefined()
    })

    afterAll(() => { mongoose.connection.close() })
})


function makeid(length) {

    let result = ''
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    return result
}