//- JavaScript para habilitar el botón de Modificar o Eliminar al mostrar Ver Usuarios
document
  .getElementById("verUsuarios")
  .addEventListener("show.bs.collapse", function () {
    document.getElementById("btnModificarEliminar").disabled = false;
  });

document
  .getElementById("verUsuarios")
  .addEventListener("hide.bs.collapse", function () {
    document.getElementById("btnModificarEliminar").disabled = true;
  });

// Script en la vista HTML/PUG para gestionar los usuarios
document
  .getElementById("btnVerUsuarios")
  .addEventListener("click", cargarUsuarios);
document
  .getElementById("formAgregarUsuario")
  .addEventListener("submit", agregarUsuario);

async function cargarUsuarios() {
  const response = await fetch("/gestion-usuarios/ver");
  const usuarios = await response.json();
  const tablaUsuarios = document.getElementById("tablaUsuarios");
  tablaUsuarios.innerHTML = "";

  usuarios.forEach((usuario) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${usuario.documento}</td>
      <td>${usuario.rol}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="mostrarFormularioModificar(${usuario.id_usuario}, '${usuario.documento}', ${usuario.rol})">Modificar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
      </td>
    `;
    tablaUsuarios.appendChild(row);
  });
}

async function agregarUsuario(event) {
  event.preventDefault();
  const documento = document.getElementById("documento").value;
  const password = document.getElementById("password").value;
  const rol = document.getElementById("rol").value;

  const response = await fetch("/gestion-usuarios/agregar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documento, password, rol }),
  });

  if (response.ok) {
    alert("Usuario agregado exitosamente");
    cargarUsuarios();
  } else {
    alert("Error al agregar usuario");
  }
}

async function modificarUsuario(id) {
  const documento = document.getElementById("documentoModificar").value;
  const rol = document.getElementById("rolModificar").value;

  const response = await fetch(`/gestion-usuarios/modificar/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ documento, rol }),
  });

  if (response.ok) {
    alert("Usuario modificado exitosamente");
    cargarUsuarios();
  } else {
    alert("Error al modificar usuario");
  }
}

async function eliminarUsuario(id) {
  const confirmacion = confirm(
    "¿Estás seguro de que deseas eliminar este usuario?"
  );
  if (confirmacion) {
    const response = await fetch(`/gestion-usuarios/eliminar/${id}`, {
      method: "DELETE",
    });
    if (response.ok) {
      alert("Usuario eliminado exitosamente");
      cargarUsuarios();
    } else {
      alert("Error al eliminar usuario");
    }
  }
}

function mostrarFormularioModificar(id, documento, rol) {
  // Mostrar el formulario de modificación
  const formularioModificar = document.getElementById(
    "modificarEliminarUsuario"
  );
  if (formularioModificar) {
    formularioModificar.style.display = "block";
  } else {
    console.error("Formulario de modificación no encontrado.");
  }

  // Establecer los valores de los campos de formulario
  const documentoInput = document.getElementById("documentoModificar");
  const rolSelect = document.getElementById("rolModificar");

  if (documentoInput && rolSelect) {
    documentoInput.value = documento;
    rolSelect.value = rol;
  } else {
    console.error("Los elementos de modificación no se encontraron.");
  }

  // Establecer la acción del botón para modificar el usuario
  const btnModificarUsuario = document.getElementById("btnModificarUsuario");
  if (btnModificarUsuario) {
    btnModificarUsuario.onclick = () => modificarUsuario(id);
  } else {
    console.error("Botón de modificación no encontrado.");
  }
}

document
  .getElementById("filtroRol")
  .addEventListener("change", filtrarUsuariosPorRol);

async function filtrarUsuariosPorRol() {
  const rolSeleccionado = document.getElementById("filtroRol").value;
  const response = await fetch("/gestion-usuarios/ver");
  const usuarios = await response.json();

  const usuariosFiltrados = usuarios.filter((usuario) => {
    if (rolSeleccionado === "") {
      return true; // Si no se seleccionó un rol, mostrar todos los usuarios
    }
    return usuario.rol.toString() === rolSeleccionado; // Filtrar por el rol seleccionado
  });

  cargarUsuariosEnTabla(usuariosFiltrados);
}

function cargarUsuariosEnTabla(usuarios) {
  const tablaUsuarios = document.getElementById("tablaUsuarios");
  tablaUsuarios.innerHTML = ""; // Limpiar tabla antes de insertar nuevos usuarios

  usuarios.forEach((usuario) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${usuario.documento}</td>
        <td>${usuario.rol}</td>
        <td>
          <button class="btn btn-warning btn-sm" onclick="mostrarFormularioModificar(${usuario.id_usuario}, '${usuario.documento}', ${usuario.rol})">Modificar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id_usuario})">Eliminar</button>
        </td>
      `;
    tablaUsuarios.appendChild(row);
  });
}
