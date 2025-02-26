const express=require("express");
const router=express.Router();
const path = require("path"); 
const rootDir=require("../util/path");

router.get("/add-product",(req,res,next)=>{
    //console.log("I am a add-product.");
    //res.send("<form action='/admin/add-product' method='POST'><input type='text' name='title'><button type='submit'>Submit</button></form>");
     res.sendFile(path.join(rootDir, "/views/add-product.html"));
});
router.post("/add-product",(req,res)=>{
    console.log("Product Title:", req.body.title); 
    res.redirect("/");
});

module.exports=router;