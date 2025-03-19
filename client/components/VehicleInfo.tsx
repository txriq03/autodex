"use client";

import { getCarMetadataByVIN } from "@/lib/web3/contractServices";
import { ContractContext } from "@/components/providers/ContractProvider";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const VehicleInfo = () => {
  const { contract } = useContext(ContractContext);
  const { vin } = useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["carMetadata", vin],
    enabled: !!contract && !!vin,
    queryFn: () => getCarMetadataByVIN(contract, vin),
  });

  if (isPending) return <p>Loading metadata...</p>;
  if (error || !data) return <p>Error loading metadata.</p>;

  const { tokenId, metadata } = data;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-xl font-semibold mb-2">{metadata.name}</h1>
      <img src={metadata.image} alt="Car" className="rounded mb-4" />
      <ul>
        {metadata.attributes.map((attr: any, i: number) => (
          <li key={i}>
            <strong>{attr.trait}:</strong> {attr.value}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-sm text-gray-500">Token ID: {tokenId}</p>
    </div>
  );
};

export default VehicleInfo;
