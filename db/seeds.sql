-- Insert sample data
INSERT INTO Departments (DepartmentName)
VALUES
('Delivery'),
('Engineering'),
('Management'),
('Medical'),
('Maintenance'),
('Intergalactic Relations'),
('Entertainment');

-- Insert values into role
INSERT INTO Roles (title, role_id, department_id, salary)
VALUES
('Delivery Boy', 1, 1, 35000.00),
('Captain', 2, 2, 80000.00),
('Bending Unit', 3, 2, 50000.00),
('CEO', 4, 3, 120000.00),
('Intern', 5, 3, 30000.00),
('Bureaucrat', 6, 3, 75000.00),
('Decapodian', 7, 4, 45000.00),
('Janitor', 8, 5, 40000.00),
('Nacirema Ambassador', 9, 6, 0.00),
('Chief Infernal Revenue Officer', 10, 7, 66666.66);

-- Insert values into employee
INSERT INTO Employees (EmployeeID, first_name, last_name, role_id, ManagerID)
VALUES
(1, 'Philip', 'Fry', 1, 2),
(2, 'Turanga', 'Leela', 2, 4),
(3, 'Bender', 'Rodriguez', 3, 2),
(4, 'Hubert', 'Farnsworth', 4, 0),
(5, 'Amy', 'Wong', 5, 4),
(6, 'Hermes', 'Conrad', 6, 4),
(7, 'Zoidberg', 'John', 7, 6),
(8, 'Scruffy', 'Scruffington', 8, 6),
(9, 'Nibbler', NULL, 9, 1),
(10, 'Robot', 'Devil', 10, 0);