import { Donor, EmergencyRequest, FAQ, ContactMessage, User } from '../types';
import { INITIAL_DONORS, INITIAL_REQUESTS, INITIAL_FAQS } from '../data/mockDonors';

// LocalStorage Keys
const KEYS = {
  DONORS: 'blood_finder_donors',
  REQUESTS: 'blood_finder_requests',
  FAQS: 'blood_finder_faqs',
  CONTACT: 'blood_finder_contact_messages',
  USERS: 'blood_finder_users',
  CURRENT_USER: 'blood_finder_curr_user',
  THEME: 'blood_finder_theme'
};

// Initial setup helper to ensure we always have preloaded mock records in localStorage
export const initializeDB = () => {
  if (!localStorage.getItem(KEYS.DONORS)) {
    localStorage.setItem(KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
  }
  if (!localStorage.getItem(KEYS.REQUESTS)) {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(KEYS.FAQS)) {
    localStorage.setItem(KEYS.FAQS, JSON.stringify(INITIAL_FAQS));
  }
  if (!localStorage.getItem(KEYS.CONTACT)) {
    localStorage.setItem(KEYS.CONTACT, JSON.stringify([]));
  }
  
  // Seed default admin account if not exists
  if (!localStorage.getItem(KEYS.USERS)) {
    const defaultUsers: User[] = [
      {
        uid: "admin-uid-123",
        email: "admin@blooddonor.org",
        displayName: "System Administrator",
        role: "admin",
        createdAt: "2026-01-01T00:00:00.000Z"
      }
    ];
    localStorage.setItem(KEYS.USERS, JSON.stringify(defaultUsers));
  }
};

// Call initialization immediately on module load
initializeDB();

// General Db utilities
export const db = {
  // Donors Collection
  getDonors: (): Donor[] => {
    return JSON.parse(localStorage.getItem(KEYS.DONORS) || '[]');
  },
  
  saveDonors: (donors: Donor[]): void => {
    localStorage.setItem(KEYS.DONORS, JSON.stringify(donors));
    // Trigger custom event for real-time updates
    window.dispatchEvent(new Event('donors-updated'));
  },

  addDonor: (donor: Omit<Donor, 'id' | 'createdAt'>): Donor => {
    const donors = db.getDonors();
    const newDonor: Donor = {
      ...donor,
      id: `donor-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    donors.unshift(newDonor);
    db.saveDonors(donors);
    return newDonor;
  },

  updateDonor: (id: string, updatedFields: Partial<Donor>): Donor => {
    const donors = db.getDonors();
    const index = donors.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Donor not found');
    
    const updatedDonor = { ...donors[index], ...updatedFields };
    donors[index] = updatedDonor;
    db.saveDonors(donors);
    return updatedDonor;
  },

  deleteDonor: (id: string): void => {
    const donors = db.getDonors();
    const updatedDonors = donors.filter(d => d.id !== id);
    db.saveDonors(updatedDonors);
  },

  // Requests Collection
  getRequests: (): EmergencyRequest[] => {
    return JSON.parse(localStorage.getItem(KEYS.REQUESTS) || '[]');
  },

  saveRequests: (requests: EmergencyRequest[]): void => {
    localStorage.setItem(KEYS.REQUESTS, JSON.stringify(requests));
    window.dispatchEvent(new Event('requests-updated'));
  },

  addRequest: (request: Omit<EmergencyRequest, 'id' | 'createdAt' | 'status'>): EmergencyRequest => {
    const requests = db.getRequests();
    const newRequest: EmergencyRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'Urgent',
      createdAt: new Date().toISOString()
    };
    requests.unshift(newRequest);
    db.saveRequests(requests);
    return newRequest;
  },

  updateRequestStatus: (id: string, status: 'Urgent' | 'Fulfilled' | 'Expired'): EmergencyRequest => {
    const requests = db.getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Request not found');
    
    const updatedRequest = { ...requests[index], status };
    requests[index] = updatedRequest;
    db.saveRequests(requests);
    return updatedRequest;
  },

  // Contact Messages Collection
  getContactMessages: (): ContactMessage[] => {
    return JSON.parse(localStorage.getItem(KEYS.CONTACT) || '[]');
  },

  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage => {
    const messages = db.getContactMessages();
    const newMessage: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    messages.push(newMessage);
    localStorage.setItem(KEYS.CONTACT, JSON.stringify(messages));
    return newMessage;
  },

  // FAQs
  getFAQs: (): FAQ[] => {
    return JSON.parse(localStorage.getItem(KEYS.FAQS) || '[]');
  },

  // Users Collection
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || '[]');
  },

  saveUsers: (users: User[]): void => {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },

  addUser: (user: User): void => {
    const users = db.getUsers();
    if (!users.some(u => u.uid === user.uid)) {
      users.push(user);
      db.saveUsers(users);
    }
  }
};
