const bcrypt = require('bcryptjs')

const helpers = {};

helpers.encryptPassword = async (userPass) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(userPass, salt);
    return hash;
};

helpers.matchPassword = async (userPass, passDb) => {
    try {
        return await bcrypt.compare(userPass, passDb);
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;