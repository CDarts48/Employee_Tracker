-- Drop PlanetExpress database if it exists
DROP DATABASE IF EXISTS PlanetExpress;

-- Create PlanetExpress database
CREATE DATABASE IF NOT EXISTS PlanetExpress;

-- Use the PlanetExpress database
USE PlanetExpress;

-- Create Departments table
CREATE TABLE IF NOT EXISTS Departments (
    DepartmentID INT AUTO_INCREMENT PRIMARY KEY,
    DepartmentName VARCHAR(30) NOT NULL
);


INSERT INTO Departments (DepartmentName) VALUES (?)

SELECT * FROM Departments;

-- Create Roles table
CREATE TABLE IF NOT EXISTS Roles (
    title VARCHAR(30) NOT NULL,   
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    department_id INT,
    salary DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES Departments(DepartmentID)
);

SELECT * FROM Roles;

-- Create Employees table
CREATE TABLE IF NOT EXISTS Employees (
    EmployeeID INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    role_id INT,
    managerID INT,
    FOREIGN KEY (role_id) 
    REFERENCES Roles(role_id)
);

-- Query to select Employees data
SELECT * FROM Employees;