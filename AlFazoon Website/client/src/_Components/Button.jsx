import React from "react";

const Buttons = ({ children, varient, action }) => {
  return (
    <button
      className={` flex items-center hover:bg-transparent cursor-pointer border border-solid rounded-md outline-none   px-5 py-2.5 text-sm font-medium text-white shadow   ${
        varient === "primary"
          ? "bg-cyan-500 hover:border border-solid border-cyan-500 hover:text-gray-400"
          : "bg-cyan-400 hover:text-slate-400"
      }`}
      onClick={action}
    >
      {children}
    </button>
  );
};

export default Buttons;
