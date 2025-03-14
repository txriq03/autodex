"use client";
import React, { useContext, useEffect, useState } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { fetchAllCars } from "@/lib/web3/contractServices";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "./ui/button";

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

  const { data: carsWithMetadata, isPending, error } = useCarsWithMetadata();

  if (!isPending) {
    console.log("Cars:", carsWithMetadata);
  }



  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error fetching cars: {error.message}</p>;

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
  return (
    <div className="p-4 border rounded shadow">
          {metadata ? (
            <>
              <img
                src={metadata.image}
                alt={metadata.name}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="font-bold text-lg mt-2">{metadata.name}</h2>
              <p className="text-sm text-gray-600">
                {metadata.description || "No description"}
              </p>

              <p><strong>Year: </strong> {getAttributeValue(metadata.attributes, "year")}</p>
              <p><strong>Fuel: </strong> {getAttributeValue(metadata.attributes, "fuel type")}</p>
              <p><strong>Transmission: </strong> {getAttributeValue(metadata.attributes, "transmission")}</p>
              <div><strong>Status: </strong> <p className={`inline ${car.price === 0 ? 'text-rose-500' : 'text-teal-500'}`}>{car.price === 0 ? 'Sold' : 'Available'}</p></div>

              <div className="flex justify-between items-end mt-4 ">
                <Button>Purchase</Button> 
                <div className="text-[1.4rem] font-bold">{car.price} <p className="inline text-slate-400">ETH</p></div>
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
