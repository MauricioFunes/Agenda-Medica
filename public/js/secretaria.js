document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const formRegistrarPaciente = document.getElementById(
    "formRegistrarPaciente"
  );
  const formAgendarTurno = document.getElementById("formAgendarTurno");
  const formCancelarTurno = document.getElementById("formCancelarTurno");
  const tablaPacientes = document.getElementById("tablaPacientes");

  // Función para registrar un paciente
  formRegistrarPaciente.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombrePaciente").value;
    const dni = document.getElementById("dniPaciente").value;
    const telefono = document.getElementById("telefonoPaciente").value;

    try {
      const response = await fetch("/secretaria/agregarPaciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, dni, telefono }),
      });
      const result = await response.json();
      alert(result.message || "Paciente registrado exitosamente");
      formRegistrarPaciente.reset();
      cargarPacientes(); // Actualiza la lista de pacientes
    } catch (error) {
      console.error("Error al registrar paciente:", error);
    }
  });

  // Función para agendar un turno
  formAgendarTurno.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dni = document.getElementById("dniPacienteTurno").value;
    const fecha = document.getElementById("fechaTurno").value;
    const hora = document.getElementById("horaTurno").value;
    const id_agenda = document.getElementById("id_agendaModificar").value;

    try {
      const response = await fetch("/secretaria/AgendarTurno", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, fecha, hora, id_agenda }),
      });
      const result = await response.json();
      alert(result.message || "Turno agendado exitosamente");
      formAgendarTurno.reset();
    } catch (error) {
      console.error("Error al agendar turno:", error);
    }
  });

  // Función para cargar y mostrar pacientes en la tabla
  async function cargarPacientes() {
    try {
      const response = await fetch("/secretaria/verPacientes");
      const pacientes = await response.json();
      tablaPacientes.innerHTML = ""; // Limpia la tabla antes de cargar

      pacientes.forEach((paciente) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${paciente.dni}</td>
            <td>${paciente.nombre_completo}</td>
            <td>${paciente.telefono}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="editarPaciente('${paciente.dni}')">Editar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarPaciente('${paciente.dni}')">Eliminar</button>
            </td>
          `;
        tablaPacientes.appendChild(row);
      });
    } catch (error) {
      console.error("Error al cargar pacientes:", error);
    }
  }

  // Función para editar un paciente
  async function editarPaciente(dni) {
    const nuevoNombre = prompt("Ingrese el nuevo nombre del paciente:");
    const nuevoTelefono = prompt("Ingrese el nuevo teléfono del paciente:");
    if (!nuevoNombre || !nuevoTelefono) return;

    try {
      const response = await fetch(`/secretaria/modificar/${dni}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: nuevoNombre, telefono: nuevoTelefono }),
      });
      const result = await response.json();
      alert(result.message || "Paciente actualizado exitosamente");
      cargarPacientes(); // Actualiza la lista de pacientes
    } catch (error) {
      console.error("Error al editar paciente:", error);
    }
  }

  // Función para eliminar un paciente
  async function eliminarPaciente(dni) {
    if (!confirm("¿Estás seguro de que deseas eliminar este paciente?")) return;

    try {
      const response = await fetch(`/secretaria/eliminar/${dni}`, {
        method: "DELETE",
      });
      const result = await response.json();
      alert(result.message || "Paciente eliminado exitosamente");
      cargarPacientes(); // Actualiza la lista de pacientes
    } catch (error) {
      console.error("Error al eliminar paciente:", error);
    }
  }

  // Función para cancelar un turno
  formCancelarTurno.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dni = document.getElementById("dniPacienteCancelar").value;
    const fecha = document.getElementById("fechaTurnoCancelar").value;

    try {
      const response = await fetch(`/secretaria/cancelarTurno`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, fecha }),
      });
      const result = await response.json();
      alert(result.message || "Turno cancelado exitosamente");
      formCancelarTurno.reset();
    } catch (error) {
      console.error("Error al cancelar turno:", error);
    }
  });

  // Cargar los pacientes al cargar la página
  cargarPacientes();
});
