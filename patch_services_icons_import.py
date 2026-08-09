import sys

with open("src/pages/Services.tsx", "r") as f:
    content = f.read()

lucide_old = "import { Search, MapPin, SearchX, TrendingUp } from 'lucide-react';"
lucide_new = "import { Search, MapPin, SearchX, TrendingUp, Wind, Fan, Droplets, Zap, Tv, Droplet, Lightbulb, Wrench, Bug, Sparkles, Settings } from 'lucide-react';"

content = content.replace(lucide_old, lucide_new)

with open("src/pages/Services.tsx", "w") as f:
    f.write(content)
