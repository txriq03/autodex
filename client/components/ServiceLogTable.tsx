'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { Button } from './ui/button';
import { Pen } from 'lucide-react';

const ServiceLogTable = () => {
    const params = useParams();
    const vin = params.vin;

  return (
    <div className='bg-slate-100 rounded-lg p-5'>
        <div> <h1 className='inline text-slate-500 text-[1.2rem]'>Service log of </h1> <h1 className='inline text-[1.3rem]'>{vin}</h1></div>
        <Button type='button' className='mt-5'> <Pen />Add log</Button>
    </div>
  )
}

export default ServiceLogTable