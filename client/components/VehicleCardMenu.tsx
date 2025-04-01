"use client";
import React from "react";
import {
  BadgeDollarSign,
  Book,
  Ellipsis,
  FileClock,
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

const VehicleCardMenu = ({
  vin,
  onListForSaleOpen,
  onHistoryOpen,
}: {
  vin: string;
  onListForSaleOpen: any;
  onHistoryOpen: any;
}) => {
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
            <DropdownItem
              key="information"
              as={Link}
              href={`/cars/${vin}`}
              startContent={<Book size={18} />}
            >
              Information
            </DropdownItem>
            <DropdownItem
              key="service-logs"
              startContent={<ScrollText size={18} />}
              as={Link}
              href={`/logs/${vin}`}
            >
              Service Logs
            </DropdownItem>
            <DropdownItem
              key="ownership-history"
              startContent={<FileClock size={18} />}
              onPress={onHistoryOpen}
            >
              Ownership History
            </DropdownItem>
          </DropdownSection>

          <DropdownSection title="Actions">
            <DropdownItem
              key="list-for-sale"
              startContent={<BadgeDollarSign size={18} />}
              onPress={onListForSaleOpen}
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
