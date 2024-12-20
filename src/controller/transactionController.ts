// appController.ts
import { Request, Response } from 'express';
import { Transaction } from '../models/schema';

// Create an Application
export const createApplication = async (req: Request, res: Response) => {
  try {
    const { user, date, hospital } = req.body;

    const newApplication = new Transaction({
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
    const applications = await Transaction.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId} = req.params;
    const { params } = req.body;

    const app = await Transaction.findByIdAndUpdate(applicationId, {
      ...params
    }, {new: true})

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ error: "Failed to create application." });
  }
};

export const updateApplicationStatus = async (req: Request, res: Response) => {
  try {
    const { applicationId} = req.params;
    const { status } = req.body;

    const app = await Transaction.findByIdAndUpdate(applicationId, {
      status
    }, {new: true})

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ error: "Failed to create application." });
  }
};


export const deleteApplication = async (req: any, res: Response) => {
  try {
    if(req.user.role != 'ADMIN') {
      return  res.status(400).json({ error: "Access Denied" });

    }
    const { applicationId } = req.params;

    const app = await Transaction.findByIdAndDelete(applicationId)

    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ error: "Failed to create application." });
  }
};


