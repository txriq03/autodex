"use client"
import { createContext, ReactNode,  useEffect,  useState } from "react"

export const ContractContext = createContext<any>(null);

const ContractProvider = ({children}: {children: ReactNode}) => {
    const [account, setAccount] = useState(null);

    // Check if wallet is already connected on initial page load
    useEffect(() => {
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
    <ContractContext.Provider value={{ account, setAccount }}> 
        {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider