import sys

with open("src/pages/Register.tsx", "r") as f:
    content = f.read()

# 1. Add categories array
categories = """const CATEGORIES = [
  'AC Technician',
  'Refrigerator Repair',
  'Washing Machine Repair',
  'Microwave Repair',
  'Television Repair',
  'Electrician',
  'Plumber',
  'Carpenter',
  'Pest Control',
  'Home Cleaning'
];

const Register = () => {"""
content = content.replace("const Register = () => {", categories)

# 2. Add serviceType state
state_old = "  const [role, setRole] = useState(defaultRole);"
state_new = "  const [role, setRole] = useState(defaultRole);\n  const [category, setCategory] = useState('');"
content = content.replace(state_old, state_new)

# 3. Add to submit payload
submit_old = """      const res = await api.post('/auth/register', { 
        name, 
        username, 
        email, 
        password, 
        role,
        city, area, pincode, address
      });"""

submit_new = """      const res = await api.post('/auth/register', { 
        name, 
        username, 
        email, 
        password, 
        role,
        city, area, pincode, address,
        category: role === 'Provider' ? category : undefined
      });"""
content = content.replace(submit_old, submit_new)

# 4. Add UI field
ui_old = """                </label>
              </div>
            </div>

            <motion.button"""

ui_new = """                </label>
              </div>
            </div>

            {role === 'Provider' && (
              <div className="pt-4 border-t border-white/10 mt-4">
                <label className="block text-sm font-medium text-slate-200 mb-1">Type of Service Provided</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none"
                  required
                >
                  <option value="" disabled>Select a service type...</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            <motion.button"""
content = content.replace(ui_old, ui_new)

with open("src/pages/Register.tsx", "w") as f:
    f.write(content)

print("Done")
