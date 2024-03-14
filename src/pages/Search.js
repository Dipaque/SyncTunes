import React, {  useState } from 'react'
import Sidebar from '../Components/Sidebar'
import Icon from '@mdi/react'
import { mdiMagnify } from '@mdi/js'
import axios from 'axios'
import SongCard from '../Components/SongCard'
import '../App.css'
import Shimmer from '../Components/Shimmer'
import { GoChevronRight, GoChevronUp } from 'react-icons/go'
const Search = () => {
  const [input,setInput]=useState('')
  const [isLoading,setIsLoading]=useState(false)
  const [data,setData]=useState([])
  const [image,setImage]=useState('')
  const [title,setTitle]=useState('')
    const handleSearch=async(e)=>{
      e.preventDefault();
      setIsLoading(true)
        const options = {
            method: 'GET',
            url: "https://youtube-search-and-download.p.rapidapi.com/search",
            params: {
              query: input+" songs",
              
              hl: 'en',
              gl: 'IN',
              
            },
            headers: {
              'X-RapidAPI-Key': process.env.REACT_APP_YOUTUBE_KEY,
              'X-RapidAPI-Host': 'youtube-search-and-download.p.rapidapi.com'
            }
          };

try {
	const response = await axios.request(options);
	setData(response.data.contents)
    setImage(response.data.contents[0].video.thumbnails[0].url)
    setTitle(response.data.contents[0].video.title)
    setIsLoading(false)
} catch (error) {
	console.error(error);
}

    }
    const shimmerArr=[1,2,3,4,5]
    console.log(data)
  return (
    <React.Fragment>
      {/* <Homepage /> */}
     <div className="flex gap-0 h-screen overflow-hidden    bg-black ">
    <div className=''>
    <div className='text-white ml-5 text-xl flex justify-start  items-end   '>
      <b>Search</b>
      </div>
      <form onSubmit={(e)=>e.preventDefault()} className='flex gap-2'>
      <input 
      type='text'
      value={input}
      onChange={(e)=>setInput(e.target.value)}
      className='border pl-2 pr-2 ml-5 mt-8 w-60 bg-slate-50 rounded-lg text-sm p-2 outline-none text-black'
      placeholder='Find your track...'
      />
        <button type='submit'
        className='bg-slate-50 p-2 rounded-lg text-gray-500 mt-8'
        onClick={(e)=>handleSearch(e)} >
          <Icon path={mdiMagnify} size={1} />
        </button>
      </form>
      <div className=' mt-10 mx-auto mb-10 '>
     {
data.length>0&& <button className=' bg-white bg-opacity-10 w-8 p-2  rounded-full backdrop-filter backdrop-blur fixed right-7 bottom-40'  >
<GoChevronRight className='mx-auto' color='white' size={15} />
</button>
     } 
        <div className='flex flex-row overflow-hidden overflow-x-scroll ' style={{width:window.innerWidth}} >
        {
            !isLoading && data.length>0 ?(data.map((obj,index)=>(
                'video' in obj ?(
<SongCard key={index} image={obj.video.thumbnails[0].url} title={obj.video.title} id={obj.video.videoId} playList={data} />
                ):(
                 <>
                 </>
                )  
            ))):(isLoading ? (shimmerArr.map((data,index)=>(<Shimmer />))):(<div className='mx-auto my-auto'>
            <img src={require('../assests/loading.png')}  />
            
            </div>) )
        }
        </div>
      
       
      </div>
      
    </div>
    </div>
    </React.Fragment>
  )
}

export default Search