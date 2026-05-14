const mongoose = require("mongoose");

const mascotaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    descripcion: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "Sin descripción",
    },
    especie: {
      type: String,
      enum: ["Perro", "Gato", "Conejo", "Ave", "Otro"],
      default: "Otro",
    },
    sexo: {
      type: String,
      enum: ["Macho", "Hembra", "N/S"],
      default: "N/S",
    },
    edad: {
      type: Number,
      min: 0,
      max: 100,
    },
    estado: {
      type: String,
      enum: ["disponible", "adoptado"],
      default: "disponible",
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // referencia al usuario que creó la mascota
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Mascota", mascotaSchema);
