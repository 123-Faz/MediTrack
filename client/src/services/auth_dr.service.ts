import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("doctor_token")}` },
});

export const loginDoctor = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await Api.post("auth_doctor/login", payload);
    return data; // { message, access_token, user }
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const getCurrentDoctor = async () => {
  try {
    const { data } = await Api.get("auth_doctor/me", authHeaders());
    return data; // either { user: {...} } or {...}
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const updateDoctorProfile = async (formData: FormData) => {
  try {
    const { data } = await Api.put("auth_doctor/update-profile", formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("doctor_token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};