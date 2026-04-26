import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${Cookies.get("admin_token")}` },
});

export const loginAdmin = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await Api.post("auth_admin/login", payload);
    return data; // { message, access_token, user }
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const getCurrentAdmin = async () => {
  try {
    const { data } = await Api.get("admin/me", authHeaders());
    return data; // either { user: {...} } or {...}
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const updateAdminProfile = async (formData: FormData) => {
  try {
    const { data } = await Api.put("admin/update-profile", formData, {
      headers: {
        Authorization: `Bearer ${Cookies.get("admin_token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};
