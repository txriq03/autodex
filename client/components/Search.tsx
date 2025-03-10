import React from 'react'
import { Input } from './ui/input'

const Search = () => {
  return (
    <Input placeholder='Search vehicle... ' className='max-w-[400px] py-[25px] placeholder:text-lg focus-visible:ring-none focus-visible:border-none focus-visible:outline-none '/>
  )
}

export default Search