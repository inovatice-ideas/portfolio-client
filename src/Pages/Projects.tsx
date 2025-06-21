import { FC, useState } from 'react';
import GlassCard, { MessageChunk } from '../Components/GlassCard';
import DynamicForm, { Field } from '../Components/Form';
import { useEditMode } from '../Components/EditMode';
import './Pages.css';
import { Project } from '../apicalls/fetchProjects';

interface ProjectsProps {
  bioDataProjects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  addProjectData: (project: Project) => Promise<any>;
  updateProjectData: (id: string, project: Project) => Promise<any>;
  deleteProjectData: (id: string) => Promise<any>;
}

function parseTimelineEndDate(timeline: string): Date {
  const [_, end] = timeline.split(' - ');
  if (!end || end.trim().toLowerCase() === 'present') return new Date();

  const [monthStr, yearStr] = end.trim().split(' ');
  const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth(); // index 0–11
  const year = parseInt(yearStr, 10);

  return new Date(year, month);
}

function sortProjectsByTimeline(projects: Project[]): Project[] {
  return [...projects].sort((a, b) =>
    parseTimelineEndDate(b.timeline).getTime() - parseTimelineEndDate(a.timeline).getTime()
  );
}

export const convertProjectsToChunks = (bioDataProjects: Project[]): MessageChunk[][] => {
  return bioDataProjects.map((project: Project) => {
    const chunks: MessageChunk[] = [
      { type: 'text', content: '📌 ', size: 'medium' },
      { type: 'text', content: `${project.title}\n\n`, size: 'large' },

      { type: 'text', content: '🛠 Type: ', size: 'medium' },
      { type: 'text', content: `${project.type}\n`, size: 'small' },

      { type: 'text', content: '⏳ Timeline: ', size: 'medium' },
      { type: 'text', content: `${project.timeline}\n`, size: 'small' },

      { type: 'text', content: '📝 Description:\n', size: 'medium' },
      { type: 'text', content: `${project.description}\n`, size: 'small' },

      { type: 'text', content: '🧰 Tech Stack: ', size: 'medium' },
      { type: 'text', content: `${project.techStack}\n`, size: 'small' }
    ];

    if (project.link) {
      chunks.push(
        { type: 'text', content: '🔗 ', size: 'medium' },
        { type: 'link', content: 'View Project', href: project.link }
      );
    }

    return chunks;
  });
};

export const convertProjectsToCarousalChunks = (bioDataProjects: Project[]): MessageChunk[][] => {
  return bioDataProjects.map((project: Project) => [
    { type: 'text', content: '📌 ', size: 'medium' },
    { type: 'text', content: `${project.title}\n\n`, size: 'large' },

    { type: 'text', content: '🛠 Type: ', size: 'medium' },
    { type: 'text', content: `${project.type}\n`, size: 'small' },

    { type: 'text', content: '⏳ Timeline: ', size: 'medium' },
    { type: 'text', content: `${project.timeline}\n`, size: 'small' }
  ]);
};

const defaultProject: Project = {
  _id: '',
  title: '',
  type: '',
  techStack: '',
  timeline: '',
  description: '',
  link: ''
};

