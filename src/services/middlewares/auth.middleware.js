export const isAdmin = (req, res, next) => {
  const user = req.session.user;
  console.log("User:", user);
  if (!user || !user.role) {
    console.log("No hay usuario autenticado o no se ha definido un rol");
    return res.status(403).json({ error: "Acceso no autorizado" });
  }
  if (user.role !== 'admin') {
    console.log("El usuario no tiene rol de administrador");
    return res.status(403).json({ error: "Acceso no autorizado" });
  }
  console.log("Acceso concedido al administrador");
  next();
};





export const isUser = (req, res, next) => {
  const user = req.session.user;
  if (!user || user.role !== 'user') {
    return res.status(403).json({ error: "Acceso no autorizado" });
  }
  next();
};
