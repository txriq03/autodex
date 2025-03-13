import { ethers, BrowserProvider, Contract } from "ethers"
import abi from './CarMarketplace.json'

let provider: BrowserProvider;
let signer;
let contract;
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const CONTRACT_ABI = abi.abi

// Initialise provider, signer and contract
export const initialise = async () => {
    if (typeof window.ethereum !== "undefined") {
        provider = new BrowserProvider(window.ethereum);
        signer = await provider.getSigner();
        contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        return { provider, signer, contract }
    } else {
        alert("Please install MetaMask!");
        console.error("Please install MetaMask.");
        return null;
    }
}
// initialise();

// Get a single account
export const requestAccount = async () => {
    try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
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