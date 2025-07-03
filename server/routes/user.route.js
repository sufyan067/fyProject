import express from "express";
import { getUserProfile, login, logout, register, updateProfile, requestInstructor, getPendingInstructors, approveInstructor, getAllUsers, deleteUser, rejectInstructor } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile").get(isAuthenticated, getUserProfile);
router.route("/profile/update").put(isAuthenticated, upload.single("profilePhoto"), updateProfile);
router.post('/request-instructor', isAuthenticated, requestInstructor);
router.get('/pending-instructors', isAuthenticated, getPendingInstructors);
router.patch('/approve-instructor/:userId', isAuthenticated, approveInstructor);
router.patch('/reject-instructor/:userId', isAuthenticated, rejectInstructor);
router.get('/all', isAuthenticated, getAllUsers);
router.delete('/:userId', isAuthenticated, deleteUser);

export default router;