const express = require('express');
const rp = require('request-promise');
const $ = require('cheerio');
const cors = require('cors');
const os = require('os');
const bodyParser = require('body-parser');

const createPlaylistFile = require('./functions/tvStream/createPlaylistFile');
const getIp = require('./functions/getIp');

const app = express();
const host = '0.0.0.0';
const port = process.env.PORT || 3030;
const ifaces = os.networkInterfaces();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* TODO: add public folder with  html player, and possibility to switch the channels*/

app.listen(port, host, function () {
	console.log(
		`Server started at ${
			new Date() /* .toTimeString() */
		} \nListening on ${getIp()}:${port}`,
	);
});

app.get('/playlist', (req, res) => {
	console.log(`Requested playlist at ${new Date() /* .toTimeString() */}`);
	res.download('./data/playlist.m3u', 'playlist.m3u');
	createPlaylistFile('http://telego919.com');
});
