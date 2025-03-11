import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className=" bg-slate-800 py-3">
      <div className="min-[1440px]:max-w-[1440px] mx-5 min-[1450px]:mx-auto flex justify-between">

        <div className="text-2xl text-white font-semibold">AutoDex</div>
        <div>
          <Button variant="secondary">Connect Wallet</Button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
