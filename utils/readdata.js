const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const questionModel = require("../models/models");

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']; 

const TOKEN_PATH = 'token.json';      //path where generated token would be saved


const authorize=(credentials, callback, id , range)=> {     //function to authorize access
  let data=[];
  const {client_secret, client_id, redirect_uris} = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client,id,range);
  });
}
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}
const readData=(auth,id,range)=> {
  const sheets = google.sheets({ version: 'v4', auth });
  sheets.spreadsheets.values.get({
      spreadsheetId: id,
      range:range,
  }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = res.data.values;
      if (rows.length) {
          let dataArr=[];
          // Print columns A and E, which correspond to indices 0 and 4.
          rows.map((row) => {
            let question={};
            question.topic=row[0];
            question.difficulty=row[1];
            question.question=row[2];
            question.option1=row[3];
            question.option2=row[4];
            question.option3=row[5];
            question.option4=row[6];
            question.correct=row[7];

            dataArr.push(question);
          });
          dataArr.forEach(async (dataObj) => {
            const data = new questionModel(dataObj);
            await data.save(); 
        });  
      } else {
          console.log('No data found.');
      }
  });
}

module.exports={
authorize,
readData
}