'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import AddLogDialog from './AddLogDialog';
import ServiceLogTable from './ServiceLogTable';

const ServiceLogContainer = () => {
    const params = useParams();
    const vin = params.vin;

  return (
    <div>
        <div> <h1 className='inline text-slate-500 text-[1.2rem]'>Service log of </h1> <h1 className='inline text-[1.3rem]'>{vin}</h1></div>
        <ServiceLogTable />
        <AddLogDialog />
    </div>
  )
}

export default ServiceLogContainer