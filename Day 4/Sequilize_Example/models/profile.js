const Sequelize=require("sequelize");
const sequelize = require("../util/database");


const Profile = sequelize.define("profile", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    address: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Profile;
