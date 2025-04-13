import { addToast } from "@heroui/toast";
import { Alchemy, Network } from "alchemy-sdk";

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_SEPOLIA,
};

export const alchemy = new Alchemy(settings);

export const getNfts = async (
  contractAddress: any,
  accountAddress: any,
  filterOwned: boolean
) => {
  try {
    if (filterOwned) {
      if (!accountAddress) {
        console.error("No account address provided to getNFts function");
        throw new Error();
      }
      const response = await alchemy.nft.getNftsForOwner(accountAddress, {
        contractAddresses: [contractAddress],
      });
      return response.ownedNfts;
    } else {
      const response = await alchemy.nft.getNftsForContract(contractAddress);
      return response.nfts;
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch NFTs:", error);
      addToast({
        title: "Failed to fetch NFTs",
        description:
          error.message || "Make sure you're logged into your wallet",
        color: "danger",
        variant: "flat",
      });
    }
    return [];
  }
};

export const getOwnedNfts = async (
  contractAddress: any,
  accountAddress: string
) => {
  if (accountAddress) {
    try {
      const response = await alchemy.nft.getNftsForOwner(accountAddress, {
        contractAddresses: [contractAddress],
      });
      return response.ownedNfts;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to fetch owned NFTs:", error);
        addToast({
          title: "Failed to fetch owned NFTs",
          description: error.message,
          color: "danger",
          variant: "flat",
        });
      }
      return [];
    }
  }
  return [];
};
