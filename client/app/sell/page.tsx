import VehicleForm from '@/components/VehicleForm'
import React from 'react'

const SellVehicle = () => {
  return (
    <div className='p-5'>
        {/* <div className='min-[980px]:max-w-[980px] mx-5 min-[990px]:mx-auto outline outline-slate-300 outline-1 p-2 rounded-lg shadow-sm'>
            <h1 className='text-[3rem] font-semibold'>Vehicle information</h1>
            <p className='text-slate-700 text-[1.2rem]'>Please enter your vehicle details below.</p>

        </div> */}
        <VehicleForm />
    </div>
  )
}

export default SellVehicle