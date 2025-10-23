import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, LogOut, User, Stethoscope } from 'lucide-react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <Stethoscope className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            MedPlanner
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">{user.name}</span>
                <span className="text-muted-foreground">({user.role})</span>
              </div>
              {user.role === 'doctor' && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/doctor')}>
                  <Calendar className="h-4 w-4" />
                  Dashboard
                </Button>
              )}
              {user.role === 'patient' && (
                <Button variant="ghost" size="sm" onClick={() => navigate('/patient')}>
                  <Calendar className="h-4 w-4" />
                  My Appointments
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>
                Login
              </Button>
              <Button variant="default" size="sm" onClick={() => navigate('/auth?mode=signup')}>
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
