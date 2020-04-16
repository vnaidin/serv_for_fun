var rp = require("request-promise");
const $ = require("cheerio");
/** this module returns promise, in which we are forming the formatted part of .m3u file */
module.exports = (link) => {
  //TODO: we are getting the link to the outer player here ==> if possible also get the tvProgram for current day and add it to .m3u
  /**
   * HERE WE TAKE LINK AND TRANSFORM IT INTO INNER LINK=>
   * => AND THEN LOOKING FOR ATTRIBUTE
   */
  // http://telego477.com/novyj-kanal.html ==>http://telecdn.net/novyj-kanal.php
  /**
   * Function provides transformation of outer links of the website into inner links, from which we are getting the streams
   * @param {String} stringLink Http link which will be transformed
   * @param {String} stringTitle Title of the channel
   */
  const transformLink = (stringLink, stringTitle) => {
    switch (stringLink[1]) {
      case "ViP Megahit":
      case "ViP Comedy":
        return (
          "http://telecdn.net/" +
          stringLink[0]
            .split("/")[3]
            .replace("vip", "tv1000")
            .replace("html", "php")
        );
      case "ViP Premiere":
        return (
          "http://telecdn.net/" +
          stringLink[0]
            .split("/")[3]
            .replace("vip-premiere", "tv1000-premium")
            .replace("html", "php")
        );
      case "Discovery":
      case "Animal Planet":
      case "Discovery science":
        return (
          "http://telecdn.net/" +
          stringLink[0].split("/")[3].replace("-2.html", ".php")
        );
      case "Остросюжетное HD":
        return (
          "http://telecdn.net/" +
          stringLink[0].split("/")[3].replace("-hd.html", ".php")
        );
      case "Футбол 1 (Украина)":
        return "https://sportbox.ws/ukrfoot1.html";
      case "Футбол 2 (Украина)":
        return "https://sportbox.ws/football2ukraine.html";
      /*case "ТРК Украина":
        return "https://sportbox.ws/ukrainetv.html";*/

      default:
        return (
          "http://telecdn.net/" +
          stringLink[0].split("/")[3].replace("html", "php")
        );
    }
  };
    
return rp(transformLink(link), {
    headers: { referer: "http://telego477.com/", Connection: "Keep-Alive" }
  })
    .then(html => {
      const writeFinStr = (title, link) => {
        return (
          "\r\n#EXTINF:0," +
          title +
          "\r\n"  +
          link +
          "\r\n"
        );
      };
      /**we are checking for the source, if it is sportbox.ws =>we are executing another m3u finder */
      return $("title", html).text().length > 7
        ? writeFinStr(link[1], html.split(" ").filter(x=>x.startsWith("'http"))[0].split("'")[1])
        : writeFinStr(
            link[1],
            html
              .split(" ")
              .filter(x => x.startsWith("file"))[0]
              .split(`"`)[1]
          );
    })
    .catch(err => {
      /* console.log(
        "Error in extrPlaylist => "
        ,err.message.split("The requested URL /")[1].substring(0, 20)
      ); */
    });
};
