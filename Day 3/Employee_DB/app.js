const express=require("express");
const app=express();

const path = require("path"); 

const router=require("./route/router");
const rootDir=require("./util/root_path");
const mysqlPool=require("./database/db");


app.use(express.json()); 
app.use(router);

mysqlPool.query('SELECT 1').then(()=>{
    
    app.listen(3000);
    console.log("MySQL DB Connected. Server running on port 3000");
}).catch((error)=>{
    console.log(error);
})

app.use((req,res)=>{
    res.sendFile(path.join(rootDir, "/views/page_not_found.html"));
})



