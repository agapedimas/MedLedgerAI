CREATE TABLE IF NOT EXISTS AccessLog 
    (
        id INT 
            NOT NULL 
            AUTO_INCREMENT,
        recordId INT 
            NOT NULL,
        accessedBy VARCHAR(128) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        ipAddress VARCHAR(45)
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        action VARCHAR(32) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        time TIMESTAMP 
            NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        CONSTRAINT fk_accesslog_record 
            FOREIGN KEY (recordId) REFERENCES MedicalRecord(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE,
        CONSTRAINT fk_accesslog_account 
            FOREIGN KEY (accessedBy) REFERENCES Account(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;