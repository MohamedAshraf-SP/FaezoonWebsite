import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import images
import navLogo from "/images/AlfaaizoonLogo.png";
// import icons
import { FiMenu } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import { navbarLinks } from "../assets/NavbarArr";
import Overlay from "./Overlay";
export default function NewNavbar() {
  const navigate = useNavigate();
  const [scrolling, setScrolling] = useState(false);
  const [sideBar, setsideBar] = useState(false);
  const [sucess_Login, setSucessLogin] = useState(false);
  const [Loader, showLoader] = useState(false);
  const [role, setrole] = useState("");

  const location = useLocation();

  //  show side navbar while click
  const showsideBar = () => {
    setsideBar(!sideBar);
  };

  // handle log out function
  const handleLogout = () => {
    showLoader(true);
    setTimeout(() => {
      showLoader(false);
    }, 1000);
    localStorage.clear(); // Remove the additional token from localStorage
    setSucessLogin(false); // Update state to reflect logged out status
    navigate("/"); // Optionally, redirect to the homepage or login page
  };

  // handle show Dashboard and log out icon
  useEffect(() => {
    const token = localStorage.getItem("Maintoken");
    const userToken = localStorage.getItem("token");
    setrole(userToken ? JSON.parse(userToken).role : "");
    if (token || userToken) {
      setSucessLogin(true); // User is logged in if any token exists
    } else {
      setSucessLogin(false); // No token means user is not logged in
    }
  }, []);

  return (
    <>
      <div className="relative  bg-white">
        {Loader && <Overlay title={"Log out"} />}
        <nav
          className={` w-full transition-all duration-500 z-40  border-b border-solid border-[#010d0014] ${
            scrolling
              ? "bg-white shadow-lg fixed top-0 py-1"
              : "bg-transparent sticky py-2"
          }`}
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex   items-center justify-between">
              {/* Logo Section */}
              <div className="flex items-center  overflow-hidden">
                <Link to="/" className="flex items-center w-[50px] h-[60px]">
                  <img
                    src={navLogo}
                    alt="Logo"
                    loading="lazy"
                    className="w-full h-full"
                  />
                </Link>
              </div>

              {/* Large Screen Navbar */}
              <div className="hidden md:flex">
                <nav aria-label="Global">
                  <ul className="flex items-center gap-8 text-md">
                    {navbarLinks.map((link) => (
                      <li key={link.id}>
                        <Link
                          to={link.path}
                          className={`relative text-[#0c0e18] lg:text-[16px] md:text-[12px] font-normal transition-all duration-300 hover:text-[#f21d44] before:absolute before:bottom-0 before:left-1/2 before:h-[2px] before:w-0 before:bg-[#f21d44] before:transition-all before:duration-300 before:ease-in-out before:transform before:-translate-x-1/2 hover:before:w-full ${
                            link.routedd === location.pathname
                              ? "text-[#f21d44] before:bg-[#f21d44]  before:h-[2px] before:w-full"
                              : ""
                          } `}
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* User Actions */}
              <div className="flex items-center md:gap-2">
                {sucess_Login && (
                  <div className="hidden md:block">
                    {role == "admin" ? (
                      <Link
                        to="/Dashboard"
                        className="border border-[#242f6c] rounded-md  text-[#242f6c] font-medium px-4 py-2 hover:bg-[#242f6c] hover:text-white transition-all duration-300 ease-in-out "
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: "500",
                        }}
                      >
                        Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/UserPage"
                        className="border border-[#242f6c] rounded-md  text-[#242f6c] font-medium px-6 py-2 hover:bg-[#242f6c] hover:text-white transition-all duration-300 ease-in-out "
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: "500",
                        }}
                      >
                        UserPage
                      </Link>
                    )}
                  </div>
                )}
                {/* Mobile Menu Toggle */}
                <div className="md:hidden">
                  <button
                    className="text-3xl p-2 outline-none transition hover:text-gray-600"
                    onClick={showsideBar}
                  >
                    <FiMenu />
                  </button>
                </div>
                {sucess_Login ? (
                  <span
                    className="text-xl flex items-center justify-center cursor-pointer hover:text-primary transition hover:text-[#f21d44]"
                    onClick={handleLogout}
                  >
                    <LuLogOut />
                  </span>
                ) : (
                  <Link
                    to="/login"
                    className=" rounded-md text-[#242f6c] font-medium px-6 py-2 hover:bg-[#242f6c] hover:text-white transition-all duration-300 ease-in-out"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: "500",
                    }}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        {/* start Mobile screen navbar */}
        <nav
          className={`fixed lg:hidden top-0 left-0 h-screen w-[calc(100vw-100px)] bg-white shadow-lg z-40 p-5 pt-8   transition-transform duration-300 ease-in-out  
      ${sideBar ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex justify-between items-center">
            <Link to="/" className="w-[140px]">
              <img src={navLogo} alt="Navigation Logo" loading="lazy" />
            </Link>
            <span
              className="text-2xl text-gray-400 hover:text-black cursor-pointer transition ease-in-out"
              onClick={showsideBar}
            >
              <IoClose />
            </span>
          </div>

          <div className="py-10">
            <ul className="flex flex-col gap-4">
              {navbarLinks.map((link, index) => (
                <Link
                  to={`${link.path}`}
                  className="relative w-full"
                  key={index}
                >
                  <div className="flex items-center justify-between w-full cursor-pointer px-3 py-[10px] rounded-md hover:bg-gray-100 transition">
                    <span>{link.name}</span>
                  </div>
                </Link>
              ))}

              {sucess_Login && (
                <div>
                  {role == "admin" ? (
                    <Link
                      to="/Dashboard"
                      className="border border-[#242f6c] rounded-md  text-[#242f6c] font-medium px-4 py-2 hover:bg-[#242f6c] hover:text-white transition-all duration-300 ease-in-out "
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: "500",
                      }}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/UserPage"
                      className="border border-[#242f6c] rounded-md  text-[#242f6c] font-medium px-6 py-2 hover:bg-[#242f6c] hover:text-white transition-all duration-300 ease-in-out "
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: "500",
                      }}
                    >
                      UserPage
                    </Link>
                  )}
                </div>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </>
  );
}
