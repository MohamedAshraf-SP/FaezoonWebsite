import React, { useState } from "react";
import Navbar from "./Navbar";
import OverView from "./OverView";
import Students from "./Students";
import Teachers from "./Teachers";
import Overlay from "./Overlay";

export default function Dashboard() {
  // handle  between sections
  const [overlay, showoverlay] = useState(false);
  const [section, showsection] = useState(1);
  const HandleShowingSection = (index) => {
    showsection(section === index ? null : index);
    showoverlay(true);
    setTimeout(() => {
      showoverlay(false);
    }, 1000);
  };

  return (
    <>
      <Navbar ButtonStatius={false} />
      <div className="bg-bgColor h-full">
        {overlay && <Overlay title={"Loading"} />}
        <div className=" container">
          <div className="p-2 ">
            <ul className="flex flex-row items-center justify-center md:gap-6 gap-2 rounded-lg bg-PrimaryColor mx-auto py-2 px-5 text-textColor font-semibold w-auto overflow-hidden">
              <li
                className={` cursor-pointer hover:bg-SecondaryButtonColor hover:text-white px-3 py-2 rounded-lg ${
                  section == 1
                    ? "bg-SecondaryButtonColor text-white"
                    : "bg-transparent text-textColor"
                }`}
                onClick={() => HandleShowingSection(1)}
              >
                Overview
              </li>
              <li
                className={` cursor-pointer hover:bg-SecondaryButtonColor hover:text-white px-3 py-2 rounded-lg ${
                  section == 3
                    ? "bg-SecondaryButtonColor text-white"
                    : "bg-transparent text-textColor"
                }`}
                onClick={() => HandleShowingSection(3)}
              >
                Students
              </li>
              <li
                className={` cursor-pointer hover:bg-SecondaryButtonColor hover:text-white px-3 py-2 rounded-lg ${
                  section == 2
                    ? "bg-SecondaryButtonColor text-white"
                    : "bg-transparent text-textColor"
                }`}
                onClick={() => HandleShowingSection(2)}
              >
                Teachers
              </li>
            </ul>
          </div>
          <div className="py-10 h-full ">
            {section === 1 && <OverView />}
            {section === 2 && <Teachers />}
            {section === 3 && <Students />}
          </div>
        </div>
      </div>
    </>
  );
}
