import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { config } from "./../../config";
const useLogin = () => {
  const navigate = useNavigate();

  const VerifyLogin = (UserData) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${config.REACT_APP_HOST}:${config.REACT_APP_PORT}/api/v1/login`,
          UserData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        )
        .then((response) => {
          if (response.status === 200) {
            const decodedToken = jwtDecode(response.data.token);
            localStorage.setItem("token", JSON.stringify(decodedToken));
            localStorage.setItem("Maintoken", response.data.token); // Store token as a string, not JSON
            // console.log("Token stored:", localStorage.getItem("Maintoken"));

            // Force re-fetch or re-render
            if (decodedToken.role === "admin") {
              resolve("admin");
              // navigate("/Dashboard"); // Resolve the promise for an admin role
            } else if (decodedToken.role === "user") {
              resolve("user");
              // navigate("/UserPage"); // Resolve the promise for a user role
            }
          } else {
            reject(new Error("Invalid credentials or server error")); // Reject the promise
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error); // Reject the promise with any network or server errors
        });
    });
  };

  return { VerifyLogin };
};

export const LoginFunc = async (loginData) => {
  try {
    const response = await axios.post(
      `${config.REACT_APP_HOST}:${config.REACT_APP_PORT}/api/v1/login`,
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response?.status == 200) {
      const decodedToken = jwtDecode(response.data.token);
      localStorage.setItem("token", JSON.stringify(decodedToken));
      localStorage.setItem("Maintoken", response.data.token); // Store token as a string, not JSON
      return decodedToken.role;
    } else {
      return new Error("Invalid credentials or server error");
    }
  } catch (error) {
    throw new error(error);
  }
};

export default useLogin;
