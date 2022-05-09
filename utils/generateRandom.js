function generateRandom(remainingEaters, groupMembers) {
    let randomNum = Math.floor(Math.random() * (remainingEaters.length - 1))
    groupMembers.push(remainingEaters[randomNum])
    remainingEaters.splice(randomNum, 1)
}

module.exports = generateRandom