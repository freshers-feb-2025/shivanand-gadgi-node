const http=require("http");
const express=require("express");
const app=express();
app.use((req,res)=>{
    console.log("I am a Middleware.");
});
const server=http.createServer(app);


server.listen(3000,()=>{
     console.log("Server is running on port 3000")
});
























