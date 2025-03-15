"use client"
import { createContext, ReactNode,  useEffect,  useState } from "react"
import { initialise } from "@/lib/web3/contractServices";
import { ethers } from "ethers";

export const ContractContext = createContext<any>(null);

const ContractProvider = ({children}: {children: ReactNode}) => {
    const [account, setAccount] = useState<string | null>(null);
    const [signer, setSigner] = useState<any>(null);
    const [contract, setContract] = useState<any>(null);
    const [provider, setProvider] = useState<any>(null);

    useEffect(() => {
      // Get smart contract variables
      const init = async () => {
        const result = await initialise();
        if (result) {
          setProvider(result.provider);
          setSigner(result.signer);
          setContract(result.contract);
        }
      }
      init();

      if (typeof window.ethereum !== "undefined") {
        window.ethereum.on("accountsChanged", async (accounts: string[]) => {
          if (accounts.length > 0) {
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            const newSigner = await newProvider.getSigner();
            const address = await newSigner.getAddress();
            setProvider(newProvider);
            setSigner(newSigner);
            setAccount(address);
          } else {
            setProvider(null);
            setSigner(null);
            setAccount(null);
          }
        })
      }
      
      // Check if wallet is already connected on initial page load
      const checkIfWalletIsConnected = async () => {
        if (typeof window !== "undefined" && window.ethereum) {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        }
      };
      checkIfWalletIsConnected();
    }, []);
    
  return (
    <ContractContext.Provider value={{ account, setAccount, provider, signer, contract }}> 
        {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider