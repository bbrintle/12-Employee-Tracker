create database employee_db;
use employee_db;

create table employee(
	id INT NOT NULL AUTO_INCREMENT,
    first_name varchar(30),
    last_name varchar(30),
    role_id int,
    manager_id int,
    PRIMARY KEY (id)
);

create table role(
	id INT NOT NULL AUTO_INCREMENT,
    title varchar(30),
    salary dec,
    department_id int,
    primary key (id)
);

create table department(
	id INT NOT NULL AUTO_INCREMENT,
    name varchar(30),
    primary key (id)
);