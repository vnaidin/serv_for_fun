const rp = require('request-promise');
const $ = require('cheerio');

const extractPlaylist = require('./extractPlaylist');
const writeData = require('../writeData');

module.exports = (link) => {
	console.log('Refreshing playlist...');
	rp(link)
		.then((html) => {
			const arrOfLinks = [];
			for (
				let tr = 1;
				tr <
				$(
					'#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody',
					html,
				).children().length +
					1;
				tr++
			) {
				for (let td = 1; td < 5; td++) {
					arrOfLinks.push([
						link +
							$(
								'#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody > tr:nth-child(' +
									tr +
									') > td:nth-child(' +
									td +
									') > div > a',
								html,
							).attr('href'),
						$(
							'#main > div > div.layout-wrapper > div > div > div.layout-cell.content > article:nth-child(1) > div > div > table:nth-child(2) > tbody > tr:nth-child(' +
								tr +
								') > td:nth-child(' +
								td +
								') > div > a',
							html,
						)
							.text()
							.trim(),
					]);
					//console.log("filling the array=>", arrOfLinks.length);
				}
			}
			return arrOfLinks;
		})
		.then((linksArray) => {
			console.log('Scanned channels count:', linksArray.length);

			Promise.all(linksArray.map((link) => extractPlaylist(link)))
				.then(function (values) {
					console.log(
						'Returned channels count:',
						values.filter((x) => x !== undefined).length,
					);
					writeData(
						'playlist',
						'#EXTM3U\r\n' +
							'\r\n#EXTINF:0,K1\r\nhttps://edge1.iptv.macc.com.ua/life/k1_3/index.m3u8\r\n' +
							'\r\n#EXTINF:0,M2\r\nhttp://live.m2.tv:80/hls3/stream.m3u8\r\n' +
							values.filter((x) => x !== undefined).join(''),
						'.m3u',
					);
				})
				.catch((err) => console.log('error in /playlist', err));
		})
		.catch((err) => {
			console.log('err in collecting links => ', err);
		});
};
