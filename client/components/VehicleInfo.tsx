"use client";

import { getCarMetadataByVIN } from "@/lib/web3/contractServices";
import { ContractContext } from "@/components/providers/ContractProvider";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ClipboardList, IdCard, LoaderCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { Button } from "./ui/button";
import CarQRCode from "./CarQRCode";
import { formatEther } from "ethers";
import { BigNumber } from "alchemy-sdk";

const VehicleInfo = () => {
  const { contract } = useContext(ContractContext);
  const { vin } = useParams();

  const { data, isPending, error } = useQuery({
    queryKey: ["carMetadata", vin],
    enabled: !!contract && !!vin,
    queryFn: () => getCarMetadataByVIN(contract, vin),
  });
  console.log(data);

  if (isPending) {
    return (
      <Card className="max-w-2xl mx-auto mt-6 px-4 sm:px-6 ">
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

  const { tokenId, metadata, price } = data;

  return (
    <div className="max-w-xl mx-auto px-4 my-16 ">
      <Card className="border-none bg-slate-500 bg-opacity-[10%] text-slate-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-800">
            <div className="flex justify-between">
              <div className="flex gap-2">
                <p className="text-slate-600 inline">
                  {metadata.attributes[0].value}
                </p>{" "}
                <p className="text-slate-400">{metadata.attributes[1].value}</p>
              </div>
              <div className="text-slate-500 font-bold text-[2rem] flex">
                # <p className="text-slate-400">{tokenId}</p>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={metadata.image}
            alt={metadata.name}
            className="w-full  object-cover rounded-md"
          />

          <div className="grid grid-cols-1 min-[575px]:grid-cols-2 gap-2 mt-2">
            <div className="bg-slate-500 bg-opacity-[10%] rounded-md p-2">
              <div className="flex gap-2 text-[1.2rem] items-center">
                <ClipboardList />
                Attributes
              </div>
              {metadata.attributes.map(
                (attr: any, i: number) =>
                  attr.trait_type !== "VIN" &&
                  attr.trait_type !== "Registration Number" && (
                    <div key={i} className="text-slate-500 flex gap-1">
                      {attr.trait_type}:{" "}
                      <p className="text-slate-300">{attr.value}</p>
                    </div>
                  )
              )}
            </div>
            <div className=" rounded-md p-2 bg-slate-500 bg-opacity-[10%]">
              <div className="flex gap-2 text-[1.2rem] items-center">
                <IdCard />
                Identifier
              </div>
              <div className="text-slate-500 flex gap-1">
                VIN:{" "}
                <p className="text-slate-300">{metadata.attributes[3].value}</p>
              </div>
              <div className="text-slate-500 flex gap-1">
                Number Plate:{" "}
                <p className="text-slate-300">{metadata.attributes[4].value}</p>
              </div>
              <CarQRCode vin={vin} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col-reverse items-start min-[551px]:flex-row min-[551px]:justify-between min-[551px]:items-end">
          <div className="flex gap-2 max-[550px]:w-full ">
            {Number(price) !== 0 ? (
              <Button
                size={"lg"}
                className="max-[551px]:w-full bg-teal-800 text-teal-400 hover:bg-teal-500 hover:text-white"
              >
                Purchase
              </Button>
            ) : (
              <Button
                disabled
                size="lg"
                className="max-[551px]:w-full bg-slate-400"
              >
                Unavailable
              </Button>
            )}
            <Button
              variant="outline"
              size="lg"
              className="border-slate-400 hover:bg-slate-100 px-5 max-[551px]:w-full"
            >
              Print QR Code
            </Button>
          </div>
          {Number(price) !== 0 ? (
            <div className="text-[1.8rem] font-semibold text-slate-400 flex gap-2">
              <p>{formatEther(price)}</p> <p className="text-slate-500">ETH</p>
            </div>
          ) : (
            <p className="text-[1.8rem] font-semibold text-slate-400">N/A</p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VehicleInfo;
