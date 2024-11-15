const { db } = require("../app");

class LoginModel {
  // Obtener todos los usuarios
  static obtenerUsuarios(callback) {
    const query = "SELECT * FROM usuarios";
    db.query(query, (error, results) => {
      if (error) {
        console.error("Error al obtener los usuarios:", error);
        return callback(error);
      }
      return callback(null, results);
    });
  }

  static obtenerUsuarioPorDocumento(documento, callback) {
    const query = "SELECT * FROM usuarios WHERE documento = ?";
    db.query(query, [documento], (error, results) => {
      if (error) {
        console.error("Error en la consulta a la base de datos:", error);
        return callback(error);
      }
      console.log("Resultado de la query:", results[0]);
      if (results.length === 0) {
        // No se encontró usuario con el documento dado
        return callback(null, null);
      }
      // Retornar el primer usuario encontrado
      return callback(null, results[0]);
    });
  }

  // Validar credenciales del usuario
  static validateUser(documento, password) {
    const query = `SELECT * FROM usuarios WHERE documento = ?`;

    return new Promise((resolve, reject) => {
      db.query(query, [documento], (error, results) => {
        if (error) {
          console.error("Error al validar usuario:", error);
          return reject(error);
        }
        if (results.length > 0) {
          const user = results[0];
          if (user.password === password) {
            return resolve({
              id_usuario: user.id_usuario,
              documento: user.documento,
              rol: user.rol,
            });
          }
        }
        return resolve(null);
      });
    });
  }

  // Función para registrar un nuevo usuario y su paciente asociado
  static registrarUsuario(usuarioData, pacienteData, callback) {
    // Inserto al usuario en la tabla 'usuarios'
    const queryUsuario = `
      INSERT INTO usuarios (documento, password, rol) 
      VALUES (?, ?, 3)`;
    db.query(
      queryUsuario,
      [usuarioData.documento, usuarioData.password],
      (error, results) => {
        if (error) {
          console.error("Error al insertar usuario:", error);
          return callback(error);
        }
        // obtengo el id del usuario insertado
        const userId = results.insertId;
        // inserto los datos en la tabla 'pacientes'
        const queryPaciente = `
        INSERT INTO pacientes (nombre_completo, obra_social, telefono, dni, email, direccion) 
        VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(
          queryPaciente,
          [
            pacienteData.nombreCompleto,
            pacienteData.obra_social,
            pacienteData.telefono,
            pacienteData.documento,
            pacienteData.email,
            pacienteData.direccion,
          ],
          (error, results) => {
            if (error) {
              console.error("Error al insertar paciente:", error);
              return callback(error);
            }
            // Si todo fue exitoso, retornamos el id del nuevo usuario
            return callback(null, {
              userId,
              message: "Usuario registrado exitosamente",
            });
          }
        );
      }
    );
  }

  static verificarDocumentoExistente(documento) {
    return new Promise((resolve, reject) => {
      const query = `SELECT documento FROM usuarios WHERE documento = ? LIMIT 1`;
      db.query(query, [documento], (error, results) => {
        if (error) return reject(error);
        resolve(results.length > 0);
      });
    });
  }
}

module.exports = LoginModel;
