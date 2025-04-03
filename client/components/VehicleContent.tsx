"use client";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react";
// import { Tabs, TabsContent } from "./ui/tabs";
import VehicleGrid from "./VehicleGrid";
import { LayoutGrid, UserRound } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";

const VehicleContent = () => {
  return (
    // <Tabs defaultValue="all" className="w-full py-2">
    //   <TabsList className="w-full sm:w-fit flex justify-center gap-4 bg-slate-100 bg-opacity-[5%] rounded-lg p-1 shadow-inner">
    //     <TabsTrigger
    //       value="all"
    //       type="button"
    //       className="data-[state=active]:bg-slate-200 data-[state=active]:bg-opacity-[5%]  data-[state=active]:shadow text-sm px-4 py-2 rounded-md transition flex items-center gap-1 w-full sm:w-28 justify-center"
    //     >
    //       <LayoutGrid size={20} />
    //       <p className="text-lg">All</p>
    //     </TabsTrigger>
    //     <TabsTrigger
    //       value="owned"
    //       type="button"
    //       className="data-[state=active]:bg-slate-200 data-[state=active]:bg-opacity-[5%]  data-[state=active]:shadow text-sm px-4 py-2 rounded-md transition flex items-center gap-1 w-full sm:w-28 justify-center"
    //     >
    //       <UserRound size={20} />
    //       <p>Owned</p>
    //     </TabsTrigger>
    //   </TabsList>
    //   <TabsContent value="all">
    //     <VehicleGrid />
    //   </TabsContent>
    //   <TabsContent value="owned">
    //     <VehicleGrid filterOwned={true} />
    //   </TabsContent>
    // </Tabs>

    <Tabs
      aria-label="Mint Filter"
      className="w-full py-2"
      size="lg"
      radius="sm"
      color="primary"
      variant="light"
      classNames={{
        tabList: "w-full sm:w-[200px]",
        tab: "w-full sm:w-[100px] ",
      }}
    >
      <Tab key="all" aria-label="All" title="All">
        <VehicleGrid />
      </Tab>
      <Tab key="owned" aria-label="Owned" title="Owned">
        <VehicleGrid filterOwned />
      </Tab>
    </Tabs>
  );
};

export default VehicleContent;
