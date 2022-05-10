const mongoose = require("mongoose")
const app = require("../app")
const request = require("supertest")

const auxVariable = makeid(7)
const eaterPayload = {
    name: "eater",
    email: auxVariable
}

describe('/eaters', () => {

    test("Object asignation", async () => {

        const response = await request(app).post('/eaters').send(eaterPayload)
        expect(response.request._data.name).toEqual("eater")
    })

    test("Empty key values should throw an error", async () => {

        const incompleteEaterPayload = {
            name: '',
            email: ''
        }

        const response = await request(app).post('/eaters').send(incompleteEaterPayload)
        expect(response.statusCode).toBe(500)
    })

    test("Duplicate 'email' key should throw an error", async () => {

        await request(app).post("/eaters").send(eaterPayload)
        const response = await request(app).post('/eaters').send(eaterPayload)
        expect(response.statusCode).toBe(500)
    })

    test("GET - it should answer a 200 ", async () => {

        const response = await request(app).get("/eaters").send()
        expect(response.statusCode).toBe(200)
    })

    test("POST - it should create an eater", async () => {

        const response = await request(app).post("/eaters").send(eaterPayload)
        expect(response.body).toBeDefined()
    })

    test.skip("POST: it should delete users and restaurants", async () => {
        const response = await request(app).delete("/eaters").send()
        expect(response.body).toStrictEqual({ message: 'eaters and restaurants removed' })
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