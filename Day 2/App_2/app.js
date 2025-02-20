const express=require("express");
const rootDir=require("./util/path");
const app=express();

const path = require("path"); 

const adminRoutes=require("./routes/admin");
const shopRoutes=require("./routes/shop");

const bodyParser=require("body-parser");

app.use("/product/:id",(req,res)=>{
    const productId = req.params.id; // Get the ID from the URL
    console.log(productId);
});



app.use(bodyParser.urlencoded({extended:false}));

app.use("/admin",adminRoutes);
app.use(shopRoutes);
app.use((req,res)=>{
    res.sendFile(path.join(rootDir, "/views/page_not_found.html"));
})

app.listen(3000);


























