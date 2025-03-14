import { ethers, BrowserProvider, Contract } from "ethers"
import abi from './CarMarketplace.json'

let provider: any;
let signer;
let contract;
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
const CONTRACT_ABI = abi.abi

// Initialise provider, signer and contract
export const initialise = async () => {
    if (typeof window.ethereum !== "undefined") {
        // provider = new BrowserProvider(window.ethereum);
        provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        signer = await provider.getSigner();
        contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        const network  = await provider.getNetwork()
        console.log('Network:', network)
        return { provider, signer, contract }
    } else {
        alert("Please install MetaMask!");
        console.error("Please install MetaMask.");
        return null;
    }
}
// initialise();
export const fetchCurrentAccount = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    return accounts.length > 0 ? accounts[0] : null;
  };

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


export const fetchAllCars = async (contract: Contract) => {
    if (!contract) return []
    const rawCars = await contract.getAllCars();

    // Convert each car to a plain JSON-serializable object
    const cars = rawCars.map((car: any) => ({
        tokenId: Number(car.tokenId),
        owner: car.owner,
        tokenURI: car.tokenURI,
        price: Number(car.price)
    }));
  
    return cars;
  };