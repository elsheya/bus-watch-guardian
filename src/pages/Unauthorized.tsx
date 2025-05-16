
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-buswatch-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="bg-buswatch-error/20 p-4 rounded-full">
            <ShieldAlert size={64} className="text-buswatch-error" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold">Access Denied</h1>
        
        <p className="text-gray-600">
          You don't have permission to access this page. Please contact your administrator
          if you believe this is an error.
        </p>
        
        <div className="pt-4">
          <Button onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
