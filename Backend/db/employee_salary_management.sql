-- MySQL dump 10.13  Distrib 9.2.0, for macos14.7 (arm64)
--
-- Host: localhost    Database: employee_salary_management
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `positions`
-- (created before employees because employees.positionId references positions.id)
--

DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `positions`;
CREATE TABLE `positions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `position_uuid` varchar(255) NOT NULL,
  `position_name` varchar(120) NOT NULL,
  `basic_salary` int NOT NULL,
  `transport_allowance` int NOT NULL,
  `meal_allowance` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `positions` WRITE;
/*!40000 ALTER TABLE `positions` DISABLE KEYS */;
INSERT INTO `positions` VALUES
(1,'aaa11111-1111-1111-1111-111111111111','Senior HR Manager',55000,5000,3500,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(2,'bbb22222-2222-2222-2222-222222222222','Software Developer',65000,4500,3000,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(3,'ccc33333-3333-3333-3333-333333333333','Production Supervisor',45000,4000,2500,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(4,'ddd44444-4444-4444-4444-444444444444','Marketing Executive',40000,3500,2500,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(5,'eee55555-5555-5555-5555-555555555555','Accountant',42000,3500,2500,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(6,'fff66666-6666-6666-6666-666666666666','UI/UX Designer',58000,4500,3000,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(7,'aaa77777-7777-7777-7777-777777777777','DevOps Engineer',62000,4500,3000,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(8,'bbb88888-8888-8888-8888-888888888888','Quality Analyst',48000,4000,2500,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(9,'ccc99999-9999-9999-9999-999999999999','Project Manager',72000,6000,4000,'2025-01-15 09:00:00','2025-01-15 09:00:00'),
(10,'dddaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa','Business Analyst',50000,4000,3000,'2025-01-15 09:00:00','2025-01-15 09:00:00');
/*!40000 ALTER TABLE `positions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_uuid` varchar(255) NOT NULL,
  `nik` varchar(16) NOT NULL,
  `employee_name` varchar(100) NOT NULL,
  `username` varchar(120) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `gender` varchar(15) NOT NULL,
  `positionId` int DEFAULT NULL,
  `join_date` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `photo` varchar(100) NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `positionId` (`positionId`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`positionId`) REFERENCES `positions` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `employees`
-- Default password for all users: password123
--
-- Employee -> Position mapping:
--   Aryan Sharma      -> Senior HR Manager   (positionId=1)
--   Priya Patel       -> Software Developer  (positionId=2)
--   Rahul Verma       -> Production Supervisor (positionId=3)
--   Ananya Gupta      -> Marketing Executive (positionId=4)
--   Vikram Singh      -> Accountant          (positionId=5)
--   Sneha Reddy       -> UI/UX Designer      (positionId=6)
--   Amit Kumar        -> DevOps Engineer     (positionId=7)
--   Kavita Nair       -> Quality Analyst     (positionId=8)
--   Rajesh Iyer       -> Project Manager     (positionId=9)
--   Meera Joshi       -> Business Analyst    (positionId=10)
--   Suresh Menon      -> Software Developer  (positionId=2)
--   Deepa Krishnan    -> Accountant          (positionId=5)
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES
(1,'a1b2c3d4-e5f6-7890-abcd-ef1234567890','1010101001','Aryan Sharma','admin','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Male',1,'2025-01-15','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','admin','2025-01-15 09:00:00','2025-01-15 09:00:00'),
(2,'b2c3d4e5-f6a7-8901-bcde-f12345678901','1010101002','Priya Patel','priya','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Female',2,'2025-02-16','Contract Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-02-16 09:00:00','2025-02-16 09:00:00'),
(3,'c3d4e5f6-a7b8-9012-cdef-123456789012','1010101003','Rahul Verma','rahul','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Male',3,'2025-03-17','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-03-17 09:00:00','2025-03-17 09:00:00'),
(4,'d4e5f6a7-b8c9-0123-defa-234567890123','1010101004','Ananya Gupta','ananya','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Female',4,'2025-04-18','Contract Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-04-18 09:00:00','2025-04-18 09:00:00'),
(5,'e5f6a7b8-c9d0-1234-efab-345678901234','1010101005','Vikram Singh','vikram','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Male',5,'2025-05-19','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-05-19 09:00:00','2025-05-19 09:00:00'),
(6,'f6a7b8c9-d0e1-2345-fabc-456789012345','1010101006','Sneha Reddy','sneha','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Female',6,'2025-01-20','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-01-20 09:00:00','2025-01-20 09:00:00'),
(7,'a7b8c9d0-e1f2-3456-abcd-567890123456','1010101007','Amit Kumar','amit','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Male',7,'2025-02-10','Contract Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-02-10 09:00:00','2025-02-10 09:00:00'),
(8,'b8c9d0e1-f2a3-4567-bcde-678901234567','1010101008','Kavita Nair','kavita','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Female',8,'2025-03-05','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-03-05 09:00:00','2025-03-05 09:00:00'),
(9,'c9d0e1f2-a3b4-5678-cdef-789012345678','1010101009','Rajesh Iyer','rajesh','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Male',9,'2025-01-25','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-01-25 09:00:00','2025-01-25 09:00:00'),
(10,'d0e1f2a3-b4c5-6789-defa-890123456789','1010101010','Meera Joshi','meera','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Female',10,'2025-04-01','Contract Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-04-01 09:00:00','2025-04-01 09:00:00'),
(11,'e1f2a3b4-c5d6-7890-efab-901234567890','1010101011','Suresh Menon','suresh','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Male',2,'2025-02-20','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-02-20 09:00:00','2025-02-20 09:00:00'),
(12,'f2a3b4c5-d6e7-8901-fabc-012345678901','1010101012','Deepa Krishnan','deepa','$argon2id$v=19$m=65536,t=3,p=4$t6fWxLNhC3o0OA6hJca0yg$58512eams6vhaOvTqy8RA7T2OymDpgdrlBsMwTgHX1c','Female',5,'2025-03-15','Permanent Employee','default.jpg','http://localhost:5001/images/default.jpg','employee','2025-03-15 09:00:00','2025-03-15 09:00:00');
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
CREATE TABLE `attendance` (
  `id` int NOT NULL AUTO_INCREMENT,
  `month` varchar(15) NOT NULL,
  `year` int NOT NULL,
  `nik` varchar(16) NOT NULL,
  `employee_name` varchar(100) NOT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `position_name` varchar(50) DEFAULT NULL,
  `present` int DEFAULT NULL,
  `sick` int DEFAULT NULL,
  `absent` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES
(1,'January',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(2,'January',2024,'1010101002','Priya Patel','Female','Software Developer',21,0,1,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(3,'January',2024,'1010101003','Rahul Verma','Male','Production Supervisor',21,0,1,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(4,'January',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(5,'January',2024,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(6,'January',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(7,'January',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',19,2,1,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(8,'January',2024,'1010101008','Kavita Nair','Female','Quality Analyst',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(9,'January',2024,'1010101009','Rajesh Iyer','Male','Project Manager',20,2,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(10,'January',2024,'1010101010','Meera Joshi','Female','Business Analyst',21,1,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(11,'January',2024,'1010101011','Suresh Menon','Male','Software Developer',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(12,'January',2024,'1010101012','Deepa Krishnan','Female','Accountant',22,0,0,'2024-01-28 09:00:00','2024-01-28 09:00:00'),
(13,'February',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',19,1,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(14,'February',2024,'1010101002','Priya Patel','Female','Software Developer',20,0,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(15,'February',2024,'1010101003','Rahul Verma','Male','Production Supervisor',18,2,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(16,'February',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',18,2,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(17,'February',2024,'1010101005','Vikram Singh','Male','Accountant',17,2,1,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(18,'February',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',19,1,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(19,'February',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',20,0,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(20,'February',2024,'1010101008','Kavita Nair','Female','Quality Analyst',20,0,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(21,'February',2024,'1010101009','Rajesh Iyer','Male','Project Manager',20,0,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(22,'February',2024,'1010101010','Meera Joshi','Female','Business Analyst',20,0,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(23,'February',2024,'1010101011','Suresh Menon','Male','Software Developer',19,1,0,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(24,'February',2024,'1010101012','Deepa Krishnan','Female','Accountant',19,0,1,'2024-02-28 09:00:00','2024-02-28 09:00:00'),
(25,'March',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(26,'March',2024,'1010101002','Priya Patel','Female','Software Developer',20,2,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(27,'March',2024,'1010101003','Rahul Verma','Male','Production Supervisor',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(28,'March',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(29,'March',2024,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(30,'March',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(31,'March',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(32,'March',2024,'1010101008','Kavita Nair','Female','Quality Analyst',22,0,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(33,'March',2024,'1010101009','Rajesh Iyer','Male','Project Manager',21,0,1,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(34,'March',2024,'1010101010','Meera Joshi','Female','Business Analyst',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(35,'March',2024,'1010101011','Suresh Menon','Male','Software Developer',21,1,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(36,'March',2024,'1010101012','Deepa Krishnan','Female','Accountant',22,0,0,'2024-03-28 09:00:00','2024-03-28 09:00:00'),
(37,'April',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,0,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(38,'April',2024,'1010101002','Priya Patel','Female','Software Developer',21,0,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(39,'April',2024,'1010101003','Rahul Verma','Male','Production Supervisor',19,0,2,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(40,'April',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',18,2,1,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(41,'April',2024,'1010101005','Vikram Singh','Male','Accountant',21,0,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(42,'April',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',20,0,1,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(43,'April',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',20,1,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(44,'April',2024,'1010101008','Kavita Nair','Female','Quality Analyst',19,0,2,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(45,'April',2024,'1010101009','Rajesh Iyer','Male','Project Manager',19,1,1,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(46,'April',2024,'1010101010','Meera Joshi','Female','Business Analyst',20,1,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(47,'April',2024,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(48,'April',2024,'1010101012','Deepa Krishnan','Female','Accountant',20,1,0,'2024-04-28 09:00:00','2024-04-28 09:00:00'),
(49,'May',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,1,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(50,'May',2024,'1010101002','Priya Patel','Female','Software Developer',20,0,2,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(51,'May',2024,'1010101003','Rahul Verma','Male','Production Supervisor',22,0,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(52,'May',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',21,1,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(53,'May',2024,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(54,'May',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',20,0,2,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(55,'May',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',22,0,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(56,'May',2024,'1010101008','Kavita Nair','Female','Quality Analyst',22,0,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(57,'May',2024,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(58,'May',2024,'1010101010','Meera Joshi','Female','Business Analyst',21,1,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(59,'May',2024,'1010101011','Suresh Menon','Male','Software Developer',21,0,1,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(60,'May',2024,'1010101012','Deepa Krishnan','Female','Accountant',22,0,0,'2024-05-28 09:00:00','2024-05-28 09:00:00'),
(61,'June',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(62,'June',2024,'1010101002','Priya Patel','Female','Software Developer',20,1,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(63,'June',2024,'1010101003','Rahul Verma','Male','Production Supervisor',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(64,'June',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',20,1,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(65,'June',2024,'1010101005','Vikram Singh','Male','Accountant',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(66,'June',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',20,1,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(67,'June',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(68,'June',2024,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(69,'June',2024,'1010101009','Rajesh Iyer','Male','Project Manager',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(70,'June',2024,'1010101010','Meera Joshi','Female','Business Analyst',19,1,1,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(71,'June',2024,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(72,'June',2024,'1010101012','Deepa Krishnan','Female','Accountant',20,1,0,'2024-06-28 09:00:00','2024-06-28 09:00:00'),
(73,'July',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',23,0,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(74,'July',2024,'1010101002','Priya Patel','Female','Software Developer',22,1,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(75,'July',2024,'1010101003','Rahul Verma','Male','Production Supervisor',22,1,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(76,'July',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',22,1,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(77,'July',2024,'1010101005','Vikram Singh','Male','Accountant',23,0,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(78,'July',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',20,1,2,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(79,'July',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',23,0,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(80,'July',2024,'1010101008','Kavita Nair','Female','Quality Analyst',22,1,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(81,'July',2024,'1010101009','Rajesh Iyer','Male','Project Manager',23,0,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(82,'July',2024,'1010101010','Meera Joshi','Female','Business Analyst',21,0,2,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(83,'July',2024,'1010101011','Suresh Menon','Male','Software Developer',20,2,1,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(84,'July',2024,'1010101012','Deepa Krishnan','Female','Accountant',23,0,0,'2024-07-28 09:00:00','2024-07-28 09:00:00'),
(85,'August',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,0,1,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(86,'August',2024,'1010101002','Priya Patel','Female','Software Developer',22,0,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(87,'August',2024,'1010101003','Rahul Verma','Male','Production Supervisor',22,0,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(88,'August',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',21,1,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(89,'August',2024,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(90,'August',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',20,0,2,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(91,'August',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',20,2,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(92,'August',2024,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,1,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(93,'August',2024,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(94,'August',2024,'1010101010','Meera Joshi','Female','Business Analyst',22,0,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(95,'August',2024,'1010101011','Suresh Menon','Male','Software Developer',20,2,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(96,'August',2024,'1010101012','Deepa Krishnan','Female','Accountant',20,2,0,'2024-08-28 09:00:00','2024-08-28 09:00:00'),
(97,'September',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,0,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(98,'September',2024,'1010101002','Priya Patel','Female','Software Developer',20,1,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(99,'September',2024,'1010101003','Rahul Verma','Male','Production Supervisor',19,2,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(100,'September',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',20,0,1,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(101,'September',2024,'1010101005','Vikram Singh','Male','Accountant',19,2,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(102,'September',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',18,2,1,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(103,'September',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',19,2,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(104,'September',2024,'1010101008','Kavita Nair','Female','Quality Analyst',19,2,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(105,'September',2024,'1010101009','Rajesh Iyer','Male','Project Manager',21,0,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(106,'September',2024,'1010101010','Meera Joshi','Female','Business Analyst',20,1,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(107,'September',2024,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(108,'September',2024,'1010101012','Deepa Krishnan','Female','Accountant',20,0,1,'2024-09-28 09:00:00','2024-09-28 09:00:00'),
(109,'October',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,1,1,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(110,'October',2024,'1010101002','Priya Patel','Female','Software Developer',23,0,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(111,'October',2024,'1010101003','Rahul Verma','Male','Production Supervisor',20,1,2,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(112,'October',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',23,0,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(113,'October',2024,'1010101005','Vikram Singh','Male','Accountant',21,1,1,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(114,'October',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',23,0,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(115,'October',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',23,0,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(116,'October',2024,'1010101008','Kavita Nair','Female','Quality Analyst',23,0,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(117,'October',2024,'1010101009','Rajesh Iyer','Male','Project Manager',22,1,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(118,'October',2024,'1010101010','Meera Joshi','Female','Business Analyst',20,2,1,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(119,'October',2024,'1010101011','Suresh Menon','Male','Software Developer',22,1,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(120,'October',2024,'1010101012','Deepa Krishnan','Female','Accountant',23,0,0,'2024-10-28 09:00:00','2024-10-28 09:00:00'),
(121,'November',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,1,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(122,'November',2024,'1010101002','Priya Patel','Female','Software Developer',20,1,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(123,'November',2024,'1010101003','Rahul Verma','Male','Production Supervisor',19,2,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(124,'November',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',21,0,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(125,'November',2024,'1010101005','Vikram Singh','Male','Accountant',20,1,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(126,'November',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',19,2,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(127,'November',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',21,0,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(128,'November',2024,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(129,'November',2024,'1010101009','Rajesh Iyer','Male','Project Manager',20,1,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(130,'November',2024,'1010101010','Meera Joshi','Female','Business Analyst',21,0,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(131,'November',2024,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(132,'November',2024,'1010101012','Deepa Krishnan','Female','Accountant',21,0,0,'2024-11-28 09:00:00','2024-11-28 09:00:00'),
(133,'December',2024,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,2,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(134,'December',2024,'1010101002','Priya Patel','Female','Software Developer',22,0,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(135,'December',2024,'1010101003','Rahul Verma','Male','Production Supervisor',20,2,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(136,'December',2024,'1010101004','Ananya Gupta','Female','Marketing Executive',20,1,1,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(137,'December',2024,'1010101005','Vikram Singh','Male','Accountant',19,2,1,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(138,'December',2024,'1010101006','Sneha Reddy','Female','UI/UX Designer',21,1,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(139,'December',2024,'1010101007','Amit Kumar','Male','DevOps Engineer',22,0,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(140,'December',2024,'1010101008','Kavita Nair','Female','Quality Analyst',20,0,2,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(141,'December',2024,'1010101009','Rajesh Iyer','Male','Project Manager',20,1,1,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(142,'December',2024,'1010101010','Meera Joshi','Female','Business Analyst',22,0,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(143,'December',2024,'1010101011','Suresh Menon','Male','Software Developer',20,1,1,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(144,'December',2024,'1010101012','Deepa Krishnan','Female','Accountant',22,0,0,'2024-12-28 09:00:00','2024-12-28 09:00:00'),
(145,'January',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(146,'January',2025,'1010101002','Priya Patel','Female','Software Developer',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(147,'January',2025,'1010101003','Rahul Verma','Male','Production Supervisor',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(148,'January',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',21,0,1,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(149,'January',2025,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(150,'January',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',21,0,1,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(151,'January',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(152,'January',2025,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,1,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(153,'January',2025,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(154,'January',2025,'1010101010','Meera Joshi','Female','Business Analyst',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(155,'January',2025,'1010101011','Suresh Menon','Male','Software Developer',22,0,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(156,'January',2025,'1010101012','Deepa Krishnan','Female','Accountant',21,1,0,'2025-01-28 09:00:00','2025-01-28 09:00:00'),
(157,'February',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',19,0,1,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(158,'February',2025,'1010101002','Priya Patel','Female','Software Developer',18,2,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(159,'February',2025,'1010101003','Rahul Verma','Male','Production Supervisor',19,1,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(160,'February',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',20,0,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(161,'February',2025,'1010101005','Vikram Singh','Male','Accountant',19,0,1,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(162,'February',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',18,2,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(163,'February',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',18,1,1,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(164,'February',2025,'1010101008','Kavita Nair','Female','Quality Analyst',20,0,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(165,'February',2025,'1010101009','Rajesh Iyer','Male','Project Manager',18,2,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(166,'February',2025,'1010101010','Meera Joshi','Female','Business Analyst',18,1,1,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(167,'February',2025,'1010101011','Suresh Menon','Male','Software Developer',17,1,2,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(168,'February',2025,'1010101012','Deepa Krishnan','Female','Accountant',20,0,0,'2025-02-28 09:00:00','2025-02-28 09:00:00'),
(169,'March',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',22,0,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(170,'March',2025,'1010101002','Priya Patel','Female','Software Developer',21,1,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(171,'March',2025,'1010101003','Rahul Verma','Male','Production Supervisor',19,1,2,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(172,'March',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',22,0,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(173,'March',2025,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(174,'March',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',22,0,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(175,'March',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',21,1,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(176,'March',2025,'1010101008','Kavita Nair','Female','Quality Analyst',22,0,0,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(177,'March',2025,'1010101009','Rajesh Iyer','Male','Project Manager',21,0,1,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(178,'March',2025,'1010101010','Meera Joshi','Female','Business Analyst',21,0,1,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(179,'March',2025,'1010101011','Suresh Menon','Male','Software Developer',20,1,1,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(180,'March',2025,'1010101012','Deepa Krishnan','Female','Accountant',19,1,2,'2025-03-28 09:00:00','2025-03-28 09:00:00'),
(181,'April',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,1,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(182,'April',2025,'1010101002','Priya Patel','Female','Software Developer',20,1,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(183,'April',2025,'1010101003','Rahul Verma','Male','Production Supervisor',21,0,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(184,'April',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',19,1,1,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(185,'April',2025,'1010101005','Vikram Singh','Male','Accountant',20,1,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(186,'April',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',19,1,1,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(187,'April',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',20,1,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(188,'April',2025,'1010101008','Kavita Nair','Female','Quality Analyst',20,0,1,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(189,'April',2025,'1010101009','Rajesh Iyer','Male','Project Manager',20,0,1,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(190,'April',2025,'1010101010','Meera Joshi','Female','Business Analyst',21,0,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(191,'April',2025,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(192,'April',2025,'1010101012','Deepa Krishnan','Female','Accountant',21,0,0,'2025-04-28 09:00:00','2025-04-28 09:00:00'),
(193,'May',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',22,0,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(194,'May',2025,'1010101002','Priya Patel','Female','Software Developer',22,0,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(195,'May',2025,'1010101003','Rahul Verma','Male','Production Supervisor',21,1,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(196,'May',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',19,2,1,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(197,'May',2025,'1010101005','Vikram Singh','Male','Accountant',20,0,2,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(198,'May',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',22,0,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(199,'May',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',22,0,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(200,'May',2025,'1010101008','Kavita Nair','Female','Quality Analyst',20,0,2,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(201,'May',2025,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(202,'May',2025,'1010101010','Meera Joshi','Female','Business Analyst',22,0,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(203,'May',2025,'1010101011','Suresh Menon','Male','Software Developer',20,2,0,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(204,'May',2025,'1010101012','Deepa Krishnan','Female','Accountant',20,1,1,'2025-05-28 09:00:00','2025-05-28 09:00:00'),
(205,'June',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,0,1,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(206,'June',2025,'1010101002','Priya Patel','Female','Software Developer',21,0,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(207,'June',2025,'1010101003','Rahul Verma','Male','Production Supervisor',21,0,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(208,'June',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',20,0,1,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(209,'June',2025,'1010101005','Vikram Singh','Male','Accountant',21,0,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(210,'June',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',18,1,2,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(211,'June',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',18,1,2,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(212,'June',2025,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(213,'June',2025,'1010101009','Rajesh Iyer','Male','Project Manager',21,0,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(214,'June',2025,'1010101010','Meera Joshi','Female','Business Analyst',20,1,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(215,'June',2025,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(216,'June',2025,'1010101012','Deepa Krishnan','Female','Accountant',20,0,1,'2025-06-28 09:00:00','2025-06-28 09:00:00'),
(217,'July',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,2,0,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(218,'July',2025,'1010101002','Priya Patel','Female','Software Developer',21,1,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(219,'July',2025,'1010101003','Rahul Verma','Male','Production Supervisor',22,1,0,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(220,'July',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',22,0,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(221,'July',2025,'1010101005','Vikram Singh','Male','Accountant',22,0,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(222,'July',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',22,0,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(223,'July',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',20,2,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(224,'July',2025,'1010101008','Kavita Nair','Female','Quality Analyst',20,2,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(225,'July',2025,'1010101009','Rajesh Iyer','Male','Project Manager',20,1,2,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(226,'July',2025,'1010101010','Meera Joshi','Female','Business Analyst',21,1,1,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(227,'July',2025,'1010101011','Suresh Menon','Male','Software Developer',23,0,0,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(228,'July',2025,'1010101012','Deepa Krishnan','Female','Accountant',22,1,0,'2025-07-28 09:00:00','2025-07-28 09:00:00'),
(229,'August',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',22,0,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(230,'August',2025,'1010101002','Priya Patel','Female','Software Developer',21,0,1,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(231,'August',2025,'1010101003','Rahul Verma','Male','Production Supervisor',21,1,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(232,'August',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',21,0,1,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(233,'August',2025,'1010101005','Vikram Singh','Male','Accountant',21,1,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(234,'August',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',21,1,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(235,'August',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',20,0,2,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(236,'August',2025,'1010101008','Kavita Nair','Female','Quality Analyst',22,0,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(237,'August',2025,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(238,'August',2025,'1010101010','Meera Joshi','Female','Business Analyst',21,0,1,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(239,'August',2025,'1010101011','Suresh Menon','Male','Software Developer',21,1,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(240,'August',2025,'1010101012','Deepa Krishnan','Female','Accountant',21,1,0,'2025-08-28 09:00:00','2025-08-28 09:00:00'),
(241,'September',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(242,'September',2025,'1010101002','Priya Patel','Female','Software Developer',19,0,2,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(243,'September',2025,'1010101003','Rahul Verma','Male','Production Supervisor',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(244,'September',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(245,'September',2025,'1010101005','Vikram Singh','Male','Accountant',18,1,2,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(246,'September',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(247,'September',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',20,0,1,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(248,'September',2025,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(249,'September',2025,'1010101009','Rajesh Iyer','Male','Project Manager',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(250,'September',2025,'1010101010','Meera Joshi','Female','Business Analyst',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(251,'September',2025,'1010101011','Suresh Menon','Male','Software Developer',20,1,0,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(252,'September',2025,'1010101012','Deepa Krishnan','Female','Accountant',20,0,1,'2025-09-28 09:00:00','2025-09-28 09:00:00'),
(253,'October',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,2,1,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(254,'October',2025,'1010101002','Priya Patel','Female','Software Developer',23,0,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(255,'October',2025,'1010101003','Rahul Verma','Male','Production Supervisor',21,2,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(256,'October',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',23,0,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(257,'October',2025,'1010101005','Vikram Singh','Male','Accountant',23,0,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(258,'October',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',22,1,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(259,'October',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',23,0,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(260,'October',2025,'1010101008','Kavita Nair','Female','Quality Analyst',22,1,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(261,'October',2025,'1010101009','Rajesh Iyer','Male','Project Manager',21,1,1,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(262,'October',2025,'1010101010','Meera Joshi','Female','Business Analyst',22,1,0,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(263,'October',2025,'1010101011','Suresh Menon','Male','Software Developer',20,1,2,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(264,'October',2025,'1010101012','Deepa Krishnan','Female','Accountant',22,0,1,'2025-10-28 09:00:00','2025-10-28 09:00:00'),
(265,'November',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,1,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(266,'November',2025,'1010101002','Priya Patel','Female','Software Developer',20,1,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(267,'November',2025,'1010101003','Rahul Verma','Male','Production Supervisor',18,2,1,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(268,'November',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',18,2,1,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(269,'November',2025,'1010101005','Vikram Singh','Male','Accountant',20,0,1,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(270,'November',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',21,0,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(271,'November',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',18,2,1,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(272,'November',2025,'1010101008','Kavita Nair','Female','Quality Analyst',21,0,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(273,'November',2025,'1010101009','Rajesh Iyer','Male','Project Manager',21,0,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(274,'November',2025,'1010101010','Meera Joshi','Female','Business Analyst',19,2,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(275,'November',2025,'1010101011','Suresh Menon','Male','Software Developer',21,0,0,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(276,'November',2025,'1010101012','Deepa Krishnan','Female','Accountant',19,1,1,'2025-11-28 09:00:00','2025-11-28 09:00:00'),
(277,'December',2025,'1010101001','Aryan Sharma','Male','Senior HR Manager',20,2,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(278,'December',2025,'1010101002','Priya Patel','Female','Software Developer',21,0,1,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(279,'December',2025,'1010101003','Rahul Verma','Male','Production Supervisor',22,0,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(280,'December',2025,'1010101004','Ananya Gupta','Female','Marketing Executive',21,0,1,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(281,'December',2025,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(282,'December',2025,'1010101006','Sneha Reddy','Female','UI/UX Designer',19,2,1,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(283,'December',2025,'1010101007','Amit Kumar','Male','DevOps Engineer',22,0,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(284,'December',2025,'1010101008','Kavita Nair','Female','Quality Analyst',21,1,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(285,'December',2025,'1010101009','Rajesh Iyer','Male','Project Manager',21,1,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(286,'December',2025,'1010101010','Meera Joshi','Female','Business Analyst',21,0,1,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(287,'December',2025,'1010101011','Suresh Menon','Male','Software Developer',21,1,0,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(288,'December',2025,'1010101012','Deepa Krishnan','Female','Accountant',20,0,2,'2025-12-28 09:00:00','2025-12-28 09:00:00'),
(289,'January',2026,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,1,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(290,'January',2026,'1010101002','Priya Patel','Female','Software Developer',22,0,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(291,'January',2026,'1010101003','Rahul Verma','Male','Production Supervisor',22,0,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(292,'January',2026,'1010101004','Ananya Gupta','Female','Marketing Executive',19,1,2,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(293,'January',2026,'1010101005','Vikram Singh','Male','Accountant',22,0,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(294,'January',2026,'1010101006','Sneha Reddy','Female','UI/UX Designer',21,1,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(295,'January',2026,'1010101007','Amit Kumar','Male','DevOps Engineer',22,0,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(296,'January',2026,'1010101008','Kavita Nair','Female','Quality Analyst',21,1,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(297,'January',2026,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(298,'January',2026,'1010101010','Meera Joshi','Female','Business Analyst',22,0,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(299,'January',2026,'1010101011','Suresh Menon','Male','Software Developer',21,1,0,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(300,'January',2026,'1010101012','Deepa Krishnan','Female','Accountant',21,0,1,'2026-01-28 09:00:00','2026-01-28 09:00:00'),
(301,'February',2026,'1010101001','Aryan Sharma','Male','Senior HR Manager',17,1,2,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(302,'February',2026,'1010101002','Priya Patel','Female','Software Developer',19,1,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(303,'February',2026,'1010101003','Rahul Verma','Male','Production Supervisor',20,0,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(304,'February',2026,'1010101004','Ananya Gupta','Female','Marketing Executive',18,1,1,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(305,'February',2026,'1010101005','Vikram Singh','Male','Accountant',20,0,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(306,'February',2026,'1010101006','Sneha Reddy','Female','UI/UX Designer',18,1,1,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(307,'February',2026,'1010101007','Amit Kumar','Male','DevOps Engineer',20,0,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(308,'February',2026,'1010101008','Kavita Nair','Female','Quality Analyst',19,1,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(309,'February',2026,'1010101009','Rajesh Iyer','Male','Project Manager',19,0,1,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(310,'February',2026,'1010101010','Meera Joshi','Female','Business Analyst',19,0,1,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(311,'February',2026,'1010101011','Suresh Menon','Male','Software Developer',19,1,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(312,'February',2026,'1010101012','Deepa Krishnan','Female','Accountant',19,1,0,'2026-02-28 09:00:00','2026-02-28 09:00:00'),
(313,'March',2026,'1010101001','Aryan Sharma','Male','Senior HR Manager',21,0,1,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(314,'March',2026,'1010101002','Priya Patel','Female','Software Developer',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(315,'March',2026,'1010101003','Rahul Verma','Male','Production Supervisor',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(316,'March',2026,'1010101004','Ananya Gupta','Female','Marketing Executive',21,1,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(317,'March',2026,'1010101005','Vikram Singh','Male','Accountant',21,1,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(318,'March',2026,'1010101006','Sneha Reddy','Female','UI/UX Designer',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(319,'March',2026,'1010101007','Amit Kumar','Male','DevOps Engineer',21,0,1,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(320,'March',2026,'1010101008','Kavita Nair','Female','Quality Analyst',20,1,1,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(321,'March',2026,'1010101009','Rajesh Iyer','Male','Project Manager',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(322,'March',2026,'1010101010','Meera Joshi','Female','Business Analyst',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(323,'March',2026,'1010101011','Suresh Menon','Male','Software Developer',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00'),
(324,'March',2026,'1010101012','Deepa Krishnan','Female','Accountant',22,0,0,'2026-03-28 09:00:00','2026-03-28 09:00:00');
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_deductions`
--

