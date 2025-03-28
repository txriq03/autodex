import { initialise } from "@/lib/web3/contractServices";
import { Button } from "@heroui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { LoaderCircle, PlugZap } from "lucide-react";
import { Spinner } from "@heroui/spinner";

const ConnectWalletButton = ({
  size = "md",
}: {
  size?: "md" | "sm" | "lg" | undefined;
}) => {
  const { account, setAccount, setProvider, setSigner, setContract } =
    useContext(ContractContext);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      throw new Error("MetaMask not detected");
    }

    // Check if a connection request is already in progress
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length === 0) {
      try {
        const connectedAccounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const connectedAccount = connectedAccounts[0];

        const result = await initialise();
        if (!result) throw new Error("Failed to initialise web3");

        return {
          account: connectedAccount,
          provider: result.provider,
          signer: result.signer,
          contract: result.contract,
        };
      } catch (error: any) {
        if (error.code === -32002) {
          // Custom message already handled by your toast
          throw new Error(
            "MetaMask is already processing a connection request. Please check your wallet."
          );
        }
        throw error;
      }
    } else {
      // Already connected
      const result = await initialise();
      if (!result) throw new Error("Failed to initialise web3");

      return {
        account: accounts[0],
        provider: result.provider,
        signer: result.signer,
        contract: result.contract,
      };
    }
  };

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: connectWallet,
    onSuccess: ({ account, provider, signer, contract }) => {
      setAccount(account);
      setProvider(provider);
      setSigner(signer);
      setContract(contract);
      toast.success("Wallet connected successfully.");
    },
    onError: (error: any) => {
      if (error.code === -32002) {
        toast.error("Failed to connect wallet", {
          description:
            "A connect request has already been sent. Check your wallet.",
        });
      } else {
        toast.error("Failed to connect wallet", {
          description: error.message,
        });
      }
    },
  });

  return (
    <div>
      <Button
        color="primary"
        variant="shadow"
        radius="sm"
        className={`${size === "lg" && "text-[1.1rem]"}`}
        size={size}
        isLoading={isPending}
        onPress={() => mutate()}
        startContent={!isPending && <PlugZap />}
      >
        {isPending ? "Connecting..." : "Connect Wallet"}
      </Button>

      {/* {isPending ? (
        <Button
          disabled
          className={`bg-slate-100 text-slate-800 hover:bg-slate-200 font-normal ${className}`}
        >
          <LoaderCircle className="animate-spin" /> Connecting...
        </Button>
      ) : (
        <Button
          className={`bg-slate-100 text-slate-800 hover:bg-slate-200 font-normal ${className}`}
          onPress={() => mutate()}
        >
          Connect Wallet
        </Button>
      )} */}
    </div>
  );
};

export default ConnectWalletButton;
