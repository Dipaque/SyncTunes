import React, { useEffect, useState } from 'react'
import logo from '../assests/logo.png'
import { auth } from '../firebase-config'
import { GoogleAuthProvider,onAuthStateChanged,signInWithPopup } from 'firebase/auth'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
const Login = () => {
  const [user,setUser]= useState('')
  const {setPathName} = useStateContext()
  useEffect(()=>{
    onAuthStateChanged(auth,(user)=>{
      if(user){
        setUser(user)
        Cookies.set('name',user.displayName)
        Cookies.set('email',user.email)
        Cookies.set('phone',user.phoneNumber)
        Cookies.set('photoUrl',user.photoURL)
        Cookies.set('uid',user.uid)
        setPathName('/home')
        nav('/home')
      }
    })
  },[])
    const nav = useNavigate()
    const provider = new GoogleAuthProvider();
    const handleLogin=()=>{
        signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    Cookies.set('name',user.displayName)
    Cookies.set('email',user.email)
    Cookies.set('phone',user.phoneNumber)
    Cookies.set('photoUrl',user.photoURL)
    Cookies.set('uid',user.uid)
    nav('/home')
    // console.log()
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
    }
  return (
    <div className='bg-black flex flex-col items-center gap-2 justify-center h-screen '>
      
<img src={logo} height={100} width={100} />
        <button 
        className='flex flex-row-reverse gap-2 justify-around border rounded-lg bg-slate-50 p-3  text-black'
        type='button'
        onClick={()=>handleLogin()}>
            Continue with Google
            <img src='https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg' />
        </button>
    </div>
  )
}

export default Login