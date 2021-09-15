const {config} = require('dotenv');
config();
const express  = require("express")
const request  = require('request')
const app      = express();
const mongoose = require("mongoose");
const Router = require("./routes/routes")


const port=process.env.PORT;
const username = process.env.MONGOUSERNAME;
const password = process.env.PASSWORD;
const cluster = process.env.CLUSTERNAME;
const dbname = process.env.DBNAME;

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.set("view engine", "ejs");

app.use(express.static(__dirname+"/public"));

app.use(express.urlencoded()); app.use(express.json());

app.use(require("cors")()) // allow Cross-domain requests 
app.use(express.urlencoded());
app.use(express.json()) 

  app.use(Router);

  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })