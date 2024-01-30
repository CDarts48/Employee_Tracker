// Include packages needed for this application
const mysql = require("mysql2");
const inquirer = require("inquirer");

// const cTable = require('console.table');

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "PlanetExpress",
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
      "View employees by department",
      "Delete Department",
      "Delete Role",
      "Delete Employee",
      "View the total utilized budget of a department",
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
    case "Add Department":
      // Create the Departments table
      connection.query;
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
          promptManager();
        });
      break;
    case "Add Role":
      // Prompt the user for the role's title, salary, and department ID
      connection.query;
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
            name: "department_id",
            type: "input",
            message: "Enter the ID of the department that the role belongs to:",
          },
        ])
        .then((answers) => {
          // Insert the new role into the database
          connection.query(
            "INSERT INTO Roles (title, salary, department_id) VALUES (?, ?, ?)",
            [answers.title, answers.salary, answers.department_id],
            function (error) {
              if (error) throw error;
              console.log("Role added successfully!");
              promptManager();
            }
          );
        });
      break;

    case "Add Employee":
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
            name: "role_id",
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
            "INSERT INTO Employees (first_name, last_name, role_id, managerID) VALUES (?, ?, ?, ?)",
            [
              answers.first_name,
              answers.last_name,
              answers.role_id,
              answers.managerID || null,
            ],
            function (error) {
              if (error) throw error;
              console.log("Employee added successfully!");
              promptManager();
            }
          );
        });
      break;

    case "Update an Employees' Role":
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
            "UPDATE Employees SET role_id = ? WHERE EmployeeID = ?",
            [answers.newRoleID, answers.employeeID],
            function (error) {
              if (error) throw error;
              console.log("Employee's role updated successfully!");
              promptManager();
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
            function (error) {
              if (error) throw error;
              console.log("Employee's manager updated successfully!");
              promptManager();
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
              promptManager();
            }
          );
        });
      break;
    case "View employees by department":
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
            "SELECT * FROM employees JOIN roles ON employees.role_id = roles.role_id WHERE roles.department_id = ?",
            [answers.departmentID],
            function (error, results) {
              if (error) throw error;
              // Display the results in a table
              console.table(results);
              promptManager();
            }
          );
        });
      break;
    case "Delete Department":
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
            function (error) {
              if (error) throw error;
              console.log("Department deleted successfully!");
              promptManager();
            }
          );
        });
      break;

    case "Delete Role":
      // Prompt the user for the role's ID
      inquirer
        .prompt([
          {
            name: "role_id",
            type: "input",
            message: "Enter the ID of the role you want to delete:",
          },
        ])
        .then((answers) => {
          // Delete the role from the database
          connection.query(
            "DELETE FROM Roles WHERE role_id = ?",
            [answers.role_id],
            function (error) {
              if (error) throw error;
              console.log("Role deleted successfully!");
              promptManager();
            }
          );
        });
      break;

    case "Delete Employee":
      // Prompt the user for the employee's ID
      inquirer
        .prompt([
          {
            name: "EmployeeID",
            type: "input",
            message: "Enter the ID of the employee you want to delete:",
          },
        ])
        .then((answers) => {
          // Delete the employee from the database
          connection.query(
            "DELETE FROM Employees WHERE EmployeeID = ?",
            [answers.EmployeeID],
            function (error, results) {
              if (error) throw error;
              console.log("Employee deleted successfully!");
              promptManager();
            }
          );
        });
      break;
    case "View the total utilized budget of a department":
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
            "SELECT SUM(Salary) as totalSalary FROM Employees JOIN roles ON Employees.role_id = roles.role_id WHERE roles.department_id = ?",
            [answers.departmentID],
            function (error, results) {
              if (error) throw error;
              // Display the total salary
              console.log(
                "Total utilized budget of the department: " +
                  results[0].totalSalary
              );
              promptManager();
            }
          );
        });
      break;
    case "Exit":
      console.log("Exiting...");
      process.exit(); // Exit the program
    default:
  }
}
promptManager();
