// import Api from "./api.service";
import axios from "axios";
const Api = axios.create({
  baseURL: `http://localhost:8000/api/v1`
})

export const loginAdmin = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await Api.post("/auth_admin/login", payload);
    return data; // { message, access_token, user }
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const getCurrentAdmin = async (token: string) => {
  try {
    const { data } = await Api.get("admin/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("🔎 /admin/me response:", data);
    return data; // either { user: {...} } or {...}
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};
