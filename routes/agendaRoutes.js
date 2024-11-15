// agendaRoutes.js
const express = require("express");
const router = express.Router();
const agendaModel = require("../models/agendaModel");

// Ruta de inicio para agenda
router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  const rolMap = { 1: "Administrador", 2: "Secretaria", 3: "Paciente" };
  const rolUsuario = rolMap[req.session.user.rol] || "Usuario";

  agendaModel.obtenerProfesionales((error, profesionales) => {
    if (error) {
      console.error("Error al obtener profesionales:", error);
      return res.status(500).send("Error al cargar los datos de profesionales");
    }

    agendaModel.obtenerSucursales((error, sucursales) => {
      if (error) {
        console.error("Error al obtener sucursales:", error);
        return res.status(500).send("Error al cargar los datos de sucursales");
      }

      res.render("agenda", {
        rolUsuario: rolUsuario,
        profesionales: profesionales,
        sucursales: sucursales,
      });
    });
  });
});

// Ruta para obtener todas las agendas
router.get("/ver", (req, res) => {
  agendaModel.obtenerAgendas((error, agendas) => {
    if (error) {
      console.error("Error al obtener las agendas:", error);
      return res.status(500).send("Error al cargar las agendas");
    }
    res.json(agendas);
  });
});

// Ruta para agregar una nueva agenda
router.post("/agregar", (req, res) => {
  const data = req.body;
  console.log(data);
  agendaModel.agregarAgenda(data, (error, result) => {
    if (error) {
      console.error("Error al agregar la agenda:", error);
      return res.status(500).send("Error al agregar la agenda");
    }
    res
      .status(200)
      .json({ message: "Agenda agregada exitosamente", id: result });
  });
});

// Ruta para obtener una agenda por ID para modificar
router.get("/modificar/:id", (req, res) => {
  const idAgenda = req.params.id;
  agendaModel.obtenerAgendaPorId(idAgenda, (error, agenda) => {
    if (error) {
      console.error("Error al obtener la agenda:", error);
      return res.status(500).send("Error al obtener la agenda");
    }
    res.json(agenda);
  });
});

// Ruta para modificar una agenda existente
router.put("/modificar/:id", (req, res) => {
  const idAgenda = req.params.id;
  const data = req.body;
  agendaModel.modificarAgenda(idAgenda, data, (error, result) => {
    if (error) {
      console.error("Error al modificar la agenda:", error);
      return res.status(500).send("Error al modificar la agenda");
    }
    res.status(200).json({ message: "Agenda modificada exitosamente" });
  });
});

// Ruta para eliminar una agenda
router.delete("/eliminar/:id", (req, res) => {
  const idAgenda = req.params.id;
  agendaModel.eliminarAgenda(idAgenda, (error, result) => {
    if (error) {
      console.error("Error al eliminar la agenda:", error);
      return res.status(500).send("Error al eliminar la agenda");
    }
    res.status(200).json({ message: "Agenda eliminada exitosamente" });
  });
});

// Ruta para asignar un profesional a una agenda
router.post("/asignarProfesional", (req, res) => {
  const { id_agenda, id_profesional } = req.body;
  agendaModel.asignarProfesional(id_agenda, id_profesional, (error, result) => {
    if (error) {
      console.error("Error al asignar profesional:", error);
      return res.status(500).send("Error al asignar profesional");
    }
    res.status(200).json({ message: "Profesional asignado a la agenda" });
  });
});

// Ruta para obtener la lista de profesionales
router.get("/profesionales", (req, res) => {
  agendaModel.obtenerProfesionales((error, profesionales) => {
    if (error) {
      console.error("Error al obtener los profesionales:", error);
      return res.status(500).send("Error al cargar los profesionales");
    }
    res.json(profesionales);
  });
});

// Ruta para obtener la lista de sucursales
router.get("/api", (req, res) => {
  agendaModel.obtenerSucursales((error, sucursales) => {
    if (error) {
      console.error("Error al obtener las sucursales:", error);
      return res.status(500).send("Error al cargar las sucursales");
    }
    res.json(sucursales);
  });
});

module.exports = router;
