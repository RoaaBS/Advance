const{ project}=require("./models/Project");
const {project}=require("./data");
const connectToDB =require("./config/db");
require("dotenv").config();

//connection To DB
connectToDB();

//import projects (seeding database)

const importproj =async () =>{
    try{
  await project.insertMany(project);
   console.log("project imported");
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}



//remove  projects 

const removeproj =async () =>{
    try{
  await project.insertMany(project);
   console.log("project Removed!");
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}


  if(process.argv[2]=== "-import"){
    importproj();
  }else if(process.argv[2]=== "-remove"){
    removeproj();
  }
  