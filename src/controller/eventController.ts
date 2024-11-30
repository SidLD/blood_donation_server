// appController.ts
import { Request, Response } from 'express';
import { Event } from '../models/schema';

// Create an Event
export const createEvent = async (req: Request, res: Response) => {
  try {
    const { path, title, description, img, user } = req.body;

    const newEvent = new Event({
      path,
      title,
      description,
      img,
      user
    });

    await newEvent.save();
    res.status(201).json({ message: "Event created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create event." });
  }
};

// Get All Events
export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await Event.find().populate('img').populate('user');
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
};