// appRoutes.ts
import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../util/verify';  
import { createApplication, deleteApplication, getApplications, updateApplication, updateApplicationStatus } from '../controller/transactionController';
import { createEvent, deleteEvent, getEvents, updateEvent } from '../controller/eventController';

dotenv.config();

const appAPI = express.Router();

// Application Routes
appAPI.post('/application', verifyToken, createApplication);  // Create an application
appAPI.get('/applications', verifyToken, getApplications);    // Get all applications
appAPI.put('/application/:applicationId', verifyToken, updateApplication);  
appAPI.put('/application-status/:applicationId', verifyToken, updateApplicationStatus);  
appAPI.delete('/application-status/:applicationId', verifyToken, deleteApplication);  

// Event Routes
appAPI.post('/event', verifyToken, createEvent);              // Create an event
appAPI.get('/events', getEvents);    
appAPI.put('/event/:id', verifyToken, updateEvent);                             // Get all events
appAPI.delete('/event/:id', verifyToken, deleteEvent);     


export default appAPI;
