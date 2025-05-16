
import React, { useState } from 'react';
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
import { AuditLog } from '../types';
import { Search, ActivitySquare, FileText } from 'lucide-react';

// Mock data for audit logs
const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Driver',
    userRole: 'driver',
    action: 'create',
    entityType: 'report',
    entityId: '1',
    details: 'Created new misconduct report',
    createdAt: new Date('2023-06-01T14:32:00')
  },
  {
    id: '2',
    userId: '2',
    userName: 'Sarah Admin',
    userRole: 'school-admin',
    action: 'update',
    entityType: 'report',
    entityId: '1',
    details: 'Changed status from pending to reviewed',
    createdAt: new Date('2023-06-02T09:15:00')
  },
  {
    id: '3',
    userId: '2',
    userName: 'Sarah Admin',
    userRole: 'school-admin',
    action: 'add_comment',
    entityType: 'comment',
    entityId: '1',
    details: 'Added comment to report #1',
    createdAt: new Date('2023-06-02T09:20:00')
  },
  {
    id: '4',
    userId: '3',
    userName: 'Mike Super',
    userRole: 'super-admin',
    action: 'create',
    entityType: 'user',
    entityId: '4',
    details: 'Created new user: Emily Driver',
    createdAt: new Date('2023-06-03T11:45:00')
  },
  {
    id: '5',
    userId: '3',
    userName: 'Mike Super',
    userRole: 'super-admin',
    action: 'update',
    entityType: 'school',
    entityId: '2',
    details: 'Updated school information: Lincoln Middle School',
    createdAt: new Date('2023-06-04T16:20:00')
  },
  {
    id: '6',
    userId: '1',
    userName: 'John Driver',
    userRole: 'driver',
    action: 'create',
    entityType: 'report',
    entityId: '2',
    details: 'Created new misconduct report',
    createdAt: new Date('2023-06-05T15:10:00')
  },
  {
    id: '7',
    userId: '2',
    userName: 'Sarah Admin',
    userRole: 'school-admin',
    action: 'update',
    entityType: 'report',
    entityId: '2',
    details: 'Changed status from pending to resolved',
    createdAt: new Date('2023-06-06T10:30:00')
  }
];

const AuditLogs: React.FC = () => {
  const { hasRole } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  
  // Filter audit logs based on search and filters
  const filteredLogs = mockAuditLogs.filter(log => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        log.userName.toLowerCase().includes(query) ||
        log.details.toLowerCase().includes(query) ||
        log.userRole.toLowerCase().includes(query)
      );
    }
    return true;
  }).filter(log => {
    // Entity type filter
    if (entityFilter !== 'all') {
      return log.entityType === entityFilter;
    }
    return true;
  }).filter(log => {
    // Action filter
    if (actionFilter !== 'all') {
      return log.action === actionFilter;
    }
    return true;
  });
  
  // Get unique entity types and actions for filters
  const getEntityTypes = () => {
    const types = mockAuditLogs.map(log => log.entityType);
    return ['all', ...new Set(types)];
  };
  
  const getActions = () => {
    const actions = mockAuditLogs.map(log => log.action);
    return ['all', ...new Set(actions)];
  };
  
  const getActionBadge = (action: string) => {
    switch (action) {
      case 'create':
        return <Badge className="bg-green-500 hover:bg-green-600">Create</Badge>;
      case 'update':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Update</Badge>;
      case 'delete':
        return <Badge className="bg-red-500 hover:bg-red-600">Delete</Badge>;
      case 'add_comment':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Comment</Badge>;
      default:
        return <Badge>{action}</Badge>;
    }
  };
  
  const getEntityBadge = (entityType: string) => {
    switch (entityType) {
      case 'report':
        return <Badge variant="outline">Report</Badge>;
      case 'user':
        return <Badge variant="outline">User</Badge>;
      case 'school':
        return <Badge variant="outline">School</Badge>;
      case 'comment':
        return <Badge variant="outline">Comment</Badge>;
      case 'system':
        return <Badge variant="outline">System</Badge>;
      default:
        return <Badge variant="outline">{entityType}</Badge>;
    }
  };

  // Only super-admins can access this page
  if (!hasRole(['super-admin'])) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
        <p>You don't have permission to access audit logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-muted-foreground mt-1">
          Track all system activities and changes
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center">
                <ActivitySquare size={18} className="mr-2" />
                System Activity
              </CardTitle>
              <CardDescription>
                {filteredLogs.length} activities found
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search logs..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={entityFilter}
                  onValueChange={(value) => setEntityFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Entity Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {getEntityTypes().map((type) => (
                      <SelectItem key={type} value={type}>
                        {type === 'all' ? 'All Entities' : type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={actionFilter}
                  onValueChange={(value) => setActionFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Action" />
                  </SelectTrigger>
                  <SelectContent>
                    {getActions().map((action) => (
                      <SelectItem key={action} value={action}>
                        {action === 'all' 
                          ? 'All Actions' 
                          : action.split('_').map(word => 
                              word.charAt(0).toUpperCase() + word.slice(1)
                            ).join(' ')}
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
                  <TableHead>Date & Time</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity Type</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{format(log.createdAt, 'MMM d, yyyy h:mm a')}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{log.userName}</div>
                          <div className="text-xs text-muted-foreground capitalize">{log.userRole.replace('-', ' ')}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>{getEntityBadge(log.entityType)}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                      No audit logs found matching your search criteria.
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

export default AuditLogs;
