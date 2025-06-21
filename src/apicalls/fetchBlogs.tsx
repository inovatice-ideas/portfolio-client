import { useEffect, useState } from 'react';

export interface Blog {
  _id?: string;
  title: string;
  date: string;
  blog: string;
}

export interface BlogData {
  blogs: Blog[];
}

export const useBlogData = () => {
  const [data, setData] = useState<BlogData | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs`)
      .then((res) => {
        return res.json()
      })
      .then((rawBlogs: any[]) => {
        const formattedBlogs: Blog[] = rawBlogs.map((b) => ({
          _id: b._id,
          title: b.title || '',
          date: b.date || '',
          blog: b.blog || ''
        }));
        setData({ blogs: formattedBlogs });
      })
      .catch(console.error);
  }, []);

  return data;
};

// ✅ Add a new project
export const addBlogData = async (newBlog: Blog) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlog)
    });
    return response;
  } catch (err) {
    console.error('Error adding blog:', err);
  }
};

// ✅ Update an existing project by ID
export const updateBlogData = async (id: string, updatedBlog: Blog) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBlog)
    });
    return response;
  } catch (err) {
    console.error('Error updating blog:', err);
  }
};

// ✅ Delete a project by ID
export const deleteBlogData = async (id: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
      method: 'DELETE'
    });
    return response; // expects { success: true, ... }
  } catch (err) {
    console.error('Error deleting blog:', err);
    return { success: false, message: 'Exception during delete' };
  }
};