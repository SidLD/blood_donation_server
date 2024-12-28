// appRoutes.ts
import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../util/verify';  
import {   createDonorApplication, createHospitalApplication, deleteApplication, getDonorApplication, getHospitalApplications, getHospitalCalendar, updateApplication, updateApplicationStatus } from '../controller/transactionController';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../controller/eventController';

dotenv.config();

const appAPI = express.Router();

// Application Routes
appAPI.post('/donor/application', verifyToken, createDonorApplication);  
appAPI.get('/donor/applications', verifyToken, getDonorApplication);    

appAPI.post('/hospital/application', verifyToken, createHospitalApplication);  
appAPI.get('/hospital/applications', verifyToken, getHospitalApplications);    

appAPI.get('/hospital/calendar', verifyToken, getHospitalCalendar); 

appAPI.put('/application/:applicationId', verifyToken, updateApplication);  


appAPI.put('/application-status/:applicationId', verifyToken, updateApplicationStatus); 
appAPI.delete('/application-status/:applicationId', verifyToken, deleteApplication);  

// Event Routes
appAPI.post('/event', verifyToken, createEvent);              // Create an event
appAPI.get('/events', getEvents);    
appAPI.put('/event/:id', verifyToken, updateEvent);                             // Get all events
appAPI.delete('/event/:id', verifyToken, deleteEvent);     


export default appAPI;
