"use client";
import React from "react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "./ui/dropdown-menu";
// import { Button } from "./ui/button";
import { Book, Ellipsis, Hammer, ScrollText, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

const VehicleCardMenu = ({ vin }: { vin: string }) => {
  return (
    <Dropdown className="dark text-foreground" placement="right">
      <DropdownTrigger>
        <Button isIconOnly variant="light">
          <Ellipsis />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Actions" variant="flat">
        <DropdownItem key="information" startContent={<Book size={18} />}>
          <Link href={`/cars/${vin}`}>Information</Link>
        </DropdownItem>
        <DropdownItem
          key="service-logs"
          startContent={<ScrollText size={18} />}
        >
          <Link href={`/logs/${vin}`}>Service Logs</Link>
        </DropdownItem>
        <DropdownItem
          key="delete"
          color="danger"
          className="text-danger"
          startContent={<Trash2 size={18} />}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <Button variant="ghost" size="icon" className="">
    //       <Ellipsis />
    //     </Button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent
    //     side="right"
    //     align="end"
    //     className="w-fit rounded-md shadow-md bg-white border p-1"
    //   >
    //     <Link href={`/cars/${vin}`}>
    //       <DropdownMenuItem className="text-sm hover:bg-slate-100 rounded px-2 py-1.5 cursor-pointer flex justify-between">
    //         Information <Book className="text-slate-600" />
    //       </DropdownMenuItem>
    //     </Link>
    //     <Link href={`/logs/${vin}`}>
    //       <DropdownMenuItem className="text-sm hover:bg-slate-100 rounded px-2 py-1.5 cursor-pointer flex justify-between">
    //         Service logs <ScrollText className="text-slate-600" />
    //       </DropdownMenuItem>
    //     </Link>
    //     <DropdownMenuItem
    //       disabled
    //       className="text-sm text-slate-500 rounded px-2 py-1.5 "
    //     >
    //       Delete <Hammer />
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
  );
};

export default VehicleCardMenu;
