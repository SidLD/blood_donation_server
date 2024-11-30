// appController.ts
import { Request, Response } from 'express';
import { Application } from '../models/schema';

// Create an Application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { user, date, hospital } = req.body;

    const newApplication = new Application({
      user,
      date,
      hospital
    });

    await newApplication.save();
    res.status(201).json({ message: "Application created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create application." });
  }
};

// Get All Applications
export const getApplications = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};