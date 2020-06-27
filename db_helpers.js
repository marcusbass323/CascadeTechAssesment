const knex = require('knex')

const db_config = require('./knexfile.js');

const db = knex(db_config.development);

module.exports = {

    getUsers: () => {
        return db('users')
    },

}