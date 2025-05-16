import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AuditLog, UserRole } from '../types';

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

const NewReport: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    busRoute: '',
    incidentDate: new Date(),
    description: '',
    attachment: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, incidentDate: date }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a mock report ID
      const reportId = Math.random().toString(36).substring(2, 9);
      
      // Create audit log for report submission
      if (user) {
        const auditLog = generateAuditLog(
          user.id,
          user.name,
          user.role,
          'create_report',
          'report',
          reportId,
          `New misconduct report created for student ${formData.studentName}`
        );
        console.log('Audit log created:', auditLog);
      }
      
      // Simulate sending email notification to school admin
      console.log(`Email notification sent to school admin about new report for student ${formData.studentName}`);
      
      toast({
        title: "Report Submitted Successfully",
        description: "Your misconduct report has been submitted and will be reviewed by school administrators. Email notification sent."
      });
      
      navigate('/reports');
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New Misconduct Report</h1>
        <p className="text-muted-foreground mt-1">
          Submit a new student misconduct incident report
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Incident Details</CardTitle>
            <CardDescription>
              Please provide as much detail as possible about the incident
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="incidentDate">Incident Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.incidentDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.incidentDate ? format(formData.incidentDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.incidentDate}
                    onSelect={handleDateSelect}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="studentName">Student Name</Label>
              <Input
                id="studentName"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                placeholder="Full name of the student"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="busRoute">Bus Route</Label>
              <Input
                id="busRoute"
                name="busRoute"
                value={formData.busRoute}
                onChange={handleChange}
                placeholder="e.g., 42"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description of Misconduct</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide detailed information about what happened"
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachment">Attachment (Optional)</Label>
              <div className="flex items-center gap-4">
                <Label 
                  htmlFor="attachment" 
                  className="cursor-pointer flex items-center gap-2 border rounded-md px-4 py-2 hover:bg-muted transition-colors"
                >
                  <Upload size={18} />
                  <span>{formData.attachment ? formData.attachment.name : "Upload File"}</span>
                </Label>
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx"
                />
                {formData.attachment && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, attachment: null }))}
                  >
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Accepted file types: Images (.jpg, .png), Documents (.pdf, .doc, .docx)
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/reports')}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default NewReport;
