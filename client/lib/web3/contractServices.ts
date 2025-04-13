import {
  BrowserProvider,
  Contract,
  JsonRpcProvider,
  parseEther,
  toBigInt,
} from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";
import { addToast } from "@heroui/toast";

// Initialise provider, signer and contract
const getProvider = () => {
  if (typeof window !== "undefined" && window.ethereum) {
    return new BrowserProvider(window.ethereum);
  } else {
    return new JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API}`
    );
  }
};

// Initialise provider, signer and contract
export const initialise = async () => {
  try {
    const provider = getProvider();
    let signer;
    let contract;

    if (provider instanceof BrowserProvider) {
      signer = await provider.getSigner();
      contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    } else {
      contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    }

    const network = await provider.getNetwork();
    console.log("Network:", network);

    return { provider, signer, contract };
  } catch (error) {
    console.error("Error initialising:", error);
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
  console.log("Price:", price);
  console.log("TokenId:", toBigInt(tokenId));

  const results = await initialise();
  if (results) {
    contract = results.contract;
    signer = results.signer;
  }

  console.log("Signer in purchase function:", signer);
  const buyerAddress = await signer.getAddress();
  const priceInWei = parseEther(price); // price in wei (BigNumber or string)
  try {
    const tx = await contract.connect(signer).buyCar(toBigInt(tokenId), {
      value: priceInWei,
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
    const errorData = (error as any).data;
    if (errorData) {
      try {
        const decoded = contract.interface.parseError(errorData);
        console.error("Custom error:", decoded.name, decoded.args);
      } catch {
        console.error("Could not decode error");
      }
    }
    console.error("Purchase failed:", error);

    if (error instanceof Error) {
      if (error.message.includes("You cannot buy your own car.")) {
        addToast({
          title: "Failed to purchase vehicle",
          description: "You cannot buy your own vehicle.",
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
  if (!contract) {
    console.warn("Failed to fetch ownership history. Contract is null.");
    return [];
  }
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
