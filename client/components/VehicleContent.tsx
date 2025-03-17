import { TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import React from 'react'
import { Tabs, TabsContent } from './ui/tabs'
import VehicleGrid from './VehicleGrid'

const VehicleContent = () => {
  return (
    <Tabs defaultValue="all" className='w-full py-2'>
        <TabsList className='w-fit flex justify-center gap-4 bg-slate-100 rounded-lg p-1 shadow-inner'>
            <TabsTrigger value="all" className='data-[state=active]:bg-white data-[state=active]:shadow text-sm px-4 py-2 rounded-md transition'>All</TabsTrigger>
            <TabsTrigger value="owned" className='data-[state=active]:bg-white data-[state=active]:shadow text-sm px-4 py-2 rounded-md transition'>Owned</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
            <VehicleGrid />
        </TabsContent>
        <TabsContent value="owned">
            <VehicleGrid filterOwned={true} />
        </TabsContent>
    </Tabs>
)
}

export default VehicleContent