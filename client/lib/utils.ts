import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ethers } from "ethers"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const connectWallet = async () => {
  if (window.ethereum) {
    const provider = new ethers.BrowserProvider(window.ethereum);

    try {
      await provider.send("eth_requestAccounts", []); // Request wallet access
      const signer = await provider.getSigner(); // The signer is the currently connected account
      const userAddress = await signer.getAddress();
      console.log("User Address:", userAddress);
      return { provider, signer, userAddress};
    } catch (error) {
      console.error("User denied wallet access:", error);
      return null;
    }
  } else {
    console.error("No Ethereum provider found. Install MetaMask.");
    return null;
  }
}
