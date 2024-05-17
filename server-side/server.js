const http = require("http");
const url = require("url");
const fs = require("fs");
const PORT = 3000;
const queryString = require("querystring");
const { MongoClient, ObjectId } = require("mongodb");
const { log } = require("console");
const client = new MongoClient("mongodb://localhost:27017/");

const app = http.createServer(async(req, res) => {
  const db = client.db("Blood");
  const collection = db.collection("doners");
  const path = url.parse(req.url);
  console.log(path.pathname);
  if (path.pathname == "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync("../client-side/index.html"));
  } else if (path.pathname == "/js/custom.js") {
    res.writeHead(200, { "Content-Type": "text/js" });
    res.end(fs.readFileSync("../client-side/js/custom.js"));
  } else if (path.pathname == "/pages/AddDoner.html") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync("../client-side/pages/AddDoner.html"));
  }

  if (path.pathname == "/submit" && req.method == "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
      console.log(`chunk${body}`);
    });
    req.on("end", async () => {
      if (body != null) {
        const formData = queryString.parse(body);
        console.log(formData);
        collection
          .insertOne(formData)
          .then(() => {
            console.log("successfully added");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync("../client-side/index.html"));
  }
  if (path.pathname == "/getdoner" && req.method == "GET") {
    const data =await  collection.find().toArray();
    console.log(data);
    const json_data = JSON.stringify(data);
    console.log(json_data);
    res.writeHead(200, { "Content-Type": "text/json" });
    res.end(json_data);
  }
  if(req.method=="PUT"&&path.pathname=='/saveData'){
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
 if(req.method === "DELETE" && path.pathname === "/deleteData") {
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

client
  .connect()
  .then((msg) => {
    console.log("database conne ted");
    app.listen(PORT, () => {
      console.log(`server created at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log(`data base connection error ${error}`);
  });
