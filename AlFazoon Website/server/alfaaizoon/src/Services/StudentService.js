import axios from "axios";
const api = import.meta.env.VITE_REACT_APP_HOST;
const Port = import.meta.env.VITE_REACT_APP_PORT;
// Get all students
export const getStudents = async () => {
  try {
    const response = await axios.get(`${api}:${Port}/api/v1/Students`);
    return response.data; // Assuming response.data contains the list of students
  } catch (error) {}
};
// Add student
export const addStudent = async (newData) => {
  try {
    const response = await axios.post(
      `${api}:${Port}/api/v1/Students`, // Adjust your API endpoint
      newData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error) {
    // console.error("Error:", error.response?.data || error.message);
    return {
      success: false,
      message: error.response?.data?.message || "Failed to add student",
    }; // Return error
  }
};

// Edit student
export const editStudent = async (studentId, updatedData) => {
  try {
    const response = await axios.put(
      `${api}:${Port}/api/v1/Students/${studentId}`,
      updatedData
    );
    return response.data;
  } catch (error) {
    // console.log(error);
  }
};

// Delete student
export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(
      `${api}:${Port}/api/v1/Students/${studentId}`
    );
    return response.data;
  } catch (error) {
    // console.log(error.data);
  }
};

// start get all Students Count
export const getStudentsCount = async () => {
  try {
    const response = await axios.get(`${api}:${Port}/api/v1/Students/Count`);
    return response.data; // Assuming response.data contains the list of students
  } catch (error) {}
};
