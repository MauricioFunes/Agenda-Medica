const { db } = require("../app");

class sucursalModel {
  static verSucursales = (callback) => {
    const query = "SELECT * FROM sucursales";

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los sucursales:", error);
        return callback(error);
      }
      return callback(null, results);
    });
  };

  // Agregar una sucursal
  static agregarSucursal(nombre_sucursal, direccion, telefono, callback) {
    const query =
      "INSERT INTO sucursales (nombre_sucursal, direccion, telefono) VALUES (?, ?, ?)";
    db.query(
      query,
      [nombre_sucursal, direccion, telefono],
      (error, results) => {
        if (error) return callback(error);
        callback(null, results.insertId);
      }
    );
  }

  // Modificar una sucursal
  static modificarSucursal(id, nombre_sucursal, direccion, telefono, callback) {
    const query =
      "UPDATE sucursales SET nombre_sucursal = ?, direccion = ?, telefono = ? WHERE id_sucursal = ?";
    db.query(
      query,
      [nombre_sucursal, direccion, telefono, id],
      (error, results) => {
        if (error) return callback(error);
        callback(null, results.affectedRows);
      }
    );
  }

  // Eliminar una sucursal
  static eliminarSucursal(id, callback) {
    const query = "DELETE FROM sucursales WHERE id_sucursal = ?";
    db.query(query, [id], (error, results) => {
      if (error) return callback(error);
      callback(null, results.affectedRows);
    });
  }
}

module.exports = sucursalModel;
