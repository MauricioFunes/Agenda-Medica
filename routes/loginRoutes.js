// routes/loginRoutes.js
const express = require("express");
const router = express.Router();
const loginModel = require("../models/loginModel");

// Ruta para la página de login
router.get("/", (req, res) => {
  res.render("login");
});

router.get("/session-status", (req, res) => {
  if (req.session.user) {
    res.json({ isLoggedIn: true });
  } else {
    res.json({ isLoggedIn: false });
  }
});

// Ruta para la solicitud de login
router.post("/api", (req, res) => {
  const { documento, password } = req.body;

  loginModel.obtenerUsuarioPorDocumento(documento, (error, usuario) => {
    if (error) {
      console.error("Error al obtener el usuario:", error);
      return res.status(500).json({ mensaje: "Error del servidor" });
    }
    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (usuario.password === password) {
      // Guardar información en la sesión
      req.session.user = {
        id: usuario.id_usuario,
        documento: usuario.documento,
        rol: usuario.rol,
      };
      res.status(200).json({ mensaje: "Inicio de sesión exitoso" });
      console.log("Inicio de sesion exitoso: " + usuario.documento);
    } else {
      return res.status(401).json({ mensaje: "Contraseña incorrecta" });
    }
  });
});

// Ruta para manejar registro
router.post("/register", async (req, res) => {
  const usuarioData = {
    documento: req.body.documento,
    password: req.body.password,
  };

  const pacienteData = {
    nombreCompleto: req.body.nombreCompleto || "",
    obra_social: req.body.obraSocial || "",
    telefono: req.body.telefono || "",
    documento: req.body.documento || "",
    email: req.body.email || "",
    direccion: req.body.direccion || "",
  };

  try {
    const documentoExistente = await loginModel.verificarDocumentoExistente(
      usuarioData.documento
    );
    if (documentoExistente) {
      return res
        .status(400)
        .json({ message: "El documento ya está registrado" });
    }

    loginModel.registrarUsuario(usuarioData, pacienteData, (error, result) => {
      if (error) {
        console.error("Error en el modelo al registrar usuario:", error);
        return res
          .status(500)
          .json({ message: "Error al registrar el usuario" });
      }
      return res.status(201).json({ message: result.message });
    });
  } catch (error) {
    console.error("Error al verificar documento:", error);
    res.status(500).json({ message: "Error al procesar la solicitud" });
  }
});

// Ruta de cierre de sesión (Logout)
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error al cerrar sesión");
    }
    res.clearCookie("connect.sid"); // Limpiar la cookie de sesión
    res.redirect("/");
  });
});

module.exports = router;
