// routes/medicoRoutes.js
const express = require("express");
const router = express.Router();
const medicoModel = require("../models/medicoModel");

// Ruta de ejemplo para pacientes
// Ruta para mostrar la página de médicos con listas de médicos y especialidades
router.get("/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  try {
    const especialidades = await new Promise((resolve, reject) => {
      medicoModel.obtenerEspecialidades((error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });

    const profesionales = await new Promise((resolve, reject) => {
      medicoModel.obtenerTodosLosProfesionales((error, results) => {
        if (error) {
          reject(error);
        }
        resolve(results);
      });
    });

    const rolMap = { 1: "administrador", 2: "secretaria", 3: "paciente" };
    const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

    res.render("medicos", {
      rolUsuario: rolUsuario,
      especialidades: especialidades,
      profesionales: profesionales,
    });
  } catch (error) {
    console.error("Error al obtener datos:", error);
    res.status(500).send("Error al cargar datos.");
  }
});

// Obtener todos los profesionales
router.get("/ver", (req, res) => {
  medicoModel.obtenerProfesionalesConEspecialidades((error, profesionales) => {
    if (error) {
      console.error("Error al obtener los profesionales:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener los profesionales" });
    }
    res.json(profesionales); // Enviar datos en formato JSON
  });
});

// Agregar un nuevo profesional
router.post("/agregar", (req, res) => {
  const { nombre_completo, dni, telefono, email, direccion } = req.body;
  medicoModel.agregarProfesional(
    nombre_completo,
    dni,
    telefono,
    email,
    direccion,
    (error, nuevoUsuarioId) => {
      if (error) {
        console.error("Error al agregar profesional:", error);
        return res.status(500).json({ error: "Error al agregar profesional" });
      }
      res.status(201).json({
        message: "Profesional agregado correctamente",
        id: nuevoUsuarioId,
      });
    }
  );
});

// Modificar un profesional (actualizado para recibir más campos)
router.put("/modificar/:id", (req, res) => {
  const { id } = req.params;
  const { nombre_completo, dni, telefono, email, direccion } = req.body;

  medicoModel.modificarProfesional(
    id,
    nombre_completo,
    dni,
    telefono,
    email,
    direccion,
    (error, cambios) => {
      if (error) {
        console.error("Error al modificar profesional:", error);
        return res
          .status(500)
          .json({ error: "Error al modificar profesional" });
      }
      if (cambios > 0) {
        res.json({ message: "Profesional modificado correctamente" });
      } else {
        res.status(404).json({ error: "Profesional no encontrado" });
      }
    }
  );
});

// Eliminar un profesional
router.delete("/eliminar/:id", (req, res) => {
  const { id } = req.params;
  medicoModel.eliminarProfesional(id, (error, eliminados) => {
    if (error) {
      console.error("Error al eliminar profesional:", error);
      return res.status(500).json({ error: "Error al eliminar profesional" });
    }
    if (eliminados > 0) {
      res.json({ message: "Profesional eliminado correctamente" });
    } else {
      res.status(404).json({ error: "Profesional no encontrado" });
    }
  });
});

// Asignar especialidad a un profesional
router.post("/asignarEspecialidad", (req, res) => {
  const { idProfesional, idEspecialidad } = req.body;
  medicoModel.asignarEspecialidad(
    idProfesional,
    idEspecialidad,
    (error, resultado) => {
      if (error) {
        console.error("Error al asignar especialidad:", error);
        return res.status(500).json({ error: "Error al asignar especialidad" });
      }
      res.status(200).json({
        message: "Especialidad asignada correctamente al profesional",
      });
    }
  );
});

// Ruta para obtener todas las especialidades
router.get("/gestion-especialidades/ver", (req, res) => {
  medicoModel.obtenerEspecialidades((error, especialidades) => {
    if (error) {
      console.error("Error al obtener las especialidades:", error);
      return res
        .status(500)
        .json({ error: "Error al obtener las especialidades" });
    }
    res.json(especialidades); // Enviar las especialidades en formato JSON
  });
});

// Agregar un nuevo profesional
router.post("/gestion-especialidades/agregar", (req, res) => {
  const { nombreEspecialidad } = req.body;
  medicoModel.agregarEspecialidad(
    nombreEspecialidad,
    (error, nuevaEspecialidadId) => {
      if (error) {
        console.error("Error al agregar especialidad:", error);
        return res.status(500).json({ error: "Error al agregar especialidad" });
      }
      res.status(201).json({
        message: "Especialidad agregada correctamente",
        id: nuevaEspecialidadId,
      });
    }
  );
});

// Filtrar médicos por especialidad
router.get("/filtrar/:especialidadId", (req, res) => {
  const { especialidadId } = req.params;
  medicoModel.filtrarMedicosPorEspecialidad(
    especialidadId,
    (error, medicos) => {
      if (error) {
        console.error("Error al filtrar médicos por especialidad:", error);
        return res.status(500).json({ error: "Error al filtrar médicos" });
      }
      res.json(medicos);
    }
  );
});

// Asignar especialidad a un médico
router.post("/asignar-especialidad", (req, res) => {
  const { medicoId, especialidadId } = req.body;
  medicoModel.asignarEspecialidadAMedico(
    medicoId,
    especialidadId,
    (error, result) => {
      if (error) {
        console.error("Error al asignar especialidad:", error);
        return res.status(500).json({ error: "Error al asignar especialidad" });
      }
      res.json({ message: "Especialidad asignada correctamente" });
    }
  );
});

module.exports = router;
