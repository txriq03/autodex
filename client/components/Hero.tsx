"use client";
import { Button } from "@heroui/button";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import Link from "next/link";
import ConnectWalletButton from "./ConnectWalletButton";
import ShinyText from "./ui/ShinyText/ShinyText";
import useMediaQuery from "@/hooks/useMediaQuery";
import { AuroraText } from "@/components/magicui/aurora-text";

const Hero = () => {
  const { account } = useContext(ContractContext);

  const { data: signer, isPending, refetch, error } = useWalletSigner();
  const isMobile = useMediaQuery("(min-width: 480px)");
  const isNotMobile = useMediaQuery("(min-width: 640px)");

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
    <div className=" min-[1445px]:border-1 border-neutral-800 mt-0 mx-0 min-[1440px]:max-w-[1440px] min-[1440px]:rounded-xl min-[1450px]:mx-auto min-[1440px]:mt-[10px] bg-slate-100 bg-opacity-[5%] mb-10 p-5 xs:p-10 relative overflow-hidden">
      <h1 className="text-[2.2rem]/[45px] text-slate-200 text-center sm:text-left sm:text-[3.5rem]/[65px] md:text-[4rem]/[75px] max-w-[700px] font-bold mb-4 ">
        Trade with trust. Own with{" "}
        <AuroraText
          colors={[
            "oklch(69.6% 0.17 162.48)",
            "oklch(70.4% 0.14 182.503)",
            "oklch(71.5% 0.143 215.221)",
          ]}
        >
          Confidence.
        </AuroraText>
      </h1>
      {/* <ShinyText
        text="List your ride. Keep your privacy."
        className="text-[2.2rem]/[45px] text-center sm:text-left sm:text-[3.5rem]/[65px] md:text-[4rem]/[75px] max-w-[700px]  font-bold mb-4"
        speed={5}
      /> */}
      {isMobile ? (
        <p className="text-[1rem] text-center sm:text-left md:text-[1.3rem] text-slate-400 max-w-[700px] font-light mb-5 ">
          AutoDex is a decentralised platform for listing and discovering your
          favourite rides. Powered by blockchain, secured by your wallet - no
          accounts, no hassle.
        </p>
      ) : (
        <p className="text-[1rem] text-center text-slate-400 font-light mb-5">
          AutoDex is a decentralised platform for listing and discovering your
          next ride.
        </p>
      )}
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
          <div className=" gap-2 my-5">
            <Link href="/sell">
              <Button
                variant="ghost"
                size="lg"
                radius="sm"
                className="text-lg bg-white/5 border-1"
                fullWidth={!isNotMobile}
              >
                <ShinyText text="Mint your vehicle" />
              </Button>
            </Link>
          </div>
          <div className=" mt-5">
            <p className="inline text-slate-400">Account: </p>{" "}
            <p className="inline text-teal-400">{account}</p>
          </div>
        </>
      ) : (
        <ConnectWalletButton size="lg" />
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
