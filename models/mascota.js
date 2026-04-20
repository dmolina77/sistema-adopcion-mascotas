const mongoose = require("mongoose");

const mascotaSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
});

//crear modelo
const Mascota = mongoose.model("Mascota", mascotaSchema);

module.exports = Mascota;
