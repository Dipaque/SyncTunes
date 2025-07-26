import React, { useEffect, useState } from 'react'
import logo from '../assests/logo.png'
import { auth, db } from '../firebase-config'
import { GoogleAuthProvider,onAuthStateChanged,signInWithPopup } from 'firebase/auth'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
import { doc, getDoc, setDoc } from 'firebase/firestore'
const Login = () => {
  const [user,setUser]= useState(null)
  const [isLoading,setIsLoading] = useState(false);
  const {setPathName} = useStateContext()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        Cookies.set('name', user.displayName);
        Cookies.set('email', user.email);
        Cookies.set('phone', user.phoneNumber);
        Cookies.set('photoUrl', user.photoURL);
        Cookies.set('uid', user.uid);
        setPathName('/home');
        nav('/home');
      } else {
        setUser(false); // Means not logged in
      }
      setIsLoading(false); // Done checking
    });
  
    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
    const nav = useNavigate()
    const provider = new GoogleAuthProvider();
    const handleLogin=async()=>{
        signInWithPopup(auth, provider)
  .then(async(result) => {
    // The signed-in user info.
    const user = result.user;
    Cookies.set('name',user.displayName)
    Cookies.set('email',user.email)
    Cookies.set('phone',user.phoneNumber)
    Cookies.set('photoUrl',user.photoURL)
    Cookies.set('uid',user.uid)
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    // Only set if the user doesn't exist in Firestore yet
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || null,
        phoneNumber: user.phoneNumber || null,
        photoURL: user.photoURL || null,
        emailVerified: user.emailVerified,
        createdAt: new Date(),
        provider: user.providerData[0]?.providerId || 'google',
      });
    } 

    nav('/home')
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode,errorMessage)
  });
    }
    return (
      <div className="bg-black flex flex-col items-center gap-2 justify-center h-screen">
        <img src={logo} height={100} width={100} alt="logo" />
        
        {!isLoading && user === false && (
          <button
            className="flex flex-row-reverse gap-2 justify-around border rounded-lg bg-slate-50 p-3 text-black"
            type="button"
            onClick={handleLogin}
          >
            Continue with Google
            <img src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg" alt="google" />
          </button>
        )}
      </div>
    );
    
}

export default Login