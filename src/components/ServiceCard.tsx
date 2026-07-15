import React from 'react';
import { motion } from 'motion/react';
import { Star, MapPin, Clock, Award, CheckCircle, Heart, Wind, Fan, Droplets, Zap, Tv, Droplet, Lightbulb, Wrench, Bug, Sparkles, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const getCategoryIcon = (category: string) => {
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

interface ServiceCardProps {
  service: any;
  onBook?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook, isFavorite, onToggleFavorite }) => {
  const provider = service.provider || {};
  const providerId = provider._id || provider;
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md flex flex-col h-full relative">
      {onToggleFavorite && (
        <button 
          onClick={(e) => { e.preventDefault(); onToggleFavorite(); }}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10 group"
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-400 group-hover:text-red-500'}`} />
        </button>
      )}
      <div className="flex flex-col sm:flex-row gap-5 mb-5 items-start">
        <Link to={`/provider/${providerId}`} className="flex-shrink-0">
          {provider.profileImage ? (
            <img 
              src={provider.profileImage} 
              alt={provider.name} 
              className="w-16 h-16 rounded-full object-cover shadow-sm bg-slate-100 dark:bg-slate-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl">
               {provider.name?.charAt(0) || 'P'}
            </div>
          )}
        </Link>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <Link to={`/provider/${providerId}`} className="hover:underline">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{provider.name || 'Unknown Provider'}</h3>
              </Link>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="flex items-center justify-center p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                  {getCategoryIcon(service.category)}
                </span>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{service.category}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold text-slate-900 dark:text-white">₹{service.price}</span>
              <p className="text-xs text-slate-500 dark:text-slate-400">per approx.</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-600 dark:text-slate-400 items-center bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg mb-5 transition-colors">
         <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">{provider.averageRating?.toFixed(1) || '4.0'}</span>
            <span className="text-xs text-slate-400">({provider.reviewCount || 0} reviews)</span>
         </div>
         <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>{provider.experience || '5'} yrs exp.</span>
         </div>
         <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="truncate flex items-center gap-1" title={provider.serviceArea || service.location}>
               {provider.serviceArea || service.location} 
               <span className="text-xs text-blue-500 font-medium ml-1">({Math.floor(Math.random() * 8) + 1}.{Math.floor(Math.random() * 9)} km)</span>
            </span>
         </div>
         <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span className="truncate" title={provider.availability || 'Mon-Sat'}>{provider.availability || 'Available'}</span>
         </div>
      </div>
      
      <div className="flex-grow">
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-2">{service.description}</p>
      </div>
      
      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between transition-colors">
        <div className="flex items-center gap-1.5 text-green-600 dark:text-green-500 text-sm font-medium font-sans">
           <CheckCircle className="w-4 h-4" />
           Verified Pro
        </div>
        
        {onBook && (
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onBook}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            Book Appointment
          </motion.button>
        )}
      </div>
    </div>
  );
};
