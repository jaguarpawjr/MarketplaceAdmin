export type VerificationStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'suspended'
  | 'incomplete';

export type AdminRole = 'Super Admin' | 'Verification Officer' | 'Support Agent';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarColor: string;
  initials: string;
}

export interface FarmPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface FarmerDocument {
  id: string;
  name: string;
  type: 'id' | 'land' | 'certification' | 'business';
  status: 'verified' | 'pending' | 'rejected' | 'missing';
  uploadedAt: string;
  preview: string;
}

export interface VerificationNote {
  id: string;
  author: string;
  authorRole: AdminRole;
  text: string;
  createdAt: string;
}

export interface Farmer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  farmType: string;
  crops: string[];
  farmSizeAcres: number;
  registeredAt: string;
  status: VerificationStatus;
  idVerified: boolean;
  documents: FarmerDocument[];
  photos: FarmPhoto[];
  badges: string[];
  notes: VerificationNote[];
  activeSeller: boolean;
  rating: number;
  totalSales: number;
  lastActive: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  criteria: string;
  farmersCount: number;
  expiresAfterDays: number | null;
}

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'escalated';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketCategory = 'verification' | 'payment' | 'account' | 'listing' | 'dispute' | 'other';
export type UserType = 'farmer' | 'buyer';

export interface TicketMessage {
  id: string;
  author: string;
  authorType: 'user' | 'admin';
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ref: string;
  subject: string;
  user: string;
  userType: UserType;
  userAvatarColor: string;
  category: TicketCategory;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  assignedTo: string | null;
  messages: TicketMessage[];
  internalNotes: string[];
}

export interface AuditEntry {
  id: string;
  admin: string;
  adminRole: AdminRole;
  action: string;
  target: string;
  detail: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
}
