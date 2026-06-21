CREATE TABLE IF NOT EXISTS Consent 
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
        status VARCHAR(16) 
            CHARACTER SET ascii COLLATE ascii_bin 
            NOT NULL DEFAULT 'pending',
        updated TIMESTAMP 
            NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        UNIQUE KEY uk_patient_doctor (patientId, doctorId),
        CONSTRAINT fk_consent_patient 
            FOREIGN KEY (patientId) REFERENCES Account(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE,
        CONSTRAINT fk_consent_doctor 
            FOREIGN KEY (doctorId) REFERENCES Account(id) 
            ON DELETE CASCADE 
            ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=ascii COLLATE=ascii_bin;