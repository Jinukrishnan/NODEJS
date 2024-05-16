const fs= require("fs")

fs.unlink("./message.txt",(error)=>{
    if(error)
        {
            console.log("unable to delete");
        }
        
})