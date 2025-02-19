const express=require("express");
const router=express.Router();
const path = require("path"); 
const rootDir=require("../util/path");


router.get("/",(req,res)=>{
    //console.log("I am /");
   // res.send("<h1>Hello From Express.</h1>");
   res.sendFile(path.join(rootDir, "/views/shop.html"));
});

module.exports=router;