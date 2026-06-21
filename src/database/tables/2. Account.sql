CREATE TABLE IF NOT EXISTS Account 
    (
        id VARCHAR(128) 
            CHARACTER SET ascii COLLATE ascii_bin 
            PRIMARY KEY, 
        email VARCHAR(128)
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL
            UNIQUE KEY, 
        fullname VARCHAR(255) 
            COLLATE utf8mb4_bin, 
        password VARCHAR(255) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL, 
        created TIMESTAMP 
            NOT NULL DEFAULT CURRENT_TIMESTAMP, 
        roleId INT
            NOT NULL,
        pictureId VARCHAR(255),
            
        CONSTRAINT fk_role_user 
            FOREIGN KEY (role) REFERENCES Role(id) 
            ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;


CREATE OR REPLACE VIEW AccountView AS
SELECT
    id, 
    email, 
    fullname, 
    created, 
    Role.name AS role, 
    pictureId
FROM
    Account
JOIN
    Role ON Role.id = Account.roleId;
