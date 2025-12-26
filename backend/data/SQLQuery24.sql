CREATE INDEX IX_AdminUsers_Username ON AdminUsers(Username);
CREATE INDEX IX_AdminSessions_User ON AdminSessions(AdminUserId);
CREATE INDEX IX_AuthChallenges_Expiry ON AuthChallenges(ExpiresAt);
CREATE INDEX IX_AuditLogs_Time ON AuditLogs(CreatedAt);
