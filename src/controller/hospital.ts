// appController.ts
import { Request, Response } from 'express';
import { BloodSupply } from '../models/schema';


// Create a Blood Supply Record
export const createBloodSupply = async (req: Request, res: Response) => {
  try {
    const { date, quantity, bloodType, hospital, donor, status } = req.body;

    const newBloodSupply = new BloodSupply({
      date,
      quantity,
      bloodType,
      hospital,
      donor,
      status
    });

    await newBloodSupply.save();
    res.status(201).json({ message: "Blood supply record created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create blood supply record." });
  }
};

// Get All Blood Supplies
export const getBloodSupplies = async (req: Request, res: Response) => {
  try {
    const bloodSupplies = await BloodSupply.find().populate('hospital').populate('donor');
    res.json(bloodSupplies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blood supplies." });
  }
};
