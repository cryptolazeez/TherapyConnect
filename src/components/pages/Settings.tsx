import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Lock, Shield, Mail, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { Switch } from '../common/Switch';

type SettingsTab = 'general' | 'notifications' | 'privacy' | 'billing' | 'help';

type NotificationSettings = {
  email: boolean;
  push: boolean;
  sms: boolean;
  appointmentReminders: boolean;
  promotional: boolean;
  newsletter: boolean;
};

type PrivacySettings = {
  profileVisibility: 'public' | 'connections' | 'private';
  searchEngines: boolean;
  dataSharing: boolean;
  autoPlayVideos: boolean;
};

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    appointmentReminders: true,
    promotional: false,
    newsletter: true,
  });

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'connections',
    searchEngines: false,
    dataSharing: true,
    autoPlayVideos: false,
  });

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderSettingItem = ({
    title,
    description,
    icon: Icon,
    action,
  }: {
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: React.ReactNode;
  }) => (
    <div className="flex items-start justify-between py-4 border-b border-gray-100">
      <div className="flex items-start space-x-3">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
      <div className="ml-4">
        {action}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h3>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Language</p>
                    <p className="text-sm text-gray-500">Set your preferred language</p>
                  </div>
                  <select className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5">
                    <option>English (US)</option>
                    <option>Español</option>
                    <option>Français</option>
                    <option>Deutsch</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-gray-500">Choose between light and dark mode</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-lg border border-gray-200">
                      <span className="sr-only">Light</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </button>
                    <button className="p-2 rounded-lg bg-gray-800 text-white">
                      <span className="sr-only">Dark</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">App Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-play videos</p>
                    <p className="text-sm text-gray-500">Videos will play automatically with sound muted</p>
                  </div>
                  <Switch
                    checked={privacySettings.autoPlayVideos}
                    onChange={() => handlePrivacyChange('autoPlayVideos', !privacySettings.autoPlayVideos)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Download over Wi-Fi only</p>
                    <p className="text-sm text-gray-500">Save mobile data by downloading content only on Wi-Fi</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High quality streaming</p>
                    <p className="text-sm text-gray-500">Stream in higher quality (uses more data)</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Delete account</p>
                    <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                  </div>
                  <Button variant="destructive">Delete Account</Button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <p className="font-medium">Log out of all devices</p>
                    <p className="text-sm text-gray-500">Sign out of all active sessions</p>
                  </div>
                  <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                    Sign Out Everywhere
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Email Notifications</h4>
                  <div className="space-y-4">
                    {renderSettingItem({
                      title: 'Email notifications',
                      description: 'Receive email notifications',
                      icon: Mail,
                      action: (
                        <Switch
                          checked={notificationSettings.email}
                          onChange={() => handleNotificationChange('email')}
                        />
                      ),
                    })}
                    
                    {renderSettingItem({
                      title: 'Appointment reminders',
                      description: 'Get reminders for upcoming sessions',
                      icon: Bell,
                      action: (
                        <Switch
                          checked={notificationSettings.appointmentReminders}
                          onChange={() => handleNotificationChange('appointmentReminders')}
                        />
                      ),
                    })}
                    
                    {renderSettingItem({
                      title: 'Newsletter',
                      description: 'Receive our weekly newsletter',
                      icon: Mail,
                      action: (
                        <Switch
                          checked={notificationSettings.newsletter}
                          onChange={() => handleNotificationChange('newsletter')}
                        />
                      ),
                    })}
                    
                    {renderSettingItem({
                      title: 'Promotional emails',
                      description: 'Receive special offers and updates',
                      icon: Mail,
                      action: (
                        <Switch
                          checked={notificationSettings.promotional}
                          onChange={() => handleNotificationChange('promotional')}
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Push Notifications</h4>
                  <div className="space-y-4">
                    {renderSettingItem({
                      title: 'Push notifications',
                      description: 'Receive push notifications on your device',
                      icon: Bell,
                      action: (
                        <Switch
                          checked={notificationSettings.push}
                          onChange={() => handleNotificationChange('push')}
                        />
                      ),
                    })}
                    
                    {renderSettingItem({
                      title: 'SMS notifications',
                      description: 'Receive text message notifications',
                      icon: Phone,
                      action: (
                        <Switch
                          checked={notificationSettings.sms}
                          onChange={() => handleNotificationChange('sms')}
                        />
                      ),
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Privacy Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Profile Visibility</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium">Who can see your profile?</p>
                        <p className="text-sm text-gray-500">Control who can view your profile information</p>
                      </div>
                      <select 
                        value={privacySettings.profileVisibility}
                        onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value as any)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-40 p-2.5"
                      >
                        <option value="public">Public</option>
                        <option value="connections">Connections Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    
                    {renderSettingItem({
                      title: 'Search engine visibility',
                      description: 'Allow search engines to link to your profile',
                      icon: Shield,
                      action: (
                        <Switch
                          checked={privacySettings.searchEngines}
                          onChange={() => handlePrivacyChange('searchEngines', !privacySettings.searchEngines)}
                        />
                      ),
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Data & Privacy</h4>
                  <div className="space-y-4">
                    {renderSettingItem({
                      title: 'Data sharing',
                      description: 'Allow anonymous data collection to improve our services',
                      icon: Shield,
                      action: (
                        <Switch
                          checked={privacySettings.dataSharing}
                          onChange={() => handlePrivacyChange('dataSharing', !privacySettings.dataSharing)}
                        />
                      ),
                    })}
                    
                    <div className="py-4">
                      <h4 className="font-medium text-gray-900 mb-2">Download your data</h4>
                      <p className="text-sm text-gray-500 mb-4">Request a copy of all your personal data we have on file.</p>
                      <Button variant="outline">Request Data Download</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Billing & Payments</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">Payment Methods</h4>
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                  <Button variant="outline">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Billing History</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-500 text-sm text-center py-8">No billing history available</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">Subscription</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">Premium Plan</p>
                        <p className="text-sm text-gray-600">$29.99/month (billed monthly)</p>
                        <p className="text-xs text-blue-600 mt-1">Next billing date: Nov 15, 2023</p>
                      </div>
                      <Button variant="outline" size="sm">Change Plan</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">Help & Support</h3>
              
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-3">Need help?</h4>
                  <p className="text-gray-600 mb-4">Our support team is here to help you with any questions or issues you might have.</p>
                  <Button>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Frequently Asked Questions</h4>
                  
                  <div className="space-y-3">
                    {[
                      'How do I reschedule an appointment?',
                      'What payment methods do you accept?',
                      'How do I update my profile information?',
                      'How do I cancel my subscription?',
                      'Is my personal information secure?',
                    ].map((question, index) => (
                      <div key={index} className="border-b border-gray-100 pb-3">
                        <button className="w-full text-left flex items-center justify-between py-2">
                          <span className="text-gray-700">{question}</span>
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-4">App Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Version</p>
                      <p className="text-gray-900">1.2.3 (Build 456)</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Last Updated</p>
                      <p className="text-gray-900">Oct 15, 2023</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <Button variant="outline" className="w-full">
                      Terms of Service
                    </Button>
                    <Button variant="outline" className="w-full">
                      Privacy Policy
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const tabs: { id: SettingsTab; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { id: 'general', icon: SettingsIcon, label: 'General' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'privacy', icon: Lock, label: 'Privacy' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row md:space-x-8">
          {/* Sidebar */}
          <div className="md:w-64 flex-shrink-0 mb-6 md:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
            
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
              
              <button className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-8">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
