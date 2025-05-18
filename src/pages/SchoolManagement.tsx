
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
import { Label } from '@/components/ui/label';
import { School } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Search, School as SchoolIcon, PlusCircle, Pencil, Trash2, Loader2 } from 'lucide-react';

const SchoolManagement: React.FC = () => {
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [schools, setSchools] = useState<School[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  });

  // Fetch schools from Supabase
  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('schools')
          .select('*');

        if (error) {
          throw error;
        }

        // Transform data to match School type
        const transformedSchools: School[] = data.map(school => ({
          id: school.id,
          name: school.name,
          address: school.address || '',
          city: school.city || '',
          state: school.state || '',
          zip: school.zip || '',
          phone: school.phone || ''
        }));

        setSchools(transformedSchools);
      } catch (error) {
        console.error('Error fetching schools:', error);
        toast({
          title: 'Error',
          description: 'Failed to load schools data.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, [toast]);

  // Filter schools based on search query
  const filteredSchools = schools.filter(school => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        school.name.toLowerCase().includes(query) ||
        (school.city && school.city.toLowerCase().includes(query)) ||
        (school.state && school.state.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddSchool = () => {
    setIsEditing(false);
    setSelectedSchool(null);
    setFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      phone: ''
    });
    setDialogOpen(true);
  };

  const handleEditSchool = (school: School) => {
    setIsEditing(true);
    setSelectedSchool(school);
    setFormData({
      name: school.name,
      address: school.address || '',
      city: school.city || '',
      state: school.state || '',
      zip: school.zip || '',
      phone: school.phone || ''
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing && selectedSchool) {
        // Update existing school in Supabase
        const { error } = await supabase
          .from('schools')
          .update({
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            phone: formData.phone
          })
          .eq('id', selectedSchool.id);
        
        if (error) throw error;
        
        // Update local state
        setSchools(prevSchools => prevSchools.map(school => {
          if (school.id === selectedSchool.id) {
            return {
              ...school,
              name: formData.name,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              phone: formData.phone
            };
          }
          return school;
        }));
        
        toast({
          title: "School Updated",
          description: `${formData.name} has been updated successfully.`
        });
      } else {
        // Add new school to Supabase
        const { data, error } = await supabase
          .from('schools')
          .insert({
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            phone: formData.phone
          })
          .select();
        
        if (error) throw error;
        
        if (data && data[0]) {
          // Add to local state
          const newSchool: School = {
            id: data[0].id,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            phone: formData.phone
          };
          
          setSchools(prevSchools => [...prevSchools, newSchool]);
          
          toast({
            title: "School Created",
            description: `${formData.name} has been added to the system.`
          });
        }
      }
    } catch (error) {
      console.error('Error saving school:', error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} school. ${(error as Error).message}`,
        variant: "destructive"
      });
    } finally {
      setDialogOpen(false);
    }
  };

  const handleDeleteSchool = async (schoolId: string) => {
    if (window.confirm('Are you sure you want to delete this school? This will affect all associated users and reports.')) {
      try {
        // Delete school from Supabase
        const { error } = await supabase
          .from('schools')
          .delete()
          .eq('id', schoolId);
        
        if (error) throw error;
        
        // Update local state
        setSchools(prevSchools => prevSchools.filter(school => school.id !== schoolId));
        
        toast({
          title: "School Deleted",
          description: "The school has been removed from the system."
        });
      } catch (error) {
        console.error('Error deleting school:', error);
        toast({
          title: "Error",
          description: `Failed to delete school. ${(error as Error).message}`,
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
        <p>You don't have permission to access school management features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">School Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage schools in the BusWatch system
          </p>
        </div>

        <Button onClick={handleAddSchool}>
          <PlusCircle size={18} className="mr-2" />
          Add New School
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center">
                <SchoolIcon size={18} className="mr-2" />
                Schools
              </CardTitle>
              <CardDescription>
                {isLoading ? 'Loading schools...' : `${filteredSchools.length} schools found`}
              </CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search schools..."
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
                  <TableHead>Address</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex justify-center items-center">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading schools...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredSchools.length > 0 ? (
                  filteredSchools.map((school) => (
                    <TableRow key={school.id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{school.address || '--'}</TableCell>
                      <TableCell>{school.city || '--'}</TableCell>
                      <TableCell>{school.state || '--'}</TableCell>
                      <TableCell>{school.phone || '--'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditSchool(school)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSchool(school.id)}
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
                      No schools found matching your search.
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
            <DialogTitle>{isEditing ? 'Edit School' : 'Add New School'}</DialogTitle>
            <DialogDescription>
              {isEditing
                ? 'Update school information.'
                : 'Add a new school to the system.'}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">School Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? 'Save Changes' : 'Add School'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolManagement;
