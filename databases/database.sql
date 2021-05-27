CREATE DATABASE appInvBicis;

USE appInvBicis;

CREATE TABLE IF NOT EXISTS users (
    idUser INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(16) NOT NULL,
    userEmail VARCHAR(100) NOT NULL,
    userPassword VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS clients (
    idClient INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    clientName VARCHAR(16) NOT NULL,
    clientCode VARCHAR(60) NOT NULL,
    clientEmail VARCHAR(60) NOT NULL,
    clientCellphone VARCHAR(60) NOT NULL
);

CREATE TABLE IF NOT EXISTS reparations (
    idReparation INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    repDescription VARCHAR(250) NOT NULL,
    repValor INT(11) NOT NULL,
    userId INT(11),
    clientId INT(11),
    CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users (idUser),
    CONSTRAINT fk_client FOREIGN KEY (clientId) REFERENCES clients (idClient)
);

CREATE TABLE IF NOT EXISTS inventory (
    idBici INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    invName VARCHAR(16) NOT NULL,
    invDescription VARCHAR(250) NOT NULL,
    invModel VARCHAR(200) NOT NULL
);