import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Calendar, Clock, Video, Headphones, MessageSquare, Check } from 'lucide-react';
import { useBooking } from '../../hooks/useBooking';
import { Button } from '../common/Button';
import { ServiceType, TrainerProfile } from '../../types';
import toast from 'react-hot-toast';

const BookingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { bookingState, updateBookingState, createBooking, isLoading } = useBooking();

  const steps = [
    { number: 1, title: 'Select Service', description: 'Choose your therapy type' },
    { number: 2, title: 'Choose Therapist', description: 'Find your perfect match' },
    { number: 3, title: 'Schedule Session', description: 'Pick date and time' },
    { number: 4, title: 'Payment & Confirmation', description: 'Complete your booking' },
  ];

  const services: ServiceType[] = [
    {
      id: '1',
      name: 'Individual Therapy',
      description: 'One-on-one sessions with certified therapists for personal growth and healing',
      category: 'Therapy',
      basePrice: 120,
      duration: 50,
      icon: 'user',
    },
    {
      id: '2',
      name: 'Couples Counseling',
      description: 'Relationship therapy to strengthen bonds and improve communication',
      category: 'Relationship',
      basePrice: 150,
      duration: 60,
      icon: 'users',
    },
    {
      id: '3',
      name: 'Life Coaching',
      description: 'Goal-oriented guidance for personal and professional development',
      category: 'Coaching',
      basePrice: 100,
      duration: 45,
      icon: 'target',
    },
  ];

  const trainers: TrainerProfile[] = [
    {
      firstName: 'Sarah',
      lastName: 'Mitchell',
      phone: '+1-234-567-8901',
      specializations: ['Anxiety', 'Depression', 'Trauma'],
      certifications: ['PhD Psychology', 'Licensed Clinical Psychologist'],
      hourlyRate: 120,
      availability: [],
      rating: 4.9,
      reviewCount: 127,
      bio: 'Dr. Mitchell specializes in cognitive behavioral therapy and has over 12 years of experience helping clients overcome anxiety and depression.',
      experience: 12,
      isVerified: true,
      profileImage: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      phone: '+1-234-567-8902',
      specializations: ['Trauma', 'PTSD', 'Anxiety'],
      certifications: ['PhD Clinical Psychology', 'EMDR Certified'],
      hourlyRate: 100,
      availability: [],
      rating: 4.8,
      reviewCount: 89,
      bio: 'Dr. Chen is an expert in trauma therapy and EMDR, helping clients process difficult experiences and build resilience.',
      experience: 8,
      isVerified: true,
      profileImage: 'https://images.pexels.com/photos/612999/pexels-photo-612999.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
    },
  ];

  const sessionModes = [
    { id: 'video', name: 'Video Call', icon: Video, description: 'Face-to-face interaction' },
    { id: 'audio', name: 'Voice Call', icon: Headphones, description: 'Audio-only session' },
    { id: 'chat', name: 'Text Chat', icon: MessageSquare, description: 'Written conversation' },
  ];

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompleteBooking = async () => {
    try {
      const booking = await createBooking();
      toast.success('Booking created successfully!');
      // Redirect to confirmation page or dashboard
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  const isStepComplete = (step: number) => {
    switch (step) {
      case 1: return !!bookingState.selectedService;
      case 2: return !!bookingState.selectedTrainer;
      case 3: return !!bookingState.selectedDate && !!bookingState.selectedTime;
      case 4: return false; // Payment step
      default: return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.number
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'border-gray-300 text-gray-500'
                } ${isStepComplete(step.number) ? 'bg-green-600 border-green-600' : ''}`}
              >
                {isStepComplete(step.number) ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.number
                )}
              </div>
              <div className="ml-3 text-left">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.number ? 'bg-primary-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Service</h2>
              <div className="grid gap-6">
                {services.map((service) => (
                  <motion.div
                    key={service.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      bookingState.selectedService?.id === service.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateBookingState({ selectedService: service })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                        <p className="text-gray-600 mb-4">{service.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Duration: {service.duration} minutes</span>
                          <span>Category: {service.category}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary-600">${service.basePrice}</div>
                        <div className="text-sm text-gray-500">per session</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Trainer Selection */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Therapist</h2>
              <div className="grid gap-6">
                {trainers.map((trainer, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.02 }}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all ${
                      bookingState.selectedTrainer === trainer
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateBookingState({ selectedTrainer: trainer })}
                  >
                    <div className="flex items-start space-x-4">
                      <img
                        src={trainer.profileImage}
                        alt={`${trainer.firstName} ${trainer.lastName}`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Dr. {trainer.firstName} {trainer.lastName}
                          </h3>
                          <div className="text-right">
                            <div className="text-xl font-bold text-primary-600">${trainer.hourlyRate}/hr</div>
                            {trainer.isVerified && (
                              <div className="text-sm text-green-600">✓ Verified</div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center mb-2">
                          <div className="flex text-yellow-400 mr-2">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={i < Math.floor(trainer.rating) ? 'fill-current' : 'text-gray-300'}>
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {trainer.rating} ({trainer.reviewCount} reviews)
                          </span>
                          <span className="ml-4 text-sm text-gray-600">
                            {trainer.experience} years experience
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{trainer.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {trainer.specializations.map((spec) => (
                            <span
                              key={spec}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Scheduling */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Session</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Date</h3>
                  <div className="border border-gray-300 rounded-lg p-4">
                    <Calendar className="w-6 h-6 text-gray-400 mb-2" />
                    <input
                      type="date"
                      value={bookingState.selectedDate || ''}
                      onChange={(e) => updateBookingState({ selectedDate: e.target.value })}
                      className="w-full border-none outline-none text-lg"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                      <button
                        key={time}
                        onClick={() => updateBookingState({ selectedTime: time })}
                        className={`p-3 border rounded-lg text-center ${
                          bookingState.selectedTime === time
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'border-gray-300 hover:border-primary-300'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Mode</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {sessionModes.map((mode) => (
                    <motion.div
                      key={mode.id}
                      whileHover={{ scale: 1.05 }}
                      className={`p-4 border-2 rounded-xl cursor-pointer text-center ${
                        bookingState.sessionMode === mode.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => updateBookingState({ sessionMode: mode.id as any })}
                    >
                      <mode.icon className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                      <h4 className="font-semibold text-gray-900">{mode.name}</h4>
                      <p className="text-sm text-gray-600">{mode.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes (Optional)</h3>
                <textarea
                  value={bookingState.notes}
                  onChange={(e) => updateBookingState({ notes: e.target.value })}
                  placeholder="Any specific topics you'd like to focus on or information your therapist should know..."
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows={4}
                />
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment & Confirmation */}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Confirm Your Booking</h2>
              
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{bookingState.selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Therapist:</span>
                    <span className="font-medium">
                      Dr. {bookingState.selectedTrainer?.firstName} {bookingState.selectedTrainer?.lastName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium">
                      {bookingState.selectedDate} at {bookingState.selectedTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Session Mode:</span>
                    <span className="font-medium capitalize">{bookingState.sessionMode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{bookingState.selectedService?.duration} minutes</span>
                  </div>
                  <hr className="my-4" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-primary-600">${bookingState.selectedService?.basePrice}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Session Information</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• You'll receive a confirmation email with session details</li>
                  <li>• Join links will be sent 15 minutes before your session</li>
                  <li>• Free cancellation up to 24 hours before your session</li>
                  <li>• Emergency support available 24/7</li>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className={currentStep === 1 ? 'invisible' : ''}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              disabled={!isStepComplete(currentStep)}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleCompleteBooking}
              isLoading={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              Complete Booking
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingFlow;