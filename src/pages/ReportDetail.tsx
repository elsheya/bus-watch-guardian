
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { format } from 'date-fns';
import { CalendarCheck, MessageSquare, ArrowLeft } from 'lucide-react';
import { MisconductReport, ReportStatus, Comment, AuditLog } from '../types';
import { useToast } from '@/hooks/use-toast';

// Mock data for reports (same as in Reports.tsx)
const mockReports: MisconductReport[] = [
  {
    id: '1',
    driverId: '1',
    driverName: 'John Driver',
    studentName: 'Alex Johnson',
    busRoute: '42',
    schoolId: '1',
    schoolName: 'Washington High School',
    incidentDate: new Date('2023-06-01'),
    description: 'Disruptive behavior during the ride, shouting and distracting the driver.',
    status: 'pending',
    createdAt: new Date('2023-06-01T14:32:00'),
    comments: []
  },
  {
    id: '2',
    driverId: '1',
    driverName: 'John Driver',
    studentName: 'Maria Garcia',
    busRoute: '42',
    schoolId: '1',
    schoolName: 'Washington High School',
    incidentDate: new Date('2023-06-03'),
    description: 'Refusing to remain seated while the bus was in motion despite multiple warnings.',
    status: 'reviewed',
    createdAt: new Date('2023-06-03T15:45:00'),
    comments: [
      {
        id: '1',
        reportId: '2',
        userId: '2',
        userName: 'Sarah Admin',
        userRole: 'school-admin',
        content: 'Spoke with student about the incident. Will monitor behavior.',
        createdAt: new Date('2023-06-04T09:20:00')
      }
    ]
  },
  {
    id: '3',
    driverId: '1',
    driverName: 'John Driver',
    studentName: 'James Smith',
    busRoute: '42',
    schoolId: '1',
    schoolName: 'Washington High School',
    incidentDate: new Date('2023-06-05'),
    description: 'Using inappropriate language toward other students on the bus.',
    status: 'resolved',
    createdAt: new Date('2023-06-05T16:10:00'),
    comments: [
      {
        id: '2',
        reportId: '3',
        userId: '2',
        userName: 'Sarah Admin',
        userRole: 'school-admin',
        content: 'Parent conference held. Student apologized to driver and peers.',
        createdAt: new Date('2023-06-06T11:45:00')
      }
    ]
  },
  {
    id: '4',
    driverId: '4',
    driverName: 'Mary Driver',
    studentName: 'Emma Wilson',
    busRoute: '17',
    schoolId: '1',
    schoolName: 'Washington High School',
    incidentDate: new Date('2023-06-07'),
    description: 'Throwing items out of the bus window.',
    status: 'pending',
    createdAt: new Date('2023-06-07T14:50:00'),
    comments: []
  },
  {
    id: '5',
    driverId: '5',
    driverName: 'Steve Driver',
    studentName: 'Daniel Brown',
    busRoute: '23',
    schoolId: '1',
    schoolName: 'Washington High School',
    incidentDate: new Date('2023-06-08'),
    description: 'Fighting with another student on the bus.',
    status: 'reviewed',
    createdAt: new Date('2023-06-08T15:15:00'),
    comments: [
      {
        id: '3',
        reportId: '5',
        userId: '2',
        userName: 'Sarah Admin',
        userRole: 'school-admin',
        content: 'Both students given detention. Parents notified.',
        createdAt: new Date('2023-06-09T10:30:00')
      }
    ]
  }
];

// Function to generate audit logs
const generateAuditLog = (userId: string, userName: string, userRole: string, action: string, entityType: 'report' | 'user' | 'school' | 'comment' | 'system', entityId: string, details: string): AuditLog => {
  return {
    id: Math.random().toString(36).substring(2, 9),
    userId,
    userName,
    userRole,
    action,
    entityType,
    entityId,
    details,
    createdAt: new Date()
  };
};

