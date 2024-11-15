// routes/usuarioRoutes.js
const express = require("express");
const router = express.Router();
const sucursalModel = require("../models/sucursalModel");

// Ruta de ejemplo para pacientes
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  if (req.session.user) {
    const rolMap = { 1: "administrador", 2: "secretaria", 3: "paciente" };
    const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

    res.render("sucursal", {
      rolUsuario: rolUsuario,
    });
  } else {
    res.render("sucursal");
  }
});

// Obtener todos los sucursales
router.get("/ver", (req, res) => {
  sucursalModel.verSucursales((error, sucursales) => {
    if (error) {
      console.error("Error al obtener los sucursales:", error);
      return res.status(500).json({ error: "Error al obtener los sucursales" });
    }
    res.json(sucursales); // Enviar datos en formato JSON
  });
});

// Agregar una nueva sucursal
router.post("/agregar", (req, res) => {
  const { nombre_sucursal, direccion, telefono } = req.body;

  sucursalModel.agregarSucursal(
    nombre_sucursal,
    direccion,
    telefono,
    (error, nuevoSucursalId) => {
      if (error) {
        console.error("Error al agregar sucursal:", error);
        return res.status(500).json({ error: "Error al agregar sucursal" });
      }
      res.status(201).json({
        message: "Sucursal agregada correctamente",
        id: nuevoSucursalId,
      });
    }
  );
});

// Modificar una sucursal (actualizado para recibir los campos correspondientes)
router.put("/modificar/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_sucursal, direccion, telefono } = req.body;

  sucursalModel.modificarSucursal(
    id,
    nombre_sucursal,
    direccion,
    telefono,
    (error, cambios) => {
      if (error) {
        console.error("Error al modificar sucursal:", error);
        return res.status(500).json({ error: "Error al modificar sucursal" });
      }
      if (cambios > 0) {
        res.json({ message: "Sucursal modificada correctamente" });
      } else {
        res.status(404).json({ error: "Sucursal no encontrada" });
      }
    }
  );
});

// Eliminar una sucursal
router.delete("/eliminar/:id", (req, res) => {
  const { id } = req.params;

  sucursalModel.eliminarSucursal(id, (error, eliminadas) => {
    if (error) {
      console.error("Error al eliminar sucursal:", error);
      return res.status(500).json({ error: "Error al eliminar sucursal" });
    }
    if (eliminadas > 0) {
      res.json({ message: "Sucursal eliminada correctamente" });
    } else {
      res.status(404).json({ error: "Sucursal no encontrada" });
    }
  });
});

module.exports = router;
