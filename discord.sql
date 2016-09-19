CREATE DATABASE IF NOT EXISTS `discobot` DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `meta` (
  `id` varchar(45) NOT NULL,
  `steam` varchar(45) DEFAULT NULL,
  `battlenet` varchar(45) DEFAULT NULL,
  `twitch` varchar(45) DEFAULT NULL,
  `youtube` varchar(45) DEFAULT NULL,
  `summonername` varchar(45) DEFAULT NULL,
  `gamertag` varchar(45) DEFAULT NULL,
  `psn` varchar(45) DEFAULT NULL,
  `ds` varchar(255) DEFAULT NULL,
  `nintendo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE IF NOT EXISTS `timeout` (
  `id` varchar(45) NOT NULL DEFAULT '',
  `expires` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
