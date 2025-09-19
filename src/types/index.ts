export interface User {
  id: string;
  email: string;
  role: 'user' | 'trainer' | 'admin';
  profile?: UserProfile | TrainerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
  preferences: string[];
  loyaltyPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

export interface TrainerProfile {
  firstName: string;
  lastName: string;
  phone: string;
  specializations: string[];
  certifications: string[];
  hourlyRate: number;
  availability: AvailabilitySlot[];
  rating: number;
  reviewCount: number;
  bio: string;
  experience: number;
  isVerified: boolean;
  profileImage?: string;
}

export interface AvailabilitySlot {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isRecurring: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  trainerId: string;
  serviceType: ServiceType;
  scheduledAt: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  sessionMode: 'video' | 'audio' | 'chat';
  notes?: string;
  feedback?: SessionFeedback;
}

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  duration: number;
  icon: string;
}

export interface SessionFeedback {
  rating: number;
  review: string;
  isRecommended: boolean;
  submittedAt: string;
}

export interface EmergencyRequest {
  bookingId: string;
  reason: string;
  preferredAction: 'switch' | 'reschedule' | 'refund';
  alternativeTrainers?: string[];
  newSchedule?: string;
}

export interface LoyaltyBenefit {
  id: string;
  name: string;
  description: string;
  pointsCost: number;
  type: 'discount' | 'priority' | 'free_session' | 'upgrade';
  isActive: boolean;
}

export interface Recommendation {
  type: 'trainer' | 'service';
  item: TrainerProfile | ServiceType;
  score: number;
  reason: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}