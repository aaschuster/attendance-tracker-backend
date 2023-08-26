const db = require("./data/dbconfig");
const jwt = require("jsonwebtoken");

module.exports.insert = user => {
    return db("users").insert(user);
}

module.exports.get = id => {
    if(id) {
        return db("users").where("user_id", id).first();
    }
    return db("users");
}

module.exports.getBy = filter => {
    return db("users").where(filter);
}

module.exports.login = async user => {
    try {
        const token = jwt.sign(
            {email: user.email}, 
            process.env.JWT_KEY, 
            {expiresIn: '1h'}
        );
        return token;
    }
    catch (err) {
        return [422, { message: err.message}]
    }
    
}

module.exports.getRole = id => {
    if(id) {
        return db("roles").where("role_id", id).first();
    }
    return db("roles");
}

module.exports.update = (user, id) => {
    return db("users").where("user_id", id).update(user);
}

module.exports.del = id => {
    return db("users").where("user_id", id).del();
}