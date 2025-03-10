import React from 'react'
import { Button } from './ui/button';

const Hero = () => {
  return (
    <div className='max-width mt-24 mb-10 rounded-xl bg-indigo-500 p-5'>
        <h1 className='text-[4rem] max-w-[700px] leading-[75px] text-white'>
            Buy, rent, and sell vehicles. Quick, simple and easy!
        </h1>
        <p className='text-[1.5rem] text-white opacity-70'>
            Use blockchain technology to anonymously purchase and sell vehicles.
        </p>
        <div className='flex gap-2 my-5'>
            <Button className='w-[100px] py-[25px] text-xl bg-white text-black hover:bg-slate-200 '>Buy</Button>
            <Button className='w-[100px] py-[25px] text-xl bg-indigo-500 text-white' variant="outline">Sell</Button>
        </div>
    </div>
  )
}

export default Hero;