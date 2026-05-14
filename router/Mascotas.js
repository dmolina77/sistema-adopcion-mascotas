const express = require("express");
const router = express.Router();
const Mascota = require("../models/mascota");
const autenticado = require("../middleware/autenticado");
const mongoose = require("mongoose");

// protege todas rutas de mascotas
router.use(autenticado);

// validar formato id
function esIdValido(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /mascotas - listar todas
router.get("/", async (req, res) => {
  try {
    const mascotas = await Mascota.find().sort({ createdAt: -1 });
    res.render("mascotas", { arrayMascotas: mascotas });
  } catch (error) {
    console.error(error.message);
    res.render("mascotas", { arrayMascotas: [] });
  }
});

// GET /mascotas/buscar
router.get("/buscar", async (req, res) => {
  const q = req.query.q || "";
  if (!q.trim()) return res.redirect("/mascotas");
  try {
    const mascotas = await Mascota.find({
      nombre: { $regex: q.trim(), $options: "i" },
    });
    res.render("mascotas", { arrayMascotas: mascotas });
  } catch (error) {
    res.redirect("/mascotas");
  }
});

// GET /mascotas/crear
router.get("/crear", (req, res) => {
  res.render("crear", { error: null });
});

// POST /mascotas - crear nueva
router.post("/", async (req, res) => {
  const { nombre, descripcion, especie, sexo, edad } = req.body;
  if (!nombre || nombre.trim().length < 2) {
    return res.render("crear", {
      error: "El nombre debe tener al menos 2 caracteres.",
    });
  }
  try {
    await Mascota.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim() : "",
      especie: especie || "Otro",
      sexo: sexo || "N/S",
      edad: edad || 0,
      creadoPor: req.session.usuario.id,
    });
    res.redirect("/mascotas");
  } catch (error) {
    console.error(error.message);
    res.render("crear", { error: "Error al crear. Intenta nuevamente." });
  }
});

// GET /mascotas/:id - ver detalle
router.get("/:id", async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.render("detalle", {
      error: true,
      mensaje: "ID no válido.",
    });
  }
  try {
    const mascota = await Mascota.findById(req.params.id);
    if (!mascota) {
      return res.render("detalle", {
        error: true,
        mensaje: "Mascota no encontrada.",
      });
    }
    res.render("detalle", { mascota, error: false });
  } catch (error) {
    res.render("detalle", { error: true, mensaje: "Error al buscar." });
  }
});

// DELETE /mascotas/:id
router.delete("/:id", async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.json({ estado: "false", mensaje: "ID no válido" });
  }
  try {
    await Mascota.findByIdAndDelete(req.params.id);
    res.json({ estado: "true", mensaje: "Eliminado correctamente" });
  } catch (error) {
    res.json({ estado: "false", mensaje: "Error al eliminar" });
  }
});

// PUT /mascotas/:id
router.put("/:id", async (req, res) => {
  if (!esIdValido(req.params.id)) {
    return res.json({ estado: "false", mensaje: "ID no válido" });
  }
  const { nombre, descripcion, especie, sexo, edad, estado } = req.body;
  try {
    await Mascota.findByIdAndUpdate(req.params.id, {
      nombre,
      descripcion,
      especie,
      sexo,
      edad,
      estado,
    });
    res.json({ estado: "true", mensaje: "Modificado correctamente" });
  } catch (error) {
    res.json({ estado: "false", mensaje: "Error al modificar" });
  }
});

module.exports = router;
