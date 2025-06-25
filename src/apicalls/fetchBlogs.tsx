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

let blogCache: BlogData | null = null;

export const useBlogData = () => {
  const [data, setData] = useState<BlogData | null>(null);

  useEffect(() => {
    if (blogCache) {
      setData(blogCache);
      return;
    }
    const fetchBlogs = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        const rawBlogs = await res.json();
        const formattedBlogs: Blog[] = rawBlogs.map((b: any) => ({
          _id: b._id,
          title: b.title || '',
          date: b.date || '',
          blog: b.blog || ''
        }));
        blogCache = { blogs: formattedBlogs };
        setData({ blogs: formattedBlogs });
      } catch (err) {
        console.error('Error fetching blogs:', err);
      }
    }
    fetchBlogs();
  }, []);

  return data;
};

// ✅ Add a new project
export const addBlogData = async (newBlog: Blog): Promise<{ status: number, success: boolean, message: string, blog: Blog }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBlog)
    });
    if (response.status === 201) {
      const blog = await response.json();
      const newBlogData = blog.blog;
      if (blogCache) {
        blogCache.blogs = [...blogCache.blogs, newBlogData];
      }
      return { status: response.status, success: true, message: 'Blog added successfully', blog: newBlogData };
    } else {
      return { status: response.status, success: false, message: 'Failed to add blog', blog: {_id: '', title: '', date: '', blog: ''}};
    }
  } catch (err) {
    console.error('Error adding blog:', err);
    return { status: 500, success: false, message: 'Exception during add', blog: {_id: '', title: '', date: '', blog: ''}};
  }
};

// ✅ Update an existing project by ID
export const updateBlogData = async (id: string, updatedBlog: Blog): Promise<{ status: number, success: boolean, message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedBlog)
    });
    if (response.status === 204) {
      if (blogCache) {
        blogCache.blogs = blogCache.blogs.map((blog) => blog._id === id ? {...updatedBlog, _id: id} : blog);
      }
      return { status: response.status, success: true, message: 'Blog updated successfully' };
    } else {
      return { status: response.status, success: false, message: 'Failed to update blog' };
    }
  } catch (err) {
    console.error('Error updating blog:', err);
    return { status: 500, success: false, message: 'Exception during update' };
  }
};

// ✅ Delete a project by ID
export const deleteBlogData = async (id: string): Promise<{ status: number, success: boolean, message: string }> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/blogs/${id}`, {
      method: 'DELETE'
    });
    if (response.status === 204) {
      if (blogCache) {
        blogCache.blogs = blogCache.blogs.filter((blog) => blog._id !== id);
      }
      return { status: response.status, success: true, message: 'Blog deleted successfully' };
    } else {
      return { status: response.status, success: false, message: 'Failed to delete blog' };
    }
  } catch (err) {
    console.error('Error deleting blog:', err);
    return { status: 500, success: false, message: 'Exception during delete' };
  }
};