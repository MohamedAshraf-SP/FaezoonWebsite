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

teachersRoute.get("/count", getTeachersCount);
teachersRoute.get("/:id", getTeacher);
teachersRoute.get("/", getTeachers);
teachersRoute.post("/", addTeacher);
teachersRoute.put("/:id", updateTeacher);
teachersRoute.delete("/:id", deleteTeacher);


export default teachersRoute;

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmQ4NTljZGJiZjRiNmNlNGEzNjVjNTgiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjU0NTUxNzUsImV4cCI6MTcyNTU0MTU3NX0.sIjnKBfG3q0_zwb72-Iv9v16Qw3i5UD65DNTlIS-SBo
