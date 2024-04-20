console.log("Hello world");

async function geuserData() {

    let userData = await fetch('http://localhost:3000/getData');
    console.log("userData : ", userData);
    let parsedUserData = await userData.json();
    console.log("parsedUserData : ", parsedUserData);

    let tbody = document.getElementById('tbody');
    let content='';

    for(let i=0; i<parsedUserData.length;i++) {
        content = content + `
        <tr>
        <td>${parsedUserData[i]._id}</td>
        <td><input type="text" name="name" id="name-${parsedUserData[i]._id}" value='${parsedUserData[i].name}' disabled="true"></td>
        <td><input type="email" name="email" id="email-${parsedUserData[i]._id}" value='${parsedUserData[i].email}' disabled="true"></td>
        <td><input type="password" name="password" id="password-${parsedUserData[i]._id}" value='${parsedUserData[i].password}' disabled="true"></td>
        <td><button onclick="handleEdit('${parsedUserData[i]._id}')">Edit</button></td>
        <td><button onclick="handleSave('${parsedUserData[i]._id}')">Save</button></td>
        <td><button onclick="handleDelete('${parsedUserData[i]._id}')">Delete</button></td>
        </tr>
        `
    }

    tbody.innerHTML = content;

}

geuserData();

function handleEdit(id) {

    let _id = id;
    console.log("id : ", _id);

    let name = document.getElementById(`name-${_id}`);
    console.log("name : ", name);
    name.disabled = false;

    let email = document.getElementById(`email-${_id}`);
    console.log("email : ", email);
    email.disabled = false;

    let password = document.getElementById(`password-${_id}`);
    console.log("password : ", password);
    password.disabled = false;
    


}

async function handleSave(id) {

    console.log("id : ", id);

    let name = document.getElementById(`name-${id}`).value;
    console.log("name : ", name);

    let email = document.getElementById(`email-${id}`).value;
    console.log("email : ", email);

    let password = document.getElementById(`password-${id}`).value;
    console.log("password : ", password);

    let data = {
        id,
        name,
        email,
        password,
    }
    
    let json_data = JSON.stringify(data);

    let response = await fetch('http://localhost:3000/editData',{
        "method" : "PUT",
        "headers" : {
            "Content-Type" : "text/json"
        },
        "body" : json_data,
    });

    let parsed_response = await response.text();

    if(parsed_response === "success") {
        alert("Updation Success");
    }else {
        alert("Updation failed");
    }


}

async function handleDelete(id) {

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
    }else {
        alert("Deletion failed");
    }

}

