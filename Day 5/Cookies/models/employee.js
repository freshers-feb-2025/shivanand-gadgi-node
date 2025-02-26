const Sequelize=require("sequelize");
const sequelize = require("../util/conn");

const Customer=sequelize.define("employee",{

    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    role: 
    { 
        type: Sequelize.STRING,
         defaultValue: "member" 
    }
});

module.exports=Customer;