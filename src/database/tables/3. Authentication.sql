CREATE TABLE IF NOT EXISTS Authentication 
    (
        id INT 
            NOT NULL 
            AUTO_INCREMENT, 
        accountId VARCHAR(128) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL, 
        ipAddress VARCHAR(45)
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        time TIMESTAMP 
            NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        CONSTRAINT fk_authentication_account 
            FOREIGN KEY (accountId) REFERENCES Account(id) 
            ON DELETE CASCADE
            ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;