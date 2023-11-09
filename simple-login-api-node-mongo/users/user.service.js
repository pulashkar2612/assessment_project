const config = require('config.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
const User = db.User;

module.exports = {
    authenticate,
    getAll,
    getById,
    create,
    update,
    delete: _delete,
    logout,
};

async function authenticate({ username, password, loginTime, clientIp }) {
    const user = await User.findOne({ username });
    //console.log(user);
    if (user && bcrypt.compareSync(password, user.hash)) {
        const { hash, ...userWithoutHash } = user.toObject();
        const token = jwt.sign({ sub: user.id }, config.secret);

        user.loginHistory.push({ loginTime: loginTime, clientIp: clientIp });
        console.log("user", user);
        await user.save();
        return {
            // ...userWithoutHash,
            // token,
            // loginTime,
            // clientIp,
            user, token
        };
    }
}

async function getAll() {
    return await User.find().select('-hash');
}

async function getById(id) {
    return await User.findById(id).select('-hash');
}

async function create(userParam) {
    // validate
    if (await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    const user = new User(userParam);

    // hash password
    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // save user
    await user.save();
}

async function update(id, userParam) {
    const user = await User.findById(id);

    // validate
    if (!user) throw 'User not found';
    if (user.username !== userParam.username && await User.findOne({ username: userParam.username })) {
        throw 'Username "' + userParam.username + '" is already taken';
    }

    // hash password if it was entered
    if (userParam.password) {
        userParam.hash = bcrypt.hashSync(userParam.password, 10);
    }

    // copy userParam properties to user
    Object.assign(user, userParam);

    await user.save();
}

async function _delete(id) {
    await User.findByIdAndRemove(id);
}

async function logout(userId) {
    try {
        const user = await User.findById(userId);
        console.log("update use", user, userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const lastLogin = user.loginHistory[user.loginHistory.length - 1];
        lastLogin.logoutTime = new Date().toLocaleString();

        await user.save();
        console.log("use", user);
        //res.json({ message: 'Logout successful!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}