import { ethers, BrowserProvider } from "ethers"

let provider: BrowserProvider;
let signer;
let contract;

// Initialise provider, signer and contract
const initialise = async () => {
    if (typeof window.ethereum !== "undefined") {
        provider = new BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
    } else {
        console.error("Please install MetaMask.");
    }
}
initialise();

// Get a single account
export const requestAccount = async () => {
    try {
        const accounts = await provider.send("eth_requestAccounts", []);
        return accounts[0];            
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error requesting account:", error.message);
        } else {
            console.error("Unknown error requesting account:", error);
        }
        return null;
    }
}

export const getProvider = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
        return new ethers.BrowserProvider(window.ethereum);
      } else {
        throw new Error("No Ethereum provider found");
      }
}