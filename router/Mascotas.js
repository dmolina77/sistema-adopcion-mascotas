const express = require("express");
const router = express.Router();

const Mascota = require("../models/mascota");

// READ - read all (table)
router.get("/", async (req, res) => {
  try {
    arrayMascotasDB = await Mascota.find();
    res.render("mascotas", {
      arrayMascotas: arrayMascotasDB,
    });

    //console.log(arrayMascotasDB);
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

//CREATE
// render pagina crear
router.get("/crear", async (req, res) => {
  res.render("crear");
});

// crear en BD
router.post("/", async (req, res) => {
  const body = req.body;
  try {
    await Mascota.create(body);
    res.redirect("/mascotas");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  const id = req.params.id; // leer id desde url
  const mascotaDB = await Mascota.findByIdAndDelete({ _id: id });

  if (mascotaDB) {
    res.json({
      estado: "true",
      mensaje: "eliminado",
    });
  } else {
    res.json({
      estado: "false",
      mensaje: "fallo eliminar",
    });
  }
  try {
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
