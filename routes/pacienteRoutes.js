// pacienteRoutes.js
const express = require("express");
const router = express.Router();
const pacienteModel = require("../models/pacienteModel");

// Ruta de ejemplo para pacientes
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const documento = req.session.user.documento;

  pacienteModel.obtenerPacientePorDNI(documento, (error, paciente) => {
    if (error) {
      console.error("Error al obtener el paciente:", error);
      return res
        .status(500)
        .send("Error al cargar la información del paciente");
    }

    if (!paciente) {
      console.error("Paciente no encontrado para el documento:", documento);
      return res.status(404).send("Paciente no encontrado");
    }

    // Obtener el rol del usuario
    const rolMap = { 1: "Administrador", 2: "Secretaria", 3: "Paciente" };
    const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

    // Obtener la lista de profesionales y sucursales para el formulario de agendar turno
    pacienteModel.obtenerProfesionales((error, profesionales) => {
      if (error) {
        console.error("Error al obtener profesionales:", error);
        return res
          .status(500)
          .send("Error al cargar los datos de profesionales");
      }

      pacienteModel.obtenerSucursales((error, sucursales) => {
        if (error) {
          console.error("Error al obtener sucursales:", error);
          return res
            .status(500)
            .send("Error al cargar los datos de sucursales");
        }

        pacienteModel.obtenerTurnos(paciente.id_paciente, (error, turnos) => {
          if (error) {
            console.error("Error al obtener los turnos:", error);
            return res.status(500).send("Error al cargar los turnos");
          }

          // Renderizar la vista con todos los datos necesarios
          res.render("paciente", {
            nombreCompleto: paciente.nombre_completo,
            rolUsuario: rolUsuario,
            profesionales: profesionales,
            sucursales: sucursales,
            turnos: turnos,
          });
        });
      });
    });
  });
});

router.get("/:documento", (req, res) => {
  const documento = req.params.documento;

  pacienteModel.obtenerPacientePorDNI(documento, (error, paciente) => {
    if (error) {
      console.error("Error al obtener el paciente:", error);
      return res
        .status(500)
        .send("Error al cargar la información del paciente");
    }

    pacienteModel.obtenerUsuarioPorDocumento(documento, (error, usuario) => {
      if (error) {
        console.error("Error al obtener el usuario:", error);
        return res
          .status(500)
          .send("Error al cargar la información del usuario");
      }

      if (!paciente && !usuario) {
        return res.status(404).send("Paciente y usuario no encontrado");
      }

      const rolMap = { 1: "Administrador", 2: "Secretaria", 3: "Paciente" };
      const rolUsuario = usuario ? rolMap[usuario.rol] || "Usuario" : "Usuario";

      // Obtener profesionales y sucursales
      pacienteModel.obtenerProfesionales((error, profesionales) => {
        if (error) {
          console.error("Error al obtener profesionales:", error);
          return res
            .status(500)
            .send("Error al cargar los datos de profesionales");
        }

        pacienteModel.obtenerSucursales((error, sucursales) => {
          if (error) {
            console.error("Error al obtener sucursales:", error);
            return res
              .status(500)
              .send("Error al cargar los datos de sucursales");
          }

          // Obtener agendas disponibles
          pacienteModel.obtenerAgendasDisponibles((error, agendas) => {
            if (error) {
              console.error("Error al obtener las agendas:", error);
              return res.status(500).send("Error al cargar las agendas");
            }

            // Obtener turnos del paciente
            const idPaciente = paciente.id_paciente;

            pacienteModel.obtenerTurnos(idPaciente, (error, turnos) => {
              if (error) {
                console.error("Error al obtener los turnos:", error);
                return res.status(500).send("Error al cargar los turnos");
              }

              // Renderizar la vista con todos los datos necesarios
              res.render("paciente", {
                nombreCompleto: paciente.nombre_completo,
                rolUsuario: rolUsuario,
                profesionales: profesionales,
                sucursales: sucursales,
                agendas: agendas,
                turnos: turnos,
              });
            });
          });
        });
      });
    });
  });
});

router.post("/registrar-paciente", (req, res) => {
  const datosPaciente = req.body;
  pacienteModel.registrarPaciente(datosPaciente, (error, results) => {
    if (error) {
      return res.status(500).send("Error al registrar el paciente");
    }
    return res.status(200).send("Paciente registrado con éxito");
  });
});

router.get("/obtener-pacientes", (req, res) => {
  pacienteModel.obtenerPacientes((error, results) => {
    if (error) {
      return res.status(500).send("Error al obtener los pacientes");
    }
    return res.status(200).json(results);
  });
});

router.post("/pedirr-turno/:dni", (req, res) => {
  const { dni } = req.params;
  const { id_agenda, fecha_turno, hora_turno } = req.body;

  // Usar callback para obtener el id_paciente
  pacienteModel.obtenerPacientePorDNI(dni, (error, paciente) => {
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
    pacienteModel.agendarTurno(
      { id_agenda, id_paciente, fecha_turno, hora_turno },
      (error, results) => {
        if (error) {
          console.error("Error al pedir el turno:", error);
          return res.status(500).send("Error al pedir el turno");
        }
        alert("Turno agendado con exito!");
        res.redirect("/pacientes");
      }
    );
  });
});

router.get("/pedir-turno", (req, res) => {
  pacienteModel.obtenerAgendasDisponibles((error, agendas) => {
    if (error) {
      console.error("Error al obtener las agendas:", error);
      return res.status(500).send("Error al obtener las agendas");
    }
    res.render("paciente", { agendas: agendas || [] });
  });
});

router.get("/ver-turnos", (req, res) => {
  const id_paciente = req.session.user.id_usuario;

  pacienteModel.obtenerTurnos(id_paciente, (error, turnos) => {
    if (error) {
      console.error("Error al obtener los turnos:", error);
      return res.status(500).send("Error al cargar los turnos");
    }
    res.render("paciente", { turnos });
  });
});

module.exports = router;
