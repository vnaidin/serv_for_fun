var rp = require("request-promise");
var $ = require("cheerio");
var express = require("express");
var bodyParser = require("body-parser");
var extractPlaylist = require("./functions/extractPlaylist");
var writeData = require("./functions/writeData");


var app = express();
var host = "0.0.0.0";
var port = 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DEvarE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

/* add public folder with elementary html*/

app.listen( port,host, function(){
console.log(`Server started at ${new Date().toTimeString()} \nListening on ${host}:${port}`)});

app.use(express.static('public'))/* everything that is in this folder, wil be presented => TODO: s*/


var arrOfLinks = [];
var templateToWrite = [];

app.get("/playlist", (req, res) => {
    //console.log("TODO: fix problem with Ukraina and Footballs \npossible errors are: \nhttps, \nlong token with id,pid and other params \nand it is working in VLC")
    console.log(`Requested playlist at ${new Date().toTimeString()}`);
    console.log("Headers of requesting device:")
    console.log(req.headers);
    res.download("./data/playlist.m3u", "playlist.m3u")
});

setInterval(()=>{console.log("Refreshing playlist...");
                 var link = "http://telego477.com";
rp(link)
  .then(html => {
    for (
      var tr = 1;
      tr <
      $(
        "#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody",
        html
      ).children().length +
        1;
      tr++
    ) {
      for (var td = 1; td < 5; td++) {
          arrOfLinks.push([
          link +
            $(
              "#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody > tr:nth-child(" +
                tr +
                ") > td:nth-child(" +
                td +
                ") > div > a",
              html
            ).attr("href"),
          $(
            "#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody > tr:nth-child(" +
              tr +
              ") > td:nth-child(" +
              td +
              ") > div > a",
            html
          )
            .text()
            .trim()
        ]);
        //console.log("filling the array=>", arrOfLinks.length);
      }
    }
  })
  .catch(err => {
    console.log("err in collecting links => ", err);
  })
  .finally(e => {console.log("Scanned channels count:", arrOfLinks.length);  
    Promise.all(arrOfLinks.map((x) => extractPlaylist(x)))
    .then(function(values) {
    console.log(
        "Returned channels count:",
        values.filter(x => x !== undefined).length
      );
      templateToWrite.push(
        "#EXTM3U\r\n" +"#EXTINF:0,K1\r\nhttps://edge1.iptv.macc.com.ua/life/k1_3/index.m3u8"+"#EXTINF:0,M2\r\nhttp://live.m2.tv:80/hls3/stream.m3u8"+ values.filter(x => x !== undefined).join("")
      );
    })
    .then(() => {
      writeData("playlist", templateToWrite[0], ".m3u");
    })
    .catch(err => console.log("error in /playlist", err))}); 
arrOfLinks=[];
templateToWrite=[];
},1000*60*15);
