import { Request, Response } from 'express';
import { GuestDonor, Transaction } from '../models/schema';

// Create a new guest donor
export const createGuestDonor = async (req: Request, res: Response) => {
  try {
    const { name, address, phoneNumber, email, sex, age, medicalCondition, date, time, hospital, profile, bloodType } = req.body;

    let [rawTime, period] = time.split(" "); 
    let [hours, minutes] = rawTime.split(":").map(Number);

    if (period === "PM" && hours !== 12) {
      hours += 12; 
    } else if (period === "AM" && hours === 12) {
      hours = 0; 
    }

    const formattedDate = new Date(`${date} ${hours}:${String(minutes).padStart(2, "0")}`);

    console.log("Converted datetime:", formattedDate);

    if (isNaN(formattedDate.getTime())) {
      return res.status(400).json({ error: "Invalid date or time format." });
    }

    const newGuestDonor = new GuestDonor({
      username: name,
      address,
      phoneNumber,
      email,
      sex ,
      age,
      bloodType,
      doMedicalCondition: medicalCondition == "No" ? false : true,
      date,
      time,
      hospital,
      profile : profile ? profile : null,
    });

    const newGuestDonorSaved = await newGuestDonor.save();
    const guestDonor = newGuestDonorSaved._id;

    const newApplication = new Transaction({
      guestDonor,
      datetime: formattedDate,
      hospital,
      status:'PENDING',
      type: 'GUEST-APPOINTMENT'
    });

    await newApplication.save();
    res.status(200).json({ message: 'Guest Donor created successfully', data: newGuestDonor });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating guest donor', error });
  }
};

// Get all guest donors
export const getGuestDonors = async (req: Request, res: Response) => {
  try {
    const guestDonors = await GuestDonor.find();
    res.status(200).json({ message: 'Guest Donors fetched successfully', data: guestDonors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching guest donors', error });
  }
};

// Get a single guest donor by ID
export const getGuestDonorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Retrieve the guest donor by ID from the database
    const guestDonor = await GuestDonor.findById(id);

    if (!guestDonor) {
      return res.status(404).json({ message: 'Guest Donor not found' });
    }

    res.status(200).json({ message: 'Guest Donor fetched successfully', data: guestDonor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching guest donor', error });
  }
};

// Update a guest donor by ID
export const updateGuestDonor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Find and update the guest donor
    const updatedGuestDonor = await GuestDonor.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedGuestDonor) {
      return res.status(404).json({ message: 'Guest Donor not found' });
    }

    res.status(200).json({ message: 'Guest Donor updated successfully', data: updatedGuestDonor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating guest donor', error });
  }
};

// Delete a guest donor by ID
export const deleteGuestDonor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find and delete the guest donor by ID
    const deletedGuestDonor = await GuestDonor.findByIdAndDelete(id);

    if (!deletedGuestDonor) {
      return res.status(404).json({ message: 'Guest Donor not found' });
    }

    res.status(200).json({ message: 'Guest Donor deleted successfully', data: deletedGuestDonor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting guest donor', error });
  }
};