const projectFields: Field[] = [
  { label: 'Title', name: 'title', type: 'text', placeholder: 'Enter the title of the project', optional: false },
  { label: 'Type', name: 'type', type: 'text', placeholder: 'Enter the type of the project', optional: false },
  { label: 'Timeline', name: 'timeline', type: 'text', placeholder: 'Enter the timeline of the project', optional: false },
  { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Enter the description of the project', optional: false },
  { label: 'Tech Stack', name: 'techStack', type: 'text', placeholder: 'Enter the tech stack of the project', optional: false },
  { label: 'Link', name: 'link', type: 'url', placeholder: 'Enter the link of the project', optional: true }
];

const Projects: FC<ProjectsProps> = ({ bioDataProjects, setProjects, addProjectData, updateProjectData, deleteProjectData }) => {
  const { isEditMode } = useEditMode();
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const [formData, setFormData] = useState<Project>(defaultProject);
  const [isEdit, setIsEdit] = useState(false);

  const sortedProjects = sortProjectsByTimeline(bioDataProjects);
  const carousalChunks = convertProjectsToCarousalChunks(sortedProjects);
  const detailedChunks = convertProjectsToChunks(sortedProjects);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setIsCarouselView(false);
  };

  const handleBack = () => {
    setSelectedIndex(null);
    setIsCarouselView(true);
  };

  const handleAdd = () => {
    setFormData(defaultProject);
    setIsEdit(false);
    setShowForm(true);
  };

  // Edit
  const handleEdit = () => {
    setFormData(sortedProjects[selectedIndex!]);
    setIsEdit(true);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIndex === null || !sortedProjects[selectedIndex]?._id) {
      console.error('Cannot delete: Invalid selectedIndex or missing _id');
      return;
    }
  
    const projectId = sortedProjects[selectedIndex]._id!;
    console.log('Deleting project with ID:', projectId);
  
    try {
      const res = await deleteProjectData(projectId);
      if (res.status === 204) {
        const updated = sortedProjects.filter((_, idx) => idx !== selectedIndex);
        setProjects(updated);
        setIsCarouselView(true);
        setSelectedIndex(null);
        console.log('Project deleted successfully');
      } else {
        console.error('Failed to delete project. Response:', res);
      }
    } catch (err) {
      console.error('Error during deletion:', err);
    }
  };
  

  // Form submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Destructure _id out of formData to omit it
    const { _id, ...sanitizedData } = formData;
  
    if (isEdit) {
      const res = await updateProjectData(sortedProjects[selectedIndex!]._id!, sanitizedData);
      if (res.status === 204) {
        console.log("Update successful");
        const updated = sortedProjects.map((project, idx) => idx === selectedIndex ? formData : project);
        setProjects(updated);
        setShowForm(false);
        setIsCarouselView(false);
      }
      else {
        console.log("Update failed");
      }
    } else {
      const res = await addProjectData(sanitizedData);
      if (res.status === 201) {
        console.log("Add successful");
        const pr = await res.json();
        console.log(pr)
        console.log(pr.project)
        const updated = [...sortedProjects, pr.project];
        setProjects(updated);
        setShowForm(false);
        setIsCarouselView(true);
        setSelectedIndex(null);
      }
      else {
        console.log("Add failed");
      }
    }
  };

  return (
    <>
      {isCarouselView && !showForm ? (
        <div className='carousal-container-wrapper'>
          <div className='carousal-container'>
            {carousalChunks.map((chunks, index) => (
              <div key={index} onClick={() => handleCardClick(index)} style={{ cursor: 'pointer' }}>
                <GlassCard isMulti={true} messageChunks={chunks} animationDelay={index * 300} />
              </div>
            ))}
            {carousalChunks.length === 0 && (
              <GlassCard isMulti={true} message={"No projects available at the moment."} />
            )}
          </div>
          {isEditMode && <div className='form-button-container'>
            <button 
              onClick={handleAdd} 
              className='form-button form-button-add' 
              onMouseEnter={() => setIsHoveringAdd(true)} 
              onMouseLeave={() => setIsHoveringAdd(false)} 
              style={{ fontFamily: 'HarryPotterFont', fontSize: '1.5rem', width: '200px' }}
            >
              {isHoveringAdd ? 'Add Project' : 'Engrave'}
            </button>
          </div>}
        </div>
      ) : 
          !showForm && (<GlassCard
            isMulti={false}
            messageChunks={detailedChunks[selectedIndex!]}
            showBackButton={true}
            onBack={handleBack}
            onEdit={isEditMode ? handleEdit : undefined}
            onDelete={isEditMode ? handleDelete : undefined}
          />
      )}

      {isEditMode && showForm && (
        <DynamicForm
        fields={projectFields}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleFormSubmit}
        onCancel={() => setShowForm(false)}
        submitName={isEdit ? 'Transfigure' : 'Engrave'}
      />
      )}
    </>
  );
};

export default Projects;