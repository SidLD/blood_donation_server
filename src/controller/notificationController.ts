// notificationController.ts
import { Request, Response } from 'express';
import { Notification } from '../models/schema';
import { emitNotification } from '../util/socket';

// Create a Notification
export const createNotification = async (data:any) => {
  try {
    const { user, path, title, description } = data;

    const newNotification = new Notification({
      user,
      path,
      title,
      description
    });

    await newNotification.save();

    await emitNotification(newNotification)

  } catch (error) {
    console.log(error)
  }
};

// Get All Notifications for a specific donor
export const getNotificationsForDonor = async (req: Request, res: Response) => {
  try {
    const donorId = req.params.donorId;  // Assuming donorId is passed as a URL parameter

    const notifications = await Notification.find({ user: donorId })
      .populate('user')  // Populate the Donor information
      .exec();

    if (!notifications) {
      return res.status(404).json({ message: "No notifications found for this donor." });
    }

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

// Get All Notifications (admin view or general list)
export const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find()
      .populate('user')  // Populate the Donor information
      .exec();

    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications available." });
    }

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications." });
  }
};

// Delete a Notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.notificationId;  // Assuming notificationId is passed as a URL parameter

    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    res.json({ message: "Notification deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete notification." });
  }
};
