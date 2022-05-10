const res = require('express/lib/response')
const Group = require('./../models/Group.models')


function notLeaderAgain(remainingRestaurants, i, allSubgroups) {

    let randomNum = Math.floor(Math.random() * (remainingRestaurants.length))
    let newLeader = allSubgroups[i][randomNum]

    let aux = Group
        .find()
        .then(groups => groups.pop())
        .then(lastGroup => {

            lastGroup.subgroups.map(elm => {

                while (elm.leader.email === allSubgroups[i][randomNum].email) {
                    randomNum = Math.floor(Math.random() * (remainingRestaurants.length))
                    newLeader = allSubgroups[i][randomNum]
                }
            })

            return newLeader
        })
        .then(leader => leader)
        .catch(err => console.log(err))

    return aux
}

module.exports = notLeaderAgain