export const validateMenuItem = (req, res, next) => {
  const { name, category, description, ingredients, price, image } = req.body;
  const validCategories = ['sushi', 'ramen', 'bebidas', 'postres', 'entradas'];
  
  const errors = [];
  
  if (!name || name.trim().length < 2) {
    errors.push('Nombre debe tener al menos 2 caracteres');
  }
  
  if (!validCategories.includes(category)) {
    errors.push(`Categoría inválida. Use: ${validCategories.join(', ')}`);
  }
  
  if (!description || description.trim().length < 10) {
    errors.push('Descripción debe tener al menos 10 caracteres');
  }
  
  if (!ingredients || ingredients.trim().length < 5) {
    errors.push('Ingredientes debe tener al menos 5 caracteres');
  }
  
  if (!price || isNaN(price) || price <= 0) {
    errors.push('Precio debe ser un número positivo');
  }
  
  if (!image || !image.match(/\.(jpg|jpeg|png|webp)$/i)) {
    errors.push('Imagen debe ser una URL válida (jpg, jpeg, png, webp)');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors
    });
  }
  
  next();
};

