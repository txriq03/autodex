'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Control, FieldPath, useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'

const carSchema = z.object({
    make: z.string().nonempty({ message: 'Make is required.'}),
    model: z.string().nonempty({ message: 'Model is required.'}),
    year: z
        .number({ invalid_type_error: 'Year must be a number.'})
        .int()
        .min(1886, { message: 'Year must be 1886 or later.'})
        .max(new Date().getFullYear(), { message: 'Year cannot be in the future.'}),
    vin: z
        .string()
        .length(17, { message: 'Vin must be exactly 17 characters'}),
    mileage: z.number().nonnegative({ message: 'Mileage must be 0 or more'})
})

type CarFormData = z.infer<typeof carSchema>;

const VehicleForm = () => {
    const form = useForm<z.infer<typeof carSchema>>({
        resolver: zodResolver(carSchema),
        defaultValues: {
            make: "",
            model: "",
            year: undefined,
            vin: "",
            mileage: undefined
        }
    })

    const onSubmit = (values: z.infer<typeof carSchema>) => {
        console.log(values);
    }

  return (
    <Card className='max-w-[700px] mx-auto'>
        <CardHeader>
            <CardTitle>Vehicle information</CardTitle>
            <CardDescription>We need information to put up your vehicle in the marketplace.</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='grid w-full items-center gap-4'>
                    <VehicleFormField 
                        name='make'
                        label='Make'
                        placeholder='Toyota'
                        inputType='text'
                        formControl={form.control}
                    />
                    <VehicleFormField 
                        name='model'
                        label='Model'
                        placeholder='Supra'
                        inputType='text'
                        formControl={form.control}
                    />
                    <VehicleFormField 
                        name='year'
                        label='Year'
                        placeholder='1998'
                        description='Cannot be earlier than 1886.'
                        inputType='text'
                        formControl={form.control}
                    />
                    <VehicleFormField 
                        name='vin'
                        label='Vehicle Identification Number'
                        placeholder='1 123 456 789 0 ABC'
                        description='Can be found on your chassis or V5C.'
                        inputType='text'
                        formControl={form.control}
                    />
                    <VehicleFormField 
                        name='mileage'
                        label='Mileage'
                        placeholder='20,000'
                        inputType='text'
                        formControl={form.control}
                    />
                </form>
            </Form>


            {/* <form autoComplete='on'>
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
                        <Label htmlFor='vin'>Vehicle Identification Number </Label>
                        <Input id="vin" placeholder='1 123 456 789 0 ABC' />
                    </div>
                    <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='mileage'>Mileage (in miles)</Label>
                        <Input id="mileage" placeholder='20,000' />
                    </div>
                    <div className='flex flex-col space-y-1.5'>
                        <Label htmlFor='price'>Price (in ETH) </Label>
                        <Input id="price" placeholder='0.002' />
                    </div>
                </div>
            </form> */}
        </CardContent>
        <CardFooter>
            <Button>Submit</Button>
        </CardFooter>
    </Card>
  )
}

interface VehicleFormFieldProps {
    name: FieldPath<z.infer<typeof carSchema>>,
    label: string;
    placeholder: string;
    description?: string;
    inputType?: string,
    formControl: Control<z.infer<typeof carSchema>, any>
}

const VehicleFormField: React.FC<VehicleFormFieldProps> = ({
    name, label, placeholder, description, inputType, formControl
}) => {
    return (
        <FormField control={formControl} name={name} render={({ field }) => (
            <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                    <Input placeholder={placeholder} {...field} type={inputType || 'text'} />
                </FormControl>
                {description && <FormDescription>{description}</FormDescription>}
                <FormMessage />
            </FormItem>
        )}/>
    )
}
export default VehicleForm