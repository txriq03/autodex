"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { fetchAllCars, purchaseCar } from "@/lib/web3/contractServices";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "./ui/button";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, Ellipsis, Fuel, LoaderCircle, SlidersHorizontal } from "lucide-react";
import { Contract, formatEther } from "ethers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuItem } from "./ui/dropdown-menu";
import VehicleCardMenu from "./VehicleCardMenu";

type CarMetadata = {
  name: string;
  description: string;
  image: string; 
  attributes: { trait: string; value: string | number }[];
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
  attributes: { trait: string; value: string | number }[],
  traitName: string
): string | number | undefined => {
  return attributes.find(attr => attr.trait.toLowerCase() === traitName.toLowerCase())?.value;
};

const VehicleGrid = ({filterOwned = false}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const { account } = useContext(ContractContext);
  const { data: carsWithMetadata, isPending, error } = useCarsWithMetadata(filterOwned, account);

  if (!isPending) {
    console.log("Cars:", carsWithMetadata);
  }

  // Load toast if submission is successful
  useEffect(() => {
    if (success) {
      toast.success("Success!", {
        description: "You have successfully minted your vehicle."
      })
      router.replace(window.location.pathname); // Cleans up the URL to remove ?success=true
    }
  }, [success])

  if (isPending) return (
    <div className="bg-slate-100 rounded-xl py-10 text-xl my-5 w-full flex justify-center items-center gap-2">
      <LoaderCircle className="animate-spin inline"/> <p className="inline">Loading...</p>
    </div>
  );
  if (error) return (
    <div className="bg-rose-200 text-rose-500 rounded-xl py-10 text-xl my-5 w-full flex justify-center items-center gap-2">
      <p className="inline">Error: </p> <p className="inline">{error.message}</p>
    </div>
  );
  if (carsWithMetadata == undefined || carsWithMetadata.length < 1) return (
    <div className="bg-slate-100 rounded-xl py-10 text-xl my-5 w-full flex justify-center items-center gap-2">
      <p>No cars have been minted.</p>
    </div>
  );

  return (
    <div className="my-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 my-4">
        {carsWithMetadata.map(({ car, metadata }, idx) => (
          <VehicleCard key={idx} car={car} metadata={metadata} />
        ))}
      </div>
    </div>
  );
};

const VehicleCard = ({ car, metadata}: any) => {
  return (
    <div className=" p-4 border-2 rounded-xl bg-slate-50">
          {metadata ? (
            <>
              <img
                src={metadata.image}
                alt={metadata.name}
                className="w-full h-48 object-cover rounded "
              />
              <div className="mt-1">

                <div className="flex justify-between items-center">
                  <div className=" text-lg">
                    <h2 className="inline text-slate-500">{getAttributeValue(metadata.attributes, "make")} </h2> <h2 className="inline">{getAttributeValue(metadata.attributes, "model")}</h2>
                  </div>

                  <VehicleCardMenu vin={metadata.attributes[3].value} />
                </div>

                <p className="text-sm text-gray-600">
                  {metadata.description || "No description"}
                </p>

                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex gap-2 items-center"> <Calendar size={22} className="text-slate-500"/> <p>{getAttributeValue(metadata.attributes, "year")}</p></div>
                  <div className="flex gap-2"> <Fuel className="text-slate-500"/> <p>{getAttributeValue(metadata.attributes, "fuel type")}</p></div>
                  <div className="flex gap-2"> <SlidersHorizontal className="text-slate-500"/> <p>{getAttributeValue(metadata.attributes, "transmission")}</p></div>
                </div>

                <div className="flex justify-between items-end mt-4 ">
                  {car.price === "0" ? (
                    <Button disabled className="bg-rose-100 text-rose-500">Sold</Button>
                  ) : (
                    <Button className="bg-teal-100 text-teal-500 hover:bg-teal-400 hover:text-slate-100" onClick={() => purchaseCar(car.tokenId, car.price)}>Buy Car</Button>
                  )}
                  <div className="text-[1.4rem] font-bold">{formatEther(car.price)} <p className="inline text-slate-400">ETH</p></div>
                </div>
              </div>
            </>
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

export const useCarsWithMetadata = (filterOwned = false, account: any = null) => {
  const { contract } = useContext(ContractContext)
  const { data: cars, ...rest } = useAllCars();

  return useQuery<CarWithMetadata[]>({
    queryKey: ['carsWithMetadata', cars, filterOwned, account],
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
    }
  });
}

export default VehicleGrid;
