import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Star, Shield, Zap, Wrench, Home as HomeIcon, Droplet, ZapIcon, Grid, ThumbsUp, Activity, Users, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';

const categories = [
  { id: 1, title: 'Cleaning', icon: Droplet, color: 'bg-blue-500' },
  { id: 2, title: 'Home Repair', icon: HomeIcon, color: 'bg-indigo-500' },
  { id: 3, title: 'Plumbing', icon: Wrench, color: 'bg-teal-500' },
  { id: 4, title: 'Electrical', icon: ZapIcon, color: 'bg-amber-500' },
  { id: 5, title: 'Painting', icon: Grid, color: 'bg-rose-500' },
  { id: 6, title: 'More', icon: Grid, color: 'bg-slate-700' },
];

const featuredProviders = [
  { id: 1, name: 'Karthik Rajan', service: 'Master Plumber', rating: 4.9, reviews: 124, image: 'https://ui-avatars.com/api/?name=Karthik+Rajan&background=0284c7&color=fff&size=150', location: 'Chennai' },
  { id: 2, name: 'Suresh Kumar', service: 'Electrical Fixes', rating: 4.8, reviews: 98, image: 'https://ui-avatars.com/api/?name=Suresh+Kumar&background=eab308&color=fff&size=150', location: 'Coimbatore' },
  { id: 3, name: 'Meena Srinivasan', service: 'Deep Home Cleaning', rating: 5.0, reviews: 204, image: 'https://ui-avatars.com/api/?name=Meena+Srinivasan&background=10b981&color=fff&size=150', location: 'Madurai' },
  { id: 4, name: 'Vijay Murthy', service: 'AC Technician', rating: 4.7, reviews: 156, image: 'https://ui-avatars.com/api/?name=Vijay+Murthy&background=6366f1&color=fff&size=150', location: 'Tiruchirappalli' },
];

const popularServices = [
  { id: 1, title: 'Deep Home Cleaning', price: '₹1200 - ₹2000', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=80', rating: 4.8 },
  { id: 2, title: 'AC Installation & Repair', price: '₹800 - ₹1500', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80', rating: 4.9 },
  { id: 3, title: 'Pipe Leak Repair', price: '₹600 - ₹1200', image: 'https://images.unsplash.com/photo-1620619767323-b95a89183081?w=800&q=80', rating: 4.7 },
];

const reviews = [
  { id: 1, text: "Found an AC technician within 10 minutes. He arrived quickly and fixed the issue perfectly. Highly recommend this platform!", author: "Priya Lakshmi", role: "Madurai Homeowner" },
  { id: 2, text: "As a service provider, this app has doubled my client base in Chennai. The platform is so easy to use.", author: "Manikandan Raj", role: "AC Technician" },
  { id: 3, text: "The app is super smooth and intuitive. The verified pros feature gave me peace of mind before letting someone into my house.", author: "Anand Krishnan", role: "Coimbatore Customer" },
];

const Counter = ({ end, label, icon: Icon }: any) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100"
    >
      <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-4xl font-extrabold text-slate-900 mb-2">{end}+</h4>
      <p className="text-slate-500 font-medium">{label}</p>
    </motion.div>
  );
}

