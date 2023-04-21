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
