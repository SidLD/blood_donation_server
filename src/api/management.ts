// appRoutes.ts
import express from 'express';
import dotenv from 'dotenv';
import { verifyToken } from '../util/verify';  
import { createApplication, getApplications } from '../controller/applicationController';
import { createEvent, getEvents } from '../controller/eventController';
import { createBloodSupply, getBloodSupplies } from '../controller/hospital';

dotenv.config();

const appAPI = express.Router();

// Application Routes
appAPI.post('/application', verifyToken, createApplication);  // Create an application
appAPI.get('/applications', verifyToken, getApplications);    // Get all applications

// Event Routes
appAPI.post('/event', verifyToken, createEvent);              // Create an event
appAPI.get('/events', getEvents);                              // Get all events

// Blood Supply Routes
appAPI.post('/blood-supply', verifyToken, createBloodSupply);  // Create a blood supply record
appAPI.get('/blood-supplies', getBloodSupplies);               // Get all blood supplies

export default appAPI;