export const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeReview, setActiveReview] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const nextReview = () => setActiveReview((prev) => (prev + 1) % reviews.length);
  const prevReview = () => setActiveReview((prev) => (prev - 1 + reviews.length) % reviews.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?search=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(locationQuery)}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-16 pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-600/10 dark:from-blue-600/20 to-transparent pointer-events-none"></div>
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 right-10 w-64 h-64 bg-green-400/20 dark:bg-green-500/10 rounded-full blur-[80px] pointer-events-none"
        />
        <motion.div 
          animate={{ x: [0, -20, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-10 left-10 w-72 h-72 bg-blue-600/20 dark:bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"
        />
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
             <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6"
            >
              Welcome back, <span className="text-blue-600 dark:text-blue-500">{user.name.split(' ')[0]}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-slate-600 dark:text-slate-300 mb-10"
            >
              What can we help you with today? Find top-rated professionals for any job.
            </motion.p>
            
            {/* Search Bar */}
            <motion.form 
              onSubmit={handleSearch}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row gap-2 max-w-2xl mx-auto border border-slate-100 dark:border-slate-700"
            >
              <div className="flex-1 flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-700">
                <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What service do you need?" 
                  className="w-full focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent"
                />
              </div>
              <div className="flex-1 flex items-center px-4 py-2">
                <MapPin className="w-5 h-5 text-slate-400 dark:text-slate-500 mr-3" />
                <input 
                  type="text" 
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Your location" 
                  className="w-full focus:outline-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 bg-transparent"
                />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-md md:w-auto w-full">
                Search
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-800 relative z-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Explore Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, i) => (
              <Link to="/services" key={cat.id}>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 rounded-2xl border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-lg transition-all cursor-pointer"
                >
                  <div className={`w-14 h-14 rounded-full ${cat.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm`}>
                    <cat.icon className="w-7 h-7" />
                  </div>
                  <span className="font-semibold text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{cat.title}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Popular Services</h2>
              <p className="text-slate-500 dark:text-slate-400">Most requested services in your area</p>
            </div>
            <Link to="/services" className="hidden sm:flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              See all <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {popularServices.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {service.rating}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{service.title}</h3>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">Starting from</span>
                    <span className="font-bold text-green-500 dark:text-green-400 text-lg">{service.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section className="py-20 bg-white dark:bg-slate-800 border-y border-slate-100 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Featured Professionals</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Highly rated experts ready to assist you</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProviders.map((provider, i) => (
              <motion.div 
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 text-center border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:border-blue-100 dark:hover:border-blue-900/50 transition-all group"
              >
                <div className="relative inline-block mb-4">
                  <img src={provider.image} alt={provider.name} className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-slate-800 shadow-sm mx-auto" />
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white p-1 rounded-full border-2 border-white dark:border-slate-800">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{provider.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{provider.service}</p>
                <div className="flex items-center justify-center gap-1 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 w-max mx-auto px-3 py-1 rounded-full shadow-sm">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{provider.rating}</span>
                  <span className="text-slate-400 dark:text-slate-500">({provider.reviews})</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Counter end={15000} label="Happy Customers" icon={Users} />
            <Counter end={3000} label="Verified Pros" icon={Shield} />
            <Counter end={50000} label="Jobs Completed" icon={CheckCircle} />
            <Counter end={4.9} label="Average Rating" icon={Star} />
          </div>
        </div>
      </section>

      {/* Reviews Carousel */}
      <section className="py-24 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden transition-colors">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"
        />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <ThumbsUp className="w-12 h-12 text-green-500 dark:text-green-400 mx-auto mb-8 opacity-80" />
          <h2 className="text-3xl font-bold mb-12">What our users say</h2>
          
          <div className="relative min-h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeReview}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <p className="text-2xl md:text-3xl font-medium leading-tight mb-8">
                  "{reviews[activeReview].text}"
                </p>
                <div className="font-bold text-lg">{reviews[activeReview].author}</div>
                <div className="text-slate-400">{reviews[activeReview].role}</div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center gap-4 mt-12">
            <button onClick={prevReview} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button onClick={nextReview} className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link to="/" className="font-bold text-2xl text-blue-600 dark:text-blue-500 tracking-tight flex items-center gap-2 mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                HireWave
              </Link>
              <p className="text-slate-500 dark:text-slate-400 mb-6">Connecting you with trusted local professionals for all your home needs.</p>
              <div className="flex gap-4">
                {/* Social icons placeholders */}
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white cursor-pointer transition-colors">f</div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white cursor-pointer transition-colors">t</div>
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white cursor-pointer transition-colors">in</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">For Customers</h4>
              <ul className="space-y-3">
                <li><Link to="/services" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Find a Pro</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">How it works</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Trust & Safety</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Support Center</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">For Pros</h4>
              <ul className="space-y-3">
                <li><Link to="/register?role=Provider" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Join as a Pro</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Success Stories</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Pro Resources</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Community</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm transition-colors">
            <p>&copy; {new Date().getFullYear()} HireWave Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
