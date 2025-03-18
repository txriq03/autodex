import React from 'react'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Pen } from 'lucide-react'
import { useForm } from "react-hook-form";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
  } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logSchema, LogFormData } from '@/lib/validation'
import { Input } from './ui/input'

const AddLogDialog = () => {
    const form = useForm<LogFormData>({
        resolver: zodResolver(logSchema),
        defaultValues: {
          garage: "",
          mileage: 0,
          description: "",
        },
      });

      const onSubmit = (data: LogFormData) => {
        console.log("Submitted log:", data);
      };

  return (
    <Dialog>
        <DialogTrigger asChild>
            <Button type='button' className='mt-3'> <Pen />Add log</Button>
        </DialogTrigger>

        <DialogContent className='sm:max-w-md'>
            <DialogHeader>
                <DialogTitle>Add Service Log</DialogTitle>
                <DialogDescription>Enter service details below.</DialogDescription>
            </DialogHeader>

            <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="garage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garage Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. KwikFit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 15000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Oil change & filter replacement" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='max-sm:gap-2'>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>

        </DialogContent>
    </Dialog>
  )
}

export default AddLogDialog