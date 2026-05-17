// auto-cerrar la alerta de éxito después de 3 segundos
const alerta = document.getElementById("alertaExito");
if (alerta) {
  setTimeout(() => {
    alerta.classList.remove("show");
    setTimeout(() => alerta.remove(), 300);
  }, 3000);
}
