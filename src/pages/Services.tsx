import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { Search, MapPin, SearchX, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const getCategoryIcon = (category: string) => {
  const cat = (category || '').toLowerCase();
  if (cat.includes('ac ')) return <Wind className="w-4 h-4" />;
  if (cat.includes('refrigerator')) return <Fan className="w-4 h-4" />;
  if (cat.includes('washing machine')) return <Droplets className="w-4 h-4" />;
  if (cat.includes('microwave')) return <Zap className="w-4 h-4" />;
  if (cat.includes('television') || cat.includes('tv')) return <Tv className="w-4 h-4" />;
  if (cat.includes('water purifier')) return <Droplet className="w-4 h-4" />;
  if (cat.includes('electrician')) return <Lightbulb className="w-4 h-4" />;
  if (cat.includes('plumber')) return <Wrench className="w-4 h-4" />;
  if (cat.includes('pest')) return <Bug className="w-4 h-4" />;
  if (cat.includes('cleaning')) return <Sparkles className="w-4 h-4" />;
  return <Settings className="w-4 h-4" />;
};

const CATEGORIES = [
  'AC Technician',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'Microwave Repair',
  'Television Repair',
  'Water Purifier Service',
  'Electrician',
  'Plumber',
  'Home Appliance Installation',
  'General Appliance Maintenance'
];

const LOCATIONS = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode',
  'Vellore', 'Thanjavur', 'Dindigul', 'Kanchipuram', 'Karur', 'Namakkal', 'Cuddalore',
  'Thoothukudi', 'Virudhunagar', 'Kanniyakumari', 'Krishnagiri', 'Dharmapuri', 'Sivagangai',
  'Ramanathapuram', 'Ariyalur', 'Perambalur', 'Tenkasi', 'Nilgiris', 'Tiruppur', 'Mayiladuthurai',
  'Ranipet', 'Tirupathur', 'Chengalpattu', 'Kallakurichi', 'Nagapattinam', 'Pudukottai',
  'Villupuram', 'Thiruvarur'
];

const SEARCH_KEYWORDS = [
  'Repair', 'Service', 'Installation', 'Maintenance', 'Fix', 'Technician', 'Wiring', 'Pipe', 'Leak', 'Cooling'
];

