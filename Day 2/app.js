const http=require("http");
const  requestHandler  = require("./route");
const server=http.createServer(requestHandler.handler);

server.listen(3001,()=>{
     console.log("Server is running on port 3001")
});