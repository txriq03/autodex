"use client";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ContractContext } from "./providers/ContractProvider";
import { ethers } from "ethers";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ConnectWalletButton from "./ConnectWalletButton";

const Navbar = () => {
  const { account, setAccount, provider } = useContext(ContractContext);

  const { data: balance } = useQuery({
    queryKey: ['ethBalance', account],
    queryFn: async () => {
      if (!account || !provider) return null;
      const raw = await provider.getBalance(account);
      return ethers.formatEther(raw);
    },
    enabled: !!account && !!provider,
    refetchInterval: 10000
  })

  return (
    <div className=" bg-slate-800 py-3">
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto flex justify-between">
        <Link href="/">
          <div className="text-2xl text-white font-semibold">AutoDex</div>
        </Link>

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
      </div>
    </div>
  );
};

export default Navbar;
