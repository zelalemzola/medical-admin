 "use client";
  import dynamic from 'next/dynamic';
  import { useEffect, useState } from 'react';
  import axios from 'axios';
  import { useRouter } from 'next/navigation';
  import { UploadButton } from '@uploadthing/react';
  import Image from 'next/image';
  import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
  import { Button } from '@/components/ui/button';
  import { PlusCircle, Search } from 'lucide-react';
  import { Input } from '@/components/ui/input';
  import { ScrollArea } from '@/components/ui/scroll-area';
  import { CircleX } from 'lucide-react';
const BlogsComponent = () => {
  const [blogs, setBlogs] = useState([]);
  const [createFormState, setCreateFormState] = useState({
    title: '',
    thumbnailUrl: '',
    thumbnailKey: '',
    date: new Date().toISOString().split('T')[0], // Set default date to today
    content: ''
  });
  const [updateFormState, setUpdateFormState] = useState({
    id: '',
    title: '',
    thumbnailUrl: '',
    thumbnailKey: '',
    date: '',
    content: ''
  });
  const [errors, setErrors] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const response = await axios.get('/api/blogs');
    setBlogs(response.data.blogs);
  };

  const validateForm = (formState) => {
    const newErrors = [];
    if (!formState.title) newErrors.push('Title is required');
    if (!formState.thumbnailUrl) newErrors.push('Thumbnail URL is required');
    if (!formState.thumbnailKey) newErrors.push('Thumbnail Key is required');
    if (!formState.date) newErrors.push('Date is required');
    if (!formState.content) newErrors.push('Content is required');
    return newErrors;
  };

  const handleSubmit = async (event, isUpdate = false) => {
    event.preventDefault();
    const formState = isUpdate ? updateFormState : createFormState;
    const validationErrors = validateForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { id, title, thumbnailUrl, thumbnailKey, date, content } = formState;

    if (isUpdate) {
      await axios.put(`/api/blogs/${id}`, { title, thumbnailUrl, thumbnailKey, date, content });
    } else {
      await axios.post('/api/blogs', { title, thumbnailUrl, thumbnailKey, date, content });
    }

    setCreateFormState({ title: '', thumbnailUrl: '', thumbnailKey: '', date: new Date().toISOString().split('T')[0], content: '' });
    setUpdateFormState({ id: '', title: '', thumbnailUrl: '', thumbnailKey: '', date: '', content: '' });
    setErrors([]);
    fetchBlogs();
    if (isUpdate) setShowUpdateForm(false);
  };

  const handleEdit = (blog) => {
    setUpdateFormState({
      id: blog._id,
      title: blog.title,
      thumbnailUrl: blog.thumbnailUrl,
      thumbnailKey: blog.thumbnailKey,
      date: blog.date.split('T')[0], // Format date for input
      content: blog.content
    });
    setShowUpdateForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/blogs/${id}`);
    fetchBlogs();
  };

  const handleChange = (e, isUpdate = false) => {
    const { name, value } = e.target;
    const formState = isUpdate ? updateFormState : createFormState;
    const setFormState = isUpdate ? setUpdateFormState : setCreateFormState;

    setFormState({ ...formState, [name]: value });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="fixed bg-white z-30 w-full px-4 py-3 border-b shadow-md flex items-center gap-20">
        <Drawer className='relative'>
          <DrawerTrigger>
            <div className='flex items-center justify-between gap-10 rounded-sm p-2 bg-primary'>
              <PlusCircle color='white' size={22} />
              <h1 className='text-white'>Add Blog</h1>
            </div>
          </DrawerTrigger>
          <DrawerContent className='h-[95%] '>
            <DrawerHeader className='flex items-center justify-center flex-col'>
              <DrawerTitle>Please be sure to enter all values before submitting</DrawerTitle>
              <DrawerDescription>Carefully enter values</DrawerDescription>
            </DrawerHeader>
            <form onSubmit={(e) => handleSubmit(e)} className='w-full '>
              <div className="flex flex-col items-start gap-3">
                <ScrollArea className='h-full  w-full bg-white px-4 '>
                  <div className="flex flex-col gap-3 h-[70vh] text-black pt-2 py-2 px-2 w-full ">
                    <label className='text-primary text-lg font-bold'>Title</label>
                    <Input name="title" value={createFormState.title} onChange={(e) => handleChange(e)} placeholder="Blog Title" required className='w-full' />
                    
                    <div className='flex items-center justify-start gap-2'>
                      <h1 className='text-primary font-bold'>Upload Blog&lsquo;s Thumbnail</h1>
                      <UploadButton
                        className='pt-5 flex'
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          setCreateFormState({
                            ...createFormState,
                            thumbnailUrl: res[0]?.url,
                            thumbnailKey: res[0]?.key,
                          });
                        }}
                        onUploadError={(error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                      {createFormState.thumbnailUrl && <Image src={createFormState.thumbnailUrl} className='p-3' width={120} height={150} alt="" />}

                    </div>
                     <label className='text-primary text-lg font-bold'>Date</label>
                    <input
                      type="date"
                      name="date"
                      value={createFormState.date}
                      onChange={(e) => handleChange(e)}
                      className='w-fit'
                    />
                     <label className='text-primary text-lg font-bold'>Content</label>
                    <textarea
                      name="content"
                      value={createFormState.content}
                      onChange={(e) => handleChange(e)}
                      placeholder="Blog Content"
                      required
                      className='w-full h-48'
                      
                    />
                  </div>
                </ScrollArea> 
                <Button type="submit" className='w-1/3 bg-green-800  text-white'>Submit</Button>
                {errors.length > 0 && <p className='text-red-600'>{errors.join(', ')}</p>}
              </div>
            </form>
            <DrawerClose className='absolute top-5 right-5 hover:shadow-2xl'>
              <CircleX className='text-red-500 text-lg scale-[150%]'/>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
        <div className='flex items-center gap-2 border border-primary p-2 rounded-full shadow-xl w-[30%]'>
          <Search className='text-primary font-bold'/>
        <input
          type="text"
          placeholder="Search Blogs"
          value={searchQuery}
          onChange={handleSearch}
          className="outline-none border-none w-full"
        />
        </div>
      </div>
      <div className="flex flex-col items-start justify-start  mx-5">
        <h1 className="text-3xl mb-5">Blogs</h1>
        <div className="overflow-x-auto w-full mt-[10%]">
          <table className="table-auto border-collapse w-full ">
            <thead className='bg-primary text-white'>
              <tr>
                <th className="border p-2">Title</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="border p-2">{blog.title}</td>
                 
                  <td className="border p-2">{new Date(blog.date).toLocaleDateString()}</td>
                  <td className="border p-2 flex gap-2">
                    <Button onClick={() => handleEdit(blog)} className='bg-orange-400 hover:bg-orange-500 text-white'>Edit</Button>
                    <Button onClick={() => handleDelete(blog._id)}  className='bg-red-400 hover:bg-red-500 text-white'>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {showUpdateForm && (
        <Drawer open={showUpdateForm} onOpenChange={setShowUpdateForm} className='relative'>
          <DrawerContent className='h-[95%] '>
            <DrawerHeader className='flex items-center justify-center flex-col'>
              <DrawerTitle>Edit Blog</DrawerTitle>
              <DrawerDescription>Edit the values and submit</DrawerDescription>
            </DrawerHeader>
            <form onSubmit={(e) => handleSubmit(e, true)} className='w-full '>
              <div className="flex flex-col items-start gap-3">
                <ScrollArea className='h-full  w-full bg-white px-4 '>
                  <div className="flex flex-col gap-3 h-[70vh] text-black pt-2 py-2 px-2 w-full ">
                    <label className='text-primary text-lg font-bold'>Edit Title</label>
                    <Input name="title" value={updateFormState.title} onChange={(e) => handleChange(e, true)} placeholder="Blog Title" required className='w-full' />
                    <div className='flex items-center justify-start gap-2'>
                      <h1 className='text-primary font-bold'>Upload Blog&lsquo;s Thumbnail</h1>
                      <UploadButton
                        className='pt-5 flex'
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          setUpdateFormState({
                            ...updateFormState,
                            thumbnailUrl: res[0]?.url,
                            thumbnailKey: res[0]?.key,
                          });
                        }}
                        onUploadError={(error) => {
                          alert(`ERROR! ${error.message}`);
                        }}
                      />
                  {updateFormState.thumbnailUrl && <Image src={updateFormState.thumbnailUrl} className='p-3' width={120} height={150} alt="" />}

                    </div>
                   <label className='text-primary text-lg font-bold'>Edit Date</label>
                    <input
                      type="date"
                      name="date"
                      value={updateFormState.date}
                      onChange={(e) => handleChange(e, true)}
                      className='w-fit'
                    />
                   <label className='text-primary text-lg font-bold'>Edit Content</label>
                    <textarea
                      name="content"
                      value={updateFormState.content}
                      onChange={(e) => handleChange(e, true)}
                      placeholder="Blog Content"
                      required
                      className='w-full h-24'
                    />
                  </div>
                </ScrollArea>
                <Button type="submit" className='w-1/3 bg-orange-500'>Update</Button>
              </div>
            </form>
            <DrawerClose className='absolute top-5 right-5 hover:shadow-2xl ' >
              <CircleX className='text-red-500 text-lg scale-[150%]'/>
            </DrawerClose>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
};

const Blogs = dynamic(() => Promise.resolve(BlogsComponent), { ssr: false });

export default Blogs;