import authReducer from "../features/authSlice";
import { combineReducers } from "@reduxjs/toolkit";
import { authApi } from "../features/api/authApi";
import { courseApi } from "@/features/api/courseApi";
import { purchaseApi } from "@/features/api/purchaseApi";
const rootRedcuer = combineReducers({
    [authApi.reducerPath]:authApi.reducer,
    [courseApi.reducerPath]:courseApi.reducer,
    [purchaseApi.reducerPath]:purchaseApi.reducer,
    auth:authReducer, 
});
export default rootRedcuer;