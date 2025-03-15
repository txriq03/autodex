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
import { LoaderCircle } from "lucide-react";
import { Contract, formatEther } from "ethers";

type CarMetadata = {
  name: string;
  description: string;
  image: string; // this is the real car image now
  attributes: { trait: string; value: string | number }[];
};

type Car = {
  tokenId: number;
  owner: string;
  price: number;
  tokenURI: string; // This is the tokenURI
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

const VehicleGrid = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const { data: carsWithMetadata, isPending, error } = useCarsWithMetadata();

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

  return (
    <div className="my-4">
      <h1 className="text-[1.4rem]">Vehicles Minted</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
        {carsWithMetadata.map(({ car, metadata }, idx) => (
          <VehicleCard key={idx} car={car} metadata={metadata} />
        ))}
      </div>
    </div>
  );
};

const VehicleCard = ({ car, metadata}: any) => {
  const { contract, signer } = useContext(ContractContext);
  return (
    <div className="p-4 border rounded shadow">
          {metadata ? (
            <>
              <img
                src={metadata.image}
                alt={metadata.name}
                className="w-full h-48 object-cover rounded"
              />
              <div className=" text-lg mt-2">
                <h2 className="inline text-slate-500">{getAttributeValue(metadata.attributes, "make")} </h2> <h2 className="inline">{getAttributeValue(metadata.attributes, "model")}</h2>
              </div>
              <p className="text-sm text-gray-600">
                {metadata.description || "No description"}
              </p>

              <p><strong>Year: </strong> {getAttributeValue(metadata.attributes, "year")}</p>
              <p><strong>Fuel: </strong> {getAttributeValue(metadata.attributes, "fuel type")}</p>
              <p><strong>Transmission: </strong> {getAttributeValue(metadata.attributes, "transmission")}</p>

              <div className="flex justify-between items-end mt-4 ">
                {car.price === 0 ? (
                  <Button disabled className="bg-rose-100 text-rose-500">Sold</Button>
                ) : (
                  <Button className="bg-teal-100 text-teal-500 hover:bg-teal-400 hover:text-slate-100" onClick={() => purchaseCar(car.tokenId, car.price, contract, signer)}>Available</Button>
                )}
                <div className="text-[1.4rem] font-bold">{formatEther(car.price.toString())} <p className="inline text-slate-400">ETH</p></div>
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

export const useCarsWithMetadata = () => {
  const { data: cars, ...rest } = useAllCars();

  return useQuery<CarWithMetadata[]>({
    queryKey: ['carsWithMetadata', cars],
    enabled: !!cars,
    queryFn: async () => {
      if (!cars) return [];

      const results = await Promise.all(
        cars.map(async (car: Car) => {
          try {
            const res = await fetch(car.tokenURI);
            const metadata = await res.json();
            return { car, metadata };
          } catch (err) {
            console.error("Failed to fetch tokenURI:", car.tokenURI, err);
            return { car, metadata: null };
          }
        })
      )
      return results;
    }
  })
}

export default VehicleGrid;
