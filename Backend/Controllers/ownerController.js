
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


import bcrypt from 'bcrypt';


const singUp=async(req,res)=>{
  try{
    const {name,email,phone,password,cnfpassword}=req.body;
    if(!email || !name || !phone || !password || !cnfpassword){
      return res.status(403).json({
        success:false,
        message:"All fields are neccssary"
      })
    }
    if(password != cnfpassword){
      return res.status(402).json({
        success:false,
        message:"Password and Confirm Password should be same"
      })
    }
    const detail=await prisma.Owner.findFirst({
      where:{email:email}
    });
    if(detail){
      return res.status(402).json({
        success:false,
        message:"User already exist No need to SingUp"
      })
    }
    const hashedpasswd=await bcrypt.hash(password,10);
    const ownerDetail=await prisma.Owner.create({
      data:{
        name,
        email,
        phNumber:phone,
        password:hashedpasswd
      }
    })
    console.log(ownerDetail);
    res.status(200).json({
      success:true,
      message:"Owner Created Successfully",
      body:ownerDetail
    })
  }
  catch(err){
    res.status(500).json({
      success:false,
      body:err.message,
      message:"Owner Profile not created! Try after sometime"
    })
  }
}

const signIn=async (req,res)=>{
  try{
    const {email,password}=req.body;
    if(!email || !password ){
      return res.status(403).json({
        success:false,
        message:"All field are neccessary"
      })
    } 
    const checkpresence=await prisma.Owner.findFirst({
      where:{email:email}
    });
    if(!checkpresence){
      return res.status(404).json({
        success:false,
        message:"User Does not exist Please Sing Up"
      })
    }
    if(await bcrypt.compare(password,checkpresence.password)){
      return res.status(200).json({
        success:true,
        message:"Log In Successfully"
      })
    }
    else{
      return res.status(400).json({
        success:false,
        message:"Password is Incorrect"
      })
    }
  }
  catch(err){
   res.status(500).json({
      success:false,
      body:err.message,
      message:"LogIn error Please try after Sometime"
    }) 
  }
}

export { singUp, signIn };