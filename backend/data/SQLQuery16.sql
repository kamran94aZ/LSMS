CREATE TABLE BatchTestResults (
    ResultID INT IDENTITY PRIMARY KEY,
    BatchTestID INT NOT NULL,
    ResultValue DECIMAL(18,4) NULL,
    ResultText NVARCHAR(MAX) NULL,   
    Status NVARCHAR(200) NULL,         
    TestedAt DATETIME DEFAULT GETDATE(),
    TestedBy NVARCHAR(200),
    CONSTRAINT FK_BatchResults_BatchTest
        FOREIGN KEY (BatchTestID) REFERENCES BatchTests(BatchTestID)
);
