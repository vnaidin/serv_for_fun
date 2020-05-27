var rp = require("request-promise");
var $ = require("cheerio");
var express = require("express");
var os = require("os")
var bodyParser = require("body-parser");
var extractPlaylist = require("./functions/extractPlaylist");
var writeData = require("./functions/writeData");
var createPlaylistFile = require("./functions/createPlaylistFile")


var app = express();
var host = "0.0.0.0";
var port = 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// to allow other devices to connect to server etc.
var allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

/* TODO: add public folder with  html player, and possibility to switch the channels*/

app.listen( port,host, function(){
console.log(`Server started at ${new Date().toTimeString()} \nListening on ${Object.values(os.networkInterfaces())[0][1].address}:${port}`)});

// app.use(express.static('public'))/* everything that is in this folder, wil be presented => TODO: s*/


//var arrOfLinks = [];
//var templateToWrite = [];

app.get("/playlist", (req, res) => {
    //console.log("TODO: fix problem with Ukraina and Footballs \npossible errors are: \nhttps, \nlong token with id,pid and other params \nand it is working in VLC")
    console.log(`Requested playlist at ${new Date().toTimeString()}`);
    console.log("Headers of requesting device:")
    console.log(req.headers);
    res.download("./data/playlist.m3u", "playlist.m3u")
});

setInterval(()=>createPlaylistFile("http://telego477.com"),1000*60*15);
