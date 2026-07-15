import sys

with open("src/pages/Services.tsx", "r") as f:
    content = f.read()

# Current layout:
#      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 pb-6 border-b border-slate-100 dark:border-slate-800">
#        <div>
#          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Available Services</h2>
#          <p className="text-slate-600 dark:text-slate-400">Find the right professional in your area.</p>
#        </div>
#        
#        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

# Let's fix it so we wrap `<div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">` inside a parent `div` that also holds `recentSearches`.
# But wait, it's easier to just put recent searches OUTSIDE the main row, below it!
# Wait, the main row is `<div className="flex flex-col lg:flex-row ... mb-10">`
# Let's just put `recentSearches` right before `<div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">` and outside the top row container.

wrong_placement = """        {recentSearches.length > 0 && (
           <div className="w-full flex flex-wrap gap-2 items-center text-sm mt-3 lg:mt-4">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Recent:</span>
              {recentSearches.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setSearch(s)}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {s}
                </button>
              ))}
           </div>
        )}
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">"""

correct_placement = """      </div>

      {recentSearches.length > 0 && (
         <div className="flex flex-wrap gap-2 items-center text-sm mb-6 -mt-4">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Recent:</span>
            {recentSearches.map((s, i) => (
              <button
                key={i}
                onClick={() => setSearch(s)}
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {s}
              </button>
            ))}
         </div>
      )}

      <div className="flex gap-3 overflow-x-auto pb-4 mb-4 scrollbar-hide">"""

content = content.replace(wrong_placement, correct_placement)

with open("src/pages/Services.tsx", "w") as f:
    f.write(content)

print("Done")
