import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { Layout } from './components/common/Layout';
import { LandingPage } from './components/pages/LandingPage';
import { AuthPage } from './components/pages/AuthPage';
import Dashboard from './components/pages/Dashboard';
import BookingFlow from './components/pages/BookingFlow';
import { Profile } from './components/pages/Profile';
import { Settings } from './components/pages/Settings';
import { MyBookings } from './components/pages/MyBookings';
import CoachDashboard from './components/pages/CoachDashboard';

type ToastOptions = {
  duration?: number;
  style?: React.CSSProperties;
  success?: {
    duration: number;
    iconTheme: {
      primary: string;
      secondary: string;
    };
  };
  error?: {
    duration: number;
    iconTheme: {
      primary: string;
      secondary: string;
    };
  };
};

interface ProtectedRouteProps {
  children?: React.ReactNode;
  element?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    // Store the intended destination before redirecting to login
    const redirectPath = window.location.pathname;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirectPath)}`} replace />;
  }
  
  return <>{element || children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={user?.role === 'trainer' ? <CoachDashboard /> : <Dashboard />}
          />
        }
      />
      <Route
        path="/book"
        element={
          <ProtectedRoute>
            <BookingFlow />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="general" replace />} />
        <Route path=":tab" element={<Settings />} />
      </Route>
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  const toastOptions: ToastOptions = {
    duration: 4000,
    style: {
      background: '#363636',
      color: '#fff',
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#4ade80',
        secondary: '#fff',
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#ef4444',
        secondary: '#fff',
      },
    },
  };

  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <Toaster position="top-right" toastOptions={toastOptions} />
          <Layout>
            <AppRoutes />
          </Layout>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;