
const { json } = require('../util/resp');

module.exports = {
    set json(val) {
        this.body = json(val);
    },
};