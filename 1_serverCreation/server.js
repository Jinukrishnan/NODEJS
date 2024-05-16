// create a server
const http=require("http")

const app=http.createServer((req,res)=>{
    console.log('server created');
    res.end("hai")
})

app.listen(3000);