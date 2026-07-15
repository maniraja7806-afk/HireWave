import sys
with open("src/server/controllers/authController.ts", "r") as f:
    content = f.read()

content = content.replace("const { name, username, email, password, role, city, area, pincode, address } = req.body;",
                          "const { name, username, email, password, role, city, area, pincode, address, category } = req.body;")

content = content.replace("city, area, pincode, address,",
                          "city, area, pincode, address, category,")

content = content.replace("city, area, pincode, address\n    });",
                          "city, area, pincode, address, category\n    });")

with open("src/server/controllers/authController.ts", "w") as f:
    f.write(content)
print("Done")
