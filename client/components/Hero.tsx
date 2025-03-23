"use client";
import { Button } from "./ui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";

const Hero = () => {
  const { account } = useContext(ContractContext);

  const { data: signer, isPending, refetch, error } = useWalletSigner();

  if (!isPending) {
    console.log("Signer:", signer);
  }

  useEffect(() => {
    const fetchAddress = async () => {
      if (signer) {
        const address = await signer.getAddress();
        console.log("Connected wallet address:", address);
      }
    };

    fetchAddress();
  }, [signer]);

  return (
    <div className="mt-0 mx-0 min-[1440px]:max-w-[1440px] min-[1440px]:rounded-xl min-[1450px]:mx-auto min-[1440px]:mt-[10px] bg-slate-50 bg-opacity-[5%] mb-10 p-10 relative overflow-hidden">
      <h1 className="text-[2rem] sm:text-[3rem] md:text-[4rem] max-w-[700px] text-slate-50 font-bold mb-4">
        List Your Ride. Keep Your Privacy.
      </h1>
      <p className="text-[1.2rem] md:text-[1.5rem] text-slate-400 max-w-[700px] font-light">
        AutoDex is a decentralised platform for listing and discovering your
        favourite rides. Powered by blockchain, secured by your wallet - no
        accounts, no hassle.
      </p>
      <Image
        priority
        src="/hero.png"
        alt="Hero"
        width={1712}
        height={948}
        className="absolute w-[600px] top-[50%] translate-y-[-50%] right-[5%] hidden min-[1440px]:block"
      />
      <Image
        priority
        src="/sideview.png"
        alt="Hero"
        width={2000}
        height={642}
        className="absolute h-[300px] w-auto top-[50%] translate-y-[-50%] hidden lg:block left-[80%] xl:left-[70%]  min-[1440px]:hidden"
      />

      {/* Show connect button if no account found, otherwise show buy and sell buttons */}
      {account ? (
        <>
          <div className="flex gap-2 my-5">
            {/* <Button className="w-[100px] py-[25px] text-xl bg-white text-black hover:bg-slate-200 ">
              Mint
            </Button> */}
            <Link href="/sell">
              <Button
                className=" py-[25px] text-lg font-light bg-transparent text-white rounded-lg"
                variant="outline"
              >
                Mint your vehicle
              </Button>
            </Link>
          </div>
          <div className=" mt-5">
            <p className="inline text-slate-400">Account: </p>{" "}
            <p className="inline text-teal-400">{account}</p>
          </div>
        </>
      ) : (
        <ConnectWalletButton className="py-6 mt-4 text-lg" />
      )}
    </div>
  );
};

export const useWalletSigner = () => {
  const { provider, setAccount } = useContext(ContractContext);
  const query = useQuery({
    queryKey: ["walletSigner"],
    queryFn: async () => {
      if (typeof window === "undefined" || !window.ethereum) {
        throw new Error("MetaMask not available");
      }

      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      // Optional: trigger MetaMask if not connected
      await window.ethereum.request({ method: "eth_requestAccounts" });

      return signer;
    },
    refetchOnWindowFocus: false,
    retry: false,
  });

  return query;
};

export default Hero;