const getStatusBadge = (status: ReportStatus) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-warning text-warning-foreground">Pending</Badge>;
    case 'reviewed':
      return <Badge variant="outline" className="bg-accent text-accent-foreground">Reviewed</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-success text-success-foreground">Resolved</Badge>;
    default:
      return null;
  }
};

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [report, setReport] = useState<MisconductReport | undefined>(
    mockReports.find(r => r.id === id)
  );
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<ReportStatus | undefined>(
    report?.status
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) {
    return <div className="p-8">Report not found</div>;
  }

  const canAddComments = hasRole(['school-admin', 'super-admin']);
  const canChangeStatus = hasRole(['school-admin', 'super-admin']);

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    
    setIsSubmitting(true);
    
    // Create new comment
    const comment: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      reportId: report.id,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      content: newComment.trim(),
      createdAt: new Date()
    };
    
    // Update report with new comment
    const updatedReport = {
      ...report,
      comments: [...report.comments, comment]
    };
    
    // Create audit log
    const auditLog = generateAuditLog(
      user.id,
      user.name,
      user.role,
      'add_comment',
      'comment',
      comment.id,
      `Comment added to report #${report.id}`
    );
    
    // Simulate API call
    setTimeout(() => {
      setReport(updatedReport);
      setNewComment('');
      setIsSubmitting(false);
      
      toast({
        title: "Comment Added",
        description: "Your comment has been added to the report."
      });
      
      // In a real app, you would save the audit log to the server
      console.log('Audit log created:', auditLog);
    }, 500);
  };
  
  const handleStatusChange = (status: ReportStatus) => {
    if (!user) return;
    
    setIsSubmitting(true);
    setNewStatus(status);
    
    // Update report with new status
    const updatedReport = {
      ...report,
      status
    };
    
    // Create audit log
    const auditLog = generateAuditLog(
      user.id,
      user.name,
      user.role,
      'update_status',
      'report',
      report.id,
      `Report status changed from ${report.status} to ${status}`
    );
    
    // Simulate API call
    setTimeout(() => {
      setReport(updatedReport);
      setIsSubmitting(false);
      
      toast({
        title: "Status Updated",
        description: `Report status has been updated to ${status}.`
      });
      
      // In a real app, you would save the audit log to the server
      console.log('Audit log created:', auditLog);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/reports')}
            className="mr-4"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Reports
          </Button>
          <h1 className="text-3xl font-bold">Misconduct Report</h1>
        </div>
        <div className="flex items-center">
          <span className="mr-2">Status:</span>
          {getStatusBadge(report.status)}
          
          {canChangeStatus && (
            <div className="ml-4">
              <Select
                value={newStatus}
                onValueChange={(value) => handleStatusChange(value as ReportStatus)}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Report details */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>
                Reported on {format(report.createdAt, 'MMMM d, yyyy')} by {report.driverName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Student Name</p>
                  <p className="font-medium">{report.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bus Route</p>
                  <p className="font-medium">{report.busRoute}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <div className="flex items-center">
                    <CalendarCheck size={16} className="mr-2 text-muted-foreground" />
                    <p className="font-medium">{format(report.incidentDate, 'MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">School</p>
                  <p className="font-medium">{report.schoolName}</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-1">Description</p>
                <p>{report.description}</p>
              </div>
              
              {report.attachmentUrl && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-1">Attachment</p>
                  <Button variant="outline" size="sm">
                    View Attachment
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Comments section */}
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare size={18} className="mr-2" />
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              {report.comments.length > 0 ? (
                <div className="space-y-4">
                  {report.comments.map((comment) => (
                    <div key={comment.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">{comment.userName}</p>
                          <p className="text-xs text-muted-foreground">{comment.userRole.replace('-', ' ')}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(comment.createdAt, 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">No comments yet</p>
              )}
            </CardContent>
            
            {canAddComments && (
              <>
                <Separator />
                <CardFooter className="flex flex-col pt-4">
                  <Textarea
                    placeholder="Add a comment..."
                    className="min-h-[100px] mb-2"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <Button
                    onClick={handleAddComment}
                    className="w-full"
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Adding Comment..." : "Add Comment"}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail;
