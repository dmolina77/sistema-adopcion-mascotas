const express = require("express");
const router = express.Router();

const Mascota = require("../models/mascota");

//CREATE
// render pagina crear
router.get("/crear", async (req, res) => {
  res.render("crear");
});

// crear en BD
// validación de datos para formulario
router.post("/", async (req, res) => {
  const { nombre, descripcion } = req.body;

  if (!nombre || nombre.trim() === "") {
    return res.redirect("/mascotas/crear?error=nombre_requerido");
  }
  if (nombre.trim().length > 50) {
    return res.redirect("/mascotas/crear?error=nombre_largo");
  }

  try {
    await Mascota.create({
      nombre: nombre.trim(),
      descripcion: descripcion ? descripcion.trim().substring(0, 200) : "",
    });
    res.redirect("/mascotas");
  } catch (error) {
    console.error("Error al crear mascota:", error.message);
    res.redirect("/mascotas/crear?error=servidor");
  }
});

// READ - read all
router.get("/", async (req, res) => {
  try {
    arrayMascotasDB = await Mascota.find();
    res.render("mascotas", {
      arrayMascotas: arrayMascotasDB,
    });
  } catch (error) {
    console.log(error);
  }
});

// read 1
router.get("/:id", async (req, res) => {
  const id = req.params.id; // leer id desde url
  try {
    const mascotaDB = await Mascota.findOne({ _id: id }); // buscar elemento con id
    //console.log(mascotaDB);
    res.render("detalle", {
      mascota: mascotaDB,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.render("detalle", {
      error: true,
      mensaje: "No se encuentra el id seleccionado",
    });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  const id = req.params.id; // leer id desde url
  try {
    const mascotaDB = await Mascota.findByIdAndDelete({ _id: id });
    if (mascotaDB) {
      res.json({
        estado: "true",
        mensaje: "eliminado",
      });
    } else {
      res.json({
        estado: "false",
        mensaje: "fallo al eliminar",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// update - edit
router.put("/:id", async (req, res) => {
  const id = req.params.id; // leer id desde url
  const body = req.body;
  try {
    const mascotaDB = await Mascota.findByIdAndUpdate(id, body, {
      useFindAndModify: false,
    });

    res.json({
      estado: "true",
      mensaje: "modificado",
    });
  } catch (error) {
    console.log(error);
    res.json({
      estado: "false",
      mensaje: "fallo al modificar",
    });
  }
});

module.exports = router;
