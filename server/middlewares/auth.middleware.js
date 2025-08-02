import jwt from 'jsonwebtoken';
import { jwtSecret } from '../config/jwt.js';

export const authenticate = (req, res, next) => {
  let token = req.cookies.token;
  
  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'No autorizado - Token no proporcionado' });
  }
  
  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Sesión expirada' });
    }
    res.status(401).json({ message: 'No autorizado - Token inválido' });
  }
};

export const authorize = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
};