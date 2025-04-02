import { BrowserProvider, Contract, parseEther } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { addToast } from "@heroui/toast";

// Initialise provider, signer and contract
export const initialise = async () => {
  if (typeof window.ethereum !== "undefined") {
    // provider = new BrowserProvider(window.ethereum);
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    const network = await provider.getNetwork();
    console.log("Network:", network);
    return { provider, signer, contract };
  } else {
    alert("Please install MetaMask!");
    console.error("Please install MetaMask.");
    return null;
  }
};
// initialise();
export const fetchCurrentAccount = async () => {
  const accounts = await window.ethereum.request({ method: "eth_accounts" });
  return accounts.length > 0 ? accounts[0] : null;
};

// Get a single account
export const requestAccount = async () => {
  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    return accounts[0];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error requesting account:", error.message);
    } else {
      console.error("Unknown error requesting account:", error);
    }
    return null;
  }
};

export const fetchAllCars = async (contract: Contract) => {
  if (!contract) return [];
  const rawCars = await contract.getAllCars();

  // Convert each car to a plain JSON-serializable object
  const cars = rawCars.map((car: any) => ({
    tokenId: Number(car.tokenId),
    tokenURI: car.tokenURI,
    price: car.price.toString(),
  }));

  return cars;
};

export const purchaseCar = async (tokenId: number, price: string) => {
  let contract: any = "";
  let signer: any = "";
  console.log(price);

  const results = await initialise();
  if (results) {
    contract = results.contract;
    signer = results.signer;
  }

  console.log("Signer in purchase function:", signer);
  const buyerAddress = await signer.getAddress();
  const priceInWei = parseEther(price);
  try {
    const tx = await contract.connect(signer).buyCar(tokenId, {
      value: priceInWei, // price in wei (BigNumber or string)
    });

    await tx.wait();
    addToast({
      title: "Success!",
      description: "You've successfully purchased the vehicle.",
      color: "success",
      variant: "flat",
    });

    // Optionally refetch or update UI
  } catch (error) {
    console.error("Purchase failed:", error);

    if (error instanceof Error) {
      if (error.message.includes("You cannot buy your own car.")) {
        addToast({
          title: "Failed to purchase vehicle",
          description: "You cannot buy your own vehicle.",
          color: "danger",
          variant: "flat",
        });
      } else {
        addToast({
          title: "Failed to purchase vehicle",
          description: error.message || "Transaction was rejected or failed.",
          color: "danger",
          variant: "flat",
        });
      }
    } else {
      addToast({
        title: "Failed to purchase vehicle",
        description: "Transaction was rejected or failed.",
        color: "danger",
        variant: "flat",
      });
    }
  }
};

export const getCarMetadataByVIN = async (
  contract: Contract,
  vin: string | string[] | undefined
) => {
  try {
    const tokenId = await contract.getTokenIdByVIN(vin);
    const carDetails = await contract.getCarDetails(tokenId);
    const tokenURI = carDetails.tokenURI;
    const price = carDetails.price;

    const response = await fetch(tokenURI);
    const metadata = await response.json();

    return {
      tokenId: Number(tokenId),
      metadata,
      price,
    };
  } catch (error) {
    console.error("Error fetching car metadata by VIN:", error);
    return null;
  }
};

export const getOwnershipHistory = async (contract: any, tokenId: number) => {
  try {
    const history = await contract.getOwnershipHistory(tokenId);

    // Format ownership history
    return history.map((record: any) => ({
      owner: record.owner,
      timestamp: new Date(Number(record.timestamp) * 1000).toLocaleString(),
    }));
  } catch (error) {
    console.error("Failed to fetch ownership history:", error);
    addToast({
      title: "Failed to fetch ownership history",
      description: error instanceof Error ? error.message : String(error),
      color: "danger",
    });
    return [];
  }
};
