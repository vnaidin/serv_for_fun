const fs = require("fs");
const d = new Date();

module.exports = (name, data, fileType) => {
  switch (fileType) {
    case ".m3u":
      fs.writeFile("./data/" + name + fileType, data, err => {
        if (err) {
          console.log("Error writing files", err);
        } else {
          console.log(
            `Successfully wrote file ${fileType} at ${d.toTimeString()}`
          );
        }
      });
      break;

    default:
      try {
        fs.writeFileSync("./data/" + name + fileType, JSON.stringify(data));
        console.log("Successfully wrote file " + name + fileType);
      } catch (err) {
        console.log("Error writing files", err);
      }
      break;
  }
};
