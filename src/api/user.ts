import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { getAdminSetting, getDonors, getDonorSetting, loginAdmin, loginDonor, registerAdmin, registerDonor } from '../controller/userController';
import { createGuestDonor, deleteGuestDonor, getGuestDonorById, updateGuestDonor } from '../controller/guestDonorController';
dotenv.config()
const userAPI = express()
//Donor
userAPI.post('/register-donor', registerDonor);
userAPI.post('/login-donor', loginDonor);
userAPI.get('/donor/setting', verifyToken ,getDonorSetting);

//Guest Donor
userAPI.post('/guest-donor', createGuestDonor);
userAPI.get('/guest-donors', getGuestDonorById);
userAPI.get('/guest-donors/:id', getGuestDonorById);
userAPI.put('/guest-donors/:id', updateGuestDonor);
userAPI.delete('/guest-donors/:id', deleteGuestDonor);


//Admin
userAPI.post('/register-admin', registerAdmin);
userAPI.post('/login-admin', loginAdmin);
userAPI.get('/admin/donors', verifyToken ,getDonors);
userAPI.get('/admin/setting', verifyToken ,getAdminSetting);


export default userAPI