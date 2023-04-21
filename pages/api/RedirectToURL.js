import URLSCHEMA from "./schema/UrlSchema";
import DbConnection from "./middleware/DbConnection";

export default async function handler(req, res) {
  if (req.method == "GET") {
    // require elements from body
    let shortId = req.query.shortID;
    if (shortId === undefined) {
      return res.status(400).json({ message: "ShortId must Be there" });
    }

    await DbConnection();
    const dataFetch = await URLSCHEMA.findOneAndUpdate(
      { shortId },
      { $push: { Clicks: { timestamp: Date.now() } } }
    );
    if (dataFetch === null) {
      return res.status(400).json({ message: "Invalid ShortId Provided" });
    }
return res.status(200).json({redirectURL:dataFetch.redirectURL})
   
  } else {
    return res.status(500).json({ message: "Only GET REQUEST IS ALLOWED" });
  }
}
