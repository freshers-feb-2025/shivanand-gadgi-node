const Sequelize=require("sequelize"); //So basically Sequilize here is class 
const sequelize = new Sequelize('employee_db', 'root', '12345678', { //As sequelize is class so we are passing parameters for constructor
    host: 'localhost',  
    dialect: 'mysql',      
  });

  //Here parameters are name of db, username, pass and a js Object that contain host, type of db we are interacting with

module.exports = sequelize;