function generateRandom(originalCollection, newCollection) {
    let randomNum = Math.floor(Math.random() * (originalCollection.length - 1))
    newCollection.push(originalCollection[randomNum])
    originalCollection.splice(randomNum, 1)
}

module.exports = generateRandom