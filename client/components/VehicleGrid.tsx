"use client";
import React, { useContext, useEffect } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { purchaseCar } from "@/lib/web3/contractServices";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Calendar, Fuel, SlidersHorizontal } from "lucide-react";
import { formatUnits } from "ethers";
import VehicleCardMenu from "./VehicleCardMenu";
import { getNfts } from "@/lib/web3/alchemy";
import { Image } from "@heroui/image";
import { Skeleton } from "@heroui/skeleton";
import { useDisclosure } from "@heroui/modal";
import ListForSaleModal from "./ListForSaleModal";
import { addToast } from "@heroui/toast";
import OwnershipHistoryModal from "./OwnershipHistoryModal";
import { CONTRACT_ADDRESS } from "@/lib/constants";
import { Alert } from "@heroui/alert";

type CarMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string | number }[];
};

type Car = {
  tokenId: number;
  owner: string;
  price: number;
  tokenURI: string;
};

const getAttributeValue = (
  attributes: { trait_type: string; value: string | number }[],
  traitName: string
): string | number | undefined => {
  return attributes.find(
    (attr) =>
      typeof attr.trait_type === "string" &&
      attr.trait_type.toLowerCase() === traitName.toLowerCase()
  )?.value;
};

const VehicleGrid = ({ filterOwned = false }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const { account, contract } = useContext(ContractContext);

  const { data: nftList, isPending: isNftPending } = useQuery({
    queryKey: ["nftList", account, filterOwned],
    queryFn: () => getNfts(CONTRACT_ADDRESS, account, filterOwned),
  });
  if (nftList) {
    console.log("nftList:", nftList);
  }

  const { data: prices, isPending: isPricePending } = useQuery({
    queryKey: ["allPrices", nftList],
    queryFn: async () => {
      if (!nftList) return [];
      return await Promise.all(
        nftList.map(async (nft) => {
          const price = await contract.getPrice(nft.tokenId);
          return formatUnits(price, "ether");
        })
      );
    },
    enabled: !!nftList && nftList.length > 0,
  });
  if (prices) {
    console.log("Prices:", prices);
  }

  // Load toast if submission is successful
  useEffect(() => {
    if (success) {
      addToast({
        title: "Success!",
        description: "You have successfully minted your vehicle.",
        color: "success",
        variant: "flat",
      });
      router.replace(window.location.pathname); // Cleans up the URL to remove ?success=true
    }
  }, [success]);

  if (isNftPending) return <SkeletonCards />;

  if (nftList == undefined || nftList.length < 1)
    return filterOwned ? (
      <Alert
        title="You have not minted any vehicles."
        description="Vehicles that you have minted will show up in this tab."
        variant="faded"
        color="default"
      />
    ) : (
      <Alert
        title="No cars have been minted"
        description="No Vehicles are on the marketplace."
        variant="faded"
        color="default"
      />
    );

  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nftList.map(({ tokenId, name, raw, image }, idx) => (
          <VehicleCard
            key={idx}
            tokenId={tokenId}
            price={prices?.[idx]}
            name={name}
            imageUrl={image.cachedUrl}
            metadata={raw.metadata}
          />
        ))}
      </div>
    </div>
  );
};

