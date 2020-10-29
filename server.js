var mysql = require('mysql');
var inquirer = require("inquirer");
let currentDepartments = [];
let currentRole = [];
let currentManagers = [];
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password", // <- Your password here
    database: "employee_db",
});

function clearArrays(){
    currentDepartments = [];
    currentRole = [];
    currentManagers = [];
}

function convertFirstLetterCap(word){
    const answer1 = word[0].toUpperCase();
    let answer2 = word.toLowerCase();
    answer2 = answer2.substring(1);
    return answer1 + answer2;
}

function askForAddDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department"
        }
    ]).then(response => {
        const answer = convertFirstLetterCap(response.department);

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
                    clearArrays()
                    return displayMainMenu();
                }
            });

            if (!foundDepartment){
                connection.query("INSERT INTO department SET ?", {
                    name: answer
                }, function (err, res){
                    if(err) throw err;
                    console.log(`\nAdded ${answer}\n`);
                    clearArrays()
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
                clearArrays()
                displayMainMenu();
            });
        });
    });
}

function askForUpdateDeparment(){
    connection.query("SELECT * FROM department", function (err, res){
        if(err) throw err;
        res.forEach(result => currentDepartments.push(result.name))
        inquirer.prompt([
            {
                type: "list",
                message: "What department would you like to update?",
                choices: [...currentDepartments],
                name: "pickedDeparment"
            },
            {
                type: "input",
                message: "What would you like to update the department's name to?",
                name: "updatedDepartment"
            }
        ]).then(response => {
            const { pickedDeparment } = response;
            const updatedDepartment = convertFirstLetterCap(response.updatedDepartment);

            currentRole.forEach(role => {
                if(role === pickedDeparment){
                    connection.query("UPDATE role SET ? WHERE ?", [
                        { name: updatedDepartment }, 
                        { name: pickedDeparment }
                    ], function(err, res){
                        console.log(`\nUpdated ${pickedDeparment} to department: ${updatedDepartment}\n`);
                        clearArrays()
                        displayMainMenu();
                    });
                };
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
    
            const { department, salary } = response;
            const role = convertFirstLetterCap(response.role);
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
                clearArrays()
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
                console.log(`\nRemoved ${role}\n`);
                currentRole = [];
                clearArrays()
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
            const { pickedRole } = response;
            const updatedRole = convertFirstLetterCap(response.updatedRole);

            currentRole.forEach(role => {
                if(role === pickedRole){
                    connection.query("UPDATE role SET ? WHERE ?", [
                        { title: updatedRole }, 
                        { title: pickedRole }
                    ], function(err, res){
                        console.log(`\nUpdated ${pickedRole} to ${updatedRole}\n`);
                        clearArrays()
                        displayMainMenu();
                    });
                };
            });
        });
    });
}

function askForUpdateRoleSalary(){
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
                type: "number",
                message: "What would you like to update the role's salary to?",
                name: "updatedSalary"
            }
        ]).then(response => {
            const { pickedRole, updatedSalary } = response;

            currentRole.forEach(role => {
                if(role === pickedRole){
                    connection.query("UPDATE role SET ? WHERE ?", [
                        { salary: updatedSalary }, 
                        { title: pickedRole }
                    ], function(err, res){
                        console.log(`\nUpdated ${pickedRole} to ${updatedSalary}\n`);
                        clearArrays()
                        displayMainMenu();
                    });
                };
            });
        });
    });
}

function askForUpdateRoleDepartment(){
    connection.query("SELECT * FROM role", function (err, res){
        if(err) throw err;
        res.forEach(result => currentRole.push(result.title))
        connection.query("SELECT * FROM department", function (err, res){
            if(err) throw err;
            res.forEach(result => currentDepartments.push(result.name))
            inquirer.prompt([
                {
                    type: "list",
                    message: "What role would you like to update?",
                    choices: [...currentRole],
                    name: "pickedRole"
                },
                {
                    type: "list",
                    message: "Which department does this role belong to?",
                    choices: [...currentDepartments],
                    name: "updatedDepartment"
                }
            ]).then(response => {
                const { pickedRole, updatedDepartment } = response;
                let departmentID;
                for (let i = 0; i < res.length; i++){
                    if(updatedDepartment === res[i].name){ departmentID = res[i].id };
                }
                currentRole.forEach(role => {
                    if(role === pickedRole){
                        connection.query("UPDATE role SET ? WHERE ?", [
                            { department_id: departmentID }, 
                            { title: pickedRole }
                        ], function(err, res){
                            console.log(`\nUpdated ${pickedRole} to deparment: ${updatedDepartment}\n`);
                            clearArrays()
                            displayMainMenu();
                        });
                    };
                });
            });
        });
    });
}

