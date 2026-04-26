import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../../firebase-config";
import PageHeader from "../layout/PageHeader";
import { useNavigate } from "react-router-dom";
const Rooms = () => {

  const nav = useNavigate();

  const [myRoom, setMyRoom] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try{
        const name = Cookies.get("name");
        const filteredQuery = query(
          collection(db, "room"),
          where("roomAdmin", "==", name)
        );
        const data = await getDocs(filteredQuery);
        setMyRoom(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }catch(err){
        console.log(err)
      }
    };
    getData();
  }, []);

  return (
    <div className=" overflow-hidden overflow-y-auto max-h-screen ">
      <PageHeader title={"My Rooms"} />

      {/* Rooms list */}
      <div className="text-sm mt-2  bg-black text-slate-200 list-none w-screen p-3 mb-12">
        {myRoom.length > 0 ? (
          myRoom.map((data, i) => (
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
                  <span>#{data?.roomCode}</span>
                  <span>{data?.members?.length || 0} 👥</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="mx-auto mt-5 text-slate-100">
            No rooms created yet!
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
