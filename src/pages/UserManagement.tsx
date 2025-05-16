
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { User, UserRole, School } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Search, UserPlus, Users, Pencil, Trash2 } from 'lucide-react';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Driver',
    email: 'driver@buswatch.com',
    role: 'driver',
    schoolId: '1',
    createdAt: new Date('2023-01-15')
  },
  {
    id: '2',
    name: 'Sarah Admin',
    email: 'schooladmin@buswatch.com',
    role: 'school-admin',
    schoolId: '1',
    createdAt: new Date('2023-01-10')
  },
  {
    id: '3',
    name: 'Mike Super',
    email: 'superadmin@buswatch.com',
    role: 'super-admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '4',
    name: 'Emily Driver',
    email: 'emily@buswatch.com',
    role: 'driver',
    schoolId: '2',
    createdAt: new Date('2023-02-15')
  },
  {
    id: '5',
    name: 'Robert Admin',
    email: 'robert@buswatch.com',
    role: 'school-admin',
    schoolId: '2',
    createdAt: new Date('2023-02-10')
  }
];

// Mock data for schools
const mockSchools: School[] = [
  {
    id: '1',
    name: 'Washington High School',
    address: '123 Main St',
    city: 'Washington',
    state: 'DC',
    zip: '20001',
    phone: '(202) 555-0100'
  },
  {
    id: '2',
    name: 'Lincoln Middle School',
    address: '456 Park Ave',
    city: 'Washington',
    state: 'DC',
    zip: '20002',
    phone: '(202) 555-0200'
  }
];

const UserManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(mockUsers);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'driver' as UserRole,
    schoolId: '',
    password: '' // For new users only
  });

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getSchoolName = (schoolId?: string) => {
    if (!schoolId) return 'N/A';
    const school = mockSchools.find(s => s.id === schoolId);
    return school ? school.name : 'Unknown School';
  };
  
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'driver':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Driver</Badge>;
      case 'school-admin':
        return <Badge className="bg-blue-500 hover:bg-blue-600">School Admin</Badge>;
      case 'super-admin':
        return <Badge className="bg-red-500 hover:bg-red-600">Super Admin</Badge>;
      default:
        return null;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as UserRole
    });
  };

  const handleSchoolChange = (value: string) => {
    setFormData({
      ...formData,
      schoolId: value
    });
  };

  const handleAddUser = () => {
    setIsEditing(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'driver',
      schoolId: '',
      password: ''
    });
    setDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setIsEditing(true);
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId || '',
      password: '' // Don't include password when editing
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && selectedUser) {
      // Update existing user
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return {
            ...user,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            schoolId: formData.schoolId || undefined
          };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      toast({
        title: "User Updated",
        description: `${formData.name}'s information has been updated.`
      });
    } else {
      // Add new user
      const newUser: User = {
        id: Math.random().toString(36).substring(2, 9),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        schoolId: formData.schoolId || undefined,
        createdAt: new Date()
      };
      
      setUsers([...users, newUser]);
      toast({
        title: "User Created",
        description: `${formData.name} has been added as a ${formData.role}.`
      });
    }
    
    setDialogOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      
      toast({
        title: "User Deleted",
        description: "The user has been removed from the system."
      });
    }
  };

  // Only super-admins can access this page
  if (!hasRole(['super-admin'])) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Unauthorized Access</h2>
        <p>You don't have permission to access user management features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and their roles
          </p>
        </div>

        <Button onClick={handleAddUser}>
          <UserPlus size={18} className="mr-2" />
          Add New User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center">
                <Users size={18} className="mr-2" />
                System Users
              </CardTitle>
              <CardDescription>
                {filteredUsers.length} users found
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8 w-full sm:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>School</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getSchoolName(user.schoolId)}</TableCell>
                      <TableCell>{format(user.createdAt, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No users found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update user information and role assignments.'
                : 'Create a new user account and assign appropriate access roles.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {!isEditing && (
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!isEditing}
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="school-admin">School Administrator</SelectItem>
                    <SelectItem value="super-admin">Super Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(formData.role === 'driver' || formData.role === 'school-admin') && (
                <div className="grid gap-2">
                  <Label htmlFor="school">Assigned School</Label>
                  <Select
                    value={formData.schoolId}
                    onValueChange={handleSchoolChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select school" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockSchools.map((school) => (
                        <SelectItem key={school.id} value={school.id}>
                          {school.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Create User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;