function viewAllEmployees(){
    const employeeTable = [];
    const managerTable = [];
    connection.query("SELECT * FROM department", function(err, res){
        if(err) throw err
        res.forEach(department => currentDepartments.push(department));

        connection.query("SELECT * FROM employee", function (err, res){
            if(err) throw err
            res.forEach(employee => employeeTable.push(employee))
            connection.query("SELECT * FROM managers", function(err, res){
                if(err) throw err
                res.forEach(manager => managerTable.push(manager));
                connection.query("SELECT * FROM role", function(err, res){
                    if(err) throw err;
                    for(let j = 0; j < employeeTable.length; j++){
                        for(let i = 0; i < res.length; i++){
                            if(res[i].id === employeeTable[j].role_id){
                                employeeTable[j].role_id = res[i].title;
                                for(let h = 0; h < currentDepartments.length; h++){
                                    if(currentDepartments[h].id === res[i].department_id){
                                        employeeTable[j].department_id = currentDepartments[h].name
                                    }
                                }

                                for(let k = 0; k < managerTable.length; k++){
                                    if(managerTable[k].id === employeeTable[j].manager_id){
                                        employeeTable[j].manager_id = managerTable[k].first_name + " " + managerTable[k].last_name;
                                    }
                                }
                                employeeTable[j].salary = res[i].salary;
                            }
                        }
                    }
                    console.log("\n");
                    console.table(employeeTable);
                    console.log("\n");
                    clearArrays()
                    displayMainMenu();
                });
            })
        });
    });
}

function viewAllEmployeesByDep(){
    const employeeTable = [];
    const managerTable = [];
    connection.query("SELECT * FROM department", function(err, res){
        if(err) throw err
        res.forEach(department => currentDepartments.push(department));

        connection.query("SELECT * FROM employee", function (err, res){
            if(err) throw err
            res.forEach(employee => employeeTable.push(employee))
            connection.query("SELECT * FROM managers", function(err, res){
                if(err) throw err
                res.forEach(manager => managerTable.push(manager));
                connection.query("SELECT * FROM role", function(err, res){
                    if(err) throw err
                    for(let j = 0; j < employeeTable.length; j++){
                        for(let i = 0; i < res.length; i++){
                            if(res[i].id === employeeTable[j].role_id){
                                employeeTable[j].role_id = res[i].title;
                                for(let h = 0; h < currentDepartments.length; h++){
                                    if(currentDepartments[h].id === res[i].department_id){
                                        employeeTable[j].department_id = currentDepartments[h].name
                                    }
                                }

                                for(let k = 0; k < managerTable.length; k++){
                                    if(managerTable[k].id === employeeTable[j].manager_id){
                                        employeeTable[j].manager_id = managerTable[k].first_name + " " + managerTable[k].last_name;
                                    }
                                }
                                employeeTable[j].salary = res[i].salary;
                            }
                        }
                    }

                    inquirer.prompt([
                        {
                            type: "list",
                            message: "What department would you like to filter by?",
                            choices: [...currentDepartments],
                            name: "usersAnwer"
                        },
                    ]).then(response => {
                        const { usersAnwer } = response;
                        const newEmployeeTable = []
                        employeeTable.forEach(department => {
                            if(department.department_id === usersAnwer) {
                                newEmployeeTable.push(department)
                            }
                        })
                        console.log("\n");
                        console.table(newEmployeeTable);
                        console.log("\n");
                        clearArrays()
                        displayMainMenu();
                    })
                });
            })
        });
    });
}

