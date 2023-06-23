const { Users } = require("../collections/mongoCollections");
const bcrypt = require("bcrypt");

// login post request handler
module.exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await Users.findOne({ username: username });
        if (!user)
            return res.status(400).json({ status: false, msg: "Incorrect Username or Password" });
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return res.status(400).json({ status: false, msg: "Incorrect Username or Password" });
        delete user.password;
        return res.status(200).json({ status: true, user: user });
    } catch (ex) {
        next(ex);
    }
};
