// agenda.js

document.addEventListener("DOMContentLoaded", () => {
  // Variables de los elementos del DOM
  const tablaAgendas = document.getElementById("tablaAgendas");
  const formAgregarAgenda = document.getElementById("formAgregarAgenda");
  const formModificarAgenda = document.getElementById("formModificarAgenda");
  const formEliminarAgenda = document.getElementById("formEliminarAgenda");

  // Función para cargar todas las agendas
  async function cargarAgendas() {
    try {
      const response = await fetch("/agenda/ver");
      const agendas = await response.json();
      tablaAgendas.innerHTML = ""; // Limpia la tabla antes de agregar nuevas filas

      agendas.forEach((agenda) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${agenda.nombre_completo}</td>
            <td>${agenda.nombre_sucursal}</td>
            <td>${agenda.clasificacion}</td>
            <td>${agenda.disponibilidad}</td>
            <td>${agenda.fecha_inicio}</td>
            <td>${agenda.fecha_fin}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="modificarAgenda(${agenda.id_agenda})">Modificar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarAgenda(${agenda.id_agenda})">Eliminar</button>
            </td>
          `;
        tablaAgendas.appendChild(fila);
      });
    } catch (error) {
      console.error("Error al cargar agendas:", error);
    }
  }

  // Función para agregar una nueva agenda
  formAgregarAgenda.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(formAgregarAgenda);
    const jsonData = Object.fromEntries(data.entries());

    try {
      const response = await fetch("/agenda/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        alert("Agenda agregada exitosamente");
        formAgregarAgenda.reset();
        cargarAgendas(); // Recarga las agendas
      } else {
        alert("Error al agregar la agenda");
      }
    } catch (error) {
      console.error("Error al agregar agenda:", error);
    }
  });

  // Función para modificar una agenda
  formModificarAgenda.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idAgenda = document.getElementById("id_agendaModificar").value;
    const data = new FormData(formModificarAgenda);
    const jsonData = Object.fromEntries(data.entries());

    try {
      const response = await fetch(`/agenda/modificar/${idAgenda}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });

      if (response.ok) {
        alert("Agenda modificada exitosamente");
        formModificarAgenda.reset();
        cargarAgendas(); // Recarga las agendas
      } else {
        alert("Error al modificar la agenda");
      }
    } catch (error) {
      console.error("Error al modificar agenda:", error);
    }
  });

  // Función para eliminar una agenda
  formEliminarAgenda.addEventListener("submit", async (e) => {
    e.preventDefault();
    const idAgenda = document.getElementById("id_agendaEliminar").value;

    try {
      const response = await fetch(`/agenda/eliminar/${idAgenda}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Agenda eliminada exitosamente");
        formEliminarAgenda.reset();
        cargarAgendas(); // Recarga las agendas
      } else {
        alert("Error al eliminar la agenda");
      }
    } catch (error) {
      console.error("Error al eliminar agenda:", error);
    }
  });

  // Llama a cargarAgendas al inicio para mostrar la lista de agendas
  cargarAgendas();
});
