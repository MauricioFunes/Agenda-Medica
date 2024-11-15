const { db } = require("../app");

class secretariaModel {
  // Obtener un paciente por DNI
  static obtenerPacientePorDNI(documento, callback) {
    const query =
      "SELECT id_paciente, nombre_completo FROM pacientes WHERE dni = ?";
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

  // Modificar un Profesional
  static modificarPaciente = (
    id_paciente,
    nombre_completo,
    telefono,
    callback
  ) => {
    const query =
      "UPDATE pacientes SET nombre_completo = ?, telefono = ? WHERE id_paciente = ?";
    db.query(
      query,
      [nombre_completo, telefono, id_paciente],
      (error, result) => {
        if (error) {
          console.error("Error al modificar el paciente:", error);
          return callback(error);
        }
        return callback(null, result.affectedRows); // Devolver el número de filas afectadas
      }
    );
  };

  // Eliminar un profesional
  static eliminarPaciente = (id_paciente, callback) => {
    const query = "DELETE FROM pacientes WHERE id_paciente = ?";
    db.query(query, [id_paciente], (error, result) => {
      if (error) {
        console.error("Error al eliminar el paciente:", error);
        return callback(error);
      }
      return callback(null, result.affectedRows); // Devolver el número de filas afectadas
    });
  };

  // Cancelar un turno
  static cancelarTurno = (id_paciente, fecha, callback) => {
    const query = `
      UPDATE turnos 
      SET estado_turno = 'cancelado' 
      WHERE id_paciente = ? AND DATE(fecha_hora_inicio) = ?
    `;

    db.query(query, [id_paciente, fecha], (error, result) => {
      if (error) {
        console.error("Error al cancelar el turno:", error);
        return callback(error);
      }
      callback(null, result);
    });
  };
}

module.exports = secretariaModel;
