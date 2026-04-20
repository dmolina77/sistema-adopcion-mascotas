const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

const port = 3000;

//variables entorno
require("dotenv").config();

// conexion bd - mongo db
const mongoose = require("mongoose");
const user = process.env.USER;
const password = process.env.PASSWORD;
const dbName = process.env.DBNAME;
const uri = `mongodb+srv://${user}:${password}@cluster0.vq2plxe.mongodb.net/${dbName}?retryWrites=true&w=majority`;

async function main() {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.log("Error de conexión", err);
  }
}

main();

// motor plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// static public
app.use(express.static(__dirname + "/public"));

// rutas web
app.use("/", require("./router/RutasWeb"));
app.use("/mascotas", require("./router/Mascotas"));

app.use((req, res, next) => {
  res.status(404).render("404", {
    titulo: "Error 404",
    desc: "Página no encontrada",
  });
});

app.listen(port, () => {
  console.log(`Escuchando al puerto ${port}`);
});
