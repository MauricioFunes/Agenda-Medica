const express = require("express");
const path = require("path");
const pug = require("pug");
const mysql = require("mysql2");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();

//EXPRESS SETTINGS
app.set("appName", "Consultorio de Agenda Medica");
app.set("port", 3000);
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "./views"));
app.locals.basedir = "./views";

// Configurar cookie-parser y sesiones
app.use(cookieParser());
app.use(
  session({
    secret: "1234",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // Duración de la cookie de sesión (24 horas)
      secure: false, // Cambiar a true si usas HTTPS
      httpOnly: true,
    },
  })
);

//MIDDLEWARES
app.use(express.json()); // Para parsear el JSON de las solicitudes POST
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

app.use((req, res, next) => {
  res.locals.userLoggedIn = req.session.user ? true : false;
  res.locals.user = req.session.user || null; // `user` estará disponible en `res.locals` en todas las vistas
  next();
});

function requireAuth(req, res, next) {
  if (req.session.user) {
    return next();
  }
  res.redirect("/login");
}

app.get("/pacientes", requireAuth, (req, res) => {
  res.render("paciente", { user: req.session.user }); // Pasa la información del usuario a la vista
});

// Configuración de MySQL (conexión a la base de datos)
const db = mysql.createConnection({
  port: 3306,
  host: "localhost",
  user: "root",
  password: "",
  database: "bdconsultamedica2024",
});

// CONEXION A BASE DE DATOS
db.connect((err) => {
  if (err) {
    console.log("Error conectando a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

// Exportar la conexión
module.exports = { app, db };

// RUTAS
// Ruta principal que renderiza la vista

app.get("/", (req, res) => {
  if (req.session.user) {
    const rolMap = { 1: "administrador", 2: "secretaria", 3: "paciente" };
    const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

    res.render("index", {
      rolUsuario: rolUsuario,
    });
  } else {
    res.render("index");
  }
});

app.get("/contacto", (req, res) => {
  if (req.session.user) {
    const rolMap = { 1: "administrador", 2: "secretaria", 3: "paciente" };
    const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

    res.render("contacto", {
      rolUsuario: rolUsuario,
    });
  } else {
    res.render("contacto");
  }
});

// Definir rutas
const pacienteRoutes = require("./routes/pacienteRoutes"); // Listo
const login = require("./routes/loginRoutes"); // Listo
const usuarioRoutes = require("./routes/usuarioRoutes"); // Listo
const medicoRoutes = require("./routes/medicoRoutes"); // Listo
const sucursalRoutes = require("./routes/sucursalRoutes"); // Falta probar modificar y eliminar
const agendaRoutes = require("./routes/agendaRoutes"); // Falta probar modificar y eliminar
const secretariaRoutes = require("./routes/secretariaRoutes");

// Usar las rutas definidas
app.use("/pacientes", pacienteRoutes);
app.use("/login", login);
app.use("/gestion-usuarios", usuarioRoutes);
app.use("/gestion-profesionales", medicoRoutes);
app.use("/sucursal", sucursalRoutes);
app.use("/agenda", agendaRoutes);
app.use("/secretaria", secretariaRoutes);

///////////////////////////////// ESTATICOS

app.use(express.static(path.join(__dirname, "public")));
//app.use('/public', express.static('./public'))

app.listen(app.get("port"), () => {
  console.log(`Servidor corriendo en http://localhost:${app.get("port")}`);
});

/* 
1. Pantalla de Inicio / Login:
Tres secciones o botones principales: "Paciente", "Secretaria", "Administrador".
Al elegir uno de estos roles, se accede a su panel correspondiente.

2. Panel del Paciente:
Botón "Agendar Cita": Para que el paciente seleccione la fecha y el médico.
Botón "Ver Citas Programadas": Muestra las citas ya registradas.
Botón "Actualizar Información": Permite modificar sus datos personales.
Botón "Cancelar Cita": Para eliminar una cita si lo necesita.

3. Panel de la Secretaria:
Botón "Registrar Paciente": Para añadir nuevos pacientes al sistema.
Botón "Agendar Cita para Paciente": Para ayudar a los pacientes a programar citas.
Botón "Consultar Citas del Día": Para revisar la lista de citas de la jornada.
Botón "Gestionar Pacientes": Para ver, editar o eliminar información de los pacientes.
Botón "Cancelar Cita": Facilita la cancelación de citas.

4. Panel del Administrador:
Botón "Gestionar Usuarios": Para añadir o eliminar secretarias, médicos, etc.
Botón "Consultar Estadísticas": Para generar reportes sobre citas, médicos o pacientes.
Botón "Administrar Agendas": Para gestionar la disponibilidad de médicos.
Botón "Auditoría": Para revisar el historial de cambios en el sistema. 
*/
