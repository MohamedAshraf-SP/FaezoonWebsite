import express from "express";
import {
  getStudent,
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
  getTotalStudentCount,
} from "./../controllers/students.js";
import {
  roleMiddleware,
  authMiddleware,
} from "./../middlewares/Middlewares.js";

export const studentsRoute = express.Router();

studentsRoute.get("/Student/:id", getStudent);
studentsRoute.get("/Students", getStudents);
studentsRoute.post("/Student",  addStudent);
studentsRoute.put("/Student/:id",  updateStudent);
studentsRoute.delete("/Student/:id",  deleteStudent);
studentsRoute.get("/Students/Count",  getTotalStudentCount);

export default studentsRoute;

/*
export const x=1

import {x} from x.js

*/

/*
const x=1

export default x

import x from x  without '{}' on x

**/
