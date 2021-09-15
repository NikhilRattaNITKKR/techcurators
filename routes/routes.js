const express = require("express");
const questionModel = require("../models/models");
const fs       = require('fs');
const {getId} = require('../utils/getId');
const {authorize,readData}=require('../utils/readdata');
const app = express();


app.get("/", function(req, res){              //Route for home
    res.render('index.ejs');
  });

app.post("/add_data", async (request, response) => {                            //Route to get all data
   
    let id=getId(request.body.sheet);                                           //extracting the sheet id from url
    let range="Questions!A2:H";
    try{ 
    fs.readFile('credentials.json', (err, content) => {                         //reading the sheet using functions defined in utility
        if (err) return console.log('Error loading client secret file:', err);
        dataArr=authorize(JSON.parse(content), readData,id,range);
      });
      response.status(201).send("Data Saved");
    } catch (error) {
      console.log(error.message)
      response.status(500).send(error);
    }
});

app.get("/get_data", async (request, response) => {                             //Route to get data by difficulty level
    const data = await questionModel.find({}); 
    try {
      response.send(data);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  app.get("/get_data_by_difficulty", async (request, response) => {
    const data = await questionModel.find({difficulty:request.query.difficulty});
    try {
      response.send(data);
    } catch (error) {
      response.status(500).send(error);
    }
  });

  module.exports = app;