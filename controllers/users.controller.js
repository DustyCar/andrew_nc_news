const {fetchUsers} = require("../models/users.model")


exports.getUsers = (req, res, next) => {
    
    return fetchUsers().then((result) => {
        const users = result.rows

        res.status(200).send({users}) }).catch(next)
}