'use client'
import React, { useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { fetchAllCars } from "@/lib/web3/contractServices";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { Button } from "./ui/button";

const VehicleGrid = () => {
  const { data: cars, isPending, error } = useAllCars();
  console.log("Cars:", cars);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error fetching cars: {error.message}</p>
  return (
    <div className="py-5">
        <h1 className="text-[2rem] ">Vehicles minted</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {cars?.map((car: any, index: number) => (
                <VehicleCard key={index} car={car}  />
            ))}
        </div>
    </div>
  );
};

const VehicleCard = ({ car, index}: any) => {
    return (
        <div className="border p-4 rounded-xl shadow">
            <Image src={car.image} alt={car.model} height={400} width={400} className="w-full h-48 object-cover rounded-md mb-2"/>
            <h2 className="text-xl font-bold">{car.make.charAt(0).toUpperCase() + car.make.slice(1)} {car.model.charAt(0).toUpperCase() + car.model.slice(1)}</h2>
            <p><strong>Year:</strong> {car.year}</p>
            <p><strong>Mileage:</strong> {car.mileage} km</p>
            <p><strong>VIN:</strong> {car.vin}</p>
            <div><strong>Status:</strong> <p className={`inline ${car.forSale ? 'text-teal-500' : 'text-rose-500'}`}>{car.forSale ? "Available" : "Sold"}</p></div>
            <div className="flex justify-between mt-4 items-end">
                <Button>Purchase</Button>
                <div className="text-[1.5rem] font-bold">{car.price} <p className="text-slate-400 inline">ETH</p></div>
            </div>
        </div>
    )
}

export const useAllCars = () => {
  const { contract } = useContext(ContractContext); // or pass contract in manually

  return useQuery({
    queryKey: ["allCars"],
    queryFn: () => fetchAllCars(contract),
    enabled: !!contract, // only fetch once contract is ready
  });
};

export default VehicleGrid;
