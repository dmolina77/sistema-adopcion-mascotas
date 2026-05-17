document.addEventListener("DOMContentLoaded", function () {
  const formEditar = document.getElementById("formEditar");
  if (!formEditar) return;

  formEditar.addEventListener("submit", async function (e) {
    e.preventDefault();

    const id = formEditar.dataset.id;
    const nombre = document.getElementById("nombreInput").value.trim();
    const descripcion = document
      .getElementById("descripcionInput")
      .value.trim();
    const especie = document.getElementById("especieInput").value;
    const sexo = document.getElementById("sexoInput").value;
    const edad = document.getElementById("edadInput").value;
    const estado = document.getElementById("estadoInput").value;

    if (!nombre || nombre.length < 2) {
      alert("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    try {
      const respuesta = await fetch(`/mascotas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          descripcion,
          especie,
          sexo,
          edad,
          estado,
        }),
      });

      const data = await respuesta.json();

      if (data.estado === "true") {
        alert("✅ Mascota actualizada correctamente.");
        window.location.href = "/mascotas";
      } else {
        alert("❌ No se pudo actualizar. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error al editar:", error);
      alert("❌ Error de conexión. Intenta nuevamente.");
    }
  });
});
