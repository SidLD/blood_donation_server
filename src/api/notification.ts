// notificationRoutes.ts
import express from 'express';
import { verifyToken } from '../util/verify';  // Assuming verifyToken is a middleware for JWT authentication
import { 
  getNotificationsForDonor, 
  getAllNotifications, 
  deleteNotification 
} from '../controller/notificationController';

const notificationAPI = express.Router();

// Notification Routes
notificationAPI.get('/:donorId', verifyToken, getNotificationsForDonor);  
notificationAPI.get('/', verifyToken, getAllNotifications); 
notificationAPI.delete('/:notificationId', verifyToken, deleteNotification);  

export default notificationAPI;
