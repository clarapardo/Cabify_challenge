const mongoose = require("mongoose")
const app = require("../app")
const request = require("supertest")

describe('/groups', () => {

    test("GET: it should answer a status 200", async () => {

        const response = await request(app).get("/groups").send()
        expect(response.body).toBeDefined()
    })

    afterAll(() => { mongoose.connection.close() })
})