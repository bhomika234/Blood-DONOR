import { Donor, FAQ, EmergencyRequest } from '../types';

export const INITIAL_DONORS: Donor[] = [
  {
    id: "donor-1",
    name: "Ali Khan",
    bloodGroup: "O+",
    city: "Karachi",
    phone: "03001234567",
    email: "ali@gmail.com",
    available: true,
    lastDonationDate: "2026-03-10",
    createdAt: "2026-03-10T10:00:00.000Z",
    ownerId: "mock-user-1"
  },
  {
    id: "donor-2",
    name: "John Doe",
    bloodGroup: "O-",
    city: " Hyderabad",
    phone: "+1 (555) 321-4567",
    email: "johndoe@gmail.com",
    available: true,
    lastDonationDate: "2026-02-15",
    createdAt: "2026-02-15T11:30:00.000Z",
    ownerId: "mock-user-2"
  },
  {
    id: "donor-3",
    name: "Sarah Jenkins",
    bloodGroup: "A+",
    city: "Lahore",
    phone: "+44 7911 123456",
    email: "sarah.j@hotmail.com",
    available: true,
    lastDonationDate: "2026-05-01",
    createdAt: "2026-05-01T08:15:00.000Z",
    ownerId: "mock-user-3"
  },
  {
    id: "donor-4",
    name: "Aarav Sharma",
    bloodGroup: "B+",
    city: "Islamabad",
    phone: "+91 98765 43210",
    email: "aarav.sharma@gmail.com",
    available: false,
    lastDonationDate: "2026-05-20",
    createdAt: "2026-05-20T14:45:00.000Z",
    ownerId: "mock-user-4"
  },
  {
    id: "donor-5",
    name: "Emily Watson",
    bloodGroup: "AB+",
    city: "mirpurkhas ",
    phone: "+1 (555) 789-0123",
    email: "emily.watson@yahoo.com",
    available: true,
    lastDonationDate: "2026-04-12",
    createdAt: "2026-04-12T09:00:00.000Z",
    ownerId: "mock-user-5"
  },
  {
    id: "donor-6",
    name: "Zainab Fatima",
    bloodGroup: "A-",
    city: "Karachi",
    phone: "03219876543",
    email: "zainab@outlook.com",
    available: true,
    lastDonationDate: "2026-01-30",
    createdAt: "2026-01-30T16:20:00.000Z",
    ownerId: "mock-user-6"
  },
  {
    id: "donor-7",
    name: "Carlos Mendez",
    bloodGroup: "O+",
    city: "Nawabshah",
    phone: "+1 (555) 234-5678",
    email: "carlos.m@gmail.com",
    available: true,
    lastDonationDate: "2026-04-25",
    createdAt: "2026-04-25T13:10:00.000Z",
    ownerId: "mock-user-7"
  },
  {
    id: "donor-8",
    name: "Yuki Tanaka",
    bloodGroup: "B-",
    city: "Larkana",
    phone: "+81 90-1234-5678",
    email: "yuki.t@gmail.com",
    available: true,
    lastDonationDate: "2026-05-05",
    createdAt: "2026-05-05T07:40:00.000Z",
    ownerId: "mock-user-8"
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "Who can donate blood?",
    answer: "Most people can donate blood if they are in good health, are at least 17 years old (or 16 with parental consent in some places), weigh at least 110 lbs (50 kg), and do not have any travel or medical deferrals.",
    category: "Eligibility"
  },
  {
    id: "faq-2",
    question: "How often can I donate blood?",
    answer: "You can donate whole blood every 56 days (about 8 weeks). Platelet donations can be made every 7 days, up to 24 times a year. Double red cell donations require waiting 112 days.",
    category: "Donation Process"
  },
  {
    id: "faq-3",
    question: "Is donating blood safe?",
    answer: "Yes, donating blood is extremely safe. A new, sterile, and disposable needle is used for every donor, so there is zero risk of contracting bloodborne infections. Your body also replenishes the fluid lost within 24-48 hours.",
    category: "Safety"
  },
  {
    id: "faq-4",
    question: "What should I do before and after donating blood?",
    answer: "Before: Drink plenty of water (at least 16 oz), eat a healthy, low-fat meal, and get a good night's sleep. After: Keep hydrated, avoid heavy lifting or strenuous exercise for the rest of the day, and keep the bandage on for a few hours.",
    category: "Tips"
  },
  {
    id: "faq-5",
    question: "How long does a blood donation take?",
    answer: "The actual donation takes about 8 to 10 minutes. However, the entire process—including registration, mini-health screening, and refreshments afterward—takes about 45 minutes to an hour.",
    category: "Donation Process"
  }
];

export const INITIAL_REQUESTS: EmergencyRequest[] = [
  {
    id: "req-1",
    patientName: "Muhammad Farooq",
    bloodGroup: "O-",
    city: "Karachi",
    hospitalName: "Aga Khan University Hospital",
    phone: "03337654321",
    unitsNeeded: 3,
    requiredBefore: "2026-06-16",
    requestedBy: "Imran Farooq",
    status: "Urgent",
    createdAt: "2026-06-13T10:00:00.000Z"
  },
  {
    id: "req-2",
  patientName: "Robert Miller",
  bloodGroup: "A+",
  city: "Hyderabad",
  hospitalName: "Aga Khan Maternal and Child Care Centre",
  phone: "+92 300 1234567", 
  unitsNeeded: 2,
  requiredBefore: "2026-06-15",
  requestedBy: "Linda Miller",
  status: "Urgent",
  createdAt: "2026-06-13T15:30:00.000Z"
  },
  {
    id: "req-3",
  patientName: "Priyanjali Sen",
  bloodGroup: "B+",
  city: "Lahore",
  hospitalName: "Mayo Hospital", 
  phone: "+92 42 35712345",     
  unitsNeeded: 4,
  requiredBefore: "2026-06-18",
  requestedBy: "Rohan Sen",
  status: "Urgent",
  createdAt: "2026-06-14T02:10:00.000Z"
  }
];
