export interface IDonorNumber {
    _id?: string;
    donorId: string;
    isUsed: boolean;
    isVerified: boolean;
    hospital: IAdmin
}

export interface IDonor {
    _id?: string;
    profile?: Iimg;
    username: string;
    donorId: string;
    address: string;
    password: string;
    phoneNumber?: string;
    bloodType: 'A+' | 'A-'| 'B+' | 'B-' | 'O+' | 'O-' | 'AB+'| 'AB-';
    email?: string;
    sex?: string,
    age?: number,
    status: 'ACTIVE' | 'INACTIVE',
    transactions: ITransaction[]
    doMedicalCondition?: Boolean
}

export interface IGuestDonor {
    _id?: string;
    profile?: Iimg;
    username: string;
    address: string;
    phoneNumber: string;
    bloodType: 'A+' | 'A-'| 'B+' | 'B-' | 'O+' | 'O-' | 'AB+'| 'AB-';
    email: string;
    sex: string,
    age: number,
    date: Date,
    time: string,
    hospital: string,
    doMedicalCondition: Boolean
}


export interface ITransaction {
    _id?: string;
    user: IDonor | IGuestDonor;
    datetime: Date;
    status: 'PENDING' | 'DONE';
    remarks: String;
    hospital: IAdmin;
    guestDonor: IGuestDonor,
    type: 'MEMBER-APPOINTMENT' | 'GUEST-APPOINTMENT';
}

export interface IAdmin {
    _id?: string;
    profile?: Iimg;
    username: string;
    license: string;
    address: string;
    password: string;
}

export interface Iimg {
    _id: string | undefined;
    path: string;
    name: string;
    imageType: string;
    fullPath: string;
}

export interface INotification {
    _id?: string;
    user: IDonor; // Reference back to the user
    path: string;
    title: string;
    description: string;
}

export interface IEvent {
    _id?: string;
    title: string;
    description: string;
    location: string;
    imgUrl: string;
    startDate: Date,
    endDate: Date,
    user: IAdmin
}

export interface IBloodSupply {
    _id?: string;
    date: Date;
    quantity: number;  // Quantity of blood supplied
    bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';  // Blood type
    hospital: string | undefined;  // Reference to the Hospital
    donor: string | undefined;  // Reference to the Donor
    status: 'PENDING' | 'APPROVED'| 'COMPLETED' | 'REJECTED';  // Status of the blood supply
}