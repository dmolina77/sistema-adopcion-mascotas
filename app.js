const express = require("express");
const session = require("express-session");
//const MongoStore = require("connect-mongo");
const MongoStore = require("connect-mongo").default || require("connect-mongo");
const mongoose = require("mongoose");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

//helmet, cabeceras http, solo en producción
if (process.env.NODE_ENV === "production") {
  app.use(helmet());
} else {
  app.use(
    helmet({
      contentSecurityPolicy: false,
    }),
  );
}

//variables entorno
const user = process.env.USER;
const password = process.env.PASSWORD;
const dbName = process.env.DBNAME;
const uri = `mongodb+srv://${user}:${password}@cluster0.vq2plxe.mongodb.net/${dbName}?retryWrites=true&w=majority`;

// conexion bd - mongo db
async function main() {
  try {
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.log("Error de conexión: ", err);
    process.exit(1);
  }
}
main();

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// static public, caché 7 dias
app.use(express.static(__dirname + "/public", { maxAge: "7d" }));

// sesion almacenada con mongo
app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: uri }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //agrega http en produccion/deploy
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 24 horas
    },
  }),
);

// usuario global, disponible en todas las vistas
app.use((req, res, next) => {
  res.locals.usuarioActivo = req.session.usuario || null;
  next();
});

// motor plantillas
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

// rutas web
app.use("/", require("./router/RutasWeb"));
app.use("/auth", require("./router/Auth")); // ruta auth
app.use("/mascotas", require("./router/Mascotas")); //ruta CRUD
// error 404
app.use((req, res, next) => {
  res.status(404).render("404", {
    titulo: "Error 404",
    desc: "Página no encontrada",
  });
});

app.listen(port, () => {
  console.log(`Escuchando al puerto ${port}`);
});
