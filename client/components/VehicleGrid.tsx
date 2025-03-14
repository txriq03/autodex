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

const VehicleGrid = () => {
  const [carsWithMetadata, setCarsWithMetadata] = useState<CarWithMetadata[]>(
    []
  );
  const { data: cars, isPending, error } = useAllCars();
  console.log("Cars:", cars);

  const getAttributeValue = (
    attributes: { trait: string; value: string | number }[],
    traitName: string
  ): string | number | undefined => {
    return attributes.find(attr => attr.trait.toLowerCase() === traitName.toLowerCase())?.value;
  };

  useEffect(() => {
    if (!cars || cars.length === 0) return;
    const fetchMetadata = async () => {
      const results = await Promise.all(
        cars.map(async (car: any) => {
          try {
            const res = await fetch(car.tokenURI); // tokenURI
            const metadata = await res.json();
            return { car, metadata };
          } catch (err) {
            console.error("Failed to fetch tokenURI:", car.tokenURI, err);
            return { car, metadata: null };
          }
        })
      );
      setCarsWithMetadata(results);
    };

    fetchMetadata();
  }, [cars]);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error fetching cars: {error.message}</p>;

  return (
    <>
    <h1 className="text-[1.4rem] mt-4">Vehicles Minted</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
      {carsWithMetadata.map(({ car, metadata }, idx) => (
        <div key={idx} className="p-4 border rounded shadow">
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

              {/* ✅ Use original car fields */}
              {/* <div className="mt-2 text-sm">
              {metadata.attributes.map((attr, index) => (
                <>
                  <p>
                    <strong>Mileage:</strong> {attr.find(v => v.trait.toLowerCase() === 'make')?.value} km
                  </p>
                  <p>
                    <strong>VIN:</strong> {car.vin}
                  </p>
                  <p>
                    <strong>Year:</strong> {car.year}
                  </p>
                  <div>
                    <strong>Status:</strong> <p className={`inline ${car.forSale ? 'text-teal-500' : 'text-rose-500'}`}>{car.forSale ? "Available" : "Sold"}</p>
                  </div>
                </>
                
              ))}
              </div> */}
              <div className="flex justify-between items-end mt-4 ">
                <Button>Purchase</Button> 
                <div className="text-[1.4rem] font-bold">{car.price} <p className="inline text-slate-400">ETH</p></div>
              </div>
            </>
          ) : (
            <p>Failed to load metadata.</p>
          )}
        </div>
      ))}
    </div>
    </>
  );
};

const VehicleCard = ({ car, index }: any) => {
  return (
    <div className="border p-4 rounded-xl shadow">
      <Image
        src={car.image}
        alt={car.model}
        height={400}
        width={400}
        className="w-full h-48 object-cover rounded-md mb-2"
      />
      <h2 className="text-xl font-bold">
        {car.make.charAt(0).toUpperCase() + car.make.slice(1)}{" "}
        {car.model.charAt(0).toUpperCase() + car.model.slice(1)}
      </h2>
      <p>
        <strong>Year:</strong> {car.year}
      </p>
      <p>
        <strong>Mileage:</strong> {car.mileage} km
      </p>
      <p>
        <strong>VIN:</strong> {car.vin}
      </p>
      <div>
        <strong>Status:</strong>{" "}
        <p
          className={`inline ${
            car.forSale ? "text-teal-500" : "text-rose-500"
          }`}
        >
          {car.forSale ? "Available" : "Sold"}
        </p>
      </div>
      <div className="flex justify-between mt-4 items-end">
        <Button>Purchase</Button>
        <div className="text-[1.5rem] font-bold">
          {car.price} <p className="text-slate-400 inline">ETH</p>
        </div>
      </div>
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

export default VehicleGrid;
