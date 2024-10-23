import express from "express";
import studentsRoute from "./students.js";
import teachersRoute from "./teachers.js";
import loginRoute from "./login.js";
import tutorialsRoute from "./tutorials/tutorials.js";
import {
  roleMiddleware,
  authMiddleware,
} from "./../middlewares/Middlewares.js";

const router = express.Router();

router.use("/login", loginRoute);
router.use("/students", studentsRoute);
router.use("/tutorials", tutorialsRoute);
router.use("/teachers", authMiddleware, roleMiddleware("admin"), teachersRoute);
// /v1/Students/Count

export default router;

// module.exports=router
