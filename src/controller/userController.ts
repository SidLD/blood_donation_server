/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IAdmin , IDonor} from "../util/interface";
import { Admin, Donor } from "../models/schema";

export const registerAdmin = async (req: any, res: any) => {
    try {
        const { profile } = req.body;
        const params: IAdmin = req.body
        const user:IAdmin | null = await Admin.findOne({license: params.license})
        if(user){
          return res.status(400).json({ error: 'License Already Used' });
        }

        const password = params.password ? params.password.toString() : 'password';
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await Admin.create({
          username:params.username,
          license: params.license,
          address: params.address,
          password: hashedPassword,
          profile: profile ? profile : null
        })
        res.status(200).send({newUser})
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Invalid Data"})
    }
}

export const registerDonor = async (req: any, res: any) => {
  try {
      const { profile , role } = req.body;
        const params: IDonor = req.body
        const user:IDonor | null = await Donor.findOne({donorId: params.donorId})
        if(user){
          return res.status(400).json({ error: 'Donor Already Exist' });
        }

        const password = params.password ? params.password.toString() : 'password';
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await Donor.create({
          ...params,
          password: hashedPassword,
          profile: profile ? profile : null
        })
        res.status(200).send({newUser})

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data"})
  }
}

export const loginAdmin = async (req: any, res: any) => {
  try {
      const params:any = req.body
      const user:IAdmin | null = await Admin.findOne({ username: params.username, license: params.license })
      if(user){
          const isMatch = await bcrypt.compare(params.password, user.password.toString())
          if(isMatch){
              const payload = {
                  id: user._id,
                  role: 'ADMIN',
                  username: user.username,
                  license : user.license
              };
              jwt.sign(
                  payload,
                  `${process.env.JWT_SECRET}`,
                  { expiresIn: "12hr" },
                  async (err, token) => {
                      if(err){
                          res.status(400).send({message: err.message})
                      }else{
                          res.status(200).send({token: token})
                      }
                  }
              )  
          }else{
              res.status(400).send({ok:false, message:"Incorrect Username or Password" })
          }
      }else{
          res.status(400).send({message:"Incorrect Username or Password" })
      }
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const loginDonor = async (req: any, res: any) => {
  try {
      const params:IDonor = req.body
      const user:IDonor | null = await Donor.findOne({ donorId: params.donorId, username: params.username })
      if(user){
          const isMatch = await bcrypt.compare(params.password, user.password.toString())
          if(isMatch){
              const payload = {
                  id: user._id,
                  role: 'DONOR',
                  username: user.username,
                  donorId: user.donorId
              };
              jwt.sign(
                  payload,
                  `${process.env.JWT_SECRET}`,
                  { expiresIn: "12hr" },
                  async (err, token) => {
                      if(err){
                          res.status(400).send({message: err.message})
                      }else{
                          res.status(200).send({token: token})
                      }
                  }
              )  
          }else{
              res.status(400).send({ok:false, message:"Incorrect Email or Password" })
          }
      }else{
          res.status(400).send({message:"Donor not found" })
      }
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data or Email Already Taken"})
  }
}

export const getDonors = async (req: any, res: any) => {
    try {
        const users:IDonor[] = await Donor.find({}).select('-password');
        res.status(200).send(JSON.stringify(users))
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Error while Fetching Donors"})
    }
}

export const getDonorSetting = async (req: any, res: any) => {
  try {
      const {user} = req;
      const data:IDonor = await Donor.findOne({
        _id : new mongoose.Types.ObjectId(user.id)
      }).select('-password');
      res.status(200).send(JSON.stringify(data))
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Error in fetching Donor Data"})
  }
}

export const getAdminSetting = async (req: any, res: any) => {
  try {
      const {user} = req;
      const data:IAdmin = await Admin.findOne({
        _id : new mongoose.Types.ObjectId(user.id)
      }).select('-password');
      res.status(200).send(JSON.stringify(data))
  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Error in fetching Admin Data"})
  }
}