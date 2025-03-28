"use client";

import { getCarMetadataByVIN } from "@/lib/web3/contractServices";
import { ContractContext } from "@/components/providers/ContractProvider";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import {
  ClipboardList,
  DollarSign,
  IdCard,
  LoaderCircle,
  QrCode,
  ShoppingCart,
} from "lucide-react";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "./ui/card";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import CarQRCode from "./CarQRCode";
import { formatEther } from "ethers";
import { BigNumber } from "alchemy-sdk";
import { Skeleton } from "@heroui/skeleton";
import { Image } from "@heroui/image";

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
      <Card className="max-w-xl space-y-5 p-4 mx-auto my-16" radius="lg">
        <div className="flex justify-between">
          <Skeleton>
            <div className="h-5 w-2/5 bg-default-300" />
          </Skeleton>
          <Skeleton>
            <div className="h-5 w-2/5 bg-default-300" />
          </Skeleton>
        </div>
        <Skeleton className="rounded-lg">
          <div className="h-[250px] rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-5 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-5 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-5 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="max-w-2xl mx-auto mt-6 px-4 sm:px-6">
        <CardBody className="text-center text-rose-500 py-10 text-lg">
          Error loading metadata.
        </CardBody>
      </Card>
    );
  }

  const { tokenId, metadata, price } = data;
  const make = metadata.attributes[0].value;
  const model = metadata.attributes[1].value;
  return (
    <Card
      className="max-w-xl m-5 min-[610px]:mx-auto p-2 my-16"
      isBlurred={false}
    >
      <CardBody>
        {/* Header */}
        <div className="flex justify-between">
          <div className="flex gap-2 text-[1.5rem]">
            <h2 className="text-slate-500">{make}</h2>
            <h2>{model}</h2>
          </div>
          <div className="text-[2rem] font-bold text-slate-400">#{tokenId}</div>
        </div>

        <Image src={metadata.image} alt={metadata.name} />
        <div className="grid grid-cols-1 min-[575px]:grid-cols-2 gap-2 mt-4">
          <div className="bg-slate-100 bg-opacity-[5%] p-2 rounded-lg">
            <div className="text-xl text-slate-200 flex gap-2 items-center">
              <ClipboardList className="text-teal-500" /> Attributes
            </div>
            <div className="flex flex-col gap-1">
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
          </div>
          <div className="bg-slate-100 bg-opacity-[5%] p-2 rounded-lg">
            <div className="text-xl text-slate-200 flex gap-2 items-center">
              <IdCard className="text-teal-500" /> Identification
            </div>
            <div className="flex flex-col gap-1">
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
        </div>
      </CardBody>
      <CardFooter className="flex flex-col-reverse items-start min-[551px]:flex-row min-[551px]:justify-between min-[551px]:items-end">
        <div className="flex gap-2 max-[550px]:w-full ">
          {Number(price) !== 0 ? (
            <Button
              size={"lg"}
              className="max-[551px]:w-full "
              color="success"
              variant="flat"
              radius="sm"
              startContent={<ShoppingCart />}
            >
              Purchase
            </Button>
          ) : (
            <Button
              disabled
              size="lg"
              className="max-[551px]:w-full "
              radius="sm"
            >
              Unavailable
            </Button>
          )}
          <Button
            variant="ghost"
            size="lg"
            className=" px-3 max-[551px]:w-full"
            radius="sm"
            startContent={<QrCode />}
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
    // <div className="max-w-xl mx-auto px-4 my-16 ">
    //   <Card className="border-none bg-slate-500 bg-opacity-[10%] text-slate-50">
    //     <CardHeader>
    //       <CardTitle className="text-2xl font-bold text-slate-800">
    //         <div className="flex justify-between">
    //           <div className="flex gap-2">
    //             <p className="text-slate-600 inline">
    //               {metadata.attributes[0].value}
    //             </p>{" "}
    //             <p className="text-slate-400">{metadata.attributes[1].value}</p>
    //           </div>
    //           <div className="text-slate-500 font-bold text-[2rem] flex">
    //             # <p className="text-slate-400">{tokenId}</p>
    //           </div>
    //         </div>
    //       </CardTitle>
    //     </CardHeader>
    //     <CardContent>
    //       <img
    //         src={metadata.image}
    //         alt={metadata.name}
    //         className="w-full  object-cover rounded-md"
    //       />

    //       <div className="grid grid-cols-1 min-[575px]:grid-cols-2 gap-2 mt-2">
    //         <div className="bg-slate-500 bg-opacity-[10%] rounded-md p-2">
    //           <div className="flex gap-2 text-[1.2rem] items-center">
    //             <ClipboardList />
    //             Attributes
    //           </div>
    // {metadata.attributes.map(
    //   (attr: any, i: number) =>
    //     attr.trait_type !== "VIN" &&
    //     attr.trait_type !== "Registration Number" && (
    //       <div key={i} className="text-slate-500 flex gap-1">
    //         {attr.trait_type}:{" "}
    //         <p className="text-slate-300">{attr.value}</p>
    //       </div>
    //     )
    // )}
    //         </div>
    //         <div className=" rounded-md p-2 bg-slate-500 bg-opacity-[10%]">
    //           <div className="flex gap-2 text-[1.2rem] items-center">
    //             <IdCard />
    //             Identifier
    //           </div>
    //           <div className="text-slate-500 flex gap-1">
    //             VIN:{" "}
    //             <p className="text-slate-300">{metadata.attributes[3].value}</p>
    //           </div>
    //           <div className="text-slate-500 flex gap-1">
    //             Number Plate:{" "}
    //             <p className="text-slate-300">{metadata.attributes[4].value}</p>
    //           </div>
    //           <CarQRCode vin={vin} />
    //         </div>
    //       </div>
    //     </CardContent>
    //     <CardFooter className="flex flex-col-reverse items-start min-[551px]:flex-row min-[551px]:justify-between min-[551px]:items-end">
    // <div className="flex gap-2 max-[550px]:w-full ">
    //   {Number(price) !== 0 ? (
    //     <Button
    //       size={"lg"}
    //       className="max-[551px]:w-full bg-teal-800 text-teal-400 hover:bg-teal-500 hover:text-white"
    //     >
    //       Purchase
    //     </Button>
    //   ) : (
    //     <Button
    //       disabled
    //       size="lg"
    //       className="max-[551px]:w-full bg-slate-400"
    //     >
    //       Unavailable
    //     </Button>
    //   )}
    //   <Button
    //     variant="outline"
    //     size="lg"
    //     className="border-slate-400 hover:bg-slate-100 px-5 max-[551px]:w-full"
    //   >
    //     Print QR Code
    //   </Button>
    // </div>
    // {Number(price) !== 0 ? (
    //   <div className="text-[1.8rem] font-semibold text-slate-400 flex gap-2">
    //     <p>{formatEther(price)}</p> <p className="text-slate-500">ETH</p>
    //   </div>
    // ) : (
    //   <p className="text-[1.8rem] font-semibold text-slate-400">N/A</p>
    // )}
    //     </CardFooter>
    //   </Card>
    // </div>
  );
};

export default VehicleInfo;
