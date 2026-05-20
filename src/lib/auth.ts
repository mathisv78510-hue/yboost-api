import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'plats_du_monde_secret_key';

interface JwtPayload {
  id: number;
  nom: string;
  email: string;
}

export function verifyToken(authHeader: string | null): JwtPayload | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.slice(7), JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}
