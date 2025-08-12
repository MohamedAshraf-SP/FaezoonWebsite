import React from "react";

export default function Loader() {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-slate-800">
      <button type="button" class="bg-indigo-500 ..." disabled>
        <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24"></svg>
        Processing...
      </button>
    </div>
  );
}
