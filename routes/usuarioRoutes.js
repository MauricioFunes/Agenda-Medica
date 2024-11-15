// routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const usuarioModel = require("../models/usuarioModel");

// Ruta de ejemplo para pacientes
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user) {
    const rolMap = { 1: "administrador", 2: "secretaria", 3: "paciente" };
    const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

    res.render("usuarios", {
      rolUsuario: rolUsuario,
    });
  } else {
    res.render("usuarios");
  }
});

// Obtener todos los usuarios
router.get("/ver", (req, res) => {
  usuarioModel.obtenerTodosLosUsuarios((error, usuarios) => {
    if (error) {
      console.error("Error al obtener los usuarios:", error);
      return res.status(500).json({ error: "Error al obtener los usuarios" });
    }
    res.json(usuarios); // Enviar datos en formato JSON
  });
});

// Agregar un nuevo usuario
router.post("/agregar", (req, res) => {
  const { documento, password, rol } = req.body;
  usuarioModel.agregarUsuario(
    documento,
    password,
    rol,
    (error, nuevoUsuarioId) => {
      if (error) {
        console.error("Error al agregar usuario:", error);
        return res.status(500).json({ error: "Error al agregar usuario" });
      }
      res
        .status(201)
        .json({
          message: "Usuario agregado correctamente",
          id: nuevoUsuarioId,
        });
    }
  );
});

// Modificar un usuario
router.put("/modificar/:id", (req, res) => {
  const { id } = req.params;
  const { documento, rol } = req.body;
  usuarioModel.modificarUsuario(id, documento, rol, (error, cambios) => {
    if (error) {
      console.error("Error al modificar usuario:", error);
      return res.status(500).json({ error: "Error al modificar usuario" });
    }
    if (cambios > 0) {
      res.json({ message: "Usuario modificado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  });
});

// Eliminar un usuario
router.delete("/eliminar/:id", (req, res) => {
  const { id } = req.params;
  usuarioModel.eliminarUsuario(id, (error, eliminados) => {
    if (error) {
      console.error("Error al eliminar usuario:", error);
      return res.status(500).json({ error: "Error al eliminar usuario" });
    }
    if (eliminados > 0) {
      res.json({ message: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Usuario no encontrado" });
    }
  });
});

module.exports = router;
