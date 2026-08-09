import sys
with open("src/server/controllers/authController.ts", "r") as f:
    content = f.read()

content = content.replace("phoneNumber, experience, hourlyCharge, phoneNumber, experience, hourlyCharge", "phoneNumber, experience, hourlyCharge")

with open("src/server/controllers/authController.ts", "w") as f:
    f.write(content)
print("Done")
