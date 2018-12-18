DROP DATABASE IF EXISTS tracker;

CREATE DATABASE tracker;

USE tracker;

CREATE TABLE users (
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(120),
PRIMARY KEY id
);

CREATE TABLE tasks (
id INT NOT NULL AUTO_INCREMENT,
taskDate DATE NOT NULL,
duration INT NOT NULL,
subject VARCHAR(50),
notes VARCHAR(200),
PRIMARY KEY id
);