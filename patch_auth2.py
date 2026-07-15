import sys
with open("src/server/controllers/authController.ts", "r") as f:
    content = f.read()

content = content.replace("category, category", "category")

with open("src/server/controllers/authController.ts", "w") as f:
    f.write(content)
print("Done")
