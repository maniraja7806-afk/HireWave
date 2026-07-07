import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star, MapPin, Briefcase, Calendar, MessageSquare, ArrowLeft, Image as ImageIcon } from 'lucide-react';

export const ProviderProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const response = await api.get(`/users/provider/${id}`);
        setProvider(response.data);
      } catch (error) {
        console.error('Error fetching provider profile', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProvider();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Provider not found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">The provider profile you are looking for does not exist.</p>
        <button onClick={() => navigate('/services')} className="mt-6 text-blue-600 hover:underline">
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profile Section */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden shrink-0 border-4 border-slate-50 dark:border-slate-700 shadow-md">
            {provider.profileImage ? (
              <img src={provider.profileImage} alt={provider.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {provider.name.charAt(0)}
              </div>
            )}
          </div>
          
          <div className="flex-grow space-y-3">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{provider.name}</h1>
                <p className="text-lg text-blue-600 dark:text-blue-400 font-medium">{provider.category || 'Professional Service Provider'}</p>
              </div>
              
              <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-500 px-4 py-2 rounded-xl border border-amber-200 dark:border-amber-900/50">
                <Star className="w-6 h-6 fill-current" />
                <div>
                  <div className="text-xl font-bold leading-none">{provider.averageRating ? provider.averageRating.toFixed(1) : 'New'}</div>
                  <div className="text-xs font-medium opacity-80">{provider.reviewCount} Reviews</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {provider.serviceArea || provider.city || 'Available Locally'}</div>
              <div className="flex items-center gap-1.5"><Briefcase className="w-4 h-4" /> {provider.experience || '2'} Years Experience</div>
              <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Joined {new Date(provider.createdAt).getFullYear()}</div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">About Me</h3>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
            {provider.description || `Hi, I'm ${provider.name}. I specialize in ${provider.category || 'providing quality services'} with a focus on customer satisfaction and reliable results. Feel free to book my services or reach out for inquiries.`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Portfolio Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Portfolio & Past Work</h3>
            </div>
            
            {provider.portfolioImages && provider.portfolioImages.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {provider.portfolioImages.map((img: string, idx: number) => (
                  <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shadow-sm hover:shadow-md transition-shadow cursor-pointer relative group">
                    <img src={img} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                No portfolio images available yet.
              </div>
            )}
          </div>
          
          {/* Reviews Section */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Client Reviews</h3>
            </div>
            
            <div className="space-y-6">
              {provider.reviews && provider.reviews.length > 0 ? (
                provider.reviews.map((review: any) => (
                  <div key={review._id} className="pb-6 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shrink-0">
                          {review.customer?.profileImage ? (
                            <img src={review.customer.profileImage} alt={review.customer.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold">
                              {review.customer?.name?.charAt(0) || 'C'}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 dark:text-white">{review.customer?.name || 'Customer'}</h4>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                          </div>
                          <p className="mt-3 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{review.comment}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= review.rating ? 'text-amber-500 fill-current' : 'text-slate-300 dark:text-slate-700'}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                 <div className="text-center py-8 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                   No reviews yet.
                 </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Offered Services</h3>
            <div className="space-y-3">
              {provider.services && provider.services.length > 0 ? (
                provider.services.map((service: any) => (
                  <div key={service._id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-900/50 transition-colors cursor-pointer" onClick={() => navigate(`/services?search=${encodeURIComponent(service.title)}`)}>
                    <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{service.title}</h4>
                    <div className="text-blue-600 dark:text-blue-400 font-medium mt-1">₹{service.price}</div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500 dark:text-slate-400 italic">No specific services listed.</div>
              )}
            </div>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-6 text-center">
            <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-2">Ready to hire {provider.name.split(' ')[0]}?</h3>
            <p className="text-sm text-blue-700 dark:text-blue-300 mb-6">Find their specific services in the marketplace and book instantly.</p>
            <button 
              onClick={() => navigate(`/services?search=${encodeURIComponent(provider.name)}`)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-xl transition-colors shadow-sm"
            >
              Find Services
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
