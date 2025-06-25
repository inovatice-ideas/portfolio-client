import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Particles from './Components/Particles';
import SocialMediaButtons from './Components/SocialMediaButtons';
import { EditModeProvider } from './Components/EditMode';
import { useEditMode } from './Components/EditMode';
import background from './assets/Background.png'
import editBackground from './assets/EditWallpaper.jpg'
import "./main.css"
import { useBioData, updateBioData, BioData } from './apicalls/fetchBio';
import { useCvData, addCvData, updateCvData, deleteCvData, Cv } from './apicalls/fetchCv';
import { usePublicationData, Publication } from './apicalls/fetchPublications';
import { lazy, Suspense, useEffect, useState } from 'react';

const Homepage = lazy(() => import('./Pages/Homepage'));
const AboutMe = lazy(() => import('./Pages/AboutMe'));
const Projects = lazy(() => import('./Pages/Projects'));
const Experiences = lazy(() => import('./Pages/Experiences'));
const Publications = lazy(() => import('./Pages/Publications'));
const CV = lazy(() => import('./Pages/CV'));
const Blogs = lazy(() => import('./Pages/Blogs'));
const ContactMe = lazy(() => import('./Pages/ContactMe'));

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const bioData = useBioData();
  const cvData = useCvData();
  const publicationData = usePublicationData();
  const { isEditMode } = useEditMode();
  
  const [bio, setBio] = useState<BioData>({ bio: bioData?.bio || '' });
  const [cvs, setCvs] = useState<Cv[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);

  useEffect(() => {
    if (bioData?.bio) {
      setBio({ bio: bioData.bio });
    }
  }, [bioData?.bio]);

  useEffect(() => {
    if (cvData?.cvs) {
      setCvs(cvData.cvs);
    }
  }, [cvData?.cvs]);

  useEffect(() => {
    if (publicationData?.publications) {
      setPublications(publicationData.publications);
    }
  }, [publicationData?.publications]);

  return (
    <>
      <div className={`fixed inset-0 -z-10 ${isEditMode ? 'background-overall-edit' : 'background-overall'}`} style={{
        backgroundImage: `url(${isEditMode ? editBackground : background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
      {isEditMode ? <Particles /> : <Particles />}  {/* TODO: Add Footsteps */}
      <Navbar />
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen bg-black text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
          <p className="ml-4">Loading...</p>
        </div>
      }>
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {isHomePage ? (
          <Routes>
            <Route path='/' element={<Homepage bioDataName={import.meta.env.VITE_NAME} bioDataDesignation={import.meta.env.VITE_DESIGNATION} />} />
          </Routes>
        ) : (
          <div className="page-content">
            <Routes>
              <Route 
                path='/aboutme' 
                element={<AboutMe bioDataBio={bio.bio} 
                setBio={setBio}
                updateBioData={updateBioData} 
              />} />
              <Route 
                path='/projects' 
                element={<Projects />}
              />
              <Route 
                path='/experiences' 
                element={<Experiences />}
              />
              <Route 
                path='/publications' 
                element={<Publications bioDataPublications={publications} />} 
              />
              <Route 
                path='/resume' 
                element={<CV bioDataCvs={cvs} 
                setCvs={setCvs}
                addCvData={addCvData}
                updateCvData={updateCvData}
                deleteCvData={deleteCvData}
              />} />
              <Route 
                path='/blogs' 
                element={<Blogs />} 
              />
              <Route 
                path='/contactme' 
                element={<ContactMe bioDataGmail={import.meta.env.VITE_GMAIL_LINK} 
                bioDataLinkedin={import.meta.env.VITE_LINKEDIN_LINK} 
              />} />
            </Routes>
          </div>
        )}
        {!isHomePage && (
          <div className="social-media-section mt-auto py-4 px-4 bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <SocialMediaButtons 
                bioDataGithub={import.meta.env.VITE_GITHUB_LINK} 
                bioDataLinkedin={import.meta.env.VITE_LINKEDIN_LINK} 
                bioDataTwitter={import.meta.env.VITE_TWITTER_LINK} 
                bioDataInstagram={import.meta.env.VITE_INSTAGRAM_LINK} 
                bioDataFacebook={import.meta.env.VITE_FACEBOOK_LINK} 
                bioDataGmail={import.meta.env.VITE_GMAIL_LINK} 
                bioDataScholar={import.meta.env.VITE_SCHOLAR_LINK} 
              />
            </div>
          </div>
        )}
      </div>
      </Suspense>
    </>
  );
}

function App() {
  return (
      <Router>
        <EditModeProvider>
          <AppContent />
        </EditModeProvider>
      </Router>
    
  );
}

export default App;