import './App.css'
import { Button } from './components/ui/button'
import Login from './pages/Login'
import Navbar from "./components/Navbar";
import HeroSection from './pages/student/HeroSection';
import MainLayout from './layout/MainLayout';
import Courses from './pages/student/Courses';
import MyLearning from './pages/student/MyLearning';
import Profile from './pages/student/Profile';
import Sidebar from './pages/admin/Sidebar';
import Dashboard from './pages/admin/Dashboard';
import CourseTable from './pages/admin/course/CourseTable';
import AddCourse from './pages/admin/course/AddCourse';
import EditCourse from './pages/admin/course/EditCourse';
import CreateLecture from './pages/admin/lecture/CreateLecture';
import EditLecture from './pages/admin/lecture/EditLecture';
import CourseDetail from './pages/student/CourseDetail';
import CourseProgress from './pages/student/CourseProgress';
import SearchPage from './pages/student/SearchPage';
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoutes';
import { ThemeProvider } from './components/ThemeProvider';
import PurchaseCourseProtectedRoute from './components/PurchaseCourseProtectedRoute';
import LandingPage from './pages/LandingPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { useLoadUserQuery } from './features/api/authApi';
import { Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setLoading } from './features/authSlice';
import React, { useEffect } from 'react';
import Footer from './components/Footer';

const Custom = ({ children }) => {
  const dispatch = useDispatch();
  const { isLoading } = useLoadUserQuery();
  React.useEffect(() => {
    dispatch(setLoading(isLoading));
  }, [isLoading, dispatch]);
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  return children;
};

function App() {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = "7592bd09-6d2b-46ec-befa-c0f72a7e9f57"; // Replace with your Crisp website ID
    (function () {
      var d = document;
      var s = d.createElement("script");
      s.src = "https://client.crisp.chat/l.js";
      s.async = 1;
      d.getElementsByTagName("head")[0].appendChild(s);
    })();
  }, []);
  return (
    <main>
      <ThemeProvider>
        <Router>
          <Custom>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<><Navbar /><HeroSection /><Courses /><Footer /></>} />
              <Route path="/login" element={<AuthenticatedUser><Login /></AuthenticatedUser>} />
              <Route path="/my-learning" element={<ProtectedRoute><MyLearning /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/course/search" element={<ProtectedRoute><SearchPage /></ProtectedRoute>} />
              <Route path="/course-detail/:courseId" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
              <Route path="/course-progress/:courseId" element={<ProtectedRoute><PurchaseCourseProtectedRoute><CourseProgress /></PurchaseCourseProtectedRoute></ProtectedRoute>} />
              {/* Admin routes */}
              <Route path="/admin" element={<AdminRoute><Sidebar /></AdminRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="course" element={<CourseTable />} />
                <Route path="course/create" element={<AddCourse />} />
                <Route path="course/:courseId" element={<EditCourse />} />
                <Route path="course/:courseId/lecture" element={<CreateLecture />} />
                <Route path="course/:courseId/lecture/:lectureId" element={<EditLecture />} />
              </Route>
            </Routes>
          </Custom>
          <Toaster />
        </Router>
      </ThemeProvider>
    </main>
  )
}

export default App
