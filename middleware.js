const Model = require("./model");
const jwt = require("jsonwebtoken");

function confirmAuthenticated(req, res, next) {

    const token = req.headers.authorization;

    if(token) {
        jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
            if(err) return next({
                status: 401,
                message: "Invalid token"
            })
            else next();
        })
    } else next({
        status: 401,
        message: "Token required"
    })
}

async function validateUserID(req, res, next) {
    req.user = await Model.get(req.params.id);
    if(req.user) return next();
    next( {
        message: "User ID invalid.",
        status: 404
    } );
}

async function validateLogin(req, res, next) {
    const { email, password } = req.body;

    let message = "";

    if(!(password) || !password.trim()) message = "Please provide a password.";
    if(!(email) || !email.trim()) message = "Please provide a email.";

    if(message) return next({
        message: message,
        status: 422
    });

    next();
}

async function validateUser(req, res, next) {

    const { firstname, lastname, role_id, email, user_id } = req.body;
    
    let message = "";
    if(!role_id) message = "Please provide a valid role id.";
    if(!(lastname) || !(lastname.trim())) message = "Please provide a last name.";
    if(!(firstname) || !(firstname.trim())) message = "Please provide a first name.";

    if(!message) {
        const role = await Model.getRole(role_id);
        if(!role) message = "Please provide a valid role id.";
    }

    if(!message && user_id && email) { //we are doing an update since user has an id
        const user = await Model.get(user_id);

        if(email !== user.email) {
            const user = await Model.getBy({email: email}).first();
            if(user) message = "That email has already been used";
        }
    }

    if(message) return next({
        message: message,
        status: 422
    })

    next();
}

module.exports = {
    confirmAuthenticated,
    validateUserID,
    validateUser,
    validateLogin
}