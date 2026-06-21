CREATE TABLE IF NOT EXISTS ChatHistory 
    (
        id INT 
            NOT NULL 
            AUTO_INCREMENT,
        patientId VARCHAR(128) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        sender VARCHAR(16) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        message TEXT 
            COLLATE utf8mb4_bin 
            NOT NULL,
        time TIMESTAMP 
            NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        CONSTRAINT fk_chathistory_patient 
            FOREIGN KEY (patientId) REFERENCES Account(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;