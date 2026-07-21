import axios from "axios";
import toast from "react-hot-toast";
import { navigateTo } from "./navigation.js";

const BASE_URL = "http://localhost:4000/api/owner";

export const checkOwnerExists = async () => {
  const res = await axios.get(`${BASE_URL}/exists`);
  return res.data.exists;
};

export const adminLogin = async (body) => {
  try {
    const res = await axios.post(`${BASE_URL}/signIn`, body);

    localStorage.setItem("gym_token", "logged_in");
    toast.success("Login successful");
    return true;

  } catch (err) {
    const msg = err?.response?.data?.message || "Login error";
    toast.error(msg);
    return false;
  }
};

export const adminSignUp = async (data) => {
  try {
    
    await axios.post(`${BASE_URL}/signUp`, {
      userName: data.userName,
      password: data.password,
      cnfpassword: data.confirmPassword
    });

    toast.success("Setup complete");
    return true;

  } catch (err) {
    const msg = err?.response?.data?.message || "Setup error";
    toast.error(msg);
    return false;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("gym_token");
};

export const adminLogOut = () => {
  localStorage.removeItem("gym_token");
  toast.success("Logged out successfully");
  navigateTo("/setup");
};