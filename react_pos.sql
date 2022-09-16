-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 30, 2021 at 09:11 AM
-- Server version: 10.4.13-MariaDB
-- PHP Version: 7.4.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `react_pos`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `category_name` varchar(200) NOT NULL,
  `parent_id` int(11) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `category_name`, `parent_id`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'Others', 0, 0, '2021-05-03 17:05:59', '2021-05-03 17:05:59'),
(2, 'Category 3', 0, 0, '2021-05-03 17:05:59', '2021-05-03 17:05:59'),
(3, 'Category 2', 0, 0, '2021-05-03 17:05:59', '2021-05-03 17:05:59'),
(4, 'Category 1', 0, 0, '2021-05-03 17:05:59', '2021-05-03 17:05:59');

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(200) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `address` varchar(1000) DEFAULT NULL,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `contact`, `address`, `is_deleted`, `created_at`, `updated_at`) VALUES
(1, 'walk-in', '0000000000', '', 0, '2021-04-27 14:25:41', '2021-04-27 14:25:41');

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` int(11) NOT NULL,
  `name` varchar(500) NOT NULL,
  `category_id` int(11) NOT NULL DEFAULT 1,
  `cost_price` varchar(60) NOT NULL DEFAULT '0',
  `selling_price` varchar(60) NOT NULL,
  `img_src` varchar(1000) DEFAULT NULL,
  `in_stock` tinyint(4) NOT NULL DEFAULT 1,
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `category_id`, `cost_price`, `selling_price`, `img_src`, `in_stock`, `is_deleted`, `created_at`, `updated_at`) VALUES
(220, 'Body care combo', 4, '0', '1250', '137600-download.jpg', 1, 0, '2021-05-05 10:42:45', '2021-05-05 10:42:45'),
(221, 'Cleanex (2 bottles)', 1, '450', '500', '78168-pngtree-cleaning-products-on-transparent-background-png-image_4017269.jpg', 1, 0, '2021-05-05 10:46:12', '2021-05-05 10:46:12'),
(222, 'Office folders (Pack of 3)', 1, '0', '100', '455422-three-folders-file-folder-b5m6ym5-600.jpg', 1, 0, '2021-05-05 10:47:12', '2021-05-05 10:47:12'),
(223, 'All out (Refill + Machine + Spray)', 4, '0', '160', '983957-images.jpg', 1, 0, '2021-05-05 10:48:07', '2021-05-05 10:48:07'),
(224, 'Aloevera juice', 4, '0', '320', '412300-aloe-vera-v1.png', 1, 0, '2021-05-05 10:48:41', '2021-05-05 10:48:41'),
(225, 'Godrej Jersey toned milk (500ml)', 4, '0', '25', '278222-a2d181824555999af963c12.png', 1, 0, '2021-05-05 10:49:39', '2021-05-05 10:49:39'),
(226, 'Heritage curd (family pack)', 4, '0', '350', '902394-images.jpg', 1, 0, '2021-05-05 10:50:31', '2021-05-05 10:50:31'),
(227, 'Wire bundle (Copper)', 2, '0', '590', '544757-images.jpg', 1, 0, '2021-05-05 10:51:42', '2021-05-05 10:51:42'),
(228, 'Custom sticker', 2, '0', '90', '671280-bumper-stickers-group.png', 1, 0, '2021-05-05 10:52:47', '2021-05-05 10:52:47'),
(229, 'Milk Bread', 2, '0', '45', '526885-images.jpg', 1, 0, '2021-05-05 10:53:14', '2021-05-05 10:53:14'),
(230, 'Bose ear buds 100WT-T51', 1, '0', '2500', '510009-cq5dam.web.320.320.png', 1, 0, '2021-05-05 10:54:01', '2021-05-05 10:54:01'),
(231, 'Tea tree & Rosemarry oil combo', 1, '0', '999', '438505-combo-3-a.png', 1, 0, '2021-05-05 10:54:53', '2021-05-05 10:54:53'),
(232, 'D-link switch & Camera', 1, '0', '3650', '367034-mydlink_products_2.png', 1, 0, '2021-05-05 10:55:23', '2021-05-05 10:55:23'),
(233, 'Cognex barcode reader', 3, '0', '999', '860437-in-sight-3d-l4000-product-tile.png', 1, 0, '2021-05-05 10:55:47', '2021-05-05 10:55:47'),
(234, 'Nippon Paint Blue - (5 Tubs)', 1, '0', '8000', '107865-product-png.png', 1, 0, '2021-05-05 10:56:39', '2021-05-05 10:56:39'),
(235, 'Hawai Slippers', 1, '0', '150', '502909-download.jpg', 1, 0, '2021-05-05 10:57:23', '2021-05-05 10:57:23'),
(236, 'LED night lampshade', 1, '0', '999', '128629-imgbin-product-design-lighting-angle-shading-single-page-w8cgtq283wsyh7hibs1xg6tnh_t.jpg', 1, 0, '2021-05-05 10:57:58', '2021-05-05 10:57:58'),
(237, 'Fortune besan (500gms)', 1, '0', '50', '971907-images.jpg', 1, 0, '2021-05-05 10:58:28', '2021-05-05 10:58:28'),
(238, 'Pink Nailpolish', 1, '0', '299', '671338-160-1607109_em-cosmetics-serum-blush-hd-png-download.jpg', 1, 0, '2021-05-05 10:59:08', '2021-05-05 10:59:08'),
(239, 'Metal socket ', 1, '0', '50', '620845-single-product-1-226x284.png', 1, 0, '2021-05-05 10:59:38', '2021-05-05 10:59:38'),
(240, 'Omega protein powder', 1, '0', '599', '845793-product-png-images-psds-for-download-pixelsquid-product-png-600_600.jpg', 1, 0, '2021-05-05 11:00:14', '2021-05-05 11:00:14'),
(241, 'Foxin noise cancellation headphones', 2, '0', '3699', '868547-images.jpg', 1, 0, '2021-05-05 11:01:01', '2021-05-05 11:01:01'),
(242, 'Blue padded wooden chair', 4, '0', '2599', '271256-armchair-arm-chair-6360xz2-600.jpg', 1, 0, '2021-05-05 11:01:27', '2021-05-05 11:01:27'),
(243, 'iPhone X back cover', 3, '0', '399', '784212-jp-access-ip11promax-red_back_3000px.png', 1, 0, '2021-05-05 11:02:01', '2021-05-05 11:02:01'),
(244, 'Dettol sanitizer (small)', 1, '0', '25', '86671-images.jpg', 1, 0, '2021-05-05 11:02:39', '2021-05-05 11:02:39'),
(249, 'Gusto juice', 4, '0', '60', '146944-gug-300x300.jpg', 1, 0, '2021-05-20 05:33:17', '2021-05-20 05:33:17');

-- --------------------------------------------------------

--
-- Table structure for table `on_hold_sales`
--

CREATE TABLE `on_hold_sales` (
  `id` int(11) NOT NULL,
  `bill_no` varchar(200) NOT NULL,
  `sub_total` varchar(50) NOT NULL,
  `tax` varchar(20) NOT NULL DEFAULT '0',
  `discount` varchar(20) NOT NULL DEFAULT '0',
  `total` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `on_hold_sales_items`
--

CREATE TABLE `on_hold_sales_items` (
  `id` int(11) NOT NULL,
  `on_hold_sale_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `price` varchar(50) NOT NULL,
  `qty` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `bill_no` varchar(200) NOT NULL,
  `customer_id` varchar(1000) NOT NULL,
  `sub_total` varchar(50) NOT NULL,
  `tax` varchar(20) NOT NULL DEFAULT '0',
  `discount` varchar(20) NOT NULL DEFAULT '0',
  `total` varchar(50) NOT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_deleted` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `bill_no`, `customer_id`, `sub_total`, `tax`, `discount`, `total`, `date`, `is_deleted`, `created_at`, `updated_at`) VALUES
(78, '1624536903765', '1', '2599', '364', '0', '2963', '2021-06-23 18:30:00', 0, '2021-06-24 12:15:16', '2021-06-24 12:15:16'),
(79, '1624876805860', '1', '8005', '1121', '0', '9126', '2021-06-27 18:30:00', 0, '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(80, '1624951666159', '1', '2959', '414', '0', '3373', '2021-06-28 18:30:00', 0, '2021-06-29 07:28:27', '2021-06-29 07:28:27');

-- --------------------------------------------------------

--
-- Table structure for table `sales_items`
--

CREATE TABLE `sales_items` (
  `id` int(11) NOT NULL,
  `sale_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `selling_price` varchar(50) NOT NULL,
  `qty` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sales_items`
--

INSERT INTO `sales_items` (`id`, `sale_id`, `item_id`, `selling_price`, `qty`, `created_at`, `updated_at`) VALUES
(156, 78, 242, '2599', '1', '2021-06-24 12:15:16', '2021-06-24 12:15:16'),
(157, 79, 241, '3699', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(158, 79, 249, '60', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(159, 79, 244, '25', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(160, 79, 243, '399', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(161, 79, 238, '299', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(162, 79, 239, '50', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(163, 79, 240, '599', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(164, 79, 236, '999', '1', '2021-06-28 10:40:18', '2021-06-28 10:40:18'),
(165, 79, 220, '1250', '1', '2021-06-28 10:40:19', '2021-06-28 10:40:19'),
(166, 79, 225, '25', '1', '2021-06-28 10:40:19', '2021-06-28 10:40:19'),
(167, 79, 222, '100', '1', '2021-06-28 10:40:19', '2021-06-28 10:40:19'),
(168, 79, 221, '500', '1', '2021-06-28 10:40:19', '2021-06-28 10:40:19'),
(169, 80, 249, '60', '1', '2021-06-29 07:28:27', '2021-06-29 07:28:27'),
(170, 80, 243, '399', '1', '2021-06-29 07:28:27', '2021-06-29 07:28:27'),
(171, 80, 230, '2500', '1', '2021-06-29 07:28:27', '2021-06-29 07:28:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uname` varchar(100) NOT NULL,
  `passkey` varchar(500) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contact` varchar(100) NOT NULL,
  `api_key` varchar(1000) NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uname`, `passkey`, `name`, `email`, `contact`, `api_key`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin', 'Ankur', 'testg@gmail.com', '8871192502', '21232f297a57a5a743894a0e4a801fc3', 1, '2021-04-24 06:35:49', '2021-04-24 06:35:49');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `on_hold_sales`
--
ALTER TABLE `on_hold_sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `on_hold_sales_items`
--
ALTER TABLE `on_hold_sales_items`
  ADD PRIMARY KEY (`id`) USING BTREE;

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_items`
--
ALTER TABLE `sales_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=252;

--
-- AUTO_INCREMENT for table `on_hold_sales`
--
ALTER TABLE `on_hold_sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `on_hold_sales_items`
--
ALTER TABLE `on_hold_sales_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=168;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT for table `sales_items`
--
ALTER TABLE `sales_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=172;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
