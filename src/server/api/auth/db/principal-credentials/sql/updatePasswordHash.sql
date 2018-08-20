update principal_credentials
set    password_hash = $2
where  id = $1
