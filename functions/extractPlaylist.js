var rp = require("request-promise");

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
  var transformLink = (stringLink, stringTitle) => {
    //console.log("s", stringLink[0], typeof stringLink);
    switch (stringLink[1]) {
      case "ViP Megahit":
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
      case "ViP Comedy":
        return (
          "http://telecdn.net/" +
          stringLink[0]
            .split("/")[3]
            .replace("vip", "tv1000")
            .replace("html", "php")
        );
      case "Discovery":
        return (
          "http://telecdn.net/" +
          stringLink[0].split("/")[3].replace("-2.html", ".php")
        );
      case "Animal Planet":
        return (
          "http://telecdn.net/" +
          stringLink[0].split("/")[3].replace("-2.html", ".php")
        );
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
      /* case "Футбол 1 (Украина)":
        return "https://sportbox.ws/ukrfoot1.html";
 */
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
      /*  console.log(
        "futbol 1",
            html.split("var videoLink =")[1].substring(1, 340), 
        html.split("function startPlayer()")[1].split(";")[0]
      ); */
      var filtering = html.split(" ").filter(x => x.startsWith("file"));
      return (
        "\r\n#EXTINF:0," +
        link[1] +
        "\r\n" +
        "#EXTVLCOPT:network-caching=1000\r\n" +
        filtering[0].split(`"`)[1] +
        "\r\n"
      );
    })
    .catch(err => {
        //console.log("Error occured => ", err.message);
    });
};
