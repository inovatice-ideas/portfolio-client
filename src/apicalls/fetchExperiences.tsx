import { useEffect, useState } from 'react';

export interface Experience {
  _id?: string;
  company: string;
  designation: string;
  timeline: string;
  description: string;
  techStack?: string;
}

export interface ExperienceData {
  experiences: Experience[];
}

let experienceCache: ExperienceData | null = null;

export const useExperienceData = () => {
  const [data, setData] = useState<ExperienceData | null>(null);

  useEffect(() => {
    if (experienceCache) {
      setData(experienceCache);
      return;
    }
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const rawExperiences = await res.json();
        const formattedExperiences: Experience[] = rawExperiences.map((e: any) => ({
          _id: e._id,
          company: e.company || '',
          designation: e.designation || '',
          timeline: e.timeline || '',
          description: e.description || '',
          techStack: e.techStack || ''
        }));
        experienceCache = { experiences: formattedExperiences };
        setData({ experiences: formattedExperiences });
      } catch (err) {
        console.error('Error fetching experiences:', err);
      }
    }
    fetchExperiences();
  }, []);

  return data;
};

// ✅ Add a new project
export const addExperienceData = async (newExperience: Experience): Promise<{ status: number, success: boolean, message: string, experience: Experience }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExperience)
    });
    if (response.status === 201) {
      const experience = await response.json();
      const newExperienceData = experience.experience;
      if (experienceCache) {
        experienceCache.experiences = [...experienceCache.experiences, newExperienceData];
      }
      return { status: response.status, success: true, message: 'Experience added successfully', experience: newExperienceData };
    } else {
      return { status: response.status, success: false, message: 'Failed to add experience', experience: {_id: '', company: '', designation: '', timeline: '', description: '', techStack: ''}};
    }
  } catch (err) {
    console.error('Error adding experience:', err);
    return { status: 500, success: false, message: 'Exception during add', experience: {_id: '', company: '', designation: '', timeline: '', description: '', techStack: ''}};
  }
};

// ✅ Update an existing project by ID
export const updateExperienceData = async (id: string, updatedExperience: Experience): Promise<{ status: number, success: boolean, message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedExperience)
    });
    if (response.status === 204) {
      if (experienceCache) {
        experienceCache.experiences = experienceCache.experiences.map((experience) => experience._id === id ? {...updatedExperience, _id: id} : experience);
      }
      return { status: response.status, success: true, message: 'Experience updated successfully' };
    } else {
      return { status: response.status, success: false, message: 'Failed to update experience' };
    }
  } catch (err) {
    console.error('Error updating experience:', err);
    return { status: 500, success: false, message: 'Exception during update' };
  }
};

// ✅ Delete a project by ID
export const deleteExperienceData = async (id: string): Promise<{ status: number, success: boolean, message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      if (experienceCache) {
        experienceCache.experiences = experienceCache.experiences.filter((experience) => experience._id !== id);
      }
      return { status: response.status, success: true, message: 'Experience deleted successfully' };
    } else {
      return { status: response.status, success: false, message: 'Failed to delete experience' };
    }
  } catch (err) {
    console.error('Error deleting experience:', err);
    return { status: 500, success: false, message: 'Exception during delete' };
  }
};