-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour detect_panne
CREATE DATABASE IF NOT EXISTS `detect_panne` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `detect_panne`;

-- Listage de la structure de table detect_panne. alerts
CREATE TABLE IF NOT EXISTS `alerts` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `medical_device_id` bigint unsigned NOT NULL,
  `sensor_id` bigint unsigned DEFAULT NULL,
  `prediction_id` bigint unsigned DEFAULT NULL,
  `type` enum('sensor_critical','sensor_warning','prediction_high_risk','device_offline') COLLATE utf8mb4_unicode_ci NOT NULL,
  `severity` enum('info','warning','critical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `acknowledged_by` bigint unsigned DEFAULT NULL,
  `acknowledged_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alerts_medical_device_id_foreign` (`medical_device_id`),
  KEY `alerts_sensor_id_foreign` (`sensor_id`),
  KEY `alerts_prediction_id_foreign` (`prediction_id`),
  KEY `alerts_acknowledged_by_foreign` (`acknowledged_by`),
  CONSTRAINT `alerts_acknowledged_by_foreign` FOREIGN KEY (`acknowledged_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `alerts_medical_device_id_foreign` FOREIGN KEY (`medical_device_id`) REFERENCES `medical_devices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alerts_prediction_id_foreign` FOREIGN KEY (`prediction_id`) REFERENCES `predictions` (`id`) ON DELETE SET NULL,
  CONSTRAINT `alerts_sensor_id_foreign` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.alerts : ~0 rows (environ)

-- Listage de la structure de table detect_panne. cache
CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.cache : ~3 rows (environ)
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
	('laravel-cache-a6f155de15268698bea3ed1df3f9aab3', 'i:1;', 1766404697),
	('laravel-cache-a6f155de15268698bea3ed1df3f9aab3:timer', 'i:1766404697;', 1766404697),
	('laravel-cache-boost.roster.scan', 'a:2:{s:6:"roster";O:21:"Laravel\\Roster\\Roster":3:{s:13:"\0*\0approaches";O:29:"Illuminate\\Support\\Collection":2:{s:8:"\0*\0items";a:1:{i:0;O:23:"Laravel\\Roster\\Approach":1:{s:11:"\0*\0approach";E:38:"Laravel\\Roster\\Enums\\Approaches:ACTION";}}s:28:"\0*\0escapeWhenCastingToString";b:0;}s:11:"\0*\0packages";O:32:"Laravel\\Roster\\PackageCollection":2:{s:8:"\0*\0items";a:20:{i:0;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:4:"^2.0";s:10:"\0*\0package";E:37:"Laravel\\Roster\\Enums\\Packages:INERTIA";s:14:"\0*\0packageName";s:25:"inertiajs/inertia-laravel";s:10:"\0*\0version";s:6:"2.0.16";s:6:"\0*\0dev";b:0;}i:1;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:4:"^2.0";s:10:"\0*\0package";E:45:"Laravel\\Roster\\Enums\\Packages:INERTIA_LARAVEL";s:14:"\0*\0packageName";s:25:"inertiajs/inertia-laravel";s:10:"\0*\0version";s:6:"2.0.16";s:6:"\0*\0dev";b:0;}i:2;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:5:"^1.30";s:10:"\0*\0package";E:37:"Laravel\\Roster\\Enums\\Packages:FORTIFY";s:14:"\0*\0packageName";s:15:"laravel/fortify";s:10:"\0*\0version";s:6:"1.33.0";s:6:"\0*\0dev";b:0;}i:3;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:5:"^12.0";s:10:"\0*\0package";E:37:"Laravel\\Roster\\Enums\\Packages:LARAVEL";s:14:"\0*\0packageName";s:17:"laravel/framework";s:10:"\0*\0version";s:7:"12.43.1";s:6:"\0*\0dev";b:0;}i:4;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:6:"v0.3.8";s:10:"\0*\0package";E:37:"Laravel\\Roster\\Enums\\Packages:PROMPTS";s:14:"\0*\0packageName";s:15:"laravel/prompts";s:10:"\0*\0version";s:5:"0.3.8";s:6:"\0*\0dev";b:0;}i:5;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:4:"^4.0";s:10:"\0*\0package";E:37:"Laravel\\Roster\\Enums\\Packages:SANCTUM";s:14:"\0*\0packageName";s:15:"laravel/sanctum";s:10:"\0*\0version";s:5:"4.2.1";s:6:"\0*\0dev";b:0;}i:6;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:6:"^0.1.9";s:10:"\0*\0package";E:39:"Laravel\\Roster\\Enums\\Packages:WAYFINDER";s:14:"\0*\0packageName";s:17:"laravel/wayfinder";s:10:"\0*\0version";s:6:"0.1.12";s:6:"\0*\0dev";b:0;}i:7;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:6:"^0.1.9";s:10:"\0*\0package";E:47:"Laravel\\Roster\\Enums\\Packages:WAYFINDER_LARAVEL";s:14:"\0*\0packageName";s:17:"laravel/wayfinder";s:10:"\0*\0version";s:6:"0.1.12";s:6:"\0*\0dev";b:0;}i:8;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:6:"v0.5.1";s:10:"\0*\0package";E:33:"Laravel\\Roster\\Enums\\Packages:MCP";s:14:"\0*\0packageName";s:11:"laravel/mcp";s:10:"\0*\0version";s:5:"0.5.1";s:6:"\0*\0dev";b:1;}i:9;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:5:"^1.24";s:10:"\0*\0package";E:34:"Laravel\\Roster\\Enums\\Packages:PINT";s:14:"\0*\0packageName";s:12:"laravel/pint";s:10:"\0*\0version";s:6:"1.26.0";s:6:"\0*\0dev";b:1;}i:10;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:5:"^1.41";s:10:"\0*\0package";E:34:"Laravel\\Roster\\Enums\\Packages:SAIL";s:14:"\0*\0packageName";s:12:"laravel/sail";s:10:"\0*\0version";s:6:"1.51.0";s:6:"\0*\0dev";b:1;}i:11;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:1;s:13:"\0*\0constraint";s:7:"^11.5.3";s:10:"\0*\0package";E:37:"Laravel\\Roster\\Enums\\Packages:PHPUNIT";s:14:"\0*\0packageName";s:15:"phpunit/phpunit";s:10:"\0*\0version";s:7:"11.5.46";s:6:"\0*\0dev";b:1;}i:12;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";r:13;s:14:"\0*\0packageName";s:16:"@inertiajs/react";s:10:"\0*\0version";s:5:"2.1.4";s:6:"\0*\0dev";b:0;}i:13;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";E:43:"Laravel\\Roster\\Enums\\Packages:INERTIA_REACT";s:14:"\0*\0packageName";s:16:"@inertiajs/react";s:10:"\0*\0version";s:5:"2.1.4";s:6:"\0*\0dev";b:0;}i:14;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";E:35:"Laravel\\Roster\\Enums\\Packages:REACT";s:14:"\0*\0packageName";s:5:"react";s:10:"\0*\0version";s:6:"19.2.3";s:6:"\0*\0dev";b:0;}i:15;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";E:41:"Laravel\\Roster\\Enums\\Packages:TAILWINDCSS";s:14:"\0*\0packageName";s:11:"tailwindcss";s:10:"\0*\0version";s:6:"4.1.12";s:6:"\0*\0dev";b:0;}i:16;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";r:55;s:14:"\0*\0packageName";s:30:"@laravel/vite-plugin-wayfinder";s:10:"\0*\0version";s:5:"0.1.3";s:6:"\0*\0dev";b:1;}i:17;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";E:44:"Laravel\\Roster\\Enums\\Packages:WAYFINDER_VITE";s:14:"\0*\0packageName";s:30:"@laravel/vite-plugin-wayfinder";s:10:"\0*\0version";s:5:"0.1.3";s:6:"\0*\0dev";b:1;}i:18;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";E:36:"Laravel\\Roster\\Enums\\Packages:ESLINT";s:14:"\0*\0packageName";s:6:"eslint";s:10:"\0*\0version";s:6:"9.33.0";s:6:"\0*\0dev";b:1;}i:19;O:22:"Laravel\\Roster\\Package":6:{s:9:"\0*\0direct";b:0;s:13:"\0*\0constraint";s:0:"";s:10:"\0*\0package";E:38:"Laravel\\Roster\\Enums\\Packages:PRETTIER";s:14:"\0*\0packageName";s:8:"prettier";s:10:"\0*\0version";s:5:"3.6.2";s:6:"\0*\0dev";b:1;}}s:28:"\0*\0escapeWhenCastingToString";b:0;}s:21:"\0*\0nodePackageManager";E:43:"Laravel\\Roster\\Enums\\NodePackageManager:NPM";}s:9:"timestamp";i:1766392958;}', 1766479358);

-- Listage de la structure de table detect_panne. cache_locks
CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.cache_locks : ~0 rows (environ)

-- Listage de la structure de table detect_panne. failed_jobs
CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `connection` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `queue` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `exception` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.failed_jobs : ~0 rows (environ)

-- Listage de la structure de table detect_panne. jobs
CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `attempts` tinyint unsigned NOT NULL,
  `reserved_at` int unsigned DEFAULT NULL,
  `available_at` int unsigned NOT NULL,
  `created_at` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.jobs : ~0 rows (environ)

-- Listage de la structure de table detect_panne. job_batches
CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `total_jobs` int NOT NULL,
  `pending_jobs` int NOT NULL,
  `failed_jobs` int NOT NULL,
  `failed_job_ids` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `options` mediumtext COLLATE utf8mb4_unicode_ci,
  `cancelled_at` int DEFAULT NULL,
  `created_at` int NOT NULL,
  `finished_at` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.job_batches : ~0 rows (environ)

-- Listage de la structure de table detect_panne. medical_devices
CREATE TABLE IF NOT EXISTS `medical_devices` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `manufacturer` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serial_number` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `installation_date` date NOT NULL,
  `location` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('active','inactive','maintenance','faulty') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `description` text COLLATE utf8mb4_unicode_ci,
  `esp32_device_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_sync_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `medical_devices_name_unique` (`name`),
  UNIQUE KEY `medical_devices_serial_number_unique` (`serial_number`),
  UNIQUE KEY `medical_devices_esp32_device_id_unique` (`esp32_device_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.medical_devices : ~5 rows (environ)
INSERT INTO `medical_devices` (`id`, `name`, `model`, `manufacturer`, `serial_number`, `installation_date`, `location`, `status`, `description`, `esp32_device_id`, `last_sync_at`, `created_at`, `updated_at`) VALUES
	(1, 'MRI Scanner Magnetom Vida', 'Magnetom Vida 3T', 'Siemens Healthineers', 'SN-9JHWGZD6', '2025-03-20', 'Radiology - Room 101', 'active', 'Critical medical equipment located in Radiology - Room 101.', NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(2, 'IntelliVue MX800 Monitor', 'MX800', 'Philips Healthcare', 'SN-ATMES8QM', '2024-05-20', 'ICU - Bed 4', 'active', 'Critical medical equipment located in ICU - Bed 4.', NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(3, 'Alaris System Infusion Pump', '8015 PC Unit', 'BD Medical', 'SN-OAFIVFNU', '2025-12-12', 'Oncology - Ward 3', 'active', 'Critical medical equipment located in Oncology - Ward 3.', NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-22 10:47:35'),
	(4, 'Carestation 650 Anesthesia', 'CS650', 'GE Healthcare', 'SN-U5ZQYAJI', '2022-06-20', 'OR - Suite A', 'active', 'Critical medical equipment located in OR - Suite A.', NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(5, 'Defibrillator LifePak 15', 'LP15', 'Stryker', 'SN-GRXS8DSL', '2021-02-20', 'Emergency Room', 'active', 'Critical medical equipment located in Emergency Room.', NULL, '2025-12-20 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(6, 'Incubateur néonatal', 'DRAGER', 'DRAGER', 'SN-0511-ieri-2330', '2021-04-25', 'maternité', 'active', NULL, 'ESP32-0001', NULL, '2025-12-20 06:18:53', '2025-12-20 06:18:53');

-- Listage de la structure de table detect_panne. migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.migrations : ~0 rows (environ)
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '0001_01_01_000000_create_users_table', 1),
	(2, '0001_01_01_000001_create_cache_table', 1),
	(3, '0001_01_01_000002_create_jobs_table', 1),
	(4, '2025_08_26_100418_add_two_factor_columns_to_users_table', 1),
	(5, '2025_12_19_194145_create_medical_devices_table', 1),
	(6, '2025_12_19_194147_create_sensors_table', 1),
	(7, '2025_12_19_194148_create_sensor_readings_table', 1),
	(8, '2025_12_19_194149_create_prediction_providers_table', 1),
	(9, '2025_12_19_194150_create_predictions_table', 1),
	(10, '2025_12_19_194152_create_alerts_table', 1),
	(11, '2025_12_19_215503_create_personal_access_tokens_table', 1);

-- Listage de la structure de table detect_panne. password_reset_tokens
CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.password_reset_tokens : ~0 rows (environ)

-- Listage de la structure de table detect_panne. personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  KEY `personal_access_tokens_expires_at_index` (`expires_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.personal_access_tokens : ~0 rows (environ)

-- Listage de la structure de table detect_panne. predictions
CREATE TABLE IF NOT EXISTS `predictions` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `medical_device_id` bigint unsigned NOT NULL,
  `provider_id` bigint unsigned NOT NULL,
  `analysis_period_start` timestamp NOT NULL,
  `analysis_period_end` timestamp NOT NULL,
  `prediction_result` json NOT NULL,
  `failure_probability` decimal(5,2) NOT NULL,
  `predicted_failure_date` timestamp NULL DEFAULT NULL,
  `risk_level` enum('low','medium','high','critical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `recommendations` json NOT NULL,
  `confidence_score` decimal(5,2) DEFAULT NULL,
  `generation_time` int NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `predictions_medical_device_id_foreign` (`medical_device_id`),
  KEY `predictions_provider_id_foreign` (`provider_id`),
  CONSTRAINT `predictions_medical_device_id_foreign` FOREIGN KEY (`medical_device_id`) REFERENCES `medical_devices` (`id`) ON DELETE CASCADE,
  CONSTRAINT `predictions_provider_id_foreign` FOREIGN KEY (`provider_id`) REFERENCES `prediction_providers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.predictions : ~3 rows (environ)
INSERT INTO `predictions` (`id`, `medical_device_id`, `provider_id`, `analysis_period_start`, `analysis_period_end`, `prediction_result`, `failure_probability`, `predicted_failure_date`, `risk_level`, `recommendations`, `confidence_score`, `generation_time`, `created_at`, `updated_at`) VALUES
	(1, 3, 3, '2025-11-20 03:34:58', '2025-12-20 03:34:58', '{"summary": "Detected potential recurring voltage spike."}', 87.00, NULL, 'high', '["Check power supply unit", "Inspect capacitor banks", "Schedule maintenance"]', 91.00, 1778, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(2, 4, 1, '2025-11-20 14:39:49', '2025-12-20 14:39:49', '{"details": "Sensor data analysis indicates a critical risk level based on recent trends.", "summary": "Analysis of Carestation 650 Anesthesia completed."}', 89.00, '2026-01-21 14:39:49', 'critical', '[{"action": "Schedule maintenance inspection immediately.", "priority": "high"}, {"action": "Check voltage regulator stability.", "priority": "medium"}, {"action": "Calibrate temperature sensors.", "priority": "medium"}]', 81.00, 1122, '2025-12-20 14:39:49', '2025-12-20 14:39:49'),
	(3, 3, 1, '2025-11-21 10:12:45', '2025-12-21 10:12:45', '{"summary": "Analysis of Alaris System Infusion Pump completed with risk assessment: critical.", "report_content": "## **DIAGNOSTIC REPORT: Alaris System Infusion Pump**\\n**Date:** 2025-12-21 11:12\\n**Serial Number:** SN-OAFIVFNU\\n**Analyzed Period:** Last 30 Days\\n\\n### **1. EXECUTIVE SUMMARY**\\nThe predictive maintenance algorithms have processed telemetry data for the specified period. The analysis indicates a **critical** probability of component degradation. Immediate attention is recommended to prevent unplanned downtime.\\n\\n### **2. DETAILED SENSOR ANALYSIS**\\n- **Vibration Analysis (VIB-01):** Detected irregular high-frequency oscillations (120Hz harmonics) in the primary drive coupling. Amplitude has increased by 18% over the baseline, suggesting early-stage bearing wear or misalignment.\\n- **Thermal Efficiency (TH-04):** Operating temperature of the power supply unit has drifted +2.5°C above nominal average. This correlates with peak load periods, indicating potential cooling system obstruction or thermal paste degradation.\\n- **Power Quality (VOLT-MAIN):** Voltage fluctuations detected within acceptable margin (±2%), but frequency stability shows micro-variations correlated with vibration spikes.\\n\\n### **3. ROOT CAUSE PROBABILITY**\\n- **Primary Suspect:** Bearing Assembly (Prob: 85%)\\n- **Secondary Suspect:** Cooling Fan Module (Prob: 45%)\\n- **Contributing Factor:** High Duty Cycle (>90%) in last 48h.\\n\\n### **4. PROJECTED IMPACT**\\nIf left unaddressed, the likelihood of critical failure increases exponentially. Projected Mean Time To Failure (MTTF) is currently estimated at -10.999999993368 days given current usage patterns."}', 88.00, '2026-01-01 10:12:45', 'critical', '[{"action": "Schedule maintenance inspection immediately.", "priority": "high"}, {"action": "Check voltage regulator stability.", "priority": "medium"}, {"action": "Calibrate temperature sensors.", "priority": "medium"}]', 93.00, 423, '2025-12-21 10:12:45', '2025-12-21 10:12:45'),
	(4, 5, 1, '2025-11-22 11:03:09', '2025-12-22 11:03:09', '{"summary": "Analysis of Defibrillator LifePak 15 completed with risk assessment: medium.", "report_content": "## **DIAGNOSTIC REPORT: Defibrillator LifePak 15**\\n**Date:** 2025-12-22 12:03\\n**Serial Number:** SN-GRXS8DSL\\n**Analyzed Period:** Last 30 Days\\n\\n### **1. EXECUTIVE SUMMARY**\\nThe predictive maintenance algorithms have processed telemetry data for the specified period. The analysis indicates a **medium** probability of component degradation. Immediate attention is recommended to prevent unplanned downtime.\\n\\n### **2. DETAILED SENSOR ANALYSIS**\\n- **Vibration Analysis (VIB-01):** Detected irregular high-frequency oscillations (120Hz harmonics) in the primary drive coupling. Amplitude has increased by 18% over the baseline, suggesting early-stage bearing wear or misalignment.\\n- **Thermal Efficiency (TH-04):** Operating temperature of the power supply unit has drifted +2.5°C above nominal average. This correlates with peak load periods, indicating potential cooling system obstruction or thermal paste degradation.\\n- **Power Quality (VOLT-MAIN):** Voltage fluctuations detected within acceptable margin (±2%), but frequency stability shows micro-variations correlated with vibration spikes.\\n\\n### **3. ROOT CAUSE PROBABILITY**\\n- **Primary Suspect:** Bearing Assembly (Prob: 85%)\\n- **Secondary Suspect:** Cooling Fan Module (Prob: 45%)\\n- **Contributing Factor:** High Duty Cycle (>90%) in last 48h.\\n\\n### **4. PROJECTED IMPACT**\\nIf left unaddressed, the likelihood of critical failure increases exponentially. Projected Mean Time To Failure (MTTF) is currently estimated at indefinite given current usage patterns."}', 22.00, NULL, 'medium', '[{"action": "Routine maintenance only.", "priority": "low"}, {"action": "Continue monitoring vibration levels.", "priority": "low"}]', 86.00, 967, '2025-12-22 11:03:09', '2025-12-22 11:03:09');

-- Listage de la structure de table detect_panne. prediction_providers
CREATE TABLE IF NOT EXISTS `prediction_providers` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('cloud_api','local_llm','python_model') COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `is_default` tinyint(1) NOT NULL DEFAULT '0',
  `priority` int NOT NULL DEFAULT '0',
  `config` text COLLATE utf8mb4_unicode_ci,
  `last_tested_at` timestamp NULL DEFAULT NULL,
  `last_test_status` enum('success','failed') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_test_response_time` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prediction_providers_name_unique` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.prediction_providers : ~3 rows (environ)
INSERT INTO `prediction_providers` (`id`, `name`, `type`, `provider`, `is_active`, `is_default`, `priority`, `config`, `last_tested_at`, `last_test_status`, `last_test_response_time`, `created_at`, `updated_at`) VALUES
	(1, 'Mistralai/devstral-2512:free', 'cloud_api', 'openrouter', 1, 0, 1, 'eyJpdiI6ImN4ZDY0bVh1YjhPV0NJRThqNytDeFE9PSIsInZhbHVlIjoiUWhGUE4yTHlCSWFJTXdaSEl2Rm16MHgzVlpWUVNZZTV3RUNMdFB4a0FDa2lUOTdoTzBVNSs2R0ZIclpvR3ZBUFh1TGVhcWhtaTNnLzAvV0lYRlhRazA2Tnd1d24wSlhSemRLQWNBdGNoVE1ja3NuMjdPbWlqSUU1bjNpbG04NkZYYXNsaURvNzJUa3ZzdHZoUlJHTTVHc1ZsdmRYSU9zVDJBYnN0TkFnNW1WbmFza0h5MVFKMWgzKzV1R1hjU1BQek1UVHJPTFVpaExkaGt1RXNNYi9RNnpSTFZabnc3eDN4K29ZWE5NaXB2QT0iLCJtYWMiOiIxNjdjNTViMGFkZGU4MjMzNGVjMjk2NWNhNTNlZmRlODZmMzE0ODdjNDJlMGYwMTUwNDkwOWU0ODZkMGRkYWRlIiwidGFnIjoiIn0=', NULL, NULL, NULL, '2025-12-20 03:34:58', '2025-12-20 03:37:16'),
	(2, 'Local Llama 3.2 Medical', 'local_llm', 'ollama', 1, 0, 5, NULL, NULL, NULL, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(3, 'Maintenance Predictor (RF)', 'python_model', 'python', 1, 0, 10, NULL, NULL, NULL, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58');

-- Listage de la structure de table detect_panne. sensors
CREATE TABLE IF NOT EXISTS `sensors` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `medical_device_id` bigint unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `unit` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `min_normal_value` decimal(10,2) DEFAULT NULL,
  `max_normal_value` decimal(10,2) DEFAULT NULL,
  `critical_min_value` decimal(10,2) DEFAULT NULL,
  `critical_max_value` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `pin_number` int DEFAULT NULL,
  `polling_interval` int NOT NULL DEFAULT '60',
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sensors_medical_device_id_foreign` (`medical_device_id`),
  CONSTRAINT `sensors_medical_device_id_foreign` FOREIGN KEY (`medical_device_id`) REFERENCES `medical_devices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.sensors : ~18 rows (environ)
INSERT INTO `sensors` (`id`, `medical_device_id`, `name`, `type`, `unit`, `min_normal_value`, `max_normal_value`, `critical_min_value`, `critical_max_value`, `is_active`, `pin_number`, `polling_interval`, `description`, `created_at`, `updated_at`) VALUES
	(1, 1, 'Helium Level', 'level', '%', 40.00, 100.00, 20.00, 100.00, 1, 23, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(2, 1, 'Magnet Pressure', 'pressure', 'Bar', 1.20, 1.50, 1.00, 1.80, 1, 25, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(3, 1, 'Gradient Coil Temp', 'temperature', '°C', 18.00, 24.00, 15.00, 30.00, 1, 14, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(4, 2, 'CPU Temperature', 'temperature', '°C', 35.00, 65.00, 10.00, 85.00, 1, 25, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(5, 2, 'Battery Health', 'battery', '%', 80.00, 100.00, 40.00, 100.00, 1, 12, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(6, 2, 'Network Latency', 'network', 'ms', 0.00, 50.00, 0.00, 200.00, 1, 26, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(7, 3, 'Motor Voltage', 'voltage', 'V', 11.50, 12.50, 10.00, 14.00, 1, 40, 30, NULL, '2025-12-20 03:34:58', '2025-12-22 10:47:35'),
	(8, 3, 'Line Back-Pressure', 'pressure', 'psi', 0.00, 10.00, 0.00, 15.00, 1, 39, 30, NULL, '2025-12-20 03:34:58', '2025-12-22 10:47:35'),
	(9, 3, 'Battery Charge', 'battery', '%', 20.00, 100.00, 5.00, 100.00, 1, 17, 30, NULL, '2025-12-20 03:34:58', '2025-12-22 10:47:35'),
	(10, 4, 'Gas Flow Rate', 'flow', 'L/min', 0.50, 10.00, 0.00, 15.00, 1, 39, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(11, 4, 'Vaporizer Pressure', 'pressure', 'kPa', 95.00, 105.00, 80.00, 120.00, 1, 20, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(12, 4, 'O2 Cell Voltage', 'voltage', 'mV', 10.00, 60.00, 5.00, 70.00, 1, 16, 30, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(13, 5, 'Capacitor Charge Time', 'time', 'ms', 100.00, 5000.00, 50.00, 8000.00, 1, 28, 30, NULL, '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(14, 5, 'Battery Voltage', 'voltage', 'V', 12.00, 14.40, 10.00, 15.00, 1, 26, 30, NULL, '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(15, 5, 'Electrode Impedance', 'impedance', 'Ohm', 20.00, 200.00, 0.00, 300.00, 1, 20, 30, NULL, '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(16, 6, 'Capteur de température', 'temperature', '°C', 36.50, 37.50, NULL, NULL, 1, 15, 60, NULL, '2025-12-20 06:18:53', '2025-12-20 06:18:53'),
	(17, 6, 'Humidité', 'humidity', '%', 60.00, 100.00, NULL, NULL, 1, 14, 60, NULL, '2025-12-20 06:18:53', '2025-12-20 06:18:53'),
	(18, 6, 'Cycle de fonctionnement', 'other', 'Cycles', 0.00, 1000000.00, NULL, NULL, 1, 1, 60, NULL, '2025-12-20 06:18:53', '2025-12-20 06:18:53'),
	(19, 6, 'Heures de fonctionnement', 'other', 'H', 0.00, 1000000.00, NULL, NULL, 1, 2, 60, NULL, '2025-12-20 06:18:53', '2025-12-20 06:18:53'),
	(20, 6, 'Capteur de tension', 'voltage', 'V', 110.00, 250.00, NULL, NULL, 1, 34, 60, NULL, '2025-12-20 06:18:53', '2025-12-20 06:18:53');

-- Listage de la structure de table detect_panne. sensor_readings
CREATE TABLE IF NOT EXISTS `sensor_readings` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sensor_id` bigint unsigned NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `status` enum('normal','warning','critical') COLLATE utf8mb4_unicode_ci NOT NULL,
  `recorded_at` timestamp NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `sensor_readings_sensor_id_recorded_at_index` (`sensor_id`,`recorded_at`),
  CONSTRAINT `sensor_readings_sensor_id_foreign` FOREIGN KEY (`sensor_id`) REFERENCES `sensors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=301 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.sensor_readings : ~300 rows (environ)
INSERT INTO `sensor_readings` (`id`, `sensor_id`, `value`, `status`, `recorded_at`, `created_at`, `updated_at`) VALUES
	(1, 1, 81.52, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(2, 1, 62.32, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(3, 1, 60.88, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(4, 1, 68.56, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(5, 1, 61.36, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(6, 1, 81.04, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(7, 1, 66.64, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(8, 1, 65.44, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(9, 1, 63.04, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(10, 1, 73.84, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(11, 1, 69.04, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(12, 1, 72.16, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(13, 1, 73.60, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(14, 1, 73.84, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(15, 1, 61.60, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(16, 1, 73.84, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(17, 1, 66.88, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(18, 1, 69.52, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(19, 1, 72.88, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(20, 1, 59.20, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(21, 2, 1.38, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(22, 2, 1.30, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(23, 2, 1.38, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(24, 2, 1.37, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(25, 2, 1.29, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(26, 2, 1.31, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(27, 2, 1.34, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(28, 2, 1.30, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(29, 2, 1.38, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(30, 2, 1.38, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(31, 2, 1.29, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(32, 2, 1.39, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(33, 2, 1.38, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(34, 2, 1.38, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(35, 2, 1.34, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(36, 2, 1.38, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(37, 2, 1.29, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(38, 2, 1.29, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(39, 2, 1.40, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(40, 2, 1.39, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(41, 3, 20.16, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(42, 3, 20.04, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(43, 3, 21.70, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(44, 3, 21.98, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(45, 3, 20.23, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(46, 3, 21.84, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(47, 3, 20.26, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(48, 3, 20.47, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(49, 3, 21.79, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(50, 3, 21.19, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(51, 3, 20.83, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(52, 3, 20.62, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(53, 3, 22.15, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(54, 3, 20.21, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(55, 3, 21.72, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(56, 3, 19.94, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(57, 3, 20.30, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(58, 3, 20.81, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(59, 3, 22.10, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(60, 3, 20.54, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(61, 4, 54.44, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(62, 4, 50.72, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(63, 4, 55.40, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(64, 4, 47.24, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(65, 4, 45.92, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(66, 4, 44.12, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(67, 4, 53.12, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(68, 4, 47.24, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(69, 4, 52.28, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(70, 4, 55.64, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(71, 4, 46.76, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(72, 4, 53.96, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(73, 4, 48.80, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(74, 4, 50.12, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(75, 4, 52.04, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(76, 4, 49.04, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(77, 4, 47.24, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(78, 4, 48.56, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(79, 4, 55.28, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(80, 4, 53.36, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(81, 5, 86.72, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(82, 5, 89.04, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(83, 5, 86.32, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(84, 5, 87.20, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(85, 5, 88.00, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(86, 5, 89.92, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(87, 5, 86.40, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(88, 5, 93.20, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(89, 5, 93.92, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(90, 5, 92.88, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(91, 5, 94.00, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(92, 5, 92.96, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(93, 5, 93.60, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(94, 5, 86.88, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(95, 5, 91.36, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(96, 5, 93.20, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(97, 5, 88.24, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(98, 5, 93.12, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(99, 5, 87.92, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(100, 5, 88.72, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(101, 6, 32.20, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(102, 6, 24.80, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(103, 6, 33.20, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(104, 6, 31.60, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(105, 6, 27.80, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(106, 6, 26.40, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(107, 6, 26.40, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(108, 6, 26.80, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(109, 6, 29.60, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(110, 6, 18.60, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(111, 6, 22.40, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(112, 6, 32.00, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(113, 6, 21.60, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(114, 6, 17.00, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(115, 6, 32.40, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(116, 6, 33.00, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(117, 6, 18.80, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(118, 6, 30.80, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(119, 6, 31.40, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(120, 6, 31.20, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(121, 7, 12.09, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(122, 7, 12.13, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(123, 7, 12.13, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(124, 7, 12.16, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(125, 7, 12.16, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(126, 7, 12.08, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(127, 7, 11.94, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(128, 7, 11.89, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(129, 7, 12.09, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(130, 7, 11.88, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(131, 7, 11.92, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(132, 7, 11.87, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(133, 7, 11.88, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(134, 7, 12.16, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(135, 7, 11.80, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(136, 7, 12.06, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(137, 7, 12.14, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(138, 7, 12.19, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(139, 7, 11.81, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(140, 7, 12.15, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(141, 8, 4.76, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(142, 8, 4.56, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(143, 8, 6.60, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(144, 8, 5.24, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(145, 8, 6.64, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(146, 8, 3.48, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(147, 8, 6.76, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(148, 8, 7.00, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(149, 8, 6.32, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(150, 8, 6.96, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(151, 8, 3.44, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(152, 8, 6.88, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(153, 8, 4.24, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(154, 8, 3.88, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(155, 8, 5.04, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(156, 8, 6.60, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(157, 8, 3.64, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(158, 8, 5.24, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(159, 8, 4.80, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(160, 8, 3.80, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(161, 9, 49.76, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(162, 9, 57.12, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(163, 9, 50.08, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(164, 9, 58.72, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(165, 9, 64.16, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(166, 9, 58.40, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(167, 9, 47.20, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(168, 9, 49.12, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(169, 9, 45.28, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(170, 9, 60.32, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(171, 9, 45.28, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(172, 9, 66.40, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(173, 9, 48.16, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(174, 9, 47.20, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(175, 9, 73.76, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(176, 9, 57.44, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(177, 9, 45.28, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(178, 9, 68.96, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(179, 9, 62.88, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(180, 9, 44.64, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(181, 10, 3.39, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(182, 10, 4.68, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(183, 10, 5.44, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(184, 10, 5.59, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(185, 10, 4.53, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(186, 10, 5.06, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(187, 10, 5.71, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(188, 10, 5.44, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(189, 10, 7.15, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(190, 10, 6.62, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(191, 10, 6.28, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(192, 10, 7.11, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(193, 10, 5.29, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(194, 10, 5.25, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(195, 10, 5.21, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(196, 10, 4.68, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(197, 10, 7.04, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(198, 10, 6.31, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(199, 10, 5.25, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(200, 10, 4.87, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(201, 11, 98.72, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(202, 11, 98.96, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(203, 11, 98.24, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(204, 11, 99.76, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(205, 11, 99.04, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(206, 11, 100.96, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(207, 11, 98.28, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(208, 11, 98.52, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(209, 11, 99.72, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(210, 11, 98.76, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(211, 11, 99.52, 'normal', '2025-12-18 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(212, 11, 98.00, 'normal', '2025-12-18 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(213, 11, 98.32, 'normal', '2025-12-18 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(214, 11, 101.28, 'normal', '2025-12-17 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(215, 11, 101.96, 'normal', '2025-12-17 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(216, 11, 101.44, 'normal', '2025-12-17 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(217, 11, 99.76, 'normal', '2025-12-17 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(218, 11, 99.96, 'normal', '2025-12-17 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(219, 11, 101.84, 'normal', '2025-12-17 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(220, 11, 99.76, 'normal', '2025-12-16 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(221, 12, 43.20, 'normal', '2025-12-20 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(222, 12, 28.00, 'normal', '2025-12-19 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(223, 12, 37.80, 'normal', '2025-12-19 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(224, 12, 37.20, 'normal', '2025-12-19 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(225, 12, 40.20, 'normal', '2025-12-19 11:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(226, 12, 31.40, 'normal', '2025-12-19 07:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(227, 12, 34.20, 'normal', '2025-12-19 03:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(228, 12, 38.20, 'normal', '2025-12-18 23:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(229, 12, 44.00, 'normal', '2025-12-18 19:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(230, 12, 28.20, 'normal', '2025-12-18 15:34:58', '2025-12-20 03:34:58', '2025-12-20 03:34:58'),
	(231, 12, 42.40, 'normal', '2025-12-18 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(232, 12, 40.00, 'normal', '2025-12-18 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(233, 12, 37.40, 'normal', '2025-12-18 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(234, 12, 28.40, 'normal', '2025-12-17 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(235, 12, 41.80, 'normal', '2025-12-17 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(236, 12, 36.00, 'normal', '2025-12-17 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(237, 12, 37.80, 'normal', '2025-12-17 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(238, 12, 44.00, 'normal', '2025-12-17 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(239, 12, 40.60, 'normal', '2025-12-17 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(240, 12, 32.00, 'normal', '2025-12-16 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(241, 13, 2256.00, 'normal', '2025-12-20 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(242, 13, 2667.60, 'normal', '2025-12-19 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(243, 13, 3000.80, 'normal', '2025-12-19 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(244, 13, 2275.60, 'normal', '2025-12-19 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(245, 13, 2589.20, 'normal', '2025-12-19 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(246, 13, 2785.20, 'normal', '2025-12-19 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(247, 13, 3314.40, 'normal', '2025-12-19 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(248, 13, 2295.20, 'normal', '2025-12-18 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(249, 13, 2883.20, 'normal', '2025-12-18 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(250, 13, 2216.80, 'normal', '2025-12-18 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(251, 13, 3294.80, 'normal', '2025-12-18 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(252, 13, 2197.20, 'normal', '2025-12-18 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(253, 13, 3530.00, 'normal', '2025-12-18 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(254, 13, 3236.00, 'normal', '2025-12-17 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(255, 13, 1824.80, 'normal', '2025-12-17 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(256, 13, 2863.60, 'normal', '2025-12-17 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(257, 13, 2844.00, 'normal', '2025-12-17 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(258, 13, 2118.80, 'normal', '2025-12-17 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(259, 13, 2510.80, 'normal', '2025-12-17 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(260, 13, 3196.80, 'normal', '2025-12-16 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(261, 14, 13.45, 'normal', '2025-12-20 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(262, 14, 13.05, 'normal', '2025-12-19 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(263, 14, 13.31, 'normal', '2025-12-19 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(264, 14, 13.13, 'normal', '2025-12-19 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(265, 14, 13.20, 'normal', '2025-12-19 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(266, 14, 13.40, 'normal', '2025-12-19 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(267, 14, 13.23, 'normal', '2025-12-19 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(268, 14, 13.62, 'normal', '2025-12-18 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(269, 14, 13.35, 'normal', '2025-12-18 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(270, 14, 13.51, 'normal', '2025-12-18 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(271, 14, 13.29, 'normal', '2025-12-18 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(272, 14, 13.02, 'normal', '2025-12-18 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(273, 14, 13.24, 'normal', '2025-12-18 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(274, 14, 12.95, 'normal', '2025-12-17 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(275, 14, 13.27, 'normal', '2025-12-17 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(276, 14, 13.41, 'normal', '2025-12-17 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(277, 14, 13.11, 'normal', '2025-12-17 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(278, 14, 13.43, 'normal', '2025-12-17 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(279, 14, 12.84, 'normal', '2025-12-17 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(280, 14, 13.54, 'normal', '2025-12-16 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(281, 15, 87.68, 'normal', '2025-12-20 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(282, 15, 102.80, 'normal', '2025-12-19 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(283, 15, 124.40, 'normal', '2025-12-19 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(284, 15, 88.40, 'normal', '2025-12-19 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(285, 15, 102.80, 'normal', '2025-12-19 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(286, 15, 91.28, 'normal', '2025-12-19 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(287, 15, 99.92, 'normal', '2025-12-19 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(288, 15, 109.28, 'normal', '2025-12-18 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(289, 15, 92.00, 'normal', '2025-12-18 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(290, 15, 88.40, 'normal', '2025-12-18 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(291, 15, 78.32, 'normal', '2025-12-18 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(292, 15, 135.92, 'normal', '2025-12-18 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(293, 15, 94.16, 'normal', '2025-12-18 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(294, 15, 132.32, 'normal', '2025-12-17 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(295, 15, 108.56, 'normal', '2025-12-17 19:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(296, 15, 117.20, 'normal', '2025-12-17 15:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(297, 15, 88.40, 'normal', '2025-12-17 11:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(298, 15, 109.28, 'normal', '2025-12-17 07:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(299, 15, 122.24, 'normal', '2025-12-17 03:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59'),
	(300, 15, 91.28, 'normal', '2025-12-16 23:34:59', '2025-12-20 03:34:59', '2025-12-20 03:34:59');

-- Listage de la structure de table detect_panne. sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` bigint unsigned DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `payload` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `last_activity` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.sessions : ~2 rows (environ)
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
	('VYOVKJstZrazANqh46v7pXpyebfnG2FKaoLH9WjV', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTozOntzOjY6Il90b2tlbiI7czo0MDoiWHlzS0xCUkRMdmcwbTVtS01zUXd0VlRvS1JyRzZTR0lUWFlEYVNYcCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTt9', 1766405346),
	('Y789dssd55DYvBgITn0dcIBeqviV3SLR24MFlH5D', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUE5NMDIzZjhsUjgwdDA1b2RmcjA2N09DNEUzNUQySTBycDJyeWF2ZiI7czozOiJ1cmwiO2E6MTp7czo4OiJpbnRlbmRlZCI7czozOToiaHR0cDovL2xvY2FsaG9zdDo4MDAwL21lZGljYWwtZGV2aWNlcy8zIjt9czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6Mzk6Imh0dHA6Ly9sb2NhbGhvc3Q6ODAwMC9tZWRpY2FsLWRldmljZXMvMyI7czo1OiJyb3V0ZSI7czoyMDoibWVkaWNhbC1kZXZpY2VzLnNob3ciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX19', 1766392416);

-- Listage de la structure de table detect_panne. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table detect_panne.users : ~0 rows (environ)
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES
	(1, 'Test User', 'test@example.com', '2025-12-20 03:34:58', '$2y$12$FKpK2TC2VN63VbmVAX/sa.FtpPRYjwByu3KnIPnYEpo1TFBDt9FYy', NULL, NULL, NULL, NULL, '2025-12-20 03:34:58', '2025-12-20 03:34:58');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
