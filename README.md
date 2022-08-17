# node_auth_with_profile
# store authentications
```sql
  USE [auth_with_profile]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[authentications]
	@username NVARCHAR(30),
	@password NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;
	BEGIN
		IF EXISTS (SELECT * FROM dbo.accounts WHERE username = @username)
			BEGIN
				SELECT 0
			END
		ELSE
			BEGIN
				BEGIN TRANSACTION
				INSERT INTO dbo.accounts (username, password)
				VALUES (@username, @password)
				IF @@ERROR > 0
					BEGIN 
						ROLLBACK TRAN
						SELECT -2
					END
				ELSE
					BEGIN
						SELECT @@IDENTITY AS IDENTITY_ID
						COMMIT TRAN
					END
				END
			END
	
END

```
# store manage_profile
```sql
  USE [auth_with_profile]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[manage_profile]
	-- Add the parameters for the stored procedure here
	@id INT,
	@firstName NVARCHAR(50),
	@lastName NVARCHAR(50),
	@displayName NVARCHAR(50),
	@sex INT,
	@phone NVARCHAR(50),
	@account_id INT
AS
BEGIN
	SET NOCOUNT ON;
	IF @id = 0
		BEGIN
			IF EXISTS (SELECT * FROM dbo.profile WHERE account_id = @account_id)
				BEGIN
					SELECT 0
				END
			ELSE
				BEGIN
					BEGIN TRANSACTION
					INSERT INTO dbo.profile (firstName, lastName, displayName, sex, phone, account_id)
					VALUES (@firstName, @lastName, @displayName, @sex, @phone, @account_id)
					IF @@ERROR > 0
						BEGIN
							ROLLBACK TRAN
							SELECT -2
						END 
					ELSE 
						BEGIN
							SELECT @@IDENTITY AS IDENTITY_ID
							COMMIT TRAN
						END
				END
		END
	ELSE
		BEGIN
			BEGIN TRANSACTION
				UPDATE dbo.profile
				SET		firstName = @firstName,
						lastName = @lastName,
						displayName = @displayName,
						sex = @sex,
						phone = @phone
				WHERE id = @id AND account_id = @account_id
				IF @@ERROR > 0
					BEGIN
						ROLLBACK TRAN
						SELECT -2
					END
				ELSE
					BEGIN
						SELECT @id AS IDENTITY_ID
						COMMIT TRAN
					END
		END
END

```