function viewAllEmployeesByMan(){
    const employeeTable = [];
    const managerTable = [];
    connection.query("SELECT * FROM department", function(err, res){
        if(err) throw err
        res.forEach(department => currentDepartments.push(department));

        connection.query("SELECT * FROM employee", function (err, res){
            if(err) throw err
            res.forEach(employee => employeeTable.push(employee))
            connection.query("SELECT * FROM managers", function(err, res){
                if(err) throw err
                res.forEach(manager => managerTable.push(manager));
                let managerList = managerTable.map(manager => manager.first_name + " " + manager.last_name)
                connection.query("SELECT * FROM role", function(err, res){
                    if(err) throw err
                    for(let j = 0; j < employeeTable.length; j++){
                        for(let i = 0; i < res.length; i++){
                            if(res[i].id === employeeTable[j].role_id){
                                employeeTable[j].role_id = res[i].title;
                                for(let h = 0; h < currentDepartments.length; h++){
                                    if(currentDepartments[h].id === res[i].department_id){
                                        employeeTable[j].department_id = currentDepartments[h].name
                                    }
                                }

                                for(let k = 0; k < managerTable.length; k++){
                                    if(managerTable[k].id === employeeTable[j].manager_id){
                                        employeeTable[j].manager_id = managerTable[k].first_name + " " + managerTable[k].last_name;
                                    }
                                }
                                employeeTable[j].salary = res[i].salary;
                            }
                        }
                    }

                    inquirer.prompt([
                        {
                            type: "list",
                            message: "What manager would you like to filter by?",
                            choices: [...managerList],
                            name: "usersAnwer"
                        },
                    ]).then(response => {
                        const { usersAnwer } = response;
                        const newEmployeeTable = []
                        employeeTable.forEach(employee => {
                            if(employee.manager_id === usersAnwer) {
                                newEmployeeTable.push(employee)
                            }
                        })
                        console.log("\n");
                        console.table(newEmployeeTable);
                        console.log("\n");
                        clearArrays()
                        displayMainMenu();
                    })
                });
            })
        });
    });
}

function askForAddEmployee(){
    connection.query("SELECT * FROM role", function (err, res){
        if(err) throw err;
        res.forEach(result => currentRole.push(result))
        let roleList = currentRole.map(role => role.title)
        connection.query("SELECT * FROM managers", function (err, res){
            if(err) throw err;
            res.forEach(result => currentManagers.push(result))
            const managerTable = [];
            res.forEach(result => managerTable.push({name:`${result.first_name} ${result.last_name}`, id: result.id}))
            let managerList = managerTable.map(employee => employee.name)

            inquirer.prompt([
                {
                    type: "input",
                    message: "What is the employee's first name?",
                    name: "firstName"
                },
                {
                    type: "input",
                    message: "What is the employee's last name?",
                    name: "lastName"
                },
                {
                    type: "list",
                    message: "Which role will this user be assigned to?",
                    choices: [...roleList],
                    name: "assignedRole"
                },
                {
                    type: "list",
                    message: "Who is this employee's manager?",
                    choices: [...managerList],
                    name: "assginedManager"
                }
            ]).then(response => {
                const firstName = convertFirstLetterCap(response.firstName);
                const lastName = convertFirstLetterCap(response.lastName);
                const { assignedRole, assginedManager } = response;
                let roleID = null;
                currentRole.forEach(result => {
                    if(assignedRole === result.title){
                        return roleID = result.id;
                    };
                });

                let managerID = null;
                currentManagers.forEach(result => {
                    let name = result.first_name + " " + result.last_name;
                    if(assginedManager === name){
                        return managerID = result.id;
                    };
                });
                
                connection.query("INSERT INTO employee SET ?",[{
                    first_name: firstName,
                    last_name: lastName,
                    role_id: roleID,
                    manager_id: managerID
                }], function(err, res){
                    if(err) throw err
                    console.log(`\nAdd ${firstName} ${lastName} to the employee list.\n`);
                    clearArrays()
                    displayMainMenu();
                });
            });
        });
    });
}