DROP TABLE IF EXISTS `salary_deductions`;
CREATE TABLE `salary_deductions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `deduction` varchar(120) NOT NULL,
  `deduction_amount` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `salary_deductions` WRITE;
/*!40000 ALTER TABLE `salary_deductions` DISABLE KEYS */;
INSERT INTO `salary_deductions` VALUES
(1,'Absent',2000,'2025-01-01 09:00:00','2025-01-01 09:00:00'),
(2,'Sick',0,'2025-01-01 09:00:00','2025-01-01 09:00:00');
/*!40000 ALTER TABLE `salary_deductions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `sid` varchar(36) NOT NULL,
  `expires` datetime DEFAULT NULL,
  `data` text,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- --------------------------------------------------------
-- Table structure for payroll
-- --------------------------------------------------------
DROP TABLE IF EXISTS `payroll`;
CREATE TABLE `payroll` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `nik` varchar(16) NOT NULL,
  `employee_name` varchar(100) NOT NULL,
  `position_name` varchar(50) NOT NULL,
  `month` varchar(15) NOT NULL,
  `year` int(11) NOT NULL,
  `basic_salary` int(11) DEFAULT 0,
  `transport_allowance` int(11) DEFAULT 0,
  `meal_allowance` int(11) DEFAULT 0,
  `gross_salary` int(11) DEFAULT 0,
  `present_days` int(11) DEFAULT 0,
  `sick_days` int(11) DEFAULT 0,
  `absent_days` int(11) DEFAULT 0,
  `absent_deduction` int(11) DEFAULT 0,
  `sick_deduction` int(11) DEFAULT 0,
  `total_deduction` int(11) DEFAULT 0,
  `net_salary` int(11) DEFAULT 0,
  `status` varchar(20) DEFAULT 'processed',
  `processed_by` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payroll_employee` (`employee_id`),
  KEY `idx_payroll_period` (`month`,`year`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- Table structure for leave_types
-- --------------------------------------------------------
DROP TABLE IF EXISTS `leave_types`;
CREATE TABLE `leave_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `days_per_year` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `leave_types` (`id`,`name`,`days_per_year`,`createdAt`,`updatedAt`) VALUES
(1,'Casual Leave',12,NOW(),NOW()),
(2,'Sick Leave',10,NOW(),NOW()),
(3,'Earned Leave',15,NOW(),NOW());

-- --------------------------------------------------------
-- Table structure for leave_requests
-- --------------------------------------------------------
DROP TABLE IF EXISTS `leave_requests`;
CREATE TABLE `leave_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employee_id` int(11) NOT NULL,
  `employee_name` varchar(100) NOT NULL,
  `leave_type` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `days` int(11) NOT NULL,
  `reason` text NOT NULL,
  `status` varchar(20) DEFAULT 'pending',
  `reviewed_by` varchar(100) DEFAULT NULL,
  `reviewed_at` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_leave_employee` (`employee_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Dump completed
