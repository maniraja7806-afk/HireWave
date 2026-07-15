import sys

with open("src/pages/Services.tsx", "r") as f:
    content = f.read()

lucide_import_old = "import { MapPin, Search, TrendingUp, SearchX } from 'lucide-react';"
lucide_import_new = "import { MapPin, Search, TrendingUp, SearchX, Wind, Fan, Droplets, Zap, Tv, Droplet, Lightbulb, Wrench, Bug, Sparkles, Settings } from 'lucide-react';"

content = content.replace(lucide_import_old, lucide_import_new)

helper_code = """
const CATEGORIES = [
"""

helper_code_new = """
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
"""

content = content.replace(helper_code, helper_code_new)

btn_old = """          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-5 py-2 rounded-full font-medium transition-colors border ${
              category === cat
                ? 'bg-blue-600 text-white border-transparent shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            {cat}
          </button>"""

btn_new = """          <button
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
          </button>"""

content = content.replace(btn_old, btn_new)

with open("src/pages/Services.tsx", "w") as f:
    f.write(content)

print("Done")
