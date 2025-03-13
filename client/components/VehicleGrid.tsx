'use client'
import React, { useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { fetchAllCars } from "@/lib/web3/contractServices";
import { useQuery } from "@tanstack/react-query";

const VehicleGrid = () => {
  const { data: cars, isPending, error } = useAllCars();
  console.log("Cars:", cars);

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>Error fetching cars: {error.message}</p>
  return (
  <div>
    <h1 className="text-[2rem] font-semibold">For Saler</h1>
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
