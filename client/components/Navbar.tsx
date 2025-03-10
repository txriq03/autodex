import React from "react";
import { Button } from "./ui/button";

const Navbar = () => {
  return (
    <div className=" bg-slate-800 py-3">
      <div className="max-width flex justify-between">

        <div className="text-lg text-white">Trusty</div>
        <div>
          <Button variant="secondary">Connect Wallet</Button>
        </div>

      </div>
    </div>
  );
};

export default Navbar;
