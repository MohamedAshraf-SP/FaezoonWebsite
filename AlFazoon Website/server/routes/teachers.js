import express from "express";
import {
  getTeacher,
  getTeachersCount,
  getTeachers,
  updateTeacher,
  deleteTeacher,
  addTeacher,
} from "./../controllers/teachers.js";
import { authMiddleware, roleMiddleware } from "../middlewares/Middlewares.js";
export const teachersRoute = express.Router();


teachersRoute.delete("/teacher/d/:id", deleteTeacher);
teachersRoute.post("/teacher/:id", getTeacher);
teachersRoute.post("/teacher", addTeacher);
teachersRoute.post("/teachers", getTeachers);
teachersRoute.put("/teacher/:id", updateTeacher);
teachersRoute.post("/teachers/Count", getTeachersCount);

export default teachersRoute;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ4NTljZGJiZjRiNmNlNGEzNjVjNTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjU0NTUxNzUsImV4cCI6MTcyNTU0MTU3NX0.sIjnKBfG3q0_zwb72-Iv9v16Qw3i5UD65DNTlIS-SBo
