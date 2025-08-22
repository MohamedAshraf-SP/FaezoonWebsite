import axios from "axios";

const api = import.meta.env.VITE_API_URL;
 
export const GetAllTeachers = async () => {
  try {
    const Token = localStorage.getItem("Maintoken");
    const response = await axios.get(
      `${api}/teachers`,

      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    return response.data;
  } catch (error) {}
};

// start Function Add New Teacher Data
export const addNewTeacher = async (postData) => {
  const Token = localStorage.getItem("Maintoken");
  try {
    const response = await axios.post(
      `${api}/teachers`,
      postData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    return response; // Return success
  } catch (error) {
    // console.error("Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add teacher",
    }; // Return error
  }
};

// start Function Edit Teacher
export const updateTeacher = async (TeacherId, UpdatedData) => {
  const Token = localStorage.getItem("Maintoken");
  try {
    const response = await axios.put(
      `${api}/teachers/${TeacherId}`,
      UpdatedData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
  } catch (error) {
    // console.log(error);
  }
};
// Function Delete Teacher
export const DeleteTeacher = async (TeacherId) => {
  try {
    let Token = localStorage.getItem("Maintoken");
    const response = await axios.delete(
      `${api}/teachers/${TeacherId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Token}`,
        },
      }
    );
    // console.log("Response data:", response.data); // Log response data
    return response.data;
  } catch (error) {
    console.error(
      "Failed to delete teacher:"
      // error.response ? error.response.data : error
    );
    throw error; // Optionally rethrow the error to handle it elsewhere
  }
};
// start get all Students Count
export const getTeachersCount = async () => {
  const Token = localStorage.getItem("Maintoken");
  try {
    const response = await axios.get(`${api}/teachers/count`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Token}`,
      },
    });
    
    return response.data;
  } catch (error) {}
};
