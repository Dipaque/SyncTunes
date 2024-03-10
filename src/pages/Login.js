import React from 'react'
import logo from '../assests/logo.png'
import { auth } from '../firebase-config'
import { GoogleAuthProvider,signInWithPopup } from 'firebase/auth'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
const Login = () => {
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
    <div className='bg-black flex flex-col items-center justify-center h-screen '>
        <img src={logo} height={200} width={200} />
        <button 
        className='flex flex-row-reverse justify-around border rounded-lg bg-slate-50 p-3 w-60 text-black'
        type='button'
        onClick={()=>handleLogin()}>
            <b>Continue with Google</b>
            <img src='https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg' />
        </button>
    </div>
  )
}

export default Login