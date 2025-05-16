
export type UserRole = 'driver' | 'school-admin' | 'super-admin';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId?: string;
  createdAt: Date;
}

export interface School {
  id: string;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

export interface MisconductReport {
  id: string;
  driverId: string;
  driverName: string;
  studentName: string;
  busRoute: string;
  schoolId: string;
  schoolName: string;
  incidentDate: Date;
  description: string;
  status: ReportStatus;
  attachmentUrl?: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  reportId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  content: string;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'report' | 'user' | 'school' | 'comment' | 'system';
  entityId: string;
  details: string;
  createdAt: Date;
}