function askForRemoveEmployee(){
    connection.query("SELECT * FROM employee", function (err, res){
        if(err) throw err;
        const employeeTable = [];
        res.forEach(result => employeeTable.push({name:`${result.first_name} ${result.last_name}`, id: result.id}))
        let employeeList = employeeTable.map(employee => employee.name)

        inquirer.prompt([
            {
                type:"list",
                message:"Who would you like to remove?",
                choices: [...employeeList],
                name: "removedEmployee"
            }
        ]).then(response => {
            const { removedEmployee } = response;
            for (let i = 0; i < employeeTable.length; i++){
                if(removedEmployee === employeeTable[i].name){
                    connection.query("DELETE FROM employee WHERE id=?",[employeeTable[i].id], function (err, res){
                        if(err) throw err;
                        console.log(`\nRemoved ${employeeTable[i].name} from the employee list.\n`);
                        clearArrays()
                        displayMainMenu();
                    });
                }
            };
        }); 
    });
}

function updateEmployeeName(){
    connection.query("SELECT * FROM employee", function (err, res){
        if(err) throw err;
        const employeeTable = [];
        res.forEach(result => employeeTable.push({name:`${result.first_name} ${result.last_name}`, id: result.id}))
        let employeeList = employeeTable.map(employee => employee.name)

        inquirer.prompt([
            {
                type:"list",
                message:"Who would you like to update?",
                choices: [...employeeList],
                name: "updatedEmployee"
            },
            {
                type:"input",
                message:"What is the first name?",
                name: "firstName",
            },
            {
                type:"input",
                message:"What is the last name?",
                name: "lastName",
            }
        ]).then(response => {
            const { updatedEmployee } = response;
            const firstName = convertFirstLetterCap(response.firstName);
            const lastName = convertFirstLetterCap(response.lastName);
            for (let i = 0; i < employeeTable.length; i++){
                if(updatedEmployee === employeeTable[i].name){
                    connection.query("UPDATE employee SET first_name=?, last_name=? WHERE id=?",[
                        firstName,
                        lastName,
                        employeeTable[i].id                        
                    ], function (err, res){
                        if(err) throw err;
                        console.log(`\nUpdated ${firstName} ${lastName} from the previous name of ${employeeTable[i].name}\n`);
                        clearArrays()
                        displayMainMenu();
                    });
                }
            };
        }); 
    });
}

function updateEmployeeRole(){
    connection.query("SELECT * FROM employee", function (err, res){
        if(err) throw err;
        const employeeTable = [];
        res.forEach(result => employeeTable.push({name:`${result.first_name} ${result.last_name}`, id: result.id}))
        let employeeList = employeeTable.map(employee => employee.name)

        connection.query("SELECT * FROM role", function (err, res){
            if(err) throw err;
            res.forEach(result => currentRole.push(result.title))
            inquirer.prompt([
                {
                    type:"list",
                    message:"Select the employee you would like to update.",
                    choices: [...employeeList],
                    name: "updatedEmployee"
                },
                {
                    type:"list",
                    message:"Select the role you would like to update to.",
                    choices: [...currentRole],
                    name: "updatedRole"
                }
            ]).then(response => {
                const { updatedEmployee, updatedRole } = response;
                res.forEach(result => {if(updatedRole == result.title){roleID = result.id}})

                for (let i = 0; i < employeeTable.length; i++){
                    if(updatedEmployee === employeeTable[i].name){
                        connection.query("UPDATE employee SET role_id=? WHERE id=?",[
                            roleID,
                            employeeTable[i].id                        
                        ], function (err, res){
                            if(err) throw err;
                            console.log(`\nUpdated ${employeeTable[i].name}'s role to ${updatedRole} \n`);
                            clearArrays()
                            displayMainMenu();
                        });
                    }
                };
            }); 
        });
    });
}

