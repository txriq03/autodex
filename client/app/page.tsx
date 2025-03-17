import { Hero, Search } from "@/components/";
import VehicleGrid from "@/components/VehicleGrid";

export default function Home() {
  return (
    <div className=" ">
      <Hero />
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto">
        <Search />
        <VehicleGrid filterOwned={true}/>
        <VehicleGrid filterOwned={false}/>
      </div>
    </div>
  );
}
