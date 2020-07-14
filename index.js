var rp = require("request-promise");
var $ = require("cheerio");
var express = require("express");
var os = require("os");
var bodyParser = require("body-parser");
var createPlaylistFile = require("./functions/createPlaylistFile");

var app = express();
var host = "0.0.0.0";
var port = 3030;
var ifaces = os.networkInterfaces();

let ipSet=()=> {
	let ip=undefined
	Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
      //console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      //console.log(ifname, iface.address);
      ip=iface.address;
    }
    ++alias;
  });
});
return ip
}

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

app.listen(port, host, function () {
	
  console.log(
    `Server started at ${new Date().toTimeString()} \nListening on ${
      ipSet()
    }:${port}`
  );
});

// app.use(express.static('public'))/* everything that is in this folder, wil be presented => TODO: s*/

app.get("/playlist", (req, res) => {
  //"TODO: fix problem with Ukraina and Footballs , possible errors are: https, long token with id,pid and other params <= why it is working in VLC?")
  console.log(`Requested playlist at ${new Date().toTimeString()}`);
  //  createPlaylistFile("http://telego477.com");
  res.download("./data/playlist.m3u", "playlist.m3u");
});

setInterval(() => createPlaylistFile("http://telego477.com"), 1000 * 60 * 15);
