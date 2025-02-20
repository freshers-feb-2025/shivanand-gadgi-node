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
