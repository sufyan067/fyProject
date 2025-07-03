import express from "express"
import isAuthenticated from "../middlewares/isAuthenticated.js"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getCourseLecture, getCreatorCourses, getLectureById, getPublishedCourse, removeLecture, searchCourse, togglePublishCourse, getInstructorStats } from "../controllers/course.controller.js";
const router  = express.Router();
import upload from "../utils/multer.js"

// Static routes first
router.route("/instructor-stats").get(isAuthenticated, getInstructorStats);
router.route("/").post(isAuthenticated, createCourse);
router.route("/search").get(isAuthenticated, searchCourse);
router.route("/published-courses").get( getPublishedCourse);
router.route("/").get(isAuthenticated, getCreatorCourses);

// Dynamic routes after static
router.route("/:courseId").put(isAuthenticated,upload.single("courseThumbnail"), editCourse);
router.route("/:courseId").get(isAuthenticated, getCourseById);
router.route("/:courseId/lecture").post(isAuthenticated, createLecture);
router.route("/:courseId/lecture").get(isAuthenticated, getCourseLecture);
router.route("/:courseId/lecture/:lectureId").post(isAuthenticated,editLecture);
router.route("/lecture/:lectureId").delete(isAuthenticated,removeLecture);
router.route("/lecture/:lectureId").get(isAuthenticated,getLectureById);
router.route("/:courseId").patch(isAuthenticated, togglePublishCourse);
router.route('/:courseId').delete(isAuthenticated, async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await import('../models/course.model.js').then(m => m.Course.findByIdAndDelete(courseId));
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    // Optionally: Remove related lectures, purchases, etc. here
    return res.status(200).json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Failed to delete course' });
  }
});

export default router;