// export default Navbar;
import React, { useEffect, useState } from "react";
import Buttons from "./Button";
import LoginForm from "./LoginForm";
import Overlay from "./Overlay";

function Navbar({ ButtonStatius }) {
  // State to show and hide login form
  const [loginForm, setLogin] = useState(false);
  const [user_type, setuser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in
  const [Loader, showLoader] = useState(false);
  // Check for tokens in localStorage
  useEffect(() => {
    const token = localStorage.getItem("Maintoken");
    const userToken = localStorage.getItem("token"); // Check for additional token if needed
    if (token || userToken) {
      setIsLoggedIn(true); // User is logged in if any token exists
    } else {
      setIsLoggedIn(false); // No token means user is not logged in
    }
  }, []);

  // Handle login form toggle
  const handleLoginForm = (usertype) => {
    if (usertype === "User") {
      setuser("user");
    } else if (usertype === "admin") {
      setuser("admin");
    }
    setLogin(!loginForm);
  };

  // Logout function to remove tokens
  const handleLogout = () => {
    showLoader(true);
    setTimeout(() => {
      showLoader(false);
    }, 1000);
    localStorage.removeItem("Maintoken"); // Remove the Maintoken from localStorage
    localStorage.removeItem("token"); // Remove the additional token from localStorage
    setIsLoggedIn(false); // Update state to reflect logged out status
    window.location.href = "/"; // Optionally, redirect to the homepage or login page
  };

  return (
    <>
      <header className="bg-white shadow-sm">
        {Loader && <Overlay title={'Log out'} />}
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <a
                className="flex flex-row items-center sm:justify-center gap-1"
                href="/"
              >
                <div className="w-12 h-12 object-cover overflow-hidden">
                  <img src="/images/logo.png" />
                </div>
                <span className="font-semibold text-PrimaryColor md:text-xl text-sm ">
                  Al Faaizoon
                </span>
              </a>
            </div>
            <div className="md:flex md:items-center md:gap-12">
              {/* Show the login button if the user is not logged in */}
              {ButtonStatius && !isLoggedIn && (
                <div className="flex items-center gap-2">
                  <Buttons
                    varient="primary"
                    action={() => handleLoginForm("admin")}
                  >
                    Login
                  </Buttons>
                </div>
              )}
              {/* Show the logout button if the user is logged in */}
              {isLoggedIn && (
                <div className="flex items-center gap-2">
                  <Buttons varient="secondary" action={handleLogout}>
                    Logout
                  </Buttons>
                </div>
              )}
            </div>
          </div>
        </div>
        {loginForm && (
          <div className="relative">
            <LoginForm hideform={handleLoginForm} user={user_type} />
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
