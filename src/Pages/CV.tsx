import { FC, useState } from 'react';
import GlassCard, { MessageChunk } from '../Components/GlassCard';
import './Pages.css';
import DynamicForm, { Field } from '../Components/Form';
import { useEditMode } from '../Components/EditMode';
import { Cv } from '../apicalls/fetchCv';

interface CVProps {
  bioDataCvs: Cv[];
  setCvs: React.Dispatch<React.SetStateAction<Cv[]>>;
  addCvData: (cv: Cv) => Promise<any>;
  updateCvData: (id: string, cv: Cv) => Promise<any>;
  deleteCvData: (id: string) => Promise<any>;
}

export const convertCVToCarousalChunks = (cvs: any): MessageChunk[][] => {
  return cvs.map((cv: any) => [
    { type: 'text', content: `📌 ${cv.name} CV`, size: 'medium' }
  ]);
};

export const convertCVToChunks = (cvs: any): MessageChunk[][] => {
  return cvs.map((cv: any) => [
    { type: 'text', content: `📌 ${cv.name} CV\n\n`, size: 'medium' },
    { type: 'link', content: 'View CV', href: `${import.meta.env.VITE_SERVER_URL}/api/cv/view/${cv.type}`, openInNewTab: true, size: 'small' }
  ]);
};

const defaultCv: Cv = {
  _id: '',
  name: '',
  type: '',
  github_username: '',
  repository_name: ''
};

const cvFields: Field[] = [
  { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter cv name', optional: false },
  { label: 'Type', name: 'type', type: 'text', placeholder: 'Enter cv type', optional: false },
  { label: 'Github Username', name: 'github_username', type: 'text', placeholder: 'Enter github username', optional: false },
  { label: 'Repository Name', name: 'repository_name', type: 'text', placeholder: 'Enter repository name', optional: false }
];

const CV: FC<CVProps> = ({ bioDataCvs, setCvs, addCvData, updateCvData, deleteCvData }) => {
  const { isEditMode } = useEditMode();
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Cv>(defaultCv);
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
    setFormData(defaultCv);
    setIsEdit(false);
    setShowForm(true);
  };

  // Edit
  const handleEdit = () => {
    setFormData(bioDataCvs[selectedIndex!]);
    setIsEdit(true);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIndex === null || !bioDataCvs[selectedIndex]?._id) {
      console.error('Cannot delete: Invalid selectedIndex or missing _id');
      return;
    }
  
    const cvId = bioDataCvs[selectedIndex]._id!;
    console.log('Deleting cv with ID:', cvId);
  
    try {
      const res = await deleteCvData(cvId);
      if (res.status === 204) {
        const updated = bioDataCvs.filter((_, idx) => idx !== selectedIndex);
        setCvs(updated);
        setIsCarouselView(true);
        setSelectedIndex(null);
        console.log('Cv deleted successfully');
      } else {
        console.error('Failed to delete cv. Response:', res);
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
      const res = await updateCvData(bioDataCvs[selectedIndex!]._id!, sanitizedData);
      if (res.status === 204) {
        console.log("Update successful");
        const updated = bioDataCvs.map((cv, idx) => idx === selectedIndex ? formData : cv);
        setCvs(updated);
        setShowForm(false);
        setIsCarouselView(false);
      }
      else {
        console.log("Update failed");
      }
    } else {
      const res = await addCvData(sanitizedData);
      if (res.status === 201) {
        console.log("Add successful");
        const ex = await res.json();
        console.log(ex)
        console.log(ex.cv)
        const updated = [...bioDataCvs, ex.cv];
        setCvs(updated);
        setShowForm(false);
        setIsCarouselView(true);
        setSelectedIndex(null);
      }
      else {
        console.log("Add failed");
      }
    }
  };

  const carousalChunks = convertCVToCarousalChunks(bioDataCvs);
  const detailedChunks = convertCVToChunks(bioDataCvs);

  return (
    <>
      {isCarouselView && !showForm ? (
        <div className='carousal-container-wrapper'>
          <div className='carousal-container'>
            {carousalChunks.length > 0 && carousalChunks.map((chunks, index) => (
              <div key={index} onClick={() => handleCardClick(index)} style={{ cursor: 'pointer' }}>
                <GlassCard isMulti={true} messageChunks={chunks} animationDelay={index * 300} />
              </div>
            ))}
            {carousalChunks.length === 0 && (
              <GlassCard isMulti={true} message={"No CVs available at the moment."} />
            )}
          </div>
          {isEditMode && <div className='form-button-container'>
            <button 
              onClick={handleAdd} 
              className='form-button form-button-add' 
              onMouseEnter={() => setIsHoveringAdd(true)} 
              onMouseLeave={() => setIsHoveringAdd(false)} 
              style={{ fontFamily: 'HarryPotterFont', fontSize: '1.5rem', width: '150px' }}
            >
              {isHoveringAdd ? 'Add CV' : 'Engrave'}
            </button>
          </div>}
        </div>
      ) : 
        !showForm && (
          <GlassCard 
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
          fields={cvFields}
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

export default CV;