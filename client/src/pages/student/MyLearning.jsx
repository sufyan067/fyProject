import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";

const MyLearning = () => { 
  const {data, isLoading} = useLoadUserQuery();
  const user = data?.user;
  const myLearning = user?.enrolledCourses || [1,2];
  if (user?.role === 'admin') {
    return (
      <div className="max-w-5xl mx-auto my-24 px-4 md:px-0">
        <h1 className="font-extrabold text-3xl text-center mb-8 tracking-tight text-gray-800 dark:text-gray-100">My Learning</h1>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center text-blue-700 dark:text-blue-300 font-semibold">
          You are an admin. You do not have enrolled courses.
        </div>
      </div>
    );
  }
  if (user?.role === 'instructor') {
    return (
      <div className="max-w-5xl mx-auto my-24 px-4 md:px-0">
        <h1 className="font-extrabold text-3xl text-center mb-8 tracking-tight text-gray-800 dark:text-gray-100">My Learning</h1>
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center text-gray-500 dark:text-gray-300">
          You are an instructor. You do not have enrolled courses.
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto my-24 px-4 md:px-0">
      <h1 className="font-extrabold text-3xl text-center mb-8 tracking-tight text-gray-800 dark:text-gray-100">My Learning</h1>
      <div className="my-5">
        {isLoading ? (
          <MyLearningSkeleton />
        ) : myLearning.length === 0 ? (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-8 text-center text-gray-500 dark:text-gray-300">
            You are not enrolled in any course.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myLearning.map((course, index) => (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 p-4">
                <Course key={index} course={course}/>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <div
        key={index}
        className="bg-gray-200 dark:bg-gray-800 rounded-xl h-44 animate-pulse shadow"
      ></div>
    ))}
  </div>
);