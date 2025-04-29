import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Auth_State, Auth_User } from "../../types/user.type";
import { RootState } from "../store";

const initialState: Auth_State = {
    currentUser: null,
    isLoggedIn: false,
    isSetOtpModelOpen: false
};


export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<Auth_User>) => {
            state.currentUser = action.payload;
        },
        setUserLoggeIn: (state, action) => {
            state.isLoggedIn = action.payload
        },
        setIsSetOtpModelOpen: (state, action) => {
            state.isSetOtpModelOpen = action.payload
        },
        setLogout: (state) => {
            state.currentUser = null
            state.isLoggedIn = false;
            state.isSetOtpModelOpen = false
        },
        setProfilePicture: (state, action: PayloadAction<string>) => {
            if (state.currentUser) {
                state.currentUser.profilePicture = action.payload;
            }
        },
    }
});


export const { setCredentials, setLogout, setUserLoggeIn, setIsSetOtpModelOpen, setProfilePicture } = authSlice.actions;
export default authSlice.reducer;


export const currentUser = (state: RootState) => state.auth.currentUser
export const isUserLoggedIn = (state: RootState) => state.auth.isLoggedIn
export const isSetOtpModelOpen = (state: RootState) => state.auth.isSetOtpModelOpen