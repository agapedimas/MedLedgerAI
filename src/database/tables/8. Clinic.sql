CREATE TABLE IF NOT EXISTS Clinic 
    (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(255) COLLATE utf8mb4_bin NOT NULL,
        address TEXT COLLATE utf8mb4_bin,
        phone VARCHAR(32) CHARACTER SET ascii COLLATE ascii_bin,
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id)
    ) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;