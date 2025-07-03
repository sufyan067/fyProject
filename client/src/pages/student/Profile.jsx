import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import React, { useEffect, useState } from 'react'
import { Loader2, LocateFixed } from 'lucide-react'
import Course from './Course'
import { useLoadUserQuery, useUpdateUserMutation, useRequestInstructorMutation } from '@/features/api/authApi'
import { toast } from 'sonner'

const Profile = () => {
  const [name, setName] = useState("");
  const [ProfilePhoto, setProfilePhoto] = useState("");
  const { data, isLoading, refetch } = useLoadUserQuery();
  const [updateUser, { data: updateUserData, isLoading: updateUserIsLoading, isError,error, isSuccess }] = useUpdateUserMutation();
  const [requestInstructor, { isLoading: isRequestingInstructor }] = useRequestInstructorMutation();
  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  }
 
  const updateUserHandler = async() => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("profilePhoto", ProfilePhoto);
    await updateUser(formData);

  };
  useEffect(()=>{
refetch();
  },[])
  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data.message || "Profile updated successfully");
    }
    if (isError) {
      toast.error(error.message || "Something went wrong");
    }
  }, [error, updateUserData,isSuccess, isError]);
  if (isLoading) return <h1>Profile is Loading...</h1>
  const  user = data && data.user;
  return (
    <div className='max-w-4xl mx-auto my-24 px-4 md:px-0'>
      <h1 className='font-extrabold text-3xl text-center md:text-left mb-8 tracking-tight text-gray-800 dark:text-gray-100'>Profile</h1>
      {/* Become Instructor Button */}
      {user.role === 'student' && !user.isInstructorApproved && (
        <div className="mb-6 flex justify-center">
          <Button
            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white font-bold px-6 py-2 rounded-full shadow-lg hover:from-blue-700 hover:to-pink-600 transition-all"
            disabled={isRequestingInstructor}
            onClick={async () => {
              try {
                const res = await requestInstructor().unwrap();
                toast.success(res.message || 'Request sent!');
              } catch (err) {
                toast.error(err.data?.message || 'Failed to send request');
              }
            }}
          >
            Become Instructor
          </Button>
        </div>
      )}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 mb-8'>
        <div className="flex flex-col items-center">
          <Avatar className='h-24 w-24 md:h-32 md:w-32 mb-4 shadow-md'>
            <AvatarImage src={user.photoUrl || "https://github.com/shadcn.png"} alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div className="mb-2" >
            <h2 className='font-semibold text-gray-900 dark:text-gray-100'>
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h2>
          </div>
          <div className="mb-2" >
            <h2 className='font-semibold text-gray-900 dark:text-gray-100'>
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h2>
          </div>
          <div className="mb-2" >
            <h2 className='font-semibold text-gray-900 dark:text-gray-100'>
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.role.toUpperCase()}
              </span>
            </h2>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow">Edit Profile</Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-2 border-blue-200 dark:border-blue-900 shadow-xl bg-white dark:bg-gray-900">
              <DialogHeader>
                <DialogTitle className="text-blue-700 dark:text-blue-300">Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name" className='col-span-3' />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Picture</Label>
                  <Input type="file"
                    onChange={onChangeHandler}
                    accept='image/*' className='col-span-3' />
                </div>
              </div>
              <DialogFooter>
                <Button disabled={updateUserIsLoading} onClick={updateUserHandler} className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow">
                  {
                    updateUserIsLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please Wait
                      </>
                    ) : "Save changes"
                  }
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        {user.role === 'admin' ? (
          <div className="text-blue-700 dark:text-blue-300 text-center py-8 font-semibold">
            You are an admin. Manage users and courses from the dashboard.
          </div>
        ) : (
          <>
            <h1 className='font-semibold text-lg mb-4 text-gray-800 dark:text-gray-100'>Courses you're enrolled in</h1>
            {user.role === 'instructor' ? (
              <div className="text-gray-500 dark:text-gray-400 text-center py-8">
                You are an instructor. You do not have enrolled courses.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-5">
                {
                  user.enrolledCourses.length == 0 ? <h1 className="text-gray-500 dark:text-gray-400">You haven't enrolled in any courses yet</h1> : (
                    user.enrolledCourses.map((course) => <Course key={course._id} course={course} />)
                  )
                }
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Profile