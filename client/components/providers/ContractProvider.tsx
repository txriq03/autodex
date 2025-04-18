"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { initialise } from "@/lib/web3/contractServices";
import { ethers } from "ethers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { addToast } from "@heroui/toast";

export const ContractContext = createContext<any>(null);

const ContractProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const queryClient = useQueryClient(); // Add this line

  useEffect(() => {
    const reconnectWallet = async () => {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          const account = accounts[0];

          const result = await initialise();
          if (result) {
            setAccount(account);
            setProvider(result.provider);
            setSigner(result.signer);
            setContract(result.contract);
          }
        }
      } catch (error) {
        console.error("Wallet auto-connect failed:", error);

        addToast({
          title: "Wallet auto-connect failed",
          description: error instanceof Error ? error.message : String(error),
          color: "danger",
          variant: "flat",
        });
      }
    };
    reconnectWallet();
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

        queryClient.invalidateQueries({ queryKey: ["nftList"] });
        addToast({
          title: "Wallet disconnected or locked.",
          color: "primary",
          variant: "flat",
        });
      }
    };

    if (window.ethereum?.on) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  return (
    <ContractContext.Provider
      value={{
        account,
        setAccount,
        setProvider,
        provider,
        setSigner,
        signer,
        setContract,
        contract,
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;
