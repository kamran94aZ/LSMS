CREATE TABLE AdminUsers (
    Id UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID(),
    Username NVARCHAR(100) NOT NULL UNIQUE,
  
    SrpSalt NVARCHAR(256) NOT NULL,
    SrpVerifier NVARCHAR(512) NOT NULL,

    Role NVARCHAR(50) NOT NULL,

    ForcePasswordChange BIT NOT NULL DEFAULT 0,
    IsActive BIT NOT NULL DEFAULT 1,

    CreatedAt DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    UpdatedAt DATETIME2 NULL,

    CONSTRAINT PK_AdminUsers PRIMARY KEY (Id)
);

INSERT INTO AdminUsers (
    Username,
    SrpSalt,
    SrpVerifier,
    Role,
    ForcePasswordChange
)
VALUES (
    'admin',
    'BOOTSTRAP',
    'BOOTSTRAP',
    'RootAdmin',
    1
);

