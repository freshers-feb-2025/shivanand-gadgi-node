const {DataTypes}=require("sequelize");
const sequelize = require("../util/conn");
const User=require("./User");

class Teacher extends User{}

Teacher.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User, 
                key: "id",
            },
        },

        subject:{
            type:DataTypes.STRING,
            allowNull:false,
        }
    },
    {
        sequelize,
        modelName:"teacher"
    }
   
);
User.hasOne(Teacher,{ foreignKey: "id",onDelete: "CASCADE" });
Teacher.belongsTo(User, { foreignKey: "id" });
module.exports=Teacher;