CREATE TABLE IF NOT EXISTS Referral 
    (
        id INT NOT NULL AUTO_INCREMENT,
        patientId VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        doctorId VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin NOT NULL,
        clinicId INT NOT NULL,
        chatHistoryId INT,
        aiReason TEXT COLLATE utf8mb4_bin NOT NULL,
        status VARCHAR(16) CHARACTER SET ascii COLLATE ascii_bin NOT NULL DEFAULT 'suggested',
        created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),
        CONSTRAINT fk_referral_patient 
            FOREIGN KEY (patientId) REFERENCES Account(id) 
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_referral_doctor 
            FOREIGN KEY (doctorId) REFERENCES Account(id) 
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_referral_clinic 
            FOREIGN KEY (clinicId) REFERENCES Clinic(id) 
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_referral_chat 
            FOREIGN KEY (chatHistoryId) REFERENCES ChatHistory(id) 
            ON DELETE SET NULL ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;