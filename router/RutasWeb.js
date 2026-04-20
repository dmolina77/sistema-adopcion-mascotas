const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  //res.send('Primera vez usando Express! Hice un cambio ')
  res.render("index", {titulo: "Mi título dinámico"})  
})

router.get('/servicios', (req, res) => {
  res.render("servicios", {servicio: "Random XYZ"})  
})

module.exports = router