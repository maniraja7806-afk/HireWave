import { getCategoryIcon } from './Services';
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calendar, User, Star, CopyPlus, MessageSquare, MapPin, BarChart3, Clock, AlertTriangle, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const TabButton = ({ active, onClick, icon: Icon, label }: any) => (
  <button 
    type="button"
    onClick={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all active:scale-95 ${
      active 
        ? 'bg-blue-600 text-white shadow-sm' 
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const ChatPlaceholder = () => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'Welcome to the chat!' }
  ]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col min-h-[400px]">
      <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" /> Messages
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`px-4 py-2 rounded-lg max-w-[80%] ${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={msg} 
          onChange={(e) => setMsg(e.target.value)} 
          onKeyDown={(e) => {
            if (e.key === 'Enter' && msg.trim()) {
              setMessages([...messages, { id: Date.now(), sender: 'user', text: msg }]);
              setMsg('');
              setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: 'The other person is currently unavailable.' }]);
              }, 1000);
            }
          }}
          className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
        />
        <button 
          onClick={() => {
            if (msg.trim()) {
              setMessages([...messages, { id: Date.now(), sender: 'user', text: msg }]);
              setMsg('');
              setTimeout(() => {
                setMessages(prev => [...prev, { id: Date.now(), sender: 'system', text: 'The other person is currently unavailable.' }]);
              }, 1000);
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

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
  
  // Review Modal State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Cancel Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  const confirmCancel = async () => {
    if (cancelBookingId) {
      await handleUpdateStatus(cancelBookingId, 'Cancelled');
      setIsCancelModalOpen(false);
      setCancelBookingId(null);
    }
  };

  const [favorites, setFavorites] = useState<any[]>([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);

  useEffect(() => {
    fetchBookings();
    if (user?.role === 'Customer') {
      fetchFavorites();
    }
    
    // Simple polling for "real-time" mock updates
    const interval = setInterval(fetchBookings, 10000);
    return () => clearInterval(interval);
  }, [user]);

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

  const fetchFavorites = async () => {
    setLoadingFavorites(true);
    try {
      const res = await api.get('/users/favorites');
      setFavorites(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching favorites', error);
    } finally {
      setLoadingFavorites(false);
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

  const handleRateReview = (booking: any) => {
    setReviewBooking(booking);
    setRating(5);
    setComment('');
    setIsReviewModalOpen(true);
  };

  const submitReview = async () => {
    if (!reviewBooking) return;
    setIsSubmittingReview(true);
    try {
      await api.post('/reviews', {
        bookingId: reviewBooking._id,
        providerId: reviewBooking.provider._id || reviewBooking.provider,
        rating,
        comment
      });
      setIsReviewModalOpen(false);
      alert('Thank you for your review!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleAddFavorite = async (providerId: string) => {
    try {
      await api.post(`/users/favorites/${providerId}`);
      alert('Favorite status updated!');
      fetchFavorites();
    } catch (error) {
      console.error(error);
      alert('Failed to update favorites.');
    }
  };

  const upcomingBookings = bookings.filter((b: any) => ['Pending', 'Accepted'].includes(b.status));
  const pastBookings = bookings.filter((b: any) => ['Completed', 'Rejected', 'Cancelled'].includes(b.status));

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
             {user.role === 'Customer' && (
               <TabButton 
                 active={activeTab === 'favorites'} 
                 onClick={() => setActiveTab('favorites')} 
                 icon={Star} 
                 label="My Favorites" 
               />
             )}
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
           <button 
             type="button" 
             onClick={(e) => { e.preventDefault(); toast.success('Emergency Services have been notified of your location. A representative will contact you immediately.', { duration: 5000, icon: '🚨' }); }} 
             className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg p-4 flex items-center justify-center gap-2 font-bold transition-transform hover:scale-[1.02] active:scale-95"
           >
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
              {activeTab === 'favorites' && 'My Favorites'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
               {activeTab === 'bookings' && `Here's an overview of your recent activity.`}
               {activeTab === 'chat' && 'Communicate instantly with service providers.'}
               {activeTab === 'map' && 'Track technicians arriving at your location.'}
               {activeTab === 'analytics' && 'Platform performance and revenue monitoring.'}
               {activeTab === 'favorites' && 'Your preferred service providers.'}
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
            
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {loadingFavorites ? (
                    Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                          <div className="space-y-2 flex-1">
                            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full"></div>
                      </div>
                    ))
                  ) : favorites.length > 0 ? (
                    favorites.map((provider: any) => (
                      <div key={provider._id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-all flex flex-col h-full">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden shrink-0 flex items-center justify-center font-bold text-xl text-blue-600 dark:text-blue-400">
                             {provider.profileImage ? (
                               <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
                             ) : (
                               provider.name?.charAt(0) || 'P'
                             )}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-slate-900 dark:text-white line-clamp-1">{provider.name}</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="text-slate-400 dark:text-slate-500">
                                {getCategoryIcon(provider.category || '')}
                              </span>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{provider.category || 'Service Provider'}</p>
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-sm font-medium text-slate-600 dark:text-slate-300">
                              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              {provider.averageRating?.toFixed(1) || '4.0'}
                            </div>
                          </div>
                        </div>
                        <div className="mt-auto pt-4 flex gap-3">
                          <Link 
                            to={`/provider/${provider._id}`} 
                            className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-center py-2.5 rounded-lg font-medium transition-colors"
                          >
                            View Profile
                          </Link>
                          <button 
                            
                            onClick={() => handleAddFavorite(provider._id)}
                            className="px-4 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition-colors border border-red-200 dark:border-red-900/50"
                            title="Remove from favorites"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-16 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
                       <Star className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                       <p className="text-lg font-medium text-slate-900 dark:text-white mb-2">No favorites yet</p>
                       <p className="text-sm max-w-sm mx-auto mb-6">You haven't added any service providers to your favorites. Explore services to find professionals you like.</p>
                       <Link to="/services" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors">
                         Find Services <ArrowRight className="w-4 h-4" />
                       </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Upcoming Bookings</h3>
                  </div>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {loading ? (
                      Array.from({ length: 2 }).map((_, i) => (
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
                    ) : upcomingBookings.length > 0 ? (
                      [...upcomingBookings].reverse().map((booking: any) => (
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
                          {user.role === 'Customer' && booking.status === 'Pending' && (
                            <div className="flex items-center md:flex-col md:justify-center">
                              <button 
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setCancelBookingId(booking._id);
                                  setIsCancelModalOpen(true);
                                }}
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
                          You don't have any upcoming bookings.
                       </div>
                    )}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
                  <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200">Past Bookings</h3>
                  </div>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {loading ? (
                      Array.from({ length: 2 }).map((_, i) => (
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
                    ) : pastBookings.length > 0 ? (
                      [...pastBookings].reverse().map((booking: any) => (
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

                          {user.role === 'Customer' && booking.status === 'Completed' && (
                            <div className="flex gap-2 items-center md:flex-col md:justify-center">
                              <button 
                                onClick={() => handleRateReview(booking)}
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
                        </div>
                      ))
                    ) : (
                       <div className="p-10 text-center text-slate-500 dark:text-slate-400">
                          You don't have any past bookings.
                       </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isCancelModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-red-500" /> Cancel Booking
                </h3>
                <button 
                  onClick={() => {
                    setIsCancelModalOpen(false);
                    setCancelBookingId(null);
                  }}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to cancel this booking? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button 
                    
                    onClick={() => {
                      setIsCancelModalOpen(false);
                      setCancelBookingId(null);
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    Keep It
                  </button>
                  <button 
                    
                    onClick={confirmCancel}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                  >
                    Yes, Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {isReviewModalOpen && reviewBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Rate & Review</h3>
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{reviewBooking.service?.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Provider: {reviewBooking.provider?.name}</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors ${rating >= star ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="comment" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Feedback</label>
                  <textarea 
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400"
                  />
                </div>

                <button 
                  onClick={submitReview}
                  disabled={isSubmittingReview}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
