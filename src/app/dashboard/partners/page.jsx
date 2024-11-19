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
  import Link from 'next/link';
const PartnersComponent = () => {
  const [partners, setPartners] = useState([]);
  const [createFormState, setCreateFormState] = useState({
    name: '',
    photoUrl: '',
    photoKey: ''
  });
  const [updateFormState, setUpdateFormState] = useState({
    id: '',
    name: '',
    photoUrl: '',
    photoKey: ''
  });
  const [errors, setErrors] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const response = await axios.get('/api/partners');
    setPartners(response.data.partners);
  };

  const validateForm = (formState) => {
    const newErrors = [];
    if (!formState.name) newErrors.push('Name is required');
    if (!formState.photoUrl) newErrors.push('Photo URL is required');
    if (!formState.photoKey) newErrors.push('Photo Key is required');
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

    const { id, name, photoUrl, photoKey } = formState;

    if (isUpdate) {
      await axios.put(`/api/partners/${id}`, { name, photoUrl, photoKey });
    } else {
      await axios.post('/api/partners', { name, photoUrl, photoKey });
    }

    setCreateFormState({ name: '', photoUrl: '', photoKey: '' });
    setUpdateFormState({ id: '', name: '', photoUrl: '', photoKey: '' });
    setErrors([]);
    fetchPartners();
    if (isUpdate) setShowUpdateForm(false);
  };

  const handleEdit = (partner) => {
    setUpdateFormState({
      id: partner._id,
      name: partner.name,
      photoUrl: partner.photoUrl,
      photoKey: partner.photoKey
    });
    setShowUpdateForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/partners/${id}`);
    fetchPartners();
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

  const filteredPartners = partners.filter((partner) => partner.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="fixed bg-white z-30 w-full px-4 py-3 border-b shadow-md flex items-center gap-20">
        <Drawer>
          <DrawerTrigger>
            <div className='flex items-center justify-between gap-10 rounded-sm p-2 bg-primary'>
              <PlusCircle color='white' size={22} />
              <h1 className='text-white'>Add Partner</h1>
            </div>
          </DrawerTrigger>
          <DrawerContent className='h-[95%] '>
            <DrawerHeader className='flex items-center justify-center flex-col'>
              <DrawerTitle>Please be sure to enter all values before submitting</DrawerTitle>
              <DrawerDescription>carefully enter values</DrawerDescription>
            </DrawerHeader>
            <form onSubmit={(e) => handleSubmit(e)} className='w-full '>
              <div className="flex flex-col items-start gap-3">
                <ScrollArea className='h-full  w-full bg-white px-4 '>
                  <div className="flex flex-col gap-3 h-[360px] text-black pt-2 py-2 px-2 w-full">
                   <div className="flex flex-col gap-3">
                      <Input name="name" value={createFormState.name} onChange={(e) => handleChange(e)} placeholder="Partner's Name" required className='w-full' />
                    </div>
                    <div className="flex flex-col gap-5">
                      <div className='flex items-center justify-start gap-2'>
                        <h1 className='text-primary font-bold'>Upload Partner&apos;s Photo</h1>
                        <UploadButton
                          className='pt-5 flex'
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            console.log("Files: ", res);
                            alert("Upload Completed");
                            setCreateFormState({
                              ...createFormState,
                              photoUrl: res[0]?.url,
                              photoKey: res[0]?.key,
                            });
                          }}
                          onUploadError={(error) => {
                            alert(`ERROR! ${error.message}`);
                          }}
                        />
                      </div>
                      {createFormState.photoUrl && <Image src={createFormState.photoUrl} className='p-3' width={120} height={150} alt="" />}
                    </div>
                    
                  </div>
                </ScrollArea>
                <Button type="submit" className='w-1/3 bg-green-500 hover:bg-green-600'>Add Partner</Button>
              </div>
            </form>
            <DrawerFooter>
              <DrawerClose>
                <Button variant="destructive" >Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <div className="flex items-center gap-2 p-2 border border-primary rounded-full w-[40%]">
          <Search />
          <input
            type="text"
            placeholder="Search Partners..."
            value={searchQuery}
            onChange={handleSearch}
            className="border-none outline-none w-full"
          />
        </div>
      </div>
      <div className="z-0 w-full pt-[100px] px-10 py-2">
        <table className="min-w-full bg-white w-full border">
          <thead className="bg-gray-800 text-white">
            <tr className='border'>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Name</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Photo</th>
              <th className="py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {filteredPartners.map((partner) => (
              <tr key={partner._id} className='border-b'>
                <td className="py-3 px-4">{partner.name}</td>
                <td className="py-3 px-4"><img src={partner.photoUrl} alt={partner.name} width={50} height={50} /></td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <Drawer>
                    <DrawerTrigger>
                      <Button onClick={() => handleEdit(partner)} className='bg-green-500 hover:bg-green-500 text-white p-2 px-4'>Edit</Button>
                    </DrawerTrigger>
                    <DrawerContent className='h-[95%] w-full'>
                      <DrawerHeader className='mx-auto'>
                        <DrawerTitle className='text-red-700'>Please update values carefully</DrawerTitle>
                      </DrawerHeader>
                      <form onSubmit={(e) => handleSubmit(e, true)} className='w-full'>
                        <div className="flex flex-col items-start gap-3 relative">
                          <ScrollArea className='h-full  w-full bg-white px-4 '>
                            <div className="flex flex-col gap-3 h-[380px] text-black pt-2 py-2 px-2 w-full">
                              <div className="flex flex-col gap-3">
                                <Input name="name" value={updateFormState.name} onChange={(e) => handleChange(e, true)} placeholder="Partner's Name" required className='w-full' />
                              </div>
                             
                              <div className="flex flex-col gap-5">
                                <div className='flex items-center justify-start gap-2'>
                                  <h1 className='text-primary font-bold'>Update Partner&apos;s Photo</h1>
                                  <UploadButton
                                    className='pt-5 flex'
                                    endpoint="imageUploader"
                                    onClientUploadComplete={(res) => {
                                      console.log("Files: ", res);
                                      alert("Upload Completed");
                                      setUpdateFormState({
                                        ...updateFormState,
                                        photoUrl: res[0]?.url,
                                        photoKey: res[0]?.key,
                                      });
                                    }}
                                    onUploadError={(error) => {
                                      alert(`ERROR! ${error.message}`);
                                    }}
                                  />
                                </div>
                                {updateFormState.photoUrl && <Image src={updateFormState.photoUrl} className='p-3' width={120} height={150} alt="" />}
                              </div>
                             
                            </div>
                          </ScrollArea>
                          <Button type="submit" className='w-1/3 bg-green-500 hover:bg-green-600'>Update Partner</Button>
                        </div>
                      </form>
                      <DrawerFooter>
                        <DrawerClose>
                          <Button variant="destructive" >Close</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                  <Button onClick={() => handleDelete(partner._id)} className='bg-red-500 hover:bg-red-600 text-white p-2 px-4'>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Partners = dynamic(() => Promise.resolve(PartnersComponent), { ssr: false });

export default Partners;