const mongoose = require("mongoose")
const app = require("../app")
const request = require("supertest")
const async = require("hbs/lib/async")


describe('/create_groups', () => {

    test.skip("Verify all the eaters are distributed in subgroups", async () => {

        const createdGroup = await request(app).post("/create_groups").send()
        const allEaters = await request(app).get("/eaters").send()

        var allPeople = 0
        createdGroup._body.map(elm => {
            elm.eaters.map(elm => {
                allPeople++
            })
            allPeople++   // (+ the leader)
        })

        expect(allPeople).toEqual(allEaters._body.length)
    })

    test.skip("An error should be thrown if subgoups are tried to be redone", async () => {

        await request(app).delete('/delete_groups').send()
        await request(app).post("/create_groups").send()
        const response = await request(app).post("/create_groups").send()
        expect(response.statusCode).toBe(500)
    })

    test.skip("All subgroups are created with the correct structure of keys", async () => {

        await request(app).delete('/delete_groups').send()
        const createdGroup = await request(app).post("/create_groups").send()

        createdGroup._body.map(elm => {
            expect(elm).toHaveProperty('leader', 'eater', 'restaurant')
        })
    })

    test.skip("The difference in length is never greater than +/- 1", async () => {

        const response = await request(app).delete('/delete_groups').send()
        const createdGroup = await request(app).post('/create_groups').send()

        var largerLength
        var smallerLength

        createdGroup._body.map(elm => {

            if (!largerLength) {
                largerLength = elm.eaters.length
                smallerLength = elm.eaters.length
            }

            if (elm.eaters.length > largerLength) {
                largerLength = elm.eaters.length

            } else if (elm.eaters.length < smallerLength) {
                smallerLength = elm.eaters.length
            }

        })

        let result = false

        largerLength - smallerLength <= 1 ? result = true : ''

        expect(result).toEqual(true)
    })

    test.skip("If not enough restaurants are created for all the groups so there is no duplcity in restaurants, an error should be thrown", async () => {

        await request(app).delete('/delete_groups').send()
        await request(app).delete('/restaurants').send()

        const response = await request(app).post("/create_groups").send()

        expect(response.body).toStrictEqual({ message: 'Not enough restaurants for creating all the groups.' })
    })


    afterAll(() => { mongoose.connection.close() })
})
