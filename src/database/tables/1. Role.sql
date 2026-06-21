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

    -- Add default roles
    INSERT IGNORE INTO Role (id, name) 
    VALUES (1, 'owner'), (2, 'admin'), (3, 'member');