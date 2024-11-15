-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-11-2024 a las 02:05:29
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bdconsultamedica2024`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `agendas`
--

CREATE TABLE `agendas` (
  `id_agenda` int(11) NOT NULL,
  `clasificacion` varchar(30) NOT NULL COMMENT '(normal, especial, VIP, etc.)',
  `disponibilidad` tinyint(1) NOT NULL,
  `motivoDisponibilidad` varchar(60) NOT NULL COMMENT 'Bloqueada por vacaciones o por horario y si esta disponible',
  `fecha_inicio` date NOT NULL COMMENT 'formato 9999-12-31',
  `fecha_fin` date NOT NULL COMMENT 'formato 9999-12-31',
  `id_profesional` int(11) NOT NULL,
  `id_sucursal` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `agendas`
--

INSERT INTO `agendas` (`id_agenda`, `clasificacion`, `disponibilidad`, `motivoDisponibilidad`, `fecha_inicio`, `fecha_fin`, `id_profesional`, `id_sucursal`) VALUES
(1, 'normal', 0, 'disponible', '2024-11-15', '2024-11-15', 1, 1),
(2, 'vip', 0, '', '2024-11-16', '2024-11-28', 3, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `diasnolaborables`
--

CREATE TABLE `diasnolaborables` (
  `id_dia` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `Motivo` varchar(50) NOT NULL COMMENT '(feriado, evento especial, etc.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `diasnolaborables`
--

INSERT INTO `diasnolaborables` (`id_dia`, `fecha`, `Motivo`) VALUES
(1, '2024-11-18', 'Día de la Soberanía Nacional'),
(2, '2024-12-08', 'Concepción de la Virgen María'),
(3, '2024-12-25', 'Navidad'),
(4, '2024-12-31', 'Año nuevo'),
(5, '2025-03-03', 'Carnaval');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `especialidad`
--

CREATE TABLE `especialidad` (
  `id_especialidad` int(11) NOT NULL,
  `nombre_especialidad` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `especialidad`
--

INSERT INTO `especialidad` (`id_especialidad`, `nombre_especialidad`) VALUES
(1, 'Ciruja'),
(2, 'Neurocirujano'),
(3, 'Kinesiologo'),
(4, 'Intensivo'),
(5, 'Cardiologia'),
(6, 'Dermatologia'),
(7, 'Clinica general');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario_bloqueado`
--

