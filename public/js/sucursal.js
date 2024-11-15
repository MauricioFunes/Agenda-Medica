// sucursal.js

// Función para obtener y mostrar todas las sucursales
function obtenerSucursales() {
  fetch("/sucursal/ver")
    .then((response) => response.json())
    .then((sucursales) => {
      const tablaSucursales = document.getElementById("tablaSucursales");
      tablaSucursales.innerHTML = ""; // Limpiar tabla antes de agregar las filas

      sucursales.forEach((sucursal) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${sucursal.nombre_sucursal}</td>
            <td>${sucursal.direccion}</td>
            <td>${sucursal.telefono}</td>
            <td>
              <button class="btn btn-warning btn-sm" onclick="mostrarFormularioModificar(${sucursal.id_sucursal})">Modificar</button>
              <button class="btn btn-danger btn-sm" onclick="eliminarSucursal(${sucursal.id_sucursal})">Eliminar</button>
            </td>
          `;

        tablaSucursales.appendChild(fila);
      });
    })
    .catch((error) => {
      console.error("Error al obtener sucursales:", error);
    });
}

// Función para agregar una nueva sucursal
document
  .getElementById("formAgregarSucursal")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nombreSucursal = document.getElementById("nombreSucursal").value;
    const direccionSucursal =
      document.getElementById("direccionSucursal").value;
    const telefonoSucursal = document.getElementById("telefonoSucursal").value;

    fetch("/sucursal/agregar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre_sucursal: nombreSucursal,
        direccion: direccionSucursal,
        telefono: telefonoSucursal,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          obtenerSucursales(); // Recargar la lista de sucursales
        }
      })
      .catch((error) => {
        console.error("Error al agregar sucursal:", error);
      });
  });

// Función para mostrar el formulario de modificación con los datos de la sucursal seleccionada
function mostrarFormularioModificar(idSucursal) {
  fetch(`/sucursal/ver/${idSucursal}`)
    .then((response) => response.json())
    .then((sucursal) => {
      document.getElementById("nombreSucursalModificar").value =
        sucursal.nombre_sucursal;
      document.getElementById("direccionSucursalModificar").value =
        sucursal.direccion;
      document.getElementById("telefonoSucursalModificar").value =
        sucursal.telefono;

      // Mostrar formulario de modificación
      document.getElementById("formularioModificarSucursal").style.display =
        "block";

      // Agregar evento para guardar los cambios
      document.getElementById("guardarCambiosSucursal").onclick = function () {
        const nombreSucursal = document.getElementById(
          "nombreSucursalModificar"
        ).value;
        const direccionSucursal = document.getElementById(
          "direccionSucursalModificar"
        ).value;
        const telefonoSucursal = document.getElementById(
          "telefonoSucursalModificar"
        ).value;

        fetch(`/sucursal/modificar/${idSucursal}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_sucursal: nombreSucursal,
            direccion: direccionSucursal,
            telefono: telefonoSucursal,
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message) {
              alert(data.message);
              obtenerSucursales(); // Recargar la lista de sucursales
              document.getElementById(
                "formularioModificarSucursal"
              ).style.display = "none"; // Ocultar formulario
            }
          })
          .catch((error) => {
            console.error("Error al modificar sucursal:", error);
          });
      };
    })
    .catch((error) => {
      console.error("Error al obtener los datos de la sucursal:", error);
    });
}

// Función para eliminar una sucursal
function eliminarSucursal(idSucursal) {
  if (confirm("¿Estás seguro de que deseas eliminar esta sucursal?")) {
    fetch(`/sucursal/eliminar/${idSucursal}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
          obtenerSucursales(); // Recargar la lista de sucursales
        }
      })
      .catch((error) => {
        console.error("Error al eliminar sucursal:", error);
      });
  }
}

// Al cargar la página, obtenemos todas las sucursales
document.addEventListener("DOMContentLoaded", function () {
  obtenerSucursales();
});
