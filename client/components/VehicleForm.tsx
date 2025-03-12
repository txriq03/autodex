import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'

const VehicleForm = () => {
  return (
    <Card className='max-w-[700px] mx-auto'>
        <CardHeader>
            <CardTitle>Vehicle information</CardTitle>
            <CardDescription>We need information to put up your vehicle in the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
            <form autoComplete='on'>
                <div className='grid w-full items-center gap-4'>
                    <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='brand'>Brand</Label>
                        <Input id="brand" placeholder='Toyota' />
                    </div>
                    <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='make'>Make</Label>
                        <Input id="make" placeholder='Supra' />
                    </div>
                    <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='year'>Year</Label>
                        <Input id="year" placeholder='1998' />
                    </div>
                    <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='price'>Price (in ETH) </Label>
                        <Input id="price" placeholder='0.002' />
                    </div>
                </div>
            </form>
        </CardContent>
        <CardFooter>
            <Button>Submit</Button>
        </CardFooter>
    </Card>
  )
}

export default VehicleForm