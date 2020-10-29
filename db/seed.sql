INSERT INTO department (name)
VALUES ("Information technology"), 
("Human resources"), 
("Finance"), 
("Saftey"), 
("Quality assurance"), 
("Customer service");

INSERT INTO role (title, salary, department_id)
VALUES("Desktop support", 45000, 1),
("Recruiter", 37000, 2),
("Accountant", 43000, 3),
("Saftey Advisor", 36000, 4),
("QA Advisor", 37000, 5),
("Planner", 32000, 6),
("Sales", 43000, 6),
("IT Support", 51000, 1);


INSERT INTO managers (first_name, last_name, department_id)
VALUES ("Blake", "Brintle", 1),
("Kim", "Barnes", 2),
("Carrie", "Cristensen", 3),
("Jim", "Brookshire", 4),
("Alicia", "Gonzalez", 5),
("Mark", "Barnes", 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Blake", "Brintle", 1, 1),
("Kim", "Barnes", 2, 2),
("Carrie", "Cristensen", 3, 3),
("Jim", "Brookshire", 4, 4),
("Alicia", "Gonzalez", 5, 5),
("Mark", "Barnes", 6, 6),
("Danny", "Meeks", 7, 6),
("Chris", "Chitwood", 8, 1);
