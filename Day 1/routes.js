
const fs=require("fs");
const requestHandler=(req,res)=>{
    let url=req.url;
    let method=req.method;
    let parsedBody="";
    if(url === "/"){
        res.setHeader("Content-Type","text/html");
        res.write("<html>");
        res.write("<head><title>Form</title></head>");
        res.write("<body><form action='/message' method='POST'><input type='text' name='message'><button onclick='submit'>Submit</button></form></body>")
        res.write("</html>");
        return res.end();
    }

    if(url==="/message" && method=='POST'){
    
        let body=[];
        req.on("data",(chunk)=>{
            body.push(chunk);
        });
        return req.on("end",()=>{
            parsedBody=Buffer.concat(body).toString();
            let message=parsedBody.split("=")[1];
            fs.writeFile("message.txt",message,(err)=>{
                res.statusCode=302;
                res.setHeader("Location","/");
                return res.end();
                
            });
          
        })

       
        
       
        
        

    };

   

    
};

module.exports={handler:requestHandler};

