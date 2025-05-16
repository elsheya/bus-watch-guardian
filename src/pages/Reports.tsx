
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Search, FileText } from 'lucide-react';
import { MisconductReport, ReportStatus } from '../types';

// Mock data for reports
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

const Reports: React.FC = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ReportStatus | 'all'>('all');
  const [busRouteFilter, setBusRouteFilter] = useState<string>('all');

  // Filter reports based on user role
  const driverReports = hasRole(['driver']) 
    ? mockReports.filter(report => report.driverId === user?.id)
    : mockReports;

  // Apply search and filters
  const filteredReports = driverReports
    .filter(report => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          report.studentName.toLowerCase().includes(query) ||
          report.busRoute.toLowerCase().includes(query) ||
          report.description.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(report => {
      // Status filter
      if (statusFilter !== 'all') {
        return report.status === statusFilter;
      }
      return true;
    })
    .filter(report => {
      // Bus route filter
      if (busRouteFilter !== 'all') {
        return report.busRoute === busRouteFilter;
      }
      return true;
    });

  const getBusRoutes = () => {
    const routes = driverReports.map(report => report.busRoute);
    return ['all', ...new Set(routes)];
  };

  const getStatusBadge = (status: ReportStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case 'reviewed':
        return <Badge className="bg-accent text-accent-foreground">Reviewed</Badge>;
      case 'resolved':
        return <Badge className="bg-success text-success-foreground">Resolved</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Misconduct Reports</h1>
          <p className="text-muted-foreground mt-1">
            {hasRole(['driver']) ? 'View and manage your submitted reports' : 'View and manage all student misconduct reports'}
          </p>
        </div>

        {hasRole(['driver']) && (
          <Button onClick={() => navigate('/new-report')}>
            Create New Report
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle>Reports List</CardTitle>
              <CardDescription>
                {filteredReports.length} reports found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8 w-full sm:w-[200px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as ReportStatus | 'all')}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={busRouteFilter}
                  onValueChange={(value) => setBusRouteFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Filter by route" />
                  </SelectTrigger>
                  <SelectContent>
                    {getBusRoutes().map((route) => (
                      <SelectItem key={route} value={route}>
                        {route === 'all' ? 'All Routes' : `Route ${route}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Route</TableHead>
                  {!hasRole(['driver']) && <TableHead>Driver</TableHead>}
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        {format(report.incidentDate, 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium">{report.studentName}</TableCell>
                      <TableCell>{report.busRoute}</TableCell>
                      {!hasRole(['driver']) && <TableCell>{report.driverName}</TableCell>}
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/reports/${report.id}`)}
                        >
                          <FileText size={16} className="mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={hasRole(['driver']) ? 5 : 6} className="text-center py-4 text-muted-foreground">
                      No reports found. {hasRole(['driver']) && 'Create a new report to get started.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
