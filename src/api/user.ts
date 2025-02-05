import express from 'express'
import dotenv from 'dotenv'
import { verifyToken } from '../util/verify';
import { deleteDonorNumber, generateDonorNumber, getAdminDonor, getAdminDonorByCategory, getAdmins, getAdminSetting, getDonorNumber, getDonorSetting, getHospitals, loginAdmin, loginDonor, loginSuperAdmin, registerAdmin, registerDonor, registerHospital, registerSuperAdmin, updateDonorPassword, updateDonorSetting, updateHospital } from '../controller/userController';
import { createGuestDonor, deleteGuestDonor, getGuestDonorById, updateGuestDonor } from '../controller/guestDonorController';
dotenv.config()
const userAPI = express()
//Donor Number
userAPI.post('/generate-donor-number', verifyToken, generateDonorNumber);
userAPI.get('/generate-donor-number', verifyToken, getDonorNumber);
userAPI.delete('/generate-donor-number', verifyToken, deleteDonorNumber);

//Donor
userAPI.post('/register-donor', registerDonor);
userAPI.post('/login-donor', loginDonor);
userAPI.get('/donor/setting', verifyToken ,getDonorSetting);
userAPI.put('/donor/setting', verifyToken ,updateDonorSetting);
userAPI.put('/donor/password', verifyToken ,updateDonorPassword);

//Guest Donor
userAPI.post('/guest-donor', createGuestDonor);
userAPI.get('/guest-donors', getGuestDonorById);
userAPI.get('/guest-donors/:id', getGuestDonorById);
userAPI.put('/guest-donors/:id', updateGuestDonor);
userAPI.delete('/guest-donors/:id', deleteGuestDonor);

//Admin
userAPI.get('/admin/donors', verifyToken, getAdminDonor);
userAPI.get('/admin/donors/category', verifyToken, getAdminDonorByCategory);
userAPI.get('/admin', getAdmins);
userAPI.post('/register-admin', registerAdmin);
userAPI.post('/login-admin', loginAdmin);
userAPI.get('/admin/setting', verifyToken ,getAdminSetting);

//Super Admin
userAPI.post('/register-super-admin', verifyToken, registerSuperAdmin);
userAPI.post('/login-super-admin', loginSuperAdmin);

//Hospital
userAPI.get('/hospitals', getHospitals);
userAPI.post('/hospitals', verifyToken, registerHospital);
userAPI.put('/hospitals/:hospitalId', verifyToken, updateHospital);


export default userAPI