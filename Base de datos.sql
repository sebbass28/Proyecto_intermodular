-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: tienda
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cantidad` int(11) NOT NULL,
  `fecha_agregado` datetime(6) DEFAULT NULL,
  `id_productos` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpmwj8wqgx8rh4dttyrgt5dnwc` (`id_productos`),
  CONSTRAINT `FKpmwj8wqgx8rh4dttyrgt5dnwc` FOREIGN KEY (`id_productos`) REFERENCES `productos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `apellido` varchar(255) NOT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK1c96wv36rk2hwui7qhjks3mvg` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'Pérez','Calle Principal 123, Madrid','juan.perez@gmail.com','Juan','password123','123-456-7890'),(2,'García','Avenida Central 456, Barcelona','maria.garcia@gmail.com','María','password123','987-654-3210'),(3,'López','Plaza Mayor 789, Valencia','carlos.lopez@gmail.com','Carlos','password123','555-123-4567'),(4,'Martínez','Calle Nueva 321, Sevilla','ana.martinez@gmail.com','Ana','password123','444-555-6666'),(5,'Sánchez','Paseo del Prado 654, Bilbao','roberto.sanchez@gmail.com','Roberto','password123','777-888-9999'),(6,'patxi','a','traccthor@gmail.com','marc','123456','56');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactos`
--

DROP TABLE IF EXISTS `contactos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contactos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mensaje` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactos`
--

LOCK TABLES `contactos` WRITE;
/*!40000 ALTER TABLE `contactos` DISABLE KEYS */;
INSERT INTO `contactos` VALUES (1,'marc','traccthor@gmail.com','w','2025-09-23 10:18:06');
/*!40000 ALTER TABLE `contactos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `descripcion` varchar(255) DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `precio` double NOT NULL,
  `imagen` tinyblob DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `stock` INTEGER NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` 
VALUES 
(1,'Osito Daisy Peluche',15.99,'','Suave y tierno osito perfecto para acurrucarse', 32),
(2,'Conejito Rosa',18.99,'','Adorable conejito en tono rosa pastel', 58),
(3,'Elefante Francisca La Tierna',23.99,'','Elefante suave con orejas extra grandes', 67),
(4,'León Valiente',21.99,'','León con melena esponjosa y sonrisa amigable', 46),
(5,'Pingüino Polar',19.99,'','Pingüino suave con bufanda invernal', 51),
(6,'Unicornio Mágico',25.99,'','Unicornio brillante con cuerno dorado', 73);

/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-09-23 12:19:43

CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE carrito
ADD COLUMN cliente_id INT NOT NULL AFTER id,
ADD CONSTRAINT fk_cliente
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

INSERT INTO clientes (nombre, email, password)
VALUES ('Pepe Ramos', 'pepon11@gmail.com', 'pepepepito2000');

INSERT INTO carrito (cliente_id, id_productos, cantidad)
VALUES (1, 2, 3); -- cliente_id = 1, producto_id = 2, cantidad = 3



CREATE TRIGGER restar_stock
AFTER INSERT ON carrito
FOR EACH ROW
BEGIN
  -- Verificar que el stock no sea negativo antes de restar
  IF (SELECT stock FROM productos WHERE id = NEW.id_productos) >= NEW.cantidad THEN
    UPDATE productos
    SET stock = stock - NEW.cantidad
    WHERE id = NEW.id_productos;
  ELSE
    -- Si el stock no es suficiente, puedes manejarlo de alguna manera (como un error o un log)
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Stock insuficiente para añadir al carrito';
  END IF;
END;




CREATE TRIGGER sumar_stock
AFTER DELETE ON carrito
FOR EACH ROW
BEGIN
  -- Sumar al stock el producto que se ha eliminado del carrito
  UPDATE productos
  SET stock = stock + OLD.cantidad
  WHERE id = OLD.id_productos;
END; 

