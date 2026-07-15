import sys

with open("src/pages/Dashboard.tsx", "r") as f:
    content = f.read()

import_line = "import { getCategoryIcon } from '../utils/categoryIcons';\n"
content = import_line + content

category_old = """<p className="text-sm text-slate-500 dark:text-slate-400">{provider.category || 'Service Provider'}</p>"""
category_new = """<div className="flex items-center gap-1.5 mt-1">
                              <span className="text-slate-400 dark:text-slate-500">
                                {getCategoryIcon(provider.category || '')}
                              </span>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{provider.category || 'Service Provider'}</p>
                            </div>"""
content = content.replace(category_old, category_new)

with open("src/pages/Dashboard.tsx", "w") as f:
    f.write(content)
