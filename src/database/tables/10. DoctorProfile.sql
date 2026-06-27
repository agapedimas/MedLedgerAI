CREATE TABLE IF NOT EXISTS DoctorProfile 
    (
        accountId VARCHAR(128) CHARACTER SET ascii COLLATE ascii_bin PRIMARY KEY,
        clinicId INT NOT NULL,
        specialtyId INT NOT NULL,
        experienceYears INT DEFAULT 0,

        CONSTRAINT fk_doctorprofile_account 
            FOREIGN KEY (accountId) REFERENCES Account(id) 
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_doctorprofile_clinic 
            FOREIGN KEY (clinicId) REFERENCES Clinic(id) 
            ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_doctorprofile_specialty 
            FOREIGN KEY (specialtyId) REFERENCES Specialty(id) 
            ON DELETE CASCADE ON UPDATE CASCADE
    ) 
ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;