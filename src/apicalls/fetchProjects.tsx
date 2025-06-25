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

let projectCache: ProjectData | null = null;

export const useProjectData = () => {
  const [data, setData] = useState<ProjectData | null>(null);
  useEffect(() => {
    if (projectCache) {
      setData(projectCache);
      return;
    }
    const fetchProjects = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const rawProjects = await res.json();
        const formattedProjects: Project[] = rawProjects.map((p: any) => ({
          _id: p._id,
          title: p.title || '',
          type: p.type || '',
          timeline: p.timeline || '',
          description: p.description || '',
          techStack: p.techStack || '',
          link: p.link || ''
        }));
        projectCache = { projects: formattedProjects };
        setData({ projects: formattedProjects });
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    }
    fetchProjects();
  }, []);
  return data;
};


// ✅ Add a new project
export const addProjectData = async (newProject: Project): Promise<{ status: number, success: boolean, message: string, project: Project }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProject)
    });
    if (response.status === 201) {
      const project = await response.json();
      const newProjectData = project.project;
      if (projectCache) {
        projectCache.projects = [...projectCache.projects, newProjectData];
      }
      return { status: response.status, success: true, message: 'Project added successfully', project: newProjectData }; // expects { success: true, ... }
    } else {
      return { status: response.status, success: false, message: 'Failed to add project', project: {_id: '', title: '', type: '', timeline: '', description: '', techStack: '', link: ''} };
    }
  } catch (err) {
    console.error('Error adding project:', err);
    return { status: 500, success: false, message: 'Exception during add', project: {_id: '', title: '', type: '', timeline: '', description: '', techStack: '', link: ''} };
  }
};

// ✅ Update an existing project by ID
export const updateProjectData = async (id: string, updatedProject: Project): Promise<{ status: number, success: boolean, message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedProject)
    });
    if (response.status === 204) {
      if (projectCache) {
        projectCache.projects = projectCache.projects.map((project) => project._id === id ? {...updatedProject, _id: id} : project);
      }
      return { status: response.status, success: true, message: 'Project updated successfully' }; // expects { success: true, ... }
    } else {
      return { status: response.status, success: false, message: 'Failed to update project' };
    }
  } catch (err) {
    console.error('Error updating project:', err);
    return { status: 500, success: false, message: 'Exception during update' };
  }
};

// ✅ Delete a project by ID
export const deleteProjectData = async (id: string): Promise<{ status: number, success: boolean, message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/projects/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      if (projectCache) {
        projectCache.projects = projectCache.projects.filter((project) => project._id !== id);
      }
      return { status: response.status, success: true, message: 'Project deleted successfully' }; // expects { success: true, ... }
    } else {
      return { status: response.status, success: false, message: 'Failed to delete project' };
    }
  } catch (err) {
    console.error('Error deleting project:', err);
    return { status: 500, success: false, message: 'Exception during delete' };
  }
};
