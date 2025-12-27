import axios from "axios"
import toast from "react-hot-toast";
import API from "../api/axiosInstance";


export const adminLogin=async(body)=>{
  try{
    const res=await API.post(
      "/api/owner/signIn",
      body
    )
    if (res.status !== 200) {
      throw new Error(res.data?.message || 'Login failed');
    }
    const token=`${Date.now()}`
    localStorage.setItem("gym_token",token);
    toast.success(`Login Successful! Welcome`);
  }
  catch(err){
    const msg=err?.response?.data?.message ||"Login Error"
    console.log("This is the error",msg);
    toast.error(msg);
  }
}

export const adminSignUp=async(formData)=>{
  try{
      
      const fd=new FormData();
      fd.append("name",formData.name)
      fd.append("email",formData.email);
      fd.append("password",formData.password);
      fd.append("cnfpassword",formData.confirmPassword)
      fd.append("phone",formData.phone);
      const res=await API.post(
        "/api/owner/signUp",
        fd
      )
      if (!(res.status === 200)) {
        throw new Error(res.data?.message || 'SignUp failed');
      }
      toast.success('User SignUp complete');
  }
  catch(err){
    const msg=err?.response?.data?.message ||"SignUp Error"
    console.log("This is the error",msg);
    toast.error(msg);;
  }
}

export const adminLogOut=async()=>{
  try{
    localStorage.removeItem('gym_token');
    toast.success('Logged out successfully!');
  }
  catch(err){
    console.log("Error is Logout",err)
  }
}