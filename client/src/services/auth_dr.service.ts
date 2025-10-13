import axios from "axios";

const Api = axios.create({
  baseURL: `http://localhost:8000/api/v1`
})

export const loginDoctor = async (payload: {
  username: string;
  password: string;
}) => {
  try {
    const { data } = await Api.post("/auth_doctor/login", payload);
    return data; // { message, access_token, user }
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};

export const getCurrentDoctor = async (token: string) => {
  try {
    const { data } = await Api.get("auth_doctor/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("🔎 /auth_doctor/me response:", data);
    return data; // either { user: {...} } or {...}
  } catch (error: any) {
    if (error.code === "ERR_NETWORK") throw error?.message;
    throw error?.response?.data?.error;
  }
};