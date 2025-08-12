import React, { useState } from "react";
import SideBar from "../_Components/Dashboard/SideBar";
import Main_content from "../_Components/Dashboard/Main_content";

export default function Dashboard() {
  const [selectedSection, setSelectedSection] = useState("Overview");
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  // Toggle what to display
  const handleSidebarClick = (section) => {
    setSelectedSection(section);
  };

  // show sideBar in mobile screen
  const toggleSideBar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div
          className={`lg:w-2/12 w-8/12 h-full fixed top-0 transition-transform duration-300 z-40 
                      ${
                        isSidebarVisible
                          ? "translate-x-0 bg-white lg:shadow-sm shadow-md "
                          : "-translate-x-full"
                      } lg:translate-x-0`}
        >
          <SideBar
            onSectionChange={handleSidebarClick}
            selectedSection={selectedSection}
            ToggleSideBar={toggleSideBar}
          />
        </div>

        {/* Main Content */}
        <div className="lg:w-10/12 w-full ml-auto overflow-y-auto">
          <Main_content
            selectedSection={selectedSection}
            ToggleSideBar={toggleSideBar}
          />
        </div>
      </div>
    </>
  );
}
