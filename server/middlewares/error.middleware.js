const errorMiddleware = (err, req, res, next) => {
  console.error(err.stack);
  
  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      message: 'Error de validación',
      errors: err.errors 
    });
  }
  
  // Errores de JWT
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Token inválido' });
  }
  
  // Error personalizado con status
  if (err.status) {
    return res.status(err.status).json({ message: err.message });
  }
  
  // Error general del servidor
  res.status(500).json({ 
    message: 'Algo salió mal en el servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

export default errorMiddleware;