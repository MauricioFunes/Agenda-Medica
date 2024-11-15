const { db } = require("../app");

class usuarioModel {
  static obtenerTodosLosUsuarios = (callback) => {
    const query = "SELECT * FROM usuarios";

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los usuarios:", error);
        return callback(error);
      }
      return callback(null, results);
    });
  };

  // Agregar un nuevo usuario
  static agregarUsuario = (documento, password, rol, callback) => {
    const query =
      "INSERT INTO usuarios (documento, password, rol) VALUES (?, ?, ?)";
    db.query(query, [documento, password, rol], (error, result) => {
      if (error) {
        console.error("Error al agregar el usuario:", error);
        return callback(error);
      }
      return callback(null, result.insertId); // Devolver el ID insertado
    });
  };

  // Modificar un usuario
  static modificarUsuario = (id_usuario, documento, rol, callback) => {
    const query =
      "UPDATE usuarios SET documento = ?, rol = ? WHERE id_usuario = ?";
    db.query(query, [documento, rol, id_usuario], (error, result) => {
      if (error) {
        console.error("Error al modificar el usuario:", error);
        return callback(error);
      }
      return callback(null, result.affectedRows); // Devolver el número de filas afectadas
    });
  };

  // Eliminar un usuario
  static eliminarUsuario = (id_usuario, callback) => {
    const query = "DELETE FROM usuarios WHERE id_usuario = ?";
    db.query(query, [id_usuario], (error, result) => {
      if (error) {
        console.error("Error al eliminar el usuario:", error);
        return callback(error);
      }
      return callback(null, result.affectedRows); // Devolver el número de filas afectadas
    });
  };
}

module.exports = usuarioModel;
