import { Request, Response } from 'express';
import { Event } from '../models/schema';
import jwt from 'jsonwebtoken';
// Create an Event
export const createEvent = async (req: any, res: any) => {
  try {
    const { location, title, description, imgUrl, startDate, endDate, post, hospital } = req.body;

    // Validate startDate and endDate
    if (new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be earlier than end date." });
    }

    const newEvent = new Event({
      title,
      description,
      imgUrl,
      location,
      startDate,
      endDate,
      user: req.user.id,
      post,
      hospital
    });

    await newEvent.save();
    res.status(200).json({ message: "Event created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create event." });
  }
};

// Get All Events
export const getEvents = async (req: any, res: Response) => {
  try {
    const {post_type} = req.params;
    let events;
    let hospitalId = null;
    const token = await req.headers['x-access-token']?.split(' ')[1];
    if(token){
        jwt.verify(token,`${process.env.JWT_SECRET}`, async (err: any, decoded: any) => {
            if(!err) {
              console.log(decoded)
              if(decoded.role == 'ADMIN'){
                hospitalId = decoded.hospital
              }else if(decoded.role == 'HOSPITAL'){
                hospitalId = decoded.id
              }
            }
        })
    }
    if(hospitalId){
      if(post_type != 'all') {
        events = await Event.find({ post: post_type == 'true' ? true : false, hospital: hospitalId}).sort({ date: 1 }).populate('user', '-password').populate('hospital');
      }else {
        events = await Event.find({hospital: hospitalId}).sort({ date: 1 }).populate('user', '-password').populate('hospital');
      }
    }else{
      if(post_type != 'all') {
        events = await Event.find({ post: post_type == 'true' ? true : false}).sort({ date: 1 }).populate('user', '-password').populate('hospital');
      }else {
        events = await Event.find({}).sort({ date: 1 }).populate('user', '-password').populate('hospital');
      }
    }
    res.json(events);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

// Update an Event
export const updateEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;
    const { title, description, location, imgUrl, startDate, endDate, post, hospital } = req.body;

    // Validate startDate and endDate if they are provided
    if (startDate && endDate && new Date(startDate) >= new Date(endDate)) {
      return res.status(400).json({ error: "Start date must be earlier than end date." });
    }

    const data: any = { title, description, location, startDate, endDate, post, hospital };
    if (imgUrl) {
      data.imgUrl = imgUrl;
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, data, { new: true });

    if (!updatedEvent) {
      return res.status(400).json({ error: "Event not found." });
    }

    res.json({ message: "Event updated successfully!", event: updatedEvent });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update event." });
  }
};

// Delete an Event
export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const eventId = req.params.id;

    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(400).json({ error: "Event not found." });
    }

    res.json({ message: "Event deleted successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete event." });
  }
};
