"use client";

import { getCarMetadataByVIN } from "@/lib/web3/contractServices";
import { ContractContext } from "@/components/providers/ContractProvider";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const VehicleInfo = () => {
  const { contract } = useContext(ContractContext);
  const { vin } = useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["carMetadata", vin],
    enabled: !!contract && !!vin,
    queryFn: () => getCarMetadataByVIN(contract, vin),
  });

  if (isPending) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full rounded-md mb-4" />
          <div className="grid grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="max-w-2xl mx-auto mt-6 px-4 sm:px-6">
        <CardHeader>
          <Skeleton className="h-6 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-56 sm:h-64 w-full rounded-md mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="max-w-2xl mx-auto mt-6 px-4 sm:px-6">
        <CardContent className="text-center text-rose-500 py-10 text-lg">
          Error loading metadata.
        </CardContent>
      </Card>
    );
  }

  const { tokenId, metadata } = data;

  return (
    <Card className="max-w-2xl mx-auto mt-6 px-4 sm:px-6 shadow-md border">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold text-slate-800">
          {metadata.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={metadata.image}
          alt={metadata.name}
          className="w-full h-[220px] sm:h-[300px] object-cover rounded-md"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-slate-700 text-sm mt-6">
          {metadata.attributes.map((attr: any, i: number) => (
            <div key={i} className="flex">
              <span className="font-medium w-36">{attr.trait}:</span>
              <span className="truncate">{attr.value}</span>
            </div>
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-400 text-right">
          Token ID: {tokenId}
        </p>
      </CardContent>
    </Card>
  );
};

export default VehicleInfo;
