import React from "react";

export default function Footer() {
  const Todaydate = new Date();
  const Year = Todaydate.getFullYear();
  const HossamWhatsapp = import.meta.env.VITE_HOSSAM_NUM;
  const MohamedWhatsappURL = import.meta.env.VITE_MOHAMED_NUM;
  return (
    <div className="py-6 bg-gray-200 shadow-md mt-10">
      <div className="text-center">
        <h2 className="font-sans font-semibold text-gray-800">
          {`Created By `}
          <a
            href={HossamWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-sky-900 font-medium transition-all ease-in-out duration-300"
          >
            Hossam Mohamed
          </a>
          -
          <a
            href={MohamedWhatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-sky-900 font-medium transition-all ease-in-out duration-300"
          >
            Mohamed Ashraf
          </a>
        </h2>
        <p className="  text-center text-[#525252] leading-[30px] font-thim">
          {` Copyright © ${Year} `}

          {` . All rights reserved.`}
        </p>
      </div>
    </div>
  );
}
