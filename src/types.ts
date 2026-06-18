export interface Donor {
  id: string;
  name: string;
  bloodGroup: string;
  city: string;
  phone: string;
  email: string;
  available: boolean;
  lastDonationDate: string;
  createdAt: string;
  ownerId?: string; // Links to the user account who registered this donor
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  bloodGroup: string;
  city: string;
  hospitalName: string;
  phone: string;
  requiredBefore: string;
  requestedBy: string; // user outline name or id
  unitsNeeded: number;
  status: 'Urgent' | 'Fulfilled' | 'Expired';
  createdAt: string;
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
