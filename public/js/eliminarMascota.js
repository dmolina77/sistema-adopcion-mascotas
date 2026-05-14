//metodo eliminar mascota
async function eliminarMascota(id) {
  const confirmar = confirm(
    "¿Desea eliminar esta mascota? Esta acción no se puede deshacer.",
  );

  if (!confirmar) return;

  try {
    const data = await fetch(`/mascotas/${id}`, {
      method: "DELETE",
    });

    const res = await data.json();

    if (res.estado === "true") {
      window.location.href = "/mascotas";
    } else {
      alert("No se pudo eliminar.");
    }
  } catch (error) {
    alert("Error de conexión.");
  }
}
