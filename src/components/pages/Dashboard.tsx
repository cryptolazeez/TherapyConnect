import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Star, TrendingUp, Award, BookOpen, Heart, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [loyaltyPoints, setLoyaltyPoints] = useState(250);
  const [recommendations, setRecommendations] = useState([]);

  const serviceCategories = [
    {
      name: 'Anxiety & Stress',
      description: 'Professional support for anxiety disorders and stress management',
      icon: Heart,
      color: 'bg-blue-500',
      sessions: 1420,
    },
    {
      name: 'Depression',
      description: 'Specialized therapy for depression and mood disorders',
      icon: Users,
      color: 'bg-purple-500',
      sessions: 980,
    },
    {
      name: 'Life Coaching',
      description: 'Goal-oriented guidance for personal and professional growth',
      icon: TrendingUp,
      color: 'bg-green-500',
      sessions: 760,
    },
    {
      name: 'Relationship',
      description: 'Couples counseling and relationship therapy',
      icon: BookOpen,
      color: 'bg-pink-500',
      sessions: 540,
    },
  ];

  const featuredTrainers = [
    {
      id: 1,
      name: 'Dr. Sarah Mitchell',
      specialty: 'Clinical Psychology',
      rating: 4.9,
      experience: 12,
      image: 'https://images.pexels.com/photos/5699456/pexels-photo-5699456.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      hourlyRate: 120,
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Anxiety & Trauma',
      rating: 4.8,
      experience: 8,
      image: 'https://images.pexels.com/photos/612999/pexels-photo-612999.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      hourlyRate: 100,
    },
    {
      id: 3,
      name: 'Dr. Emily Johnson',
      specialty: 'Life Coaching',
      rating: 4.9,
      experience: 10,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&dpr=1',
      hourlyRate: 90,
    },
  ];

  const loyaltyBenefits = [
    { name: 'Priority Booking', points: 100, unlocked: true },
    { name: 'Free Session', points: 500, unlocked: false },
    { name: 'Premium Support', points: 750, unlocked: false },
    { name: 'VIP Access', points: 1000, unlocked: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600">
          Your journey to better mental health continues here.
        </p>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Session</p>
              <p className="text-2xl font-bold text-gray-900">Tomorrow</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-secondary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center">
            <Star className="h-8 w-8 text-accent-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Loyalty Points</p>
              <p className="text-2xl font-bold text-gray-900">{loyaltyPoints}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
        >
          <div className="flex items-center">
            <Award className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progress</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Service Categories */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {serviceCategories.map((category, index) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                >
                  <div className="flex items-start">
                    <div className={`p-3 rounded-lg ${category.color.replace('500', '100')} mr-4`}>
                      <category.icon className={`h-6 w-6 ${category.color.replace('bg-', 'text-')}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{category.sessions} sessions</span>
                        <Button size="sm">Book Now</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Featured Trainers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Therapists</h2>
            <div className="space-y-4">
              {featuredTrainers.map((trainer, index) => (
                <motion.div
                  key={trainer.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center">
                    <img
                      src={trainer.image}
                      alt={trainer.name}
                      className="h-16 w-16 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{trainer.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{trainer.specialty}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                          <span className="text-sm text-gray-600">{trainer.rating}</span>
                        </div>
                        <span className="text-sm text-gray-600">{trainer.experience} years</span>
                        <span className="text-sm font-medium text-primary-600">
                          ${trainer.hourlyRate}/hour
                        </span>
                      </div>
                    </div>
                    <Button variant="outline">View Profile</Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Loyalty Program */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Program</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-primary-600">{loyaltyPoints}</div>
              <p className="text-sm text-gray-600">Points Available</p>
            </div>
            <div className="space-y-3">
              {loyaltyBenefits.map((benefit, index) => (
                <div
                  key={benefit.name}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    benefit.unlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="text-sm font-medium">{benefit.name}</span>
                  <span className="text-xs">
                    {benefit.unlocked ? '✓' : `${benefit.points} pts`}
                  </span>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" size="sm">
              View All Benefits
            </Button>
          </motion.div>

          {/* Quick Book */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Book</h3>
            <p className="text-sm text-gray-600 mb-4">
              Need immediate support? Book an emergency session.
            </p>
            <Button className="w-full mb-3">Emergency Session</Button>
            <Button variant="outline" className="w-full">
              Schedule Regular Session
            </Button>
          </motion.div>

          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Tracker</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Mood Improvement</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Session Attendance</span>
                  <span>92%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-secondary-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Goal Achievement</span>
                  <span>78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-accent-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
            </div>
            <Button variant="ghost" className="w-full mt-4" size="sm">
              View Detailed Report
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;