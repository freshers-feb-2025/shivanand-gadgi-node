const Sequelize=require("sequelize"); 
const sequelize = new Sequelize('college_management_db', 'root', '12345678', { 
    host: 'localhost',  
    dialect: 'mysql',      
  });

 

module.exports = sequelize;