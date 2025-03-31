"use client";
import { ReactNode } from "react";
import TanstackProvider from "./TanstackProvider";
import ContractProvider from "./ContractProvider";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ToastProvider } from "@heroui/toast";

const Provider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        toastProps={{
          classNames: {
            description: "overflow-hidden text-ellipsis",
          },
        }}
      />
      <TanstackProvider>
        <ContractProvider>{children}</ContractProvider>
      </TanstackProvider>
    </HeroUIProvider>
  );
};

export default Provider;
