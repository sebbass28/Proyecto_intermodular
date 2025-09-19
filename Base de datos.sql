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
  `id_productos` int(11) DEFAULT NULL,
  `cantidad` int(11) NOT NULL CHECK (`cantidad` > 0),
  `fecha_agregado` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_productos` (`id_productos`),
  CONSTRAINT `fk_productos` FOREIGN KEY (`id_productos`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrito`
--

LOCK TABLES `carrito` WRITE;
/*!40000 ALTER TABLE `carrito` DISABLE KEYS */;
INSERT INTO `carrito` VALUES (8,2,10,'2025-09-19 09:40:12');
/*!40000 ALTER TABLE `carrito` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
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

-- Dump completed on 2025-09-19 11:16:43

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

