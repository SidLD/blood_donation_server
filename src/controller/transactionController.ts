// appController.ts
import { Request, Response } from 'express';
import { Transaction } from '../models/schema';
import mongoose from 'mongoose';

// Create an Application
export const createDonorApplication = async (req: any, res: Response) => {
  try {
    const {  datetime, hospital, status } = req.body;
    const user = req.user.id;
    // Validate required fields
    if (!datetime || !hospital || !status) {
      return res.status(400).json({ error: "All fields are required: datetime, hospital, and status." });
    }
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Unauthorized: User information is missing." });
    }
    const newApplication = new Transaction({
      user,
      datetime,
      hospital,
      status
    });

    await newApplication.save();
    res.status(201).json({ message: "Application created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create application." });
  }
};


export const createHospitalApplication = async (req: any, res: Response) => {
  try {
    const {  datetime, status, user } = req.body;
    const hospital = req.user.id;
    // Validate required fields
    if (!datetime || !hospital || !status) {
      return res.status(400).json({ error: "All fields are required: datetime, hospital, and status." });
    }
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Unauthorized: User information is missing." });
    }
    const newApplication = new Transaction({
      user,
      datetime,
      hospital,
      status
    });

    await newApplication.save();
    res.status(201).json({ message: "Application created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create application." });
  }
};

// Get All Applications
export const getHospitalApplications = async (req: any, res: Response) => {
  try {
    const user = req.user.id;
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Unauthorized: User information is missing." });
    }
    console.log(user)
    const applications = await Transaction.find({hospital: user}).populate('hospital', 'address username')
    .sort({ datetime: 1 }); 
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

export const getHospitalCalendar = async (req: any, res: Response) => {
  try {
    const hospital = req.user.id;
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ error: "Month and year are required for filtering." });
    }

    const startOfMonth = new Date(`${year}-${month}-01`);
    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);

    const events = await Transaction.find({
      hospital,
      datetime: { $gte: startOfMonth, $lt: endOfMonth },
      status: { $ne: "canceled" },
    }).populate('user', '-password').sort({ datetime: 1 });

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch calendar events." });
  }
};

export const getDonorApplication = async (req: any, res: Response) => {
  try {
    const user = req.user.id;
    if (!req.user || !req.user.id) {
      return res.status(400).json({ error: "Unauthorized: User information is missing." });
    }
    const applications = await Transaction.find({user: user}).populate('hospital', 'address username')
    .sort({ datetime: 1 });   
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch applications." });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    const { applicationId } = req.params;
    const updates = req.body;

    // Validate applicationId
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      return res.status(400).json({ error: "Invalid application ID." });
    }

    // Ensure updates object is not empty
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No update data provided." });
    }

    // Update the application and populate related fields
    const updatedApplication = await Transaction.findByIdAndUpdate(
      applicationId,
      { ...updates },
      { new: true, runValidators: true }
    ).populate("hospital");

    // Handle case where application is not found
    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found." });
    }

    res.status(200).json({ message: "Application updated successfully!", data: updatedApplication });
  } catch (error: any) {
    console.error("Error updating application:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: "Invalid data provided." });
    }

    res.status(400).json({ error: "Failed to update application. Please try again later." });
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


