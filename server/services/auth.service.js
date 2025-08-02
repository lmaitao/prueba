import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../src/models/User.js';
import { jwtSecret, jwtExpiresIn } from '../config/jwt.js';

class AuthService {
  async registerUser(userData) {
    const { name, email, password } = userData;

    // Verificar si el usuario ya existe
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: 'El correo ya está registrado' };
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword
    });

    // Generar token JWT
    const token = this.generateToken(newUser.id, newUser.role);

    return {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token
    };
  }

  async loginUser(credentials) {
    const { email, password } = credentials;

    // Verificar usuario
    const user = await User.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Credenciales inválidas' };
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw { status: 401, message: 'Credenciales inválidas' };
    }

    // Generar token JWT
    const token = this.generateToken(user.id, user.role);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }

  async getCurrentUser(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }
    return user;
  }

  generateToken(userId, role) {
    return jwt.sign(
      { userId, role },
      jwtSecret,
      { expiresIn: jwtExpiresIn }
    );
  }
}

export default new AuthService();