CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    UserName NVARCHAR(500),
    FullName NVARCHAR(500),
    JobTitle NVARCHAR(200),
    DocumentID INT,
    IsActive  BIT NOT NULL DEFAULT(1),
    CreatedAt DATETIME NOT NULL DEFAULT(GETDATE()),
    UpdatedAt DATETIME NULL,
)