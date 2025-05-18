
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
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
import { Search, UserPlus, Users, Pencil, Trash2, Loader2 } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'driver' as UserRole,
    schoolId: '',
    password: '' // For new users only
  });

  // Fetch users and schools from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch profiles (users)
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('*');

        if (profilesError) {
          throw profilesError;
        }

        // Transform profiles data to match User type
        const transformedUsers: User[] = profilesData.map(profile => ({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role as UserRole,
          schoolId: profile.school_id,
          createdAt: new Date(profile.created_at)
        }));

        setUsers(transformedUsers);

        // Fetch schools
        const { data: schoolsData, error: schoolsError } = await supabase
          .from('schools')
          .select('*');

        if (schoolsError) {
          throw schoolsError;
        }

        // Transform schools data to match School type
        const transformedSchools: School[] = schoolsData.map(school => ({
          id: school.id,
          name: school.name,
          address: school.address,
          city: school.city,
          state: school.state,
          zip: school.zip,
          phone: school.phone
        }));

        setSchools(transformedSchools);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load users and schools data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

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
    const school = schools.find(s => s.id === schoolId);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedUser) {
        // Update existing user in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            name: formData.name,
            email: formData.email,
            role: formData.role,
            school_id: formData.schoolId || null
          })
          .eq('id', selectedUser.id);
        
        if (error) throw error;
        
        // Update local state
        setUsers(prevUsers => prevUsers.map(user => {
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
        }));
        
        toast({
          title: "User Updated",
          description: `${formData.name}'s information has been updated.`
        });
      } else {
        // Create new user via Supabase Auth API first
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
          user_metadata: {
            name: formData.name,
            role: formData.role
          }
        });
        
        if (authError) throw authError;
        
        // If auth creation successful, update the profile with school_id
        if (authData.user) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              school_id: formData.schoolId || null
            })
            .eq('id', authData.user.id);
          
          if (updateError) throw updateError;
          
          // Add to local state
          const newUser: User = {
            id: authData.user.id,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            schoolId: formData.schoolId || undefined,
            createdAt: new Date()
          };
          
          setUsers(prevUsers => [...prevUsers, newUser]);
          
          toast({
            title: "User Created",
            description: `${formData.name} has been added as a ${formData.role}.`
          });
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} user. ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setDialogOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Delete user via Supabase Auth API
        const { error } = await supabase.auth.admin.deleteUser(userId);
        
        if (error) throw error;
        
        // Update local state
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        
        toast({
          title: "User Deleted",
          description: "The user has been removed from the system."
        });
      } catch (error) {
        console.error('Error deleting user:', error);
        toast({
          title: "Error",
          description: `Failed to delete user. ${(error as Error).message}`,
          variant: "destructive"
        });
      }
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
                {isLoading ? 'Loading users...' : `${filteredUsers.length} users found`}
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
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading users...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getSchoolName(user.schoolId)}</TableCell>
                      <TableCell>{user.createdAt ? format(user.createdAt, 'MMM d, yyyy') : 'N/A'}</TableCell>
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
                      {schools.map((school) => (
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
