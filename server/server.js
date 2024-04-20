const http = require('http');
const url = require('url');
const port = 3000;
const fs = require('fs');
const queryString = require('querystring');
const { MongoClient, ObjectId } = require('mongodb');
const { error } = require('console');

const client = new MongoClient("mongodb://127.0.0.1:27017");

const server = http.createServer(async (req, res)=> {

    //Access the database and collection
    const db = client.db("users");
    const collection = db.collection("users_coll");

    console.log("url : ", req.url);

    //Parse the request url
    const parsed_url = url.parse(req.url);
    console.log("parsed_url : ", parsed_url);

    //Serve the HTML file on root request
    if(parsed_url.pathname === '/') {
        res.writeHead(200,{'Content-Type' : 'text/html'});
        res.end(fs.readFileSync('../client/index.html'));
    }else if(parsed_url.pathname === '/style.css') {
        res.writeHead(200,{"Content-Type" : "text/css"});
        res.end(fs.readFileSync("../client/style.css"));
    }else if(parsed_url.pathname === '/add_user.html') {
        res.writeHead(200,{"Content-Type" : "text/html"});
        res.end(fs.readFileSync('../client/add_user.html'));
    }else if(parsed_url.pathname === '/get_user.html') {
        res.writeHead(200,{"Content-Type" : "text/html"});
        res.end(fs.readFileSync('../client/get_user.html'));
    }else if(parsed_url.pathname === '/script.js') {
        res.writeHead(200,{"Content-Type" : "text/javascript"});
        res.end(fs.readFileSync('../client/script.js'));
    }

    //Handle form submission on POST request to /submit
    if(req.method === "POST" && parsed_url.pathname === "/submit") {
        console.log("Form submitted successfully...");

        let body='';

        //Collect data as it comes in chunks
        req.on('data',(chunk)=> {
            console.log("chunk : ", chunk);
            console.log('chunk.toString() : ', chunk.toString());
            body+=chunk.toString();
            console.log("body : ", body);
        });
        //Process the form data on end of the request
        req.on('end',async ()=> {
            const formData = queryString.parse(body);
            console.log("formData : ", formData);

            //Do something with the submitted data
            console.log("name : ", formData.name);
            console.log("email : ", formData.email);
            console.log("password : ", formData.password);

            //Save to a database(next)
            collection.insertOne(formData)
                .then((message) => {
                    console.log("Document saved successfully");
                    console.log("message : ", message);
                })
                .catch((error)=> {
                    console.log("Document not inserted");
                    console.log("Database insertion error : ", error);
                })

            res.writeHead(200,{'Content-Type' : 'text/plain'});
            res.end("Form submitted successfully");
            
        });

    }

    //Handle get request to the user details
    if(req.method === "GET" && parsed_url.pathname === "/getData") {
        let data = await collection.find().toArray();
        console.log("data : ", data);

        let json_data = JSON.stringify(data);
        console.log("json_data : ", json_data);

        res.writeHead(200,{"Content-Type" : "text/json"});
        res.end(json_data);

    }

    if(req.method === "PUT" && parsed_url.pathname === "/editData") {
        let body = "";
        req.on('data',(chunks)=> {
            console.log("chunks : ", chunks);
            body = body + chunks.toString();
            console.log("body : ", body);
        });

        req.on('end',async ()=> {
            console.log("body : ", body);
            let data = JSON.parse(body);
            let id = data.id;
            console.log("id : ", id);
            console.log("typeof(id) : ",typeof(id));
            let _id = new ObjectId(id);
            console.log("_id : ", _id);
            console.log("typeof(_id) : ",typeof(_id));

            let updateDatas = {
                name : data.name,
                email : data.email,
                password : data.password,
            }

            await collection.updateOne({_id},{$set : updateDatas})
                    .then((message)=> {
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
});

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
