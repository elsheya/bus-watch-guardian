
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunicationDashboard from '../components/CommunicationDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name || 'User'}
        </p>
      </div>

      {/* Show different dashboard based on user role */}
      {user?.role === 'driver' && <DriverDashboard />}
      {user?.role === 'school-admin' && <SchoolAdminDashboard />}
      {user?.role === 'super-admin' && <SuperAdminDashboard />}
    </div>
  );
};

const DriverDashboard: React.FC = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>Your recently submitted reports</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          You have submitted 3 reports in the past month.
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks for drivers</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          Create a new report by visiting the Reports page and clicking "New Report".
        </p>
      </CardContent>
    </Card>
  </div>
);

const SchoolAdminDashboard: React.FC = () => (
  <div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Recent Reports</CardTitle>
        <CardDescription>Recently submitted reports for your school</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          There are 5 new reports awaiting your review.
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Reports by Status</CardTitle>
        <CardDescription>Current status of misconduct reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <span>Pending</span>
            <span className="font-medium">5</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Reviewed</span>
            <span className="font-medium">8</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Resolved</span>
            <span className="font-medium">12</span>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
);

const SuperAdminDashboard: React.FC = () => (
  <div className="space-y-6">
    <Tabs defaultValue="summary">
      <TabsList>
        <TabsTrigger value="summary">Summary</TabsTrigger>
        <TabsTrigger value="communications">Communications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="summary" className="pt-4">
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-3xl">25</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Schools</CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-3xl">8</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Reports</CardTitle>
            </CardHeader>
            <CardContent className="font-bold text-3xl">142</CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="communications" className="pt-4">
        <CommunicationDashboard />
      </TabsContent>
    </Tabs>
  </div>
);

export default Dashboard;
