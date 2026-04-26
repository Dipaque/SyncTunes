import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase-config';
import PageHeader from '../Components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/loading/Spinner';
import RoomTemplate from '../Components/RoomTemplate';

const Explore = () => {

    const nav = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(false);

const getPublicRooms = async () => {
    setLoading(true);
  try {
    const q = query(
      collection(db, "room"),
      where("isPrivate", "==", false)
    );

    const querySnapshot = await getDocs(q);

    const rooms = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setRooms(rooms);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    setLoading(false);
    setRooms([]);
  }
};

useEffect(()=>{
 getPublicRooms();
},[])

  return (
    <div className=" overflow-hidden overflow-y-auto max-h-screen ">
      <PageHeader title={"Explore"} />

<span className='text-sm font-semibold mt-2 m-3 mb-3 text-white/70'>Start Jam in global rooms</span>
      {/* Rooms list */}
      <div className="text-sm mt-2  bg-black text-slate-200 list-none w-screen p-3 mb-28">
        {
            loading ? <Spinner /> : <> {rooms.length > 0 ? (
                rooms.map((data, i) => (
                    <RoomTemplate data={data} key={`key-${i}`} />
                ))
              ) : (
                <div className="mx-auto mt-5 text-slate-100">
                  No rooms created yet!
                </div>
              )}</>
        }

       
      </div>
    </div>
  )
}

export default Explore