import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ProtectUser({ children }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Retrieve token and update state
    const MainToken = JSON.parse(localStorage.getItem("token"));
    setToken(MainToken);

    // Redirect if token is not valid
    if (!MainToken || MainToken.role !== "user") {
      navigate("/not-found");
    }
  }, [navigate]);

  // Render children if token is valid
  return token && token.role === "user" ? children : null;
}