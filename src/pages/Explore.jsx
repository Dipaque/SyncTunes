import React, { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase-config';
import PageHeader from '../Components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';
import Spinner from '../Components/loading/Spinner';

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
      <div className="text-sm mt-2  bg-black text-slate-200 list-none w-screen p-3">
        {
            loading ? <Spinner /> : <> {rooms.length > 0 ? (
                rooms.map((data, i) => (
                  <div
                    key={`key-${i}`}
                    className="relative h-44 w-full mb-3 rounded-xl overflow-hidden bg-cover bg-center flex items-end p-2"
                    style={{
                      backgroundImage: `url(${data?.currentPlaying?.image})`,
                    }}
                    onClick={()=>nav(`/room/${data?.roomCode}/player`)}
                  >
                    {/* Black fade overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      
                    {/* Content */}
                    <div className="relative z-10 text-white w-full">
                      <p className="flex items-center gap-2 w-full">
                        <span className="flex-1 text-xs font-semibold truncate">
                          {data?.currentPlaying?.title}
                        </span>
      
                        <div className="sound-bars flex items-end gap-[2px] shrink-0">
                          <div className="bar bar1"></div>
                          <div className="bar bar2"></div>
                          <div className="bar bar3"></div>
                        </div>
                      </p>
      
                      <div className="flex justify-between items-center text-[10px] text-zinc-300 mt-1">
                        <span>{data?.roomCode}</span>
                        <span>{data?.members?.length || 0} 👥</span>
                      </div>
                    </div>
                  </div>
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