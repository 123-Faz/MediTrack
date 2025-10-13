import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./types";
import Cookies from "js-cookie";

interface DoctorI {
  email: string;
  id: number;
  role: string;
  username: string;
  _id: string;
  name: string;
  specialization: string;
  phoneNumber: string;
  experience: number;
  consultationFee: number;
  hospital?: string;
  status: boolean;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthDoctorState {
  user: DoctorI | null;
  token: string | undefined;
}

// restore user from localStorage if available
const savedUser = localStorage.getItem("doctor_user");

const initialState: AuthDoctorState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  token: Cookies.get("doctor_token"),
};

export const authDoctorSlice = createSlice({
  name: "auth_doctor",
  initialState,
  reducers: {
    setDoctorCredentials: (state, action) => {
      console.log("🔑 Doctor login payload in slice:", action.payload);

      state.user = action.payload.user;
      state.token = action.payload.access_token;

      Cookies.set("doctor_token", action.payload.access_token, {
        expires: 1,
        secure: import.meta.env.VITE_NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      localStorage.setItem("doctor_user", JSON.stringify(action.payload.user));

      console.log("✅ Token saved in Redux:", state.token);
      console.log("✅ Token saved in cookie:", Cookies.get("doctor_token"));
    },

    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("doctor_user", JSON.stringify(action.payload));
    },

    doctorLogout: (state) => {
      state.user = null;
      state.token = undefined;
      Cookies.remove("doctor_token", { path: "/" });
      localStorage.removeItem("doctor_user");
    },
  },
});

export const { setUser, setDoctorCredentials, doctorLogout } = authDoctorSlice.actions;

// ✅ selectors
export const getDoctor = (state: RootState) => state.auth_doctor.user;
export const getAuthDoctorToken = (state: RootState) => state.auth_doctor.token;

export default authDoctorSlice.reducer;