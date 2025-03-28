"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { fetchAllCars, purchaseCar } from "@/lib/web3/contractServices";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, Fuel, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { Contract, formatEther, formatUnits } from "ethers";
import VehicleCardMenu from "./VehicleCardMenu";
import { getNfts, getOwnedNfts } from "@/lib/web3/alchemy";
import { Image } from "@heroui/image";
import NextImage from "next/image";
import { Skeleton } from "@heroui/skeleton";

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

type CarWithMetadata = {
  car: Car;
  metadata: CarMetadata | null;
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
    queryKey: ["nftList"],
    queryFn: () =>
      getNfts(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS, account, filterOwned),
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
      toast.success("Success!", {
        description: "You have successfully minted your vehicle.",
      });
      router.replace(window.location.pathname); // Cleans up the URL to remove ?success=true
    }
  }, [success]);

  if (isNftPending) return <SkeletonCards />;

  if (nftList == undefined || nftList.length < 1)
    return (
      <div className="bg-slate-100 bg-opacity-[5%] text-slate-100 rounded-xl py-10 text-xl my-5 w-full flex justify-center items-center gap-2">
        <p>No cars have been minted.</p>
      </div>
    );

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
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
  return (
    <div className="">
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

              <VehicleCardMenu vin={metadata.attributes[3].value} />
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
              {price === "0.0" ? (
                <Button disabled radius="sm">
                  Unavailable
                </Button>
              ) : (
                <Button
                  variant="flat"
                  color="success"
                  onPress={() => purchaseCar(tokenId, price)}
                  radius="sm"
                >
                  Buy Car
                </Button>
              )}
              <div className="text-[1.4rem] font-bold text-slate-400 flex gap-2">
                {price}
                <p className="inline text-slate-500">ETH</p>
              </div>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <p>Failed to load metadata.</p>
      )}
    </div>
  );
};

export const useAllCars = () => {
  const { contract } = useContext(ContractContext); // or pass contract in manually

  return useQuery({
    queryKey: ["allCars"],
    queryFn: () => fetchAllCars(contract),
    enabled: !!contract, // only fetch once contract is ready
  });
};

export const useCarsWithMetadata = (
  filterOwned = false,
  account: any = null
) => {
  const { contract } = useContext(ContractContext);
  const { data: cars, ...rest } = useAllCars();

  return useQuery<CarWithMetadata[]>({
    queryKey: ["carsWithMetadata", cars, filterOwned, account],
    enabled: !!cars && !!contract,
    queryFn: async () => {
      if (!cars) return [];

      const results = await Promise.all(
        cars.map(async (car: Car) => {
          if (filterOwned && account) {
            const owner = await contract.ownerOf(car.tokenId);
            if (owner.toLowerCase() !== account?.toLowerCase()) return null;
          }

          try {
            const res = await fetch(car.tokenURI);
            const metadata = await res.json();
            return { car, metadata };
          } catch (err) {
            console.error("Failed to fetch tokenURI:", car.tokenURI, err);
            return { car, metadata: null };
          }
        })
      );

      return results.filter(Boolean); // Remove null entries if filtering
    },
  });
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
