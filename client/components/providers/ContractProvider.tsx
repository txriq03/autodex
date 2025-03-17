"use client"
import { createContext, ReactNode,  useEffect,  useState } from "react"
import { initialise } from "@/lib/web3/contractServices";
import { ethers } from "ethers";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const ContractContext = createContext<any>(null);

const ContractProvider = ({children}: {children: ReactNode}) => {
    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<any>(null);
    const [contract, setContract] = useState<any>(null);
    const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length > 0) {
        const result = await initialise();
        if (result) {
          setProvider(result.provider);
          setSigner(result.signer);
          setContract(result.contract);
          setAccount(accounts[0]);
        }
      } else {
        // Wallet disconnected or locked
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setContract(null);
        toast.info("Wallet disconnected or locked.");
      }
    };
  
    if (window.ethereum?.on) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }
  
    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);
    
  return (
    <ContractContext.Provider value={{ account, setAccount, setProvider, provider, setSigner, signer, setContract, contract }}> 
        {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider