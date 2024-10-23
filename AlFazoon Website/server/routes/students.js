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


studentsRoute.get("/Count",  getTotalStudentCount);
studentsRoute.get("/:id", getStudent);
studentsRoute.get("/", getStudents);
studentsRoute.post("/",  addStudent);
studentsRoute.put("/:id",  updateStudent);
studentsRoute.delete("/:id",  deleteStudent);

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
