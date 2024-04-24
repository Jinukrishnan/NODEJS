// display data
async function getData(){
fetch('http://localhost:3000/getData')
.then((res)=>res.json())
.then((data)=>{
    console.log(data);
    let struct=``
    data.map((donor)=>{
        struct+=` 
        <div class="col-sm-2 my-3"><input type="text"  disabled=true name=${donor.name} value=${donor.name} id="name-${donor._id}"></div>
        <div class="col-sm-2 my-3"><input type="text"  disabled=true name=${donor.email} value=${donor.email} id="email-${donor._id}"></div>
        <div class="col-sm-2 my-3"><input type="text"  disabled=true name=${donor.phone} value=${donor.phone} id="phone-${donor._id}"></div>
        <div class="col-sm-2 my-3" ><input type="text" disabled=true name=${donor.bloodgroup} value=${donor.bloodgroup} id="blood-${donor._id}"></div>
        <div class="col-sm-2 my-3"><input type="text"  disabled=true name=${donor.genter} value=${donor.genter} id="genter-${donor._id}"></div>
        <div class="col-sm-2 my-3">
            <button class="btn btn-primary"onclick="handleEdit('${donor._id}')" >Edit</button>
            <button class="btn btn-success"onclick="handleSave('${donor._id}')" >Save</button>
            <button class="btn btn-danger" onclick="handleDelete('${donor._id}')" >Delete</button>
        </div>`
    })
    document.getElementById('main').innerHTML=struct
})
.catch((error)=>{
    console.log(error);
})
}

getData()
// enable text field 
function handleEdit(id){
    let name=document.getElementById(`name-${id}`)
    name.disabled=false;
    let email=document.getElementById(`email-${id}`)
    email.disabled=false;
    let phone=document.getElementById(`phone-${id}`)
    phone.disabled=false;
    let blood=document.getElementById(`blood-${id}`)
    blood.disabled=false;
    let genter=document.getElementById(`genter-${id}`)
    genter.disabled=false
}
// edit
async function handleSave(id){
    let name=document.getElementById(`name-${id}`).value;
    let email=document.getElementById(`email-${id}`).value;
    let phone=document.getElementById(`phone-${id}`).value;
    let bloodgroup=document.getElementById(`blood-${id}`).value;
    let genter=document.getElementById(`genter-${id}`).value;
    console.log(name,email,phone,bloodgroup,genter);
    const data={id,name,email,phone,bloodgroup,genter}
    console.log(`data ${data}`);
    const json_data=JSON.stringify(data);
    console.log(json_data);

    const response=await fetch('http://localhost:3000/saveData',{
        "method":"put",
        "Content-Type":"text/json",
        "body":json_data

    })
    let parsed_response = await response.text();

    if(parsed_response === "success") {
        alert("Updation Success");
        getData()
    }else {
        alert("Updation failed");
    }
}

// Delete

async function handleDelete(id){
    console.log("id : ", id);

    let response =  await fetch("http://localhost:3000/deleteData",{
         "method" : "DELETE",
         "headers" : {
             "Content-Type" : "text/plain",
         },
         "body" : id,
     });
 
     console.log("response : ", response);
     let parsed_response = await response.text();
     console.log("parsed_response : ", parsed_response);
 
     if(parsed_response === "success") {
         alert("Deletion successful");
         getData()
     }else {
         alert("Deletion failed");
     }
 
}