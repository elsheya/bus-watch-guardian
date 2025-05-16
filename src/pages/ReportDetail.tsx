
import React, { useState, useRef } from 'react';
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
import { CalendarCheck, MessageSquare, ArrowLeft, Download } from 'lucide-react';
import { MisconductReport, ReportStatus, Comment, AuditLog, UserRole } from '../types';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
const generateAuditLog = (userId: string, userName: string, userRole: UserRole, action: string, entityType: 'report' | 'user' | 'school' | 'comment' | 'system', entityId: string, details: string): AuditLog => {
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
      return <Badge variant="outline" className="bg-buswatch-pending/20 text-buswatch-pending font-medium border-buswatch-pending/30">Pending</Badge>;
    case 'reviewed':
      return <Badge variant="outline" className="bg-buswatch-reviewed/20 text-buswatch-reviewed font-medium border-buswatch-reviewed/30">Reviewed</Badge>;
    case 'resolved':
      return <Badge variant="outline" className="bg-buswatch-resolved/20 text-buswatch-resolved font-medium border-buswatch-resolved/30">Resolved</Badge>;
    default:
      return null;
  }
};

const ReportDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<MisconductReport | undefined>(
    mockReports.find(r => r.id === id)
  );
  const [newComment, setNewComment] = useState('');
  const [newStatus, setNewStatus] = useState<ReportStatus | undefined>(
    report?.status
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  if (!report) {
    return <div className="p-8">Report not found</div>;
  }

  const canAddComments = hasRole(['school-admin', 'super-admin']);
  const canChangeStatus = hasRole(['school-admin', 'super-admin']);
  const canDownloadPdf = hasRole(['driver', 'school-admin', 'super-admin']);

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
        description: "Your comment has been added to the report. Email notification sent to driver."
      });
      
      // Simulate sending email notification to driver
      console.log(`Email notification sent to driver about new comment from ${user.name}`);
      
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
        description: `Report status has been updated to ${status}. Email notification sent to driver.`
      });
      
      // Simulate sending email notification about status update
      console.log(`Email notification sent to driver about status update to ${status}`);
      
      // In a real app, you would save the audit log to the server
      console.log('Audit log created:', auditLog);
    }, 500);
  };

  const handleExportPdf = async () => {
    if (!reportRef.current) return;
    
    setIsPdfGenerating(true);
    
    try {
      // Create an audit log for the PDF download
      if (user) {
        const auditLog = generateAuditLog(
          user.id,
          user.name,
          user.role,
          'export_pdf',
          'report',
          report.id,
          `Report #${report.id} exported as PDF`
        );
        console.log('Audit log created:', auditLog);
      }
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Add footer with date and page number
      const date = format(new Date(), 'yyyy-MM-dd HH:mm');
      pdf.setFontSize(8);
      pdf.text(`Generated on: ${date}`, 10, pageHeight - 10);
      pdf.text(`BusWatch - Misconduct Report #${report.id}`, imgWidth / 2, pageHeight - 10, { align: 'center' });
      
      pdf.save(`BusWatch_Report_${report.id}_${format(new Date(), 'yyyyMMdd')}.pdf`);
      
      toast({
        title: "PDF Generated",
        description: "Report has been exported as PDF successfully."
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="header-gradient rounded-lg p-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/reports')}
              className="mr-4 text-white hover:bg-white/20"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Reports
            </Button>
            <h1 className="text-3xl font-bold">Misconduct Report</h1>
          </div>
          <div className="flex items-center gap-2">
            {canDownloadPdf && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportPdf}
                disabled={isPdfGenerating}
                className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white"
              >
                <Download size={16} />
                {isPdfGenerating ? "Generating..." : "Export PDF"}
              </Button>
            )}
            
            <span className="ml-2 mr-2 text-white">Status:</span>
            {getStatusBadge(report.status)}
            
            {canChangeStatus && (
              <div className="ml-4">
                <Select
                  value={newStatus}
                  onValueChange={(value) => handleStatusChange(value as ReportStatus)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-[140px] border-white/30 bg-white/20 text-white">
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
      </div>

      <div className="space-y-6" ref={reportRef}>
        {/* Report details */}
        <Card className="card-gradient shadow-lg border-t-4 border-t-buswatch-primary">
          <CardHeader className="border-b pb-4">
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>
              Reported on {format(report.createdAt, 'MMMM d, yyyy')} by {report.driverName}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-buswatch-text-muted mb-1">Student Name</p>
                <p className="font-medium text-buswatch-text-primary text-lg">{report.studentName}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-buswatch-text-muted mb-1">Bus Route</p>
                <p className="font-medium text-buswatch-text-primary text-lg">Route {report.busRoute}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-buswatch-text-muted mb-1">Incident Date</p>
                <div className="flex items-center">
                  <div className="icon-container mr-2">
                    <CalendarCheck size={16} />
                  </div>
                  <p className="font-medium text-buswatch-text-primary text-lg">{format(report.incidentDate, 'MMMM d, yyyy')}</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-buswatch-text-muted mb-1">School</p>
                <p className="font-medium text-buswatch-text-primary text-lg">{report.schoolName}</p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <p className="text-sm text-buswatch-text-muted mb-2">Description</p>
              <p className="text-buswatch-text-primary">{report.description}</p>
            </div>
            
            {report.attachmentUrl && (
              <div className="pt-2">
                <p className="text-sm text-buswatch-text-muted mb-1">Attachment</p>
                <Button variant="outline" size="sm">
                  View Attachment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Comments section */}
        <Card className="card-gradient shadow-lg border-t-4 border-t-buswatch-accent">
          <CardHeader className="border-b pb-4">
            <CardTitle className="flex items-center">
              <div className="icon-container mr-2">
                <MessageSquare size={16} />
              </div>
              Comments
            </CardTitle>
            <CardDescription>
              Communication related to this incident
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {report.comments.length > 0 ? (
              <div className="space-y-4">
                {report.comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4 bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-medium text-buswatch-primary">{comment.userName}</p>
                        <p className="text-xs text-buswatch-text-muted">{comment.userRole.replace('-', ' ')}</p>
                      </div>
                      <p className="text-xs text-buswatch-text-muted bg-buswatch-accent/10 px-2 py-1 rounded-full">
                        {format(comment.createdAt, 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                    <p className="text-buswatch-text-secondary">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <MessageSquare size={32} className="mx-auto text-buswatch-text-muted mb-2 opacity-50" />
                <p className="text-buswatch-text-muted">No comments yet</p>
              </div>
            )}
          </CardContent>
          
          {canAddComments && (
            <>
              <Separator />
              <CardFooter className="flex flex-col pt-4">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[120px] mb-4 border-buswatch-accent/30 focus:border-buswatch-accent"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  disabled={isSubmitting}
                />
                <Button
                  onClick={handleAddComment}
                  className="w-full bg-gradient-to-r from-buswatch-primary to-buswatch-accent hover:opacity-90"
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
  );
};

export default ReportDetail;
