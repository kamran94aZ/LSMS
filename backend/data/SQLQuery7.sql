CREATE TABLE dbo.UserRoles (
    UserRoleID BIGINT IDENTITY(1,1) PRIMARY KEY,
    UserID     INT,    
    RoleID     INT,        
    CreatedAt  DATETIME NOT NULL DEFAULT(GETDATE()),
    CreatedBy  NVARCHAR(200) NULL,
    CONSTRAINT FK_UserRoles_Users 
        FOREIGN KEY (UserID) REFERENCES dbo.Users(UserID)
        ON DELETE CASCADE,
    CONSTRAINT FK_UserRoles_Roles
        FOREIGN KEY (RoleID) REFERENCES dbo.Roles(RoleID)
        ON DELETE CASCADE,
    CONSTRAINT UQ_User_Role UNIQUE (UserID, RoleID)
);