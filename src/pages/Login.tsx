
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  // Check if we have saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('buswatch_email');
    const shouldRemember = localStorage.getItem('buswatch_remember') === 'true';
    
    if (savedEmail && shouldRemember) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Save email if "Remember Me" is checked
      if (rememberMe) {
        localStorage.setItem('buswatch_email', email);
        localStorage.setItem('buswatch_remember', 'true');
      } else {
        localStorage.removeItem('buswatch_email');
        localStorage.removeItem('buswatch_remember');
      }

      await login(email, password);
      toast({
        title: "Welcome to BusWatch",
        description: "You have successfully logged in.",
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Try using demo accounts: driver@buswatch.com, schooladmin@buswatch.com, or superadmin@buswatch.com with any password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-buswatch-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-buswatch-primary p-3 rounded-full">
              <span className="text-white text-2xl font-bold">BW</span>
            </div>
          </div>
          <h1 className="mt-4 text-3xl font-bold">BusWatch</h1>
          <p className="mt-2 text-gray-600">
            Sign in to manage student misconduct reports
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="driver@buswatch.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Any password will work for demo"
                  required
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="remember-me" 
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                />
                <Label htmlFor="remember-me" className="text-sm cursor-pointer">Remember me</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="text-center text-sm">
          <p className="text-gray-500">Demo accounts:</p>
          <div className="mt-2 space-y-1">
            <p>Driver: driver@buswatch.com</p>
            <p>School Admin: schooladmin@buswatch.com</p>
            <p>Super Admin: superadmin@buswatch.com</p>
          </div>
          <p className="mt-2 text-gray-500">(Use any password)</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