export const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const initialLocation = searchParams.get('location') || '';
  const initialCategory = searchParams.get('category') || '';

  const [services, setServices] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });

  const saveRecentSearch = (query: string) => {
    if (!query || !query.trim()) return;
    const q = query.trim();
    setRecentSearches(prev => {
      const filtered = prev.filter(item => item.toLowerCase() !== q.toLowerCase());
      const newSearches = [q, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(newSearches));
      return newSearches;
    });
  };
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  
  const [trends, setTrends] = useState<any[]>([]);
  const [showTrends, setShowTrends] = useState(false);
  const [loadingTrends, setLoadingTrends] = useState(false);

  const [selectedService, setSelectedService] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');

  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);

  const locationRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === 'Customer') {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/users/favorites');
      if (Array.isArray(res.data)) {
        setFavoriteIds(res.data.map((fav: any) => fav._id));
      }
    } catch (error) {
      console.error('Failed to fetch favorites', error);
    }
  };

  const handleToggleFavorite = async (providerId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post(`/users/favorites/${providerId}`);
      setFavoriteIds(prev => 
        prev.includes(providerId) ? prev.filter(id => id !== providerId) : [...prev, providerId]
      );
    } catch (error) {
      console.error('Failed to toggle favorite', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setShowLocationSuggestions(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (location.trim()) {
      const match = location.toLowerCase();
      const filtered = LOCATIONS.filter(loc => loc.toLowerCase().includes(match));
      setLocationSuggestions(filtered);
    } else {
      setLocationSuggestions(LOCATIONS);
    }
  }, [location]);

  useEffect(() => {
    if (search.trim()) {
      const fetchSuggestions = async () => {
        try {
          const res = await api.get(`/services/suggestions?q=${encodeURIComponent(search)}`);
          if (Array.isArray(res.data) && res.data.length > 0) {
            setSearchSuggestions(res.data);
          } else {
            // fallback to local categories if no results from backend
            const match = search.toLowerCase();
            const catMatches = CATEGORIES.filter(cat => cat.toLowerCase().includes(match));
            setSearchSuggestions(catMatches);
          }
        } catch (error) {
          const match = search.toLowerCase();
          const catMatches = CATEGORIES.filter(cat => cat.toLowerCase().includes(match));
          setSearchSuggestions(catMatches);
        }
      };
      
      const timer = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchSuggestions(CATEGORIES);
    }
  }, [search]);

  useEffect(() => {
    // Debounce the actual API call
    const timer = setTimeout(() => {
      fetchServices();
      
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (location) params.set('location', location);
      if (category) params.set('category', category);
      setSearchParams(params, { replace: true });
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [search, category, location, setSearchParams]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.get('/services', { params: { search, category, location } });
      setServices(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch services', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrends = async () => {
    if (trends.length > 0) return;
    setLoadingTrends(true);
    try {
      const res = await api.get('/services/trends');
      setTrends(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Failed to fetch trends', error);
    } finally {
      setLoadingTrends(false);
    }
  };

  const toggleTrends = () => {
    if (!showTrends) {
      fetchTrends();
    }
    setShowTrends(!showTrends);
  };

  const handleOpenBooking = (service: any) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setBookingDate('');
    setBookingTime('');
  };

  const handleBook = async () => {
    if (!bookingDate || !bookingTime) {
      alert('Please select date and time');
      return;
    }
    
    try {
      const dateTime = new Date(`${bookingDate}T${bookingTime}`).toISOString();
      
      await api.post('/bookings', {
        provider: selectedService.provider._id,
        service: selectedService._id,
        date: dateTime,
      });
      alert('Booking successful!');
      setSelectedService(null);
      navigate('/dashboard');
    } catch (error) {
      alert('Failed to book service');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center px-4 transition-colors">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-4">Please log in to browse services</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">You need to register and log in before accessing service listings.</p>
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-8 py-3 rounded-full font-medium shadow hover:bg-blue-700 transition-colors">
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 w-full relative transition-colors">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Available Services</h2>
          <p className="text-slate-600 dark:text-slate-400">Find the right professional in your area.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={toggleTrends}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-medium rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            {showTrends ? 'Hide Price Trends' : 'View Price Trends'}
          </button>
          <div className="relative w-full sm:w-64" ref={locationRef}>
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="text" 
              placeholder="City, Area or Pincode..." 
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setShowLocationSuggestions(true);
              }}
              onFocus={() => setShowLocationSuggestions(true)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
            {showLocationSuggestions && location.trim().length > 0 && locationSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {locationSuggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
                    onClick={() => {
                      setLocation(suggestion);
                      setShowLocationSuggestions(false);
                    }}
                  >
                    <MapPin className="w-4 h-4 text-slate-400" />
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="relative w-full sm:w-64" ref={searchRef}>
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
             <input 
               type="text" 
               placeholder="Search services..." 
               value={search}
               onChange={(e) => {
                 setSearch(e.target.value);
                 setShowSearchSuggestions(true);
               }}
               onKeyDown={(e) => {
                 if (e.key === 'Enter') {
                   saveRecentSearch(search);
                   setShowSearchSuggestions(false);
                 }
               }}
               onFocus={() => setShowSearchSuggestions(true)}
               className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
             />
             {showSearchSuggestions && search.trim().length > 0 && searchSuggestions.length > 0 && (
              <ul className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg max-h-60 overflow-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <li 
                    key={index} 
                    className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer text-slate-700 dark:text-slate-300 transition-colors"
                    onClick={() => {
                      setSearch(suggestion);
                      saveRecentSearch(suggestion);
                      setShowSearchSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
      </div>

      {recentSearches.length > 0 && (
         <div className="flex flex-wrap gap-2 items-center text-sm mb-6 -mt-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Recent:</span>
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setSearch(s);
                  saveRecentSearch(s);
                }}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {s}
              </button>
            ))}
         </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">
        <button
          onClick={() => setCategory('')}
          className={`shrink-0 px-5 py-2 rounded-full font-medium transition-colors border ${
            category === '' 
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-sm' 
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
          }`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-5 py-2 rounded-full font-medium transition-colors border flex items-center gap-2 ${
              category === cat
                ? 'bg-blue-600 text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {getCategoryIcon(cat)}
            {cat}
          </button>
        ))}
      </div>

      {showTrends && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-10 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 overflow-hidden"
        >
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Average Pricing by Category
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Estimate the base cost of typical services</p>
          </div>
          
          <div className="w-full h-[300px]">
            {loadingTrends ? (
              <div className="w-full h-full flex items-center justify-center animate-pulse">
                <div className="flex items-end gap-4 h-48 w-full justify-center opacity-50">
                   {[40, 70, 50, 90, 60].map((h, i) => (
                     <div key={i} className="w-16 bg-slate-200 dark:bg-slate-700 rounded-t-sm" style={{ height: `${h}%`}}></div>
                   ))}
                </div>
              </div>
            ) : trends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="category" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }} 
                    tickFormatter={(val) => val.split(' ')[0]} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value) => [`₹${value}`, 'Average Price']}
                  />
                  <Bar dataKey="avgPrice" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500">
                No pricing data available.
              </div>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
             <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col h-[280px] animate-pulse">
               <div className="flex gap-5 mb-5">
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>
                  <div className="flex-1 space-y-2 mt-2">
                     <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded"></div>
                     <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  </div>
               </div>
               <div className="h-20 w-full bg-slate-200 dark:bg-slate-700 rounded-lg mb-5"></div>
               <div className="mt-auto h-10 w-full bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
             </div>
          ))
        ) : services.length > 0 ? (
          services.map((service: any) => (
            <ServiceCard 
              key={service._id} 
              service={service} 
              onBook={() => handleOpenBooking(service)} 
              isFavorite={favoriteIds.includes(service.provider?._id || service.provider)}
              onToggleFavorite={() => handleToggleFavorite(service.provider?._id || service.provider)}
            />
          ))
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full py-24 px-6 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-colors flex flex-col items-center justify-center min-h-[400px]"
          >
             <div className="relative mb-6">
                <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-xl scale-150 opacity-50"></div>
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-white dark:border-slate-700 shadow-sm relative z-10">
                  <SearchX className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
             </div>
             <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No results found</h3>
             <p className="text-base max-w-md mx-auto mb-8">We couldn't find any services matching your criteria. Try adjusting your filters or search terms.</p>
             <div className="flex gap-4">
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSearch(''); setLocation(''); setCategory(''); }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-sm transition-colors"
                >
                  Clear Filters
                </motion.button>
             </div>
          </motion.div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-700 transition-colors">
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute right-4 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              ✕
            </button>
            
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Book Appointment</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{selectedService.title} with {selectedService.provider?.name}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Date</label>
                <input 
                  type="date" 
                  value={bookingDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Select Time Slot</label>
                <select 
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors"
                >
                  <option value="">Choose a slot</option>
                  <option value="09:00">09:00 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="16:00">04:00 PM</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 border-t border-slate-100 dark:border-slate-700 pt-4 flex justify-end gap-3 transition-colors">
              <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={() => setSelectedService(null)}
                 className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button 
                 whileTap={{ scale: 0.95 }}
                 onClick={handleBook}
                 disabled={!bookingDate || !bookingTime}
                 className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Confirm Booking
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
