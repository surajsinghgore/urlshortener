
# URL SHORTENER

This project allow user to sort long URL easily using this project 


## Features

- URL SHORTENER
- VALIDATE URL 
- RESPONSIVE
- SIMPLE DESIGN


## Environment Variables

To run this project, you will need to add the following environment variables to your .env.local file

`DATABASE_URL`


## MONGODB schema
1.pages/api/schema/urlSchema
```bash
const mongoose =require('mongoose');

const urlSchema=new mongoose.Schema({
shortId:{
type:String,required:true,unique:true
},

redirectURL:{type:String,required:true},
Clicks:[{timestamp:{type:Number}}]
},
{timestamps:true}
);

mongoose.models = {};
const URLSCHEMA=mongoose.model('URL',urlSchema );



module.exports=URLSCHEMA
```
## SETUP MONGODB CONNECTION
2.pages/api/middleware/DbConnection
```bash
const mongoose=require('mongoose');
mongoose.set('bufferCommands', false);
export default async function DbConnection(req,res) {
 try{
  mongoose.connect(process.env.NEXT_PUBLIC_DBCONNECT)



 }
 catch(e){
return  res.status(500).json({ message:'DATABASE CONNECTION ERROR' })
 
 }
}

```
## SERVER APIS

3.pages/api/URLPOST

```bash
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


```


4.pages/api/RedirectURL

```bash
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

```

## CLIENT SIDE

5.FETCH pages/api/URLPOST to sort URL

provide Original URL

```bash 
const shortUrl=async()=>{
let res=await fetch('URL/api/URLPOST',{
method:"POST",
headers:{"Content-Type": "application/json"},
body:JSON.stringify({url:input})
})
let data=await res.json();
// error
if(res.status==500){

addToast(data.message, {
      appearance: 'error',
      autoDismiss: true,
    })
}
// 400
else if(res.status==400){

addToast(data.message, {
      appearance: 'warning',
      autoDismiss: true,
    })
}
else{
sessionStorage.setItem('shortId',`${URL}${data.data.shortId}`)
sessionStorage.setItem('redirectURL',data.data.redirectURL)
setRedirectUrl(data.data.redirectURL)
sessionStorage.setItem('ClickLength',data.data.Clicks.length)
setClickCount(data.data.Clicks.length)
setSortID(`${URL}${data.data.shortId}`)
setInput(`${URL}${data.data.shortId}`)
addToast(data.message, {
      appearance: 'success',
      autoDismiss: true,
    })

}
}

```


6.REDIRECT to Original URL from setSortID 

pages/api/RedirectURL to sort URL

provide Original URL

[index].js

```bash 
import { useRouter } from 'next/router'
export default function Index() {
 const { addToast } = useToasts()
const router = useRouter();
const shortID=router.query.index;
const redirectUrl=async()=>{
if(shortID!==undefined){


const res=await fetch(`url/api/RedirectToURL?shortID=${shortID}`)
const data=await res.json();
// 500
if(res.status==500){

addToast(data.message, {
      appearance: 'error',
      autoDismiss: true,
    })
}
// 400
else if(res.status==400){

addToast(data.message, {
      appearance: 'warning',
      autoDismiss: true,
    })
}
window.location.href = data.redirectURL

}

}
  useEffect(()=>{
  if(shortID!==undefined){
  redirectUrl();
  }
  })
  return (
    <div style={{backgroundColor:'white'}}></div>
  )
}
```
## Screenshots

![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1682049622/Screenshot_242_sxehqf.png)

![App Screenshot](https://res.cloudinary.com/dnxv21hr0/image/upload/v1682049623/Screenshot_243_q268n2.png)


## Authors

- [@surajsinghgore](https://github.com/surajsinghgore)


## Feedback

If you have any feedback, please reach out to us at surajthakurrs45@gmail.com


## Badges

Add badges from somewhere like: [shields.io](https://shields.io/)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)


## Tech Stack

**Client:** NEXTJS,  TailwindCSS

**Server:** Node, Express,Nanoid


## Roadmap

- Setup nextjs Project
- Installed required project libraries
- Setup mongodb database to store original url and also generate shortid using library nanoid
- create UI to take URl from Clients
- Store details in database and return shortid to Clients
 

