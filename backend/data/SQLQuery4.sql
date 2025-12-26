CREATE TABLE Logs (
    LogID          INT IDENTITY(1,1) PRIMARY KEY,
    UserID         INT,
    UserName       NVARCHAR(500),
    ActionType     NVARCHAR(50),
    TableName      NVARCHAR(200),
    DocumentID BIGINT,
    DocumentName NVARCHAR(500),
    DocumentTitle NVARCHAR(500),
    DocumentStatus NVARCHAR(200),
    DocumentType NVARCHAR(100),
    DocumentCreated NVARCHAR(200),
    DocumentUpdated NVARCHAR(200),
    CreatedAt      DATETIME NOT NULL DEFAULT(GETDATE()),
    UpdatedAt      DATETIME NOT NULL DEFAULT(GETDATE())
);