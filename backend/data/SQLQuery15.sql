CREATE TABLE BatchTests (
    BatchTestID INT IDENTITY PRIMARY KEY,
    BatchID INT NOT NULL,
    TestID INT NOT NULL,
    Required BIT DEFAULT 1,
    Status NVARCHAR(20) DEFAULT 'Pending', 
    CONSTRAINT FK_BatchTests_Batch 
        FOREIGN KEY (BatchID) REFERENCES Batches(BatchID),
    CONSTRAINT FK_BatchTests_Test 
        FOREIGN KEY (TestID) REFERENCES Tests(TestID)
);
