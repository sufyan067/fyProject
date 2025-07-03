import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";
import { CoursePurchase } from "../models/coursePurchase.model.js";
import { User } from "../models/user.model.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category is required."
            })
        }
        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        })
        return res.status(201).json({
            course,
            message: "Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create Course"
        })

    }
}
export const searchCourse = async (req,res) => {
    try {
        const {query = "", categories = [], sortByPrice =""} = req.query;
        console.log(categories);
        
        // create search query
        const searchCriteria = {
            isPublished:true,
            $or:[
                {courseTitle: {$regex:query, $options:"i"}},
                {subTitle: {$regex:query, $options:"i"}},
                {category: {$regex:query, $options:"i"}},
            ]
        }

        // if categories selected
        if (categories && categories.length > 0) {
            // Ensure categories is always an array
            const categoryArray = Array.isArray(categories) ? categories : [categories];
            searchCriteria.category = { $in: categoryArray };
        }

        // define sorting order
        const sortOptions = {};
        if(sortByPrice === "low"){
            sortOptions.coursePrice = 1;//sort by price in ascending
        }else if(sortByPrice === "high"){
            sortOptions.coursePrice = -1; // descending
        }

        let courses = await Course.find(searchCriteria).populate({path:"creator", select:"name photoUrl"}).sort(sortOptions);

        return res.status(200).json({
            success:true,
            courses: courses || []
        });

    } catch (error) {
        console.log(error);
        
    }
}
export const getPublishedCourse = async (_,res) => {
    try {
        const courses = await Course.find({isPublished:true}).populate({path:"creator", select:"name photoUrl"});
        if(!courses){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get published courses"
        })
    }
}
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                course: [],
                message: "Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        })
    }
}
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, courseLevel, coursePrice, category } = req.body
        const thumbnail = req.file;
        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId);  //delete old image
            }
            // upload a thumbnail on cloudinary
            courseThumbnail = await uploadMedia(thumbnail.path)
        }

        const updateData = { courseTitle, subTitle, description, courseLevel, coursePrice, category, courseThumbnail: courseThumbnail?.secure_url }
        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });
        return res.status(200).json({
            course,
            message: "Course updated successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        })
    }
}
export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params;
        console.log("Fetching course with ID:", courseId);

        const course = await Course.findById(courseId);
        console.log("Found course:", course);

        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        return res.status(200).json({
            course
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get course by Id"
        })
    }
}
export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message: "Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId).populate("lectures");
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            lectures: course.lectures
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get lectures"
        })
    }
}
export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body
        const { courseId, lectureId } = req.params;
        const lecture = await Lecture.findById(lectureId)
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found"
            })
        }
        //update lecture
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        await lecture.save();
        // Ensure the course still has the lecture id if it was not aleardy added;
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        };
        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully."
        })
    } catch (error) {

        console.log(error);
        return res.status(500).json({
            message: "Failed to edit lectures"
        })
    }
}
export const removeLecture = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if(lecture.publicId){
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            {lectures:lectureId}, // find the course that contains the lecture
            {$pull:{lectures:lectureId}} // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message:"Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req,res) => {
    try {
        const {lectureId} = req.params;
        const lecture = await Lecture.findById(lectureId);
        if(!lecture){
            return res.status(404).json({
                message:"Lecture not found!"
            });
        }
        return res.status(200).json({
            lecture
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to get lecture by id"
        })
    }
}
export const togglePublishCourse = async (req,res) => {
    try {
        const {courseId} = req.params;
        const {publish} = req.query; // true, false
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                message:"Course not found!"
            });
        }
        // Check if user is an approved instructor
        const user = req.id ? await import('../models/user.model.js').then(m => m.User.findById(req.id)) : null;
        if (!user || user.role !== 'instructor' || !user.isInstructorApproved) {
            return res.status(403).json({
                message: "Only approved instructors can publish courses. Please wait for admin approval."
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message:`Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message:"Failed to update status"
        })
    }
}
export const getInstructorStats = async (req, res) => {
    try {
        console.log("[InstructorStats] req.id:", req.id);
        const instructorId = req.id;
        // Sirf instructor check karo
        const instructor = await User.findById(instructorId);
        console.log("[InstructorStats] instructor:", instructor);
        if (!instructor || instructor.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        // Apne courses lao
        const courses = await Course.find({ creator: instructorId });
        console.log("[InstructorStats] courses:", courses);
        const courseIds = courses.map(c => c._id);
        // In courses ki sales lao
        const purchases = await CoursePurchase.find({ courseId: { $in: courseIds }, status: 'completed' });
        console.log("[InstructorStats] purchases:", purchases);
        // Revenue aur students nikaalo
        let totalRevenue = 0;
        let totalSales = 0;
        let studentsSet = new Set();
        purchases.forEach(p => {
            totalRevenue += p.amount || 0;
            totalSales += 1;
            studentsSet.add(p.userId.toString());
        });
        console.log("[InstructorStats] totalRevenue:", totalRevenue, "totalSales:", totalSales, "students:", studentsSet.size);
        return res.status(200).json({
            success: true,
            stats: {
                courses: courses.length,
                sales: totalSales,
                revenue: totalRevenue,
                students: studentsSet.size
            }
        });
    } catch (error) {
        console.log("[InstructorStats] ERROR:", error);
        return res.status(500).json({ success: false, message: 'Failed to fetch instructor stats.' });
    }
};