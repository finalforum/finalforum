insert into principal_credentials
(
    principal_id,
    password_hash,
    created
)
values
(
    $1,
    $2,
    $3,
)
returning id
