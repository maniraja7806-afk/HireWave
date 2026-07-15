import React from 'react';
import { Wind, Fan, Droplets, Zap, Tv, Droplet, Lightbulb, Wrench, Bug, Sparkles, Settings } from 'lucide-react';

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
