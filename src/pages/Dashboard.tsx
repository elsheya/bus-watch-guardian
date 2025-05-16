
import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { FilePlus, ClipboardList, School, Users, ActivitySquare } from 'lucide-react';

// Mock data for charts
const mockChartData = [
  { month: 'Jan', reports: 12 },
  { month: 'Feb', reports: 18 },
  { month: 'Mar', reports: 5 },
  { month: 'Apr', reports: 8 },
  { month: 'May', reports: 16 },
  { month: 'Jun', reports: 14 },
];

const mockStatusData = [
  { status: 'Pending', count: 5 },
  { status: 'Reviewed', count: 12 },
  { status: 'Resolved', count: 28 },
];

const Dashboard: React.FC = () => {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Dashboard - BusWatch';
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
      </div>

      {hasRole(['driver']) && <DriverDashboard />}
      {hasRole(['school-admin']) && <SchoolAdminDashboard />}
      {hasRole(['super-admin']) && <SuperAdminDashboard />}
    </div>
  );
};

const DriverDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Status</CardTitle>
            <CardDescription>Your submitted reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-lg font-bold text-warning">3</div>
                <div className="text-xs">Pending</div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className="text-lg font-bold text-accent">7</div>
                <div className="text-xs">Reviewed</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-lg font-bold text-success">12</div>
                <div className="text-xs">Resolved</div>
              </div>
            </div>
            <Button onClick={() => navigate('/reports')} variant="outline" className="w-full">
              <ClipboardList size={20} className="mr-2" />
              View All Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common driver tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={() => navigate('/new-report')} className="w-full">
              <FilePlus size={20} className="mr-2" />
              Submit New Report
            </Button>
            <Button onClick={() => navigate('/reports')} variant="outline" className="w-full">
              <ClipboardList size={20} className="mr-2" />
              View My Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest report updates</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-success" />
              <div>
                <p className="font-medium">Report #123 was resolved</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-accent" />
              <div>
                <p className="font-medium">New comment on Report #118</p>
                <p className="text-xs text-muted-foreground">Yesterday</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-warning" />
              <div>
                <p className="font-medium">You submitted Report #127</p>
                <p className="text-xs text-muted-foreground">2 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports Over Time</CardTitle>
          <CardDescription>Number of reports submitted by month</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="reports" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const SchoolAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Report Status</CardTitle>
            <CardDescription>All school reports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-warning/10 rounded-lg">
                <div className="text-lg font-bold text-warning">8</div>
                <div className="text-xs">Pending</div>
              </div>
              <div className="text-center p-3 bg-accent/10 rounded-lg">
                <div className="text-lg font-bold text-accent">15</div>
                <div className="text-xs">Reviewed</div>
              </div>
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-lg font-bold text-success">32</div>
                <div className="text-xs">Resolved</div>
              </div>
            </div>
            <Button onClick={() => navigate('/reports')} variant="outline" className="w-full">
              <ClipboardList size={20} className="mr-2" />
              View All Reports
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bus Routes</CardTitle>
            <CardDescription>Report frequency by route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Route 42</div>
                <div className="text-sm text-muted-foreground">12 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium">Route 17</div>
                <div className="text-sm text-muted-foreground">8 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '50%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium">Route 23</div>
                <div className="text-sm text-muted-foreground">5 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '30%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>Latest misconduct reports</CardDescription>
          </CardHeader>
          <CardContent className="text-sm space-y-3">
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-warning" />
              <div>
                <p className="font-medium">New report from John Driver</p>
                <p className="text-xs text-muted-foreground">1 hour ago • Route 42</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-warning" />
              <div>
                <p className="font-medium">New report from Mary Driver</p>
                <p className="text-xs text-muted-foreground">3 hours ago • Route 17</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <div className="h-2 w-2 mt-1.5 rounded-full bg-warning" />
              <div>
                <p className="font-medium">New report from Steve Driver</p>
                <p className="text-xs text-muted-foreground">Yesterday • Route 23</p>
              </div>
            </div>
            <Button onClick={() => navigate('/reports')} variant="link" className="w-full mt-2 p-0">
              View all reports
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports Over Time</CardTitle>
            <CardDescription>Number of reports by month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockChartData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Bar dataKey="reports" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Report Status Distribution</CardTitle>
            <CardDescription>Breakdown by current status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockStatusData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Bar 
                    dataKey="count" 
                    fill="#3b82f6"
                    barSize={60}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <School className="h-8 w-8 text-buswatch-primary" />
              <div className="text-3xl font-bold">12</div>
            </div>
            <Button onClick={() => navigate('/schools')} variant="link" className="px-0 mt-2">
              Manage Schools
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-buswatch-primary" />
              <div className="text-3xl font-bold">86</div>
            </div>
            <Button onClick={() => navigate('/users')} variant="link" className="px-0 mt-2">
              Manage Users
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <ClipboardList className="h-8 w-8 text-buswatch-primary" />
              <div className="text-3xl font-bold">254</div>
            </div>
            <Button onClick={() => navigate('/reports')} variant="link" className="px-0 mt-2">
              View Reports
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <ActivitySquare className="h-8 w-8 text-buswatch-primary" />
              <div className="text-3xl font-bold">1,254</div>
            </div>
            <Button onClick={() => navigate('/audit-logs')} variant="link" className="px-0 mt-2">
              View Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Reports by School</CardTitle>
            <CardDescription>Total report count by school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="font-medium">Washington High School</div>
                <div className="text-sm text-muted-foreground">72 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium">Lincoln Elementary</div>
                <div className="text-sm text-muted-foreground">54 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="font-medium">Jefferson Middle School</div>
                <div className="text-sm text-muted-foreground">48 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '55%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-medium">Madison Academy</div>
                <div className="text-sm text-muted-foreground">35 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '40%' }}></div>
              </div>

              <div className="flex items-center justify-between">
                <div className="font-medium">Roosevelt High School</div>
                <div className="text-sm text-muted-foreground">28 reports</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-buswatch-primary h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent System Activity</CardTitle>
            <CardDescription>Latest actions in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-buswatch-primary" />
                <div>
                  <div className="font-medium">New school admin account created</div>
                  <div className="text-sm text-muted-foreground">
                    For Jefferson Middle School • 2 hours ago
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-buswatch-primary" />
                <div>
                  <div className="font-medium">System settings updated</div>
                  <div className="text-sm text-muted-foreground">
                    By Mike Super • Yesterday at 10:23 AM
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-buswatch-primary" />
                <div>
                  <div className="font-medium">New driver account created</div>
                  <div className="text-sm text-muted-foreground">
                    For Washington High School • Yesterday at 9:15 AM
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="h-2 w-2 mt-2 rounded-full bg-buswatch-primary" />
                <div>
                  <div className="font-medium">New school added</div>
                  <div className="text-sm text-muted-foreground">
                    Madison Academy • 2 days ago
                  </div>
                </div>
              </div>

              <Button onClick={() => navigate('/audit-logs')} variant="link" className="px-0 mt-2">
                View all activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reports Over Time</CardTitle>
          <CardDescription>System-wide report trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Bar dataKey="reports" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
