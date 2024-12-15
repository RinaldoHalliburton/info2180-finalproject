DROP DATABASE IF EXISTS dolphin_crm;
CREATE DATABASE dolphin_crm;
USE dolphin_crm;

CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    telephone VARCHAR(15),
    company VARCHAR(255),
    type VARCHAR(50),
    assigned_to INT,
    created_by INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES Users(id),
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

CREATE TABLE Notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contact_id INT NOT NULL,
    comment TEXT NOT NULL,
    created_by INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES Contacts(id),
    FOREIGN KEY (created_by) REFERENCES Users(id)
);

INSERT INTO Users (firstname, lastname, password, email, role)
VALUES ('Admin', 'User', '$2y$10$.qReoQh1x0YKhb58/DCE.O9VtRAhTuix74GVaQRGiTP9QGWiglNeO', 'admin@project2.com', 'admin');

INSERT INTO Contacts (title, firstname, lastname, email, telephone, company, type, assigned_to, created_by)
VALUES 
('Mr.', 'John', 'Doe', 'john.doe@example.com', '1234567890', 'Acme Corp', 'Sales Lead', 1, 1),
('Ms.', 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Beta Inc', 'Sales Lead', 1, 1),
('Dr.', 'Emily', 'Davis', 'emily.davis@example.com', '1122334455', 'Gamma Ltd', 'Support', 1, 1),
('Mr.', 'Michael', 'Johnson', 'michael.johnson@example.com', '6677889900', 'Delta LLC', 'Support', 1, 1),
('Mrs.', 'Laura', 'Brown', 'laura.brown@example.com', '4433221100', 'Epsilon Co', 'Sales Lead', 1, 1),
('Ms.', 'Sophia', 'Garcia', 'sophia.garcia@example.com', '5566778899', 'Zeta Group', 'Support', 1, 1),
('Dr.', 'James', 'Miller', 'james.miller@example.com', '7788990011', 'Theta LLC', 'Sales Lead', 1, 1),
('Mr.', 'Daniel', 'Wilson', 'daniel.wilson@example.com', '6655443322', 'Iota Enterprises', 'Sales Lead', 1, 1),
('Mrs.', 'Megan', 'Moore', 'megan.moore@example.com', '4455667788', 'Kappa Solutions', 'Support', 1, 1),
('Ms.', 'Anna', 'Taylor', 'anna.taylor@example.com', '2233445566', 'Lambda Industries', 'Support', 1, 1);