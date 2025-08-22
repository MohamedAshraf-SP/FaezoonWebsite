import { MdLogout } from "react-icons/md";
import { CiMenuBurger } from "react-icons/ci";
import Overview from "./MainContent/Overview";
import Teachers from "./MainContent/Teachers";
import Students from "./MainContent/Students";
import Hadith from "./MainContent/Hadith";
import Overlay from "../Overlay";
import { useState } from "react";
import Cread from "./MainContent/Cread";
import Douaa from "./MainContent/Douaa";
import Nawwai from "./MainContent/40Nawwai";
import Azkar from "./MainContent/Azkar";
import Tawheed from "./MainContent/Tawheed";
import Fiqh from "./MainContent/Fiqh";
import ProphtStories from "./MainContent/ProphtStories";
import CompanionsStories from "./MainContent/CompanionsStories";

export default function Main_content({ selectedSection, ToggleSideBar }) {
  const [Loader, showLoader] = useState(false);

  // handle logout
  const handleLogout = () => {
    localStorage.clear(); // Remove the additional token from localStorage
    showLoader(true);
    window.location.href = "/"; // Optionally, redirect to the homepage or login page
    setTimeout(() => {
      showLoader(false);
    }, 1000);
    // Update state to reflect logged out status
  };

  return (
    <>
      {Loader && <Overlay title={"Log out"} />}

      <div className="sticky flex flex-row items-center justify-between top-0 left-0 h-10 w-full border-b border-solid border-slate-100  px-4 z-30 bg-[#ffffffe8] backdrop-blur-lg lg:shadow-none shadow-md">
        <div className="flex flex-row items-center justify-start text-xl gap-2 ">
          <span
            className="cursor-pointer hover:text-slate-400 lg:hidden block"
            onClick={ToggleSideBar}
          >
            <CiMenuBurger />
          </span>
        </div>
        <div
          className="text-2xl cursor-pointer hover:text-red-600 relative after:content-['Logout'] after:absolute after:opacity-0 hover:after:opacity-100 after:transition-opacity after:left-1/2 after:transform after:-translate-x-1/2 after:top-full after:mt-1   after:py-1 after:text-[15px]  after:text-slate-950   after:rounded z-50"
          onClick={handleLogout}
        >
          <MdLogout />
        </div>
      </div>
      {selectedSection == "Overview" && <Overview />}
      {selectedSection == "Teachers" && <Teachers />}
      {selectedSection == "Students" && <Students />}
      {selectedSection == "Hadith" && <Hadith />}
      {selectedSection == "Cread" && <Cread />}
      {selectedSection == "Azkar" && <Azkar />}
      {selectedSection == "Duaa" && <Douaa />}
      {selectedSection == "40 Nawawi" && <Nawwai />}
      {selectedSection == "Fiqh" && <Fiqh />}
      {selectedSection == "Tawheed" && <Tawheed />}
      {selectedSection == "Propht Stories" && <ProphtStories />}
      {selectedSection == "Companions Stories" && <CompanionsStories />}
    </>
  );
}
