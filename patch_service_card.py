import sys

with open("src/components/ServiceCard.tsx", "r") as f:
    content = f.read()

lucide_import_old = "import { Star, MapPin, Clock, Award, CheckCircle, Heart } from 'lucide-react';"
lucide_import_new = "import { Star, MapPin, Clock, Award, CheckCircle, Heart, Wind, Fan, Droplets, Zap, Tv, Droplet, Lightbulb, Wrench, Bug, Sparkles, Settings } from 'lucide-react';"

content = content.replace(lucide_import_old, lucide_import_new)

helper_code = """
interface ServiceCardProps {
"""

helper_code_new = """
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
"""

content = content.replace(helper_code, helper_code_new)

category_ui_old = """              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wide">{service.category}</p>"""
category_ui_new = """              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="flex items-center justify-center p-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                  {getCategoryIcon(service.category)}
                </span>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{service.category}</p>
              </div>"""

content = content.replace(category_ui_old, category_ui_new)

with open("src/components/ServiceCard.tsx", "w") as f:
    f.write(content)

print("Done")
