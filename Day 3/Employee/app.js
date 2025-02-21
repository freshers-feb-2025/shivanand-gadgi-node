const express=require("express");
const app=express();
const path = require("path"); 
const router=require("./route/router");
const rootDir=require("./util/root_path");

app.use(express.json()); 
app.use(router);

app.use((req,res)=>{
    res.sendFile(path.join(rootDir, "/views/page_not_found.html"));
})

app.listen(3000);