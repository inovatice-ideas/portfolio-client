import { FC, useState } from 'react';
import GlassCard, { MessageChunk } from '../Components/GlassCard';
import './Pages.css';
import DynamicForm, { Field } from '../Components/Form';
import { useEditMode } from '../Components/EditMode';
import { Experience } from '../apicalls/fetchExperiences';

interface ExperiencesProps {
  bioDataExperiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  addExperienceData: (experience: Experience) => Promise<any>;
  updateExperienceData: (id: string, experience: Experience) => Promise<any>;
  deleteExperienceData: (id: string) => Promise<any>;
}

function parseTimelineEndDate(timeline: string): Date {
  const [_, end] = timeline.split(' - ');
  if (!end || end.trim().toLowerCase() === 'present') return new Date();

  const [monthStr, yearStr] = end.trim().split(' ');
  const month = new Date(`${monthStr} 1, ${yearStr}`).getMonth(); // index 0–11
  const year = parseInt(yearStr, 10);

  return new Date(year, month);
}

function sortExperiencesByTimeline(experiences: Experience[]): Experience[] {
  return [...experiences].sort((a, b) =>
    parseTimelineEndDate(b.timeline).getTime() - parseTimelineEndDate(a.timeline).getTime()
  );
}

export const convertExperiencesToChunks = (bioDataExperiences: any): MessageChunk[][] => {
  return bioDataExperiences.map((experience: any) => [
    { type: 'text', content: '🏢 ', size: 'medium' },
    { type: 'text', content: `${experience.company}\n\n`, size: 'large' },

    { type: 'text', content: '💼 Role: ', size: 'medium' },
    { type: 'text', content: `${experience.designation}\n`, size: 'small' },

    { type: 'text', content: '📅 Duration: ', size: 'medium' },
    { type: 'text', content: `${experience.timeline}\n`, size: 'small' },

    { type: 'text', content: '📝 What I did:\n', size: 'medium' },
    { type: 'text', content: `${experience.description}\n`, size: 'small' },

    { type: 'text', content: '🧪 Tech Stack: ', size: 'medium' },
    { type: 'text', content: `${experience.techStack}\n`, size: 'small' },
  ]);
};

export const convertExperiencesToCarousalChunks = (bioDataExperiences: any): MessageChunk[][] => {
  return bioDataExperiences.map((experience: any) => [
    { type: 'text', content: '🏢 ', size: 'medium' },
    { type: 'text', content: `${experience.company}\n\n`, size: 'large' },

    { type: 'text', content: '💼 Role: ', size: 'medium' },
    { type: 'text', content: `${experience.designation}\n`, size: 'small' },

    { type: 'text', content: '📅 Duration: ', size: 'medium' },
    { type: 'text', content: `${experience.timeline}\n`, size: 'small' }
  ]);
};

const defaultExperience: Experience = {
  _id: '',
  company: '',
  designation: '',
  timeline: '',
  description: '',
  techStack: ''
};

const experienceFields: Field[] = [
  { label: 'Company', name: 'company', type: 'text', placeholder: 'Enter the company name', optional: false },
  { label: 'Designation', name: 'designation', type: 'text', placeholder: 'Enter the designation', optional: false },
  { label: 'Timeline', name: 'timeline', type: 'text', placeholder: 'Enter the timeline', optional: false },
  { label: 'Description', name: 'description', type: 'textarea', placeholder: 'Enter the description', optional: false },
  { label: 'Tech Stack', name: 'techStack', type: 'text', placeholder: 'Enter the tech stack', optional: false }
];

const Experiences: FC<ExperiencesProps> = ({ bioDataExperiences, setExperiences, addExperienceData, updateExperienceData, deleteExperienceData }) => {
  const { isEditMode } = useEditMode();
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Experience>(defaultExperience);
  const [isEdit, setIsEdit] = useState(false);
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setIsCarouselView(false);
  };

  const handleBack = () => {
    setSelectedIndex(null);
    setIsCarouselView(true);
  };

  const handleAdd = () => {
    setFormData(defaultExperience);
    setIsEdit(false);
    setShowForm(true);
  };

  // Edit
  const handleEdit = () => {
    setFormData(sortedExperiences[selectedIndex!]);
    setIsEdit(true);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIndex === null || !sortedExperiences[selectedIndex]?._id) {
      console.error('Cannot delete: Invalid selectedIndex or missing _id');
      return;
    }
  
    const experienceId = sortedExperiences[selectedIndex]._id!;
    console.log('Deleting experience with ID:', experienceId);
  
    try {
      const res = await deleteExperienceData(experienceId);
      if (res.status === 204) {
        const updated = sortedExperiences.filter((_, idx) => idx !== selectedIndex);
        setExperiences(updated);
        setIsCarouselView(true);
        setSelectedIndex(null);
        console.log('Experience deleted successfully');
      } else {
        console.error('Failed to delete experience. Response:', res);
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
      const res = await updateExperienceData(sortedExperiences[selectedIndex!]._id!, sanitizedData);
      if (res.status === 204) {
        console.log("Update successful");
        const updated = sortedExperiences.map((experience, idx) => idx === selectedIndex ? formData : experience);
        setExperiences(updated);
        setShowForm(false);
        setIsCarouselView(false);
      }
      else {
        console.log("Update failed");
      }
    } else {
      const res = await addExperienceData(sanitizedData);
      if (res.status === 201) {
        console.log("Add successful");
        const ex = await res.json();
        console.log(ex)
        console.log(ex.experience)
        const updated = [...sortedExperiences, ex.experience];
        setExperiences(updated);
        setShowForm(false);
        setIsCarouselView(true);
        setSelectedIndex(null);
      }
      else {
        console.log("Add failed");
      }
    }
  };

  const sortedExperiences = sortExperiencesByTimeline(bioDataExperiences);
  const carousalChunks = convertExperiencesToCarousalChunks(sortedExperiences);
  const detailedChunks = convertExperiencesToChunks(sortedExperiences);

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
              <GlassCard isMulti={true} message={"No experience available at the moment."} />
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
              {isHoveringAdd ? 'Add Experience' : 'Engrave'}
            </button>
          </div>}
        </div>
      ) : 
        !showForm && (<GlassCard isMulti={false} messageChunks={detailedChunks[selectedIndex!]} showBackButton={true} onBack={handleBack} onEdit={isEditMode ? handleEdit : undefined} onDelete={isEditMode ? handleDelete : undefined} />
      )}
      {isEditMode && showForm && (
      <DynamicForm
        fields={experienceFields}
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

export default Experiences;
