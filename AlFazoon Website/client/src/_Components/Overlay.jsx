import React from "react";

export default function Overlay({ title }) {
  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-purple-900 bg-opacity-80 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="flex flex-col items-center  ">
        {/* Rotating gradient border around loader */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-t-4 border-transparent border-t-purple-400 animate-spin" />
          <img
            src="/images/loader.svg" // Replace with your logo or loader image
            loading="lazy"
            alt="loading"
            className="w-full h-full"
          />
        </div>

        {/* Loading text with subtle fade-in animation */}
        <p className="text-xl text-gray-100 font-medium animate-fade-in text-center">
          {title}...
        </p>
      </div>
    </div>
  );
}
