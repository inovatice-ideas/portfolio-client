import { FC, useState } from 'react';
import GlassCard from '../Components/GlassCard';
import DynamicForm, { Field } from '../Components/Form';
import { useEditMode } from '../Components/EditMode';
import { BioData } from '../apicalls/fetchBio';


interface AboutMeProps {
  bioDataBio: string;
  updateBioData: (updatedBioData: BioData) => void;
  setBio: React.Dispatch<React.SetStateAction<BioData>>;
}

const bioFields: Field[] = [
  {
    label: 'Bio',
    name: 'bio',
    type: 'textarea',
    placeholder: 'Write a brief introduction about yourself',
    optional: false
  }
];

const AboutMe: FC<AboutMeProps> = ({ bioDataBio, setBio, updateBioData }) => {
  const { isEditMode } = useEditMode();
  const [formData, setFormData] = useState<Record<string, any>>({ bio: bioDataBio });
  const [showForm, setShowForm] = useState(false);

  const handleEdit = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBio({ bio: formData.bio });
    setShowForm(false);
    updateBioData({ bio: formData.bio });
  };

  return (
    <>
      {!showForm ? (
        <GlassCard
          message={bioDataBio}
          isMulti={false}
          onEdit={isEditMode ? handleEdit : undefined}
        />
      ) : isEditMode && (
        <DynamicForm
          fields={bioFields}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          submitName="Transfigure"
        />
      )}
    </>
  );
};

export default AboutMe;