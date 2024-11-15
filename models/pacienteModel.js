const { db } = require("../app");

class pacienteModel {
  // Función para registrar un nuevo paciente
  static registrarPaciente = (datosPaciente, callback) => {
    const {
      nombre_completo,
      dni,
      motivo_consulta,
      obra_social,
      telefono,
      email,
      direccion,
    } = datosPaciente;
    const query = `INSERT INTO pacientes (nombre_completo, dni, motivo_consulta, obra_social, telefono, email, direccion)
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.query(
      query,
      [
        nombre_completo,
        dni,
        motivo_consulta,
        obra_social,
        telefono,
        email,
        direccion,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al registrar el paciente:", error);
          return callback(error);
        }
        console.log("Paciente registrado con éxito:", results);
        return callback(null, results);
      }
    );
  };

  // Obtener todos los pacientes
  static obtenerPacientes = (callback) => {
    const query = "SELECT * FROM pacientes";

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los pacientes:", error);
        return callback(error);
      }
      return callback(null, results);
    });
  };

  // Obtener un paciente por DNI
  static obtenerPacientePorDNI(documento, callback) {
    const query = "SELECT id_paciente, nombre_completo FROM pacientes WHERE dni = ?";
    db.query(query, [documento], (error, results) => {
      if (error) {
        console.error("Error al obtener paciente:", error);
        return callback(error, null);
      }
      if (results.length > 0) {
        callback(null, results[0]);
      } else {
        callback(null, null);
      }
    });
  }

  // Obtener un usuario por documento
  static obtenerUsuarioPorDocumento(documento, callback) {
    const query = "SELECT documento, rol FROM usuarios WHERE documento = ?";
    db.query(query, [documento], (error, results) => {
      if (error) {
        console.error("Error al obtener usuario:", error);
        return callback(error, null);
      }
      if (results.length > 0) {
        callback(null, results[0]);
      } else {
        callback(null, null);
      }
    });
  }

  // Función para agendar un turno
  static agendarTurno(
    { id_agenda, id_paciente, fecha_turno, hora_turno },
    callback
  ) {
    const fechaHoraInicio = `${fecha_turno} ${hora_turno}:00`;
    const query = `INSERT INTO turnos (id_agenda, id_paciente, fecha_hora_inicio, estado_turno)
                 VALUES (?, ?, ?, 'reservada')`;

    db.query(
      query,
      [id_agenda, id_paciente, fechaHoraInicio],
      (error, results) => {
        if (error) {
          console.error("Error al agendar el turno:", error);
          return callback(error, null);
        }
        callback(null, results);
      }
    );
  }

  // Función para obtener agendas disponibles
  static obtenerAgendasDisponibles(callback) {
    const query = `
    SELECT a.id_agenda, a.fecha_inicio, a.fecha_fin, p.id_profesional, p.nombre_completo AS nombre_profesional, s.id_sucursal, s.nombre_sucursal
    FROM agendas a
    JOIN profesionales p ON a.id_profesional = p.id_profesional
    JOIN sucursales s ON a.id_sucursal = s.id_sucursal
    WHERE a.disponibilidad = 'disponible'
  `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener agendas disponibles:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }

  // Función para verificar o crear la agenda
  static obtenerOcrearAgenda(
    id_profesional,
    id_sucursal,
    fecha_turno,
    callback
  ) {
    const query = `SELECT id_agenda FROM agendas WHERE id_profesional = ? AND id_sucursal = ? 
                 AND fecha_inicio <= ? AND fecha_fin >= ? AND motivoDisponibilidad = 'disponible'`;

    db.query(
      query,
      [id_profesional, id_sucursal, fecha_turno, fecha_turno],
      (error, results) => {
        if (error) {
          console.error("Error al verificar la agenda:", error);
          return callback(error, null);
        }

        if (results.length > 0) {
          // Si existe una agenda, devolver el id_agenda
          return callback(null, results[0].id_agenda);
        } else {
          // Si no existe, crear una nueva agenda
          const nuevaAgendaQuery = `INSERT INTO agendas (clasificacion, disponibilidad, motivoDisponibilidad, 
                                fecha_inicio, fecha_fin, id_profesional, id_sucursal)
                                VALUES ('normal', 'disponible', 'disponible', ?, ?, ?, ?)`;

          db.query(
            nuevaAgendaQuery,
            [fecha_turno, fecha_turno, id_profesional, id_sucursal],
            (error, nuevaAgendaResults) => {
              if (error) {
                console.error("Error al crear la agenda:", error);
                return callback(error, null);
              }
              // Retornar el nuevo id_agenda
              callback(null, nuevaAgendaResults.insertId);
            }
          );
        }
      }
    );
  }

  // Función para obtener turnos de un paciente
  static obtenerTurnos(id_paciente, callback) {
    const query = `
    SELECT t.fecha_hora_inicio AS fecha, 
           p.nombre_completo AS profesional, 
           t.estado_turno
      FROM turnos t
      JOIN agendas a ON t.id_agenda = a.id_agenda
      JOIN profesionales p ON a.id_profesional = p.id_profesional
     WHERE t.id_paciente = ?
     ORDER BY t.fecha_hora_inicio`;

    db.query(query, [id_paciente], (error, results) => {
      if (error) {
        console.error("Error al obtener los turnos del paciente:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }

  // Función para obtener todos los profesionales
  static obtenerProfesionales(callback) {
    const query = "SELECT * FROM profesionales";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener profesionales:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }

  // Función para obtener todas las sucursales
  static obtenerSucursales(callback) {
    const query = "SELECT * FROM sucursales";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener sucursales:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }
}

module.exports = pacienteModel;
