CREATE TABLE Documents (
    DocumentID BIGINT IDENTITY(1,1) PRIMARY KEY,
    DocumentName NVARCHAR(500),
    DocumentTitle NVARCHAR(500),
    DocumentStatus NVARCHAR(200),
    DocumentType NVARCHAR(100),
    DocumentCreated NVARCHAR(200),
    DocumentUpdated NVARCHAR(200)
)