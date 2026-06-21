CREATE TABLE IF NOT EXISTS MedicalRecord 
    (
        id INT 
            NOT NULL 
            AUTO_INCREMENT,
        patientId VARCHAR(128) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        doctorId VARCHAR(128) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        title VARCHAR(255) 
            COLLATE utf8mb4_bin 
            NOT NULL,
        fileUrl VARCHAR(512) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL,
        aiSummary TEXT 
            COLLATE utf8mb4_bin,
        blockchainHash VARCHAR(64) 
            CHARACTER SET ascii COLLATE ascii_bin,
        created TIMESTAMP 
            NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        CONSTRAINT fk_medicalrecord_patient 
            FOREIGN KEY (patientId) REFERENCES Account(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE,
        CONSTRAINT fk_medicalrecord_doctor 
            FOREIGN KEY (doctorId) REFERENCES Account(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;