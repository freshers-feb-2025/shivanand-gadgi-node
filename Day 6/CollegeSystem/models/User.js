const { DataTypes, Model } = require("sequelize");

const sequelize=require("../util/conn");




class User extends Model{}

User.init(
    {
        id:{
            type:DataTypes.INTEGER,
            autoIncrement:true,
            allowNull:false,
            primaryKey:true,
        },

        name:{
            type:DataTypes.STRING,
            allowNull:false,
        },

        email:{
            type:DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        role:{
            type:DataTypes.ENUM("student","teacher"),
            allowNull:false,
        }
    },
        {
            sequelize,
            modelName:"user",
        },
    
);

module.exports=User;