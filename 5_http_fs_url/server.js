const http=require("http")
const url=require("url")
const fs=require("fs")


const app=http.createServer((req,res)=>{
    let newUrl=url.parse(req.url)
    console.log(newUrl);
    if(newUrl.pathname=="/")
        {
            fs.readFile("index.html",(error,data)=>{
                if(error){
                    res.writeHead(404,{"Content-Type":"text/html"})
                    return res.end("PAge not Found")
                }
                res.writeHead(200,{"Content-Type":"text/html"})
                res.write(data)
                res.end();

            })
        }
        else if(newUrl.pathname=="/about.html")
            {
                fs.readFile("about.html",(error,data)=>{
                    if(error){
                        res.writeHead(404,{"Content-Type":"text/html"})
                        return res.end("Page not Found")
                    }
                    res.writeHead(200,{"Content-Type":"text/html"})
                    res.write(data)
                    res.end();
    
                })
            }
            else{
                {
                    fs.readFile("error.html",(error,data)=>{
                        if(error){
                            res.writeHead(404,{"Content-Type":"text/html"})
                            return res.end("Page not Found")
                        }
                        res.writeHead(200,{"Content-Type":"text/html"})
                        res.write(data)
                        res.end();
        
                    })
                }
            }
})


app.listen(3000)