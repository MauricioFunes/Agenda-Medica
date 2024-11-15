// Script en la vista HTML/PUG para gestionar los médicos
document
  .getElementById("btnVerProfesionales")
  .addEventListener("click", cargarMedicos);
document
  .getElementById("formAgregarProfesional")
  .addEventListener("submit", agregarMedico);
document
  .getElementById("formAgregarEspecialidad")
  .addEventListener("submit", agregarEspecialidad);

// Cargar médicos
async function cargarMedicos() {
  const response = await fetch("/gestion-profesionales/ver");
  const medicos = await response.json();
  const tablaMedicos = document.getElementById("tablaProfesionales");
  tablaMedicos.innerHTML = "";

  if (Array.isArray(medicos)) {
    medicos.forEach((medico) => {
      const row = document.createElement("tr");
      if (medico.nombre_especialidad === null) {
        medico.nombre_especialidad = "n/a";
      }
      row.innerHTML = `
  <td>${medico.nombre_completo}</td>
  <td>${medico.nombre_especialidad}</td>
  <td>${medico.dni}</td>
  <td>${medico.telefono}</td>
  <td>${medico.email}</td>
  <td>${medico.direccion}</td>
  <td>
    <button class="btn btn-warning btn-sm" onclick="mostrarFormularioModificar(
      ${medico.id_profesional},
      '${medico.nombre_completo}',
      '${medico.dni}',
      '${medico.telefono}',
      '${medico.email}',
      '${medico.direccion}'
    )">Modificar</button>
    <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${medico.id_profesional})">Eliminar</button>
  </td>
`;

      tablaMedicos.appendChild(row);
    });
  } else {
    console.error("La respuesta no es un array:", medicos);
  }
}

// Agregar médico
async function agregarMedico(event) {
  event.preventDefault();
  const nombre_completo = document.getElementById("nombre_completo").value;
  const dni = document.getElementById("dni2").value;
  const telefono = document.getElementById("telefono2").value;
  const email = document.getElementById("email2").value;
  const direccion = document.getElementById("direccion2").value;

  const response = await fetch("/gestion-profesionales/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre_completo,
      dni,
      telefono,
      email,
      direccion,
    }),
  });

  if (response.ok) {
    alert("Médico agregado exitosamente");
    cargarMedicos();
  } else {
    alert("Error al agregar médico");
  }
}

// Modificar médico
async function modificarMedico(id) {
  const nombre_completo = document.getElementById(
    "nombre_completoModificar"
  ).value;
  const especialidad = document.getElementById("especialidadModificar").value;

  const response = await fetch(`/gestion-profesionales/modificar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nombre_completo, especialidad }),
  });

  if (response.ok) {
    alert("Médico modificado exitosamente");
    cargarMedicos();
  } else {
    alert("Error al modificar médico");
  }
}

// Eliminar médico
async function eliminarMedico(id) {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas eliminar este médico?"
  );
  if (confirmacion) {
    const response = await fetch(`/gestion-profesionales/eliminar/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Médico eliminado exitosamente");
      cargarMedicos();
    } else {
      alert("Error al eliminar médico");
    }
  }
}

// Mostrar formulario de modificación
function mostrarFormularioModificar(
  id,
  nombre,
  dni,
  telefono,
  email,
  direccion
) {
  const formulario = document.getElementById("formularioModificar");
  if (!formulario) {
    console.error("Formulario de modificación no encontrado.");
    return;
  }

  formulario.style.display = "block"; // Muestra el formulario

  // Llenar los campos del formulario con los datos del profesional
  document.getElementById("nombreCompleto").value = nombre || "";
  document.getElementById("dni").value = dni || "";
  document.getElementById("telefono").value = telefono || "";
  document.getElementById("email").value = email || "";
  document.getElementById("direccion").value = direccion || "";

  // Almacena el ID en el formulario
  formulario.setAttribute("data-id", id);
}

