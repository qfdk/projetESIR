## Rasperry Pi live streaming

[![BuildStatus](https://travis-ci.org/qfdk/projetESIR.svg?branch=master)](https://travis-ci.org/qfdk/projetESIR)
[![Platform](https://img.shields.io/badge/platform-Linux,%20Raspberry-green.svg?style=flat)](https://qfdk.me) 
[![License](https://img.shields.io/badge/license-New%20BSD-yellow.svg?style=flat)](LICENSE)

## Introduction

Dans le cadre de notre formation d'ingénieur, nous avons eu l'opportunité de réaliser un projet en deuxième année. Les enseignants Johann Bourcier et Olivier Barais nous ont proposé trois projets et notre choix s'est porté sur "Utiliser un ensemble de Raspberry Pi pour assembler, enregistrer, encoder et diffuser un ensemble de flux vidéos enregistrés via des caméras". Ce projet a été l'occasion de rassembler une équipe de 10 élèves ingénieurs et d'expérimenter les enseignements appris tout au long de notre formation (notamment en ce qui concerne l'agilité mais également sur les technologies que nous avons apprises).

## Portée du projet

Comme dit précédemment, nous utilisons un ensemble de Raspberry Pi dans le but de réaliser du streaming vidéo via des PiCaméra. L'idée est d'utiliser un équipement à faible coût pour permettre de suivre des cours à distance ou de permettre de la surveillance de salles. Pour faire fonctionner ce projet il vous faut:
- Un Raspberry Pi
- Une PiCamera
- Des machines virtuelles permettant la redirection

## Les différentes parties

- [中文版(La version chinoise va continuer à developper)](https://github.com/qfdk/NNLLS/)

- [Rasberry (Caméra&Machine)](https://github.com/qfdk/projetESIR/tree/master/Raspberry)

- [Linux (SmartPush + API)](https://github.com/qfdk/projetESIR/tree/master/Linux)
 
- [Web (Client)](https://github.com/qfdk/projetESIR/tree/master/Web)

## SQL

```
CREATE TABLE IF NOT EXISTS `login_web` (
  `nom` varchar(40) DEFAULT NULL,
  `prenom` varchar(40) DEFAULT NULL,
  `identifiant` varchar(40) NOT NULL,
  `mdp` varchar(40) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_locked` int(11) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

```

## License Apache 2
World is powered by solitude
![img-source-from-https://github.com/docker/dockercraft](https://github.com/docker/dockercraft/raw/master/docs/img/contribute.png?raw=true)
# spark-abd
