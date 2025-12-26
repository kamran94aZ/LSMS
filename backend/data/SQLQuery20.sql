CREATE TABLE AdminSessions (
    Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    AdminUserId UNIQUEIDENTIFIER NOT NULL,

    JwtId NVARCHAR(200) NOT NULL,
    IssuedAt DATETIME2 NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,

    IpAddress NVARCHAR(50) NULL,
    UserAgent NVARCHAR(500) NULL,

    IsRevoked BIT NOT NULL DEFAULT 0,

    CONSTRAINT PK_AdminSessions PRIMARY KEY (Id),
    CONSTRAINT FK_AdminSessions_AdminUsers
        FOREIGN KEY (AdminUserId) REFERENCES AdminUsers(Id)
);