// Evento submit para el formulario de modificación
document
  .getElementById("formModificarProfesional")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const formulario = document.getElementById("formularioModificar");
    const id = formulario.getAttribute("data-id");

    const datosModificados = {
      nombre_completo: document.getElementById("nombreCompleto").value,
      dni: document.getElementById("dni").value,
      telefono: document.getElementById("telefono").value,
      email: document.getElementById("email").value,
      direccion: document.getElementById("direccion").value,
    };

    // Enviar la solicitud para guardar los cambios
    const response = await fetch(`/gestion-profesionales/modificar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(datosModificados),
    });

    if (response.ok) {
      alert("Cambios guardados correctamente.");
      cargarMedicos();
      this.style.display = "none"; // Oculta el formulario
    } else {
      alert("Error al modificar médico.");
    }
  });

// Filtrar médicos por especialidad
document.getElementById("especialidadAsignar").addEventListener("change", filtrarMedicosPorEspecialidad);

async function filtrarMedicosPorEspecialidad() {
  const especialidadSeleccionada = document.getElementById("especialidad").value;
  const response = await fetch(`/gestion-profesionales/filtrar/${especialidadSeleccionada}`);
  const medicosFiltrados = await response.json();
  
  cargarMedicosEnTabla(medicosFiltrados);
}

// Asignar especialidad a un médico
document.getElementById("formAsignarEspecialidad").addEventListener("submit", async function (event) {
  event.preventDefault();

  const medicoId = document.getElementById("medicoAsignar").value;
  const especialidadId = document.getElementById("especialidadAsignar").value;

  const response = await fetch("/gestion-profesionales/asignar-especialidad", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ medicoId, especialidadId }),
  });

  if (response.ok) {
    alert("Especialidad asignada correctamente.");
    cargarMedicos(); // Refresca la lista de médicos si es necesario
  } else {
    alert("Error al asignar especialidad.");
  }
});

function cargarMedicosEnTabla(medicos) {
  const tablaMedicos = document.getElementById("tablaProfesionales");
  tablaMedicos.innerHTML = ""; // Limpiar tabla antes de insertar nuevos médicos

  medicos.forEach((medico) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${medico.nombre_completo}</td>
        <td>${medico.nombre_especialidad || "Sin especialidad"}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="mostrarFormularioModificar(${
            medico.id_profesional
          }, '${medico.nombre_completo}', ${
      medico.id_especialidad
    })">Modificar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMedico(${
            medico.id_profesional
          })">Eliminar</button>
        </td>
      `;
    tablaMedicos.appendChild(row);
  });
}

// Agregar especialidad
async function agregarEspecialidad(event) {
  event.preventDefault();
  const nombreEspecialidad =
    document.getElementById("nombreEspecialidad").value;

  const response = await fetch(
    "/gestion-profesionales/gestion-especialidades/agregar",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombreEspecialidad }),
    }
  );

  if (response.ok) {
    alert("Especialidad agregada exitosamente");
    cargarEspecialidades();
  } else {
    alert("Error al agregar especialidad");
  }
}

// Cargar especialidades
async function cargarEspecialidades() {
  const response = await fetch(
    "/gestion-profesionales/gestion-especialidades/ver"
  );
  const especialidades = await response.json();
  const selectEspecialidades = document.getElementById("especialidadAsignar");
  const filtroEspecialidades = document.getElementById("filtroEspecialidad");

  // Limpiar select
  selectEspecialidades.innerHTML =
    "<option value=''>Seleccionar Especialidad</option>";
  filtroEspecialidades.innerHTML =
    "<option value=''>Filtrar por Especialidad</option>";

  especialidades.forEach((especialidad) => {
    const option = document.createElement("option");
    option.value = especialidad.id_especialidad;
    option.textContent = especialidad.nombre_especialidad;

    selectEspecialidades.appendChild(option);

    const filtroOption = document.createElement("option");
    filtroOption.value = especialidad.id_especialidad;
    filtroOption.textContent = especialidad.nombre_especialidad;

    filtroEspecialidades.appendChild(filtroOption);
  });
}

window.onload = cargarEspecialidades;
