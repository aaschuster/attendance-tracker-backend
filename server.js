const bcrypt = require("bcryptjs");
const express = require("express");
const cors = require("cors");

const server = express();

server.use(express.json());

const Model = require("./model");
const {confirmAuthenticated, validateUserID, validateUser, validateLogin} = require("./middleware");

server.use(cors());

server.get("/", confirmAuthenticated, (req, res, next) => {
    Model.get()
        .then( users => res.json(users))
        .catch(next);        
})

server.get("/:id", validateUserID, confirmAuthenticated, (req, res, next) => {
    Model.get(req.params.id)
        .then( user => res.json(user))
        .catch(next);
})

server.post("/", validateUser, confirmAuthenticated, (req, res, next) => {

    const user = req.body;

    const {password} = user;

    if(password)
        password = bcrypt.hashSync(password, 8);

    Model.insert(user)
        .then( userID => res.json(userID))
        .catch(next);
})

server.post("/login", validateLogin, async (req, res, next) => {
    let { email, password } = req.body;

    const token = await Model.login(req.body);

    Model.getBy({email: email})
        .then( ([user]) => {
            if(bcrypt.compareSync(password, user.password)) return res.json({
                message: "Login successful",
                token: token            
            })
            else next({
                status: 401,
                message: "Invalid credentials"
            })
        })
        .catch(next);
});

server.post("/getbyemail", confirmAuthenticated, (req, res, next) => {
    Model.getBy({email: req.body.email})
        .then( user => res.json(user))
        .catch(next);
})

server.put("/:id", validateUserID, validateUser, confirmAuthenticated, (req, res, next) => {
    Model.update(req.body, req.params.id)
        .then( numOfRecs => res.json(numOfRecs))
        .catch(next);
})

server.delete("/:id", validateUserID, confirmAuthenticated, (req, res, next) => {
    Model.del(req.params.id)
        .then( numOfRecs => res.json(numOfRecs))
        .catch(next);
})

server.use((req, res) => {
    res.status(404).json( {
        message: "Nothing found here..."
    })
})

server.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        customMessage: "There was an issue with the server.",
        message: err.message
    })
})

module.exports = server;