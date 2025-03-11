import React from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const Hero = () => {
  return (
    <div className='max-width mt-24 mb-10 rounded-xl bg-gradient-to-r from-slate-900 to-slate-700 p-10 relative'>
        <h1 className='text-[4rem] max-w-[700px] leading-[75px] text-white font-bold mb-4'>
            List Your Ride. Keep Your Privacy.
        </h1>
        <p className='text-[1.5rem] text-white opacity-70 w-[700px] font-light'>
            This is a decentralised platform for listing and discovering your favourite rides.
            Powered by blockchain, secured by your wallet - no accounts, no hassle.
        </p>
        <Image src="/hero.png" alt="Hero" width={1712} height={948} className='absolute w-[600px] top-[50%] translate-y-[-50%] right-[5%]'/>
        {/* <div className='flex gap-2 my-5'>
            <Button className='w-[100px] py-[25px] text-xl bg-white text-black hover:bg-slate-200 '>Buy</Button>
            <Button className='w-[100px] py-[25px] text-xl bg-transparent text-white' variant="outline">Sell</Button>
        </div> */}
        <Button className='bg-slate-50 text-slate-900 mt-5 text-lg py-[22px] hover:bg-slate-200'>Connect Wallet</Button>
    </div>
  )
}

export default Hero;