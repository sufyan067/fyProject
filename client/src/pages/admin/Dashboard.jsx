import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useGetPurchasedCoursesQuery } from '@/features/api/purchaseApi';
import React, { useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useGetPendingInstructorsQuery, useApproveInstructorMutation, useLoadUserQuery, useGetAllUsersQuery, useDeleteUserMutation, useRejectInstructorMutation } from '@/features/api/authApi';
import { useGetInstructorStatsQuery } from '@/features/api/courseApi';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useLocation } from "react-router-dom";

const Dashboard = () => {
  const location = useLocation();
  const { data: userData, isLoading: userLoading } = useLoadUserQuery();
  const user = userData?.user;

  // Admin dashboard logic
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();
  const { data: pendingData, isLoading: pendingLoading, refetch } = useGetPendingInstructorsQuery();
  const [approveInstructor, { isLoading: approving }] = useApproveInstructorMutation();
  const { data: usersData, isLoading: usersLoading, refetch: refetchUsers } = useGetAllUsersQuery();
  const [deleteUser, { isLoading: deleting }] = useDeleteUserMutation();
  const [rejectInstructor, { isLoading: rejecting }] = useRejectInstructorMutation();

  // Instructor dashboard logic (real data)
  const { data: statsData, isLoading: statsLoading, refetch: statsRefetch } = useGetInstructorStatsQuery(undefined, { skip: user?.role !== 'instructor' });
  const instructorStats = statsData?.stats || { courses: 0, sales: 0, revenue: 0, students: 0 };

  // Auto-refetch on role or route change
  useEffect(() => {
    if (user?.role === 'admin' && refetchUsers) refetchUsers();
    if (user?.role === 'instructor' && statsRefetch) statsRefetch();
  }, [user?.role, location.pathname]);

  if (userLoading) return <h1>Loading...</h1>;
  if (!user) return <h1>User not found</h1>;

  if (user.role === 'admin') {
    if (isLoading || usersLoading) return <h1>Loading...</h1>;
    if (isError) return <h1 className="text-red-500">Failed to get purchased course</h1>;
    const purchasedCourse = (data && data.purchasedCourse) ? data.purchasedCourse : [];
    const courseData = purchasedCourse.length > 0 ? purchasedCourse.map((course) => ({
      name: course.courseId?.courseTitle || 'Unknown',
      price: course.courseId?.coursePrice || 0
    })) : [];
    const totalRevenue = purchasedCourse.reduce((acc, element) => acc + (element.amount || 0), 0);
    const totalSales = purchasedCourse.length;
    const handleApprove = async (userId) => {
      try {
        await approveInstructor(userId).unwrap();
        toast.success('Instructor approved!');
        refetch();
      } catch (err) {
        toast.error('Failed to approve instructor');
      }
    };
    const handleDelete = async (userId) => {
      if(window.confirm('Are you sure you want to delete this user?')) {
        try {
          await deleteUser(userId).unwrap();
          toast.success('User deleted!');
          refetchUsers();
        } catch (err) {
          toast.error('Failed to delete user');
        }
      }
    };
    const handleReject = async (userId) => {
      try {
        await rejectInstructor(userId).unwrap();
        toast.success('Request rejected!');
        refetch();
      } catch (err) {
        toast.error('Failed to reject request');
      }
    };
    return (
      <div className="max-w-5xl mx-auto p-6">
        {/* Users List Section */}
        <h2 className="text-2xl font-bold mb-4">All Users</h2>
        {usersLoading ? (
          <p>Loading users...</p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mb-8">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersData?.users?.map((u) => (
                  <tr key={u._id} className="border-t">
                    <td className="py-2">{u.name}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.role}</td>
                    <td className="py-2">
                      <Button
                        className="bg-[#e53935] hover:bg-[#b71c1c] text-white font-bold px-4 py-1 rounded shadow-md border border-[#b71c1c] focus:outline-none focus:ring-2 focus:ring-[#ff1744] focus:ring-offset-2 transition-all duration-150"
                        disabled={deleting}
                        onClick={() => handleDelete(u._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Pending Instructor Requests Section */}
        <h2 className="text-2xl font-bold mb-4">Pending Instructor Requests</h2>
        {pendingLoading ? (
          <p>Loading...</p>
        ) : pendingData?.pending?.length === 0 ? (
          <p className="text-gray-500">No pending requests.</p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mb-8">
            <table className="w-full">
              <thead>
                <tr className="text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingData.pending.map((user) => (
                  <tr key={user._id} className="border-t">
                    <td className="py-2">{user.name}</td>
                    <td className="py-2">{user.email}</td>
                    <td className="py-2">
                      <>
                        <Button
                          className="bg-[#1976d2] hover:bg-[#0d47a1] text-white font-bold px-4 py-1 rounded shadow-md border border-[#0d47a1] focus:outline-none focus:ring-2 focus:ring-[#2979ff] focus:ring-offset-2 transition-all duration-150 mr-2"
                          disabled={approving}
                          onClick={() => handleApprove(user._id)}
                        >
                          Approve
                        </Button>
                        <Button
                          className="bg-gray-300 hover:bg-red-600 text-gray-800 hover:text-white font-bold px-4 py-1 rounded shadow-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-150"
                          disabled={rejecting}
                          onClick={() => handleReject(user._id)}
                        >
                          Reject
                        </Button>
                      </>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* Dashboard Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{totalSales}</p>
              {totalSales === 0 && <p className="text-gray-500 text-sm mt-2">No sales yet.</p>}
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{totalRevenue}</p>
              {totalRevenue === 0 && <p className="text-gray-500 text-sm mt-2">No revenue yet.</p>}
            </CardContent>
          </Card>
          {/* Course Prices Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-700">
                Course Prices
              </CardTitle>
            </CardHeader>
            <CardContent>
              {courseData.length === 0 ? (
                <p className="text-gray-500">No course data available.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={courseData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis
                      dataKey="name"
                      stroke="#6b7280"
                      angle={-30}
                      textAnchor="end"
                      interval={0}
                    />
                    <YAxis stroke="#6b7280" />
                    <Tooltip formatter={(value, name) => [`₹${value}`, name]} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#4a90e2"
                      strokeWidth={3}
                      dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Instructor dashboard
  if (user.role === 'instructor') {
    if (statsLoading) return <h1>Loading...</h1>;
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Instructor Dashboard</h2>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{instructorStats.courses}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{instructorStats.sales}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{instructorStats.revenue}</p>
            </CardContent>
          </Card>
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">{instructorStats.students}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Fallback for other roles
  return <h1>Unauthorized</h1>;
};

export default Dashboard;