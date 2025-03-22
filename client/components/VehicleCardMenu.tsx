"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Book, Ellipsis, Hammer, ScrollText } from "lucide-react";
import Link from "next/link";

const VehicleCardMenu = ({ vin }: { vin: string }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-slate-50 hover:bg-opacity-[5%] hover:text-slate-50"
        >
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        className="w-fit rounded-md shadow-md bg-white border p-1"
      >
        <Link href={`/cars/${vin}`}>
          <DropdownMenuItem className="text-sm hover:bg-slate-100 rounded px-2 py-1.5 cursor-pointer flex justify-between">
            Information <Book className="text-slate-600" />
          </DropdownMenuItem>
        </Link>
        <Link href={`/logs/${vin}`}>
          <DropdownMenuItem className="text-sm hover:bg-slate-100 rounded px-2 py-1.5 cursor-pointer flex justify-between">
            Service logs <ScrollText className="text-slate-600" />
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          disabled
          className="text-sm text-slate-500 rounded px-2 py-1.5 "
        >
          Delete <Hammer />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleCardMenu;
