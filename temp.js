
const fs = require('fs');

const {google} = require('googleapis');
const express=require('express')
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const folderId = '17GOVMH8OXJOVh3kbz2oYcEYVrHk5Yvhr';
var drive;
var oAuth2Client;

function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uri, refresh_token} = credentials.codes;
  console.log(client_secret, client_id, redirect_uri, refresh_token)
  oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uri);
      oAuth2Client.setCredentials({refresh_token});
      drive = google.drive({version: 'v3', oAuth2Client});
      startServer()
}

fs.readFile('access.json',(err, content)=>{
  if (err) return console.log('Error loading client secret file:', err);
     authorize(JSON.parse(content));
})

async function listFiles(res, auth = oAuth2Client) {
  drive.files.list({
    auth,
    q: "'17GOVMH8OXJOVh3kbz2oYcEYVrHk5Yvhr' in parents",
    pageSize: 10,
    fields: 'nextPageToken, files(id, name, webContentLink)',
  }, (err, res2) => {
    if (err) return console.log('The API returned an error: ' + err);
    var results = res2.data.files.map(itm=>{
      itm.previewUrl = "https://drive.google.com/uc?export=view&id="+itm.id;
      return itm;
    })
    res.send(results)
  });
}


const uploadFile = (fileStream)=>{
  const res = drive.files.create({
    auth:oAuth2Client,
    resource:{
      'name':'zen.jpg',
      parents: [folderId]
    },
    media:{
      mimeType:'image/jpg',
      body: fileStream
    }
  });
  console.log(res.data);
}

app.get('/', (req, res)=>{
  const filePath = path.join(__dirname, "/assets/amazing.jpg");
  console.log("file Uploading");
  uploadFile(fs.createReadStream(filePath));
  res.send("Uploading file");
})

app.get('/getAllWallpapers', (req, res) => {
  try{
    listFiles(res)
  }catch{
    res.send({status:false, message:"An error occured"});
  }
})

const startServer=()=>{
  app.listen(8080,()=>{
    console.log("App started");
  })
}