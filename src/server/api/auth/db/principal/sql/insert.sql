insert into principal
(
    username,
    email_address,
    active,
    created
)
values
(
    $1,
    $2,
    true,
    current_timestamp
)
returning id
