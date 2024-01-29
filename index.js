// Include packages needed for this application
const mysql = require("mysql2");
const inquirer = require("inquirer");

// const cTable = require('console.table');

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "planetExpress",
});
connection.connect(function (err) {
  if (err) {
    console.error("Error connecting: " + err.stack);
    return;
  }

  console.log("Connected as id " + connection.threadId);
});

const questions = [
  {
    type: "list",
    name: "menu",
    message: "What would you like to do?",
    choices: [
      "View all Departments",
      "View all Roles",
      "View all Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update an Employees' Role",
      "Update employee manager",
      "View employees by manager",
      "Delete Department",
      "Delete Role",
      "Delete Employee",
      "View the total utilized budget of a department",
      "View total utilized budget of an employee", // Add this line
      "Exit",
    ],
  },
];

async function promptManager() {
  const answers = await inquirer.prompt(questions);
  switch (answers.menu) {
    case "View all Departments":
      connection.query("SELECT * FROM Departments", function (error, results) {
        if (error) throw error;
        console.table(results);
        // Call promptManager() here, inside the callback, to ensure it doesn't run until after the query has finished
        promptManager();
      });
      break;
    case "View all Roles":
      connection.query("SELECT * FROM Roles", function (error, results) {
        if (error) throw error;
        console.table(results);
        promptManager();
      });
      break;
    case "View all Employees":
      connection.query("SELECT * FROM Employees", function (error, results) {
        if (error) throw error;
        console.table(results);
        promptManager();
      });
      break;
    case "Add a Department":
      // Create the Departments table
      connection.query(
        "CREATE TABLE IF NOT EXISTS Departments (DepartmentID INT AUTO_INCREMENT PRIMARY KEY, DepartmentName VARCHAR(30) NOT NULL)",
        function (error) {
          if (error) throw error;
          console.log("Departments table created successfully!");
        }
      );
      // Insert a new department into the Departments table
      inquirer
        .prompt([
          {
            type: "input",
            name: "DepartmentName",
            message: "Enter the name of the new Department:",
          },
        ])
        .then((answers) => {
          connection.query(
            "INSERT INTO Departments (DepartmentName) VALUES (?)",
            [answers.DepartmentName],
            function (error) {
              if (error) throw error;
              console.log("Department added successfully!");
            }
          );
        });
      break;
    case "Add a role":
      // Prompt the user for the role's title, salary, and department ID
      inquirer
        .prompt([
          {
            name: "title",
            type: "input",
            message: "Enter the title of the role:",
          },
          {
            name: "salary",
            type: "input",
            message: "Enter the salary for the role:",
          },
          {
            name: "departmentID",
            type: "input",
            message: "Enter the ID of the department that the role belongs to:",
          },
        ])
        .then((answers) => {
          // Insert the new role into the database
          connection.query(
            "INSERT INTO roles (Title, Salary, DepartmentID) VALUES (?, ?, ?)",
            [answers.title, answers.salary, answers.departmentID],
            function (error, results) {
              if (error) throw error;
              console.log("Role added successfully!");
            }
          );
        });
      break;

    case "Add a employee":
      // Prompt the user for the employee's first name, last name, role ID, and manager ID
      inquirer
        .prompt([
          {
            name: "first_name",
            type: "input",
            message: "Enter the employee's first name:",
          },
          {
            name: "last_name",
            type: "input",
            message: "Enter the employee's last name:",
          },
          {
            name: "roleID",
            type: "input",
            message: "Enter the employee's role ID:",
          },
          {
            name: "managerID",
            type: "input",
            message: "Enter the employee's manager ID (optional):",
            default: null, // Default to null if no manager ID is provided
          },
        ])
        .then((answers) => {
          // Insert the new employee into the database
          connection.query(
            "INSERT INTO Employees (first_name, last_name, RoleID, ManagerID) VALUES (?, ?, ?, ?)",
            [
              answers.first_name,
              answers.last_name,
              answers.roleID,
              answers.managerID || null,
            ],
            function (error, results) {
              if (error) throw error;
              console.log("Employee added successfully!");
            }
          );
        });
      break;

    case "Update an employee role":
      // Prompt the user for the employee's ID and the new role ID
      inquirer
        .prompt([
          {
            name: "employeeID",
            type: "input",
            message: "Enter the ID of the employee you want to update:",
          },
          {
            name: "newRoleID",
            type: "input",
            message: "Enter the new role ID for the employee:",
          },
        ])
        .then((answers) => {
          // Update the employee in the database
          connection.query(
            "UPDATE Employees SET RoleID = ? WHERE EmployeeID = ?",
            [answers.newRoleID, answers.employeeID],
            function (error, results) {
              if (error) throw error;
              console.log("Employee's role updated successfully!");
            }
          );
        });
      break;
    case "Update employee manager":
      // Prompt the user for the employee's ID and the new manager's ID
      inquirer
        .prompt([
          {
            name: "employeeID",
            type: "input",
            message:
              "Enter the ID of the employee whose manager you want to update:",
          },
          {
            name: "newManagerID",
            type: "input",
            message: "Enter the new manager's ID:",
          },
        ])
        .then((answers) => {
          // Update the employee's manager in the database
          connection.query(
            "UPDATE Employees SET ManagerID = ? WHERE EmployeeID = ?",
            [answers.newManagerID, answers.employeeID],
            function (error, results) {
              if (error) throw error;
              console.log("Employee's manager updated successfully!");
            }
          );
        });
      break;
    case "View employees by manager":
      // Prompt the user for the manager's ID
      inquirer
        .prompt([
          {
            name: "managerID",
            type: "input",
            message: "Enter the ID of the manager:",
          },
        ])
        .then((answers) => {
          // Select the employees managed by the specified manager from the database
          connection.query(
            "SELECT * FROM Employees WHERE ManagerID = ?",
            [answers.managerID],
            function (error, results) {
              if (error) throw error;
              // Display the results in a table
              console.table(results);
            }
          );
        });
      break;
    case "View employees by department":
      // Prompt the user for the department's ID
      inquirer
        .prompt([
          {
            name: "departmentID",
            type: "input",
            message: "Enter the ID of the department:",
          },
        ])
        .then((answers) => {
          // Select the employees in the specified department from the database
          connection.query(
            "SELECT Employees.* FROM Employees JOIN roles ON Employees.RoleID = roles.RoleID WHERE roles.DepartmentID = ?",
            [answers.departmentID],
            function (error, results) {
              if (error) throw error;
              // Display the results in a table
              console.table(results);
            }
          );
        });
      break;
    case "Delete a department":
      // Prompt the user for the department's ID
      inquirer
        .prompt([
          {
            name: "departmentID",
            type: "input",
            message: "Enter the ID of the department you want to delete:",
          },
        ])
        .then((answers) => {
          // Delete the department from the database
          connection.query(
            "DELETE FROM Departments WHERE DepartmentID = ?",
            [answers.departmentID],
            function (error, results) {
              if (error) throw error;
              console.log("Department deleted successfully!");
            }
          );
        });
      break;

    case "Delete a role":
      // Prompt the user for the role's ID
      inquirer
        .prompt([
          {
            name: "roleID",
            type: "input",
            message: "Enter the ID of the role you want to delete:",
          },
        ])
        .then((answers) => {
          // Delete the role from the database
          connection.query(
            "DELETE FROM roles WHERE RoleID = ?",
            [answers.roleID],
            function (error, results) {
              if (error) throw error;
              console.log("Role deleted successfully!");
            }
          );
        });
      break;

    case "Delete an employee":
      // Prompt the user for the employee's ID
      inquirer
        .prompt([
          {
            name: "employeeID",
            type: "input",
            message: "Enter the ID of the employee you want to delete:",
          },
        ])
        .then((answers) => {
          // Delete the employee from the database
          connection.query(
            "DELETE FROM Employees WHERE EmployeeID = ?",
            [answers.employeeID],
            function (error, results) {
              if (error) throw error;
              console.log("Employee deleted successfully!");
            }
          );
        });
      break;
    case "View total utilized budget of a department":
      // Prompt the user for the department's ID
      inquirer
        .prompt([
          {
            name: "departmentID",
            type: "input",
            message: "Enter the ID of the department:",
          },
        ])
        .then((answers) => {
          // Calculate the total salary of all employees in the specified department
          connection.query(
            "SELECT SUM(Salary) as totalSalary FROM Employees JOIN roles ON Employees.RoleID = roles.RoleID WHERE roles.DepartmentID = ?",
            [answers.departmentID],
            function (error, results) {
              if (error) throw error;
              // Display the total salary
              console.log(
                "Total utilized budget of the department: " +
                  results[0].totalSalary
              );
            }
          );
        });
      break;
    case "View total utilized budget of an employee":
      // Prompt the user for the employee's ID
      inquirer
        .prompt([
          {
            name: "employeeID",
            type: "input",
            message: "Enter the ID of the employee:",
          },
        ])
        .then((answers) => {
          // Calculate the salary of the selected employee
          connection.query(
            "SELECT Salary FROM Employees JOIN roles ON Employees.RoleID = roles.RoleID WHERE Employees.EmployeeID = ?",
            [answers.employeeID],
            function (error, results) {
              if (error) throw error;
              // Store the salary of the selected employee
              let employeeSalary = results[0].Salary;

              // Calculate the total salary of all employees
              connection.query(
                "SELECT SUM(Salary) as totalSalary FROM Employees JOIN roles ON Employees.RoleID = roles.RoleID",
                function (error, results) {
                  if (error) throw error;
                  // Store the total salary of all employees
                  let totalSalary = results[0].totalSalary;

                  // Calculate the percentage of the total budget utilized by the selected employee
                  let percentage = (employeeSalary / totalSalary) * 100;

                  // Display the percentage
                  console.log(
                    "Total utilized budget of the employee: " +
                      percentage.toFixed(2) +
                      "%"
                  );
                }
              );
            }
          );
        });
      break;
    case "View department budget as part of total budget":
      // Prompt the user for the department's ID
      inquirer
        .prompt([
          {
            name: "departmentID",
            type: "input",
            message: "Enter the ID of the department:",
          },
        ])
        .then((answers) => {
          // Calculate the total salary of all employees in the specified department
          connection.query(
            "SELECT SUM(Salary) as DepartmentSalary FROM Employees JOIN roles ON Employees.RoleID = roles.RoleID WHERE roles.DepartmentID = ?",
            [answers.departmentID],
            function (error, results) {
              if (error) throw error;
              // Store the total salary of all employees in the department
              let DepartmentSalary = results[0].departmentSalary;

              // Calculate the total salary of all employees
              connection.query(
                "SELECT SUM(Salary) as totalSalary FROM Employees JOIN roles ON Employees.RoleID = roles.RoleID",
                function (error, results) {
                  if (error) throw error;
                  // Store the total salary of all employees
                  let totalSalary = results[0].totalSalary;

                  // Calculate the percentage of the total budget utilized by the department
                  let percentage = (DepartmentSalary / totalSalary) * 100;

                  // Display the percentage
                  console.log(
                    "Total utilized budget of the department: " +
                      percentage.toFixed(2) +
                      "%"
                  );
                }
              );
            }
          );
        });
      break;
  }
}
promptManager();
