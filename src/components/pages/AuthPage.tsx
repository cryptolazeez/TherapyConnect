import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Heart, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';
import { Input } from '../common/Input';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Form validation schemas
const loginSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().required('Password is required'),
});

const registerSchema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  role: yup.string().oneOf(['user', 'trainer'], 'Please select a role').required('Role is required'),
});

// Type definitions
type LoginFormData = yup.InferType<typeof loginSchema>;
type RegisterFormData = yup.InferType<typeof registerSchema>;

type FormData = LoginFormData | RegisterFormData;

interface AuthPageProps {
  mode: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ mode }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();

  // Initialize form with validation schema based on mode
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: yupResolver(mode === 'login' ? loginSchema : registerSchema) as any,
    mode: 'onChange',
  });

  // Type guard to check if the form is in register mode
  const isRegisterMode = mode === 'register';
  const registerErrors = errors as any; // Type assertion for register-specific fields

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        toast.success('Successfully logged in!');
        navigate('/dashboard', { replace: true });
      } else {
        const registerData = data as RegisterFormData;
        await registerUser(registerData.email, registerData.password, registerData.role);
        toast.success('Account created successfully!');
        navigate(registerData.role === 'trainer' ? '/onboarding' : '/dashboard', { replace: true });
      }
    } catch (error) {
      toast.error(mode === 'login' 
        ? 'Login failed. Please check your credentials.' 
        : 'Registration failed. Please try again.'
      );
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Register form fields with proper types
  const emailField = register('email');
  const passwordField = register('password');
  const confirmPasswordField = register('confirmPassword');
  const roleField = register('role');

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-primary-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600 mt-2">
              {mode === 'login' 
                ? 'Sign in to continue your journey'
                : 'Join our community of healing and growth'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              {...emailField}
              error={errors.email?.message}
              placeholder="Enter your email"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                {...passwordField}
                error={errors.password?.message}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            {mode === 'register' && (
              <>
                <Input
                  label="Confirm Password"
                  type="password"
                  {...confirmPasswordField}
                  error={isRegisterMode ? registerErrors.confirmPassword?.message : undefined}
                  placeholder="Confirm your password"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    I want to join as a:
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="user"
                        {...roleField}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">Client seeking therapy</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="trainer"
                        {...roleField}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-900">Certified therapist/coach</span>
                    </label>
                  </div>
                  {isRegisterMode && registerErrors.role && (
                    <p className="mt-1 text-sm text-red-600">{registerErrors.role.message}</p>
                  )}
                </div>
              </>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <a
                href={mode === 'login' ? '/register' : '/login'}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </a>
            </p>
          </div>

          {mode === 'login' && (
            <div className="mt-4 text-center">
              <a
                href="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};