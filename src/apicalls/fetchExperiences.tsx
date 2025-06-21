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

export const useExperienceData = () => {
  const [data, setData] = useState<ExperienceData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences`)
      .then((res) => {
        return res.json()
      })
      .then((rawExperiences: any[]) => {
        const formattedExperiences: Experience[] = rawExperiences.map((e) => ({
          _id: e._id,
          company: e.company || '',
          designation: e.designation || '',
          timeline: e.timeline || '',
          description: e.description || '',
          techStack: e.techStack || ''
        }));
        setData({ experiences: formattedExperiences });
      })
      .catch(console.error);
  }, []);

  return data;
};

// ✅ Add a new project
export const addExperienceData = async (newExperience: Experience) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExperience)
    });
    return response;
  } catch (err) {
    console.error('Error adding experience:', err);
  }
};

// ✅ Update an existing project by ID
export const updateExperienceData = async (id: string, updatedExperience: Experience) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedExperience)
    });
    return response;
  } catch (err) {
    console.error('Error updating experience:', err);
  }
};

// ✅ Delete a project by ID
export const deleteExperienceData = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/experiences/${id}`, {
      method: 'DELETE'
    });
    return response; // expects { success: true, ... }
  } catch (err) {
    console.error('Error deleting experience:', err);
    return { success: false, message: 'Exception during delete' };
  }
};