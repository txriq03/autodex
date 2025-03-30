"use client";
import React from "react";
import {
  BadgeDollarSign,
  Book,
  Ellipsis,
  ScrollText,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";

const VehicleCardMenu = ({ vin, onOpen }: { vin: string; onOpen: any }) => {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Dropdown className="dark text-foreground" placement="right">
        <DropdownTrigger>
          <Button isIconOnly variant="light">
            <Ellipsis />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions" variant="flat">
          <DropdownSection showDivider title="View">
            <DropdownItem key="information" startContent={<Book size={18} />}>
              <Link href={`/cars/${vin}`}>Information</Link>
            </DropdownItem>
            <DropdownItem
              key="service-logs"
              startContent={<ScrollText size={18} />}
            >
              <Link href={`/logs/${vin}`}>Service Logs</Link>
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Actions">
            <DropdownItem
              key="list-for-sale"
              startContent={<BadgeDollarSign size={18} />}
              onPress={onOpen}
            >
              List For Sale
            </DropdownItem>
            <DropdownItem
              key="delete"
              color="danger"
              className="text-danger"
              startContent={<Trash2 size={18} />}
            >
              Delete
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </>
  );
};

export default VehicleCardMenu;
