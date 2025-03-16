import { ethers, BrowserProvider, Contract, parseUnits } from "ethers"
import abi from './CarMarketplace.json'
import { toast } from "sonner";

const CONTRACT_ADDRESS = '0x016026655C36F05E60df6c984FeE48685B0c3701'
const CONTRACT_ABI = abi.abi

// Initialise provider, signer and contract
export const initialise = async () => {
    if (typeof window.ethereum !== "undefined") {
        // provider = new BrowserProvider(window.ethereum);
        const provider = new BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
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
        tokenURI: car.tokenURI,
        price: car.price.toString()
    }));
  
    return cars;
  };

export const purchaseCar = async (tokenId: number, price: string) => {
  let contract: any = '';
  let signer: any = ''

  const results = await initialise();
  if (results) {
    contract = results.contract;
    signer = results.signer;
  }

  console.log("Signer in purchase function:", signer);
  const buyerAddress = await signer.getAddress();
    const priceInWei = parseUnits(price, 'wei');
  try {
    const tx = await contract.connect(signer).buyCar(tokenId, {
      value: priceInWei // price in wei (BigNumber or string)
    });

    toast("Processing transaction...", { description: "Please confirm in wallet." });

    await tx.wait();
    toast.success("Success!", {
      description: "You've successfully purchased the vehicle.",
    });

    // Optionally refetch or update UI
  } catch (error) {
    console.error("Purchase failed:", error);
    
    if (error instanceof Error) {
        toast.error("Failed to purchase car", {
          description: error.message || "Transaction was rejected or failed.",
        });
    } else {
        toast.error("Failed to purchase car", {
            description: "Transaction was rejected or failed.",
        });
    }
  }
};