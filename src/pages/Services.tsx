import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { ServiceCard } from '../components/ServiceCard';
import { Search, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useSearchParams } from 'react-router-dom';

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
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState(initialLocation);
  const [loading, setLoading] = useState(true);
  
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
      const match = search.toLowerCase();
      const catMatches = CATEGORIES.filter(cat => cat.toLowerCase().includes(match));
      const keyMatches = SEARCH_KEYWORDS.filter(key => key.toLowerCase().includes(match));
      
      // Basic fuzzy match attempt if no direct matches
      if (catMatches.length === 0 && keyMatches.length === 0) {
        const fuzzyCatMatches = CATEGORIES.filter(cat => {
          const chars = match.split('');
          let catLower = cat.toLowerCase();
          return chars.every(char => {
             const idx = catLower.indexOf(char);
             if(idx > -1) {
               catLower = catLower.slice(idx + 1);
               return true;
             }
             return false;
          });
        });
        setSearchSuggestions(fuzzyCatMatches);
      } else {
        setSearchSuggestions([...catMatches, ...keyMatches]);
      }
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
          
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full sm:w-48 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

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
            <ServiceCard key={service._id} service={service} onBook={() => handleOpenBooking(service)} />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm transition-colors">
             <MapPin className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
             <p className="text-lg font-medium text-slate-900 dark:text-white">No providers found in this area.</p>
             <p className="text-sm mt-1">Try expanding your search or changing the location.</p>
          </div>
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
              <button 
                 onClick={() => setSelectedService(null)}
                 className="px-5 py-2.5 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                 onClick={handleBook}
                 disabled={!bookingDate || !bookingTime}
                 className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg shadow-sm transition-colors"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
