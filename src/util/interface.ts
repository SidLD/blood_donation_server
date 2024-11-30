

export interface IDonor {
    _id: string | undefined;
    profile?: Iimg;
    username: string;
    donorId: string;
    address: string;
    password: string;
    phoneNumber?: string;
    email?: string;
    sex?: string,
    age?: number,
    doMedicalCondition?: Boolean
}

export interface IGuestDonor {
    _id: string | undefined;
    profile?: Iimg;
    username: string;
    address: string;
    phoneNumber: string;
    email: string;
    sex: string,
    age: number,
    date: Date,
    time: string,
    hospital: string,
    doMedicalCondition: Boolean
}

export interface IHospital {
    _id: string | undefined;
    user: IDonor | IGuestDonor;
    date: Date;
}

export interface IApplication {
    _id: string | undefined;
    user: IDonor | IGuestDonor;
    date: Date,
    hospital: IHospital
}

export interface IAdmin {
    _id: string | undefined;
    profile?: Iimg;
    username: string;
    license: string;
    address: string;
    password: string;
}

export interface Iimg {
    _id: string | undefined;
    user: IDonor; // Reference back to the user
    path: string;
    name: string;
    imageType: string;
    fullPath: string;
}

export interface INotification {
    _id: string | undefined;
    user: IDonor; // Reference back to the user
    path: string;
    title: string;
    description: string;
}

export interface IEvent {
    _id: string | undefined;
    path: string;
    title: string;
    description: string;
    img: Iimg;
    user: IAdmin
}

export interface IBloodSupply {
    _id: string | undefined;
    date: Date;
    quantity: number;  // Quantity of blood supplied
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';  // Blood type
    hospital: string | undefined;  // Reference to the Hospital
    donor: string | undefined;  // Reference to the Donor
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';  // Status of the blood supply
}