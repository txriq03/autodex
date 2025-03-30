"use client";
import { ReactNode } from "react";
import TanstackProvider from "./TanstackProvider";
import ContractProvider from "./ContractProvider";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

const Provider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  return (
    <HeroUIProvider navigate={router.push}>
      <TanstackProvider>
        <ContractProvider>{children}</ContractProvider>
      </TanstackProvider>
    </HeroUIProvider>
  );
};

export default Provider;
