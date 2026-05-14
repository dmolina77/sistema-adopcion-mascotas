const express = require("express");
const router = express.Router();
const Usuario = require("../models/usuario");

// GET registro
router.get("/registro", (req, res) => {
  res.render("registro", { error: null });
});

// POST registro
router.post("/registro", async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.render("registro", {
        error: "El correo ya está registrado. Ingresa uno diferente.",
      });
    }
    await Usuario.create({ nombre, email, password });
    res.redirect("/auth/login");
  } catch (error) {
    console.error("Error registro:", error.message);
    res.render("registro", {
      error: "Error al registrar. Intenta nuevamente.",
    });
  }
});

// GET login
router.get("/login", (req, res) => {
  res.render("login", { error: null });
});

// POST login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.render("login", { error: "Correo o contraseña incorrectos." });
    }
    const passwordOk = await usuario.compararPassword(password);
    if (!passwordOk) {
      return res.render("login", { error: "Correo o contraseña incorrectos." });
    }
    req.session.usuario = {
      id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
    };
    const redirigir = req.session.redirigirA || "/mascotas";
    delete req.session.redirigirA;
    res.redirect(redirigir);
  } catch (error) {
    console.error("Error login:", error.message);
    res.render("login", { error: "Error al iniciar sesión." });
  }
});

// GET logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
