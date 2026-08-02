import { useNavigate } from 'react-router-dom';
import NotFoundGraphic from '../../src/assests/notFound';

const GenericNotFound = ({ type = "Page", content }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-center text-white px-4 pb-28">
      
      {/* SVG Graphic used here */}
      <div className="w-48 h-48 mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
        <NotFoundGraphic />
      </div>
      
      <h2 className="text-2xl font-extrabold mb-2 text-center">{type} Not Found</h2>
      
      <p className="text-gray-400 text-sm text-center mb-8 max-w-xs">
        {content ? content : `Looks like this record got lost in the mix. The ${type.toLowerCase()} you are looking for doesn't exist or was removed.`}
      </p>
      
      <button 
        onClick={() => navigate(-1)} 
        className="px-6 py-2 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform"
      >
        Go Back
      </button>
    </div>
  );
};

export default GenericNotFound;