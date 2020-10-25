const fs = require('fs');
const outDir = './data';

module.exports = (name, data, fileType) => {
	if (!fs.existsSync(outDir)) {
		console.log('creating folder', outDir);
		fs.mkdirSync(outDir);
	}

	switch (fileType) {
		case '.m3u':
			fs.writeFile('./data/' + name + fileType, data, (err) => {
				if (err) {
					console.log('Error writing files', err);
				} else {
					console.log(
						`Successfully wrote file ${name}${fileType} at ${new Date().toTimeString()}`,
					);
				}
			});
			break;

		default:
			try {
				fs.writeFileSync('./data/' + name + fileType, JSON.stringify(data));
				console.log('Successfully wrote file ' + name + fileType);
			} catch (err) {
				console.log('Error writing files', err);
			}
			break;
	}
};
