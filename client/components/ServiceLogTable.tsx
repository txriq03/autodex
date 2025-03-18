'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import AddLogDialog from './AddLogDialog';

const ServiceLogTable = () => {
    const params = useParams();
    const vin = params.vin;

  return (
    <div>
        <div className='bg-slate-100 rounded-lg p-5'>
            <div> <h1 className='inline text-slate-500 text-[1.2rem]'>Service log of </h1> <h1 className='inline text-[1.3rem]'>{vin}</h1></div>
        </div>
        <AddLogDialog />
    </div>
  )
}

export default ServiceLogTable