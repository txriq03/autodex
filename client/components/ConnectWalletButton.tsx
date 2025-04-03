import { initialise } from "@/lib/web3/contractServices";
import { Button } from "@heroui/button";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { PlugZap, Wallet } from "lucide-react";
import { addToast } from "@heroui/toast";
import useMediaQuery from "@/hooks/useMediaQuery";

const ConnectWalletButton = ({
  size = "md",
  iconOnly = false,
}: {
  size?: "md" | "sm" | "lg" | undefined;
  iconOnly?: boolean;
}) => {
  const { account, setAccount, setProvider, setSigner, setContract } =
    useContext(ContractContext);
  const isNotMobile = useMediaQuery("(min-width: 640px)");

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
      addToast({
        title: "Wallet connected successfully",
        color: "success",
        variant: "flat",
      });
    },
    onError: (error: any) => {
      if (error.code === -32002) {
        addToast({
          title: "Failed to connect wallet",
          description:
            "A connection request has already been sent. Check your wallet!",
          color: "warning",
          variant: "flat",
        });
      } else {
        addToast({
          title: "Failed to connect to wallet",
          description: error.message,
          color: "danger",
          variant: "flat",
        });
      }
    },
  });

  return iconOnly ? (
    <Button
      isIconOnly={iconOnly}
      isLoading={isPending}
      color="primary"
      variant="shadow"
      onPress={() => mutate()}
    >
      <Wallet />
    </Button>
  ) : (
    <Button
      color="primary"
      variant={`${size === "md" ? "shadow" : "solid"}`}
      radius="sm"
      className={`${size === "lg" && "text-[1.1rem]"}`}
      size={size}
      isLoading={isPending}
      onPress={() => mutate()}
      fullWidth={!isNotMobile}
      startContent={!isPending && <PlugZap />}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </Button>
  );
};

export default ConnectWalletButton;