CREATE TABLE `horario_bloqueado` (
  `id_bloqueo` int(11) NOT NULL,
  `id_agenda` int(11) NOT NULL,
  `fecha_bloqueada` date NOT NULL,
  `motivo_bloqueo` int(11) NOT NULL COMMENT '(vacaciones, ausencia, etc.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `horario_bloqueado`
--

INSERT INTO `horario_bloqueado` (`id_bloqueo`, `id_agenda`, `fecha_bloqueada`, `motivo_bloqueo`) VALUES
(1, 1, '2024-12-06', 0),
(2, 1, '2024-12-07', 0),
(3, 1, '2024-12-08', 0),
(4, 1, '2024-12-25', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista de espera`
--

CREATE TABLE `lista de espera` (
  `id_espera` int(11) NOT NULL,
  `id_agenda` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `fecha_registro` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `lista de espera`
--

INSERT INTO `lista de espera` (`id_espera`, `id_agenda`, `id_paciente`, `fecha_registro`) VALUES
(1, 1, 7, '2023-09-14'),
(2, 1, 7, '2023-06-03'),
(3, 1, 6, '2024-06-06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pacientes`
--

CREATE TABLE `pacientes` (
  `id_paciente` int(11) NOT NULL,
  `nombre_completo` varchar(50) NOT NULL,
  `dni` varchar(15) NOT NULL,
  `obra_social` varchar(20) DEFAULT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `direccion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pacientes`
--

INSERT INTO `pacientes` (`id_paciente`, `nombre_completo`, `dni`, `obra_social`, `telefono`, `email`, `direccion`) VALUES
(3, 'Juan Perez', '342', 'dosepe', '234234', 'mail@gmasil.com', 'laguna azul'),
(5, 'Fernando Saez', '2347927', 'Dosep', '4734829', 'direccion@mail.com', 'Avenida Patitos felices'),
(6, 'Adrian Suarez', '134527', 'Dospu', '421829', 'dirn@mail.com', 'Barrio la republica'),
(7, 'Leonel Messi', '2830', 'Chelsea', '345376', 'eld10s@mail.com', 'Rosario al 991');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesionales`
--

CREATE TABLE `profesionales` (
  `id_profesional` int(11) NOT NULL,
  `nombre_completo` varchar(50) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `direccion` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesionales`
--

INSERT INTO `profesionales` (`id_profesional`, `nombre_completo`, `dni`, `telefono`, `email`, `direccion`) VALUES
(1, 'Dr. Alejando Messi', '68493', '83928', 'juanceto@mail.com', 'peru °2844'),
(2, 'Dra. Molinari', '6789009', '265326', 'yuyu@mail.com', 'yuyos'),
(3, 'Dr. Patata', '6898', '555555555', 'papasfritas@gmail.com', 'tacotaco'),
(4, 'Dr. Messi', '10', '101010', 'soymesii@mail.com', 'Barcelona');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesional_especialidad`
--

CREATE TABLE `profesional_especialidad` (
  `id_profesional_especialidad` int(11) NOT NULL,
  `id_profesional` int(11) NOT NULL,
  `id_especialidad` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `profesional_especialidad`
--

INSERT INTO `profesional_especialidad` (`id_profesional_especialidad`, `id_profesional`, `id_especialidad`) VALUES
(1, 1, 1),
(2, 2, 3),
(3, 4, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sobreturnos`
--

CREATE TABLE `sobreturnos` (
  `id_sobreturno` int(11) NOT NULL,
  `id_turno` int(11) NOT NULL,
  `motivo_sobreturno` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sobreturnos`
--

INSERT INTO `sobreturnos` (`id_sobreturno`, `id_turno`, `motivo_sobreturno`) VALUES
(1, 3, 'Urgencia'),
(2, 3, 'Nos paso plata'),
(3, 6, 'Le debia un favor'),
(4, 1, 'Me gusta en secreto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sucursales`
--

CREATE TABLE `sucursales` (
  `id_sucursal` int(11) NOT NULL,
  `nombre_sucursal` varchar(30) NOT NULL,
  `direccion` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `sucursales`
--

INSERT INTO `sucursales` (`id_sucursal`, `nombre_sucursal`, `direccion`, `telefono`) VALUES
(1, 'Rivadavia', 'Rivadavia 596', '12312'),
(2, 'Clinica Dupuy', 'Calle Dupuy 2103', '2654391'),
(3, 'Walmart', 'Barrio tibiletti', '265439231'),
(4, 'Bombonera', 'La boca', '223531');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `turnos`
--

CREATE TABLE `turnos` (
  `id_turno` int(11) NOT NULL,
  `id_agenda` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `fecha_hora_inicio` datetime NOT NULL COMMENT '9999-12-31 23:59:59',
  `estado_turno` varchar(30) NOT NULL COMMENT '(Libre, reservada, confirmado, cancelado, ausente, etc.)',
  `motivo_cancelacion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `turnos`
--

INSERT INTO `turnos` (`id_turno`, `id_agenda`, `id_paciente`, `fecha_hora_inicio`, `estado_turno`, `motivo_cancelacion`) VALUES
(1, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(2, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(3, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(4, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(5, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(6, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(7, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL),
(8, 2, 3, '2024-11-18 16:00:00', 'reservada', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `documento` varchar(20) NOT NULL,
  `password` varchar(20) NOT NULL,
  `rol` int(11) NOT NULL COMMENT '(Administrador, secretario, paciente, etc.)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento`, `password`, `rol`) VALUES
(1, 'admin', '1234', 1),
(4, '342', '1234', 3),
(6, '420', '1234', 2),
(7, 'admin2', '1234', 1),
(8, 'Secreta', '1234', 2);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `agendas`
--
ALTER TABLE `agendas`
  ADD PRIMARY KEY (`id_agenda`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_sucursal` (`id_sucursal`);

--
-- Indices de la tabla `diasnolaborables`
--
ALTER TABLE `diasnolaborables`
  ADD PRIMARY KEY (`id_dia`);

--
-- Indices de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  ADD PRIMARY KEY (`id_especialidad`);

--
-- Indices de la tabla `horario_bloqueado`
--
ALTER TABLE `horario_bloqueado`
  ADD PRIMARY KEY (`id_bloqueo`),
  ADD KEY `id_agenda` (`id_agenda`);

--
-- Indices de la tabla `lista de espera`
--
ALTER TABLE `lista de espera`
  ADD PRIMARY KEY (`id_espera`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_agenda` (`id_agenda`);

--
-- Indices de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indices de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  ADD PRIMARY KEY (`id_profesional`);

--
-- Indices de la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD PRIMARY KEY (`id_profesional_especialidad`),
  ADD KEY `id_profesional` (`id_profesional`),
  ADD KEY `id_especialidad` (`id_especialidad`);

--
-- Indices de la tabla `sobreturnos`
--
ALTER TABLE `sobreturnos`
  ADD PRIMARY KEY (`id_sobreturno`),
  ADD KEY `id_turno` (`id_turno`);

--
-- Indices de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  ADD PRIMARY KEY (`id_sucursal`);

--
-- Indices de la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD PRIMARY KEY (`id_turno`),
  ADD KEY `id_agenda` (`id_agenda`),
  ADD KEY `id_paciente` (`id_paciente`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `documento` (`documento`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `agendas`
--
ALTER TABLE `agendas`
  MODIFY `id_agenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `diasnolaborables`
--
ALTER TABLE `diasnolaborables`
  MODIFY `id_dia` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `especialidad`
--
ALTER TABLE `especialidad`
  MODIFY `id_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `horario_bloqueado`
--
ALTER TABLE `horario_bloqueado`
  MODIFY `id_bloqueo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `lista de espera`
--
ALTER TABLE `lista de espera`
  MODIFY `id_espera` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pacientes`
--
ALTER TABLE `pacientes`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `profesionales`
--
ALTER TABLE `profesionales`
  MODIFY `id_profesional` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  MODIFY `id_profesional_especialidad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sobreturnos`
--
ALTER TABLE `sobreturnos`
  MODIFY `id_sobreturno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `sucursales`
--
ALTER TABLE `sucursales`
  MODIFY `id_sucursal` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `turnos`
--
ALTER TABLE `turnos`
  MODIFY `id_turno` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `agendas`
--
ALTER TABLE `agendas`
  ADD CONSTRAINT `agendas_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `agendas_ibfk_2` FOREIGN KEY (`id_sucursal`) REFERENCES `sucursales` (`id_sucursal`);

--
-- Filtros para la tabla `horario_bloqueado`
--
ALTER TABLE `horario_bloqueado`
  ADD CONSTRAINT `horario_bloqueado_ibfk_1` FOREIGN KEY (`id_agenda`) REFERENCES `agendas` (`id_agenda`);

--
-- Filtros para la tabla `lista de espera`
--
ALTER TABLE `lista de espera`
  ADD CONSTRAINT `lista de espera_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`),
  ADD CONSTRAINT `lista de espera_ibfk_2` FOREIGN KEY (`id_agenda`) REFERENCES `agendas` (`id_agenda`);

--
-- Filtros para la tabla `profesional_especialidad`
--
ALTER TABLE `profesional_especialidad`
  ADD CONSTRAINT `profesional_especialidad_ibfk_1` FOREIGN KEY (`id_profesional`) REFERENCES `profesionales` (`id_profesional`),
  ADD CONSTRAINT `profesional_especialidad_ibfk_2` FOREIGN KEY (`id_especialidad`) REFERENCES `especialidad` (`id_especialidad`);

--
-- Filtros para la tabla `sobreturnos`
--
ALTER TABLE `sobreturnos`
  ADD CONSTRAINT `sobreturnos_ibfk_1` FOREIGN KEY (`id_turno`) REFERENCES `turnos` (`id_turno`);

--
-- Filtros para la tabla `turnos`
--
ALTER TABLE `turnos`
  ADD CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`id_agenda`) REFERENCES `agendas` (`id_agenda`),
  ADD CONSTRAINT `turnos_ibfk_2` FOREIGN KEY (`id_paciente`) REFERENCES `pacientes` (`id_paciente`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
