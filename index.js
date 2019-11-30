var rp = require("request-promise");
var $ = require("cheerio");
var express = require("express");
var bodyParser = require("body-parser");
var extractPlaylist = require("./functions/extractPlaylist");
var writeData=require("./functions/writeData")


var app = express();
var host = "0.0.0.0"/*process.env.HOST || "127.0.0.0"*/;
var port= 3030

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DEvarE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
};

app.use(allowCrossDomain);

app.listen( port,host, function(){console.log(`listening on ${host} :${port}`)});

var arrOfLinks = [];
var templateToWrite = [];
app.get("/hello", (req, res) => {
  res.send("Hello World!");
});

app.get("/playlist", (req, res) => {
  Promise.all(arrOfLinks.map((x) => extractPlaylist(x)))
    .then(function(values) {
      templateToWrite.push(
        "#EXTM3U\r\n" + values.filter(x => x !== undefined).join("")
      );
    })
    .then(() => {
      writeData("playlist", templateToWrite[0], ".m3u");
    })
    .catch(err => console.log("error in /playlist", err))
  console.log(`asked for playlist at ${new Date().toTimeString()}`)
  res.download("./data/playlist.m3u", "playlist.m3u");
});

var link = "http://telego477.com";
/**FILLING THE ARRAY OF LINKS TO ALL STREAMS ON THIS WEBSITE */
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
        /*         console.log(
          "channel image",
          $(
            "#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody > tr:nth-child(" +
              tr +
              ") > td:nth-child(" +
              td +
              ")  > div > a > div:nth-child(1) > img",
            html
          ).attr("src")
        ); */
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
  .finally(e => console.log("filled array", arrOfLinks.length));
