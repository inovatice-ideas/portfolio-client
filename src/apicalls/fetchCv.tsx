import { useEffect, useState } from 'react';

export interface Cv {
  _id?: string;
  name: string;
  type: string;
  github_username: string;
  repository_name: string;
}

export interface CvData {
  cvs: Cv[];
}

export const useCvData = () => {
  const [data, setData] = useState<CvData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/cv`)
      .then((res) => {
        return res.json()
      })
      .then((rawCVs: any[]) => {
        const formattedCVs: Cv[] = rawCVs.map((b) => ({
          _id: b._id,
          name: b.name || '',
          type: b.type || '',
          github_username: b.github_username || '',
          repository_name: b.repository_name || ''
        }));
        setData({ cvs: formattedCVs });
      })
      .catch(console.error);
  }, []);

  return data;
};

// ✅ Add a new project
export const addCvData = async (newCV: Cv) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cv`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCV)
    });
    return response;
  } catch (err) {
    console.error('Error adding cv:', err);
  }
};

// ✅ Update an existing project by ID
export const updateCvData = async (id: string, updatedCV: Cv) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cv/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCV)
    });
    return response;
  } catch (err) {
    console.error('Error updating cv:', err);
  }
};

// ✅ Delete a project by ID
export const deleteCvData = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/cv/${id}`, {
      method: 'DELETE'
    });
    return response; // expects { success: true, ... }
  } catch (err) {
    console.error('Error deleting cv:', err);
    return { success: false, message: 'Exception during delete' };
  }
};