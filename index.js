const express = require("express");
const app = express();
const router = express.Router();
const mongoose = require("mongoose");

const path = require("path");
const config = require("./config/database");

const authentication = require("./routers/authentication")(router); // Import authentication Router

const bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err)=>{
  if(err){
    console.log("CouldNot connect database: "+err);
  }else{
    console.log("Database connection established: "+config.db);
  }
});

//Middle Ware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client/dist'));
app.use('/authentication', authentication);

app.get('*', (req, res)=>{
  // res.send('Hello World!');
  res.sendFile(path.join(__dirname+'/client/dist/index.html'));
});

app.listen(3030, ()=>{
  console.log("Listening on 3030");
});
