import React from "react";
import { Link } from "react-router-dom";
import headerImg from "/images/download.png";
export default function FixedHeader({ subtitle }) {
  return (
    <>
      <section className="relative flex items-center justify-center h-[500px] bg-gradient-to-r from-indigo-200 via-purple-100 to-teal-100 text-gray-800">
        <div className="absolute inset-0 bg-black opacity-50"></div>

        <div className="relative flex flex-col items-center z-10">
          <img src={headerImg} alt="Islamic Icon" className="w-60 h-60 mb-4" />

          <h1 className="lg:text-5xl text-2xl font-extrabold text-white mb-2">
            Islamic Teachings
          </h1>
          <Link
            to="/"
            className="text-lg font-semibold text-gray-100 hover:text-teal-700 cursor-pointer transition-all duration-300 ease-in-out "
          >
            Home / <span className="text-sky-950">{subtitle}</span>
          </Link>
        </div>
      </section>
    </>
  );
}
