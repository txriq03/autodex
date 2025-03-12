"use client"
import React, { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ContractContext } from "./providers/ContractProvider";
import { ethers } from "ethers";
import { getProvider } from "@/lib/web3/contractServices";

const Navbar = () => {
  const {account, setAccount} = useContext(ContractContext);
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const provider = await getProvider();
        const rawBalance = await provider.getBalance(account);
        setBalance(ethers.formatEther(rawBalance));
      }
    };
    fetchBalance();
  }, [account])

  return (
    <div className=" bg-slate-800 py-3">
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto flex justify-between">

        <div className="text-2xl text-white font-semibold">AutoDex</div>

        {account ? (
          <div className="text-2xl text-white ">
            <p className="inline font-bold text-teal-400">{Number(balance).toFixed(2)}</p>  <p className="inline">ETH</p>
          </div>
        ) : (
          <div>
            <Button variant="secondary">Connect Wallet</Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;
