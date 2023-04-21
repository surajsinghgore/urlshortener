// generating unique id


import { nanoid } from "nanoid";
const validUrl = require("valid-url");
import URLSCHEMA from "./schema/UrlSchema";
import DbConnection from "./middleware/DbConnection";
export default async function handler(req, res) {
  if (req.method == "POST") {
    // require elements from body
    let {url}=req.body
      await DbConnection();

    // url validation
    if (url === undefined) {
      return res.status(400).json({ message: "URL is Mandatory Field" });
    } else if (url === "") {
      return res.status(400).json({ message: "URL Field Not be Blank" });
    }
    // checking valid URL or NOT
    if (validUrl.isWebUri(url)) {

      // find record to solve dublicasy in database
      let data = await URLSCHEMA.find({ redirectURL: url });
      // checking weather redirect URl already Exists or Not
      // Already somebody generated Redirect URL
      if (data.length != 0) {
        return res
          .status(200)
          .json({ message: "Short URL GENERATED", data: data[0] });
      } else {
        // shortId generated
        let shortId = nanoid(8);
        if (shortId.length !== 8) {
          return res.status(400).json({ message: "Please Try Again" });
        }
        const dataSend = new URLSCHEMA({
          shortId,
          redirectURL: url,
        });

        let dataRes=await dataSend.save();
        return res
          .status(200)
          .json({ message: "Short URL GENERATED", data:dataRes });
      }
    }
    // not valid URL
    else {
      return res.status(400).json({ message: "Please Provide Valid URL" });
    }
  } else {
    return res.status(500).json({ message: "Only POST REQUEST IS ALLOWED" });
  }
}