const VehicleCard = ({
  tokenId,
  price,
  name,
  imageUrl,
  metadata,
}: {
  tokenId: any;
  price: any;
  name: string | undefined;
  imageUrl: string | undefined;
  metadata: any;
}) => {
  const {
    isOpen: isListForSaleOpen,
    onOpen: onListForSaleOpen,
    onOpenChange: onListForSaleOpenChange,
  } = useDisclosure();
  const {
    isOpen: isHistoryOpen,
    onOpen: onHistoryOpen,
    onOpenChange: onHistoryOpenChange,
  } = useDisclosure();

  const { mutate, isPending } = useMutation({
    mutationFn: () => purchaseCar(tokenId, price),
  });

  return (
    <div>
      {metadata ? (
        <Card>
          <CardBody>
            <Image
              src={imageUrl}
              alt={name}
              className="object-cover"
              height={200}
              width="100%"
              classNames={{
                wrapper: "min-w-full h-full",
              }}
            />
            <div className="flex justify-between items-center mt-2">
              <div className=" text-[1.2rem]">
                <h2 className="inline text-slate-500">
                  {getAttributeValue(metadata.attributes, "make")}{" "}
                </h2>{" "}
                <h2 className="inline">
                  {getAttributeValue(metadata.attributes, "model")}
                </h2>
              </div>

              {/* Drop down menu and price modal */}
              <VehicleCardMenu
                vin={metadata.attributes[3].value}
                onListForSaleOpen={onListForSaleOpen}
                onHistoryOpen={onHistoryOpen}
              />
              <ListForSaleModal
                isOpen={isListForSaleOpen}
                onOpenChange={onListForSaleOpenChange}
                tokenId={tokenId}
              />
              <OwnershipHistoryModal
                isOpen={isHistoryOpen}
                onOpenChange={onHistoryOpenChange}
                tokenId={tokenId}
              />
            </div>

            <p className="text-sm text-gray-600">
              {metadata.description || "No description"}
            </p>

            <div className="mt-2 flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                {" "}
                <Calendar size={22} className="text-slate-500" />{" "}
                <p>{getAttributeValue(metadata.attributes, "year")}</p>
              </div>
              <div className="flex gap-2">
                {" "}
                <Fuel className="text-slate-500" />{" "}
                <p>{getAttributeValue(metadata.attributes, "fuel type")}</p>
              </div>
              <div className="flex gap-2">
                {" "}
                <SlidersHorizontal className="text-slate-500" />{" "}
                <p>{getAttributeValue(metadata.attributes, "transmission")}</p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <div className="flex justify-between items-end mt-4 w-full ">
              {Number(price) > 0 ? (
                <>
                  <Button
                    variant="solid"
                    color="success"
                    onPress={() => mutate()}
                    radius="sm"
                    isLoading={isPending}
                  >
                    {isPending ? "Purchasing..." : "Buy Car"}
                  </Button>
                  <div className="text-[1.4rem] font-bold text-slate-400 flex gap-2">
                    {price}
                    <p className="inline text-slate-500">ETH</p>
                  </div>
                </>
              ) : (
                <>
                  <Button disabled radius="sm">
                    Unavailable
                  </Button>
                  <div className="text-[1.4rem] font-bold text-slate-400 flex gap-2">
                    <p className="inline text-slate-500">N/A</p>
                  </div>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <p>Failed to load metadata.</p>
      )}
    </div>
  );
};

const SkeletonCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
      <Card className="p-3" radius="lg">
        <Skeleton className="rounded-xl">
          <div className="h-[200px] rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-full mt-5 w-3/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-4/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-2/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg mt-5 w-[90px]">
          <div className="h-10" />
        </Skeleton>
      </Card>

      <Card className="p-3 hidden md:block" radius="lg">
        <Skeleton className="rounded-xl">
          <div className="h-[200px] rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-full mt-5 w-3/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-4/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-2/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg mt-5 w-[90px]">
          <div className="h-10" />
        </Skeleton>
      </Card>

      <Card className="p-3 hidden lg:block" radius="lg">
        <Skeleton className="rounded-xl">
          <div className="h-[200px] rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-full mt-5 w-3/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-4/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-2/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg mt-5 w-[90px]">
          <div className="h-10" />
        </Skeleton>
      </Card>

      <Card className="p-3 hidden xl:block" radius="lg">
        <Skeleton className="rounded-xl">
          <div className="h-[200px] rounded-lg bg-default-300" />
        </Skeleton>
        <Skeleton className="rounded-full mt-5 w-3/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-4/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-full mt-2 w-2/5">
          <div className="h-5 rounded-full bg-default-200" />
        </Skeleton>
        <Skeleton className="rounded-lg mt-5 w-[90px]">
          <div className="h-10" />
        </Skeleton>
      </Card>
    </div>
  );
};
export default VehicleGrid;
