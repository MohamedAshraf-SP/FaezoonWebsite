import axios from "axios";
import { jwtDecode } from "jwt-decode";

const api = import.meta.env.VITE_API_URL;
const useLogin = () => {
console.log('api is ',api)

  const VerifyLogin = (UserData) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${api}/login`,
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
      `${api}/login`,
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
