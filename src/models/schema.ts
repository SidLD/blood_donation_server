import { Schema, model } from "mongoose";
import { IAdmin, IApplication, IBloodSupply, IDonor, IEvent, IGuestDonor, IHospital, Iimg, INotification } from "../util/interface";


const donorSchema = new Schema<IDonor>({
  profile: { type: Schema.Types.ObjectId, ref: "Image" },  // Reference to Image schema
  username: { type: String, required: true },
  donorId: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, default: null },
  email: { type: String, default: null },
  sex: { type: String, default: null },
  age: { type: Number, default: null },
  doMedicalCondition: { type: Boolean, default: false },
}, { timestamps: true });

export const Donor = model<IDonor>("Donor", donorSchema);

const guestDonorSchema = new Schema<IGuestDonor>({
  profile: { type: Schema.Types.ObjectId, ref: "Image" },  // Reference to Image schema
  username: { 
    type: String, 
    required: true,
    minlength: 2,  // Min length to match the Zod validation
  },
  address: { 
    type: String, 
    required: true, 
    minlength: 5,  // Ensuring address length is at least 5 characters
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
}, { timestamps: true });


export const GuestDonor = model<IGuestDonor>("GuestDonor", guestDonorSchema);

const hospitalSchema = new Schema<IHospital>(
  {
    user: { type: Schema.Types.ObjectId, refPath: 'userType' }, // Reference to IDonor or IGuestDonor
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Hospital = model("Hospital", hospitalSchema);

const applicationSchema = new Schema<IApplication>(
  {
    user: { type: Schema.Types.ObjectId, refPath: 'userType' }, // Reference to IDonor or IGuestDonor
    date: { type: Date, required: true },
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital" },
  },
  { timestamps: true }
);

export const Application = model("Application", applicationSchema);

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
    path: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: Schema.Types.ObjectId, ref: "Image" }, // Reference to Iimg schema
    user: { type: Schema.Types.ObjectId, ref: "Admin" }, // Reference to Admin
  },
  { timestamps: true }
);

export const Event = model("Event", eventSchema);


const bloodSupplySchema = new Schema<IBloodSupply>(
  {
    date: { type: Date, required: true },  // Date of supply
    quantity: { type: Number, required: true },  // Quantity of blood supplied (e.g., in liters or units)
    bloodType: { type: String, required: true, enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'] },  // Blood type
    hospital: { type: Schema.Types.ObjectId, ref: "Hospital", required: true },  // Reference to hospital that received the blood supply
    donor: { type: Schema.Types.ObjectId, ref: "Donor", required: true },  // Reference to the donor who provided the blood
    status: { type: String, enum: ['PENDING', 'COMPLETED', 'CANCELLED'], default: 'PENDING' },  // Status of the supply
  },
  { timestamps: true }
);

export const BloodSupply = model<IBloodSupply>("BloodSupply", bloodSupplySchema);