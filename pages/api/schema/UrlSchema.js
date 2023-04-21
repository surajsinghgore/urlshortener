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