import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const authHeaders = (role: string = 'patient') => {
  const tokenName = role === 'admin' ? 'admin_token' : role === 'doctor' ? 'doctor_token' : 'token';
  return {
    headers: { Authorization: `Bearer ${Cookies.get(tokenName)}` },
  };
};

export const loginUser = async (payload: {
  username: string;
  password: string;
}) => {
  const { username, password } = payload;
  try {
    const { data } = await Api.post("/auth/login", { username, password });
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const registerUser = async (payload: {
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  const { username, email, password, password_confirmation } = payload;
  try {
    const { data } = await Api.post("auth/register", {
      username,
      email,
      password,
      password_confirmation,
    });
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data } = await Api.get("user/me", authHeaders());
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const updateUserProfile = async (formData: FormData) => {
  try {
    const { data } = await Api.put("/user/update-profile", formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const forgotPassword = async (email: string, role: string = 'patient') => {
  const endpoint = role === 'admin' ? '/auth_admin' : role === 'doctor' ? '/auth_doctor' : '/auth';
  try {
    const { data } = await Api.post(`${endpoint}/forgot-password`, { email });
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const resetPassword = async (payload: { email: string; token: string; password: string; password_confirmation: string; role?: string }) => {
  const role = payload.role || 'patient';
  const endpoint = role === 'admin' ? '/auth_admin' : role === 'doctor' ? '/auth_doctor' : '/auth';
  try {
    const { data } = await Api.post(`${endpoint}/reset-password`, payload);
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const changePassword = async (payload: { oldPassword: string; newPassword: string; confirmPassword: string; role?: string }) => {
  const role = payload.role || 'patient';
  const endpoint = role === 'admin' ? '/auth_admin' : role === 'doctor' ? '/auth_doctor' : '/auth';
  try {
    const { data } = await Api.post(`${endpoint}/change-password`, payload, authHeaders(role));
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};