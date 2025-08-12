// import images
import { Link } from "react-router-dom";
import navLogo from "/images/NavbarLogo.webp";
import { IoClose } from "react-icons/io5";
export default function SideBar({
  onSectionChange,
  selectedSection,
  ToggleSideBar,
}) {
  const sideBar = [
    "Overview",
    "Teachers",
    "Students",
    "Hadith",
    "Cread",
    "Azkar",
    "Duaa",
    "40 Nawawi",
  ];

  return (
    <>
      <div className="px-2 py-2 flex flex-col items-start justify-start gap-4 border-r border-solid border-slate-200 h-screen ">
        <div className="w-full flex flex-row items-center justify-between">
          <Link to="/" className="w-40 h-10 overflow-hidden">
            <img src={navLogo} alt="navLogo" className="w-full h-full" />
          </Link>
          <span
            className="text-2xl text-gray-400 hover:text-black cursor-pointer transition ease-in-out lg:hidden block"
            onClick={ToggleSideBar}
          >
            <IoClose />
          </span>
        </div>

        <ul className="mt-4 px-2 flex flex-col gap-6 h-full  w-full">
          {sideBar.map((item, index) => (
            <li
              key={index}
              className={`tracking-wide cursor-pointer hover:bg-[#EBF0FF] hover:text-[#7586f7] transition-all ease-in-out duration-300 w-full py-2 px-2 rounded-md hover:translate-x-1  ${
                selectedSection === item ? "bg-[#5D87FF] text-white" : ""
              }`}
              onClick={() => {
                onSectionChange(item);
                ToggleSideBar();
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
