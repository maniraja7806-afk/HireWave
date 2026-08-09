import sys

with open("src/pages/Register.tsx", "r") as f:
    content = f.read()

submit_old = """    try {
      const res = await api.post('/auth/register', { 
        name, username, email, password, role, city, area, pincode, address, phoneNumber: phone 
      });
      login(res.data.token, { id: res.data._id, name: res.data.name, role: res.data.role });
      toast.success('Account created successfully!');
      navigate('/');
    }"""

submit_new = """    try {
      await api.post('/auth/register', { 
        name, 
        username, 
        email, 
        password, 
        role,
        city, 
        area, 
        pincode, 
        address, 
        phoneNumber: phone,
        category: role === 'Provider' ? category : undefined,
        experience: role === 'Provider' ? Number(experience) : undefined,
        hourlyCharge: role === 'Provider' ? Number(hourlyCharge) : undefined
      });
      
      toast.success('Account created successfully! Please login.');
      navigate('/login');
    }"""

content = content.replace(submit_old, submit_new)

with open("src/pages/Register.tsx", "w") as f:
    f.write(content)
print("Done")
