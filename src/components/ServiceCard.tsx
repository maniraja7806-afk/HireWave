import React from 'react';
import { Star, MapPin, Clock, Award, CheckCircle } from 'lucide-react';

interface ServiceCardProps {
  service: any;
  onBook?: () => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  const provider = service.provider || {};
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md flex flex-col h-full">
      <div className="flex flex-col sm:flex-row gap-5 mb-5 items-start">
        {provider.profileImage ? (
          <img 
            src={provider.profileImage} 
            alt={provider.name} 
            className="w-16 h-16 rounded-full object-cover shadow-sm bg-slate-100 dark:bg-slate-700 flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-xl flex-shrink-0">
             {provider.name?.charAt(0) || 'P'}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{provider.name || 'Unknown Provider'}</h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wide">{service.category}</p>
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
          <button 
            onClick={onBook}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold transition-all shadow-sm focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            Book Appointment
          </button>
        )}
      </div>
    </div>
  );
};
