import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query } from "firebase/firestore";
import Cookies from "js-cookie";
import { db } from "../../firebase-config";
import PageHeader from "../layout/PageHeader";
import { IoSearchOutline } from 'react-icons/io5';
import Spinner from "../loading/Spinner";
import RoomTemplate from "../RoomTemplate";
const Rooms = () => {

  const [myRoom, setMyRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [searchResult, setSearchResult] = useState([]);


  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const name = Cookies.get("name");
        const filteredQuery = query(
          collection(db, "room"),
          where("roomAdmin", "==", name)
        );
        const data = await getDocs(filteredQuery);
        setMyRoom(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Search
  useEffect(()=>{
    if(input){
        const filteredRooms = myRoom.filter((song)=>song.roomCode.toLowerCase().includes(input.toLowerCase()))
        setSearchResult(filteredRooms)
    }
},[input])

  return (
    <div className=" overflow-hidden overflow-y-auto max-h-screen ">
      <PageHeader title={"My Rooms"} />

      <div className="mx-auto mb-5 relative w-fit">
      <IoSearchOutline
        className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70 pointer-events-none z-50"
        size={16}
      />
    
      <input
        type="text"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        placeholder="Find in Liked Songs"
        className="w-64 bg-zinc-900/50 backdrop-blur-md rounded-md py-2 pr-3 pl-10 text-white text-xs font-semibold placeholder:text-white/60 focus:outline-none"
      />
    </div>

      {/* Rooms list */}
      <div className="text-sm mt-2  bg-black text-slate-200 list-none w-screen p-3 mb-28">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {
              input &&  searchResult.length > 0 ? (
                searchResult.map((data, i) => (
                  <RoomTemplate data={data} key={`key-${i}`} />
                ))
              ):
            !input && myRoom.length > 0 ? (
              myRoom.map((data, i) => (
                <RoomTemplate data={data} key={`key-${i}`} />
              ))
            ) : (
              <div className="text-center mt-5 text-slate-100">
                No rooms created yet!
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Rooms;
