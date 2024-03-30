const express = require("express");
const logger = require("./middleware/logger");
require("dotenv").config();
const {notFound,errorHandler}=require("./middleware/error");
const connectToDB =require("./config/db");


//connection to DB
connectToDB();
 //init App
  const app = express();

//Apply Middlewares
app.use(express.json());
app.use(logger);

//Routes
app.use("/api/projects",require("./routes/project"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/users",require("./routes/users"));
app.use("/api/showcases",require("./routes/showcase"));
app.use("/api/skill",require("./routes/skill"));
app.use("/api/resourceSharing",require("./routes/ResourseSharing"));
//app.use("/api/en",require("./routes/mail"));
//app.use("/api/externalapi",require("./routes/extirnalapi"));
app.use("/api/weather",require("./routes/externalapi"));
app.use("/api/mail",require("./routes/mail"));
app.use("/api/collaborative",require("./routes/Collaborative"));
app.use("/api/upload",require("./routes/upload"));






//app.use("/api/projects/:id/showcases",require("./routes/showcase"));
 // Error Handler Midleware
 app.use(notFound);
 app.use(errorHandler);

  //running server
  const PORT= process.env.PORT ||5000;
 app.listen(PORT,() => console.log(`server is running in ${process.env.NODE_ENV} on port ${PORT}`)
 ); 


 