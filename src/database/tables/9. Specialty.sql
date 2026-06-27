CREATE TABLE IF NOT EXISTS Specialty 
    (
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(64) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY name (name)
    ) 
ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;