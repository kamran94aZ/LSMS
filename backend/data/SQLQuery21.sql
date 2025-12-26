CREATE TABLE AuthChallenges (
    Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    AdminUserId UNIQUEIDENTIFIER NOT NULL,

    Challenge NVARCHAR(512) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,

    CONSTRAINT PK_AuthChallenges PRIMARY KEY (Id),
    CONSTRAINT FK_AuthChallenges_AdminUsers
        FOREIGN KEY (AdminUserId) REFERENCES AdminUsers(Id)
);
