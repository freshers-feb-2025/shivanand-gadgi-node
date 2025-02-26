const express = require('express');
const app = express();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const session = require('express-session'); 

const sequelize = require("./util/conn");
const session_router=require("./route/using_session");


app.use(express.json());
app.use(cookieParser("cookie_key_123"));
app.use(session({
    secret: "SecretKey123",  
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, httpOnly: true, maxAge: 60000 }
}));

app.use(session_router);


(async ()=>{

   try{
    await sequelize.authenticate();
    console.log("Connection has been successfully established");

    await sequelize.sync({force:true});
    console.log("All models Synchronized with database");

    app.listen("3000",()=>{
        console.log(`Server is running on http://localhost:3000`);
    });

   }catch(error){
    console.error('Unable to connect to the database:', error);
   }

})();

app.get("/",(req,res)=>{
    res.send("404 Not Found");
})