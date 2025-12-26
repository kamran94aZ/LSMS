CREATE TABLE Batches (
    BatchID INT IDENTITY PRIMARY KEY,
    SAPBatchNo NVARCHAR(50) NOT NULL,
    MaterialID INT NOT NULL,
    ProductionDate DATE,
    Status NVARCHAR(30) DEFAULT 'Pending',  
    CONSTRAINT FK_Batch_Material 
        FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID)
);
