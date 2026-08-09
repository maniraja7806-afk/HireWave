import sys

with open("src/pages/Register.tsx", "r") as f:
    content = f.read()

# Add new states
states_old = "  const [category, setCategory] = useState('');"
states_new = """  const [category, setCategory] = useState('');
  const [experience, setExperience] = useState('');
  const [hourlyCharge, setHourlyCharge] = useState('');"""
content = content.replace(states_old, states_new)

# Update submit payload
submit_old = """      const res = await api.post('/auth/register', { 
        name, 
        username, 
        email, 
        password, 
        role,
        city, area, pincode, address,
        category: role === 'Provider' ? category : undefined
      });"""

submit_new = """      const res = await api.post('/auth/register', { 
        name, 
        username, 
        email, 
        password, 
        role,
        city, area, pincode, address, phoneNumber: phone,
        category: role === 'Provider' ? category : undefined,
        experience: role === 'Provider' ? Number(experience) : undefined,
        hourlyCharge: role === 'Provider' ? Number(hourlyCharge) : undefined
      });"""
content = content.replace(submit_old, submit_new)

# Add Experience and Hourly Charge UI below category
ui_old = """              <div className="pt-4 border-t border-white/10 mt-4">
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
              </div>"""

ui_new = """              <div className="pt-4 border-t border-white/10 mt-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-200 mb-1">Type of Service Provided *</label>
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
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Years of Experience *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Hourly Charge (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={hourlyCharge}
                      onChange={(e) => setHourlyCharge(e.target.value)}
                      className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
              </div>"""
content = content.replace(ui_old, ui_new)

# Add password strength indicator
pass_ui_old = """                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>"""

pass_ui_new = """                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all sm:text-sm pr-10"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    <div className={`h-1 flex-1 rounded-full ${password.length > 0 ? (password.length >= 8 ? 'bg-green-500' : 'bg-red-500') : 'bg-slate-700'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 8 && /[A-Z]/.test(password) ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                    <div className={`h-1 flex-1 rounded-full ${password.length >= 8 && /[0-9!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-slate-700'}`}></div>
                  </div>
                )}
              </div>"""

content = content.replace(pass_ui_old, pass_ui_new)

with open("src/pages/Register.tsx", "w") as f:
    f.write(content)

print("Done")
