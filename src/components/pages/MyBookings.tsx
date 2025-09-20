import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Video, Phone, MessageSquare, Clock as ClockIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../common/Button';

type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  therapist: {
    name: string;
    specialization: string;
    avatar: string;
  };
  date: Date;
  duration: number;
  sessionType: 'video' | 'audio' | 'chat';
  status: BookingStatus;
}

const mockBookings: Booking[] = [
  {
    id: '1',
    therapist: {
      name: 'Dr. Sarah Johnson',
      specialization: 'Cognitive Behavioral Therapy',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    date: new Date(2023, 10, 15, 14, 30),
    duration: 60,
    sessionType: 'video',
    status: 'upcoming',
  },
  {
    id: '2',
    therapist: {
      name: 'Dr. Michael Chen',
      specialization: 'Anxiety & Stress Management',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    date: new Date(2023, 10, 10, 11, 0),
    duration: 45,
    sessionType: 'audio',
    status: 'completed',
  },
];

const statusStyles = {
  upcoming: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const sessionIcons = {
  video: Video,
  audio: Phone,
  chat: MessageSquare,
};

export const MyBookings: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<BookingStatus>('upcoming');
  
  const filteredBookings = mockBookings.filter(booking => 
    activeTab === 'upcoming' 
      ? booking.status === 'upcoming' 
      : booking.status !== 'upcoming'
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Therapy Sessions</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-200">
          {(['upcoming', 'completed', 'cancelled'] as BookingStatus[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                activeTab === tab
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({tab === 'upcoming' ? 1 : tab === 'completed' ? 1 : 0})
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
            {filteredBookings.map((booking) => {
              const SessionIcon = sessionIcons[booking.sessionType];
              
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start space-x-4">
                        <img
                          src={booking.therapist.avatar}
                          alt={booking.therapist.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.therapist.name}
                          </h3>
                          <p className="text-gray-600">{booking.therapist.specialization}</p>
                          
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1.5" />
                              {format(booking.date, 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1.5" />
                              {format(booking.date, 'h:mm a')}
                            </div>
                            <div className="flex items-center">
                              <SessionIcon className="h-4 w-4 mr-1.5" />
                              {booking.sessionType.charAt(0).toUpperCase() + booking.sessionType.slice(1)}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 md:mt-0 flex flex-col items-end">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {booking.status === 'upcoming' && (
                          <div className="mt-3 space-x-2">
                            <Button variant="outline" size="sm" className="text-sm">
                              Reschedule
                            </Button>
                            <Button variant="outline" size="sm" className="text-sm text-red-600 border-red-200 hover:bg-red-50">
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {booking.status === 'upcoming' && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <Button className="w-full md:w-auto" size="sm">
                          Join Session
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No {activeTab} sessions</h3>
            <p className="mt-1 text-gray-500">You don't have any {activeTab} therapy sessions.</p>
            {activeTab !== 'upcoming' && (
              <Button className="mt-4" onClick={() => setActiveTab('upcoming')}>
                View upcoming sessions
              </Button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MyBookings;
