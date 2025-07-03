import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";

const USER_API = "http://localhost:8080/api/v1/user/"

export const authApi = createApi({
    reducerPath:"authApi",
    baseQuery:fetchBaseQuery({
        baseUrl:USER_API,
        credentials:'include'
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (inputData) => ({
                url:"register",
                method:"POST",
                body:inputData
            })
        }),
        loginUser: builder.mutation({
            query: (inputData) => ({
                url:"login",
                method:"POST",
                body:inputData
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    if (result.data?.user) {
                        dispatch(userLoggedIn({user:result.data.user}));
                    }
                } catch (error) {
                    console.log("Login error:", error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url:"logout",
                method:"GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try { 
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        loadUser: builder.query({
            query: () => ({
                url:"profile",
                method:"GET"
            }),
            async onQueryStarted(_, {queryFulfilled, dispatch}) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({user:result.data.user}));
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        updateUser: builder.mutation({
            query: (formData) => ({
                url:"profile/update",
                method:"PUT",
                body:formData,
                credentials:"include"
            })
        }),
        requestInstructor: builder.mutation({
            query: () => ({
                url: '/request-instructor',
                method: 'POST',
            }),
        }),
        getPendingInstructors: builder.query({
            query: () => ({
                url: '/pending-instructors',
                method: 'GET',
            }),
        }),
        approveInstructor: builder.mutation({
            query: (userId) => ({
                url: `/approve-instructor/${userId}`,
                method: 'PATCH',
            }),
        }),
        rejectInstructor: builder.mutation({
            query: (userId) => ({
                url: `/reject-instructor/${userId}`,
                method: 'PATCH',
            }),
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: 'all',
                method: 'GET',
            })
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `${userId}`,
                method: 'DELETE',
            })
        }),
    })
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useRequestInstructorMutation,
    useGetPendingInstructorsQuery,
    useApproveInstructorMutation,
    useGetAllUsersQuery,
    useDeleteUserMutation,
    useRejectInstructorMutation,
} = authApi;