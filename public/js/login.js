document.addEventListener("DOMContentLoaded", () => {
  const authButton = document.getElementById("authButton");
  const loginSection = document.getElementById("loginSection");
  const registerSection = document.getElementById("registerSection");
  const loginForm = document.querySelector("#loginSection form");
  const registerForm = document.querySelector("#registerSection form");
  const registerLink = document.getElementById("registerLink");
  const loginLink = document.getElementById("loginLink");

  // Comprobar si hay una sesión activa
  if (authButton) {
    fetch("/login/session-status")
      .then((response) => response.json())
      .then((data) => {
        if (data.isLoggedIn) {
          authButton.href = "/login/logout";
          authButton.innerHTML =
            '<i class="fa-solid fa-right-from-bracket"></i> Salir';
        } else {
          authButton.href = "/login";
          authButton.innerHTML =
            '<i class="fa-solid fa-right-to-bracket"></i> Ingresar';
        }
      });
  } else {
    console.error("El botón de autenticación no se encuentra en el DOM.");
  }

  // Evento de clic para mostrar la sección de registro
  if (registerLink) {
    registerLink.addEventListener("click", (event) => {
      event.preventDefault();
      loginSection.style.display = "none";
      registerSection.style.display = "block";
    });
  }

  // Evento de clic para mostrar la sección de login
  if (loginLink) {
    loginLink.addEventListener("click", (event) => {
      event.preventDefault();
      loginSection.style.display = "block";
      registerSection.style.display = "none";
    });
  }

  // Manejar el evento de inicio de sesión
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const documento = document.getElementById("Documento").value;
      const password = document.getElementById("Password").value;

      try {
        const response = await fetch("/login/api", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ documento, password }),
        });

        if (response.ok) {
          window.location.href = `/`; // Redirige a la página de Pacientes
          alert("¡Inicio de sesion exitoso!");
        } else {
          console.log("Error de inicio de sesión");
        }
      } catch (error) {
        console.log("Error en la solicitud de login:", error);
      }
    });
  }

  // Manejar el evento de registro
  if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault(); // Esto evita la recarga de página del formulario

      const nombreCompleto = document.getElementById("nombreCompleto").value;
      const obraSocial = document.getElementById("obraSocial").value;
      const telefono = document.getElementById("telefono").value;
      const direccion = document.getElementById("direccion").value;
      const documento = document.getElementById("documentoRegistro").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("passwordRegistro").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      // Verifica que las contraseñas coincidan antes de enviar
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
      }

      try {
        const response = await fetch("/login/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nombreCompleto,
            obraSocial,
            telefono,
            documento,
            email,
            password,
            direccion,
          }),
        });

        const result = await response.json();
        if (response.ok) {
          alert("Registro exitoso, ahora puedes ingresar");
          loginSection.style.display = "block";
          registerSection.style.display = "none";
        } else {
          alert(result.message || "Error en el registro");
        }
      } catch (error) {
        console.error("Error en la solicitud de registro:", error);
      }
    });
  }
});
