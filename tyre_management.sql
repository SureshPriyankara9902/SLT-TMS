-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 03, 2025 at 04:28 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tyre_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `vehicleId` int(11) NOT NULL,
  `vehicleNumber` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `tubesQuantity` int(11) NOT NULL,
  `tireSize` varchar(50) NOT NULL,
  `requestReason` text NOT NULL,
  `requesterName` varchar(100) NOT NULL,
  `requesterEmail` varchar(100) NOT NULL,
  `requesterPhone` varchar(20) NOT NULL,
  `year` varchar(4) NOT NULL,
  `vehicleBrand` varchar(50) NOT NULL,
  `vehicleModel` varchar(50) NOT NULL,
  `userSection` varchar(100) NOT NULL,
  `lastReplacementDate` date NOT NULL,
  `existingTireMake` varchar(100) NOT NULL,
  `tireSizeRequired` varchar(50) NOT NULL,
  `costCenter` varchar(50) NOT NULL,
  `presentKmReading` int(11) NOT NULL,
  `previousKmReading` int(11) NOT NULL,
  `tireWearPattern` varchar(100) NOT NULL,
  `comments` text DEFAULT NULL,
  `status` enum('pending','supervisor approved','technical-manager approved',' engineer approved','customer-officer approved','approved','rejected','complete') DEFAULT 'pending',
  `submittedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `userId`, `vehicleId`, `vehicleNumber`, `quantity`, `tubesQuantity`, `tireSize`, `requestReason`, `requesterName`, `requesterEmail`, `requesterPhone`, `year`, `vehicleBrand`, `vehicleModel`, `userSection`, `lastReplacementDate`, `existingTireMake`, `tireSizeRequired`, `costCenter`, `presentKmReading`, `previousKmReading`, `tireWearPattern`, `comments`, `status`, `submittedAt`) VALUES
(47, 1, 23, 'to-1028', 1, 0, '177-5', 'rer', 'pasindu', 'dilshan@gmail.com', '0656433', '2025', 'bajaj', 'ct-100', 'ghghd', '2025-06-07', 'zzxc', '177-5', 'sdc', 865978, 896808, 'normal wear', 'ds', 'complete', '2025-05-29 05:31:01'),
(48, 1, 23, 'to-1028', 1, 0, '177-5', 'v', 'pasindu', 'dilshan@gmail.com', '0764070565', '2025', 'bajaj', 'ct-100', 'kotuwe', '2025-05-28', 'zzxc', '177-5', 'dd', 5756, 547565, 'middle crack', 'rt', 'technical-manager approved', '2025-05-29 22:18:50'),
(49, 1, 27, 'aba-3459', 1, 0, '215-7', 'jmf', 'pasindu', 'dilshan@gmail.com', '0764070565', '2025', 'LEYLAND', 'ms-14', 'kotuwe', '2025-06-07', '43366', '215-7', 'dd', 5865, 58880, 'sidewall crack', 'jdf', 'complete', '2025-05-29 22:25:38'),
(50, 1, 23, 'to-1028', 1, 0, '177-5', 'no', 'sampath', 'sampath@gmail.com', '0714589632', '2025', 'bajaj', 'ct-100', 'no', '2025-06-01', 'no', '177-5', '34', 45, 24, 'one edge', '', 'rejected', '2025-06-01 21:30:17');

-- --------------------------------------------------------

--
-- Table structure for table `request_images`
--

CREATE TABLE `request_images` (
  `id` int(11) NOT NULL,
  `requestId` int(11) NOT NULL,
  `imagePath` varchar(255) NOT NULL,
  `imageIndex` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `request_images`
--

INSERT INTO `request_images` (`id`, `requestId`, `imagePath`, `imageIndex`) VALUES
(36, 47, '/uploads/1748496661822-942422314-tire2.jpeg', 0),
(37, 49, '/uploads/1748537738272-585187740-Screenshot (1).png', 0),
(38, 50, '/uploads/1748793617596-796553259-ChatGPT Image May 31, 2025, 12_37_59 PM.png', 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `azure_id` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `azure_id`, `email`, `name`, `role`) VALUES
(1, 'e8d0962d-f517-42ce-b415-41f6b550d1be', 'suresh9902@outlook.com', 'suresh priyankara', 'user');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `registeredBy` int(11) NOT NULL,
  `vehicleNumber` varchar(50) NOT NULL,
  `make` varchar(50) DEFAULT NULL,
  `model` varchar(50) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `tireSize` varchar(50) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `registeredBy`, `vehicleNumber`, `make`, `model`, `year`, `tireSize`, `department`, `status`) VALUES
(23, 1, 'to-1028', 'bajaj', 'ct-100', 2025, '177-5', 'civil', 'active'),
(24, 1, 'qp-5318', 'volvo', 'ms-14', 2025, '215-7', 'civil', 'active'),
(25, 1, 'aba-3451', 'bajaj', 'ms-14', 2025, '215-7', 'civil', 'active'),
(26, 1, 'NA_1024', 'LEYLAND', 'hino power', 2025, '275-2', 'transport', 'active'),
(27, 1, 'aba-3459', 'LEYLAND', 'ms-14', 2025, '215-7', 'transport', 'active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicleId` (`vehicleId`),
  ADD KEY `fk_requests_user` (`userId`);

--
-- Indexes for table `request_images`
--
ALTER TABLE `request_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `requestId` (`requestId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `azure_id` (`azure_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `vehicleNumber` (`vehicleNumber`),
  ADD KEY `fk_vehicles_user` (`registeredBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `request_images`
--
ALTER TABLE `request_images`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `fk_requests_user` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `request_images`
--
ALTER TABLE `request_images`
  ADD CONSTRAINT `request_images_ibfk_1` FOREIGN KEY (`requestId`) REFERENCES `requests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `fk_vehicles_user` FOREIGN KEY (`registeredBy`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
