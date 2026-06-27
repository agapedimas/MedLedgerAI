CREATE TABLE IF NOT EXISTS Role 
    (
        id INT 
            NOT NULL
            AUTO_INCREMENT,
        name VARCHAR(16) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,

        PRIMARY KEY (id),
        UNIQUE KEY name (name)
    ) 
ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;

    -- Add default system roles including medical personnel and patients
    INSERT IGNORE INTO Role (id, name) 
    VALUES (1, 'doctor'), (2, 'patient');