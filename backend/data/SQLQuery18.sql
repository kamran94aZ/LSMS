CREATE TABLE AuditLog (
    LogID INT IDENTITY PRIMARY KEY,
    TableName NVARCHAR(200),
    RecordID INT,
    Action NVARCHAR(50),            
    OldValue NVARCHAR(MAX),
    NewValue NVARCHAR(MAX),
    ChangedAt DATETIME DEFAULT GETDATE(),
    ChangedBy NVARCHAR(100)
);
