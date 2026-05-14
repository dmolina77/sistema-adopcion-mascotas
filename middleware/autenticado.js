function autenticado(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  // guarda la ruta a la que intentaba acceder
  req.session.redirigirA = req.originalUrl;
  res.redirect("/auth/login");
}

module.exports = autenticado;
