import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import AboutMe from './Pages/AboutMe';
import Projects from './Pages/Projects';
import Experiences from './Pages/Experiences';
import Publications from './Pages/Publications';
import CV from './Pages/CV';
import Blogs from './Pages/Blogs';
import ContactMe from './Pages/ContactMe';
import Navbar from './Components/Navbar';
import Particles from './Components/Particles';
import SocialMediaButtons from './Components/SocialMediaButtons';
import { EditModeProvider } from './Components/EditMode';
import background from './assets/Background.png'
import "./main.css"
import { useBioDetailsData } from './apicalls/fetchBioDetails';
import { useBioData, updateBioData, BioData } from './apicalls/fetchBio';
import { useProjectData, addProjectData, updateProjectData, deleteProjectData, Project } from './apicalls/fetchProjects';
import { useExperienceData, addExperienceData, updateExperienceData, deleteExperienceData, Experience } from './apicalls/fetchExperiences';
import { useBlogData, addBlogData, updateBlogData, deleteBlogData, Blog } from './apicalls/fetchBlogs';
import { useCvData, addCvData, updateCvData, deleteCvData, Cv } from './apicalls/fetchCv';
import { useEffect, useState } from 'react';

function AppContent() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const bioDetailsData = useBioDetailsData();
  const bioData = useBioData();
  const projectData = useProjectData();
  const experienceData = useExperienceData();
  const blogData = useBlogData();
  const cvData = useCvData();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [bio, setBio] = useState<BioData>({ bio: bioData?.bio || '' });
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [cvs, setCvs] = useState<Cv[]>([]);

  useEffect(() => {
    if (bioData?.bio) {
      setBio({ bio: bioData.bio });
    }
  }, [bioData?.bio]);

  useEffect(() => {
    if (projectData?.projects) {
      setProjects(projectData.projects);
    }
  }, [projectData?.projects]);

  useEffect(() => {
    if (experienceData?.experiences) {
      setExperiences(experienceData.experiences);
    }
  }, [experienceData?.experiences]);

  useEffect(() => {
    if (blogData?.blogs) {
      setBlogs(blogData.blogs);
    }
  }, [blogData?.blogs]);

  useEffect(() => {
    if (cvData?.cvs) {
      setCvs(cvData.cvs);
    }
  }, [cvData?.cvs]);

  // useEffect(() => {
  //   // const pub = usePublicationData(bioDetailsData?.orcid || '');
  //   // setPublications(pub?.publications || []);
  //   setPublications(publicationData?.publications || []);
  // }, [bioDetailsData?.orcid]);

  return (
    <>
      <div className='fixed inset-0 -z-10 background-overall' style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }} />
      <Particles />
      <Navbar />
      <div className="min-h-[calc(100vh-4rem)] flex flex-col">
        {isHomePage ? (
          <Routes>
            <Route path='/' element={<Homepage bioDataName={bioDetailsData?.name || ''} bioDataDesignation={bioDetailsData?.designations || []} />} />
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
                element={<Projects bioDataProjects={projects} 
                setProjects={setProjects}
                addProjectData={addProjectData} 
                updateProjectData={updateProjectData} 
                deleteProjectData={deleteProjectData}  
              />} />
              <Route 
                path='/experiences' 
                element={<Experiences bioDataExperiences={experiences}
                setExperiences={setExperiences}
                addExperienceData={addExperienceData}
                updateExperienceData={updateExperienceData}
                deleteExperienceData={deleteExperienceData}
              />} />
              <Route 
                path='/publications' 
                element={<Publications bioDataPublications={bioDetailsData?.orcid || ''} 
              />} />
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
                element={<Blogs bioDataBlogs={blogs} 
                setBlogs={setBlogs}
                addBlogData={addBlogData}
                updateBlogData={updateBlogData}
                deleteBlogData={deleteBlogData}
              />} />
              <Route 
                path='/contactme' 
                element={<ContactMe bioDataGmail={bioDetailsData?.socialMedia.gmail || ''} 
                bioDataLinkedin={bioDetailsData?.socialMedia.linkedin || ''} 
              />} />
            </Routes>
          </div>
        )}
        {!isHomePage && (
          <div className="social-media-section mt-auto py-4 px-4 bg-opacity-50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <SocialMediaButtons 
                bioDataGithub={bioDetailsData?.socialMedia.github || ''} 
                bioDataLinkedin={bioDetailsData?.socialMedia.linkedin || ''} 
                bioDataTwitter={bioDetailsData?.socialMedia.twitter || ''} 
                bioDataInstagram={bioDetailsData?.socialMedia.instagram || ''} 
                bioDataFacebook={bioDetailsData?.socialMedia.facebook || ''} 
                bioDataGmail={bioDetailsData?.socialMedia.gmail || ''} 
                bioDataScholar={bioDetailsData?.socialMedia.scholar || ''} 
              />
            </div>
          </div>
        )}
      </div>
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