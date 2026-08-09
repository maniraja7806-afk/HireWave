import sys
with open("src/server/controllers/authController.ts", "r") as f:
    content = f.read()

content = content.replace("const { name, username, email, password, role, city, area, pincode, address, category } = req.body;",
                          "const { name, username, email, password, role, city, area, pincode, address, category, phoneNumber, experience, hourlyCharge } = req.body;")

content = content.replace("city, area, pincode, address, category,",
                          "city, area, pincode, address, category, phoneNumber, experience, hourlyCharge,")

content = content.replace("city, area, pincode, address, category\n    });",
                          "city, area, pincode, address, category, phoneNumber, experience, hourlyCharge\n    });")

with open("src/server/controllers/authController.ts", "w") as f:
    f.write(content)
print("Done")