function updateEmployeeManager(){
    connection.query("SELECT * FROM employee", function (err, res){
        if(err) throw err;
        const employeeTable = [];
        res.forEach(result => employeeTable.push({name:`${result.first_name} ${result.last_name}`, id: result.id}))
        let employeeList = employeeTable.map(employee => employee.name)

        connection.query("SELECT * FROM managers", function (err, res){
            if(err) throw err;
            const managersTable = [];
            res.forEach(result => managersTable.push({name:`${result.first_name} ${result.last_name}`, id: result.id}))
            let managersList = managersTable.map(manager => manager.name)
            inquirer.prompt([
                {
                    type:"list",
                    message:"Select the employee you would like to update.",
                    choices: [...employeeList],
                    name: "updatedEmployee"
                },
                {
                    type:"list",
                    message:"Select the role you would like to update to.",
                    choices: [...managersList],
                    name: "updatedManager"
                }
            ]).then(response => {
                const { updatedEmployee, updatedManager } = response;

                managersTable.forEach(result => {if(updatedManager === result.name){managerID = result.id}})

                for (let i = 0; i < employeeTable.length; i++){
                    if(updatedEmployee === employeeTable[i].name){
                        connection.query("UPDATE employee SET manager_id=? WHERE id=?",[
                            managerID,
                            employeeTable[i].id                        
                        ], function (err, res){
                            if(err) throw err;
                            console.log(`\nUpdated ${updatedEmployee}'s manger to ${updatedManager} \n`);
                            clearArrays()
                            displayMainMenu();
                        });
                    }
                };
            }); 
        });
    });
}

function provideBudgetByDep(){
    connection.query("SELECT * FROM department", function (err, res){
        if(err) throw err;
        res.forEach(result => currentDepartments.push(result.name))
        inquirer.prompt([
            {
                type: "list",
                message: "Select a Department",
                choices: [...currentDepartments],
                name: "department"
            }
        ]).then(response => {
            const { department } = response;
            let depID = null;
            for(let i = 0; i < res.length; i++){
                if(department === res[i].name){
                    depID = res[i].id;
                }
            }
            console.log(depID)
            connection.query("SELECT * FROM role WHERE department_id=?", [ depID ], function (err, res){
                if(err) throw err
                clearArrays()
                res.forEach(result => currentRole.push(result))
                connection.query("SELECT * FROM employee", function (err, res){
                    if(err) throw err
                    let roleIDArray = [];
                    res.forEach(employee => roleIDArray.push(employee.role_id));

                    let combinedSalary = 0;
                    for(let i = 0; i < roleIDArray.length; i++){
                        currentRole.forEach(department => {
                            if(department.id === roleIDArray[i]){
                                combinedSalary = combinedSalary + parseInt(department.salary);
                            }
                        })
                    }
                    console.log(`\nThe ${department} department has a Utilized Budget of: $${combinedSalary}\n`)
                    clearArrays()
                    displayMainMenu()
                });
            });
        });
    });
};

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
    "View Utilized Budget by Department",
    "Quit"]
    
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
                return viewAllEmployees();
            case "View all Employees by Department":
                return viewAllEmployeesByDep();
            case "View all Employees by Manager":
                return viewAllEmployeesByMan();
            case "Add Employee":
                return askForAddEmployee();
            case "Remove Employee":
                return askForRemoveEmployee();
            case "Update Employee":
                return updateEmployeeName();
            case "Update Employee's Role":
                return updateEmployeeRole();
            case "Update Employee's Manager":
                return updateEmployeeManager();
            case "Add Role":
                return askForAddRole();
            case "Remove Role":
                return askForRemoveRole();
            case "Update Role's Name":
                return askForUpdateRoleName();
            case "Update Role's Salary":
                return askForUpdateRoleSalary();
            case "Update Role's Department":
                return askForUpdateRoleDepartment();
            case "Add Department":
                return askForAddDepartment();
            case "Remove Department":
                return askForRemoveDepartments();
            case "Update Department":
                return askForUpdateDeparment();
            case "View Utilized Budget by Department":
                return provideBudgetByDep();
            case "Quit":
                connection.end();
        }
    });
}

connection.connect(function (err){
    if(err) throw err;
    console.log(`Connected as ID ${connection.threadId}`);
    displayMainMenu();
});