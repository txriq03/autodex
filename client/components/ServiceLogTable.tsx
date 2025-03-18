"use client";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ContractContext } from "./providers/ContractProvider";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoaderCircle } from "lucide-react";


const ServiceLogTable = () => {
    const { contract } = useContext(ContractContext);
    const { vin } = useParams();
    const [tokenId, setTokenId] = useState<number | null>(null);

    // Get tokenId by VIN
    useEffect(() => {
        const fetchTokenId = async () => {
          if (contract && vin) {
            try {
              const id = await contract.getTokenIdByVIN(vin);
              setTokenId(Number(id));
            } catch (error) {
              toast.error("Failed to fetch tokenId", {
                description: (error as any).message,
              });
            }
          }
        };
        fetchTokenId();
      }, [contract, vin]);

      const { data: logs, isPending, error } = useQuery({
        queryKey: ["serviceLogs", tokenId],
        enabled: tokenId !== null && !!contract,
        queryFn: async () => {
          if (!contract || tokenId === null) return [];
          const logs = await contract.getServiceHistory(tokenId);
          return logs.map((log: any) => ({
            date: Number(log.date),
            description: log.description,
            garageName: log.garageName,
            mileage: Number(log.mileage),
          }));
        },
      });
      
      if (isPending) return (
        <div className='bg-slate-100 p-12 text-center text-slate-600 rounded-lg text-[1rem] sm:text-[1.2rem] flex gap-2 justify-center'>
           <LoaderCircle className="animate-spin"/> Loading...
        </div>
      )
      if (error) return (
        <div className='bg-slate-100 p-12 text-center text-slate-600 rounded-lg text-[1rem] sm:text-[1.2rem]'>
            Error: {(error as any).message}
        </div>
      )
      if (!logs || logs.length < 1) return (
        <div className='bg-slate-100 p-12 text-center text-slate-600 rounded-lg text-[1rem] sm:text-[1.2rem]'>
            No logs have been made.
        </div>
      )
      

  return (
    <div className="rounded-md border bg-white">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Garage</TableHead>
          <TableHead>Mileage (miles)</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log: any, idx: number) => (
          <TableRow key={idx}>
            <TableCell>{new Date(Number(log.date) * 1000).toLocaleDateString()}</TableCell>
            <TableCell>{log.description}</TableCell>
            <TableCell>{log.garageName}</TableCell>
            <TableCell>{log.mileage}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
  )
}

export default ServiceLogTable