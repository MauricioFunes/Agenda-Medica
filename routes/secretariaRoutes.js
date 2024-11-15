// secretariaRoutes.js
const express = require("express");
const router = express.Router();
const secretariaModel = require("../models/secretariaModel");

// Ruta de ejemplo para pacientes
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  // Obtener el rol del usuario
  const rolMap = { 1: "Administrador", 2: "Secretaria", 3: "Paciente" };
  const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

  // Renderizar la vista con todos los datos necesarios
  res.render("secretaria", {
    rolUsuario: rolUsuario,
  });
});

router.post("/agregarPaciente", (req, res) => {
  const datosPaciente = req.body;
  secretariaModel.registrarPaciente(datosPaciente, (error, results) => {
    if (error) {
      return res.status(500).send("Error al registrar el paciente");
    }
    return res.status(200).send("Paciente registrado con éxito");
  });
});

router.post("/AgendarTurno", (req, res) => {
  const { dni, fecha_turno, hora_turno, id_agenda } = req.body;

  // Usar callback para obtener el id_paciente
  secretariaModel.obtenerPacientePorDNI(dni, (error, paciente) => {
    if (error) {
      console.error("Error al obtener el paciente:", error);
      return res
        .status(500)
        .send("Error al cargar la información del paciente");
    }

    if (!paciente) {
      return res.status(404).send("Paciente no encontrado");
    }
    const id_paciente = paciente.id_paciente;
    // Ahora, con el id_paciente, agendar el turno
    secretariaModel.agendarTurno(
      { id_agenda, id_paciente, fecha_turno, hora_turno },
      (error, results) => {
        if (error) {
          console.error("Error al pedir el turno:", error);
          return res.status(500).send("Error al pedir el turno");
        }
        alert("Turno agendado con exito!");
        res.redirect("/secretaria");
      }
    );
  });
});

router.get("/verPacientes", (req, res) => {
  secretariaModel.obtenerPacientes((error, results) => {
    if (error) {
      return res.status(500).send("Error al obtener los pacientes");
    }
    return res.status(200).json(results);
  });
});

// Modificar un profesional (actualizado para recibir más campos)
router.put("/modificar/:dni", (req, res) => {
  const { dni } = req.params;
  const { nombre_completo, telefono } = req.body;

  // callback para obtener el id_paciente
  secretariaModel.obtenerPacientePorDNI(dni, (error, paciente) => {
    if (error) {
      console.error("Error al obtener el paciente:", error);
      return res
        .status(500)
        .send("Error al cargar la información del paciente");
    }

    secretariaModel.modificarPaciente(
      paciente.id_paciente,
      nombre_completo,
      telefono,
      (error, cambios) => {
        if (error) {
          console.error("Error al modificar paciente:", error);
          return res.status(500).json({ error: "Error al modificar paciente" });
        }
        if (cambios > 0) {
          res.json({ message: "Paciente modificado correctamente" });
        } else {
          res.status(404).json({ error: "Paciente no encontrado" });
        }
      }
    );
  });
});

// Eliminar un profesional
router.delete("/eliminar/:dni", (req, res) => {
  const { dni } = req.params;

  // Usar callback para obtener el id_paciente
  secretariaModel.obtenerPacientePorDNI(dni, (error, paciente) => {
    if (error) {
      console.error("Error al obtener el paciente:", error);
      return res
        .status(500)
        .send("Error al cargar la información del paciente");
    }

    secretariaModel.eliminarPaciente(
      paciente.id_paciente,
      (error, eliminados) => {
        if (error) {
          console.error("Error al eliminar paciente:", error);
          return res.status(500).json({ error: "Error al eliminar paciente" });
        }
        if (eliminados > 0) {
          res.json({ message: "Paciente eliminado correctamente" });
        } else {
          res.status(404).json({ error: "Paciente no encontrado" });
        }
      }
    );
  });
});

router.post("/cancelarTurno", (req, res) => {
  const { dni, fecha } = req.body;

  // Primero, obtenemos el id del paciente por su DNI
  secretariaModel.obtenerPacientePorDNI(dni, (error, paciente) => {
    if (error) {
      console.error("Error al obtener el paciente:", error);
      return res.status(500).json({ message: "Error al obtener el paciente" });
    }

    if (!paciente) {
      return res.status(404).json({ message: "Paciente no encontrado" });
    }

    // Luego, cancelamos el turno del paciente usando su id y la fecha del turno
    secretariaModel.cancelarTurno(
      paciente.id_paciente,
      fecha,
      (error, result) => {
        if (error) {
          console.error("Error al cancelar el turno:", error);
          return res
            .status(500)
            .json({ message: "Error al cancelar el turno" });
        }

        if (result.affectedRows > 0) {
          res.json({ message: "Turno cancelado exitosamente" });
        } else {
          res.status(404).json({ message: "Turno no encontrado" });
        }
      }
    );
  });
});

module.exports = router;
