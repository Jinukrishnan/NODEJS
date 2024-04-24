const http=require('http');
const port=3000;
const url=require('url');
const fs=require('fs')
const queryString=require('querystring')
const {MongoClient,ObjectId}=require('mongodb');
const { log } = require('console');
const client=new MongoClient('mongodb://localhost:27017/');
const server=http.createServer(async(req,res)=>{
    // Access databases and collections
    const db=client.db('bloodbank');
    const collection=db.collection('user_col');

    console.log(req.url);

    // Parse the  request url
    const parsed_url=url.parse(req.url);
    console.log('parsed url: ',parsed_url);

    if(parsed_url.pathname=='/')
    {
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(fs.readFileSync('../front-end/index.html'))
    }
    else if(parsed_url.pathname=='/css/index.css')
    {
        res.writeHead(200,{"Content-Type" : "text/css"});
        res.end(fs.readFileSync("../front-end/css/index.css"));
    }
    else if(parsed_url.pathname=='/templates/add_user.html')
    {
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(fs.readFileSync('../front-end/templates/add_user.html'))
    }
    else if(parsed_url.pathname=='/css/add_user.css')
    {
        res.writeHead(200,{"Content-Type" : "text/css"});
        res.end(fs.readFileSync("../front-end/css/add_user.css"));
    }
    else if(parsed_url.pathname=='/templates/get_user.html')
    {
        res.writeHead(200,{'Content-Type':'text/html'})
        res.end(fs.readFileSync('../front-end/templates/get_user.html'))
    }
    else if(parsed_url.pathname=='/css/get_user.css')
    {
        res.writeHead(200,{"Content-Type" : "text/css"});
        res.end(fs.readFileSync("../front-end/css/get_user.css"));
    }
    else if(parsed_url.pathname=='/js/custom.js')
    {
        res.writeHead(200,{"Content-Type" : "text/js"});
        res.end(fs.readFileSync("../front-end/js/custom.js"));
    }
   


     //Handle form submission on POST request to /submit
     if(parsed_url.pathname=='/submit'&&req.method=='POST'){
        console.log("submit worked");

        let body=''
        // Collect data as its comes in chunks
        req.on('data',(chunk)=>{
            console.log(`chunk :${chunk}`);
            console.log('chunk.toString() : ', chunk.toString());
            body+=chunk.toString();
            console.log(`body:${body}`);
        })
        // Process the form data on end of the request
        req.on('end',async()=>{
            if(body!=null) {
            const formData=queryString.parse(body);
            console.log(formData);
            collection.insertOne(formData)
            .then(()=>{
                console.log("successfully added");
            })
            .catch((error)=>{
                console.log(error);
            })
        }
        })
        res.writeHead(200,{'Content-Type' : 'text/plain'});
        res.end("Form submitted successfully");
     }


    //  Handle get request to the user details
    if(req.method=="GET"&&parsed_url.pathname=='/getData'){
        const data=await collection.find().toArray();
        console.log(`data:${data}`);
        const json_data=JSON.stringify(data);
        console.log(`json data: ${json_data}`);
        res.writeHead(200,{"Content-Type" : "text/json"});
        res.end(json_data);
    }
    // handle update
    if(req.method=="PUT"&&parsed_url.pathname=='/saveData'){
       let body=""

       req.on('data',(chunks)=>{
        console.log(chunks);
        body+=chunks;
        console.log(body);
       })
       req.on('end',async()=>{
        let data=JSON.parse(body);
        console.log(`data${data}`);
        let id=data.id;
        console.log(`type of id ${typeof(id)}`);
        let _id=new ObjectId(id)
        console.log(`type of _id ${typeof(_id)}`);


        let updateData={
            name:data.name,
            email:data.email,
            phone:data.phone,
            bloodgroup:data.bloodgroup,
            genter:data.genter
        }

        await collection.updateOne({_id},{$set:updateData})
        .then((message)=>{
            console.log("Document updated successfully : ", message);
            res.writeHead(200,{"Content-Type" : "text/plain"});
            res.end("success");
        })
        .catch((error)=> {
            console.log("Document not updated : ", error);
            res.writeHead(400,{"Content-Type" : "text/plain"});
            res.end("failed");

        })

       });
       
    }
    if(req.method === "DELETE" && parsed_url.pathname === "/deleteData") {
        console.log("Reached delete route");


        let body = "";
        req.on('data',(chunks)=> {
            console.log("Chunks : ", chunks);
            body = body + chunks.toString();
            console.log("body : ", body);
        });
        req.on('end',async ()=> {
            let _id = new ObjectId(body);
            await collection.deleteOne({_id})
                .then((message) => {
                    console.log("Deletion Successful");
                    res.writeHead(200,{"Content-Type" : "text/plain"});
                    res.end("success");
                })
                .catch((error)=> {
                    console.log("Deletion Failed");
                    res.writeHead(200,{"Content-Type" : "text/plain"});
                    res.end("failed");
                })
        })
    }

})

async function connect() {

    //Connect to db
    await client.connect()
        .then((message) => {
            console.log("Database connection established");
        })
        .catch((error) => {
            console.log("Database connection error : ", error);
        })
        .finally(()=> {
            server.listen(port, ()=> {
                console.log(`Server running at http://localhost:${port}`);
            });
        });

}

connect();