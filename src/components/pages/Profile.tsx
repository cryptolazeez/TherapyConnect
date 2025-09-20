import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, MapPin, Edit3, Save, X } from 'lucide-react';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

type UserProfile = {
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  bio: string;
  avatar: string;
  memberSince: string;
};

export const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Wellness St, San Francisco, CA 94107',
    bio: 'Passionate about mental health and personal growth. Love hiking and reading in my free time.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    memberSince: 'January 2022',
  });

  const [formData, setFormData] = useState(profile);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
    // Here you would typically make an API call to update the profile
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const renderField = (label: string, value: string, icon: React.ReactNode, name: string, type = 'text') => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600 flex items-center">
        <span className="mr-2">{icon}</span>
        {label}
      </label>
      {isEditing ? (
        <Input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          className="w-full"
        />
      ) : (
        <p className="text-gray-800">{value || 'Not provided'}</p>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:space-x-8">
              <div className="md:w-1/3 flex flex-col items-center mb-6 md:mb-0">
                <div className="relative mb-4">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                      <Edit3 className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">{profile.name}</h2>
                <p className="text-gray-500 text-sm">Member since {profile.memberSince}</p>
                
                {!isEditing && (
                  <Button variant="outline" className="mt-4 w-full md:w-auto">
                    Change Password
                  </Button>
                )}
              </div>

              <div className="md:w-2/3 space-y-6">
                <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField('Full Name', formData.name, <User className="h-4 w-4" />, 'name')}
                  {renderField('Email', formData.email, <Mail className="h-4 w-4" />, 'email', 'email')}
                  {renderField('Phone', formData.phone, <Phone className="h-4 w-4" />, 'phone', 'tel')}
                  {renderField('Date of Birth', formData.dateOfBirth, <Calendar className="h-4 w-4" />, 'dateOfBirth', 'date')}
                  {renderField('Address', formData.address, <MapPin className="h-4 w-4" />, 'address')}
                </div>

                <div className="pt-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center">
                    <Edit3 className="h-4 w-4 mr-2" />
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"
                    />
                  ) : (
                    <p className="text-gray-800 mt-1">{profile.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Therapy Preferences</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Therapy Type</span>
                <span className="font-medium">Cognitive Behavioral</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session Duration</span>
                <span className="font-medium">60 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Preferred Time</span>
                <span className="font-medium">Morning (9 AM - 12 PM)</span>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              Update Preferences
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Add an extra layer of security</p>
                </div>
                <button className="bg-gray-200 rounded-full p-1 w-10 h-6 flex items-center">
                  <span className="bg-white rounded-full w-5 h-5 shadow-sm transform translate-x-0.5"></span>
                </button>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600">Last login: Today at 2:30 PM</p>
                <p className="text-sm text-gray-600">IP: 192.168.1.1</p>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full">
              View Login Activity
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
