import { Hero, Search } from "@/components/";

export default function Home() {
  return (
    <div className=" ">
      <Hero />
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto">
        <Search />
      </div>
    </div>
  );
}
