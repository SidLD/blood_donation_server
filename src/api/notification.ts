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
notificationAPI.get('/:donorId', verifyToken, getNotificationsForDonor);  // Get notifications for a specific donor
notificationAPI.get('/', verifyToken, getAllNotifications);  // Get all notifications (admin or general view)
notificationAPI.delete('/:notificationId', verifyToken, deleteNotification);  // Delete a notification

export default notificationAPI;
