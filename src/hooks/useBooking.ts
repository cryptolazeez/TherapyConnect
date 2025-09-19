import { useState, useCallback } from 'react';
import { Booking, ServiceType, TrainerProfile } from '../types';

interface BookingState {
  selectedService: ServiceType | null;
  selectedTrainer: TrainerProfile | null;
  selectedDate: string | null;
  selectedTime: string | null;
  sessionMode: 'video' | 'audio' | 'chat';
  notes: string;
}

const initialState: BookingState = {
  selectedService: null,
  selectedTrainer: null,
  selectedDate: null,
  selectedTime: null,
  sessionMode: 'video',
  notes: '',
};

export const useBooking = () => {
  const [bookingState, setBookingState] = useState<BookingState>(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const updateBookingState = useCallback((updates: Partial<BookingState>) => {
    setBookingState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetBooking = useCallback(() => {
    setBookingState(initialState);
  }, []);

  const createBooking = useCallback(async (): Promise<Booking> => {
    if (!bookingState.selectedService || !bookingState.selectedTrainer || 
        !bookingState.selectedDate || !bookingState.selectedTime) {
      throw new Error('Missing required booking information');
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/v1/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          serviceId: bookingState.selectedService.id,
          trainerId: bookingState.selectedTrainer.id,
          scheduledAt: `${bookingState.selectedDate}T${bookingState.selectedTime}`,
          sessionMode: bookingState.sessionMode,
          notes: bookingState.notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to create booking');

      const booking = await response.json();
      resetBooking();
      return booking;
    } finally {
      setIsLoading(false);
    }
  }, [bookingState, resetBooking]);

  return {
    bookingState,
    updateBookingState,
    resetBooking,
    createBooking,
    isLoading,
  };
};