import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import dp from "../assets/dp.png"
import wand from "../assets/wand.png"
import "./Pages.css"

function Homepage({bioDataName, bioDataDesignation}: {bioDataName: string, bioDataDesignation: string[]}) {
  const name = bioDataName;
  const designations = bioDataDesignation;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [text, setText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHoveringRevelio, setIsHoveringRevelio] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
    if (isDeleting) {
      if (text === '') {
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % designations.length);
      } else {
        timeout = setTimeout(() => {
          setText(text.slice(0, -1));
        }, 50);
      }
    } else {
      if (text === designations[currentIndex]) {
        setIsPaused(true);
      } else {
        timeout = setTimeout(() => {
          setText(designations[currentIndex].slice(0, text.length + 1));
        }, 100);
      }
    }
    return () => clearTimeout(timeout);
  }, [text, currentIndex, isDeleting, isPaused, designations]);

  const handleRevelioClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate('/aboutme');
    }, 1000);
  };

  return (
    <div className='flex flex-col lg:flex-row h-screen relative'>
      <div className='w-full lg:w-1/2 flex items-center justify-center min-h-[30vh] lg:min-h-screen'>
        <div className='dp'>
          <img src={dp} alt='img'/>
        </div>
      </div>
      <div className='w-full lg:w-1/2 flex flex-col justify-center items-start px-2 lg:px-16 min-h-[70vh] lg:min-h-screen'>
        <div className='glass-container'>
          <h1 className='text-3xl lg:text-6xl font-bold mb-2 lg:mb-4 greeting-text text-black text-left'>
            Hello, I'm <span className='text-emerald-500'>{name.split(' ')[0]}</span>
            <span className='wave-emoji'>👋</span>
          </h1>
          <h2 className='text-xl lg:text-3xl min-h-[32px] lg:min-h-[40px] designation-text text-gray-700 text-left'>{text}<span className='animate-blink'>|</span></h2>
          <p className='text-sm text-black information-text text-left mt-4'>To discover more about me, cast "Revelio" below</p>
        </div>
      </div>
      <button className={`revelio-btn ${isAnimating ? 'reveal-animating' : ''}`} onClick={handleRevelioClick} onMouseEnter={() => setIsHoveringRevelio(true)} onMouseLeave={() => setIsHoveringRevelio(false)} style={{ fontFamily: 'HarryPotterFont', fontSize: '2.1rem' }}> {isAnimating ? (
        <div className="wand-container">
          <img src={wand} alt="wand" className="wand-icon" />
          <div className="spark-container"> {[...Array(8)].map((_, i) => ( <span key={i} className={`spark spark-${i}`} /> ))}</div>
        </div>
      ) : (isHoveringRevelio ? 'Know More' : 'Revelio')} 
      </button>
    </div>
  )
}

export default Homepage;
