import express from "express";
import studentsRoute from "./students.js";
import teachersRoute from "./teachers.js";
import loginRoute from "./login.js";
import {
  roleMiddleware,
  authMiddleware,
} from "./../middlewares/Middlewares.js";

const router = express.Router();

router.use("/v1/login", loginRoute);
router.use("/v1", studentsRoute);
router.use("/v1", authMiddleware, roleMiddleware("admin"), teachersRoute);
// /v1/Students/Count

export default router;

// module.exports=router
