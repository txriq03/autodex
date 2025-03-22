import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="w-full bg-slate-50 bg-opacity-[5%] text-slate-400  p-5 text-center">
      <div className="mx-auto">
        Developed by{" "}
        <Link
          href="https://github.com/txriq03"
          target="_blank"
          className="text-teal-400 font-semibold hover:text-teal-300 transition"
        >
          Tariq
        </Link>
      </div>
    </div>
  );
};

export default Footer;
