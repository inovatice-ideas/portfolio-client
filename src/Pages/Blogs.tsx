import { FC, useState, useEffect } from 'react';
import GlassCard, { MessageChunk } from '../Components/GlassCard';
import './Pages.css';
import DynamicForm, { Field } from '../Components/Form';
import { useEditMode } from '../Components/EditMode';
import { Blog, useBlogData, addBlogData, updateBlogData, deleteBlogData } from '../apicalls/fetchBlogs';

const parseDate = (dateStr: string): Date => {
  const parts = dateStr.trim().split('/');
  if (parts.length !== 3) return new Date(0); // fallback to earliest date if invalid

  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day); // month is 0-indexed
};

export const convertBlogsToChunks = (bioDataBlogs: any): MessageChunk[][] => {
  return bioDataBlogs.map((blog: any) => [
    { type: 'text', content: '📝 Blog Title: ', size: 'medium' },
    { type: 'text', content: `${blog.title}\n`, size: 'large'},

    { type: 'text', content: '📅 ', size: 'medium' },
    { type: 'text', content: `${blog.date}\n\n`, size: 'medium' },

    { type: 'text', content: '🧾 ', size: 'medium'},
    { type: 'text', content: `${blog.blog}\n`, size: 'small'},
  ]);
};

export const convertBlogsToCarousalChunks = (bioDataBlogs: any): MessageChunk[][] => {
  return bioDataBlogs.map((blog: any) => [
    { type: 'text', content: '📝 Blog Title: ', size: 'large' },
    { type: 'text', content: `${blog.title}\n\n`, size: 'large'},

    { type: 'text', content: '📅 ', size: 'medium' },
    { type: 'text', content: `${blog.date}\n`, size: 'medium' },
  ]);
};

const defaultBlog: Blog = {
  _id: '',
  title: '',
  date: '',
  blog: ''
};

const blogFields: Field[] = [
  { label: 'Title', name: 'title', type: 'text', placeholder: 'Enter blog title', optional: false },
  { label: 'Date', name: 'date', type: 'text', placeholder: 'DD/MM/YYYY', optional: false },
  { label: 'Blog Content', name: 'blog', type: 'textarea', placeholder: 'Write your blog...', optional: false }
];

const Blogs: FC = () => {
  const { isEditMode } = useEditMode();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isCarouselView, setIsCarouselView] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Blog>(defaultBlog);
  const [isEdit, setIsEdit] = useState(false);
  const [isHoveringAdd, setIsHoveringAdd] = useState(false);
  const bioDataBlogs = useBlogData();

  useEffect(() => {
    if (bioDataBlogs?.blogs) {
      setBlogs(bioDataBlogs.blogs);
    }
  }, [bioDataBlogs?.blogs]);

  const sortedBlogs = [...blogs].sort(
    (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
  );

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setIsCarouselView(false);
  };

  const handleBack = () => {
    setSelectedIndex(null);
    setIsCarouselView(true);
  };

  const handleAdd = () => {
    setFormData(defaultBlog);
    setIsEdit(false);
    setShowForm(true);
  };

  // Edit
  const handleEdit = () => {
    setFormData(sortedBlogs[selectedIndex!]);
    setIsEdit(true);
    setShowForm(true);
  };

  // Delete
  const handleDelete = async () => {
    if (selectedIndex === null || !sortedBlogs[selectedIndex]?._id) {
      console.error('Cannot delete: Invalid selectedIndex or missing _id');
      return;
    }
  
    const blogId = sortedBlogs[selectedIndex]._id!;
    console.log('Deleting blog with ID:', blogId);
  
    try {
      const res = await deleteBlogData(blogId);
      if (res?.status === 204) {
        const updated = sortedBlogs.filter((_, idx) => idx !== selectedIndex);
        setBlogs(updated);
        setIsCarouselView(true);
        setSelectedIndex(null);
        console.log('Blog deleted successfully');
      } else {
        console.error('Failed to delete blog. Response:', res);
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
      const res = await updateBlogData(sortedBlogs[selectedIndex!]._id!, sanitizedData);
      if (res?.status === 204) {
        console.log("Update successful");
        const updated = sortedBlogs.map((blog, idx) => idx === selectedIndex ? formData : blog);
        setBlogs(updated);
        setShowForm(false);
        setIsCarouselView(false);
      }
      else {
        console.log("Update failed");
      }
    } else {
      const res = await addBlogData(sanitizedData);
      if (res?.status === 201) {
        console.log("Add successful");
        const updated = [...sortedBlogs, res.blog];
        setBlogs(updated);
        setShowForm(false);
        setIsCarouselView(true);
        setSelectedIndex(null);
      }
      else {
        console.log("Add failed");
      }
    }
  };

  const carousalChunks = convertBlogsToCarousalChunks(sortedBlogs);
  const detailedChunks = convertBlogsToChunks(sortedBlogs);

  return (
    <>
      {isCarouselView && !showForm ? (
        <div className='carousal-container-wrapper'>
          <div className='carousal-container'>
            {carousalChunks.length > 0 && carousalChunks.map((chunks, index) => (
              <div key={index} onClick={() => handleCardClick(index)} style={{ cursor: 'pointer' }}>
                <GlassCard isMulti={true} messageChunks={chunks} animationDelay={index * 650} />
              </div>
            ))}
            {carousalChunks.length === 0 && (
              <GlassCard isMulti={true} message={"No blogs available at the moment."} />
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
              {isHoveringAdd ? 'Add Blog' : 'Engrave'}
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
          fields={blogFields}
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

export default Blogs;
