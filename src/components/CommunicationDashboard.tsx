
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, Mail } from 'lucide-react';
import { MisconductReport, Comment } from '../types';

interface CommunicationLogItem {
  id: string;
  type: 'report_submission' | 'comment' | 'status_change';
  report: MisconductReport;
  user: {
    id: string;
    name: string;
    role: string;
  };
  detail: string;
  recipient?: string;
  createdAt: Date;
}

// Mock data for communication logs
const mockCommunicationLogs: CommunicationLogItem[] = [
  {
    id: '1',
    type: 'report_submission',
    report: {
      id: '1',
      driverId: '1',
      driverName: 'John Driver',
      studentName: 'Alex Johnson',
      busRoute: '42',
      schoolId: '1',
      schoolName: 'Washington High School',
      incidentDate: new Date('2023-06-01'),
      description: 'Disruptive behavior during the ride.',
      status: 'pending',
      createdAt: new Date('2023-06-01T14:32:00'),
      comments: []
    },
    user: {
      id: '1',
      name: 'John Driver',
      role: 'driver'
    },
    detail: 'Submitted new misconduct report',
    recipient: 'Sarah Admin (school-admin)',
    createdAt: new Date('2023-06-01T14:32:00')
  },
  {
    id: '2',
    type: 'comment',
    report: {
      id: '2',
      driverId: '1',
      driverName: 'John Driver',
      studentName: 'Maria Garcia',
      busRoute: '42',
      schoolId: '1',
      schoolName: 'Washington High School',
      incidentDate: new Date('2023-06-03'),
      description: 'Refusing to remain seated while the bus was in motion.',
      status: 'reviewed',
      createdAt: new Date('2023-06-03T15:45:00'),
      comments: []
    },
    user: {
      id: '2',
      name: 'Sarah Admin',
      role: 'school-admin'
    },
    detail: 'Added comment: "Spoke with student about the incident. Will monitor behavior."',
    recipient: 'John Driver (driver)',
    createdAt: new Date('2023-06-04T09:20:00')
  },
  {
    id: '3',
    type: 'status_change',
    report: {
      id: '3',
      driverId: '1',
      driverName: 'John Driver',
      studentName: 'James Smith',
      busRoute: '42',
      schoolId: '1',
      schoolName: 'Washington High School',
      incidentDate: new Date('2023-06-05'),
      description: 'Using inappropriate language toward other students.',
      status: 'resolved',
      createdAt: new Date('2023-06-05T16:10:00'),
      comments: []
    },
    user: {
      id: '2',
      name: 'Sarah Admin',
      role: 'school-admin'
    },
    detail: 'Changed status from "reviewed" to "resolved"',
    recipient: 'John Driver (driver)',
    createdAt: new Date('2023-06-06T11:50:00')
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'report_submission':
      return <Badge variant="outline" className="bg-primary text-primary-foreground">New Report</Badge>;
    case 'comment':
      return <Badge variant="outline" className="bg-secondary text-secondary-foreground">Comment</Badge>;
    case 'status_change':
      return <Badge variant="outline" className="bg-accent text-accent-foreground">Status Update</Badge>;
    default:
      return null;
  }
};

const CommunicationDashboard: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare size={20} />
          Communication Logs
        </CardTitle>
        <CardDescription>
          Track all notifications and communications between users
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockCommunicationLogs.map((log) => (
            <div key={log.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-start gap-2">
                  {getTypeIcon(log.type)}
                  <div>
                    <p className="font-medium">{log.user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{log.user.role.replace('-', ' ')}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(log.createdAt, 'MMM d, yyyy h:mm a')}
                </p>
              </div>
              
              <Separator className="my-3" />
              
              <div className="mt-2">
                <p className="text-sm">
                  <span className="font-semibold">Report:</span> {log.report.studentName} - {log.report.description.substring(0, 40)}...
                </p>
                <p className="text-sm mt-1">{log.detail}</p>
                
                {log.recipient && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail size={12} />
                    <span>Email notification sent to {log.recipient}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommunicationDashboard;
