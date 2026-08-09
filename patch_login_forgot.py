import sys

with open("src/pages/Login.tsx", "r") as f:
    content = f.read()

forgot_ui_old = """              <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
              <div className="relative">"""

forgot_ui_new = """              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-200">Password</label>
                <a href="#" className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative">"""

content = content.replace(forgot_ui_old, forgot_ui_new)

with open("src/pages/Login.tsx", "w") as f:
    f.write(content)
print("Done")
