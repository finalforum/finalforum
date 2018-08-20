insert into pending_activation
(
    principal_id,
    activation_code,
    created
)
values
(
    $1,
    $2,
    current_timestamp
)
returning id
