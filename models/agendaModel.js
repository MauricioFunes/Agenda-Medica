const { db } = require("../app");

class agendaModel {
  // Método para agregar una nueva agenda
  static agregarAgenda(data, callback) {
    const {
      id_profesional,
      id_sucursal,
      clasificacion,
      disponibilidad,
      motivoDisponibilidad,
      fecha_inicio,
      fecha_fin,
    } = data;
    const query =
      "INSERT INTO agendas (id_profesional, id_sucursal, clasificacion, disponibilidad, motivoDisponibilidad, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?, ?, ?, ?)";

    db.query(
      query,
      [
        id_profesional,
        id_sucursal,
        clasificacion,
        disponibilidad,
        motivoDisponibilidad,
        fecha_inicio,
        fecha_fin,
      ],
      (error, results) => {
        if (error) {
          console.error("Error al agregar la agenda:", error);
          return callback(error, null);
        }
        callback(null, results);
      }
    );
  }

  // Método para obtener una agenda por ID
  static obtenerAgendaPorId(idAgenda, callback) {
    const query = "SELECT * FROM agendas WHERE id_agenda = ?";

    db.query(query, [idAgenda], (error, results) => {
      if (error) {
        console.error("Error al obtener la agenda:", error);
        return callback(error, null);
      }
      if (results.length > 0) {
        callback(null, results[0]);
      } else {
        callback(null, null);
      }
    });
  }

  // Método para modificar una agenda existente
  static modificarAgenda(idAgenda, data, callback) {
    const { fecha, id_profesional, id_sucursal } = data;
    const query =
      "UPDATE agendas SET fecha = ?, id_profesional = ?, id_sucursal = ? WHERE id_agenda = ?";

    db.query(
      query,
      [fecha, id_profesional, id_sucursal, idAgenda],
      (error, results) => {
        if (error) {
          console.error("Error al modificar la agenda:", error);
          return callback(error, null);
        }
        callback(null, results);
      }
    );
  }

  // Método para eliminar una agenda
  static eliminarAgenda(idAgenda, callback) {
    const query = "DELETE FROM agendas WHERE id_agenda = ?";

    db.query(query, [idAgenda], (error, results) => {
      if (error) {
        console.error("Error al eliminar la agenda:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }

  // Método para asignar un profesional a una agenda
  static asignarProfesional(id_agenda, id_profesional, callback) {
    const query = "UPDATE agendas SET id_profesional = ? WHERE id_agenda = ?";

    db.query(query, [id_profesional, id_agenda], (error, results) => {
      if (error) {
        console.error("Error al asignar profesional a la agenda:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }

  // Otros métodos existentes
  static obtenerPacientePorDNI(documento, callback) {
    const query = "SELECT nombre_completo FROM pacientes WHERE dni = ?";
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

  static obtenerAgendas(callback) {
    const query = `
      SELECT a.id_agenda, a.fecha_inicio, a.fecha_fin, a.clasificacion, a.disponibilidad, p.id_profesional, p.nombre_completo, s.id_sucursal, s.nombre_sucursal, s.direccion
      FROM agendas a
      JOIN profesionales p ON a.id_profesional = p.id_profesional
      JOIN sucursales s ON a.id_sucursal = s.id_sucursal
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener agendas:", error);
        return callback(error, null);
      }
      callback(null, results);
    });
  }
}

module.exports = agendaModel;
