import sys

with open("src/pages/Login.tsx", "r") as f:
    content = f.read()

submit_old = """    if (!email.trim() || !password.trim()) {
      toast.error('Email and password cannot be empty!');
      return;
    }"""

submit_new = """    if (!email.trim() && !password.trim()) {
      toast.error('Invalid username/email or password.');
      return;
    }
    if (!email.trim()) {
      toast.error('Please enter your username or email.');
      return;
    }
    if (!password.trim()) {
      toast.error('Please enter your password.');
      return;
    }"""

content = content.replace(submit_old, submit_new)

with open("src/pages/Login.tsx", "w") as f:
    f.write(content)

print("Done")
