import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req,res) => {
    try {
       
        const {name, email, password} = req.body; // patel214
        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        // Email format validation
        const emailRegex = /^[a-zA-Z][\w\-\.]*@([\w-]+\.)+[\w-]{2,4}$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Please enter a valid email address."
            })
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exist with this email."
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password:hashedPassword
        });
        return res.status(201).json({
            success:true,
            message:"Account created successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to register"
        })
    }
}
export const login = async (req,res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:"All fields are required."
            })
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({
                success:false,
                message:"Incorrect email or password"
            });
        }
        generateToken(res, user, `Welcome back ${user.name}`);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to login"
        })
    }
}
export const logout = async (_,res) => {
    try {
        return res.status(200).cookie("token", "", {maxAge:0}).json({
            message:"Logged out successfully.",
            success:true
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to logout"
        }) 
    }
}
export const getUserProfile = async (req,res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password").populate("enrolledCourses");
        if(!user){
            return res.status(404).json({
                message:"Profile not found",
                success:false
            })
        }
        return res.status(200).json({
            success:true,
            user
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to load user"
        })
    }
}
export const updateProfile = async (req,res) => {
    try {
        const userId = req.id;
        const {name} = req.body;
        const profilePhoto = req.file;

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                message:"User not found",
                success:false
            }) 
        }
        // extract public id of the old image from the url is it exists;
        if(user.photoUrl){
            const publicId = user.photoUrl.split("/").pop().split(".")[0]; // extract public id
            deleteMediaFromCloudinary(publicId);
        }

        // upload new photo
        const cloudResponse = await uploadMedia(profilePhoto.path);
        const photoUrl = cloudResponse.secure_url;

        const updatedData = {name, photoUrl};
        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {new:true}).select("-password");

        return res.status(200).json({
            success:true,
            user:updatedUser,
            message:"Profile updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Failed to update profile"
        })
    }
}

// Request to become instructor
export const requestInstructor = async (req, res) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        if (user.role === 'instructor' || user.isInstructorApproved) {
            return res.status(400).json({ success: false, message: 'Already an instructor or already requested.' });
        }
        user.isInstructorApproved = false; // Explicitly set pending
        await user.save();
        return res.status(200).json({ success: true, message: 'Instructor request submitted. Awaiting admin approval.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to request instructor role.' });
    }
};

// Admin: Get all pending instructor requests
export const getPendingInstructors = async (req, res) => {
    try {
        const pending = await User.find({ role: 'student', isInstructorApproved: false });
        return res.status(200).json({ success: true, pending });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch pending instructors.' });
    }
};

// Admin: Approve instructor
export const approveInstructor = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        user.role = 'instructor';
        user.isInstructorApproved = true;
        await user.save();
        return res.status(200).json({ success: true, message: 'Instructor approved successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to approve instructor.' });
    }
};

// Admin: Get all users
export const getAllUsers = async (req, res) => {
    try {
        // Sirf admin check karo
        const userId = req.id;
        const adminUser = await User.findById(userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const users = await User.find().select('-password');
        return res.status(200).json({ success: true, users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
    }
};

// Admin: Delete user
export const deleteUser = async (req, res) => {
    try {
        const userId = req.id;
        const adminUser = await User.findById(userId);
        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
        }
        const { userId: deleteId } = req.params;
        if (userId === deleteId) {
            return res.status(400).json({ success: false, message: 'Admin cannot delete themselves.' });
        }
        const deletedUser = await User.findByIdAndDelete(deleteId);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }
        return res.status(200).json({ success: true, message: 'User deleted successfully.' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: 'Failed to delete user.' });
    }
};

export const rejectInstructor = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.isInstructorApproved = undefined; // Reset request
    user.role = 'student'; // Ensure user remains student
    await user.save();
    return res.status(200).json({ success: true, message: 'Instructor request rejected.' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Failed to reject instructor request.' });
  }
};