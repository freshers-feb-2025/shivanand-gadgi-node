const express = require('express');
const app = express();
const sequelize = require("./util/conn");
const router=require("./route/route");
const auth=require("./route/auth");
const bcrypt = require("bcryptjs");
const session = require('express-session'); 
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");



const employee=require("./models/employee");



app.use(express.json()); 
app.use(cookieParser("cookiekey12345"));
app.use(auth);
//app.use(router);


(async () => {
    try {
      await sequelize.authenticate(); // Check if the connection works
      console.log('Connection has been established successfully.');

      await sequelize.sync({force: true});
      console.log('All models synchronized with the database.'); 

      let password="12345678";
      const hashedPassword = await bcrypt.hash(password, 10);
      await employee.create({name:"Shivanand Gadgi",email:"shivanandgadgi@gmail.com",password:hashedPassword,role:"member"});
      await employee.create({name:"Prem Gadgi",email:"premgadgi@gmail.com",password:hashedPassword,role:"non-member"});
      await employee.create({name:"Amar Gadgi",email:"amargadgi@gmail.com",password:hashedPassword,role:"member"});
      
      

      app.listen(3000, () => {
      console.log(`Server is running on http://localhost:3000`);

    });
} catch (error) {
      console.error('Unable to connect to the database:', error);
}
})();



app.get('/', (req, res) => {
     res.send('Hello, World!');
});