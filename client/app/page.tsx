"use client";
import Hero from "@/components/Hero";
import VehicleContent from "@/components/VehicleContent";
import { Suspense } from "react";
import { Spinner } from "@heroui/spinner";

export default function Home() {
  return (
    <Suspense fallback={<LoadingBox />}>
      <Hero />
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto text-slate-50">
        <h1 className="text-[1.5rem] sm:text-[2rem] font-bold">Marketplace</h1>
        <VehicleContent />
      </div>
    </Suspense>
  );
}

const LoadingBox = () => {
  return (
    <div className="rounded-lg grid place-items-center">
      <Spinner variant="simple" />
    </div>
  );
};
