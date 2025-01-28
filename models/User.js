const { DataTypes } = require('sequelize');

const db = require('../db/conn');

const User = db.define('User', {
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
});

module.exports = User;