import React from "react";
import NewNavbar from "../_Components/NewNavbar";

export default function Header() {
  return (
    <>
      <NewNavbar ButtonStatius={true} />
      <div className=" bg-bgColor py-4 md:py-16 h-screen">
        <div className="container ">
          <div className="grid md:grid-cols-2 grid-cols-1 ">
            <div
              className="relative flex items-center justify-start  text-black md:p-8 before:absolute before:-left-[200px]   before:lg:top-[20px] before:-top-[10px] before:w-[468px] before:h-[336px] before:bg-[url('/images/bgBefore.png')] before:bg-cover before:bg-center
           "
            >
              <div className="z-30 py-20 flex flex-col items-start justify-start">
                <div className="py-1 px-6 rounded-full bg-white text-[#088998] mb-5">
                  Let’s Know Islam
                </div>
                <h1 className="md:text-6xl   text-3xl text-textColor  font-serif" >
                  Read! In the Name your Lord, Who has created
                </h1>
                <p className="text-gray-700 font-medium text-[19px] mt-2 ">
                  We are the best Educational Organization.Let’s know about
                  Islam And the holy Quran!
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center relative">
              <div
                className=" md:flex w-[500px]
              overflow-hidden "
              >
                <img
                  src="/images/img-3.44bb17a6.png"
                  className="w-full h-full "
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
