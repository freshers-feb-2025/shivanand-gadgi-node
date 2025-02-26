const {DataTypes}=require("sequelize");
const sequelize = require("../util/conn");
const User=require("./User");



class Student extends User{}

Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User, 
                key: "id",
            },
        },
        age:{
            type:DataTypes.INTEGER,
            allowNull:false,
        }
    },
    {
        sequelize,
        modelName:"student"
    }
   
);
User.hasOne(Student, { foreignKey: "id",onDelete: "CASCADE"  });
Student.belongsTo(User, { foreignKey: "id" });
module.exports=Student;