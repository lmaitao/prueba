import User from '../models/User.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    // Solo admin puede cambiar roles
    if (role && req.userRole !== 'admin') {
      return res.status(403).json({ message: 'No autorizado' });
    }
    
    // Un usuario no puede cambiar su propio rol
    if (role && id === req.userId) {
      return res.status(403).json({ message: 'No puedes cambiar tu propio rol' });
    }
    
    const updatedUser = await User.update(id, { name, email, role });
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Un usuario no puede eliminarse a sí mismo
    if (id === req.userId) {
      return res.status(403).json({ message: 'No puedes eliminarte a ti mismo' });
    }
    
    const deletedUser = await User.delete(id);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
};