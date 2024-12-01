// appController.ts
import { Request, Response } from 'express';
import { Event } from '../models/schema';

// Create an Event
export const createEvent = async (req: any, res: any) => {
  try {
    const { location, title, description, imgUrl, date } = req.body;

    const newEvent = new Event({
      title,
      description,
      imgUrl,
      location,
      date,
      user: req.user.id
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
    const events = await Event.find().sort({ date: 1 }).populate('user', '-password');
    res.json(events);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const { title, description, location, imgUrl, date } = req.body;
    let data:any = { title, description, location, date }
    if(imgUrl){
      data.imgUrl = imgUrl
    }
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      data,
      { new: true } 
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update event." });
  }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found." });
    }

    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete event." });
  }
};