import sys

with open("src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

# Replace provider pending buttons
old_provider_pending = """                          {user.role === 'Provider' && booking.status === 'Pending' && (
                            <div className="flex gap-2 items-center md:flex-col md:justify-center">
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Accepted')}
                                className="border border-green-600 bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition-colors w-full shadow-sm"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Rejected')}
                                className="border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2 rounded-lg font-medium transition-colors w-full"
                              >
                                Reject
                              </button>
                            </div>
                          )}"""

new_provider_pending = """                          {user.role === 'Provider' && booking.status === 'Pending' && (
                            <div className="flex gap-2 items-center md:flex-col md:justify-center">
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Confirmed')}
                                className="border border-green-600 bg-green-600 text-white hover:bg-green-700 px-5 py-2 rounded-lg font-medium transition-colors w-full shadow-sm"
                              >
                                Confirm Appointment
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                                className="border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2 rounded-lg font-medium transition-colors w-full"
                              >
                                Cancel Appointment
                              </button>
                            </div>
                          )}"""

content = content.replace(old_provider_pending, new_provider_pending)

# Also support Accepted / Confirmed for provider
old_provider_accepted = """                          {user.role === 'Provider' && booking.status === 'Accepted' && (
                            <div className="flex items-center md:flex-col md:justify-center">
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors w-full shadow-sm"
                              >
                                Mark Completed
                              </button>
                            </div>
                          )}"""

new_provider_accepted = """                          {user.role === 'Provider' && (booking.status === 'Accepted' || booking.status === 'Confirmed') && (
                            <div className="flex gap-2 items-center md:flex-col md:justify-center">
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Completed')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors w-full shadow-sm"
                              >
                                Mark Completed
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(booking._id, 'Cancelled')}
                                className="border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-5 py-2 rounded-lg font-medium transition-colors w-full"
                              >
                                Cancel Appointment
                              </button>
                            </div>
                          )}"""

content = content.replace(old_provider_accepted, new_provider_accepted)

# Update upcoming filter
content = content.replace("['Pending', 'Accepted']", "['Pending', 'Confirmed', 'Accepted']")

with open("src/pages/Dashboard.tsx", "w") as f:
    f.write(content)

print("Dashboard patched successfully")
