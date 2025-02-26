const Sequelize=require("sequelize");
const sequelize = require("../util/conn");

const Comment=sequelize.define("comment",{

    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    post_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    user_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },

});

module.exports=Comment;