import sys

with open("src/pages/Login.tsx", "r") as f:
    content = f.read()

content = content.replace("navigate('/');", "navigate('/dashboard');")

with open("src/pages/Login.tsx", "w") as f:
    f.write(content)
print("Done")
