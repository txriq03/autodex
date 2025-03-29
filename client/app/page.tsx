import { Hero, Search } from "@/components/";
import VehicleContent from "@/components/VehicleContent";

export default function Home() {
  return (
    <div className=" ">
      <Hero />
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto text-slate-50">
        <h1 className="text-[2rem]  font-bold">Marketplace</h1>
        <VehicleContent />
      </div>
    </div>
  );
}
