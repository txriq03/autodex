"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { ethers } from "ethers";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ConnectWalletButton from "./ConnectWalletButton";
import {
  Navbar as NavbarUI,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Button } from "@heroui/button";

const Navbar = () => {
  // <div className=" bg-slate-100 bg-opacity-[5%] py-3">
  //   <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto flex justify-between">
  //     <Link href="/">
  //       <div className="text-2xl text-white font-semibold flex flex-nowrap">
  //         <p>Auto</p>
  //         <p className="text-teal-400">Dex</p>
  //       </div>
  //     </Link>

  //     {account ? (
  //       <div className="text-2xl text-white ">
  //         <p className="inline font-bold text-teal-400">
  //           {Number(balance).toFixed(4)}
  //         </p>{" "}
  //         <p className="inline">ETH</p>
  //       </div>
  //     ) : (
  //       <ConnectWalletButton />
  //     )}
  //   </div>
  // </div>
  const { account, setAccount, provider } = useContext(ContractContext);

  const { data: balance } = useQuery({
    queryKey: ["ethBalance", account],
    queryFn: async () => {
      if (!account || !provider) return null;
      const raw = await provider.getBalance(account);
      return ethers.formatEther(raw);
    },
    enabled: !!account && !!provider,
    refetchInterval: 10000,
  });

  return (
    <NavbarUI
      className="text-white bg-black bg-opacity-[75%] dark"
      shouldHideOnScroll
      classNames={{
        wrapper: "max-w-[1440px] p-5 min-[1470px]:p-0 ",
      }}
    >
      <NavbarBrand>
        <Link href="/" className="text-2xl">
          <p className="inline">Auto</p>
          <p className="inline text-teal-500 font-bold">Dex</p>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="end">
        <NavbarItem>
          {account ? (
            <div className="text-2xl text-white ">
              <p className="inline font-bold text-teal-400">
                {Number(balance).toFixed(4)}
              </p>{" "}
              <p className="inline">ETH</p>
            </div>
          ) : (
            <ConnectWalletButton />
          )}
        </NavbarItem>
      </NavbarContent>
    </NavbarUI>
  );
};

export default Navbar;
