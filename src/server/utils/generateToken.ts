import jwt from 'jsonwebtoken';

export const generateToken = (id: string, role: string) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'super-secret-key-for-jwt-auth', {
    expiresIn: '30d',
  });
};
