/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { IAdmin , IDonor, IDonorNumber} from "../util/interface";
import { Admin, Donor, DonorNumber } from "../models/schema";

export const generateDonorNumber = async (req: any, res: any) => {
    try {
      const { donorId } = req.body;  // Retrieve donorId from the request body
      const params: IDonorNumber = req.body; // Assuming body contains IDonorNumber data
  
      // Check if donor number already exists and is verified
      const donorNumberData: IDonorNumber | null = await DonorNumber.findOne({ donorId });
      if (donorNumberData?.isVerified) {
        return res.status(400).json({ error: 'Donor ID is already used' });
      }
  
      // Check if the donor already exists in the Donor collection
      const user: IDonor | null = await Donor.findOne({ donorId: params.donorId });
      if (user) {
        return res.status(400).json({ error: 'Donor Already Exist' });
      }
  
      // Create a new donor number if validations pass
      const newDonorNumber = await DonorNumber.create({ donorId, hospital: req.user.id });
      res.status(200).send({ newDonorNumber });
    } catch (error: any) {
      console.log(error.message);
      res.status(400).send({ message: 'Invalid Data' });
    }
};
  
export const deleteDonorNumber = async (req: any, res: any) => {
    try {
      const { donorId } = req.body;  // Get donorId from the body
      const hospital = req.user.id
      // Check if the donor number exists and is verified
      const donorNumberData: IDonorNumber | null = await DonorNumber.findOne({ _id: donorId , hospital});
      if (donorNumberData?.isVerified) {
        return res.status(400).json({ error: 'Donor ID is already used and cannot be deleted' });
      }
  
      const donorNumber = await DonorNumber.findOne({ _id: donorId , hospital});
      if (!donorNumber) {
        return res.status(400).json({ error: 'Donor number not found' });
      }
      // Find the donor record to delete
      console.log(donorNumberData,donorId)
      await DonorNumber.findByIdAndDelete(donorNumber._id)

  
      res.status(200).send({ donorNumber , hospital});
    } catch (error: any) {
      console.log(error.message);
      res.status(400).send({ message: 'Invalid Data' });
    }
};
  
export const getDonorNumber = async (req: any, res: any) => {
    try {
      // Retrieve all donor numbers
      const donorNumberData: IDonorNumber[] = await DonorNumber.find({hospital: req.user.id});
  
      if (!donorNumberData) {
        return res.status(404).json({ error: 'No donor numbers found' });
      }
  
      res.status(200).send({ donorNumberData });
    } catch (error: any) {
      console.log(error.message);
      res.status(400).send({ message: 'Error fetching donor numbers' });
    }
};

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

        const donorNumber:IDonorNumber | null = await DonorNumber.findOne({donorId: params.donorId})
        if(donorNumber?.isVerified){
            return res.status(400).json({ error: 'Donor ID is already used' });
        }

        if(!donorNumber){
            return res.status(400).json({ error: 'Donor ID not Found' });
        }

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
        await DonorNumber.findByIdAndUpdate(donorNumber._id, {
            isUsed: true,
            isVerified: true
        })
        res.status(200).send({newUser})

  } catch (error: any) {
      console.log(error.message)
      res.status(400).send({message:"Invalid Data"})
  }
}

export const getAdmins = async (req: any, res: any) => {
    try {
        const users:IAdmin[] = await Admin.find({}).select('-password');
        res.status(200).send(JSON.stringify(users))
    } catch (error: any) {
        console.log(error.message)
        res.status(400).send({message:"Error while Fetching Donors"})
    }
}

export const getAdminDonor = async (req: any, res: any) => {
  try {
    const hospitalId = req.user.id; 
    const donors = await Donor.aggregate([
      {
        $lookup: {
          from: 'donornumbers', 
          localField: 'donorId', 
          foreignField: 'donorId', 
          as: 'donorNumbers', 
        },
      },
      {
        $unwind: '$donorNumbers', 
      },
      {
        $match: {
          'donorNumbers.hospital': new mongoose.Types.ObjectId(hospitalId), 
        },
      },
      {
        $project: {
          password: 0, 
        },
      },
    ]);

    res.status(200).json(donors);
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send({ message: "Error while fetching donors" });
  }
};

export const getAdminDonorByCategory = async (req: any, res: any) => {
  try {
    const hospitalId = req.user.id; 

    const donors = await Donor.aggregate([
      {
        $lookup: {
          from: "transactions",
          localField: "_id",
          foreignField: "user",
          as: "transactions",
        },
      },
      {
        $lookup: {
          from: "donornumbers",
          localField: "donorId",
          foreignField: "donorId",
          as: "donorNumbers",
        },
      },
      {
        $unwind: "$donorNumbers",
      },
      {
        $match: {
          "donorNumbers.hospital": new mongoose.Types.ObjectId(hospitalId),
        },
      },
      {
        $addFields: {
          isCertified: {
            $cond: {
              if: { $gt: [{ $size: "$transactions" }, 0] },
              then: true,
              else: false,
            },
          },
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          bloodType: 1,
          phoneNumber: 1,
          status: 1,
          isCertified: 1,
          transactions: 1,
          donorNumbers: 1,
        },
      },
    ]);

    const categorizedDonors = donors.map((donor) => ({
      ...donor
    }));

    res.status(200).json(categorizedDonors);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error while fetching donor statuses" });
  }
};


export const loginAdmin = async (req: any, res: any) => {
  try {
      const params:any = req.body
      const user: IAdmin | null = await Admin.findOne({
        $expr: {
          $and: [
            { $eq: [{ $toLower: "$username" }, params.username.toLowerCase()] },
            { $eq: [{ $toLower: "$license" }, params.license.toLowerCase()] },
          ],
        },
      });      
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
      const user: IDonor | null = await Donor.findOne({
        $expr: {
          $and: [
            { $eq: [{ $toLower: "$donorId" }, params.donorId.toLowerCase()] },
            { $eq: [{ $toLower: "$username" }, params.username.toLowerCase()] },
          ],
        },
      });
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

export const updateDonorSetting = async (req: any, res: any) => {
  try {
    const { user } = req;
    const { email, name, phoneNumber } = req.body; 

    const updatedDonor = await Donor.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(user.id) },
      { email, name, phoneNumber }, 
      { new: true, runValidators: true }
    ).select('-password'); 

    if (!updatedDonor) {
      return res.status(404).send({ message: 'Donor not found' });
    }

    res.status(200).json(updatedDonor);
  } catch (error: any) {
    console.log(error.message);
    res.status(400).send({ message: 'Error in updating Donor Settings' });
  }
};

export const updateDonorPassword = async (req: any, res: any) => {
  try {
    const { user } = req;
    const { currentPassword, confirmPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).send({ message: 'Current password, new password, and confirm password are required' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({ message: 'New password and confirm password do not match' });
    }

    const donor = await Donor.findOne({ _id: new mongoose.Types.ObjectId(user.id) });

    if (!donor) {
      return res.status(404).send({ message: 'Donor not found' });
    }

    // Check if current password is correct
    const isMatch = await bcrypt.compare(currentPassword, donor.password);
    if (!isMatch) {
      return res.status(400).send({ message: 'Current password is incorrect' });
    }

    // Hash new password and update it
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    donor.password = hashedPassword;

    await donor.save();

    res.status(200).send({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.log(error.message);
    res.status(400).send({ message: 'Error in updating Donor Password' });
  }
};

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