import { useEffect, useState } from 'react';

export interface Project {
  _id?: string;
  title: string;
  type: string;
  timeline: string;
  description: string;
  techStack?: string;
  link?: string;
}

export interface ProjectData {
  projects: Project[];
}

export const useProjectData = () => {
  const [data, setData] = useState<ProjectData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects`)
      .then((res) => {
        return res.json()
      })
      .then((rawProjects: any[]) => {
        const formattedProjects: Project[] = rawProjects.map((p) => ({
          _id: p._id,
          title: p.title || '',
          type: p.type || '',
          timeline: p.timeline || '',
          description: p.description || '',
          techStack: p.techStack || '',
          link: p.link || ''
        }));
        setData({ projects: formattedProjects });
      })
      .catch(console.error);
  }, []);

  return data;
};


// ✅ Add a new project
export const addProjectData = async (newProject: Project) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    });
    return response;
  } catch (err) {
    console.error('Error adding project:', err);
  }
};

// ✅ Update an existing project by ID
export const updateProjectData = async (id: string, updatedProject: Project) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject)
    });
    return response;
  } catch (err) {
    console.error('Error updating project:', err);
  }
};

// ✅ Delete a project by ID
export const deleteProjectData = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects/${id}`, {
      method: 'DELETE'
    });
    return response; // expects { success: true, ... }
  } catch (err) {
    console.error('Error deleting project:', err);
    return { success: false, message: 'Exception during delete' };
  }
};
