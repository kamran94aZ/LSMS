CREATE TABLE MaterialSpecifications (
    SpecID INT IDENTITY PRIMARY KEY,
    MaterialID INT NOT NULL,
    TestID INT NOT NULL,
    MinValue DECIMAL(18,4) NULL,
    MaxValue DECIMAL(18,4) NULL,
    TargetValue DECIMAL(18,4) NULL,
    IsMandatory BIT DEFAULT 1,
    CONSTRAINT FK_Spec_Material 
        FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID),
    CONSTRAINT FK_Spec_Test 
        FOREIGN KEY (TestID) REFERENCES Tests(TestID)
);
