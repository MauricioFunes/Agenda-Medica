const { db } = require("../app");

class medicoModel {
  static obtenerTodosLosProfesionales = (callback) => {
    const query = "SELECT * FROM profesionales";

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los profesionales:", error);
        return callback(error);
      }
      return callback(null, results);
    });
  };

  // Agregar un nuevo profesional
  static agregarProfesional = (
    nombre_completo,
    dni,
    telefono,
    email,
    direccion,
    callback
  ) => {
    const query =
      "INSERT INTO profesionales (nombre_completo, dni, telefono, email, direccion) VALUES (?, ?, ?, ?, ?)";
    db.query(
      query,
      [nombre_completo, dni, telefono, email, direccion],
      (error, result) => {
        if (error) {
          console.error("Error al agregar el profesional:", error);
          return callback(error);
        }
        return callback(null, result.insertId); // Devolver el ID insertado
      }
    );
  };

  // Modificar un Profesional
  static modificarProfesional = (
    id_profesional,
    nombre_completo,
    dni,
    telefono,
    email,
    direccion,
    callback
  ) => {
    const query =
      "UPDATE profesionales SET nombre_completo = ?, dni = ?, telefono = ?, email = ?, direccion = ? WHERE id_profesional = ?";
    db.query(
      query,
      [nombre_completo, dni, telefono, email, direccion, id_profesional],
      (error, result) => {
        if (error) {
          console.error("Error al modificar el profesional:", error);
          return callback(error);
        }
        return callback(null, result.affectedRows); // Devolver el número de filas afectadas
      }
    );
  };

  // Eliminar un profesional
  static eliminarProfesional = (id_profesional, callback) => {
    const query = "DELETE FROM profesionales WHERE id_profesional = ?";
    db.query(query, [id_profesional], (error, result) => {
      if (error) {
        console.error("Error al eliminar el profesional:", error);
        return callback(error);
      }
      return callback(null, result.affectedRows); // Devolver el número de filas afectadas
    });
  };

  static obtenerEspecialidades = (callback) => {
    const query = "SELECT * FROM especialidad";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener las especialidades:", error);
        return callback(error);
      }
      return callback(null, results); // Retorna los resultados de especialidades
    });
  };

  // Asignar especialidad a un profesional
  static asignarEspecialidad = (idProfesional, idEspecialidad, callback) => {
    const query =
      "INSERT INTO profesional_especialidad (id_profesional, id_especialidad) VALUES (?, ?)";
    db.query(query, [idProfesional, idEspecialidad], (error, result) => {
      if (error) {
        console.error("Error al asignar especialidad:", error);
        return callback(error);
      }
      return callback(null, result); // Devolver el resultado si la operación fue exitosa
    });
  };

  static agregarEspecialidad = (nombreEspecialidad, callback) => {
    const query = "INSERT INTO especialidad (nombre_especialidad) VALUES (?)";
    db.query(query, [nombreEspecialidad], (error, result) => {
      if (error) {
        console.error("Error al agregar especialidad:", error);
        return callback(error);
      }
      return callback(null, result.insertId); // Devolver el ID insertado
    });
  };

  // Obtener todos los profesionales, incluyendo aquellos sin especialidades
  static obtenerProfesionalesConEspecialidades = (callback) => {
    const query = `
      SELECT p.id_profesional, p.nombre_completo, p.dni, p.telefono, p.email, p.direccion,
             e.id_especialidad, e.nombre_especialidad
      FROM profesionales p
      LEFT JOIN profesional_especialidad pe ON p.id_profesional = pe.id_profesional
      LEFT JOIN especialidad e ON pe.id_especialidad = e.id_especialidad
    `;

    db.query(query, (error, results) => {
      if (error) {
        console.error(
          "Error al obtener profesionales con especialidades:",
          error
        );
        return callback(error);
      }
      return callback(null, results);
    });
  };

  // Filtrar médicos por especialidad
  static filtrarMedicosPorEspecialidad(especialidadId, callback) {
    const query = `
      SELECT profesionales.*, especialidad.nombre_especialidad 
      FROM profesionales 
      JOIN profesional_especialidad ON profesionales.id_profesional = profesional_especialidad.id_profesional 
      JOIN especialidad ON profesional_especialidad.id_especialidad = especialidad.id_especialidad
      WHERE especialidad.id_especialidad = ?;
    `;
    db.query(query, [especialidadId], (error, results) => {
      if (error) {
        console.error("Error al filtrar médicos por especialidad:", error);
        return callback(error);
      }
      callback(null, results);
    });
  }

  // Asignar especialidad a un médico
  static asignarEspecialidadAMedico(medicoId, especialidadId, callback) {
    const query = `
      INSERT INTO profesional_especialidad (id_profesional, id_especialidad) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE id_especialidad = VALUES(id_especialidad);
    `;
    db.query(query, [medicoId, especialidadId], (error, result) => {
      if (error) {
        console.error("Error al asignar especialidad:", error);
        return callback(error);
      }
      callback(null, result);
    });
  }
}

module.exports = medicoModel;
