var mysql = require('mysql');
var inquirer = require("inquirer");
let currentDepartments = [];
let currentRole = [];
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password", // <- Your password here
    database: "employee_db",
});

function askForAddDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department"
        }
    ]).then(response => {
        const answer1 = response.department[0].toUpperCase();
        let answer2 = response.department.toLowerCase();
        answer2 = answer2.substring(1);
        const answer = answer1 + answer2;

        connection.query("SELECT * FROM department", function (err, res){
            if(err) throw err;
            currentDepartments = []
            res.forEach(result => currentDepartments.push(result.name))
            let foundDepartment = false;
            currentDepartments.forEach(result => {
                console.log(result);
                if(result === answer){
                    foundDepartment = true;
                    console.log("\nSorry this department already exists.\n");
                    return displayMainMenu();
                }
            });

            if (!foundDepartment){
                connection.query("INSERT INTO department SET ?", {
                    name: answer
                }, function (err, res){
                    if(err) throw err;
                    console.log(`\nAdded ${answer}\n`);
                    displayMainMenu();
                });
            }
        });
    });
}

function askForRemoveDepartments(){
    connection.query("SELECT * FROM department", function (err, res){
        if(err) throw err;
        currentDepartments = []
        res.forEach(result => currentDepartments.push(result.name))

        inquirer.prompt([
            {
                type: "list",
                message: "What Department would you like to remove?",
                choices: [...currentDepartments],
                name: "name"
            }
        ]).then(response => {
            const { name } = response;
            connection.query("DELETE FROM department WHERE name=?", [ name ], function(){
                if (err) throw err;
                console.log(`\nRemoved ${name}\n`);
                currentDepartments = [];
                displayMainMenu();
            });
        });
    });
}

function askForAddRole(){
    connection.query("SELECT * FROM department", function (err, res){
        if(err) throw err;
        res.forEach(result => currentDepartments.push(result.name))

        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the role?",
                name: "role"
            },
            {
                type: "number",
                message: "What is the salary for this role?",
                name: "salary"
            },
            {
                type: "list",
                message: "Which department does this role belong to?",
                choices: [...currentDepartments],
                name: "department"
            }
        ]).then(response => {
    
            const { department } = response;
            const { salary } = response;
            const answer1 = response.role[0].toUpperCase();
            let answer2 = response.role.toLowerCase();
            answer2 = answer2.substring(1);
            const role = answer1 + answer2;
            let departmentID;

            for (let i = 0; i < res.length; i++){
                if(department === res[i].name){ departmentID = res[i].id };
            }
    
            connection.query("INSERT INTO role SET ?", {
                title: role,
                salary: salary,
                department_id: departmentID
            }, function (err, res){
                if(err) throw err;
                console.log(`\nAdded ${role}\n`);
                displayMainMenu();
            });
        });
    });
}

function askForRemoveRole(){
    connection.query("SELECT * FROM role", function (err, res){
        if(err) throw err;
        res.forEach(result => currentRole.push(result.title))

        inquirer.prompt([
            {
                type: "list",
                message: "What role would you like to remove?",
                choices: [...currentRole],
                name: "role"
            }
        ]).then(response => {
            const { role } = response;
            connection.query("DELETE FROM role WHERE title=?", [ role ], function(err, res){
                if (err) throw err;
                console.log(res)
                console.log(`\nRemoved ${role}\n`);
                currentRole = [];
                displayMainMenu();
            });
        });
    });
}

function askForUpdateRoleName(){
    connection.query("SELECT * FROM role", function (err, res){
        if(err) throw err;
        res.forEach(result => currentRole.push(result.title))
        inquirer.prompt([
            {
                type: "list",
                message: "What role would you like to update?",
                choices: [...currentRole],
                name: "pickedRole"
            },
            {
                type: "input",
                message: "What would you like to update the role's name to?",
                name: "updatedRole"
            }
        ]).then(response => {
            const { pickedRole, updatedRole } = response;
            currentRole.forEach(role => {
                if(role === pickedRole){
                    connection.query("UPDATE role SET ? WHERE ?", [{title: updatedRole}, {title: pickedRole}], function(err, res){
                        displayMainMenu();
                    });
                };
            });
        });
    });
}

function displayMainMenu(){
    const promptChoices = ["View all Employees",
    "View all Employees by Department",
    "View all Employees by Manager",
    "Add Employee",
    "Remove Employee",
    "Update Employee",
    "Update Employee's Role",
    "Update Employee's Manager",
    "Add Role",
    "Remove Role",
    "Update Role's Name",
    "Update Role's Salary",
    "Update Role's Department",
    "Add Department",
    "Remove Department",
    "Update Department",
    "View Utilized Budget by Department"]
    
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: [...promptChoices],
            name: "choice"
        }
    ]).then(response => {
        const { choice } = response;
        switch(choice){
            case "View all Employees":
                return
            case "View all Employees by Department":
                return
            case "View all Employees by Manager":
                return
            case "Add Employee":
                return
            case "Remove Employee":
                return
            case "Update Employee":
                return
            case "Update Employee's Role":
                return
            case "Update Employee's Manager":
                return
            case "Add Role":
                return askForAddRole();
            case "Remove Role":
                return askForRemoveRole();
            case "Update Role's Name":
                return askForUpdateRoleName();
            case "Update Role's Salary":
                return
            case "Update Role's Department":
                return
            case "Add Department":
                return askForAddDepartment();
            case "Remove Department":
                return askForRemoveDepartments();
            case "Update Department":
                return
            case "View Utilized Budget by Department":
                return
        }
    });
}

connection.connect(function (err){
    if(err) throw err;
    console.log(`Connected as ID ${connection.threadId}`);
    displayMainMenu();
});