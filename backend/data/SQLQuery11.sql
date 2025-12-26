CREATE TABLE Tests (
    TestID INT IDENTITY PRIMARY KEY,
    TestName NVARCHAR(500) NOT NULL,        
    CategoryID INT NOT NULL,
    UnitID INT NULL,
    Method NVARCHAR(100),                   
    IsActive BIT DEFAULT 1,
    CONSTRAINT FK_Tests_Category
        FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID),
    CONSTRAINT FK_Tests_Units
        FOREIGN KEY (UnitID) REFERENCES Units(UnitID)
);
