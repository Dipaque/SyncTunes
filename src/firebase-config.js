import { initializeApp } from "firebase/app";
import {getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
const firebaseConfig = {
    apiKey: "AIzaSyA-zFT80awaO3ZcA54PbSfKhwPd9h3moJY",
    authDomain: "sharemymusic-fbb66.firebaseapp.com",
    projectId: "sharemymusic-fbb66",
    storageBucket: "sharemymusic-fbb66.appspot.com",
    messagingSenderId: "241756514361",
    appId: "1:241756514361:web:db73e172bdfaec134345e8"
  };
  

  const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
export {db,auth}