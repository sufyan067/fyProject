import RichTextEditor from '@/components/RichTextEditor';
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEditCourseMutation, useGetCourseByIdQuery, usePublishCourseMutation, useRemoveCourseMutation } from '@/features/api/courseApi';
import { Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

const CourseTab = () => {
    const [input, setInput] = useState({
        CourseTitle: '',
        SubTitle: '',
        description: '',
        category: '',
        courseLevel: '',
        coursePrice: '',
        courseThumbnail: '',
    });
    const params = useParams();
    const courseId = params.courseId
    const { data: courseByIdData, isLoading: courseByIdLoading, refetch } =
        useGetCourseByIdQuery(courseId);
    const [publishCourse, { }] = usePublishCourseMutation();
    const course = courseByIdData?.course;
    console.log("Course Data:", course);
    useEffect(() => {
        if (courseByIdData?.course) {
            setInput({
                CourseTitle: courseByIdData.course.courseTitle,
                SubTitle: courseByIdData.course.subTitle,
                description: courseByIdData.course.description,
                category: courseByIdData.course.category,
                courseLevel: courseByIdData.course.courseLevel,
                coursePrice: courseByIdData.course.coursePrice,
                courseThumbnail: "",
            });
        }
    }, [courseByIdData]);
    //get file
    const selectThumbnail = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setInput({ ...input, courseThumbnail: file })
            const fileReader = new FileReader();
            fileReader.onloadend = () => setPreviewThumbnail(fileReader.result);
            fileReader.readAsDataURL(file);
        }

    }
    const [previewThumbnail, setPreviewThumbnail] = useState("");
    const [editCourse, { data, isLoading, isSuccess, error }] = useEditCourseMutation();
    const [removeCourse, { isLoading: removing }] = useRemoveCourseMutation();

    const navigate = useNavigate();
    const selectCategory = (value) => {
        setInput({ ...input, category: value });
    };
    const selectCourseLevel = (value) => {
        setInput({ ...input, courseLevel: value });
    };

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
    }
    const updateCourseHandler = async () => {
        const formData = new FormData();
        formData.append("courseTitle", input.CourseTitle)
        formData.append("subTitle", input.SubTitle)
        formData.append("description", input.description)
        formData.append("category", input.category)
        formData.append("courseLevel", input.courseLevel)
        formData.append("coursePrice", input.coursePrice)
        formData.append("courseThumbnail", input.courseThumbnail)

        await editCourse({ formData, courseId });
    }
    const publishStatusHandler = async (action) => {
        try {
            const response = await publishCourse({ courseId, query: action });
            if (response.data) {
                await refetch();
                // Update input state with latest course data if available
                if (response.data.course) {
                    setInput({
                        CourseTitle: response.data.course.courseTitle,
                        SubTitle: response.data.course.subTitle,
                        description: response.data.course.description,
                        category: response.data.course.category,
                        courseLevel: response.data.course.courseLevel,
                        coursePrice: response.data.course.coursePrice,
                        courseThumbnail: "",
                    });
                }
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to publish or unpublish course");
        }
    };
    const handleRemoveCourse = async () => {
        if(window.confirm("Are you sure you want to delete this course?")) {
            await removeCourse(courseId);
            toast.success("Course removed!");
            navigate("/admin/course");
        }
    };
    useEffect(() => {
        if (isSuccess) {
            toast.success(data.message || " Course update.")
        }
        if (error) {
            toast.error(error.data.message || "Failed to update course.")
        }
    }, [isSuccess, error])
    if (courseByIdLoading) return <Loader2 className='h-4 w-4 animate-spin' />

    return (
        <Card>
            <CardHeader className='flex flex-row justify-between'>
                <div>
                    <CardTitle>Basic Course Information </CardTitle>
                    <CardDescription>
                        Make changes to your courses. Click save when you're done.
                    </CardDescription>
                </div>
                <div className='space-x-2'>
                    <Button disabled={courseByIdData?.course.lectures.length === 0} variant="outline" onClick={() => publishStatusHandler(courseByIdData?.course.isPublished ? "false" : "true")}>
                        {courseByIdData?.course.isPublished ? "Unpublish" : "Publish"}
                    </Button>
                    <Button onClick={handleRemoveCourse} disabled={removing}>Remove Course</Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className='space-y-4 mt-5'>
                    <div>
                        <Label>Title</Label>
                        <Input
                            type='text'
                            name='CourseTitle'
                            value={input.CourseTitle}
                            onChange={changeEventHandler}
                            placeholder='Enter Course Title' />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input
                            type='text'
                            name='SubTitle'
                            value={input.SubTitle}
                            onChange={changeEventHandler}
                            placeholder='Enter Course Subtitle' />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <RichTextEditor input={input} setInput={setInput} />
                    </div>
                    <div className='flex item-center gap-5'>
                        <div>
                            <Label>Category</Label>
                            <Select value={input.category} onValueChange={selectCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Category</SelectLabel>
                                        <SelectItem value="Cyber Hygiene / Best Practices">Cyber Hygiene / Best Practices</SelectItem>
                                        <SelectItem value="Phishing & Social Engineering">Phishing & Social Engineering</SelectItem>
                                        <SelectItem value="Safe Browsing & Online Behavior">Safe Browsing & Online Behavior</SelectItem>
                                        <SelectItem value="Mobile & Device Security">Mobile & Device Security</SelectItem>
                                        <SelectItem value="Threats & Attack Types">Threats & Attack Types</SelectItem>
                                        <SelectItem value="Workplace Cybersecurity">Workplace Cybersecurity</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Level</Label>
                            <Select value={input.courseLevel} onValueChange={selectCourseLevel}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a Course Level " />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Course Level</SelectLabel>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Advance">Advance</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Course Price in Pkr</Label>
                            <Input
                                type='number'
                                name='coursePrice'
                                value={input.coursePrice}
                                onChange={changeEventHandler}
                                placeholder='Enter Course Price'
                                className='w-fit' />
                        </div>

                    </div>
                    <div>
                        <Label>Course Thumbnail</Label>
                        <Input
                            type='file'
                            accept='image/*'
                            onChange={selectThumbnail}
                            className="w-fit"
                            placeholder='Enter Course Thumbnail' />
                        {
                            previewThumbnail && (
                                <img src={previewThumbnail}
                                    className="e-64 my-2" alt="course Thumbnail" />
                            )
                        }

                    </div>
                    <div className=''>
                        <Button onClick={() => navigate("/admin/course")} variant='outline'>Cancel</Button>
                        <Button disabled={isLoading} onClick={updateCourseHandler}>
                            {
                                isLoading ? (
                                    <>
                                        <Loader2 className=' mr-2 w-4 h-4 animate-spin' />
                                        please Wait...
                                    </>
                                ) : (
                                    "Save"
                                )
                            }
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default CourseTab