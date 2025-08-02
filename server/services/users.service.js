import User from '../src/models/User.js';
import bcrypt from 'bcryptjs';

class UserService {
  async getAllUsers() {
    return await User.getAll();
  }

  async getUserById(id) {
    const user = await User.findById(id);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }
    return user;
  }

  async updateUser(id, updateData, currentUserId, currentUserRole) {
    const { name, email, role, password } = updateData;

    // Validar que el usuario exista
    const existingUser = await User.findById(id);
    if (!existingUser) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }

    // Un usuario no puede cambiar su propio rol
    if (role && id === currentUserId) {
      throw { status: 403, message: 'No puedes cambiar tu propio rol' };
    }

    // Solo admin puede cambiar roles
    if (role && currentUserRole !== 'admin') {
      throw { status: 403, message: 'No autorizado para cambiar roles' };
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== existingUser.email) {
      const userWithEmail = await User.findByEmail(email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw { status: 400, message: 'El correo ya está en uso' };
      }
    }

    // Hash de la nueva contraseña si se proporciona
    let hashedPassword;
    if (password) {
      if (password.length < 6) {
        throw { status: 400, message: 'La contraseña debe tener al menos 6 caracteres' };
      }
      hashedPassword = await bcrypt.hash(password, 12);
    }

    return await User.update(id, {
      name,
      email,
      role,
      password: hashedPassword
    });
  }

  async deleteUser(id, currentUserId, currentUserRole) {
    // Un usuario no puede eliminarse a sí mismo
    if (id === currentUserId) {
      throw { status: 403, message: 'No puedes eliminarte a ti mismo' };
    }

    // Solo admin puede eliminar usuarios
    if (currentUserRole !== 'admin') {
      throw { status: 403, message: 'No autorizado para eliminar usuarios' };
    }

    const user = await User.findById(id);
    if (!user) {
      throw { status: 404, message: 'Usuario no encontrado' };
    }

    const result = await User.delete(id);
    if (!result) {
      throw { status: 500, message: 'Error al eliminar el usuario' };
    }

    return { message: 'Usuario eliminado exitosamente' };
  }
}

export default new UserService();