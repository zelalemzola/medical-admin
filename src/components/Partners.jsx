"use client"
import React,{useState,useEffect} from "react";
import axios from 'axios';
import Image from "next/image";

const Partners =()=>{
      const [partners, setPartners] = useState([]);
       useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    const response = await axios.get('/api/partners');
    setPartners(response.data.partners);
  };
  return (
     <div className='w-full py-10'>
    <h1 className='text-primary text-3xl font-extrabold text-center'>Our Partners</h1>
    <div className=' flex items-center flex-wrap flex-col md:flex-row place-content-center gap-10 py-10 px-10'>
      {partners.map((partner)=>(
        <div key={partner._id} className='flex items-center justify-evenly p-2 shadow-md border-t  shadow-gray-300  rounded-2xl w-[80%] md:w-[30%]'>
          <h2 className='text-lg text-gray-700 font-bold'>{partner.name}</h2>
          <Image src={partner.photoUrl} alt={partner.name} width={140} height={140} className='rounded-full border-t  shadow-md shadow-gray-300'/>
        </div>
      ))}
    </div>
    </div>
  );
}

export default Partners;