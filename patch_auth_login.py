import sys
with open("src/server/controllers/authController.ts", "r") as f:
    content = f.read()

import re

# replace loginUser implementation
login_match = re.search(r'export const loginUser = async.*?};\n\n?', content, re.DOTALL)
if login_match:
    old_login = login_match.group(0)
    
new_login = """export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email && !password) {
      return res.status(400).json({ message: 'Invalid username/email or password.' });
    }
    if (!email) {
      return res.status(400).json({ message: 'Please enter your username or email.' });
    }
    if (!password) {
      return res.status(400).json({ message: 'Please enter your password.' });
    }

    let user;
    if (mongoose.connection.readyState !== 1) {
      user = db.users.find(u => u.email === email || (u.username === email));
    } else {
      user = await User.findOne({ $or: [{ email: email }, { username: email }] });
    }

    if (!user) {
      return res.status(404).json({ message: 'Account not found. Please create an account before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user._id.toString(), user.role),
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
"""

content = content.replace(old_login, new_login)

with open("src/server/controllers/authController.ts", "w") as f:
    f.write(content)
