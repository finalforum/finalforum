insert into pending_reset
(
    principal_id,
    reset_code,
    created
)
values
(
    $1,
    $2,
    current_timestamp
)
returning id
