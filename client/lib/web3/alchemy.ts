import { Alchemy, Network } from "alchemy-sdk";
import { toast } from "sonner";

const settings = {
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY, // or ALCH_API_KEY
  network: Network.ETH_SEPOLIA, // Or Network.ETH_MAINNET, etc.
};

export const alchemy = new Alchemy(settings);

export const getAllNftsFromContract = async (contractAddress: any) => {
  try {
    const response = await alchemy.nft.getNftsForContract(contractAddress);
    return response.nfts; // array of NFTs with metadata
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch NFTs:", error);
      toast.error("Failed to fetch NFTS", {
        description: error.message,
      });
    }
    return [];
  }
};

export const getAllNftsFromOwner = async (
  contractAddress: string,
  accountAddress: string
) => {
  try {
    const response = await alchemy.nft.getNftsForOwner(accountAddress, {
      contractAddresses: [contractAddress],
    });
    return response.ownedNfts;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Failed to fetch owned NFTs:", error);
      toast.error("Failed to fetch owned NFTs", {
        description: error.message,
      });
    }
    return [];
  }
};
