import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Star, CopyPlus, MessageSquare, MapPin, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors ${
      active 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const ChatPlaceholder = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
    <MessageSquare className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">In-App Chat</h3>
    <p className="text-slate-500 dark:text-slate-400 max-w-md">Connect with your service provider or customer securely. Share images of appliance issues and discuss details here.</p>
  </div>
);

const MapPlaceholder = () => (
  <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[400px] flex flex-col">
    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
      <h3 className="font-semibold flex items-center gap-2"><MapPin className="w-5 h-5 text-blue-500"/> Live Technician Tracking</h3>
      <div className="flex gap-2">
         <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-bold">ETA: 15 mins</span>
      </div>
    </div>
    <div className="bg-slate-200 dark:bg-slate-900 flex-1 relative flex items-center justify-center">
       <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=13&size=800x400&sensor=false')] bg-cover bg-center opacity-30 dark:opacity-20 grayscale"></div>
       <div className="relative z-10 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-center animate-pulse">
          <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-500 mx-auto mb-2" />
          <p className="font-medium text-slate-900 dark:text-white">Connecting to GPS...</p>
       </div>
    </div>
  </div>
);

const AnalyticsPlaceholder = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Bookings</h4>
         <p className="text-3xl font-bold text-slate-900 dark:text-white">1,248</p>
         <p className="text-green-500 text-sm mt-2 font-medium">+12% from last month</p>
       </div>
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Total Revenue</h4>
         <p className="text-3xl font-bold text-slate-900 dark:text-white">₹4,52,000</p>
         <p className="text-green-500 text-sm mt-2 font-medium">+8% from last month</p>
       </div>
       <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
         <h4 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Active Professionals</h4>
         <p className="text-3xl font-bold text-slate-900 dark:text-white">156</p>
         <p className="text-green-500 text-sm mt-2 font-medium">+5 new this week</p>
       </div>
    </div>
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center flex flex-col items-center justify-center min-h-[300px]">
      <BarChart3 className="w-16 h-16 text-slate-300 dark:text-slate-600 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Advanced Analytics Dashboard</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">Detailed charts and revenue metrics will be displayed here.</p>
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    fetchBookings();
    
    // Simple polling for "real-time" mock updates
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching bookings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.put('/bookings/' + id + '/status', { status });
      fetchBookings();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Accepted': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Completed': return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
      case 'Rejected': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  const handleRateReview = (bookingId: string) => {
    alert('Thank you for rating! (Review functionality mocK)');
  };

  const handleAddFavorite = (providerId: string) => {
    alert('Provider added to favorites!');
  };

  if (!user) return <div className="p-8 text-center text-slate-500 dark:text-slate-400">Please log in.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 w-full transition-colors flex flex-col md:flex-row gap-8">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 flex-shrink-0">
         <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 mb-6">
           <div className="flex items-center gap-4 mb-4">
             <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-2xl">
               {user.name.charAt(0)}
             </div>
             <div>
               <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{user.name}</h3>
               <p className="text-sm text-slate-500 dark:text-slate-400">{user.role}</p>
             </div>
           </div>
           
           <div className="flex flex-col gap-2 mt-8">
             <TabButton 
               active={activeTab === 'bookings'} 
               onClick={() => setActiveTab('bookings')} 
               icon={Calendar} 
               label={user.role === 'Provider' ? 'Appointments' : 'My Bookings'} 
             />
             <TabButton 
               active={activeTab === 'chat'} 
               onClick={() => setActiveTab('chat')} 
               icon={MessageSquare} 
               label="Messages" 
             />
             <TabButton 
               active={activeTab === 'map'} 
               onClick={() => setActiveTab('map')} 
               icon={MapPin} 
               label="Live Tracking" 
             />
             {user.role === 'Admin' && (
               <TabButton 
                 active={activeTab === 'analytics'} 
                 onClick={() => setActiveTab('analytics')} 
                 icon={BarChart3} 
                 label="Analytics" 
               />
             )}
           </div>
         </div>
         
         {/* Emergency Action */}
         {user.role === 'Customer' && (
           <button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg p-4 flex items-center justify-center gap-2 font-bold transition-transform hover:scale-[1.02]">
             <AlertTriangle className="w-5 h-5" /> Emergency SOS
           </button>
         )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              {activeTab === 'bookings' && 'Dashboard Overview'}
              {activeTab === 'chat' && 'Messages'}
              {activeTab === 'map' && 'Live GPS Tracking'}
              {activeTab === 'analytics' && 'System Analytics'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
               {activeTab === 'bookings' && `Here's an overview of your recent activity.`}
               {activeTab === 'chat' && 'Communicate instantly with service providers.'}
               {activeTab === 'map' && 'Track technicians arriving at your location.'}
               {activeTab === 'analytics' && 'Platform performance and revenue monitoring.'}
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'chat' && <ChatPlaceholder />}
            {activeTab === 'map' && <MapPlaceholder />}
            {activeTab === 'analytics' && <AnalyticsPlaceholder />}

            {activeTab === 'bookings' && (
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200">Recent Bookings</h3>
                </div>
                
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="p-6 flex flex-col md:flex-row justify-between gap-6 animate-pulse">
                         <div className="space-y-3 flex-grow">
                           <div className="flex items-center gap-3">
                              <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                              <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded"></div>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6">
                              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
                           </div>
                         </div>
                         <div className="h-10 w-full md:w-32 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
                      </div>
                    ))
                  ) : bookings.length > 0 ? (
                    [...bookings].reverse().map((booking: any) => (
                      <div key={booking._id} className="p-6 flex flex-col md:flex-row justify-between gap-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="space-y-3 flex-grow">
                          <div className="flex items-center gap-3">
                            <span className={"text-xs font-semibold px-3 py-1 rounded-full tracking-wide " + getStatusColor(booking.status)}>
                              {booking.status}
                            </span>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{booking.service?.title || 'Home Service'}</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                               <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                               <span>{new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            {user.role === 'Customer' ? (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                <span>Provider: {booking.provider?.name || 'Unknown'}</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                 <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                 <span>Customer: {booking.customer?.name || 'Unknown'}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {user.role === 'Provider' && booking.status === 'Pending' && (
                          <div className="flex gap-2 items-center md:flex-col md:justify-center">
                            <button 
                              onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                              className="border border-green-600 bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition-colors w-full shadow-sm"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                              className="border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2 rounded-lg font-medium transition-colors w-full"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {user.role === 'Provider' && booking.status === 'Accepted' && (
                          <div className="flex items-center md:flex-col md:justify-center">
                            <button 
                              onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors w-full shadow-sm"
                            >
                              Mark Completed
                            </button>
                          </div>
                        )}
                        {user.role === 'Customer' && booking.status === 'Completed' && (
                          <div className="flex gap-2 items-center md:flex-col md:justify-center">
                            <button 
                              onClick={() => handleRateReview(booking._id)}
                              className="flex items-center justify-center gap-1.5 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 px-4 py-2 rounded-lg font-medium transition-colors w-full"
                            >
                              <Star className="w-4 h-4" /> Rate & Review
                            </button>
                            <button 
                              onClick={() => handleAddFavorite(booking.provider?._id)}
                              className="flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors w-full"
                            >
                              <CopyPlus className="w-4 h-4" /> Favorite
                            </button>
                          </div>
                        )}
                        {user.role === 'Customer' && booking.status === 'Pending' && (
                          <div className="flex items-center md:flex-col md:justify-center">
                            <button 
                              onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                              className="border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2 rounded-lg font-medium transition-colors w-full"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                     <div className="p-10 text-center text-slate-500 dark:text-slate-400">
                        You don't have any bookings yet.
                     </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
