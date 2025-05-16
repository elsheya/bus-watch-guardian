
import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, FilePlus, ClipboardList, Users, School, ActivitySquare, LogOut } from 'lucide-react';

export const MainLayout: React.FC = () => {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex flex-col items-center px-3 py-6">
            <div className="flex items-center space-x-2 text-2xl font-bold text-white">
              <span className="bg-white text-primary p-1 rounded">BW</span>
              <span>BusWatch</span>
            </div>
            {user && (
              <div className="mt-4 text-center">
                <div className="text-sm text-white">{user.name}</div>
                <div className="text-xs text-white/70 capitalize">{user.role.replace('-', ' ')}</div>
              </div>
            )}
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={() => navigate('/dashboard')}
                      className={isActive('/dashboard') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    >
                      <LayoutDashboard size={20} />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {hasRole(['driver', 'school-admin', 'super-admin']) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => navigate('/reports')}
                        className={isActive('/reports') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                      >
                        <ClipboardList size={20} />
                        <span>Reports</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {hasRole(['driver']) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => navigate('/new-report')}
                        className={isActive('/new-report') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                      >
                        <FilePlus size={20} />
                        <span>New Report</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {hasRole(['super-admin']) && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/users')}
                          className={isActive('/users') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                        >
                          <Users size={20} />
                          <span>User Management</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/schools')}
                          className={isActive('/schools') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                        >
                          <School size={20} />
                          <span>School Management</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton 
                          onClick={() => navigate('/audit-logs')}
                          className={isActive('/audit-logs') ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                        >
                          <ActivitySquare size={20} />
                          <span>Audit Logs</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-2" />
              Sign Out
            </Button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1">
          <div className="container py-6">
            <SidebarTrigger className="mb-6 lg:hidden" />
            <div className="py-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
