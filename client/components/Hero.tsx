'use client'
import { Button } from './ui/button'
import Image from 'next/image'
import { initialise, requestAccount } from '@/lib/web3/contractServices'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect, useState, useContext} from 'react'
import { ContractContext } from './providers/ContractProvider'
import Link from 'next/link'
import { toast } from 'sonner'

const Hero = () => {
  const { account, setAccount, provider }= useContext(ContractContext);

  // const { data, refetch, isPending, isError, error } = useQuery({
  //   queryKey: ['connectWallet'],
  //   queryFn: requestAccount,
    
  // })
  // console.log(data);  

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


  const handleConnect = () => {
    refetch();
  }

  return (
    <div className='mt-0 mx-0 min-[1440px]:max-w-[1440px] min-[1440px]:rounded-xl min-[1450px]:mx-auto min-[1440px]:mt-[10px] bg-slate-800 mb-10 min-[1440px]:bg-gradient-to-r from-slate-900 to-slate-700 p-10 relative overflow-hidden'>
        <h1 className='text-[2rem] sm:text-[3rem] md:text-[4rem] max-w-[700px] text-white font-bold mb-4'>
            List Your Ride. Keep Your Privacy.
        </h1>
        <p className='text-[1.2rem] md:text-[1.5rem] text-white opacity-70 max-w-[700px] font-light'>
            AutoDex is a decentralised platform for listing and discovering your favourite rides.
            Powered by blockchain, secured by your wallet - no accounts, no hassle.
        </p>
        <Image src="/hero.png" alt="Hero" width={1712} height={948} className='absolute w-[600px] top-[50%] translate-y-[-50%] right-[5%] hidden min-[1440px]:block'/>
        <Image src="/sideview.png" alt="Hero" width={2000} height={642} className='absolute h-[300px] w-auto top-[50%] translate-y-[-50%] hidden lg:block left-[80%] xl:left-[70%]  min-[1440px]:hidden'/>

        {/* Show connect button if no account found, otherwise show buy and sell buttons */}
        {account ? (
          <>
          <div className='flex gap-2 my-5'>
            <Button className='w-[100px] py-[25px] text-xl bg-white text-black hover:bg-slate-200 '>Buy</Button>
            <Link href="/sell">
              <Button className='w-[100px] py-[25px] text-xl bg-transparent text-white' variant="outline">Sell</Button>
            </Link>
          </div>
          <div className=' mt-5'>
            <p className='inline text-slate-400'>Account: </p> <p className='inline text-teal-400'>{account}</p>
          </div>
          </>
        ) : (
          <ConnectWalletButton />
        )}

    </div>
  )
}

export const useWalletSigner = () => {
  const { provider, account, setAccount } = useContext(ContractContext);
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

  // 🔄 Auto-refetch signer when account changes
  useEffect(() => {
    const handler = () => {
      query.refetch(); // 🔁 Refresh signer on account change
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handler);
    }

    return () => {
      window.ethereum?.removeListener("accountsChanged", handler);
    };
  }, [query]);

  return query;
};

const ConnectWalletButton = () => {
  const {
    account,
    setAccount,
    setProvider,
    setSigner,
    setContract,
  } = useContext(ContractContext);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask not detected");
    }

    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    const connectedAccount = accounts[0];

    const result = await initialise();
    if (!result) throw new Error("Failed to initialise web3");

    return {
      account: connectedAccount,
      provider: result.provider,
      signer: result.signer,
      contract: result.contract,
    };
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: connectWallet,
    onSuccess: ({ account, provider, signer, contract }) => {
      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    },
    onError: (error: any) => {
      if (error.code === -32002) {
        toast.error("Failed to connect wallet", {
          description: "A connect request has already been sent. Check your wallet."
        })
      } else {
        toast.error("Failed to connect wallet", {
          description: error.message
        })
      }
    }
  });

  return (
    <div>
      <Button onClick={() => mutate()} disabled={isPending}>
        {isPending ? "Connecting..." : account ? `Connected: ${account}` : "Connect Wallet"}
      </Button>
    </div>
  );
}


export default Hero;