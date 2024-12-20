import { Schema, model } from "mongoose";
import { IAdmin, ITransaction, IBloodSupply, IDonor, IEvent, IGuestDonor, Iimg, INotification, IDonorNumber } from "../util/interface";

const donorNumberSchema = new Schema<IDonorNumber>({
  donorId: { type: String, required: true, unique: true },
  isUsed: {type: Boolean, default: false},
  isVerified: {type: Boolean, default: false}
}, { timestamps: true });

export const DonorNumber = model<IDonorNumber>("DonorNumber", donorNumberSchema);

const donorSchema = new Schema<IDonor>({
  profile: { type: Schema.Types.ObjectId, ref: "Image" },  // Reference to Image schema
  username: { type: String, required: false },
  donorId: { type: String, required: true, unique: true },
  address: { type: String, required: false },
  bloodType: { type: String, required: true },
  password: { type: String, required: false },
  phoneNumber: { type: String, default: null },
  email: { type: String, default: null },
  sex: { type: String, default: null },
  age: { type: Number, default: null },
  doMedicalCondition: { type: Boolean, default: false },
  transactions: [
    { type: Schema.Types.ObjectId, ref: "Transaction" }
  ],
  status: {type: String, default: 'INACTIVE'}
}, { timestamps: true });

export const Donor = model<IDonor>("Donor", donorSchema);

const guestDonorSchema = new Schema<IGuestDonor>({
  profile: { type: Schema.Types.ObjectId, ref: "Image" },  
  username: { 
    type: String, 
    required: true,
    minlength: 2,  
  },
  address: { 
    type: String, 
    required: true, 
    minlength: 5,
  },
  phoneNumber: { 
    type: String, 
  },
  email: { 
    type: String, 
    required: true, 
    match: /^\S+@\S+\.\S+$/,  // Basic email regex validation
  },
  sex: { 
    type: String, 
    required: true, 
    enum: ['M', 'F'],  // Ensure 'sex' can only be 'M' or 'F'
  },
  age: { 
    type: Number, 
    required: true, 
    min: 1,  // Ensure the age is a number and is required
  },
  doMedicalCondition: { 
    type: Boolean, 
    required: true,  // Boolean for medical condition (true or false)
  },
  date: Date,
  time: { 
    type: String, 
    required: true,  // Time must be required
  },
  hospital: { 
    type: String, 
    required: true,  // Hospital must be required
  },
  bloodType: { type: String, required: true },
}, { timestamps: true });


export const GuestDonor = model<IGuestDonor>("GuestDonor", guestDonorSchema);

const transactionSchema = new Schema<ITransaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Donor' }, 
    date: { type: Date, required: true },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },
  },
  { timestamps: true }
);

export const Transaction = model("Transaction", transactionSchema);

const adminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true },
    license: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: "Image" }, // Reference to Iimg schema
  },
  { timestamps: true }
);

export const Admin = model("Admin", adminSchema);

const imgSchema = new Schema<Iimg>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Donor" }, // Reference back to Donor (IDonor)
    path: { type: String, required: true },
    name: { type: String, required: true },
    imageType: { type: String, required: true },
    fullPath: { type: String, required: true },
  },
  { timestamps: true }
);

export const Image = model("Image", imgSchema);

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Donor" }, // Reference to Donor (IDonor)
    path: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

export const Notification = model("Notification", notificationSchema);

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imgUrl:  { type: String, required: true },
    location:  { type: String, required: true },
    startDate: Date,
    endDate: Date,
    user: { type: Schema.Types.ObjectId, ref: "Admin" }, // Reference to Admin
  },
  { timestamps: true }
);

export const Event = model("Event", eventSchema);
