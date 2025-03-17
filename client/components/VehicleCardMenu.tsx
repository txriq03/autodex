import React from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";
import Link from "next/link";

const VehicleCardMenu = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="right"
        align="end"
        className="w-fit rounded-md shadow-md bg-white border p-1"
      >
        <DropdownMenuItem className="text-sm hover:bg-slate-100 rounded px-2 py-1.5 cursor-pointer">
          <Link href="#">
            Service logs
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VehicleCardMenu;
