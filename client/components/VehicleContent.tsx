"use client";
import { TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React from "react";
// import { Tabs, TabsContent } from "./ui/tabs";
import VehicleGrid from "./VehicleGrid";
import { LayoutGrid, UserRound } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";

const VehicleContent = () => {
  return (
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
