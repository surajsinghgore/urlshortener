import { useRouter } from 'next/router'
import { useEffect } from 'react';
import {  useToasts } from 'react-toast-notifications';

export default function Index() {
 const { addToast } = useToasts()
  const router = useRouter();
const shortID=router.query.index;

const redirectUrl=async()=>{
if(shortID!==undefined){


const res=await fetch(`http://localhost:3000/api/RedirectToURL?shortID=${shortID}`)
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
